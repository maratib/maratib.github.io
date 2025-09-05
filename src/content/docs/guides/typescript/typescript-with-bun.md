---
title: Typescript with Bun
slug: guides/typescript/typescript-with-bun
description: Typescript with Bun
sidebar:
  order: 3
---

Bun is a fast JavaScript runtime that's excellent for TypeScript development. Here's how to get started learning TypeScript using Bun:

## Installation

First, install Bun:

```bash
# Using npm
npm install -g bun
```

## Setting Up a TypeScript Project

Create a new project:

```bash
mkdir my-typescript-project
cd my-typescript-project
bun init
```

Or Install TypeScript (though Bun has built-in TS support):

```bash
bun add -d typescript
bun add -d @types/bun
```

## Basic TypeScript Example

Create a simple TypeScript file `index.ts`:

```typescript
// Basic types
let message: string = "Hello, TypeScript with Bun!";
let count: number = 42;
let isActive: boolean = true;

// Function with type annotations
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Interface
interface User {
  id: number;
  name: string;
  email?: string; // Optional property
}

// Using the interface
const user: User = {
  id: 1,
  name: "Alice"
};

// Arrays and generics
const numbers: number[] = [1, 2, 3];
const users: User[] = [user];

// Run the code
console.log(greet("Bun User"));
console.log("User:", user);
```

## Running TypeScript with Bun

Run your TypeScript file directly:

```bash
bun run index.ts
```

## Package.json Configuration

Your `package.json` should look like this:

```json
{
  "name": "my-typescript-project",
  "module": "index.ts",
  "type": "module",
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/bun": "latest"
  },
  "peerDependencies": {
    "typescript": "^5.0.0"
  }
}
```

## tsconfig.json

Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## Advanced Example: HTTP Server

Create `server.ts`:

```typescript
import { serve } from 'bun';

// Type for request data
interface RequestData {
  name?: string;
  email?: string;
}

const server = serve({
  port: 3000,
  async fetch(request: Request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/users' && request.method === 'POST') {
      try {
        const data: RequestData = await request.json();
        
        if (!data.name) {
          return new Response(
            JSON.stringify({ error: 'Name is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            message: `User ${data.name} created successfully`,
            data 
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Invalid JSON' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    return new Response('Hello from Bun TypeScript Server!');
  },
});

console.log('Server running at http://localhost:3000');
```

Run the server:
```bash
bun run server.ts
```

## Testing with TypeScript

Create a test file `index.test.ts`:

```typescript
import { expect, test } from 'bun:test';
import { greet } from './index';

test('greet function works correctly', () => {
  expect(greet('Alice')).toBe('Hello, Alice!');
  expect(greet('Bob')).toBe('Hello, Bob!');
});

// Async test example
test('async operations', async () => {
  const result = await Promise.resolve('async result');
  expect(result).toBe('async result');
});
```

Run tests:
```bash
bun test
```

## Useful Bun Commands for TypeScript

```bash
# Run TypeScript file
bun run file.ts

# Start development server with hot reload
bun --hot server.ts

# Install TypeScript types
bun add -d @types/node

# Build project
bun build ./index.ts --outdir ./dist

# Run tests
bun test
```

## Key Benefits of Using Bun with TypeScript

1. **Fast execution** - Bun runs TypeScript natively without compilation step
2. **Built-in TypeScript support** - No additional setup needed
3. **Excellent developer experience** - Fast startup and hot reload
4. **All-in-one tool** - Package manager, test runner, and bundler

## Next Steps

1. Explore Bun's built-in APIs for file system, HTTP, and more
2. Learn about Bun's native SQLite support
3. Experiment with Bun's plugin system
4. Try building a full-stack application with Bun and TypeScript

