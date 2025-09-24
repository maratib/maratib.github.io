---
title: Fast Depends
slug: guides/python/fast/fast-depends
description: Fast with Depends
sidebar:
  order: 4
---

- **Depends** is **one of the most powerful features in FastAPI**.

- It gives us **Dependency Injection (DI)**

- A clean way to **reuse logic**, **enforce rules**, and **manage shared resources** like authentication, DB sessions, caching, etc.

- 👉 **Pydantic** = Validates & parses data.

- 👉 **Depends** = Injects reusable logic/resources.

### 1. What is `Depends`?

- `Depends` is FastAPI’s **Dependency Injection (DI) system**.
- It tells FastAPI:
  👉 “Before executing my endpoint, run this function and give me its result.”

---

### 2. Why Use `Depends`?

- ✅ **Reusability** → share logic across endpoints (auth, db sessions).
- ✅ **Clean code** → keep endpoints small and focused.
- ✅ **Testability** → mock dependencies easily.
- ✅ **Security** → centralize auth/permissions.

---

### 3. Basic Example

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

✔️ FastAPI:

1. Calls `verify_token` before endpoint runs.
2. Injects its result (`token`) into the endpoint.

---

### 4. Advanced Uses

#### (a) Database Session

```python
from sqlalchemy.orm import Session
from database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
```

#### (b) Authentication

```python
def get_current_user(token: str = Depends(verify_token)):
    return {"username": "admin"}
```

#### (c) Reusable Query Parameters

```python
def common_params(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

@app.get("/items/")
def list_items(params: dict = Depends(common_params)):
    return {"params": params}
```

---

### 5. Nested Dependencies

Dependencies can depend on other dependencies:

```python
def get_token_header(token: str = "test123"):
    if token != "test123":
        raise HTTPException(403, "Invalid Token")
    return token

def get_current_user(token: str = Depends(get_token_header)):
    return {"username": "admin"}

@app.get("/profile/")
def profile(user: dict = Depends(get_current_user)):
    return user
```

Flow: **Request → get_token_header → get_current_user → endpoint**

---

### 6. Key Benefits in FastAPI

- ✅ Runs dependencies **before endpoint**
- ✅ Injects results automatically
- ✅ Supports **async and sync**
- ✅ Plays nicely with Pydantic (validation + DI)
- ✅ Auto-docs include dependencies

---

### 7. How FastAPI Uses `Depends` Under the Hood

**Request cycle with `Depends`:**

```
Client Request
     ↓
FastAPI Router
     ↓
Evaluate Dependencies (via Depends)
     ↓
Inject Dependency Results into Endpoint
     ↓
Run Endpoint Logic
     ↓
Return Response
```
