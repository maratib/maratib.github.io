---
title: Dunder Methods
description: Dunder Methods
---

- **Dunder methods** (double underscore methods) are special Python methods with double underscores like `__init__`, `__str__`, `__add__`.

- They allow custom classes to behave like built-in types by defining how objects respond to operations (like +, -, print, etc.).

- **We need dunder methods** to make our custom objects work seamlessly with Python's syntax and built-in functions.

- They enable operator overloading, string representation, iteration, context management, and other Pythonic behaviors for our classes.

**Examples:**

- `__init__` for object initialization
- `__str__` for readable string representation
- `__add__` to define + operator behavior
- `__len__` to make objects work with len() function

**In short:** Dunder methods make our custom classes act like native Python objects.

## What is `__init__`?

**`__init__`** is a special method (constructor) that gets automatically called when you create a new instance of a class. It's used to initialize the object's attributes.

```python
class Person:
    def __init__(self, name, age):
        self.name = name  # Initialize instance attributes
        self.age = age

# __init__ is called automatically here
person = Person("Alice", 30)
```

---

### 1. **Object Creation and Initialization**

#### `__new__(cls, ...)`

- **Called before** `__init__`
- Responsible for **creating** the instance
- Returns the new object instance
- Rarely overridden except for metaclasses or immutable types

```python
class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

# Interview Question: Why use __new__ over __init__ for Singleton?
```

#### `__init__(self, ...)`

- **Initializes** the newly created object
- Doesn't return anything (should return `None`)
- Most commonly overridden dunder method

```python
class DatabaseConnection:
    def __init__(self, host, port, timeout=30):
        self.host = host
        self.port = port
        self.timeout = timeout
        self.connected = False
```

#### `__del__(self)`

- **Destructor** - called when object is about to be destroyed
- Not guaranteed to be called immediately
- Used for cleanup operations

```python
class FileHandler:
    def __init__(self, filename):
        self.file = open(filename, 'r')

    def __del__(self):
        if hasattr(self, 'file') and self.file:
            self.file.close()
```

### 2. **String Representation**

#### `__str__(self)` vs `__repr__(self)`

**Interview Question: Difference between **str** and **repr**?**

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __str__(self):
        """Readable representation for end users"""
        return f"Person(name='{self.name}', age={self.age})"

    def __repr__(self):
        """Unambiguous representation for developers"""
        return f"Person('{self.name}', {self.age})"

person = Person("Alice", 30)
print(str(person))   # Person(name='Alice', age=30)
print(repr(person))  # Person('Alice', 30)
```

**Key Differences:**

- `__str__`: For end users, informal, readable
- `__repr__`: For developers, should be unambiguous, ideally can recreate object

### 3. **Comparison Methods**

```python
class Money:
    def __init__(self, amount, currency):
        self.amount = amount
        self.currency = currency

    def __eq__(self, other):
        """Equal to (==)"""
        if not isinstance(other, Money):
            return NotImplemented
        return self.amount == other.amount and self.currency == other.currency

    def __lt__(self, other):
        """Less than (<)"""
        if not isinstance(other, Money) or self.currency != other.currency:
            return NotImplemented
        return self.amount < other.amount

    def __le__(self, other):
        """Less than or equal to (<=)"""
        return self < other or self == other

    # Similarly: __gt__, __ge__, __ne__
```

### 4. **Arithmetic Operations**

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        """Addition (+)"""
        if isinstance(other, Vector):
            return Vector(self.x + other.x, self.y + other.y)
        return NotImplemented

    def __sub__(self, other):
        """Subtraction (-)"""
        if isinstance(other, Vector):
            return Vector(self.x - other.x, self.y - other.y)
        return NotImplemented

    def __mul__(self, scalar):
        """Multiplication (*)"""
        if isinstance(scalar, (int, float)):
            return Vector(self.x * scalar, self.y * scalar)
        return NotImplemented

    def __rmul__(self, scalar):
        """Reverse multiplication"""
        return self.__mul__(scalar)
```

### 5. **Container Methods (List-like/Dict-like Behavior)**

#### For list-like objects:

```python
class Playlist:
    def __init__(self, songs):
        self.songs = list(songs)

    def __len__(self):
        """len(obj)"""
        return len(self.songs)

    def __getitem__(self, index):
        """obj[index]"""
        return self.songs[index]

    def __setitem__(self, index, value):
        """obj[index] = value"""
        self.songs[index] = value

    def __contains__(self, item):
        """item in obj"""
        return item in self.songs

    def __iter__(self):
        """for song in playlist:"""
        return iter(self.songs)
```

