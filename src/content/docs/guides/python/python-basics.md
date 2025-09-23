---
title: Python Basics
description: Python Basics
---

Python is easy

## Basic Syntax

This covers the fundamental rules and structure of Python code - how to write statements, use variables, and basic operations.

```python
# Comments start with # - they're ignored by Python
print("Hello, World!")  # Basic output function

# Variables don't need type declaration - Python figures it out
x = 5                   # Integer variable
name = "Alice"          # String variable

# Multiple assignment - assign multiple variables at once
a, b, c = 1, 2, 3      # a=1, b=2, c=3

# Basic arithmetic follows PEMDAS rules
result = 10 + 5 * 2    # Multiplication first: 5*2=10, then 10+10=20

# Indentation matters! Use 4 spaces for code blocks
if x > 3:
    print("x is greater than 3")  # This is indented
```

**Key Points:**

- Python uses indentation (spaces) to define code blocks instead of braces {}
- Variables are dynamically typed (no need to declare types)
- Statements don't need semicolons at the end
- Comments help document your code

---

## Data Types

Data types define what kind of data variables can hold. Python has several built-in types for different purposes.

```python
# Numeric types
integer = 42           # Whole numbers
float_num = 3.14       # Decimal numbers
complex_num = 2 + 3j   # Complex numbers (real + imaginary part)

# Boolean - represents True or False
is_true = True
is_false = False

# Strings - text data
text = "Hello World"
multi_line = """This is a
multi-line string"""   # Triple quotes for multi-line

# Type conversion - changing between types
str_num = str(123)     # Convert number to string: "123"
int_num = int("456")   # Convert string to integer: 456
float_num = float("3.14")  # Convert string to float: 3.14

# Check types
print(type(integer))   # <class 'int'>
print(type(text))      # <class 'str'>
```

**Key Points:**

