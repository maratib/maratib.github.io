---
title: Fast GraphQL
slug: guides/python/fast/fast-graphql
description: Fast GraphQL
sidebar:
  order: 7
---

**GraphQL with FastAPI – Complete Guide**

### 1. What is GraphQL?

- **GraphQL** is a query language for APIs created by Facebook.
- Unlike REST, where you have multiple endpoints, **GraphQL exposes a single endpoint** for queries, mutations, and subscriptions.
- Benefits:

  - Fetch exactly what you need (no over-fetching/under-fetching).
  - Strongly typed schema.
  - Powerful developer tooling (GraphiQL, Playground).

---

### 2. FastAPI + GraphQL Integration Options

FastAPI supports GraphQL via:

1. **Strawberry** 🍓 → Modern, type-hinted Pythonic GraphQL library.
2. **Graphene** → Older but mature GraphQL library.
3. **Ariadne** → Schema-first GraphQL library.

👉 Recommendation: Use **Strawberry** with FastAPI because it works seamlessly with type hints and Pydantic.

---

### 3. Install Dependencies

```bash
pip install fastapi uvicorn strawberry-graphql
```

---

### 4. Setting up GraphQL with FastAPI (Strawberry)

```python
from fastapi import FastAPI
import strawberry
from strawberry.fastapi import GraphQLRouter

# Schema Definition
@strawberry.type
class Book:
    id: int
    title: str
    author: str

books_db = [
    Book(id=1, title="1984", author="George Orwell"),
    Book(id=2, title="Brave New World", author="Aldous Huxley"),
]

@strawberry.type
class Query:
    books: list[Book] = strawberry.field(resolver=lambda: books_db)

@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_book(self, title: str, author: str) -> Book:
        new_book = Book(id=len(books_db) + 1, title=title, author=author)
        books_db.append(new_book)
        return new_book

# Create Schema
schema = strawberry.Schema(query=Query, mutation=Mutation)

# FastAPI App
app = FastAPI()
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")
```

---

### 5. Try It in Playground

Run:

```bash
uvicorn main:app --reload
```

Open:
👉 `http://127.0.0.1:8000/graphql`

Example Query:

```graphql
query {
  books {
    id
    title
    author
  }
}
```

Example Mutation:

```graphql
mutation {
  addBook(title: "Dune", author: "Frank Herbert") {
    id
    title
    author
  }
}
```

---

### 6. Using Pydantic with GraphQL

FastAPI can integrate **Pydantic models** for validation.

```python
from pydantic import BaseModel

class BookInput(BaseModel):
    title: str
    author: str

@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_book(self, data: BookInput) -> Book:
        new_book = Book(id=len(books_db) + 1, title=data.title, author=data.author)
        books_db.append(new_book)
        return new_book
```

---

### 7. Authentication with GraphQL in FastAPI

You can inject dependencies (like `Depends`) into GraphQL resolvers:

```python
from fastapi import Depends

def get_current_user(token: str = "fake_token"):
    return {"username": "admin"}

@strawberry.type
class Query:
    @strawberry.field
    def me(self, info) -> str:
        user = get_current_user()
        return f"Hello {user['username']}"
```

---

### 8. Subscriptions (Real-time)

Strawberry supports WebSocket-based GraphQL subscriptions:

```python
import asyncio

@strawberry.type
class Subscription:
    @strawberry.subscription
    async def countdown(self, from_: int):
        for i in range(from_, 0, -1):
            yield i
            await asyncio.sleep(1)

schema = strawberry.Schema(query=Query, mutation=Mutation, subscription=Subscription)
```

👉 Run a subscription in GraphQL Playground:

```graphql
subscription {
  countdown(from: 5)
}
```

---

### 9. GraphQL vs REST in FastAPI

| Feature       | REST API            | GraphQL API              |
| ------------- | ------------------- | ------------------------ |
| Endpoints     | Many (per resource) | Single `/graphql`        |
| Data Fetching | Fixed response      | Flexible, client-driven  |
| Versioning    | Needed              | Avoided (schema evolves) |
| Performance   | Over/under-fetch    | Optimized queries        |
| Tools         | Swagger, OpenAPI    | GraphiQL, Playground     |

---

### 10. Best Practices

- Use **Strawberry** for Pythonic DX.
- Define **clear schema** with Query, Mutation, Subscription.
- Integrate **Pydantic validation**.
- Secure with **Depends/Auth**.
- Add **GraphQL Playground** for dev.
- For production, enable **caching & batching** (e.g., dataloaders).
