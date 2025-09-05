---
title: Typescript Special Operators
slug: guides/typescript/typescript-special-operators
description: Typescript Special Operators
sidebar:
  order: 2
---


- TypeScript **Special Operators** & **Wildcards** Quick Reference

### `?` - Optional
- Marks properties or parameters as optional

 ```javascript 
 interface User { 
    name?: string 
};

function greet(name?: string) {}
```

### `?` - Optional Chaining
- Safely access nested properties

 ```javascript 
 const city = user?.address?.city; // undefined if user or address is null
```

### `??` - Nullish Coalescing
- Provides default for null/undefined

 ```javascript 
 const name = inputName ?? 'Anonymous'; // Uses 'Anonymous' only if inputName is null/undefined
```

### `-?` - Required Modifier
- Removes optionality

```javascript 
type Required<T> = { 
  [P in keyof T]-?: T[P] 
}; // Makes all properties required
```


### `!` - Non-null Assertion
- Asserts that a value is not null/undefined

 ```javascript 
 const element = document.getElementById('myEl')!;
  element.focus(); // No null check needed
```

### `&` - Intersection Type
- Combines multiple types

```javascript 
 type Admin = User & { permissions: string[] }; // Has both User properties and permissions
```

### `|` - Union Type
- Represents one of several types

```javascript 
type ID = string | number;
let id: ID = 123; 
id = 'abc';
```

### `as` - Type Assertion
- Explicit type conversion

```javascript 
const length = (someValue as string).length;
const element = el as HTMLInputElement;
```

### `keyof` - Keyof Operator
- Gets keys of a type

```javascript 
const user = { name: 'John', age: 30 };
type UserKeys = keyof User; // 'name' | 'age'
// function getProp<T>(obj: T, key: keyof T) {}
```

### `typeof` - Typeof Operator
- Gets type of a value

```javascript 
const user = { name: 'John', age: 30 };
type UserType = typeof user; // { name: string; age: number }
```

### `in` - In Operator
- Checks property existence

```javascript 
const user = { name: 'John', age: 30 };
if ('name' in user) { 
  console.log(user.name); 
} // Type-safe property check
```

### `extends` - Constraint Operator
- Constrains generic types

```javascript 
function logLength<T extends { length: number }>(obj: T) {}// T must have length property
```

### `infer` - Infer Keyword
- Infers types in conditionals

```javascript 
type ArrayType<T> = T extends (infer U)[] ? U : never;
type Num = ArrayType<number[]>; // number
```

### `infer` - Infer Keyword
- Infers types in conditionals

```javascript 
type ArrayType<T> = T extends (infer U)[] ? U : never;
type Num = ArrayType<number[]>; // number
```

### `readonly` - Readonly Modifier
- Makes properties read-only

```javascript 
interface Point { 
  readonly x: number; 
  readonly y: number; 
}
point.x = 5; // Error!
```

### `-readonly` - Mutable Modifier
- Removes readonly

```javascript 
type Mutable<T> = { 
  -readonly [P in keyof T]: T[P] 
};// Makes all properties mutable
```

### `satisfies` - Satisfies Operator 
- Validates without widening

```javascript 
const colors = ['red', 'green'] satisfies string[]; // Type is string[], not (string \| number)[]
```

### `*` - Import/Export Wildcard
- Import/export all from module 

```javascript 
import * as React from 'react';
export * from './utils';
```

### `...` - Rest/Spread
- Rest parameters or spread elements

```javascript 
function sum(...numbers: number[]) {} //Rest
const newArr = [...oldArr, newItem]; //Spread
```

### `[]` - Index Signature
- Dynamic object properties

```javascript 
interface Dictionary { 
  [key: string]: string; 
};
const dict: Dictionary = { hello: 'world' };
```

### `<>` - Type Parameters
- Generic type parameters

```javascript 
function identity<T>(value: T): T {};
type Response<T> = { data: T };
```

### `@` - Decorator
- Metadata/annotation

```javascript 
@Component({ selector: 'app-root' }) 
  class AppComponent {}
```

### `#` - Private Field
- Class private fields

```javascript 
class User { #password: string; }// Truly private, not just TypeScript-private
```

### `_` - Numeric Separator
- Readable numbers

```javascript 
const million = 1_000_000;
const hex = 0xFF_FF_FF;
```

### `//` - Single-line Comment
- Comments

```javascript 
// This is a comment
const x = 5; // inline comment
```

### `/* */` - Multi-line Comment
- Block comments

```javascript 
/* This is a`<br>`multi-line comment */
```

