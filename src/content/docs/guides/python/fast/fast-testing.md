---
title: Fast API Testing
slug: guides/python/fast/fast-testing
description: Fast API Testing
sidebar:
  order: 4
---

A complete FastAPI project for a simple Book API with comprehensive testing.

## Project Structure

```
bookstore_api/
├── main.py
├── models.py
├── crud.py
├── database.py
├── test_main.py
├── requirements.txt
└── README.md
```

### Step 1: Setup and Dependencies

**requirements.txt**

```txt
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
python-multipart==0.0.6
```

**Explanation**: These packages include FastAPI, the ASGI server, database toolkit, testing framework, and HTTP client for testing.

### Step 2: Database Models

**database.py**

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./books.db"

# Create engine - SQLite specific configuration needed
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite specific
)

# SessionLocal class for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Explanation**:

- Sets up SQLAlchemy with SQLite database
- `SessionLocal` creates database sessions
- `get_db()` dependency injects database sessions into routes
- SQLite requires `check_same_thread=False` for FastAPI's async nature

### Step 3: Data Models

**models.py**

```python
from sqlalchemy import Column, Integer, String, Float
from database import Base
from pydantic import BaseModel
from typing import Optional

# SQLAlchemy Model (Database Table)
class BookDB(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    author = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    genre = Column(String, index=True, nullable=True)

# Pydantic Models (Request/Response Schemas)
class BookCreate(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    price: float
    genre: Optional[str] = None

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    genre: Optional[str] = None

class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    description: Optional[str] = None
    price: float
    genre: Optional[str] = None

    class Config:
        from_attributes = True  # Allows ORM mode (formerly orm_mode)
```

**Explanation**:

- `BookDB`: SQLAlchemy model representing database table
- `BookCreate`: Pydantic model for creating new books (request body)
- `BookUpdate`: Pydantic model for partial updates (all fields optional)
- `BookResponse`: Pydantic model for API responses
- `from_attributes = True` allows converting SQLAlchemy objects to Pydantic models

### Step 4: CRUD Operations

**crud.py**

```python
from sqlalchemy.orm import Session
from models import BookDB, BookCreate, BookUpdate
from sqlalchemy import select

# Create a new book
def create_book(db: Session, book: BookCreate) -> BookDB:
    db_book = BookDB(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

# Get all books with optional filtering
def get_books(db: Session, skip: int = 0, limit: int = 100, genre: str = None):
    query = select(BookDB)
    if genre:
        query = query.where(BookDB.genre == genre)
    query = query.offset(skip).limit(limit)
    return db.execute(query).scalars().all()

# Get a single book by ID
def get_book(db: Session, book_id: int) -> BookDB:
    return db.get(BookDB, book_id)

# Update a book
def update_book(db: Session, book_id: int, book_update: BookUpdate) -> BookDB:
    db_book = db.get(BookDB, book_id)
    if db_book:
        update_data = book_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_book, field, value)
        db.commit()
        db.refresh(db_book)
    return db_book

# Delete a book
def delete_book(db: Session, book_id: int) -> bool:
    db_book = db.get(BookDB, book_id)
    if db_book:
        db.delete(db_book)
        db.commit()
        return True
    return False
```

**Explanation**:

- CRUD functions handle database operations
- `create_book`: Adds new book to database
- `get_books`: Retrieves books with pagination and filtering
- `get_book`: Gets single book by ID
- `update_book`: Partially updates book using `exclude_unset=True`
- `delete_book`: Removes book and returns success status

### Step 5: FastAPI Application

**main.py**