#### For dict-like objects:

```python
class Config:
    def __init__(self):
        self._data = {}

    def __getitem__(self, key):
        return self._data[key]

    def __setitem__(self, key, value):
        self._data[key] = value

    def __delitem__(self, key):
        del self._data[key]

    def __contains__(self, key):
        return key in self._data
```

### 6. **Callable Objects (`__call__`)**

```python
class Counter:
    def __init__(self):
        self.count = 0

    def __call__(self):
        """Make instance callable like a function"""
        self.count += 1
        return self.count

counter = Counter()
print(counter())  # 1
print(counter())  # 2
print(counter())  # 3
```

### 7. **Context Managers (`__enter__`, `__exit__`)**

```python
class DatabaseTransaction:
    def __init__(self, db):
        self.db = db

    def __enter__(self):
        """Called when entering 'with' block"""
        self.db.begin_transaction()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Called when exiting 'with' block"""
        if exc_type is None:
            self.db.commit()
        else:
            self.db.rollback()

# Usage:
# with DatabaseTransaction(db) as transaction:
#     # do database operations
```

### 8. **Attribute Access Control**

```python
class ProtectedClass:
    def __init__(self):
        self._protected = "protected"
        self.__private = "private"  # Name mangling

    def __getattr__(self, name):
        """Called when attribute not found"""
        return f"Attribute {name} not found"

    def __setattr__(self, name, value):
        """Called when setting any attribute"""
        if name == "readonly":
            raise AttributeError("readonly attribute cannot be set")
        super().__setattr__(name, value)

    def __getattribute__(self, name):
        """Called for EVERY attribute access"""
        return super().__getattribute__(name)
```

### Q1: **What's the difference between `__init__` and `__new__`?**

**A:** `__new__` creates the object, `__init__` initializes it. `__new__` is called first and must return an instance. `__init__` is called after and returns `None`.

### Q2: **When would you use `__call__` vs regular methods?**

**A:** Use `__call__` when you want the instance itself to be callable like a function (e.g., decorator classes, functors).

### Q3: **Why implement `__repr__`?**

**A:** For debugging and development. A good `__repr__` should allow recreating the object: `eval(repr(obj)) == obj`.

### Q4: **What is operator overloading?**

**A:** Using dunder methods like `__add__`, `__sub__` to define how operators work with custom objects.

### Q5: **What's name mangling in Python?**

**A:** Double underscore prefix (`__private`) causes name mangling: `__private` becomes `_ClassName__private`.

## Advanced Example: Complete Custom Class

```python
class BankAccount:
    """Complete example with multiple dunder methods"""

    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance  # Protected attribute

    def __repr__(self):
        return f"BankAccount('{self.owner}', {self._balance})"

    def __str__(self):
        return f"Account of {self.owner}: ${self._balance}"

    def __eq__(self, other):
        if not isinstance(other, BankAccount):
            return NotImplemented
        return self._balance == other._balance

    def __lt__(self, other):
        if not isinstance(other, BankAccount):
            return NotImplemented
        return self._balance < other._balance

    def __add__(self, other):
        """Merge two accounts"""
        if not isinstance(other, BankAccount):
            return NotImplemented
        new_balance = self._balance + other._balance
        return BankAccount(f"{self.owner}&{other.owner}", new_balance)

    def __enter__(self):
        """Context manager for transactions"""
        self._transaction_log = []
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Commit or rollback transactions"""
        if exc_type is None:
            print(f"Transactions completed: {self._transaction_log}")
        else:
            print("Transaction failed - rolling back")
        self._transaction_log = []

    # Regular methods
    def deposit(self, amount):
        self._balance += amount
        if hasattr(self, '_transaction_log'):
            self._transaction_log.append(f"Deposit: +${amount}")

    def withdraw(self, amount):
        if amount <= self._balance:
            self._balance -= amount
            if hasattr(self, '_transaction_log'):
                self._transaction_log.append(f"Withdraw: -${amount}")
            return True
        return False
```

## Key Points

1. **`__init__` is not a constructor** - `__new__` is the actual constructor
2. **Always return `NotImplemented`** for unsupported operations in comparison methods
3. **`__str__` for users, `__repr__` for developers**
4. **Context managers** (`__enter__/__exit__`) are great for resource management
5. **Use dunder methods sparingly** - only when they make sense for your class
6. **Understand name mangling** for "private" attributes
