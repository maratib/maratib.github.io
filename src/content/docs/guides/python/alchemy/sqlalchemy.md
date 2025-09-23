---
title: SQLAlchemy ORM
slug: guides/python/alchemy/sqlalchemy
description: SQLAlchemy ORM
sidebar:
  order: 0
---

SQLAlchemy ORM comprehensively, covering everything from basic concepts to advanced patterns.

## 1. Core Concepts

### What is SQLAlchemy ORM?

- **Object-Relational Mapping**: Maps Python classes to database tables
- **Session**: Manages persistence operations for mapped objects
- **Unit of Work**: Tracks changes to objects and flushes them to database
- **Identity Map**: Ensures only one instance per database row

### Key Components:

- **Engine**: Database connectivity
- **Session**: Database conversation
- **Model**: Python class representing a table
- **Query**: API for database queries

## 2. Engine & Session Setup

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base

# Engine Configuration
engine = create_engine(
    # SQLite example
    "sqlite:///example.db",

    # PostgreSQL example
    # "postgresql://user:password@localhost/mydatabase",

    # MySQL example
    # "mysql+pymysql://user:password@localhost/mydatabase",

    # Connection options
    echo=True,  # Log SQL statements
    future=True,  # Use 2.0 style APIs
    pool_size=5,  # Connection pool size
    max_overflow=10,  # Additional connections beyond pool_size
    pool_pre_ping=True,  # Check connection validity
)

# Session Factory
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=True,  # Autoflush before queries
    autocommit=False,  # Don't autocommit
    expire_on_commit=True,  # Expire objects after commit
)

# Base class for models
Base = declarative_base()

# Context manager for sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## 3. Declarative Base & Models

### Basic Model Structure

```python
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, Numeric
from sqlalchemy.sql import func
from datetime import datetime

class User(Base):
    __tablename__ = 'users'  # Table name
    __table_args__ = (
        # Table-level constraints
        {'schema': 'public'},  # Schema name
    )

    # Primary key column
    id = Column(Integer, primary_key=True, autoincrement=True)

    # String columns with constraints
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False)

    # Text column for large content
    bio = Column(Text, nullable=True)

    # Numeric columns
    age = Column(Integer, nullable=True)
    salary = Column(Numeric(10, 2), nullable=True)  # Precision: 10 digits, 2 decimal places
    rating = Column(Float, nullable=True)

    # Boolean column
    is_active = Column(Boolean, default=True, nullable=False)

    # DateTime columns
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Custom methods
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
```

### Advanced Column Types and Constraints

```python
from sqlalchemy import Enum, JSON, ARRAY, LargeBinary
from enum import Enum as PyEnum

class UserRole(PyEnum):
    ADMIN = "admin"
    USER = "user"
    MODERATOR = "moderator"

class AdvancedUser(Base):
    __tablename__ = 'advanced_users'

    id = Column(Integer, primary_key=True)

    # Enum column
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)

    # JSON column for flexible data
    preferences = Column(JSON, default=dict)

    # Array column (PostgreSQL specific)
    tags = Column(ARRAY(String), default=[])

    # Binary data
    avatar = Column(LargeBinary, nullable=True)

    # Computed column (SQLAlchemy 1.3.11+)
    # full_name = Column(String, computed='first_name + " " + last_name')
```

### Table Configuration Options

```python
from sqlalchemy import UniqueConstraint, CheckConstraint, Index

class ConfiguredUser(Base):
    __tablename__ = 'configured_users'

    # Table-level constraints
    __table_args__ = (
        # Unique constraint across multiple columns
        UniqueConstraint('email', 'company_id', name='uq_email_company'),

        # Check constraint
        CheckConstraint('age >= 0', name='check_age_positive'),

        # Index on multiple columns
        Index('ix_email_active', 'email', 'is_active'),

        # Table comment
        {'comment': 'Users table with advanced configuration'}
    )

    id = Column(Integer, primary_key=True)
    email = Column(String(100), nullable=False)
    company_id = Column(Integer, nullable=False)
    age = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
```

## 4. Basic CRUD Operations

