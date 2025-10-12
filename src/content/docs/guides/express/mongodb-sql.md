---
title: MongoDB for SQL
description: MongoDB for SQL
---

## 1. Mental Model Shift

### From Rigid to Flexible

<table width="100%">
<tr><td valign="top">

**SQL Mindset**: Fixed structure

- Tables with predefined columns
- Strict data types
- Normalized data across multiple tables
- Relationships enforced by foreign keys
</td><td valign="top">

**MongoDB Mindset**: Flexible documents

- Collections with varied document structures
- Dynamic schema evolution
- Embedded related data when appropriate
- Application-managed relationships
</td></tr>
</table>

### Data Organization Paradigm

**SQL**: You organize data based on relationships and normalization rules

```sql
-- Thinking in tables and relationships
Users → Posts → Comments → Likes
```

**MongoDB**: You organize data based on access patterns and query requirements

```javascript
// Thinking in documents and usage patterns
{
  user: {
    posts: [{
      comments: [{
        likes: [...]
      }]
    }]
  }
}
```

### Key Philosophy Differences

| Aspect            | SQL Databases              | MongoDB                   |
| ----------------- | -------------------------- | ------------------------- |
| **Schema**        | Schema-first, rigid        | Schema-later, flexible    |
| **Relationships** | Normalized, joins          | Denormalized, embedded    |
| **Scaling**       | Vertical (bigger hardware) | Horizontal (more servers) |
| **Transactions**  | Default, row-level         | Optional, document-level  |
| **Development**   | Design upfront             | Iterative evolution       |

---

## 2. Terminology Mapping

### Core Concepts Translation

| SQL Term        | MongoDB Equivalent  | Key Differences                |
| --------------- | ------------------- | ------------------------------ |
| **Database**    | Database            | Same concept                   |
| **Table**       | Collection          | No enforced schema             |
| **Row**         | Document            | Flexible structure             |
| **Column**      | Field               | Dynamic creation               |
| **Primary Key** | `_id` field         | Auto-generated if not provided |
| **Foreign Key** | Reference           | No database enforcement        |
| **Index**       | Index               | Similar purpose                |
| **JOIN**        | $lookup / Embedding | Different approach             |
| **GROUP BY**    | $group              | More powerful aggregation      |

### Data Types Comparison

| SQL Type       | MongoDB Type  | Notes                 |
| -------------- | ------------- | --------------------- |
| INT, BIGINT    | Number        | 64-bit floating point |
| VARCHAR, TEXT  | String        | UTF-8 encoded         |
| BOOLEAN        | Boolean       | Same                  |
| DATE, DATETIME | Date          | ISO date format       |
| FLOAT, DECIMAL | Number        | No fixed decimal type |
| BLOB           | BinData       | Binary data           |
| JSON           | Object, Array | Native support        |
| ARRAY          | Array         | Native support        |
| UUID           | ObjectId      | 12-byte identifier    |

### Query Structure Comparison

**SQL**: Structured, declarative language

```sql
SELECT column1, column2
FROM table
WHERE conditions
ORDER BY column
LIMIT number;
```

**MongoDB**: Method chaining with JSON-like syntax

```javascript
db.collection
  .find(conditions)
  .project({ field1: 1, field2: 1 })
  .sort({ field: 1 })
  .limit(number);
```

---

## 3. Data Modeling Differences

### Normalization vs Denormalization

**SQL Approach**: Normalize everything

- Split data into multiple tables
- Use joins to reassemble
- Avoid data duplication
- Enforce referential integrity

**MongoDB Approach**: Denormalize based on access patterns

- Embed frequently accessed data
- Duplicate data for performance
- Consider read/write ratios
- Optimize for query patterns

### Relationship Handling

**One-to-Few** (User ←→ Addresses)

```sql
-- SQL: Two tables with foreign key
Users: id, name, email
Addresses: id, user_id, street, city, country
```

