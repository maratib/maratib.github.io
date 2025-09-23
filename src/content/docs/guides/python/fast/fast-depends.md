---
title: Fast API Depends
slug: guides/python/fast/fast-depends
description: Fast API Depends
sidebar:
  order: 1
---

- **Depends** is **one of the most powerful features in FastAPI**.

- It gives us **Dependency Injection (DI)**

- A clean way to **reuse logic**, **enforce rules**, and **manage shared resources** like authentication, DB sessions, caching, etc.

---

### What is `Depends`?

- A special function in FastAPI that tells the framework:
  👉 **Before calling my endpoint, run this function and pass its result to me.**
- Used for:

  - **Auth** (check user, roles, tokens)
  - **Database sessions**
  - **Common query parameters**
  - **Reusable business logic**

---

### Basic Example

```python
from fastapi import FastAPI, Depends, HTTPException

app = FastAPI()

# Dependency function
def verify_token(token: str = "test123"):
    if token != "test123":
        raise HTTPException(status_code=403, detail="Invalid token")
    return token

@app.get("/secure-data/")
def secure_data(token: str = Depends(verify_token)):
    return {"msg": "Secure data accessed!", "token": token}
```

✔️ Here, FastAPI **runs `verify_token` first**, and if it passes, injects the return value into the endpoint.

---

### Short Sample Project with `Depends`

Let’s build a **User CRUD API** with:

- **Dependency Injection for DB sessions**
- **Dependency Injection for fake authentication**

#### Project Structure

```
app/
 ├── main.py
 ├── database.py
 ├── models.py
 ├── schemas.py
 └── crud.py
```

---

#### 1. `database.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

#### 2. `models.py`

```python
from sqlalchemy import Column, Integer, String
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
```

---

#### 3. `schemas.py`

```python
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        orm_mode = True
```

---

#### 4. `crud.py`

```python
from sqlalchemy.orm import Session
from . import models, schemas

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session):
    return db.query(models.User).all()
```

---

#### 5. `main.py`

```python
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud, database

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()

# Fake auth dependency
def get_current_user(token: str = "test123"):
    if token != "test123":
        raise HTTPException(status_code=403, detail="Invalid token")
    return {"username": "admin"}

@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate,
                db: Session = Depends(database.get_db),
                current_user: dict = Depends(get_current_user)):
    return crud.create_user(db, user)

@app.get("/users/", response_model=list[schemas.UserOut])
def read_users(db: Session = Depends(database.get_db),
               current_user: dict = Depends(get_current_user)):
    return crud.get_users(db)
```

---

### How `Depends` Works Here

1. **`Depends(database.get_db)`** → creates and closes DB session automatically.
2. **`Depends(get_current_user)`** → ensures only authenticated users can access endpoints.
3. FastAPI **injects these automatically** into your endpoint function.

---

Now, you have:

- `/users/ [POST]` → Create user (requires token).
- `/users/ [GET]` → List users (requires token).