### Create (Insert)

```python
from sqlalchemy.orm import Session

# Create a new session
db = SessionLocal()

# Create single object
new_user = User(
    username="john_doe",
    email="john@example.com",
    age=30,
    salary=50000.00
)
db.add(new_user)
db.commit()  # Persist to database
db.refresh(new_user)  # Refresh to get database-generated values (like ID)

print(f"Created user with ID: {new_user.id}")

# Create multiple objects
users = [
    User(username="alice", email="alice@example.com"),
    User(username="bob", email="bob@example.com"),
    User(username="charlie", email="charlie@example.com"),
]
db.add_all(users)
db.commit()

# Bulk insert (faster for large datasets)
user_data = [
    {"username": "user1", "email": "user1@example.com"},
    {"username": "user2", "email": "user2@example.com"},
]
db.bulk_insert_mappings(User, user_data)
db.commit()
```

### Read (Select)

```python
# Get by primary key
user = db.get(User, 1)  # Returns None if not found
user = db.query(User).get(1)  # Alternative syntax

# Get first matching record
user = db.query(User).filter(User.username == "john_doe").first()

# Get all records
all_users = db.query(User).all()

# Get one or raise exception
user = db.query(User).filter(User.username == "john_doe").one()

# Check if exists
exists = db.query(User.id).filter(User.username == "john_doe").first() is not None
```

### Update

```python
# Update single object
user = db.query(User).filter(User.username == "john_doe").first()
if user:
    user.age = 31
    user.salary = 55000.00
    db.commit()

# Bulk update
db.query(User).filter(User.is_active == False).update(
    {"is_active": True},
    synchronize_session=False
)
db.commit()

# Update with returning values (PostgreSQL)
updated_count = db.query(User).filter(User.age < 25).update(
    {"salary": User.salary * 1.1},
    synchronize_session=False
)
db.commit()
print(f"Updated {updated_count} users")
```

### Delete

```python
# Delete single object
user = db.query(User).filter(User.username == "john_doe").first()
if user:
    db.delete(user)
    db.commit()

# Bulk delete
deleted_count = db.query(User).filter(User.is_active == False).delete(
    synchronize_session=False
)
db.commit()
print(f"Deleted {deleted_count} users")
```

## 5. Relationships

### One-to-Many Relationship

```python
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Department(Base):
    __tablename__ = 'departments'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)

    # Relationship (one department has many employees)
    employees = relationship("Employee", back_populates="department")

    def __repr__(self):
        return f"<Department(id={self.id}, name='{self.name}')>"

class Employee(Base):
    __tablename__ = 'employees'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    department_id = Column(Integer, ForeignKey('departments.id'), nullable=False)

    # Relationship (many employees belong to one department)
    department = relationship("Department", back_populates="employees")

    def __repr__(self):
        return f"<Employee(id={self.id}, name='{self.name}')>"

# Usage
db = SessionLocal()

# Create department with employees
it_dept = Department(name="IT")
it_dept.employees = [
    Employee(name="Alice"),
    Employee(name="Bob")
]
db.add(it_dept)
db.commit()

# Query with relationships
dept = db.query(Department).filter(Department.name == "IT").first()
print(f"Department: {dept.name}")
print("Employees:", [emp.name for emp in dept.employees])

# Query employees with department
emp = db.query(Employee).filter(Employee.name == "Alice").first()
print(f"Employee: {emp.name}, Department: {emp.department.name}")
```

### Many-to-Many Relationship

