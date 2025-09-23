---
title: OOP in Python
description: OOP in Python
---

Python Object-Oriented Programming (OOP)

## 1. Core OOP Concepts

- Foundation principles that define Object-Oriented Programming
- The four main pillars that all OOP is built upon

### Four Pillars of OOP:

1. **Encapsulation**: Bundling data and methods together
2. **Inheritance**: Creating new classes from existing ones
3. **Polymorphism**: Same interface, different implementations
4. **Abstraction**: Hiding complex implementation details

---

## 2. Classes & Objects

- Basic building blocks of OOP - blueprints and instances
- Creating classes, instantiate objects, and basic class structure

### Basic Class Structure

```python
class Car:
    # Class attribute (shared by all instances)
    wheels = 4
    count = 0

    # Constructor (initializer)
    def __init__(self, brand, model, year):
        # Instance attributes (unique to each object)
        self.brand = brand
        self.model = model
        self.year = year
        self._mileage = 0  # Protected attribute
        self.__vin = self._generate_vin()  # Private attribute

        Car.count += 1  # Modify class attribute

    # Instance method
    def drive(self, miles):
        self._mileage += miles
        return f"Driven {miles} miles. Total mileage: {self._mileage}"

    # Private method (name mangling)
    def _generate_vin(self):
        return f"VIN_{self.brand}_{self.model}_{id(self)}"

    # String representation
    def __str__(self):
        return f"{self.year} {self.brand} {self.model}"

    def __repr__(self):
        return f"Car('{self.brand}', '{self.model}', {self.year})"

# Creating objects
car1 = Car("Toyota", "Camry", 2022)
car2 = Car("Honda", "Civic", 2023)

print(car1)  # 2022 Toyota Camry
print(car1.drive(100))  # Driven 100 miles. Total mileage: 100
```

### Class Methods and Static Methods

```python
class Car:
    # ... (previous code)

    @classmethod
    def from_string(cls, car_string):
        """Alternative constructor - class method"""
        brand, model, year = car_string.split('-')
        return cls(brand, model, int(year))

    @classmethod
    def get_total_cars(cls):
        """Method that works with class state"""
        return cls.count

    @staticmethod
    def is_vintage(year):
        """Utility method - doesn't need class/instance access"""
        return year < 1990

# Using class method as alternative constructor
car3 = Car.from_string("Ford-Mustang-2020")

# Using static method
print(Car.is_vintage(1985))  # True
```

---

## 3. Inheritance

- Creating new classes based on existing ones (parent-child relationship)
- Code reuse, method overriding, class hierarchies
- Prevents code duplication and creates logical relationships
  **Example**: `class ElectricCar(Vehicle):` - ElectricCar inherits from Vehicle

### Basic Inheritance

```python
class Vehicle:
    def __init__(self, brand, model, year):
        self.brand = brand
        self.model = model
        self.year = year
        self._mileage = 0

    def drive(self, miles):
        self._mileage += miles
        return f"Vehicle driven {miles} miles"

    def get_info(self):
        return f"{self.year} {self.brand} {self.model}"

# Inheritance
class ElectricCar(Vehicle):  # Inherits from Vehicle
    def __init__(self, brand, model, year, battery_size):
        super().__init__(brand, model, year)  # Call parent constructor
        self.battery_size = battery_size
        self.charge_level = 100

    # Method overriding
    def drive(self, miles):
        self._mileage += miles
        self.charge_level -= miles * 0.5  # 0.5% per mile
        return f"Electric car driven {miles} miles. Charge: {self.charge_level}%"

    # New method specific to ElectricCar
    def charge(self, percentage):
        self.charge_level = min(100, self.charge_level + percentage)
        return f"Charged to {self.charge_level}%"

# Using inheritance
tesla = ElectricCar("Tesla", "Model S", 2023, 100)
print(tesla.drive(50))  # Uses overridden method
print(tesla.charge(25)) # Uses ElectricCar specific method
```

### Multiple Inheritance

```python
class Engine:
    def __init__(self, horsepower):
        self.horsepower = horsepower

    def start(self):
        return "Engine started"

    def stop(self):
        return "Engine stopped"

class GPS:
    def __init__(self):
        self.location = "Unknown"

    def navigate(self, destination):
        self.location = destination
        return f"Navigating to {destination}"

# Multiple inheritance
class SmartCar(Vehicle, Engine, GPS):
    def __init__(self, brand, model, year, horsepower):
        Vehicle.__init__(self, brand, model, year)
        Engine.__init__(self, horsepower)
        GPS.__init__(self)

    def auto_drive(self, destination):
        self.start()
        route = self.navigate(destination)
        return f"Auto-driving: {route}"

# Method Resolution Order (MRO)
print(SmartCar.__mro__)  # Shows inheritance hierarchy

smart_car = SmartCar("Tesla", "Model X", 2023, 500)
print(smart_car.auto_drive("Home"))
```

### Abstract Base Classes

