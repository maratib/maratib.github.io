---
title: Flask Microservices
slug: guides/python/flask-microservices
description: Flask Microservices
sidebar:
  order: 4
---

**Microservices Architecture Overview**

We'll create three main services:

1. **Auth Service** - Handles authentication and JWT
2. **User Service** - Manages user data and profiles
3. **API Gateway** - Routes requests to appropriate services

## 📁 Project Structure

```
flask-microservices/
├── docker-compose.yml
├── api-gateway/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app.py
├── auth-service/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app.py
├── user-service/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app.py
└── shared/
    └── database.py
```

## 1. Docker Setup & Configuration

### Root `docker-compose.yml`

```yaml
version: "3.8"

services:
  # MySQL Database
  mysql-db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: flask_microservices
      MYSQL_USER: flaskuser
      MYSQL_PASSWORD: flaskpass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - flask-network

  # Redis for caching and session management
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    networks:
      - flask-network

  # Auth Service
  auth-service:
    build: ./auth-service
    ports:
      - "5001:5000"
    environment:
      - DATABASE_URL=mysql+pymysql://flaskuser:flaskpass@mysql-db:3306/flask_microservices
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET_KEY=your-super-secret-jwt-key-here
    depends_on:
      - mysql-db
      - redis
    networks:
      - flask-network

  # User Service
  user-service:
    build: ./user-service
    ports:
      - "5002:5000"
    environment:
      - DATABASE_URL=mysql+pymysql://flaskuser:flaskpass@mysql-db:3306/flask_microservices
      - AUTH_SERVICE_URL=http://auth-service:5000
    depends_on:
      - mysql-db
      - auth-service
    networks:
      - flask-network

  # API Gateway
  api-gateway:
    build: ./api-gateway
    ports:
      - "8000:8000"
    environment:
      - AUTH_SERVICE_URL=http://auth-service:5000
      - USER_SERVICE_URL=http://user-service:5000
    depends_on:
      - auth-service
      - user-service
    networks:
      - flask-network

volumes:
  mysql_data:

networks:
  flask-network:
    driver: bridge
```

## 2. Shared Database Configuration

### `shared/database.py`

```python
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

db = SQLAlchemy()
Base = declarative_base()

def get_db_connection_string():
    return os.getenv('DATABASE_URL', 'sqlite:///default.db')

def init_db(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = get_db_connection_string()
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    with app.app_context():
        db.create_all()
```

## 3. Auth Service

### `auth-service/requirements.txt`

```txt
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
PyMySQL==1.1.0
PyJWT==2.8.0
cryptography==41.0.4
redis==5.0.1
requests==2.31.0
```

### `auth-service/Dockerfile`

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY ../shared /app/shared

EXPOSE 5000

CMD ["python", "app.py"]
```

### `auth-service/app.py`

```python
from flask import Flask, request, jsonify
import jwt
import datetime
from functools import wraps
import redis
import os
from shared.database import db, init_db
from models import User

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'fallback-secret-key')

# Initialize database
init_db(app)