```python
# Association table for many-to-many
student_course_association = Table(
    'student_courses', Base.metadata,
    Column('student_id', Integer, ForeignKey('students.id'), primary_key=True),
    Column('course_id', Integer, ForeignKey('courses.id'), primary_key=True),
    Column('enrolled_at', DateTime, default=datetime.utcnow)
)

class Student(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)

    courses = relationship(
        "Course",
        secondary=student_course_association,
        back_populates="students"
    )

class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)

    students = relationship(
        "Student",
        secondary=student_course_association,
        back_populates="courses"
    )

# Usage
db = SessionLocal()

# Create students and courses
math = Course(title="Mathematics")
physics = Course(title="Physics")

alice = Student(name="Alice", courses=[math, physics])
bob = Student(name="Bob", courses=[math])

db.add_all([alice, bob, math, physics])
db.commit()

# Query many-to-many
student = db.query(Student).filter(Student.name == "Alice").first()
print(f"Student: {student.name}")
print("Courses:", [course.title for course in student.courses])

course = db.query(Course).filter(Course.title == "Mathematics").first()
print(f"Course: {course.title}")
print("Students:", [student.name for student in course.students])
```

### One-to-One Relationship

```python
class UserProfile(Base):
    __tablename__ = 'user_profiles'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    bio = Column(Text)
    website = Column(String(200))

    user = relationship("User", back_populates="profile", uselist=False)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)

    profile = relationship("UserProfile", back_populates="user", uselist=False)

# Usage
user = User(username="john")
profile = UserProfile(bio="Software developer", website="example.com")
user.profile = profile

db.add(user)
db.commit()

# Access one-to-one
user = db.query(User).filter(User.username == "john").first()
print(f"User: {user.username}, Bio: {user.profile.bio}")
```

## 6. Querying

### Basic Query Methods

```python
from sqlalchemy import and_, or_, not_

db = SessionLocal()

# Filtering
users = db.query(User).filter(User.age > 25).all()
users = db.query(User).filter(User.username.in_(["alice", "bob"])).all()

# Multiple filters
users = db.query(User).filter(
    User.age > 25,
    User.is_active == True
).all()

# OR conditions
users = db.query(User).filter(
    or_(User.age < 25, User.age > 60)
).all()

# NOT conditions
users = db.query(User).filter(
    not_(User.is_active)
).all()

# LIKE and ILIKE (case-insensitive)
users = db.query(User).filter(User.username.like("j%")).all()  # Starts with j
users = db.query(User).filter(User.username.ilike("j%")).all()  # Case-insensitive

# NULL checks
users = db.query(User).filter(User.bio.is_(None)).all()  # IS NULL
users = db.query(User).filter(User.bio.is_not(None)).all()  # IS NOT NULL
```

### Sorting and Limiting

```python
# Order by
users = db.query(User).order_by(User.username).all()
users = db.query(User).order_by(User.age.desc()).all()

# Multiple sort criteria
users = db.query(User).order_by(User.is_active.desc(), User.username).all()

# Limit and offset (pagination)
users = db.query(User).order_by(User.id).limit(10).offset(20).all()

# Distinct
distinct_ages = db.query(User.age).distinct().all()
```

### Aggregation and Grouping

```python
from sqlalchemy import func

# Count
user_count = db.query(func.count(User.id)).scalar()
active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()

# Average, Sum, Min, Max
avg_age = db.query(func.avg(User.age)).scalar()
total_salary = db.query(func.sum(User.salary)).scalar()
min_age = db.query(func.min(User.age)).scalar()
max_age = db.query(func.max(User.age)).scalar()

# Group by
age_groups = db.query(
    User.age,
    func.count(User.id)
).group_by(User.age).all()

# Having clause
age_groups = db.query(
    User.age,
    func.count(User.id).label('user_count')
).group_by(User.age).having(func.count(User.id) > 5).all()
```

## 7. Advanced Query Techniques

### Joins

```python
# Implicit join (using relationships)
employees = db.query(Employee, Department).join(Employee.department).all()

# Explicit join
employees = db.query(Employee, Department).join(Department, Employee.department_id == Department.id).all()

# Left outer join
employees = db.query(Employee, Department).outerjoin(Employee.department).all()

# Multiple joins
result = (db.query(Student, Course)
          .join(student_course_association)
          .join(Course)
          .filter(Course.title == "Mathematics")
          .all())

# Self-join (for hierarchical data)
class Employee(Base):
    __tablename__ = 'employees'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    manager_id = Column(Integer, ForeignKey('employees.id'))
    manager = relationship("Employee", remote_side=[id], backref="subordinates")

# Query with self-join
managers_with_subordinates = (db.query(Employee)
                             .join(Employee.subordinates)
                             .group_by(Employee.id)
                             .having(func.count(Employee.subordinates) > 0)
                             .all())
```

