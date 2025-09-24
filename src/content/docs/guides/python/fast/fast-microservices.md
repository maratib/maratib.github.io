---
title: Fast Microservices
slug: guides/python/fast/fast-microservices
description: Fast Microservices
sidebar:
  order: 9
---

Building microservices architecture using FastAPI, including service discovery, communication, deployment, and monitoring.

### Architecture Overview

We'll build an e-commerce microservices system with these services:

- **API Gateway**: Single entry point
- **User Service**: User management
- **Product Service**: Product catalog
- **Order Service**: Order processing
- **Inventory Service**: Stock management
- **Notification Service**: Email/notifications

### Project Structure

```
microservices/
├── api_gateway/
├── user_service/
├── product_service/
├── order_service/
├── inventory_service/
├── notification_service/
├── shared/
├── docker-compose.yml
└── kubernetes/
```

### 1. Core Services Implementation

#### Shared Dependencies (shared/)

**shared/models.py**

```python
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum
from datetime import datetime

# Common models shared across services
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    is_active: bool = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
```

**shared/database.py**

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

class DatabaseConfig:
    @staticmethod
    def get_db_url(service_name: str) -> str:
        # In production, use environment variables
        return f"sqlite:///./{service_name}.db"

def create_database(service_name: str):
    database_url = DatabaseConfig.get_db_url(service_name)
    engine = create_engine(database_url, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    return engine, SessionLocal, Base
```

#### User Service

**user_service/main.py**

```python
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from shared.database import create_database
from shared.models import UserBase
from user_service import models, schemas, crud

# Database setup
engine, SessionLocal, Base = create_database("user_service")
Base.metadata.create_all(bind=engine)

app = FastAPI(title="User Service", version="1.0.0")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.UserResponse])
async def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db=db, skip=skip, limit=limit)

@app.get("/users/{user_id}", response_model=schemas.UserResponse)
async def get_user(user_id: str, db: Session = Depends(get_db)):
    user = crud.get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}", response_model=schemas.UserResponse)