```python
from abc import ABC, abstractmethod

class Shape(ABC):  # Abstract base class
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

    # Concrete method in abstract class
    def describe(self):
        return f"This shape has area: {self.area()} and perimeter: {self.perimeter()}"

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

    def perimeter(self):
        return 2 * 3.14159 * self.radius

# Cannot instantiate abstract class
# shape = Shape()  # Error!

rect = Rectangle(5, 3)
circle = Circle(4)
print(rect.describe())
print(circle.describe())
```

---

## 4. Encapsulation

- Bundling data and methods together while controlling access
- Data hiding, access modifiers (public, protected, private)
- Protects data integrity and creates clean interfaces
  **Example**: Using `_protected` and `__private` attributes

### Access Modifiers

```python
class BankAccount:
    def __init__(self, account_holder, balance=0):
        self.account_holder = account_holder  # Public
        self._balance = balance               # Protected
        self.__account_number = self._generate_account_number()  # Private

    def _generate_account_number(self):
        # Protected method - should be used within class hierarchy
        return hash(self.account_holder) % 1000000

    def __validate_transaction(self, amount):
        # Private method - name mangling: _BankAccount__validate_transaction
        if amount <= 0:
            raise ValueError("Amount must be positive")
        return True

    # Public interface
    def deposit(self, amount):
        if self.__validate_transaction(amount):
            self._balance += amount
            return f"Deposited ${amount}. New balance: ${self._balance}"

    def withdraw(self, amount):
        if self.__validate_transaction(amount) and amount <= self._balance:
            self._balance -= amount
            return f"Withdrew ${amount}. New balance: ${self._balance}"
        return "Insufficient funds"

    # Property - controlled access to protected attribute
    @property
    def balance(self):
        return self._balance

    # Setter for property
    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("Balance cannot be negative")
        self._balance = value

account = BankAccount("Alice", 1000)
print(account.deposit(500))
# print(account.__account_number)  # Error - private attribute
# print(account._BankAccount__account_number)  # Possible but not recommended
```

### Properties with Validation

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self._age = age

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if not isinstance(value, int) or value < 0 or value > 150:
            raise ValueError("Age must be between 0 and 150")
        self._age = value

    @property
    def is_adult(self):
        # Read-only property
        return self._age >= 18

person = Person("Bob", 25)
person.age = 30  # Uses setter
# person.age = -5  # Raises ValueError
# person.is_adult = False  # Error - read-only property
```

---

## 5. Polymorphism

- Same interface, different implementations
- Method overriding, duck typing, operator overloading
- Allows flexible code that works with different object types
  **Example**: `animal.speak()` works for Dogs, Cats, Birds differently

### Method Overriding

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclass must implement this method")

    def move(self):
        return f"{self.name} is moving"

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

    def move(self):
        return f"{self.name} is running happily"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

    def move(self):
        return f"{self.name} is walking gracefully"

class Fish(Animal):
    def speak(self):
        return f"{self.name} is silent"

    def move(self):
        return f"{self.name} is swimming"

# Polymorphism in action
def animal_concert(animals):
    for animal in animals:
        print(animal.speak())  # Same method, different behaviors

def make_animals_move(animals):
    for animal in animals:
        print(animal.move())   # Same method, different implementations

animals = [Dog("Buddy"), Cat("Whiskers"), Fish("Nemo")]
animal_concert(animals)
make_animals_move(animals)
```

### Duck Typing

```python
class Car:
    def drive(self):
        return "Car is driving"

class Bicycle:
    def drive(self):
        return "Bicycle is pedaling"

class Boat:
    def sail(self):
        return "Boat is sailing"

def start_vehicle(vehicle):
    # Duck typing - if it has drive() method, we can use it
    if hasattr(vehicle, 'drive'):
        return vehicle.drive()
    else:
        return "This vehicle cannot be driven"

vehicles = [Car(), Bicycle(), Boat()]
for vehicle in vehicles:
    print(start_vehicle(vehicle))
```

### Operator Overloading

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    # Operator overloading
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __len__(self):
        return int((self.x**2 + self.y**2)**0.5)

v1 = Vector(2, 3)
v2 = Vector(1, 2)
print(v1 + v2)  # Vector(3, 5)
print(v1 * 3)   # Vector(6, 9)
print(len(v1))  # 3 (approximate)
```

---

## 6. Abstraction

- Hiding complex implementation details, showing only essentials
- Abstract classes, interfaces, simplifying complexity
- Reduces complexity and isolates impact of changes
  **Example**: `from abc import ABC, abstractMethod`

### Using Abstract Base Classes

```python
from abc import ABC, abstractMethod
import json
import pickle

class DataSerializer(ABC):
    @abstractMethod
    def serialize(self, data):
        pass

    @abstractMethod
    def deserialize(self, serialized_data):
        pass

    def validate_data(self, data):
        # Concrete method shared by all subclasses
        if not data:
            raise ValueError("Data cannot be empty")
        return True

class JSONSerializer(DataSerializer):
    def serialize(self, data):
        self.validate_data(data)
        return json.dumps(data)

    def deserialize(self, serialized_data):
        return json.loads(serialized_data)