```javascript
// MongoDB: Embedded documents
{
  _id: 1,
  name: "John",
  email: "john@example.com",
  addresses: [
    { street: "123 Main St", city: "NYC", country: "USA" },
    { street: "456 Oak Ave", city: "Boston", country: "USA" }
  ]
}
```

**One-to-Many** (Blog ←→ Posts)

```sql
-- SQL: Foreign key relationship
Blogs: id, name, description
Posts: id, blog_id, title, content, created_at
```

```javascript
// MongoDB: Reference or partial embedding
// Option 1: Reference only
{
  _id: 1,
  name: "Tech Blog",
  description: "Technology news"
}
// Posts collection references blog_id

// Option 2: Partial embedding
{
  _id: 1,
  name: "Tech Blog",
  description: "Technology news",
  recent_posts: [
    { _id: 101, title: "Latest Tech", excerpt: "..." },
    { _id: 102, title: "AI Advances", excerpt: "..." }
  ]
}
```

**Many-to-Many** (Students ←→ Courses)

```sql
-- SQL: Junction table
Students: id, name
Courses: id, title
Enrollments: student_id, course_id, enrolled_date
```

```javascript
// MongoDB: Array of references
// Option 1: Embed references in one side
{
  _id: 1,
  name: "Alice",
  courses: [101, 102, 103]  // course IDs
}

// Option 2: Both sides have references
{
  _id: 101,
  title: "Math 101",
  students: [1, 2, 3]  // student IDs
}
```

### Schema Design Considerations

**When to Embed**:

- Data is frequently accessed together
- One-to-few relationships
- Data doesn't change frequently
- Total document size < 16MB

**When to Reference**:

- One-to-many or many-to-many relationships
- Embedded data would cause duplication
- Data is updated frequently
- Documents would exceed size limits

---

## 4. Query Language Comparison

### Basic CRUD Operations

**Create Operations**

```sql
-- SQL INSERT
INSERT INTO users (name, email, age)
VALUES ('John', 'john@example.com', 30);
```

```javascript
// MongoDB insertOne
db.users.insertOne({
  name: "John",
  email: "john@example.com",
  age: 30,
});
```

**Read Operations**

```sql
-- SQL SELECT
SELECT name, email FROM users
WHERE age > 25
ORDER BY name
LIMIT 10;
```

```javascript
// MongoDB find
db.users
  .find({ age: { $gt: 25 } }, { name: 1, email: 1 })
  .sort({ name: 1 })
  .limit(10);
```

**Update Operations**

```sql
-- SQL UPDATE
UPDATE users
SET age = 31, last_updated = NOW()
WHERE name = 'John';
```

```javascript
// MongoDB updateOne
db.users.updateOne(
  { name: "John" },
  {
    $set: { age: 31, last_updated: new Date() },
  }
);
```

**Delete Operations**

```sql
-- SQL DELETE
DELETE FROM users WHERE age < 18;
```

```javascript
// MongoDB deleteMany
db.users.deleteMany({ age: { $lt: 18 } });
```

### Query Operators Translation

**Comparison Operators**
| SQL Operator | MongoDB Operator | Example |
|--------------|------------------|---------|
| `=` | `$eq` | `age = 25` → `{age: {$eq: 25}}` |
| `!=` | `$ne` | `age != 25` → `{age: {$ne: 25}}` |
| `>` | `$gt` | `age > 25` → `{age: {$gt: 25}}` |
| `>=` | `$gte` | `age >= 25` → `{age: {$gte: 25}}` |
| `<` | `$lt` | `age < 25` → `{age: {$lt: 25}}` |
| `<=` | `$lte` | `age <= 25` → `{age: {$lte: 25}}` |
| `IN` | `$in` | `age IN (25,30)` → `{age: {$in: [25,30]}}` |
| `NOT IN` | `$nin` | `age NOT IN (25,30)` → `{age: {$nin: [25,30]}}` |

