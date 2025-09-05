---
title: Typescript All Operators
slug: guides/typescript/typescript-operators
description: Typescript All Operators
sidebar:
  order: 1
---

- A complete Typescript language reference

# TypeScript Special Operators & Wildcards Quick Reference

## Table of Operators with Examples

| Operator | Symbol | Name | Purpose | Example |
|----------|--------|------|---------|---------|
| `?` | `?` | Optional Property/Parameter | Marks properties or parameters as optional | `interface User { name?: string }`<br>`function greet(name?: string) {}` |
| `!` | `!` | Non-null Assertion | Asserts that a value is not null/undefined | `const element = document.getElementById('myEl')!;`<br>`element.focus(); // No null check needed` |
| `?.` | `?.` | Optional Chaining | Safely access nested properties | `const city = user?.address?.city;`<br>`// undefined if user or address is null` |
| `??` | `??` | Nullish Coalescing | Provides default for null/undefined | `const name = inputName ?? 'Anonymous';`<br>`// Uses 'Anonymous' only if inputName is null/undefined` |
| `&` | `&` | Intersection Type | Combines multiple types | `type Admin = User & { permissions: string[] };`<br>`// Has both User properties and permissions` |
| `\|` | `\|` | Union Type | Represents one of several types | `type ID = string \| number;`<br>`let id: ID = 123; id = 'abc';` |
| `as` | `as` | Type Assertion | Explicit type conversion | `const length = (someValue as string).length;`<br>`const element = el as HTMLInputElement;` |
| `keyof` | `keyof` | Keyof Operator | Gets keys of a type | `type UserKeys = keyof User; // 'name' \| 'age' \| 'email'`<br>`function getProp<T>(obj: T, key: keyof T) {}` |
| `typeof` | `typeof` | Typeof Operator | Gets type of a value | `const user = { name: 'John', age: 30 };`<br>`type UserType = typeof user; // { name: string; age: number }` |
| `in` | `in` | In Operator | Checks property existence | `if ('name' in user) { console.log(user.name); }`<br>`// Type-safe property check` |
| `extends` | `extends` | Constraint Operator | Constrains generic types | `function logLength<T extends { length: number }>(obj: T) {}`<br>`// T must have length property` |
| `infer` | `infer` | Infer Keyword | Infers types in conditionals | `type ArrayType<T> = T extends (infer U)[] ? U : never;`<br>`type Num = ArrayType<number[]>; // number` |
| `readonly` | `readonly` | Readonly Modifier | Makes properties read-only | `interface Point { readonly x: number; readonly y: number; }`<br>`point.x = 5; // Error!` |
| `-?` | `-?` | Required Modifier | Removes optionality | `type Required<T> = { [P in keyof T]-?: T[P] };`<br>`// Makes all properties required` |
| `-readonly` | `-readonly` | Mutable Modifier | Removes readonly | `type Mutable<T> = { -readonly [P in keyof T]: T[P] };`<br>`// Makes all properties mutable` |
| `satisfies` | `satisfies` | Satisfies Operator | Validates without widening | `const colors = ['red', 'green'] satisfies string[];`<br>`// Type is string[], not (string \| number)[]` |

## Wildcards and Special Syntax

| Symbol | Name | Purpose | Example |
|--------|------|---------|---------|
| `*` | Import/Export Wildcard | Import/export all from module | `import * as React from 'react';`<br>`export * from './utils';` |
| `...` | Rest/Spread | Rest parameters or spread elements | `function sum(...numbers: number[]) {}`<br>`const newArr = [...oldArr, newItem];` |
| `[]` | Index Signature | Dynamic object properties | `interface Dictionary { [key: string]: string; }`<br>`const dict: Dictionary = { hello: 'world' };` |
| `<>` | Type Parameters | Generic type parameters | `function identity<T>(value: T): T {}`<br>`type Response<T> = { data: T };` |
| `@` | Decorator | Metadata/annotation | `@Component({ selector: 'app-root' })`<br>`class AppComponent {}` |
| `#` | Private Field | Class private fields | `class User { #password: string; }`<br>`// Truly private, not just TypeScript-private` |
| `_` | Numeric Separator | Readable numbers | `const million = 1_000_000;`<br>`const hex = 0xFF_FF_FF;` |
| `//` | Single-line Comment | Comments | `// This is a comment`<br>`const x = 5; // inline comment` |
| `/* */` | Multi-line Comment | Block comments | `/* This is a`<br>`multi-line comment */` |

## Template Literal Operators

| Operator | Purpose | Example | Result |
|----------|---------|---------|---------|
| `` `...` `` | Template Literal | `` `Hello ${name}!` `` | String interpolation with variables |
| `Capitalize<T>` | Capitalize | `type Cap = Capitalize<'hello'>;` | `'Hello'` |
| `Uncapitalize<T>` | Uncapitalize | `type Uncap = Uncapitalize<'Hello'>;` | `'hello'` |
| `Uppercase<T>` | Uppercase | `type Upper = Uppercase<'hello'>;` | `'HELLO'` |
| `Lowercase<T>` | Lowercase | `type Lower = Lowercase<'HELLO'>;` | `'hello'` |

