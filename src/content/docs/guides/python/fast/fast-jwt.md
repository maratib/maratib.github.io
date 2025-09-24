---
title: Fast JWT
slug: guides/python/fast/fast-jwt
description: Fast JWT
sidebar:
  order: 10
---

**JWT Authentication in FastAPI**

### 1. What is JWT?

- **JWT (JSON Web Token)** is a compact, URL-safe token for authentication.
- Structure:

  ```
  header.payload.signature
  ```

- Example:

  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

👉 FastAPI uses JWT to secure endpoints (like `/login`, `/users/me`).

---

### 2. Install Dependencies

```bash
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] python-multipart
```

---

### 3. Setup JWT Utility Functions

```python
from datetime import datetime, timedelta
from jose import JWTError, jwt

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

---

### 4. Password Hashing with Passlib

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def hash_password(password: str):
    return pwd_context.hash(password)
```

---

### 5. Auth Dependencies

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return payload
```

---

### 6. Main FastAPI App

```python
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel

app = FastAPI()

# Fake DB
fake_users = {
    "admin": {"username": "admin", "password": hash_password("secret")}
}

class User(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(user: User):
    db_user = fake_users.get(user.username)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"sub": user.username}, timedelta(minutes=30))
    return {"access_token": token, "token_type": "bearer"}

@app.get("/users/me")
def read_users_me(current_user: dict = Depends(get_current_user)):
    return {"user": current_user["sub"]}
```

---

### 7. Test It

1. Run server:

   ```bash
   uvicorn main:app --reload
   ```

2. Go to: `http://127.0.0.1:8000/docs`
3. Login with:

   ```json
   {
     "username": "admin",
     "password": "secret"
   }
   ```

4. Copy the token → Use it in **Authorize 🔑** button in Swagger UI.
5. Call `/users/me` → should return your username.

---

### 8. Best Practices

- Always **hash passwords** before saving.
- Store **SECRET_KEY** in environment variables.
- Use **refresh tokens** for long sessions.
- Consider **role-based access control (RBAC)**.

### 9. Testing JWT Authentication in FastAPI

#### 1. Install Test Dependencies

```bash
pip install pytest httpx pytest-asyncio
```

---

#### 2. Create `test_main.py`

Here’s a test suite that verifies **login** and **protected route** access:

```python
import pytest
from httpx import AsyncClient
from main import app  # your FastAPI app

@pytest.mark.asyncio
async def test_login_and_access():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Step 1: Login with correct credentials
        response = await ac.post("/login", json={"username": "admin", "password": "secret"})
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data

        token = data["access_token"]

        # Step 2: Access protected route with token
        response = await ac.get("/users/me", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        assert response.json()["user"] == "admin"

@pytest.mark.asyncio
async def test_login_invalid_credentials():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/login", json={"username": "admin", "password": "wrong"})
        assert response.status_code == 400
        assert response.json()["detail"] == "Invalid credentials"

@pytest.mark.asyncio
async def test_access_without_token():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/users/me")
        assert response.status_code == 401
```

---

#### 3. Run Tests

```bash
pytest -v
```

✅ Expected Output:

- Login works with correct credentials.
- Login fails with wrong credentials.
- Protected endpoint denies access without a token.
