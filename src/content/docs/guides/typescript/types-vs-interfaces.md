---
title: Types vs Interfaces
description: Types vs Interfaces
---

<table width="100%">
<tr><td valign="top">

**`Interfaces`** 
* Used to describe the **`shape of objects`** and are extendable through declaration merging.
* They are **`declaration-based`** and work well with object-oriented patterns.
</td><td valign="top">

**`Types`** (`type aliases`) 
* More flexible and `can describe not just objects but also primitives, unions, tuples, and other complex types`. 
* They are **`expression-based`** and work well for functional programming patterns.
</td></tr>
</table>




**Why it matters:** Understanding this fundamental difference helps you choose the right tool for each situation. 
- **Interfaces are better for object shapes** that might need extension, 
- while **types are better for complex type compositions**.

## 1. Object Declaration - Basic Syntax

<table width="100%">
<tr><td valign="top">

### Interface
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}
```

### Interface (extends)
```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: string;
  department: string;
}

// Usage
const employee: Employee = {
  name: "John Doe",
  age: 30,
  employeeId: "E123",
  department: "Engineering"
};
```

</td><td valign="top">

### Type
```typescript
type User = {
  id: number;
  name: string;
  email: string;
};
```

### Type (intersection &)
```typescript
type Person = {
  name: string;
  age: number;
};

type Employee = Person & {
  employeeId: string;
  department: string;
};

// Usage - same as above
const employee: Employee = {
  name: "John Doe",
  age: 30,
  employeeId: "E123",
  department: "Engineering"
};
```


</td></tr>
</table>



**Why it matters:** At the basic level, both can describe object shapes with properties and methods. The syntax is nearly identical, with interfaces using the `interface` keyword and types using the `type` keyword. For simple object shapes, the choice is often a matter of personal or team preference.


* Both interfaces and types support extension, but with different syntax. 
* Interfaces use `extends` for a more traditional OOP inheritance model
* While `types` use **intersection** (`&`) which combines types. 
* Interfaces generally provide better error messages when there are conflicts during extension.

## 2. Implementing in Classes - OOP Integration

<table width="100%">
<tr><td valign="top">

### Interface (implements)
```typescript
interface Animal {
  name: string;
  makeSound(): void;
}

class Dog implements Animal {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  makeSound(): void {
    console.log("Woof!");
  }
}
```
</td><td valign="top">

### Type (can also be implemented)
```typescript
type Animal = {
  name: string;
  makeSound(): void;
};

class Dog implements Animal {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  makeSound(): void {
    console.log("Woof!");
  }
}
```
</td></tr>
</table>

* Both interfaces and types can be implemented by classes, though interfaces are more commonly used for this purpose in object-oriented code. 
* The `implements` clause checks that the class properly implements the structure defined by the interface or type.

## 3. Declaration Merging - Interface-Only Feature

<table width="100%">
<tr><td valign="top">

### Interface
```typescript
interface User {
  name: string;
  email: string;
}

// Later in the same scope
interface User {
  age: number;
}

// Result: User now has name, email, and age
const user: User = {
  name: "John",
  email: "john@example.com",
  age: 30  // Required due to merging
};
```
</td><td valign="top">

### Type
```typescript
type User = {
  name: string;
  email: string;
};

// This would cause an error - cannot redeclare
type User = {
  age: number;
};
// Error: Duplicate identifier 'User'
```
</td></tr>
</table>

* Interfaces can be merged through declaration merging, which is useful when working with external libraries or when you want to extend types across different parts of your codebase. 

* Types cannot be merged - attempting to redeclare a type will cause an error. This makes interfaces more flexible for augmenting existing definitions.

## 4. Union Types - Type-Only Feature

<table width="100%">
<tr><td valign="top">

### Type
```typescript
type Status = "active" | "inactive" | "pending";
type ID = number | string;

type User = {
  id: ID;
  status: Status;
};

// Usage
const user1: User = {
  id: 123,        // Can be number
  status: "active"
};

const user2: User = {
  id: "USER_456", // Can be string
  status: "inactive"
};
```
</td><td valign="top">

### Interface (cannot create union types)
```typescript
// This is not possible with interfaces
interface Status = "active" | "inactive"; // Error
```
</td></tr>
</table>




* `Types can represent union` types (a value that can be one of several types), 
* While interfaces cannot. This makes types essential for modeling values that can take different forms, such as API responses that might be a success object or an error object.

## 5. Tuple Types - Type-Only Feature

<table width="100%">
<tr><td valign="top">

### Type
```typescript
type Point = [number, number];
type StringNumberPair = [string, number];

// Usage
const point: Point = [10, 20];
const pair: StringNumberPair = ["age", 30];
```
</td><td valign="top">

### Interface (cannot create tuple types directly)
```typescript
// Interfaces can't directly represent tuples
interface Point extends Array<number> {
  0: number;
  1: number;
}
// This is cumbersome and not a true tuple
```
</td></tr>
</table>


* `Types` can represent tuples (fixed-length arrays with specific types at each position), 
* While interfaces cannot do this directly. This makes types better for working with structured data that has a specific sequence of types.

## 6. Mapped Types - Type-Only Feature

<table width="100%">
<tr><td valign="top">

### Type
```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Usage
interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// Equivalent to { readonly name: string; readonly age: number; }

type PartialUser = Partial<User>;
// Equivalent to { name?: string; age?: number; }
```
</td><td valign="top">

### Interface (cannot create mapped types)
```typescript
// Interfaces can't create mapped types directly
```
</td></tr>
</table>



* `Types` support mapped types, which allow you to create new types by transforming properties of existing types. This is powerful for creating utility types like `Readonly`, `Partial`, `Pick`, etc. Interfaces cannot do this directly.

## 7. Performance and Error Messages

**Why it matters:** In earlier versions of TypeScript, interfaces generally had better performance and more helpful error messages than type aliases. However, in modern TypeScript (version 4.0+), the performance difference is negligible for most use cases. Interfaces still tend to provide slightly better error messages in some cases, particularly when dealing with extension conflicts.

## When to Use Which - Decision Guide

<table width="100%">
<tr><td valign="top">

### Use Interfaces when:
- Defining object shapes that might need declaration merging
- Working with object-oriented code and class implementations
- Creating public API definitions that might be extended by consumers
- You want clearer error messages for property conflicts
</td><td valign="top">

### Use Types when:
- You need union, intersection, or tuple types
- You need to create mapped types or conditional types
- You're defining type aliases for primitives
- You're composing complex types from simpler ones
</td></tr>
</table>



## Summary Table

| Feature | Interface | Type |
|---------|-----------|------|
| Object shapes | ✅ | ✅ |
| Extending | ✅ (`extends`) | ✅ (`&`) |
| Implementing | ✅ | ✅ |
| Declaration merging | ✅ | ❌ |
| Union types | ❌ | ✅ |
| Tuple types | ❌ | ✅ |
| Mapped types | ❌ | ✅ |
| Primitive types | ❌ | ✅ |

## Best Practice

**Default to interfaces for object shapes** unless you need specific features of type aliases. This aligns with TypeScript's design patterns and provides better error messages. Use type aliases when you need union types, tuples, or complex type transformations.