**Logical Operators**
| SQL | MongoDB | Example |
|-----|---------|---------|
| `AND` | `$and` | `age > 25 AND name = 'John'` → `{$and: [{age: {$gt: 25}}, {name: 'John'}]}` |
| `OR` | `$or` | `age < 18 OR age > 65` → `{$or: [{age: {$lt: 18}}, {age: {$gt: 65}}]}` |
| `NOT` | `$not` | `NOT (age > 25)` → `{age: {$not: {$gt: 25}}}` |

**Pattern Matching**

```sql
-- SQL LIKE
SELECT * FROM users
WHERE name LIKE 'J%'
   OR name LIKE '%ohn%';
```

```javascript
// MongoDB $regex
db.users.find({
  name: {
    $regex: /^J|ohn/,
    $options: "i", // case insensitive
  },
});
```

### Advanced Query Patterns

**Pagination**

```sql
-- SQL Pagination
SELECT * FROM products
ORDER BY price DESC
LIMIT 10 OFFSET 20;
```

```javascript
// MongoDB Pagination
db.products.find().sort({ price: -1 }).skip(20).limit(10);
```

**Null Handling**

```sql
-- SQL NULL check
SELECT * FROM users
WHERE email IS NULL
   OR email = '';
```

```javascript
// MongoDB null/empty check
db.users.find({
  $or: [{ email: null }, { email: "" }, { email: { $exists: false } }],
});
```

---

## 5. Joins vs References

### SQL JOINs in MongoDB

**INNER JOIN Equivalent**

```sql
-- SQL INNER JOIN
SELECT u.name, p.title
FROM users u
INNER JOIN posts p ON u.id = p.user_id;
```

```javascript
// MongoDB $lookup (aggregation)
db.users.aggregate([
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "user_id",
      as: "user_posts",
    },
  },
  {
    $unwind: "$user_posts",
  },
  {
    $project: {
      name: 1,
      title: "$user_posts.title",
    },
  },
]);
```

**LEFT JOIN Equivalent**

```sql
-- SQL LEFT JOIN
SELECT u.name, p.title
FROM users u
LEFT JOIN posts p ON u.id = p.user_id;
```

```javascript
// MongoDB $lookup with preserveNullAndEmptyArrays
db.users.aggregate([
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "user_id",
      as: "user_posts",
    },
  },
  {
    $unwind: {
      path: "$user_posts",
      preserveNullAndEmptyArrays: true,
    },
  },
]);
```

### Embedding as Alternative to JOINs

**Pre-joined Data**

```sql
-- SQL: Multiple tables
Customers: id, name, email
Orders: id, customer_id, total, order_date
OrderItems: id, order_id, product_id, quantity
```

```javascript
// MongoDB: Embedded approach
{
  _id: 123,
  name: "John Doe",
  email: "john@example.com",
  orders: [
    {
      order_id: 1001,
      order_date: ISODate("2023-01-15"),
      total: 199.99,
      items: [
        { product: "Laptop", quantity: 1, price: 999.99 },
        { product: "Mouse", quantity: 2, price: 49.99 }
      ]
    }
  ]
}
```

### Reference Patterns

**Manual Population** (Application-level joins)

```javascript
// Step 1: Find users
const users = db.users.find({ city: "New York" }).toArray();

// Step 2: Get their posts
const userIds = users.map((u) => u._id);
const posts = db.posts.find({ user_id: { $in: userIds } }).toArray();

// Step 3: Combine in application
const usersWithPosts = users.map((user) => ({
  ...user,
  posts: posts.filter((post) => post.user_id.equals(user._id)),
}));
```

---

## 6. Transactions & ACID

### ACID Properties Comparison

| ACID Property   | SQL Databases                 | MongoDB                                 |
| --------------- | ----------------------------- | --------------------------------------- |
| **Atomicity**   | Row-level atomic operations   | Document-level atomic operations        |
| **Consistency** | Strong consistency by default | Configurable consistency levels         |
| **Isolation**   | Multiple isolation levels     | Snapshot isolation for transactions     |
| **Durability**  | Write-ahead logging           | Journaling with configurable durability |

### Transactions in MongoDB

**Single Document Atomicity**

