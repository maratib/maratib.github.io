---
title: GraphQL Core Concepts
slug: guides/api/graphql-core-concepts
description: GraphQL Core Concepts
sidebar:
  order: 1
---

## What is GraphQL
- **GraphQL** is a **query language for APIs**, developed by Facebook
- It solves the pain points of **REST**, like `over-fetching` or `under-fetching`

It can be divided into 4 parts :-
1. **Schema** - GraphQL Blueprint
2. **Queries** - Fetching Data
3. **Mutations** - Create, Update, Delete (***CUD***)
4. **Subscriptions** - Real-Time Updates




![GraphQL Overview](/img/gql/gql1.svg)



<details>
<summary>Schema</summary>

### Schema - GraphQL Blueprint
- The `schema` is the heart of a `GraphQL API`. 
- It defines what data is `available`, how it’s `structured`, and what `operations` (queries, mutations, subscriptions) you can perform. 
- Written in `Schema Definition Language` (SDL), it’s `readable` and `declarative`.

```graphql

# Define the overall structure of the GraphQL API, 
# Specifying the entry points for queries, mutations, and subscriptions

schema {

  # The root type for reading data (queries)
  query: Query

  # The root type for modifying data (mutations)
  mutation: Mutation

  # The root type for real-time data updates (subscriptions)
  subscription: Subscription
}

# Define the Query type, which contains fields that can be queried
type Query {
  # A simple field that returns a String value, e.g., "Hello, World!"
  hello: String
}
```
- This schema declares a `Query` type with a `hello` field that returns a `string`. 
- The schema ensures consistency, so clients know exactly what’s possible.

#### Types : The Building Blocks of Data
1. Scalar Types
2. Object Types
3. Union Types

**1. Scalar Types - The Primitives**
- `ID`: A unique identifier, often a string
- `String`, `Int`, `Float`, `Boolean`

**2. Object Types - The Structure**

```gql
# Define a Post type to represent a blog post or similar content entity in the GraphQL schema
type Post {
  # A unique identifier for the post, marked as non-nullable (required)
  id: ID!
  # The title of the post, marked as non-nullable (required)
  title: String!
  # The content of the post, optional (nullable)
  content: String
  # The author of the post, represented by a User type; can be null if not assigned
  author: User
}
```

**Enums: Restricted Values**

```gql
# Define the enum type
enum UserRole {
  ADMIN
  EDITOR
  VIEWER
}

# Define the User type that uses the enum
type User {
  role: UserRole
}
```
**Interfaces: Shared Fields**
- Interfaces define a contract that multiple types can implement, sharing common fields.

```gql
# Define an interface named Character that specifies a common structure for types like Hero and Villain
interface Character {
  id: ID!
  name: String!
}

# Define a Hero type that implements the Character interface, adding specific fields for a hero
type Hero implements Character {
  id: ID!
  name: String!
  powers: [String]
}

# Define a Villain type that implements the Character interface, adding specific fields for a villain
type Villain implements Character {
  id: ID!
  name: String!
  evilPlan: String
}
```
**Union Types: Mixing Unrelated Types**
- Unions allow a field to return one of several types that don’t share fields.

```gql
# Define the union type
union SearchResult = User | Post

# Define the User type
type User {
  id: ID!
  name: String!
  email: String
}

# Define the Post type
type Post {
  id: ID!
  title: String!
  content: String
}

# Define the schema with Query type
schema {
  query: Query
}

# Define the Query type that includes the search field
type Query {
  search(query: String!): [SearchResult]
}
```
**Response:**

```gql
{
  "data": {
    "search": [
      { "name": "Alice", "email": "alice@example.com" },
      { "title": "GraphQL Basics", "content": "Learn GraphQL..." }
    ]
  }
}
```

**Directives: Decorators for Extra Behavior**
- Directives are like decorators 
- They add extra behavior or metadata to fields, types, or queries without altering their core functionality

```gql
# Define a custom directive named @uppercase that can be applied to FIELD_DEFINITION locations
directive @uppercase on FIELD_DEFINITION

# Define the Query type, which serves as the entry point for reading data
type Query {
  # A field that returns a String value, decorated with the @uppercase directive to transform its output
  greeting: String @uppercase
}
```
- Here, `@uppercase` on `FIELD_DEFINITION` might transform the `greeting` field’s value (e.g., “hello” to “HELLO”).

**Built-In Directives**

- `@include(if: Boolean)`: Include a field if the condition is true.
- `@skip(if: Boolean)`: Skip a field if the condition is true.
- `@deprecated(reason: String)`: Mark a field as deprecated.

**Custom Directives**

- You can define custom directives, like `@uppercase` above, or for authorization.

**Authorization with Directives**

- Custom directives like `@auth(role: String)` can enforce access control.

```gql
# Define the Query type, which serves as the entry point for reading data
type Query {
  # A field that returns a String value, restricted to users with the ADMIN role using the @auth directive
  secretData: String @auth(role: "ADMIN")
}
```
- This ensures only admins access `secretData`. Directives are powerful for adding behaviors like authorization or formatting.

</details>

<details>
<summary>Queries</summary>

### Queries - Fetching Data
Queries are how you read data in GraphQL. They’re read-only and can range from simple to complex.

**Simple Query**

```gql
{
  hello
}
```

**Response: **

```gql
{ "data": { "hello": "World" } }
```

**Arguments**
- Fields can take arguments for filtering:

```gql
{
  user(id: "123") {
    name
  }
}
```

**Variables**
- Variables make queries dynamic, keeping them reusable:

```gql
query GetUser($id: ID!) {
  user(id: $id) {
    name
  }
}
```

**Fragments: Reusable Selections**
- Fragments avoid duplication by defining reusable sets of fields:

```gql
# Define a reusable fragment named UserInfo that specifies a set of fields to fetch from a User type
fragment UserInfo on User {
  name
  email
}
```
```gql
# A query to fetch data for a user and their friend using the UserInfo fragment
{
  # Fetch data for a user with the specified ID (e.g., "123")
  user(id: "123") {
    # Apply the UserInfo fragment to include name and email
    ...UserInfo
  }
  # Fetch data for a friend with the specified ID (e.g., "456")
  friend(id: "456") {
    # Apply the UserInfo fragment to include name and email
    ...UserInfo
  }
}
```
- Inline fragments handle abstract types (unions/interfaces) by specifying type-specific fields:

```gql
# A query to search for data using a query string, handling results that could be either User or Post types
{
  # Fetch search results based on the query string "graphql"
  search(query: "graphql") {
    # Inline fragment to specify fields for User type results
    ... on User {
      name
      email
    }
    # Inline fragment to specify fields for Post type results
    ... on Post {
      title
      content
    }
  }
}
```
- Inline fragments are critical for unions and interfaces, as GraphQL needs to know which fields to fetch for each possible type.

</details>

<details>
<summary>Mutations</summary>

### Mutations - Create, Update, Delete (CUD)

Mutations handle data modification — create, update, delete. They’re like queries but change data and return the updated state for confirmation.

**Input vs. Output Types**
- Input Types: Bundle mutation arguments into a single object using the `input` keyword. They’re limited to scalars, enums, or other input types.
- Output Types: Regular object types (e.g., `User`) returned to show the result.

```gql
# Define the Mutation type, which serves as the entry point for modifying data
type Mutation {
  # Create a new user with the provided input data, returning the created User object
  createUser(input: CreateUserInput!): User!
  # Update an existing user with the specified ID and input data, returning the updated User object
  updateUser(id: ID!, input: UpdateUserInput!): User!
  # Delete a user with the specified ID, returning a Boolean indicating success
  deleteUser(id: ID!): Boolean!
}
```
```gql
# Define an input type for creating a new user, requiring name and email
input CreateUserInput {
  name: String!
  email: String!
  age: Int
}
```

```gql
# Define an input type for updating an existing user, with optional fields
input UpdateUserInput {
  name: String
  email: String
  age: Int
}
```

```gql
# Define the User type to represent a user entity, used as the return type for mutations
type User {
  id: ID!
  name: String!
  email: String
  age: Int
}
```

**Create Mutation**

```gql
mutation {
  createUser(input: {
    name: "Bob"
    email: "bob@example.com"
    age: 30
  }) {
    id
    name
    email
  }
}
```

**Response:**

```gql
{
  "data": {
    "createUser": {
      "id": "456",
      "name": "Bob",
      "email": "bob@example.com"
    }
  }
}
```

**Update Mutation**

```gql
mutation {
  updateUser(id: "456", input: {
    name: "Robert"
    age: 31
  }) {
    id
    name
    age
  }
}
```

**Response:**

```gql
{
  "data": {
    "updateUser": {
      "id": "456",
      "name": "Robert",
      "age": 31
    }
  }
}
```

**Delete Mutation**

```gql
mutation {
  deleteUser(id: "456") {
    success
  }
}
```

**Response:** ```gql{ "data": { "deleteUser": true } }```



</details>

<details>
<summary>Subscriptions</summary>

### Subscriptions: Real-Time Updates
Subscriptions enable real-time data pushes from the server to the client, making them ideal for live updates like chat messages, stock prices, or notifications. 

Unlike queries (one-time fetches) or mutations (data changes), subscriptions maintain an open connection, allowing the server to send data whenever an event occurs.

**How Subscriptions Work**

- Subscriptions are defined in the schema under the `Subscription` type. They often take arguments to filter events and return data when triggered.

```gql
# Define the Subscription type, which serves as the entry point for real-time data updates
type Subscription {
  # Subscribe to new messages in a specific channel, returning the added Message
  messageAdded(channel: String!): Message
  # Subscribe to online status updates for a specific user, returning the UserStatus
  userOnline(userId: ID!): UserStatus
}
```

```gql
# Define the Message type to represent a message entity in real-time updates
type Message {
  id: ID!
  text: String!
  author: User
}
```

```gql
# Define the UserStatus type to represent a user's online status
type UserStatus {
  user: User
  isOnline: Boolean!
}
```

**Subscription Query:**

```gql
subscription {
  messageAdded(channel: "general") {
    text
    author {
      name
    }
  }
}
```
- The client subscribes to `messageAdded` for a specific channel.
- When a new message is added (e.g., via a mutation elsewhere), the server pushes the update to all subscribed clients.
- Response: Multiple pushes over time, like `{ “data”: { “messageAdded”: { “text”: “Hi!”, “author”: { “name”: “Alice” } } } }`

```gql
subscription {
  userOnline(userId: "123") {
    user {
      name
    }
    isOnline
  }
}
```
- This pushes updates whenever the user’s online status changes.

**Key Points**
- Subscriptions use protocols like WebSockets for persistent connections.
- They’re event-driven: The server decides when to send data based on triggers (e.g., database changes).
- Unsubscribe when done to free resources.
- Great for real-time apps, but not for static data — use queries for that.

</details>


![GraphQL Overview](/img/gql/whygql.webp)

