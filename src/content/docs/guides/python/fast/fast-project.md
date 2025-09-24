---
title: Fast Project Structure
slug: guides/python/fast/fast-project
description: Fast Project Structure
sidebar:
  order: 0
---

Scaling a FastAPI project means moving from a **single `main.py` file** to a **well-organized, modular folder structure**.

---

### Large-Scale FastAPI Project Structure

Here’s a recommended structure used in **production-grade FastAPI apps**:

```
project/
│── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entrypoint
│   ├── core/                # Core configuration
│   │   ├── __init__.py
│   │   ├── config.py        # Settings (env vars, DB URL, etc.)
│   │   ├── security.py      # JWT / Auth utils
│   │   └── logging.py       # Logging config
│   │
│   ├── api/                 # API routes
│   │   ├── __init__.py
│   │   ├── deps.py          # Shared dependencies (Depends)
│   │   ├── v1/              # Versioned APIs
│   │   │   ├── __init__.py
│   │   │   ├── routes_users.py
│   │   │   ├── routes_items.py
│   │   │   └── routes_auth.py
│   │   └── v2/              # Future APIs
│   │
│   ├── models/              # SQLAlchemy / Pydantic models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── item.py
│   │
│   ├── schemas/             # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── item.py
│   │
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   └── item_service.py
│   │
│   ├── db/                  # Database session & migrations
│   │   ├── __init__.py
│   │   ├── base.py          # Base metadata
│   │   ├── session.py       # SQLAlchemy SessionLocal
│   │   └── init_db.py
│   │
│   ├── tests/               # Unit & integration tests
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   ├── test_users.py
│   │   └── conftest.py
│   │
│   └── utils/               # Helper functions
│       ├── __init__.py
│       ├── email.py
│       └── hashing.py
│
│── alembic/                 # Migrations (if using Alembic)
│── .env                     # Environment variables
│── requirements.txt
│── pyproject.toml
│── Dockerfile
│── docker-compose.yml
```

---

### Explanation of Each Layer

#### 1. **core/** → Config & Security

- **config.py** → Pydantic **BaseSettings** for environment variables.
- **security.py** → JWT utils, password hashing.
- **logging.py** → Centralized logging configuration.

👉 Keeps **global setup** separate.

---

#### 2. **api/** → Routers & Dependencies

- Organized by version (**v1**, **v2**).
- Each module (e.g., **users**, **items**) has its own router file.
- **deps.py** → common dependencies (**get_db**, **get_current_user**).

👉 Encourages **modular APIs**.

---

#### 3. **models/** & **schemas/** → Separation of Concerns

- **models/** → SQLAlchemy ORM models (DB representation).
- **schemas/** → Pydantic models (input/output validation).

👉 Keeps **DB models** separate from **request/response models**.

---

#### 4. **services/** → Business Logic Layer

- Encapsulates actual logic (e.g., creating users, applying discounts).
- Keeps **routers slim** → endpoints only orchestrate calls.

---

#### 5. **db/** → Database Session & Migrations

- **session.py** → SQLAlchemy **SessionLocal**.
- **init_db.py** → Startup logic (e.g., creating default admin).

---

#### 6. **tests/** → Unit & Integration Tests

- Organized by feature.
- Uses **pytest**, **httpx.AsyncClient**.
- **conftest.py** for fixtures (e.g., test DB session).

---

#### 7. **utils/** → Reusable Helpers

- Utility functions (e.g., hashing, sending emails, formatting).

---

### Example Code Snippets

#### core/config.py

```python
from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "My FastAPI App"
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
```

---

#### db/session.py

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, future=True, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

---

#### api/v1/routes_users.py

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.user import UserCreate, UserOut
from app.services.user_service import create_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users", response_model=UserOut)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)
```

---

#### services/user_service.py

```python
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.hashing import hash_password

def create_user(db: Session, user: UserCreate):
    db_user = User(username=user.username, hashed_password=hash_password(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

---

### 🌟 Best Practices

✅ Use **versioned APIs** (`/api/v1`, `/api/v2`).

✅ Keep **models, schemas, services, and routes separate**.

✅ Use **Dependency Injection** (`Depends`) for DB sessions, security.

✅ Write **unit & integration tests** for each module.

✅ Use **Alembic for migrations**.

✅ Use `.env` for secrets, **never hardcode** credentials.

✅ Use **Docker & docker-compose** for reproducible environments.

✅ Add **logging & monitoring** early.