class PickleSerializer(DataSerializer):
    def serialize(self, data):
        self.validate_data(data)
        return pickle.dumps(data)

    def deserialize(self, serialized_data):
        return pickle.loads(serialized_data)

# Usage - client code doesn't need to know implementation details
def process_data(serializer, data):
    """Works with any DataSerializer implementation"""
    serialized = serializer.serialize(data)
    print(f"Serialized: {serialized}")
    deserialized = serializer.deserialize(serialized)
    return deserialized

json_serializer = JSONSerializer()
pickle_serializer = PickleSerializer()

data = {"name": "Alice", "age": 30}
print(process_data(json_serializer, data))
print(process_data(pickle_serializer, data))
```

---

## 7. Special Methods (Dunder Methods)

- Customizing object behavior for Python operations
- Dunder methods like `__init__`, `__str__`, `__add__`
- Makes custom objects work like built-in types
  **Example**: Defining `__add__` to make `object1 + object2` work

### Common Dunder Methods

```python
class LibraryBook:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages
        self.is_checked_out = False

    # String representation
    def __str__(self):
        return f"'{self.title}' by {self.author}"

    def __repr__(self):
        return f"LibraryBook('{self.title}', '{self.author}', {self.pages})"

    # Comparison methods
    def __eq__(self, other):
        if not isinstance(other, LibraryBook):
            return False
        return self.title == other.title and self.author == other.author

    def __lt__(self, other):
        return len(self.title) < len(other.title)

    # Container methods
    def __len__(self):
        return self.pages

    def __contains__(self, keyword):
        return keyword.lower() in self.title.lower()

    # Callable object
    def __call__(self, reader):
        return f"{reader} is reading {self.title}"

    # Context manager
    def __enter__(self):
        self.is_checked_out = True
        print(f"Checked out: {self.title}")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.is_checked_out = False
        print(f"Returned: {self.title}")

book = LibraryBook("Python Programming", "John Doe", 350)
print(str(book))    # 'Python Programming' by John Doe
print(len(book))    # 350
print("Python" in book)  # True
print(book("Alice"))  # Alice is reading Python Programming

# Using as context manager
with book:
    print("Reading the book...")
# Automatically returned when context exits
```

---

## 8. Advanced OOP Concepts

- Taking OOP to professional/enterprise level
- Metaclasses, descriptors, design patterns, composition
- For building scalable, maintainable large applications
  **Example**: Singleton pattern, descriptor protocols

### Metaclasses

```python
class SingletonMeta(type):
    """Metaclass for implementing Singleton pattern"""
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class DatabaseConnection(metaclass=SingletonMeta):
    def __init__(self):
        self.connection_id = id(self)
        print(f"Database connection created: {self.connection_id}")

# Only one instance will be created
db1 = DatabaseConnection()
db2 = DatabaseConnection()
print(db1 is db2)  # True
```

### Descriptors

```python
class ValidatedAttribute:
    """Descriptor for validated attributes"""
    def __init__(self, min_value=None, max_value=None):
        self.min_value = min_value
        self.max_value = max_value
        self.name = None

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return instance.__dict__.get(self.name)

    def __set__(self, instance, value):
        if self.min_value is not None and value < self.min_value:
            raise ValueError(f"{self.name} must be >= {self.min_value}")
        if self.max_value is not None and value > self.max_value:
            raise ValueError(f"{self.name} must be <= {self.max_value}")
        instance.__dict__[self.name] = value

class Product:
    price = ValidatedAttribute(min_value=0, max_value=10000)
    quantity = ValidatedAttribute(min_value=0)

    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price  # Uses descriptor validation
        self.quantity = quantity

# product = Product("Widget", -10, 5)  # Raises ValueError
```

### Composition over Inheritance

```python
class Engine:
    def start(self):
        return "Engine started"

    def stop(self):
        return "Engine stopped"

class Wheels:
    def __init__(self, count):
        self.count = count

    def rotate(self):
        return f"{self.count} wheels rotating"

class Car:
    def __init__(self, brand, wheel_count=4):
        self.brand = brand
        self.engine = Engine()  # Composition
        self.wheels = Wheels(wheel_count)  # Composition

    def drive(self):
        return f"{self.brand}: {self.engine.start()}, {self.wheels.rotate()}"

# More flexible than inheritance - can easily swap components
car = Car("Toyota")
print(car.drive())
```

## Key OOP Principles Summary

1. **SOLID Principles**:

   - **S**ingle Responsibility: One class, one responsibility
   - **O**pen/Closed: Open for extension, closed for modification
   - **L**iskov Substitution: Subclasses should be substitutable for base classes
   - **I**nterface Segregation: Many specific interfaces better than one general
   - **D**ependency Inversion: Depend on abstractions, not concretions

2. **Favor Composition over Inheritance**: More flexible and maintainable

3. **Encapsulate What Varies**: Hide implementation details that might change

4. **Program to Interfaces, Not Implementations**: Depend on abstractions