## Mapped Type Operators

| Operator | Purpose | Example |
|----------|---------|---------|
| `in` | Iterate over keys | `type Optional<T> = { [K in keyof T]?: T[K] };`<br>`// Makes all properties optional` |
| `as` | Key remapping | `type Getters<T> = { [K in keyof T as `get${K}`]: T[K] };`<br>`// Creates getter methods` |
| `?` | Add optionality | `type Partial<T> = { [K in keyof T]?: T[K] };`<br>`// All properties optional` |
| `-?` | Remove optionality | `type Required<T> = { [K in keyof T]-?: T[K] };`<br>`// All properties required` |
| `readonly` | Add readonly | `type Readonly<T> = { readonly [K in keyof T]: T[K] };`<br>`// All properties readonly` |
| `-readonly` | Remove readonly | `type Mutable<T> = { -readonly [K in keyof T]: T[K] };`<br>`// All properties mutable` |

## Module Operators

| Operator | Purpose | Example |
|----------|---------|---------|
| `import` | Import module | `import { Component } from 'react';`<br>`import React from 'react';` |
| `export` | Export member | `export function util() {}`<br>`export const PI = 3.14;` |
| `export default` | Default export | `export default class MyClass {}`<br>`export default function() {}` |
| `export *` | Re-export all | `export * from './math-utils';`<br>`// Re-exports all named exports` |
| `export * as` | Re-export as namespace | `export * as Utils from './utils';`<br>`// Creates Utils namespace` |
| `import type` | Type-only import | `import type { User } from './types';`<br>`// Only imports type, no runtime code` |
| `import()` | Dynamic import | `const module = await import('./my-module');`<br>`// Code splitting` |

## Conditional Type Operators

| Operator | Purpose | Example |
|----------|---------|---------|
| `extends ? :` | Conditional type | `type IsString<T> = T extends string ? true : false;`<br>`type Test = IsString<'hello'>; // true` |
| `infer` | Type inference | `type First<T> = T extends [infer U, ...unknown[]] ? U : never;`<br>`type F = First<[1, 2, 3]>; // 1` |
| `never` | Bottom type | `type Exclude<T, U> = T extends U ? never : T;`<br>`// Excludes types from union` |
| `any` | Top type | `let anything: any = 'could be anything';`<br>`anything = 42; // No type checking` |
| `unknown` | Safe top type | `let unsure: unknown = 'hello';`<br>`// Needs type checking before use` |

## Utility Type Operators

| Operator | Purpose | Example |
|----------|---------|---------|
| `Partial<T>` | Make all optional | `type PartialUser = Partial<User>;`<br>`// All User properties become optional` |
| `Required<T>` | Make all required | `type RequiredUser = Required<PartialUser>;`<br>`// All properties become required` |
| `Readonly<T>` | Make all readonly | `type ReadonlyUser = Readonly<User>;`<br>`// All properties become readonly` |
| `Pick<T, K>` | Pick properties | `type NameOnly = Pick<User, 'name'>;`<br>`// { name: string }` |
| `Omit<T, K>` | Omit properties | `type WithoutId = Omit<User, 'id'>;`<br>`// All properties except id` |
| `Record<K, T>` | Object with key type | `type UserMap = Record<string, User>;`<br>`// { [key: string]: User }` |
| `Exclude<T, U>` | Exclude from union | `type Numbers = Exclude<string \| number, string>;`<br>`// number` |
| `Extract<T, U>` | Extract from union | `type Strings = Extract<string \| number, string>;`<br>`// string` |
| `NonNullable<T>` | Remove null/undefined | `type Clean = NonNullable<string \| null>;`<br>`// string` |
| `Parameters<T>` | Function parameters | `type Params = Parameters<(a: number, b: string) => void>;`<br>`// [number, string]` |
| `ReturnType<T>` | Function return type | `type Return = ReturnType<() => string>;`<br>`// string` |
| `InstanceType<T>` | Constructor instance | `class User {}`<br>`type UserInstance = InstanceType<typeof User>;` |
| `Awaited<T>` | Unwrap Promise | `type Result = Awaited<Promise<string>>;`<br>`// string` |

## Literal Type Operators

| Operator | Purpose | Example |
|----------|---------|---------|
| `as const` | Const assertion | `const colors = ['red', 'green'] as const;`<br>`// Type: readonly ['red', 'green']` |
| `literal` | Literal type | `type Status = 'active' \| 'inactive';`<br>`let status: Status = 'active';` |
| `template literal` | Template type | `` type Email = `${string}@${string}.${string}`; ``<br>`let email: Email = 'user@example.com';` |
