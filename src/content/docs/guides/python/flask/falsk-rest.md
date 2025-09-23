---
title: Flask Rest Api
slug: guides/python/flask-rest
description: Flask Rest Api
sidebar:
  order: 2
---

**REST API with Flask including JWT authentication.**

- From basic setup to creating secure endpoints with proper authentication.

### 1. Setting Up Your Flask Environment

First, create and activate a virtual environment to isolate your project dependencies :

```bash
# Create project directory
mkdir flask-api-project
cd flask-api-project

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate
# Activate virtual environment (Mac/Linux)
source venv/bin/activate
```

Install the required packages :

```bash
pip install Flask Flask-SQLAlchemy PyJWT flask-bcrypt
```

### 2. Basic Flask REST API Structure

Create a simple Flask application with REST endpoints :

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to Flask REST API'})

@app.route('/api/data', methods=['GET', 'POST'])
def handle_data():
    if request.method == 'GET':
        return jsonify({'data': 'This is GET response'})
    elif request.method == 'POST':
        data = request.get_json()
        return jsonify({'received': data}), 201

if __name__ == '__main__':
    app.run(debug=True)
```

### 3. Implementing JWT Authentication

#### 3.1 Configuration and Database Setup

```python
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import uuid
from datetime import datetime, timezone, timedelta
from functools import wraps

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(70), unique=True)
    password = db.Column(db.String(80))

# Create tables
with app.app_context():
    db.create_all()
```

#### 3.2 JWT Token Required Decorator

Create a middleware decorator to protect routes :

```python
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Check for token in headers
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # Decode the token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(public_id=data['public_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated
```

#### 3.3 Authentication Routes

```python
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 400

    # Create new user
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        public_id=str(uuid.uuid4()),
        name=data['name'],
        email=data['email'],
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Please provide email and password'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials!'}), 401

    # Generate JWT token
    token = jwt.encode({
        'public_id': user.public_id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'public_id': user.public_id,
            'name': user.name,
            'email': user.email
        }
    })
```

### 4. Creating Protected Routes

Now create endpoints that require JWT authentication :

```python
@app.route('/api/protected', methods=['GET'])
@token_required
def protected_route(current_user):
    return jsonify({
        'message': f'Welcome {current_user.name}!',
        'user': {
            'name': current_user.name,
            'email': current_user.email
        }
    })

@app.route('/api/users/profile', methods=['GET', 'PUT'])
@token_required
def user_profile(current_user):
    if request.method == 'GET':
        return jsonify({
            'name': current_user.name,
            'email': current_user.email,
            'public_id': current_user.public_id
        })

    elif request.method == 'PUT':
        data = request.get_json()
        if 'name' in data:
            current_user.name = data['name']
        db.session.commit()

        return jsonify({'message': 'Profile updated successfully'})

# Final app run
if __name__ == '__main__':
    app.run(debug=True)
```

### 5. Testing Your API

Use curl or Postman to test your endpoints:

**User Registration:**

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"[email protected]","password":"secret"}'
```

**User Login:**

```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"[email protected]","password":"secret"}'
```

**Access Protected Route:**

```bash
curl -X GET http://localhost:5000/api/protected \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 6. Enhanced JWT Configuration (Optional)

For more advanced JWT features, consider using `Flask-JWT-Extended` :

```bash
pip install flask-jwt-extended
```

```python
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app.config['JWT_SECRET_KEY'] = 'super-secret'
jwt = JWTManager(app)

@app.route('/api/login-enhanced', methods=['POST'])
def login_enhanced():
    # ... authentication logic ...
    access_token = create_access_token(identity=user.public_id)
    return jsonify({'access_token': access_token})
```

## 📋 Key Concepts Summary

| Concept                  | Purpose                          | Implementation                 |
| ------------------------ | -------------------------------- | ------------------------------ |
| **REST API**             | Create web services              | Flask routes with HTTP methods |
| **JWT Authentication**   | Secure API endpoints             | Token-based authentication     |
| **Database Integration** | Store user data                  | SQLAlchemy with SQLite         |
| **Password Security**    | Protect user credentials         | Password hashing with Werkzeug |
| **Route Protection**     | Limit access to authorized users | Decorator middleware           |

## 🔒 Security Best Practices

1. **Use strong secret keys** and store them in environment variables
2. **Set appropriate token expiration times** (24 hours in our example)
3. **Always hash passwords** before storing in database
4. **Validate all user input** to prevent injection attacks
5. **Use HTTPS in production** to encrypt data transmission