- **int**: Whole numbers (positive, negative, zero)
- **float**: Decimal numbers
- **str**: Text data, immutable (can't change individual characters)
- **bool**: True or False values
- Use type conversion functions to change between types

---

## Control Flow

Control flow determines the order in which code executes. It includes conditionals (if/else) and loops (for/while).

### Conditional Statements

```python
age = 18

# if-elif-else chain - only one block executes
if age < 13:
    print("Child")         # Runs if age < 13
elif age < 20:
    print("Teenager")      # Runs if 13 <= age < 20
else:
    print("Adult")         # Runs if age >= 20

# Ternary operator - shorthand for simple if-else
status = "Adult" if age >= 18 else "Minor"
# Equivalent to:
if age >= 18:
    status = "Adult"
else:
    status = "Minor"
```

### Loops

```python
# For loop - iterate a specific number of times
for i in range(5):  # range(5) generates 0,1,2,3,4
    print(i)        # Prints 0,1,2,3,4

# While loop - repeat while condition is True
count = 0
while count < 5:
    print(count)    # Prints 0,1,2,3,4
    count += 1      # Increment counter

# Loop control statements
for i in range(10):
    if i == 3:
        continue    # Skip rest of this iteration, go to next number
    if i == 7:
        break       # Exit loop completely
    print(i)        # Prints 0,1,2,4,5,6
```

**Key Points:**

- **if/elif/else**: Make decisions based on conditions
- **for loops**: Iterate over sequences (lists, ranges, etc.)
- **while loops**: Repeat while condition is true
- **break**: Exit loop immediately
- **continue**: Skip to next iteration

---

## Functions

Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.

```python
# Basic function definition and call
def greet(name):                 # Define function with parameter
    return f"Hello, {name}!"    # Return a value

result = greet("Alice")         # Call function with argument
print(result)                   # "Hello, Alice!"

# Function with default parameters
def power(base, exponent=2):    # exponent defaults to 2 if not provided
    return base ** exponent

print(power(3))     # 3^2 = 9 (uses default exponent)
print(power(3, 3))  # 3^3 = 27 (uses provided exponent)

# Variable arguments - accept any number of arguments
def sum_all(*args):             # *args collects all arguments as tuple
    return sum(args)

print(sum_all(1, 2, 3, 4))      # 10

# Keyword arguments - accept named arguments
def person_info(**kwargs):      # **kwargs collects named arguments as dictionary
    for key, value in kwargs.items():
        print(f"{key}: {value}")

person_info(name="Alice", age=30, city="NY")  # name: Alice, age: 30, city: NY

# Lambda functions - small anonymous functions
square = lambda x: x * x        # Equivalent to def square(x): return x*x
print(square(5))                # 25
```

**Key Points:**

- **def**: Keyword to define functions
- **Parameters**: Variables in function definition
- **Arguments**: Values passed to function
- **return**: Sends result back to caller
- **\*args**: For variable number of arguments
- **\*\*kwargs**: For variable number of keyword arguments
- **lambda**: For small, one-line functions

---

## Data Structures

Data structures organize and store data efficiently. Python has several built-in structures for different needs.

### Lists (Mutable Sequences)

- **Lists:** `Ordered`, `mutable`, `allows duplicates`

```python
# Creating lists - ordered, changeable collections
fruits = ["apple", "banana", "cherry"]
numbers = list(range(1, 6))  # [1, 2, 3, 4, 5]

# List operations
fruits.append("orange")      # Add to end: ["apple", "banana", "cherry", "orange"]
fruits.insert(1, "blueberry") # Insert at index 1
fruits.remove("banana")      # Remove specific value
last_fruit = fruits.pop()    # Remove and return last item

# List comprehension - concise way to create lists
squares = [x**2 for x in range(10)]           # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
even_squares = [x**2 for x in range(10) if x % 2 == 0]  # Squares of even numbers only
```

### Tuples (Immutable Sequences)

- **Tuples:** `Ordered`, `immutable`, `allows duplicates`

```python
# Tuples - ordered, unchangeable collections
coordinates = (10, 20)
point = 30, 40  # Parentheses optional for tuples

# Unpacking - assign tuple elements to variables
x, y = coordinates  # x=10, y=20

# Tuples are immutable (can't change after creation)
# coordinates[0] = 15  # This would cause ERROR!
```

### Dictionaries (Key-Value Pairs)

- **Dictionaries:** `Unordered`, `key-value` pairs, `keys` must be `unique`

```python
# Dictionaries - unordered collections of key-value pairs
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

# Dictionary operations
person["email"] = "alice@email.com"  # Add new key-value pair
age = person.get("age", "Unknown")   # Safe get - returns "Unknown" if key doesn't exist

# Dictionary comprehension
squares = {x: x**2 for x in range(5)}  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

### Sets (Unique Elements)

- **Sets:** `Unordered`, `unique` elements only

```python
# Sets - unordered collections of unique elements
unique_numbers = {1, 2, 3, 3, 4}  # Duplicates removed: {1, 2, 3, 4}

# Set operations
set_a = {1, 2, 3}
set_b = {3, 4, 5}
union = set_a | set_b        # All unique elements: {1, 2, 3, 4, 5}
intersection = set_a & set_b # Common elements: {3}
difference = set_a - set_b   # In A but not B: {1, 2}
```

**Key Points:**

- **Lists**: Ordered, mutable, allows duplicates
- **Tuples**: Ordered, immutable, allows duplicates
- **Dictionaries**: Unordered, key-value pairs, keys must be unique
- **Sets**: Unordered, unique elements only
- Use comprehensions for concise creation of these structures

---

## Object-Oriented Programming (OOP)

OOP organizes code into objects that contain both data (attributes) and behavior (methods). It helps model real-world concepts.

```python
class Dog:
    # Class attribute - shared by all instances
    species = "Canis familiaris"

    # Constructor - called when creating new instance
    def __init__(self, name, age):
        # Instance attributes - unique to each object
        self.name = name
        self.age = age

    # Instance method - functions that belong to objects
    def bark(self):
        return f"{self.name} says woof!"

    # Special method - defines string representation
    def __str__(self):
        return f"{self.name} is {self.age} years old"

# Inheritance - creating specialized classes
class Bulldog(Dog):  # Bulldog inherits from Dog
    def bark(self):   # Override parent method
        return f"{self.name} says gruff woof!"

# Using classes
my_dog = Dog("Rex", 5)       # Create instance (object)
print(my_dog.bark())         # Call method: "Rex says woof!"
print(my_dog)                # Uses __str__: "Rex is 5 years old"

my_bulldog = Bulldog("Spike", 3)
print(my_bulldog.bark())     # Uses overridden method: "Spike says gruff woof!"
```

**Key Points:**

- **Class**: Blueprint for creating objects
- **Object**: Instance of a class
- **Attributes**: Variables that belong to objects
- **Methods**: Functions that belong to objects
- **Inheritance**: Creating new classes based on existing ones
- **self**: Reference to the current instance

---

## File Handling

File handling allows your program to read from and write to files on your computer, enabling data persistence.

```python
# Reading files - 'r' mode for reading
with open("file.txt", "r") as file:  # 'with' automatically closes file
    content = file.read()            # Read entire file as string
    # OR read line by line:
    # lines = file.readlines()       # Returns list of lines

# Writing files - 'w' mode (overwrites existing content)
with open("output.txt", "w") as file:
    file.write("Hello, World!\n")    # Write string to file
    file.write("Second line\n")

# Appending to files - 'a' mode (adds to end)
with open("output.txt", "a") as file:
    file.write("This line is appended\n")

# Reading line by line (memory efficient for large files)
with open("large_file.txt", "r") as file:
    for line in file:                # Read one line at a time
        print(line.strip())          # strip() removes newline characters
```

**Key Points:**

- **open()**: Function to open files
- **Modes**: 'r' (read), 'w' (write), 'a' (append)
- **with statement**: Ensures file is properly closed
- **read()**: Read entire file content
- **readlines()**: Read all lines into a list
- **write()**: Write strings to file

---

## Error Handling

Error handling prevents your program from crashing when unexpected situations occur. It makes your code more robust.

```python
# Basic try-except block
try:
    # Code that might cause an error
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"10 divided by {number} is {result}")