```python
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db, engine
from models import BookDB, BookCreate, BookUpdate, BookResponse
from crud import create_book, get_books, get_book, update_book, delete_book

# Create database tables
BookDB.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="BookStore API",
    description="A simple REST API for managing books",
    version="1.0.0"
)

# Health check endpoint
@app.get("/", tags=["Health"])
async def root():
    return {"message": "BookStore API is running!"}

# Create a new book
@app.post("/books/", response_model=BookResponse, status_code=status.HTTP_201_CREATED, tags=["Books"])
async def create_new_book(book: BookCreate, db: Session = Depends(get_db)):
    """
    Create a new book in the database.

    - **title**: Book title (required)
    - **author**: Book author (required)
    - **description**: Book description (optional)
    - **price**: Book price (required)
    - **genre**: Book genre (optional)
    """
    return create_book(db=db, book=book)

# Get all books
@app.get("/books/", response_model=List[BookResponse], tags=["Books"])
async def read_books(
    skip: int = 0,
    limit: int = 100,
    genre: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve all books with optional filtering and pagination.

    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **genre**: Filter by genre (optional)
    """
    books = get_books(db=db, skip=skip, limit=limit, genre=genre)
    return books

# Get a single book by ID
@app.get("/books/{book_id}", response_model=BookResponse, tags=["Books"])
async def read_book(book_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific book by its ID.

    - **book_id**: The ID of the book to retrieve
    """
    db_book = get_book(db=db, book_id=book_id)
    if db_book is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    return db_book

# Update a book
@app.put("/books/{book_id}", response_model=BookResponse, tags=["Books"])
async def update_existing_book(book_id: int, book: BookUpdate, db: Session = Depends(get_db)):
    """
    Update an existing book's information.

    - **book_id**: The ID of the book to update
    - All fields are optional - only provided fields will be updated
    """
    db_book = update_book(db=db, book_id=book_id, book_update=book)
    if db_book is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    return db_book

# Delete a book
@app.delete("/books/{book_id}", tags=["Books"])
async def delete_existing_book(book_id: int, db: Session = Depends(get_db)):
    """
    Delete a book from the database.

    - **book_id**: The ID of the book to delete
    """
    success = delete_book(db=db, book_id=book_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    return {"message": "Book deleted successfully"}

# Search books by title or author
@app.get("/books/search/", response_model=List[BookResponse], tags=["Books"])
async def search_books(query: str, db: Session = Depends(get_db)):
    """
    Search books by title or author using a query string.

    - **query**: Search term to look for in book titles or authors
    """
    from sqlalchemy import or_
    books = db.query(BookDB).filter(
        or_(
            BookDB.title.contains(query),
            BookDB.author.contains(query)
        )
    ).all()
    return books
```

**Explanation**:

- Creates all endpoints with proper HTTP status codes
- Uses dependency injection for database sessions
- Includes comprehensive error handling with HTTP exceptions
- Provides detailed docstrings for automatic API documentation
- Implements search functionality with SQLAlchemy filters

### Step 6: Testing Setup

**test_main.py**

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from database import get_db
from models import BookDB, Base

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Test data
TEST_BOOK = {
    "title": "Test Book",
    "author": "Test Author",
    "description": "A test book description",
    "price": 29.99,
    "genre": "Fiction"
}

@pytest.fixture(scope="function")
def setup_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "BookStore API is running!"}

def test_create_book_success(setup_database):
    """Test successful book creation"""
    response = client.post("/books/", json=TEST_BOOK)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == TEST_BOOK["title"]
    assert data["author"] == TEST_BOOK["author"]
    assert data["price"] == TEST_BOOK["price"]
    assert "id" in data

def test_create_book_validation_error():
    """Test book creation with invalid data"""
    invalid_book = TEST_BOOK.copy()
    invalid_book["price"] = -10  # Invalid price
    response = client.post("/books/", json=invalid_book)
    assert response.status_code == 422  # Validation error

def test_get_books_empty(setup_database):
    """Test getting books when database is empty"""
    response = client.get("/books/")
    assert response.status_code == 200
    assert response.json() == []

