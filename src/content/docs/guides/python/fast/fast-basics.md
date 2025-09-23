---
title: Fast API Basics
slug: guides/python/fast/fast-basics
description: Fast API Basics
sidebar:
  order: 0
---

FastAPI is a **modern, high-performance Python web framework** for building APIs, based on:

---

### 1. What is FastAPI?

FastAPI is a **modern, high-performance Python web framework** for building APIs, based on:

- **Starlette** (for web handling, requests, routing).
- **Pydantic** (for data validation & serialization).
- **ASGI** (Asynchronous Server Gateway Interface).

👉 Known for: **Speed, type-safety, async support, auto-generated docs (Swagger & Redoc).**

---

### 2. Installing & Setup

```bash
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn
```

Run server:

```bash
uvicorn main:app --reload
```

- `main` → filename
- `app` → FastAPI instance

---

### 3. Basic Hello World

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Hello, FastAPI!"}
```

Open:

- Swagger UI → 127.0.0.1:8000/docs
- Redoc → 127.0.0.1:8000/redoc

---

### 4. Request Methods

```python
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "query": q}

@app.post("/items/")
def create_item(item: dict):
    return {"created_item": item}

@app.put("/items/{item_id}")
def update_item(item_id: int, item: dict):
    return {"item_id": item_id, "updated_item": item}

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    return {"status": f"Item {item_id} deleted"}
```

---

### 5. Data Validation with Pydantic

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float
    in_stock: bool = True

@app.post("/items/")
def create_item(item: Item):
    return {"item": item.dict()}
```

✅ Auto validates incoming JSON and generates **docs**.

---

### 6. Path, Query & Body Parameters

```python
@app.get("/users/{user_id}")
def get_user(user_id: int, active: bool = True):
    return {"user_id": user_id, "active": active}
```

---

### 7. Dependency Injection

```python
from fastapi import Depends

def get_token_header(token: str = "testtoken"):
    if token != "testtoken":
        raise HTTPException(status_code=403, detail="Invalid token")
    return token

@app.get("/secure-data/")
def secure_route(token: str = Depends(get_token_header)):
    return {"message": "Secure data accessed!"}
```

---

### 8. Authentication & Security

```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/profile/")
def read_profile(token: str = Depends(oauth2_scheme)):
    return {"token": token}
```

---

### 9. Async Support

```python
import asyncio

@app.get("/wait/")
async def wait_response():
    await asyncio.sleep(2)
    return {"msg": "Response after 2s delay"}
```

---

### 10. Middleware

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 11. Database Integration (SQLAlchemy + FastAPI)

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

Base.metadata.create_all(bind=engine)
```

Dependency for DB session:

```python
from fastapi import Depends

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

### 12. File Upload

```python
from fastapi import File, UploadFile

@app.post("/upload/")
def upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename}
```

---

### 13. Background Tasks

```python
from fastapi import BackgroundTasks

def write_log(message: str):
    with open("log.txt", "a") as f:
        f.write(message)

@app.post("/log/")
def log(background_tasks: BackgroundTasks, msg: str):
    background_tasks.add_task(write_log, msg)
    return {"status": "Logged in background"}
```

---

### 14. Event Handlers

```python
@app.on_event("startup")
def startup_event():
    print("App starting...")

@app.on_event("shutdown")
def shutdown_event():
    print("App shutting down...")
```

---

### 15. Error Handling

```python
from fastapi import HTTPException

@app.get("/error/")
def get_error():
    raise HTTPException(status_code=404, detail="Item not found")
```

---

### 16. Testing with `TestClient`

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, FastAPI!"}
```

---

### 17. Project Structure (Best Practice)

```
app/
 ├── main.py
 ├── models.py
 ├── schemas.py
 ├── crud.py
 ├── database.py
 ├── routers/
 │    ├── users.py
 │    └── items.py
 └── tests/
      └── test_app.py
```

---

### 18. Microservices with FastAPI

👉 FastAPI is **ASGI-based** → works with **Gunicorn + Uvicorn workers**.

👉 Can integrate with **Kafka, RabbitMQ, Celery** for microservices.

---

### 19. Advantages of FastAPI

✅ **Blazing fast** (async support)

✅ **Auto validation** via Pydantic

✅ **Interactive docs** (Swagger/Redoc)

✅ **Dependency injection** built-in

✅ **Production ready**

---

### 20. Cheatsheet

- **Decorators** → `@app.get`, `@app.post`
- **Validation** → Pydantic models
- **Docs** → `/docs`, `/redoc`
- **Security** → OAuth2, JWT
- **DB** → SQLAlchemy / Tortoise ORM
- **Async** → `async def` handlers
- **Testing** → `TestClient`
- **Scaling** → Uvicorn/Gunicorn workers