except ValueError:
    # Handle specific error (non-number input)
    print("That's not a valid number!")

except ZeroDivisionError:
    # Handle division by zero
    print("You can't divide by zero!")

except Exception as e:
    # Catch any other unexpected errors
    print(f"An unexpected error occurred: {e}")

else:
    # Runs if no errors occurred
    print("Division completed successfully!")

finally:
    # Always runs, regardless of errors
    print("Execution completed.")

# Raising custom errors
def validate_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative!")
    if age > 150:
        raise ValueError("Age seems unrealistic!")
    return True

try:
    validate_age(-5)
except ValueError as e:
    print(f"Validation error: {e}")
```

**Key Points:**

- **try**: Code that might cause errors
- **except**: Handle specific types of errors
- **else**: Run if no errors occurred
- **finally**: Always execute (cleanup code)
- **raise**: Create custom errors
- **Exception**: Base class for all errors

---

## Modules

Modules are Python files containing reusable code. They help organize code into logical units and promote code reuse.

```python
# Import entire module
import math
print(math.sqrt(25))  # Use module_name.function_name

# Import specific functions
from math import sqrt, pi
print(sqrt(25))       # Use function directly
print(pi)             # Use variable directly

# Import with alias
import numpy as np
import pandas as pd

# Create your own module
# Save this as my_module.py:
"""
# my_module.py
def greet(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b
"""

# Then use it:
import my_module
print(my_module.greet("Alice"))
print(my_module.add(5, 3))

# Check what's in a module
import math
print(dir(math))      # List all available functions/attributes
```

**Key Points:**

- **import**: Bring entire module into your code
- **from...import**: Bring specific parts
- **as**: Create aliases for shorter names
- Modules promote code organization and reuse
- Python has extensive standard library modules

---

## Useful Libraries

Python's power comes from its extensive ecosystem of libraries. Here are essential ones for different tasks.

### Data Science Libraries

```python
# NumPy - numerical computing
import numpy as np
array = np.array([1, 2, 3, 4, 5])
print(array * 2)  # [2, 4, 6, 8, 10] - vectorized operations

# Pandas - data manipulation
import pandas as pd
data = pd.DataFrame({
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [25, 30, 35],
    'City': ['NY', 'LA', 'Chicago']
})
print(data.head())  # Display first few rows

# Matplotlib - data visualization
import matplotlib.pyplot as plt
x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]
plt.plot(x, y)
plt.xlabel('X axis')
plt.ylabel('Y axis')
plt.title('Simple Plot')
# plt.show()  # Uncomment to display plot
```

### Web and API Libraries

```python
# Requests - HTTP requests
import requests
response = requests.get('https://api.github.com')
print(response.status_code)  # 200 means success
# print(response.json())     # If response is JSON data

# Flask - web framework (simple example)
from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, World!'

# if __name__ == '__main__':
#     app.run(debug=True)
```

### Utility Libraries

```python
# datetime - date and time operations
from datetime import datetime, timedelta
now = datetime.now()
print(now.strftime("%Y-%m-%d %H:%M:%S"))  # Format date
tomorrow = now + timedelta(days=1)        # Add 1 day

# json - JSON data handling
import json
data = {'name': 'Alice', 'age': 30}
json_string = json.dumps(data)            # Convert to JSON string
parsed_data = json.loads(json_string)     # Convert back to dictionary

# os - operating system interface
import os
current_dir = os.getcwd()                 # Get current directory
files = os.listdir('.')                   # List files in current directory
```

**Key Points:**

- **NumPy**: Efficient numerical computations
- **Pandas**: Data analysis and manipulation
- **Matplotlib**: Data visualization
- **Requests**: HTTP requests for APIs
- **Flask/Django**: Web development
- Install libraries using: `pip install library_name`