def test_get_books_with_data(setup_database):
    """Test getting books after creating some"""
    # Create a book first
    client.post("/books/", json=TEST_BOOK)

    response = client.get("/books/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == TEST_BOOK["title"]

def test_get_single_book_success(setup_database):
    """Test getting a specific book"""
    # Create a book first
    create_response = client.post("/books/", json=TEST_BOOK)
    book_id = create_response.json()["id"]

    response = client.get(f"/books/{book_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == book_id
    assert data["title"] == TEST_BOOK["title"]

def test_get_single_book_not_found(setup_database):
    """Test getting a non-existent book"""
    response = client.get("/books/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Book not found"

def test_update_book_success(setup_database):
    """Test successful book update"""
    # Create a book first
    create_response = client.post("/books/", json=TEST_BOOK)
    book_id = create_response.json()["id"]

    update_data = {"title": "Updated Title", "price": 39.99}
    response = client.put(f"/books/{book_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["price"] == 39.99
    # Ensure other fields remain unchanged
    assert data["author"] == TEST_BOOK["author"]

def test_update_book_not_found(setup_database):
    """Test updating a non-existent book"""
    update_data = {"title": "Updated Title"}
    response = client.put("/books/999", json=update_data)
    assert response.status_code == 404

def test_delete_book_success(setup_database):
    """Test successful book deletion"""
    # Create a book first
    create_response = client.post("/books/", json=TEST_BOOK)
    book_id = create_response.json()["id"]

    # Delete the book
    response = client.delete(f"/books/{book_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Book deleted successfully"

    # Verify book is gone
    get_response = client.get(f"/books/{book_id}")
    assert get_response.status_code == 404

def test_delete_book_not_found(setup_database):
    """Test deleting a non-existent book"""
    response = client.delete("/books/999")
    assert response.status_code == 404

def test_search_books(setup_database):
    """Test book search functionality"""
    # Create test books
    books = [
        {"title": "Python Programming", "author": "John Doe", "price": 49.99},
        {"title": "Java Basics", "author": "Jane Smith", "price": 39.99},
        {"title": "Advanced Python", "author": "John Doe", "price": 59.99}
    ]

    for book in books:
        client.post("/books/", json=book)

    # Search by title
    response = client.get("/books/search/?query=Python")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all("Python" in book["title"] for book in data)

    # Search by author
    response = client.get("/books/search/?query=John")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all("John" in book["author"] for book in data)

def test_filter_books_by_genre(setup_database):
    """Test filtering books by genre"""
    books = [
        {**TEST_BOOK, "genre": "Fiction"},
        {**TEST_BOOK, "title": "Sci-Fi Book", "genre": "Science Fiction"},
        {**TEST_BOOK, "title": "Another Fiction", "genre": "Fiction"}
    ]

    for book in books:
        client.post("/books/", json=book)

    response = client.get("/books/?genre=Fiction")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all(book["genre"] == "Fiction" for book in data)

def test_pagination(setup_database):
    """Test pagination functionality"""
    # Create multiple books
    for i in range(5):
        book = TEST_BOOK.copy()
        book["title"] = f"Book {i+1}"
        client.post("/books/", json=book)

    # Test limit
    response = client.get("/books/?limit=3")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3

    # Test skip
    response = client.get("/books/?skip=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3  # 5 total - 2 skipped = 3 remaining
```

**Explanation**:

- Uses in-memory SQLite database for isolated testing
- Overrides database dependency for testing
- Includes fixtures for database setup/teardown
- Tests all CRUD operations with various scenarios
- Tests edge cases and error conditions
- Tests search and filtering functionality

### Step 7: Running the Application

**Run the development server:**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Run tests:**

```bash
pytest test_main.py -v
```

### Step 8: API Documentation

FastAPI automatically generates documentation:

- **Swagger UI**: localhost:8000/docs
- **ReDoc**: localhost:8000/redoc

### Key Features Demonstrated

1. **RESTful API Design**: Proper HTTP methods and status codes
2. **Database Integration**: SQLAlchemy with SQLite
3. **Validation**: Pydantic models for request/response validation
4. **Error Handling**: Comprehensive HTTP exception handling
5. **Testing**: Complete test suite with pytest
6. **Documentation**: Automatic OpenAPI documentation
7. **Dependency Injection**: Database session management
8. **Search & Filtering**: Advanced query capabilities