```javascript
// Atomic operation on single document
db.products.updateOne(
  { _id: 123, quantity: { $gte: 1 } },
  {
    $inc: { quantity: -1 },
    $push: { sales: { date: new Date(), amount: 99.99 } },
  }
);
// This is atomic - either both operations succeed or both fail
```

**Multi-Document Transactions**

```javascript
// SQL-like transaction
const session = db.getMongo().startSession();

try {
  session.startTransaction();

  // Update inventory
  db.products.updateOne({ _id: 123 }, { $inc: { quantity: -1 } }, { session });

  // Create order
  db.orders.insertOne(
    {
      product_id: 123,
      quantity: 1,
      order_date: new Date(),
    },
    { session }
  );

  session.commitTransaction();
} catch (error) {
  session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

### Consistency Models

**Write Concern**

```javascript
// Control when write is acknowledged
db.users.insertOne(
  { name: "John" },
  {
    writeConcern: {
      w: "majority", // Wait for majority of replicas
      j: true, // Journal durability
    },
  }
);
```

**Read Concern**

```javascript
// Control read consistency
db.users.find({ age: { $gt: 25 } }, { readConcern: { level: "majority" } });
```

---

## 7. Indexing Strategies

### Index Types Comparison

| Index Type       | SQL                                             | MongoDB                                                            | Use Case             |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------ | -------------------- |
| **Single Field** | `CREATE INDEX idx_name ON users(name)`          | `db.users.createIndex({name: 1})`                                  | Equality queries     |
| **Compound**     | `CREATE INDEX idx_name_age ON users(name, age)` | `db.users.createIndex({name: 1, age: 1})`                          | Multi-field queries  |
| **Unique**       | `CREATE UNIQUE INDEX idx_email ON users(email)` | `db.users.createIndex({email: 1}, {unique: true})`                 | Enforce uniqueness   |
| **Text**         | Full-text search extensions                     | `db.posts.createIndex({content: "text"})`                          | Text search          |
| **Geospatial**   | Spatial extensions                              | `db.places.createIndex({location: "2dsphere"})`                    | Location queries     |
| **Partial**      | Filtered indexes                                | `db.users.createIndex({name: 1}, {partialFilter: {active: true}})` | Conditional indexing |

### Index Strategy Translation

**Covering Indexes**

```sql
-- SQL: Index covers query
CREATE INDEX idx_covering ON users(name, email);
SELECT name, email FROM users WHERE name = 'John';
```

```javascript
// MongoDB: Covered query
db.users.createIndex({ name: 1, email: 1 });
db.users.find({ name: "John" }, { name: 1, email: 1, _id: 0 });
```

**Composite Index Order**

```sql
-- SQL: Order matters for range queries
CREATE INDEX idx_composite ON users(last_name, first_name, age);
SELECT * FROM users
WHERE last_name = 'Smith'
  AND first_name = 'John'
  AND age > 25;
