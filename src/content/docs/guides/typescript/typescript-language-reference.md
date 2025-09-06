---
title: Typescript complete reference
description: Typescript complete reference
---

- A complete Typescript language reference


## Type Inference

TypeScript's type inference is one of its most powerful features that automatically deduces types without explicit annotations. The compiler analyzes your code and determines the appropriate types based on usage patterns, variable initialization, function return values, and context. Type inference reduces verbosity while maintaining type safety, making code cleaner and more maintainable. TypeScript uses several inference strategies including initializer-based inference, contextual typing, best common type, and literal type inference.

```typescript
// TypeScript infers types automatically
let message = "Hello"; // inferred as string
let count = 42;        // inferred as number
let isReady = true;    // inferred as boolean

// Function return type inference
function multiply(a: number, b: number) {
    return a * b; // return type inferred as number
}

// Contextual typing
const names = ["Alice", "Bob", "Charlie"];
names.forEach(name => {
    console.log(name.toUpperCase()); // name inferred as string
});
```

## 1. Basic Types

 TypeScript provides several basic types that serve as the building blocks for more complex type definitions. These types help ensure type safety by specifying what kind of values variables can hold. TypeScript includes all JavaScript primitive types plus additional ones like `enum`, `any`, `unknown`, `void`, and `never` to provide more precise type checking.

```typescript
// Primitive types - fundamental data types
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let bigInt: bigint = 100n;

// Array types - collections of values
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3]; // Generic syntax

// Tuple - fixed-length array with known types
let tuple: [string, number] = ["hello", 10];

// Enum - set of named constants
enum Color { Red, Green, Blue }
let c: Color = Color.Green;

// Any - opt-out of type checking (use sparingly)
let notSure: any = 4;
notSure = "maybe a string";

// Unknown - type-safe counterpart of any
let uncertain: unknown = 4;
uncertain = "could be anything";

// Void - absence of any type (usually for functions)
function warnUser(): void {
    console.log("This is a warning");
}

// Never - represents values that never occur
function error(message: string): never {
    throw new Error(message);
}
```

## 2. Type Annotations

 Type annotations explicitly specify the type of variables, function parameters, and return values. They help the TypeScript compiler catch type-related errors during development. Type annotations can use built-in types, custom interfaces, type aliases, union types, and intersection types to create flexible and precise type definitions.

```typescript
// Explicit variable typing
let username: string = "John";
let age: number = 30;

// Function type annotations
function greet(name: string): string {
    return `Hello, ${name}!`;
}

// Type aliases - create custom named types
type UserID = string | number;
type Point = {
    x: number;
    y: number;
};

// Union types - values that can be one of several types
let id: string | number = "123";
id = 123; // Also valid

// Intersection types - combine multiple types
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged;

let person: Person = { name: "John", age: 30 };
```

## 3. Interfaces

 Interfaces define contracts for object shapes, specifying what properties and methods an object must have. They support optional properties, readonly properties, function signatures, and index signatures. Interfaces can extend other interfaces and are implemented by classes. They are TypeScript's primary way of defining object types and enabling structural typing.

```typescript
// Basic interface with required and optional properties
interface User {
    id: number;
    name: string;
    email?: string; // Optional property
    readonly createdAt: Date; // Readonly property
}

// Function interface - defines call signature
interface SearchFunc {
    (source: string, subString: string): boolean;
}

// Indexable interface - for array-like objects
interface StringArray {
    [index: number]: string;
}

// Interface inheritance
interface Employee extends User {
    employeeId: number;
    department: string;
}

// Class implementing interface
class Admin implements User {
    id: number;
    name: string;
    createdAt: Date;
    
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        this.createdAt = new Date();
    }
}
```

## 4. Classes

 TypeScript classes build on JavaScript classes by adding type annotations, access modifiers (public, private, protected), readonly properties, and abstract classes. They support inheritance, method overriding, static members, and implement interfaces. TypeScript's class features enable traditional object-oriented programming patterns with type safety.