### Subqueries

```python
from sqlalchemy import select

# Subquery in FROM clause
subq = (db.query(
    Department.id.label('dept_id'),
    func.count(Employee.id).label('emp_count')
)
.group_by(Department.id)
.subquery())

dept_counts = db.query(Department.name, subq.c.emp_count).join(
    subq, Department.id == subq.c.dept_id
).all()

# Subquery in WHERE clause
subq = db.query(Employee.department_id).filter(Employee.salary > 50000).subquery()
high_paying_depts = db.query(Department).filter(Department.id.in_(subq)).all()

# Correlated subquery
subq = (db.query(func.count(Employee.id))
        .filter(Employee.department_id == Department.id)
        .correlate(Department)
        .scalar_subquery())

depts_with_count = db.query(Department.name, subq.label('employee_count')).all()
```

### Eager Loading (to avoid N+1 queries)

```python
from sqlalchemy.orm import joinedload, selectinload, subqueryload

# Eager load relationships to avoid additional queries

# joinedload (uses JOIN)
employees = (db.query(Employee)
             .options(joinedload(Employee.department))
             .all())
# Single query with JOIN

# selectinload (uses IN clause, better for collections)
departments = (db.query(Department)
               .options(selectinload(Department.employees))
               .all())

# Multiple eager loads
employees = (db.query(Employee)
             .options(
                 joinedload(Employee.department),
                 selectinload(Employee.projects)
             )
             .all())

# Load only specific columns
employees = (db.query(Employee)
             .options(
                 joinedload(Employee.department).load_only(Department.name)
             )
             .all())
```

## 8. Session Management

### Session States

```python
db = SessionLocal()

# Transient - not in session, not in database
new_user = User(username="new_user")
print(db.is_modified(new_user))  # False

# Pending - added to session, not flushed
db.add(new_user)
print(new_user in db)  # True
print(db.is_modified(new_user, include_pending=True))  # True

# Flushed - SQL generated but not committed
db.flush()
print(new_user.id)  # Now has ID from database

# Committed - changes persisted
db.commit()

# Expired - attributes need to be reloaded
print(new_user.username)  # Triggers lazy load

# Detached - session closed, object no longer associated
db.close()
print(new_user in db)  # False
```

### Session Lifecycle Patterns

```python
# Pattern 1: Context manager
with SessionLocal() as session:
    user = session.get(User, 1)
    user.username = "updated"
    session.commit()

# Pattern 2: Explicit commit/rollback
session = SessionLocal()
try:
    user = User(username="test")
    session.add(user)
    session.commit()
except Exception:
    session.rollback()
    raise
finally:
    session.close()

# Pattern 3: Using scoped sessions (for web applications)
from sqlalchemy.orm import scoped_session

session_factory = sessionmaker(bind=engine)
ScopedSession = scoped_session(session_factory)

# In web request
def handle_request():
    session = ScopedSession()
    try:
        # Use session
        user = session.get(User, 1)
        return user
    finally:
        ScopedSession.remove()
```

## 9. Transactions

### Basic Transaction Management

```python
db = SessionLocal()

try:
    # Start transaction implicitly

    # Operation 1
    user1 = User(username="user1")
    db.add(user1)

    # Operation 2
    user2 = User(username="user2")
    db.add(user2)

    # Commit both operations
    db.commit()

except Exception as e:
    # Rollback on error
    db.rollback()
    print(f"Transaction failed: {e}")

finally:
    db.close()
```

### Nested Transactions (SAVEPOINT)

```python
db = SessionLocal()

try:
    user = User(username="main_user")
    db.add(user)
    db.flush()  # Flush to get user ID

    # Create savepoint
    savepoint = db.begin_nested()

    try:
        # Nested operations
        profile = UserProfile(user_id=user.id, bio="Test bio")
        db.add(profile)
        db.flush()

        # If this fails, only rollback to savepoint
        if some_condition:
            raise ValueError("Something went wrong")

        savepoint.commit()

    except Exception:
        savepoint.rollback()
        print("Nested transaction rolled back")
        # Main transaction continues

    db.commit()

except Exception:
    db.rollback()
```