```

```javascript
// MongoDB: ESR rule (Equality, Sort, Range)
db.users.createIndex({
  last_name: 1, // Equality
  first_name: 1, // Equality
  age: -1, // Sort/Range
});
```

### Index Management

**Viewing Indexes**

```sql
-- SQL
SHOW INDEX FROM users;
```

```javascript
// MongoDB
db.users.getIndexes();
```

**Index Size & Usage**

```sql
-- SQL
SELECT * FROM sys.dm_db_index_usage_stats;
```

```javascript
// MongoDB
db.users.aggregate([{ $indexStats: {} }]);
```

---

## 8. Aggregation vs SQL

### Aggregation Pipeline = SQL Queries on Steroids

**Basic GROUP BY**

```sql
-- SQL GROUP BY
SELECT department, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 50000;
```

```javascript
// MongoDB $group
db.employees.aggregate([
  {
    $group: {
      _id: "$department",
      avg_salary: { $avg: "$salary" },
    },
  },
  {
    $match: {
      avg_salary: { $gt: 50000 },
    },
  },
]);
```

**Complex Aggregation Example**

```sql
-- SQL: Multiple joins and aggregations
SELECT
  u.name,
  COUNT(p.id) as post_count,
  AVG(p.likes) as avg_likes,
  MAX(p.created_at) as last_post
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.active = true
GROUP BY u.id, u.name
HAVING COUNT(p.id) > 5
ORDER BY post_count DESC;
```

```javascript
// MongoDB aggregation pipeline
db.users.aggregate([
  // $match = WHERE
  { $match: { active: true } },

  // $lookup = LEFT JOIN
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "user_id",
      as: "user_posts",
    },
  },

  // $group = GROUP BY
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      post_count: { $sum: { $size: "$user_posts" } },
      avg_likes: { $avg: "$user_posts.likes" },
      last_post: { $max: "$user_posts.created_at" },
    },
  },

  // $match = HAVING
  { $match: { post_count: { $gt: 5 } } },

  // $sort = ORDER BY
  { $sort: { post_count: -1 } },
]);
```

### Pipeline Stages Translation

| SQL Clause | Aggregation Stage         | Purpose                |
| ---------- | ------------------------- | ---------------------- |
| `WHERE`    | `$match`                  | Filter documents       |
| `GROUP BY` | `$group`                  | Group documents        |
| `HAVING`   | `$match` (after `$group`) | Filter groups          |
| `SELECT`   | `$project`                | Shape output documents |
| `ORDER BY` | `$sort`                   | Sort documents         |
| `LIMIT`    | `$limit`                  | Limit result count     |
| `JOIN`     | `$lookup`                 | Join collections       |
| `UNION`    | `$unionWith`              | Combine results        |

### Advanced Aggregation Features

**Array Operations**

```javascript
// Unwind arrays (like SQL unnest)
db.orders.aggregate([
  { $unwind: "$items" }, // Explode array into multiple documents
  {
    $group: {
      _id: "$items.category",
      total_sales: { $sum: "$items.amount" },
    },
  },
]);
```

**Conditional Logic**

```javascript
// CASE WHEN equivalent
db.employees.aggregate([
  {
    $project: {
      name: 1,
      salary: 1,
      bonus_tier: {
        $switch: {
          branches: [
            { case: { $gte: ["$salary", 100000] }, then: "A" },
            { case: { $gte: ["$salary", 50000] }, then: "B" },
          ],
          default: "C",
        },
      },
    },
  },
]);
```

---

## 9. Schema Design Patterns

### Common Patterns from SQL World

**Extended Reference Pattern**

```sql
-- SQL: Normalized with joins
SELECT o.*, c.name, c.email
FROM orders o
JOIN customers c ON o.customer_id = c.id;
```

```javascript
// MongoDB: Duplicate frequently accessed fields
{
  _id: 1001,
  order_date: ISODate("2023-01-15"),
  total: 199.99,
  customer: {
    _id: 123,
    name: "John Doe",      // Duplicated from customers
    email: "john@example.com"  // Duplicated for performance
  }
}
```

**Bucket Pattern** (for time-series data)

```sql
-- SQL: One row per measurement
CREATE TABLE sensor_readings (
  sensor_id INT,
  timestamp TIMESTAMP,
  value FLOAT
);
```

```javascript
// MongoDB: Bucket by hour/day
{
  sensor_id: 1,
  date: ISODate("2023-01-15"),
  readings: [  // Array of measurements for this hour
    { time: ISODate("2023-01-15T10:00:00"), value: 23.5 },
    { time: ISODate("2023-01-15T10:01:00"), value: 23.6 },
    // ... 58 more readings for this hour
  ]
}
```

**Computed Pattern** (Materialized Views)

```sql
-- SQL: Materialized view or computed column
CREATE MATERIALIZED VIEW user_stats AS
SELECT
  user_id,
  COUNT(*) as post_count,
  AVG(likes) as avg_likes