async def update_user(user_id: str, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = crud.update_user(db=db, user_id=user_id, user_update=user_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

**user_service/schemas.py**

```python
from pydantic import BaseModel, EmailStr
from typing import Optional
from shared.models import UserBase

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: str

    class Config:
        from_attributes = True
```

**user_service/models.py**

```python
from sqlalchemy import Column, String, Boolean
from shared.database import create_database

_, _, Base = create_database("user_service")

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
```

**user_service/crud.py**

```python
from sqlalchemy.orm import Session
import uuid
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        id=str(uuid.uuid4()),
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        is_active=user.is_active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def update_user(db: Session, user_id: str, user_update: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if db_user:
        update_data = user_update.dict(exclude_unset=True)
        if 'password' in update_data:
            update_data['hashed_password'] = get_password_hash(update_data.pop('password'))
        for field, value in update_data.items():
            setattr(db_user, field, value)
        db.commit()
        db.refresh(db_user)
    return db_user
```

#### Product Service

**product_service/main.py**

```python
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from shared.database import create_database
from product_service import models, schemas, crud

# Database setup
engine, SessionLocal, Base = create_database("product_service")
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Product Service", version="1.0.0")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/products/", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

@app.get("/products/", response_model=List[schemas.ProductResponse])
async def get_products(skip: int = 0, limit: int = 100, category: str = None, db: Session = Depends(get_db)):
    return crud.get_products(db=db, skip=skip, limit=limit, category=category)

@app.get("/products/{product_id}", response_model=schemas.ProductResponse)
async def get_product(product_id: str, db: Session = Depends(get_db)):
    product = crud.get_product(db=db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.put("/products/{product_id}", response_model=schemas.ProductResponse)
async def update_product(product_id: str, product_update: schemas.ProductUpdate, db: Session = Depends(get_db)):
    product = crud.update_product(db=db, product_id=product_id, product_update=product_update)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
```

### 2. Service Communication

#### HTTP Communication with Circuit Breaker

**shared/http_client.py**

```python
import httpx
import asyncio
from typing import Optional
from fastapi import HTTPException
import time

class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=30):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN

    def can_execute(self):
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "HALF_OPEN"
                return True
            return False
        return True

    def on_success(self):
        if self.state == "HALF_OPEN":
            self.state = "CLOSED"
        self.failure_count = 0

    def on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"

class ServiceClient:
    def __init__(self, service_base_url: str):
        self.service_base_url = service_base_url
        self.circuit_breaker = CircuitBreaker()
        self.client = httpx.AsyncClient(timeout=30.0)

    async def get(self, path: str):
        if not self.circuit_breaker.can_execute():
            raise HTTPException(status_code=503, detail="Service temporarily unavailable")

        try:
            response = await self.client.get(f"{self.service_base_url}{path}")
            self.circuit_breaker.on_success()
            return response
        except Exception as e:
            self.circuit_breaker.on_failure()
            raise HTTPException(status_code=503, detail=f"Service error: {str(e)}")

    async def post(self, path: str, data: dict):
        if not self.circuit_breaker.can_execute():
            raise HTTPException(status_code=503, detail="Service temporarily unavailable")

        try:
            response = await self.client.post(f"{self.service_base_url}{path}", json=data)
            self.circuit_breaker.on_success()
            return response
        except Exception as e:
            self.circuit_breaker.on_failure()
            raise HTTPException(status_code=503, detail=f"Service error: {str(e)}")

# Service clients
user_service_client = ServiceClient("http://user-service:8000")
product_service_client = ServiceClient("http://product-service:8001")
order_service_client = ServiceClient("http://order-service:8002")
```

#### Order Service with Service Communication

**order_service/main.py**

```python
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from shared.database import create_database
from shared.http_client import user_service_client, product_service_client
from order_service import models, schemas, crud

# Database setup
engine, SessionLocal, Base = create_database("order_service")
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Order Service", version="1.0.0")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def validate_user_exists(user_id: str):
    """Validate that user exists by calling User Service"""
    response = await user_service_client.get(f"/users/{user_id}")
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="User not found")

async def validate_product_exists(product_id: str):
    """Validate that product exists by calling Product Service"""
    response = await product_service_client.get(f"/products/{product_id}")
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Product not found")
    return response.json()

async def check_inventory(product_id: str, quantity: int):
    """Check inventory by calling Inventory Service"""
    # This would call the inventory service
    # For now, we'll assume inventory is sufficient
    return True

@app.post("/orders/", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Validate user exists
    await validate_user_exists(order.user_id)

    # Validate products and check inventory
    total_amount = 0
    for item in order.items:
        product = await validate_product_exists(item.product_id)
        await check_inventory(item.product_id, item.quantity)
        total_amount += product['price'] * item.quantity

    # Create order
    return crud.create_order(db=db, order=order, total_amount=total_amount)

@app.get("/orders/{order_id}", response_model=schemas.OrderResponse)
async def get_order(order_id: str, db: Session = Depends(get_db)):
    order = crud.get_order(db=db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Enrich order data with user and product information
    user_response = await user_service_client.get(f"/users/{order.user_id}")
    order_data = schemas.OrderResponse.from_orm(order)
    order_data.user = user_response.json()

    return order_data
```

### 3. API Gateway

**api_gateway/main.py**

```python
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
import uuid
from datetime import datetime

app = FastAPI(title="API Gateway", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service routing configuration
SERVICE_ROUTES = {
    "user_service": "http://user-service:8000",
    "product_service": "http://product-service:8001",
    "order_service": "http://order-service:8002",
    "inventory_service": "http://inventory-service:8003",
}

@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start_time = datetime.now()

    # Log request
    print(f"Request {request_id}: {request.method} {request.url}")

    response = await call_next(request)

    # Log response
    process_time = (datetime.now() - start_time).total_seconds() * 1000
    print(f"Request {request_id} completed: {response.status_code} in {process_time}ms")

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = str(process_time)

    return response

async def forward_request(service_url: str, request: Request):
    """Forward request to appropriate service"""
    path = request.url.path.replace("/api", "")
    url = f"{service_url}{path}"

    headers = dict(request.headers)
    headers.pop("host", None)

    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=request.method,
                url=url,
                headers=headers,
                params=request.query_params,
                content=await request.body()
            )

            return JSONResponse(
                content=response.json(),
                status_code=response.status_code,
                headers=dict(response.headers)
            )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")

# Route definitions
@app.api_route("/api/users/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def user_service_route(request: Request, path: str):
    return await forward_request(SERVICE_ROUTES["user_service"], request)

@app.api_route("/api/products/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def product_service_route(request: Request, path: str):
    return await forward_request(SERVICE_ROUTES["product_service"], request)

@app.api_route("/api/orders/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def order_service_route(request: Request, path: str):
    return await forward_request(SERVICE_ROUTES["order_service"], request)

# Health check endpoint that checks all services
@app.get("/health")
async def health_check():
    health_status = {}

    async with httpx.AsyncClient() as client:
        for service_name, service_url in SERVICE_ROUTES.items():
            try:
                response = await client.get(f"{service_url}/health", timeout=5.0)
                health_status[service_name] = "healthy" if response.status_code == 200 else "unhealthy"
            except Exception as e:
                health_status[service_name] = f"unhealthy: {str(e)}"

    all_healthy = all(status == "healthy" for status in health_status.values())
    return {
        "status": "healthy" if all_healthy else "degraded",
        "services": health_status
    }

@app.get("/")
async def root():
    return {"message": "API Gateway is running"}
```

### 4. Service Discovery & Configuration

**shared/config.py**

```python
import os
from typing import Dict, Any

class Config:
    """Centralized configuration management"""

    # Service discovery
    SERVICE_REGISTRY = {
        "user_service": os.getenv("USER_SERVICE_URL", "http://localhost:8000"),
        "product_service": os.getenv("PRODUCT_SERVICE_URL", "http://localhost:8001"),
        "order_service": os.getenv("ORDER_SERVICE_URL", "http://localhost:8002"),
        "inventory_service": os.getenv("INVENTORY_SERVICE_URL", "http://localhost:8003"),
        "notification_service": os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8004"),
    }

    # Database configurations
    DATABASE_URLS = {
        "user_service": os.getenv("USER_DB_URL", "sqlite:///./user_service.db"),
        "product_service": os.getenv("PRODUCT_DB_URL", "sqlite:///./product_service.db"),
        "order_service": os.getenv("ORDER_DB_URL", "sqlite:///./order_service.db"),
    }

    # JWT Configuration
    JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

    # Redis for caching and session storage
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

    @classmethod
    def get_service_url(cls, service_name: str) -> str:
        return cls.SERVICE_REGISTRY.get(service_name)

    @classmethod
    def get_database_url(cls, service_name: str) -> str:
        return cls.DATABASE_URLS.get(service_name)
```

### 5. Authentication & Authorization

**shared/auth.py**

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Optional
from shared.config import Config

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token and return user data"""
    try:
        payload = jwt.decode(
            credentials.credentials,
            Config.JWT_SECRET,
            algorithms=[Config.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

async def get_current_user(payload: dict = Depends(verify_token)):
    """Get current user from token payload"""
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_id

# Role-based authorization
class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, user: dict = Depends(verify_token)):
        user_role = user.get("role", "user")
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions"
            )
        return user

# Usage examples
admin_only = RoleChecker(["admin"])
admin_or_user = RoleChecker(["admin", "user"])
```

### 6. Message Queue Integration

**shared/rabbitmq.py**

```python
import aio_pika
import json
from typing import Any, Dict

class MessageQueue:
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self.connection = None
        self.channel = None

    async def connect(self):
        """Establish connection to RabbitMQ"""
        self.connection = await aio_pika.connect_robust(self.connection_string)
        self.channel = await self.connection.channel()

    async def publish(self, queue_name: str, message: Dict[str, Any]):
        """Publish message to queue"""
        if not self.channel:
            await self.connect()

        await self.channel.default_exchange.publish(
            aio_pika.Message(
                body=json.dumps(message).encode()
            ),
            routing_key=queue_name
        )

    async def consume(self, queue_name: str, callback):
        """Consume messages from queue"""
        if not self.channel:
            await self.connect()

        queue = await self.channel.declare_queue(queue_name, durable=True)

        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    data = json.loads(message.body.decode())
                    await callback(data)

# Global message queue instance
mq = MessageQueue("amqp://guest:guest@rabbitmq//")
```

### 7. Testing Strategy

**user_service/test_main.py**

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from user_service.main import app, get_db
from user_service.models import Base

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_create_user(setup_database):
    response = client.post("/users/", json={
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "password123",
        "is_active": True
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_get_users(setup_database):
    # Create a user first
    client.post("/users/", json={
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "password123"
    })

    response = client.get("/users/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["email"] == "test@example.com"
```

### 8. Docker Configuration

**Dockerfile (for each service)**

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml**

```yaml
version: "3.8"

services:
  api-gateway:
    build: ./api_gateway
    ports:
      - "8000:8000"
    depends_on:
      - user-service
      - product-service
      - order-service
    environment:
      - USER_SERVICE_URL=http://user-service:8000
      - PRODUCT_SERVICE_URL=http://product-service:8001
      - ORDER_SERVICE_URL=http://order-service:8002

  user-service:
    build: ./user_service
    ports:
      - "8001:8000"
    environment:
      - DATABASE_URL=sqlite:///./user_service.db

  product-service:
    build: ./product_service
    ports:
      - "8002:8000"
    environment:
      - DATABASE_URL=sqlite:///./product_service.db

  order-service:
    build: ./order_service
    ports:
      - "8003:8000"
    environment:
      - DATABASE_URL=sqlite:///./order_service.db
    depends_on:
      - user-service
      - product-service

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  # Add nginx for load balancing if needed
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api-gateway
```

### 9. Kubernetes Deployment

**kubernetes/deployment.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
        - name: user-service
          image: user-service:latest
          ports:
            - containerPort: 8000
          env:
            - name: DATABASE_URL
              value: "postgresql://user:password@postgresql/user_service"
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - port: 8000
      targetPort: 8000
```

### 10. Monitoring & Logging

**shared/logging.py**

```python
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "service": "user_service",  # This would be dynamic
        }

        if hasattr(record, 'extra'):
            log_entry.update(record.extra)

        return json.dumps(log_entry)

def setup_logging(service_name: str):
    logger = logging.getLogger(service_name)
    logger.setLevel(logging.INFO)

    handler = logging.StreamHandler()
    formatter = JSONFormatter()
    handler.setFormatter(formatter)

    logger.addHandler(handler)
    return logger

# Structured logging example
logger = setup_logging("user_service")

def log_request(request_id: str, method: str, path: str, user_id: str = None):
    logger.info("API Request", extra={
        "request_id": request_id,
        "method": method,
        "path": path,
        "user_id": user_id,
        "type": "request"
    })
```

### 11. Running the Microservices

#### Development

```bash
# Start all services
docker-compose up --build

# Or run individually
cd user_service && uvicorn main:app --reload --port 8001
cd product_service && uvicorn main:app --reload --port 8002
cd order_service && uvicorn main:app --reload --port 8003
cd api_gateway && uvicorn main:app --reload --port 8000
```

#### Testing

```bash
# Test individual services
pytest user_service/test_main.py
pytest product_service/test_main.py

# Test API Gateway
curl http://localhost:8000/api/users/
curl http://localhost:8000/api/products/
```

### Key Benefits of This Architecture

1. **Scalability**: Each service can be scaled independently
2. **Technology Diversity**: Different services can use different technologies
3. **Fault Isolation**: Failure in one service doesn't affect others
4. **Independent Deployment**: Services can be deployed separately
5. **Team Autonomy**: Different teams can work on different services

### Best Practices Demonstrated

1. **Database per Service**: Each service has its own database
2. **API Gateway**: Single entry point for all requests
3. **Circuit Breaker**: Prevents cascading failures
4. **Centralized Configuration**: Easy management of service URLs
5. **Comprehensive Testing**: Isolated tests for each service
6. **Containerization**: Docker for consistent environments
7. **Monitoring**: Structured logging and health checks