```typescript
class Animal {
    // Public by default, explicit access modifiers
    name: string;
    
    // Private field (ECMAScript private)
    #secret: string;
    
    // Protected field - accessible in subclasses
    protected species: string;
    
    // Readonly field - cannot be modified after construction
    readonly createdAt: Date;
    
    // Static field - shared across all instances
    static count: number = 0;
    
    constructor(name: string) {
        this.name = name;
        this.#secret = "shh";
        this.species = "unknown";
        this.createdAt = new Date();
        Animal.count++;
    }
    
    // Method with default parameter
    move(distance: number = 0): void {
        console.log(`${this.name} moved ${distance}m`);
    }
    
    // Getter and setter for controlled access
    get secret(): string {
        return this.#secret;
    }
    
    set secret(value: string) {
        this.#secret = value;
    }
}

// Inheritance with method overriding
class Dog extends Animal {
    bark(): void {
        console.log("Woof! Woof!");
    }
    
    move(distance: number = 5): void {
        console.log("Running...");
        super.move(distance);
    }
}

// Abstract class - cannot be instantiated directly
abstract class Department {
    constructor(public name: string) {}
    
    abstract printMeeting(): void; // Must be implemented by subclasses
}
```

## 5. Functions

 TypeScript functions can have typed parameters, return types, optional parameters, default parameters, and rest parameters. Function types can be defined using interfaces or type aliases. TypeScript supports function overloading, arrow functions, and provides `this` parameter annotations for better context typing in object methods.

```typescript
// Function type alias
type MathOperation = (a: number, b: number) => number;

// Optional and default parameters
function buildName(firstName: string, lastName?: string): string {
    return lastName ? `${firstName} ${lastName}` : firstName;
}

function greet(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}!`;
}

// Rest parameters - variable number of arguments
function sum(...numbers: number[]): number {
    return numbers.reduce((total, n) => total + n, 0);
}

// Function overloading - multiple signatures
function reverse(value: string): string;
function reverse<T>(value: T[]): T[];
function reverse(value: string | any[]): string | any[] {
    if (typeof value === "string") {
        return value.split("").reverse().join("");
    }
    return value.slice().reverse();
}

// Arrow functions with explicit typing
const multiply: MathOperation = (a, b) => a * b;
```

## 6. Generics

 Generics enable creating reusable components that work with multiple types while maintaining type safety. They allow parameterizing types, functions, and classes with type variables. Generics can be constrained to specific shapes using the `extends` keyword and can use default type parameters. They are essential for building flexible, type-safe libraries and utilities.

```typescript
// Generic function - works with any type
function identity<T>(arg: T): T {
    return arg;
}

// Generic interface
interface GenericIdentityFn<T> {
    (arg: T): T;
}

// Generic class
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

// Generic constraints - limit allowed types
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

// Multiple type parameters with constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

// Generic defaults - provide fallback types
interface Box<T = string> {
    value: T;
}
```

## 7. Utility Types

 TypeScript provides built-in utility types that transform existing types in useful ways. These utilities help create new types from existing ones without modifying the originals. They include type operations like making all properties optional (`Partial`), required (`Required`), readonly (`Readonly`), picking specific properties (`Pick`), omitting properties (`Omit`), and many more for common type transformations.

```typescript
interface User {
    id: number;
    name: string;
    email?: string;
    active: boolean;
}

// Partial - all properties become optional
type PartialUser = Partial<User>;

// Required - all properties become required, even optional ones
type RequiredUser = Required<User>;

// Readonly - all properties become readonly
type ReadonlyUser = Readonly<User>;

// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - exclude specific properties
type UserWithoutId = Omit<User, 'id'>;

// Record - create object type with specific key and value types
type UserMap = Record<string, User>;

// Extract - get types that exist in both unions
type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

// ReturnType - get return type of function
type T4 = ReturnType<() => string>; // string
```

## 8. Type Operators

 Type operators manipulate and create types programmatically. The `keyof` operator gets keys of an object type, `typeof` gets the type of a value, and indexed access types (`T[K]`) extract property types. Conditional types (`T extends U ? X : Y`) enable type-level logic, and mapped types transform properties of existing types. These operators are powerful tools for advanced type manipulation.

```typescript
// keyof - get union of keys from object type
type UserKeys = keyof User; // "id" | "name" | "email" | "active"

// typeof - get type from value
const user = { name: "John", age: 30 };
type UserType = typeof user; // { name: string; age: number; }

// Indexed access types - get type of specific property
type UserName = User['name']; // string
type UserPropertyTypes = User[keyof User]; // number | string | boolean