# Redis connection
redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        # Check Redis for blacklisted token
        if redis_client.get(f"blacklist:{token}"):
            return jsonify({'message': 'Token has been revoked!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(public_id=data['public_id']).first()
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Auth service is healthy'})

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()

    # Registration logic (similar to previous example)
    # ... implementation details ...

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    # Login logic with JWT generation
    # ... implementation details ...

    token = jwt.encode({
        'public_id': user.public_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({'token': token, 'user_id': user.public_id})

@app.route('/auth/validate', methods=['POST'])
@token_required
def validate_token(current_user):
    return jsonify({'valid': True, 'user_id': current_user.public_id})

@app.route('/auth/logout', methods=['POST'])
@token_required
def logout(current_user):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    # Add token to blacklist with expiration
    redis_client.setex(f"blacklist:{token}", 3600, 'true')  # 1 hour expiration

    return jsonify({'message': 'Logged out successfully'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### `auth-service/models.py`

```python
from shared.database import db
import uuid

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
```

## 4. User Service

### `user-service/requirements.txt`

```txt
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
PyMySQL==1.1.0
requests==2.31.0
```

### `user-service/Dockerfile`

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY ../shared /app/shared

EXPOSE 5000

CMD ["python", "app.py"]
```

### `user-service/app.py`

```python
from flask import Flask, request, jsonify
import requests
from functools import wraps
import os
from shared.database import db, init_db
from models import UserProfile

app = Flask(__name__)
init_db(app)

AUTH_SERVICE_URL = os.getenv('AUTH_SERVICE_URL', 'http://auth-service:5000')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        # Validate token with auth service
        auth_response = requests.post(
            f'{AUTH_SERVICE_URL}/auth/validate',
            headers={'Authorization': f'Bearer {token}'}
        )

        if auth_response.status_code != 200:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(auth_response.json().get('user_id'), *args, **kwargs)
    return decorated

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'User service is healthy'})

@app.route('/users/profile', methods=['GET'])
@token_required
def get_profile(user_id):
    profile = UserProfile.query.filter_by(user_id=user_id).first()

    if not profile:
        return jsonify({'message': 'Profile not found'}), 404

    return jsonify({
        'user_id': user_id,
        'profile': {
            'bio': profile.bio,
            'avatar': profile.avatar,
            'preferences': profile.preferences
        }
    })

@app.route('/users/profile', methods=['PUT'])
@token_required
def update_profile(user_id):
    data = request.get_json()
    profile = UserProfile.query.filter_by(user_id=user_id).first()

    if not profile:
        profile = UserProfile(user_id=user_id)
        db.session.add(profile)

    if 'bio' in data:
        profile.bio = data['bio']
    if 'avatar' in data:
        profile.avatar = data['avatar']

    db.session.commit()

    return jsonify({'message': 'Profile updated successfully'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### `user-service/models.py`

```python
from shared.database import db
import json

class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), unique=True, nullable=False)
    bio = db.Column(db.Text, default='')
    avatar = db.Column(db.String(200))
    preferences = db.Column(db.Text, default='{}')  # JSON string

    def get_preferences(self):
        return json.loads(self.preferences)

    def set_preferences(self, preferences_dict):
        self.preferences = json.dumps(preferences_dict)
```

## 5. API Gateway

### `api-gateway/requirements.txt`

```txt
Flask==2.3.3
requests==2.31.0
gunicorn==21.2.0
```

### `api-gateway/Dockerfile`

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "-b", "0.0.0.0:8000", "app:app"]
```

### `api-gateway/app.py`

```python
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

AUTH_SERVICE_URL = os.getenv('AUTH_SERVICE_URL', 'http://auth-service:5000')
USER_SERVICE_URL = os.getenv('USER_SERVICE_URL', 'http://user-service:5000')

@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def gateway(path):
    # Route requests to appropriate service
    if path.startswith('auth/'):
        service_url = AUTH_SERVICE_URL
        service_path = path.replace('auth/', 'auth/')
    elif path.startswith('users/'):
        service_url = USER_SERVICE_URL
        service_path = path.replace('users/', 'users/')
    else:
        return jsonify({'error': 'Service not found'}), 404

    # Forward the request
    try:
        response = requests.request(
            method=request.method,
            url=f'{service_url}/{service_path}',
            headers={key: value for key, value in request.headers if key != 'Host'},
            data=request.get_data(),
            params=request.args,
            cookies=request.cookies,
            allow_redirects=False
        )

        return (response.content, response.status_code, response.headers.items())

    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'Service unavailable'}), 503

@app.route('/health', methods=['GET'])
def health_check():
    # Check health of all services
    services_health = {}

    try:
        auth_health = requests.get(f'{AUTH_SERVICE_URL}/health')
        services_health['auth_service'] = auth_health.status_code == 200
    except:
        services_health['auth_service'] = False

    try:
        user_health = requests.get(f'{USER_SERVICE_URL}/health')
        services_health['user_service'] = user_health.status_code == 200
    except:
        services_health['user_service'] = False

    return jsonify({
        'gateway': 'healthy',
        'services': services_health
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
```

## 6. Deployment and Management

### Create a `Makefile` for easy management:

```makefile
.PHONY: build up down logs clean

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

migrate:
	docker-compose exec auth-service python -c "from app import db; db.create_all()"
	docker-compose exec user-service python -c "from app import db; db.create_all()"
```

### Environment Configuration File `.env`

```env
# Database
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=flask_microservices
MYSQL_USER=flaskuser
MYSQL_PASSWORD=flaskpass

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production

# Services
AUTH_SERVICE_URL=http://auth-service:5000
USER_SERVICE_URL=http://user-service:5000
DATABASE_URL=mysql+pymysql://flaskuser:flaskpass@mysql-db:3306/flask_microservices
REDIS_URL=redis://redis:6379
```

## 7. Running the Microservices

```bash
# Build and start all services
docker-compose up --build

# Check service status
curl http://localhost:8000/health

# Test authentication
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"secret"}'

curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret"}'
```

## 🏗️ Microservices Architecture Benefits

| Aspect              | Monolithic              | Microservices             |
| ------------------- | ----------------------- | ------------------------- |
| **Scalability**     | Scale entire app        | Scale individual services |
| **Technology**      | Single stack            | Polyglot persistence      |
| **Deployment**      | All or nothing          | Independent deployments   |
| **Fault Isolation** | Single point of failure | Isolated failures         |