FROM posts
GROUP BY user_id;
```

```javascript
// MongoDB: Pre-compute and store
{
  _id: 123,
  name: "John",
  stats: {  // Computed and updated on writes
    post_count: 45,
    avg_likes: 23.4,
    last_activity: ISODate("2023-01-15")
  }
}
```

### Migration-Friendly Patterns

**Schema Versioning**

```javascript
// Include schema version in documents
{
  _id: 123,
  schema_version: 2,  // Track schema version
  name: "John",
  email: "john@example.com",
  // New fields in version 2
  preferences: {
    theme: "dark",
    notifications: true
  }
}
```

**Polymorphic Pattern**

```javascript
// Different document types in same collection
{
  _id: 1,
  type: "book",
  title: "MongoDB Guide",
  author: "John Doe",
  pages: 300
}

{
  _id: 2,
  type: "movie",
  title: "MongoDB Documentary",
  director: "Jane Smith",
  duration: 120
}
```

---

## 10. Migration Strategies

### Planning Your Migration

**Assessment Phase**

1. **Analyze SQL schema** and relationships
2. **Identify access patterns** and query types
3. **Choose embedding vs referencing** strategies
4. **Plan index strategy** based on queries

**Migration Approaches**

1. **Big Bang**: Complete migration at once
2. **Hybrid**: Both systems running temporarily
3. **Incremental**: Migrate data piece by piece

### Data Migration Steps

**Schema Mapping**

```sql
-- SQL Schema analysis
TABLE users:
  id INT PK
  name VARCHAR(100)
  email VARCHAR(255) UNIQUE
  created_at TIMESTAMP

TABLE posts:
  id INT PK
  user_id INT FK
  title VARCHAR(200)
  content TEXT
  created_at TIMESTAMP
```

```javascript
// MongoDB Schema design
// Option 1: Embedded posts
{
  _id: ObjectId("..."),
  name: "John",
  email: "john@example.com",
  created_at: ISODate("..."),
  posts: [
    {
      title: "First Post",
      content: "...",
      created_at: ISODate("...")
    }
  ]
}

// Option 2: Referenced posts
{
  _id: ObjectId("..."),
  name: "John",
  email: "john@example.com",
  created_at: ISODate("...")
}
// Separate posts collection with user_id reference
```

**Migration Script Approach**

```javascript
// Example migration script structure

// 1. Migrate users
const sqlUsers = sqlQuery("SELECT * FROM users");
const mongoUsers = sqlUsers.map((user) => ({
  _id: new ObjectId(),
  name: user.name,
  email: user.email,
  created_at: new Date(user.created_at),
  // Convert SQL data types to MongoDB
}));
db.users.insertMany(mongoUsers);

// 2. Migrate posts with references
const sqlPosts = sqlQuery("SELECT * FROM posts");
const mongoPosts = sqlPosts.map((post) => ({
  _id: new ObjectId(),
  user_id: getMongoUserId(post.user_id), // Map SQL FK to MongoDB ObjectId
  title: post.title,
  content: post.content,
  created_at: new Date(post.created_at),
}));
db.posts.insertMany(mongoPosts);
```

### Application Changes

**Query Layer Abstraction**

```javascript
// Before: SQL queries
const user = sqlQuery("SELECT * FROM users WHERE id = ?", [userId]);

// After: MongoDB queries
const user = db.users.findOne({ _id: new ObjectId(userId) });

// Better: Use data access layer
class UserRepository {
  async findById(id) {
    return db.users.findOne({ _id: new ObjectId(id) });
  }

  async findWithPosts(userId) {
    return db.users.aggregate([
      { $match: { _id: new ObjectId(userId) } },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "user_id",
          as: "posts",
        },
      },
    ]);
  }
}
```

### Testing & Validation

**Data Consistency Checks**

1. **Record counts** match between systems
2. **Data integrity** validation
3. **Query result** comparison
4. **Performance** benchmarking

**Rollback Strategy**

1. **Backup MongoDB** before major changes
2. **Feature flags** for new MongoDB code paths
3. **Dual writing** during transition period
4. **Gradual traffic shifting**