### Transaction Isolation Levels

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Set isolation level at engine level
engine = create_engine(
    "postgresql://user:pass@localhost/db",
    isolation_level="REPEATABLE_READ"
)

# Or set at session level
session = sessionmaker(bind=engine)
with session() as s:
    s.connection(execution_options={"isolation_level": "SERIALIZABLE"})
    # Transaction with specific isolation level
```

## 10. Advanced Patterns

### Hybrid Properties and Expressions

```python
from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    birth_date = Column(DateTime)

    @hybrid_property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @full_name.expression
    def full_name(cls):
        return cls.first_name + ' ' + cls.last_name

    @hybrid_property
    def age(self):
        if self.birth_date:
            return (datetime.now() - self.birth_date).days // 365
        return None

    @age.expression
    def age(cls):
        return func.extract('year', func.age(cls.birth_date))

    @hybrid_method
    def is_older_than(self, years):
        return self.age > years if self.age else False

    @is_older_than.expression
    def is_older_than(cls, years):
        return func.extract('year', func.age(cls.birth_date)) > years

# Usage
db.query(User).filter(User.full_name == "John Doe").all()
db.query(User).filter(User.age > 25).all()
db.query(User).filter(User.is_older_than(30)).all()
```

### Custom Query Class

```python
from sqlalchemy.orm import Query

class UserQuery(Query):
    def active(self):
        return self.filter(User.is_active == True)

    def by_age_range(self, min_age, max_age):
        return self.filter(User.age >= min_age, User.age <= max_age)

    def with_profile(self):
        return self.options(joinedload(User.profile))

# Use custom query class
SessionLocal = sessionmaker(bind=engine, query_cls=UserQuery)
db = SessionLocal()

# Use custom methods
active_users = db.query(User).active().all()
young_users = db.query(User).active().by_age_range(18, 25).with_profile().all()
```

### Event Listeners

```python
from sqlalchemy import event

# Model event listeners
@event.listens_for(User, 'before_insert')
def before_insert_listener(mapper, connection, target):
    target.created_at = datetime.utcnow()
    target.updated_at = datetime.utcnow()

@event.listens_for(User, 'before_update')
def before_update_listener(mapper, connection, target):
    target.updated_at = datetime.utcnow()

# Session event listeners
@event.listens_for(SessionLocal, 'after_begin')
def after_begin_listener(session, transaction, connection):
    print("Session began")

@event.listens_for(SessionLocal, 'before_commit')
def before_commit_listener(session):
    print("About to commit")

# Engine event listeners
@event.listens_for(engine, 'connect')
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()
```

### Polymorphic Inheritance

```python
class Person(Base):
    __tablename__ = 'person'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    type = Column(String(20))

    __mapper_args__ = {
        'polymorphic_identity': 'person',
        'polymorphic_on': type
    }

class Employee(Person):
    __tablename__ = 'employee'
    id = Column(Integer, ForeignKey('person.id'), primary_key=True)
    employee_id = Column(String(20))

    __mapper_args__ = {
        'polymorphic_identity': 'employee',
    }

class Manager(Person):
    __tablename__ = 'manager'
    id = Column(Integer, ForeignKey('person.id'), primary_key=True)
    department = Column(String(50))

    __mapper_args__ = {
        'polymorphic_identity': 'manager',
    }

# Usage
employee = Employee(name="John", employee_id="E123")
manager = Manager(name="Jane", department="IT")

db.add_all([employee, manager])
db.commit()

# Query polymorphically
people = db.query(Person).all()  # Returns both employees and managers
employees = db.query(Employee).all()  # Returns only employees
```

This comprehensive guide covers SQLAlchemy ORM from basic to advanced concepts. The key to mastering SQLAlchemy is practice and understanding the session lifecycle and relationship patterns.
