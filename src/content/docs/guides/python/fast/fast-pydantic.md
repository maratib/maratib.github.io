---
title: Fast Pydantic
slug: guides/python/fast/fast-pydantic
description: Fast Pydantic
sidebar:
  order: 3
---

- 👉 **Without Pydantic, FastAPI would just be another web framework.**

- It’s the reason why FastAPI is **so strict, fast, and developer-friendly**.
- 👉 **Pydantic** = Validates & parses data.
- 👉 **Depends** = Injects reusable logic/resources.

### 1.What is Pydantic?

- **Pydantic** is a Python library for **data validation and settings management** using Python type hints.
- It ensures data coming into your FastAPI app is:

  - **Valid** (correct type, format, constraints).
  - **Cleaned** (converted to the right type).
  - **Documented** (auto-generated OpenAPI schema).

👉 FastAPI internally uses **Pydantic models** to define request bodies, query params, and response schemas.

---

### 2. Why Pydantic in FastAPI?

- **Validation**: Rejects invalid requests automatically.
- **Serialization**: Converts DB objects → JSON.
- **Docs Generation**: OpenAPI/Swagger knows field types.
- **Type Safety**: Encourages clean, explicit contracts.

---

### 3. Example: Request Validation

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    in_stock: bool = True

@app.post("/items/")
def create_item(item: Item):
    return {"item": item.dict()}
```

#### 🟢 Valid Input

```json
{
  "name": "Laptop",
  "price": 1200.5
}
```

✅ Response:

```json
{
  "item": { "name": "Laptop", "price": 1200.5, "in_stock": true }
}
```

#### 🔴 Invalid Input

```json
{
  "name": "Laptop",
  "price": "not-a-number"
}
```

❌ FastAPI automatically returns:

```json
{
  "detail": [
    {
      "loc": ["body", "item", "price"],
      "msg": "value is not a valid float",
      "type": "type_error.float"
    }
  ]
}
```

---

### 4. Example: Response Model

```python
from typing import List

@app.get("/items/", response_model=List[Item])
def get_items():
    return [
        {"name": "Phone", "price": 500, "in_stock": True},
        {"name": "Tablet", "price": 800, "in_stock": False}
    ]
```

✅ Even if your DB returned extra fields, FastAPI trims output based on the **Pydantic response model**.

---

### 5. Advanced Features of Pydantic in FastAPI

#### (a) Field Validation

```python
from pydantic import BaseModel, Field

class Product(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    price: float = Field(..., gt=0, description="Price must be > 0")
```

- `min_length`, `max_length`, `gt` (greater than), etc.
- `description` auto-shows in Swagger docs.

---

#### (b) Nested Models

```python
class Category(BaseModel):
    id: int
    name: str

class Product(BaseModel):
    name: str
    price: float
    category: Category
```

✅ Allows structured, complex JSON inputs.

---

#### (c) Custom Validators

```python
from pydantic import validator

class User(BaseModel):
    username: str
    password: str

    @validator("password")
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError("Password too short")
        return v
```

---

#### (d) ORM Mode

For converting **SQLAlchemy ORM objects → Pydantic models**:

```python
class UserOut(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
```

---

### 6. How FastAPI Uses Pydantic Under the Hood

**Request cycle:**

```
Incoming JSON → Pydantic model validation → Endpoint logic → Pydantic response model → JSON response
```

So Pydantic acts as the **bridge** between raw requests/responses and Python objects.

---

### 7. Key Benefits in FastAPI

- ✅ No need to write manual validation code
- ✅ Automatic error responses (422 Unprocessable Entity)
- ✅ Data integrity & security
- ✅ Auto-generated OpenAPI docs
- ✅ Works with async + sync seamlessly