// Conditional types - type-level conditional logic
type IsString<T> = T extends string ? true : false;
type A = IsString<string>; // true
type B = IsString<number>; // false

// Mapped types - transform each property of a type
type OptionalUser = {
    [K in keyof User]?: User[K];
};

// Template literal types - manipulate string literal types
type EventName<T extends string> = `${T}Changed`;
type MouseEvent = EventName<'mouse'>; // "mouseChanged"
```

## 9. Advanced Types

 Advanced types include discriminated unions for modeling complex data structures, type predicates for custom type guards, assertion functions for runtime type checking, and const assertions for creating deeply readonly types. These features enable sophisticated type patterns that can accurately represent complex domain models and ensure type safety throughout applications.

```typescript
// Discriminated unions - pattern for handling different shapes
interface Square { kind: "square"; size: number; }
interface Rectangle { kind: "rectangle"; width: number; height: number; }
interface Circle { kind: "circle"; radius: number; }

type Shape = Square | Rectangle | Circle;

function area(shape: Shape): number {
    switch (shape.kind) {
        case "square": return shape.size * shape.size;
        case "rectangle": return shape.width * shape.height;
        case "circle": return Math.PI * shape.radius * shape.radius;
    }
}

// Type predicates - custom type guard functions
function isString(value: unknown): value is string {
    return typeof value === "string";
}

// Assertion functions - ensure conditions at runtime
function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error("Not a string!");
    }
}

// Const assertions - create deeply readonly literal types
const colors = ["red", "green", "blue"] as const;
type Color = typeof colors[number]; // "red" | "green" | "blue"
```

## 10. Nullish Coalescing & Optional Chaining

 Optional chaining (`?.`) allows safe access to nested properties that might be `null` or `undefined`, short-circuiting to `undefined` instead of throwing errors. The nullish coalescing operator (`??`) provides default values for `null` or `undefined` values while respecting other falsy values like `0` or empty strings. These operators greatly simplify working with potentially missing data.

```typescript
// Optional chaining (?.) - safe navigation through potentially null/undefined
interface User {
    name: string;
    address?: {
        street?: string;
        city: string;
    };
}

const user: User = { name: "John", address: { city: "NYC" } };
const street = user.address?.street; // string | undefined
const streetLength = user.address?.street?.length; // number | undefined

// Nullish coalescing (??) - default values for null/undefined only
const input = null;
const value = input ?? "default"; // "default" (null becomes default)

const emptyString = "";
const result = emptyString ?? "default"; // "" (empty string is preserved)

// Optional chaining with function calls and array access
const obj = { method: () => console.log("called") };
obj.method?.(); // calls method if it exists

const array = [1, 2, 3];
const first = array?.[0]; // number | undefined
```

## 11. Type Assertions

 Type assertions tell the TypeScript compiler to treat a value as a specific type, overriding its default type inference. They are useful when you know more about a value's type than TypeScript can infer. The non-null assertion operator (`!`) asserts that a value is not `null` or `undefined`. Assertion functions provide runtime type checking with compile-time type narrowing.

```typescript
// Type assertion syntax - tell compiler about specific type
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length; // Angle bracket
let strLength2: number = (someValue as string).length; // As syntax

// Const assertions - make object properties readonly
let point = { x: 10, y: 20 } as const;
// point.x = 5; // Error - readonly

// Non-null assertion operator (!) - assert not null/undefined
function liveDangerously(x?: number | null) {
    console.log(x!.toFixed()); // ! tells compiler x is not null/undefined
}

// Definite assignment assertion (!) - promise compiler variable will be assigned
class Example {
    name!: string; // We'll assign this later
    
    initialize() {
        this.name = "John";
    }
}

// Assertion functions - runtime checks with type narrowing
function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}
```

## 12. Type Guards

 Type guards are expressions that perform runtime checks to narrow down types within conditional blocks. Built-in guards include `typeof` for primitive types, `instanceof` for class instances, and the `in` operator for checking property existence. Custom type guards use type predicates (`value is Type`) to create application-specific type narrowing logic.

```typescript
// typeof type guards - narrow primitive types
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    return padding + value;
}

// instanceof type guards - narrow class instances
class Bird { fly() { console.log("flying"); } }
class Fish { swim() { console.log("swimming"); } }

function move(pet: Bird | Fish) {
    if (pet instanceof Bird) {
        pet.fly();
    } else {
        pet.swim();
    }
}

// in operator type guards - check property existence
interface Bird { fly(): void; layEggs(): void; }
interface Fish { swim(): void; layEggs(): void; }

let pet = getSmallPet();
if ("fly" in pet) {
    pet.fly(); // Type narrowed to Bird
} else {
    pet.swim(); // Type narrowed to Fish
}

// Custom type guards - application-specific narrowing logic
function isBird(pet: Bird | Fish): pet is Bird {
    return (pet as Bird).fly !== undefined;
}

if (isBird(pet)) {
    pet.fly(); // Type narrowed to Bird
} else {
    pet.swim(); // Type narrowed to Fish
}
```

## 13. Modules

 TypeScript modules use ES6 module syntax for organizing code into separate files with explicit imports and exports. Modules support default exports, named exports, namespace imports, and re-exports. Type-only imports (`import type`) help avoid including runtime code when only types are needed. Dynamic imports enable code splitting and lazy loading.

```typescript
// Exporting - make code available to other modules
export interface User { /* ... */ } // Named export
export class Auth { /* ... */ } // Named export  
export const PI = 3.14; // Named export
export default function() { /* ... */ } // Default export

// Importing - use code from other modules
import { User, Auth } from './models'; // Named imports
import * as Models from './models'; // Namespace import
import AuthService from './auth-service'; // Default import

// Re-exporting - export from other modules
export { User } from './user'; // Re-export named export
export * from './utils'; // Re-export all named exports

// Type-only imports - import only types (no runtime code)
import type { User } from './models';

// Dynamic imports - load modules at runtime
async function loadModule() {
    const module = await import('./module');
    module.doSomething();
}
```

## 14. Decorators

 Decorators are special functions that modify classes, methods, properties, or parameters at design time. They use the `@expression` syntax and are experimental in TypeScript. Class decorators receive the constructor, method decorators receive property descriptors, property decorators receive property keys, and parameter decorators receive parameter indices. Decorators enable metaprogramming and aspect-oriented programming patterns.

```typescript
// Class decorator - modifies class constructor
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed // Apply decorator to class
class Greeter {
    greeting: string;
    
    constructor(message: string) {
        this.greeting = message;
    }
    
    greet() {
        return "Hello, " + this.greeting;
    }
}

// Method decorator - modifies method behavior
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value; // Change enumerability
    };
}

class Person {
    @enumerable(false) // Make method non-enumerable
    getName() { return this.name; }
}

// Parameter decorator - adds metadata to parameters
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    // Mark parameter as required for validation
}

class Validator {
    validate(@required name: string) { // Parameter is marked required
        // validation logic
    }
}
```

## 15. Wildcards and Special Operators

 TypeScript provides special operators that enhance JavaScript syntax with type-aware features. The non-null assertion operator (`!`) tells the compiler a value isn't `null` or `undefined`. Optional chaining (`?.`) and nullish coalescing (`??`) simplify working with potentially missing values. Definite assignment assertions (`!`) promise variables will be initialized. These operators make code more concise while maintaining type safety.

```typescript
// Non-null assertion operator (!) - assert not null/undefined
let mayBeNull: string | null = getStringOrNull();
let definitelyString: string = mayBeNull!; // Tell compiler it's not null

function example(x?: number | null) {
    console.log(x!.toFixed()); // ! asserts x is not null/undefined
}

// Optional chaining (?.) - safe property access
const adventurer = {
    name: 'Alice',
    cat: { name: 'Dinah' }
};

const dogName = adventurer.dog?.name; // undefined (no error)
adventurer.someNonExistentMethod?.(); // undefined (no error)

// Nullish coalescing operator (??) - default for null/undefined only
let input = null;
let result = input ?? "default"; // "default"

let emptyString = "";
let output = emptyString ?? "default"; // "" (not "default")

// Definite assignment assertion (!) - promise initialization
class Example {
    name!: string; // Tell compiler we'll assign this later
    
    initialize() {
        this.name = "John"; // Assignment happens later
    }
}

// Template literal types with pattern matching
type Events = 'click' | 'hover' | 'focus';
type HandlerNames = `on${Capitalize<Events>}`; // "onClick" | "onHover" | "onFocus"

// Conditional type inference
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
type PromiseType<T> = T extends Promise<infer U> ? U : never;
```
