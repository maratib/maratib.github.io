---
title: DynamoDB
description: Complete Guide to Amazon DynamoDB
date: 2026-04-14
---
 
 # DynamoDB

Amazon **DynamoDB is a fully managed NoSQL database** service that provides fast and predictable performance with seamless scalability . 

Designed to run **high-performance applications** at any scale, handling trillions of requests per day while maintaining **single-digit millisecond latency**.

---


## 1. What is Amazon DynamoDB?

Amazon DynamoDB is a fully managed NoSQL database service that supports both key-value and document data models . Unlike traditional relational databases, DynamoDB is schemaless and designed for horizontal scaling, allowing you to store and retrieve any amount of data with consistent, single-digit millisecond latency at any scale .

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Fully Managed** | No servers to provision, patch, or manage—AWS handles everything  |
| **Automatic Scaling** | Scales throughput and storage automatically based on traffic patterns |
| **Single-Digit Millisecond Latency** | Consistent low-latency performance at any scale  |
| **Serverless** | No infrastructure management; pay only for what you use  |
| **High Availability** | Data is automatically replicated across multiple Availability Zones  |
| **ACID Transactions** | Support for atomic, consistent, isolated, and durable transactions across multiple items and tables  |
| **Flexible Data Model** | Supports both key-value and document data models with nested attributes up to 32 levels deep  |

---

## 2. Core Components

Understanding the basic building blocks of DynamoDB is essential .

### Tables, Items, and Attributes

| Component | Description | Analogy |
|-----------|-------------|---------|
| **Table** | A collection of data; the container for your items | Similar to a table in a relational database |
| **Item** | A group of attributes uniquely identifiable by a primary key; each item represents one entity | Similar to a row or record |
| **Attribute** | A fundamental data element; a key-value pair within an item | Similar to a field or column |

### Example: People Table

Here's how data is structured in DynamoDB :

```json
{
    "PersonID": 101,
    "LastName": "Smith",
    "FirstName": "Fred",
    "Phone": "555-4321"
}

{
    "PersonID": 102,
    "LastName": "Jones",
    "FirstName": "Mary",
    "Address": {
        "Street": "123 Main",
        "City": "Anytown",
        "State": "OH",
        "ZIPCode": 12345
    }
}

{
    "PersonID": 103,
    "LastName": "Stephens",
    "FirstName": "Howard",
    "Address": {
        "Street": "123 Main",
        "City": "London",
        "PostalCode": "ER3 5K8"
    },
    "FavoriteColor": "Blue"
}
```

**Key observations about this example :**
- Each item has a unique identifier (primary key) called `PersonID`
- The table is **schemaless**—items can have different attributes
- Nested attributes (like `Address`) are supported up to 32 levels deep
- Scalar attributes (strings, numbers) can have only one value

### Example: Music Table

A table with a composite primary key :

```json
{
    "Artist": "No One You Know",
    "SongTitle": "My Dog Spot",
    "AlbumTitle": "Hey Now",
    "Price": 1.98,
    "Genre": "Country",
    "CriticRating": 8.4
}

{
    "Artist": "The Acme Band",
    "SongTitle": "Still in Love",
    "AlbumTitle": "The Buck Starts Here",
    "Price": 2.47,
    "Genre": "Rock",
    "PromotionInfo": {
        "RadioStationsPlaying": ["KHCR", "KQBX", "WTNR", "WJJH"],
        "TourDates": {
            "Seattle": "20150622",
            "Cleveland": "20150630"
        }
    }
}
```

---

## 3. Primary Keys and Indexing

### Primary Key Types

When you create a table, you must specify a primary key that uniquely identifies each item .

| Key Type | Components | Description | Example |
|----------|------------|-------------|---------|
| **Simple Primary Key (Partition Key)** | 1 attribute | DynamoDB uses the partition key as input to a hash function to determine storage partition. No two items can have the same partition key value. | `PersonID` in People table |
| **Composite Primary Key (Partition Key + Sort Key)** | 2 attributes | Items with the same partition key are stored together, sorted by sort key. Multiple items can have the same partition key but different sort keys. | `Artist` (partition) + `SongTitle` (sort) in Music table |

### Terminology

- **Partition Key** = Hash attribute (due to internal hash function) 
- **Sort Key** = Range attribute (items with same partition key are stored physically close in sorted order)

### Secondary Indexes

Secondary indexes let you query data using an alternate key .

| Index Type | Description | Key Difference |
|------------|-------------|----------------|
| **Global Secondary Index (GSI)** | Index with partition and sort keys that can be different from the table | Can span the entire table; keys don't need to be unique |
| **Local Secondary Index (LSI)** | Index with the same partition key as the table but a different sort key | Must be created when the table is created |

**Limits:** Up to 20 GSIs (default quota) and 5 LSIs per table .

**Example Use Case:** In the Music table, you can query by `Artist` (partition key) or by `Artist` and `SongTitle`. To query by `Genre` and `AlbumTitle`, create a GSI with `Genre` as partition key and `AlbumTitle` as sort key .

---

## 4. Capacity Modes: On-Demand vs. Provisioned

DynamoDB offers two capacity modes .

| Feature | On-Demand Mode | Provisioned Mode |
|---------|----------------|------------------|
| **Capacity Planning** | Not required—scales automatically | You specify read/write capacity units |
| **Best For** | Unpredictable workloads, new applications | Predictable workloads, cost optimization |
| **Scaling** | Instant; adapts to any previously reached traffic level | Auto-scaling adjusts within min/max limits |
| **Pricing** | Pay per request | Pay per provisioned unit per hour |
| **Cost at High Volume** | More expensive | Cheaper with reserved capacity |

### Read/Write Capacity Units

**Provisioned Mode Units :**

| Unit | Definition |
|------|------------|
| **Read Capacity Unit (RCU)** | One strongly consistent read per second for an item up to 4 KB |
| **Write Capacity Unit (WCU)** | One write per second for an item up to 1 KB |

**On-Demand Mode Pricing Factors :**
- Write request units: up to 1 KB per write
- Read request units: up to 4 KB per read
- Transactional reads/writes consume 2 units each

---

## 5. Step-by-Step: Creating Your First DynamoDB Table

### Prerequisites
- AWS account
- AWS Management Console access

### Step 1: Access DynamoDB Console

1. Sign in to AWS Console
2. Navigate to **DynamoDB** (type in search bar)

### Step 2: Create a Table

1. Click **Create table** 
2. Enter **Table name** (e.g., `Music`)
3. Configure **Partition key** (e.g., `Artist` as String)
4. Configure **Sort key** (optional, e.g., `SongTitle` as String)
5. Choose **Default settings** or **Customize settings**

### Step 3: Configure Capacity Settings

**For on-demand mode:**
- Select **On-demand** under Capacity settings

**For provisioned mode:**
- Select **Provisioned**
- Enter read and write capacity units
- Enable **Auto scaling** with target utilization (e.g., 70%)

### Step 4: Configure Additional Settings (Optional)

| Setting | Options | When to Use |
|---------|---------|-------------|
| **Secondary indexes** | GSI or LSI | Add alternate query patterns |
| **Encryption** | AWS owned or KMS key | Compliance requirements |
| **Point-in-time recovery** | Enable/disable | Protection from accidental writes/deletes |
| **Tags** | Key-value pairs | Cost tracking, resource management |

### Step 5: Create Table

Click **Create table**. Table status changes from **Creating** to **Active** when ready .

---

## 6. Working with Data: CRUD Operations

### Creating Items

Using AWS Console :

1. Navigate to **Explore items**
2. Select your table
3. Click **Create item**
4. Enter attributes as JSON:
```json
{
    "Artist": "No One You Know",
    "SongTitle": "Call Me Today",
    "AlbumTitle": "Hey Now",
    "Price": 1.98
}
```
5. Click **Create item**

Using AWS CLI:
```bash
aws dynamodb put-item \
    --table-name Music \
    --item '{
        "Artist": {"S": "No One You Know"},
        "SongTitle": {"S": "Call Me Today"},
        "AlbumTitle": {"S": "Hey Now"},
        "Price": {"N": "1.98"}
    }'
```

### Reading Items

Get a single item by its primary key:

```bash
aws dynamodb get-item \
    --table-name Music \
    --key '{
        "Artist": {"S": "No One You Know"},
        "SongTitle": {"S": "Call Me Today"}
    }'
```

### Updating Items

```bash
aws dynamodb update-item \
    --table-name Music \
    --key '{
        "Artist": {"S": "No One You Know"},
        "SongTitle": {"S": "Call Me Today"}
    }' \
    --update-expression "SET Price = :p" \
    --expression-attribute-values '{":p": {"N": "2.49"}}'
```

### Deleting Items

```bash
aws dynamodb delete-item \
    --table-name Music \
    --key '{
        "Artist": {"S": "No One You Know"},
        "SongTitle": {"S": "Call Me Today"}
    }'
```

---

## 7. Querying and Scanning

### Query Operations

**Query** is the most efficient way to retrieve data. It uses primary keys to find items .

**Basic query (all items with a partition key):**
```bash
aws dynamodb query \
    --table-name Music \
    --key-condition-expression "Artist = :artist" \
    --expression-attribute-values '{":artist": {"S": "The Acme Band"}}'
```

**Query with sort key condition:**
```bash
aws dynamodb query \
    --table-name Music \
    --key-condition-expression "Artist = :artist AND begins_with(SongTitle, :title)" \
    --expression-attribute-values '{
        ":artist": {"S": "The Acme Band"},
        ":title": {"S": "S"}
    }'
```

### Scan Operations

**Scan** reads every item in the table—use sparingly as it consumes more read capacity .

```bash
aws dynamodb scan \
    --table-name Music \
    --filter-expression "Genre = :genre" \
    --expression-attribute-values '{":genre": {"S": "Rock"}}'
```

| Operation | Performance | Use Case |
|-----------|-------------|----------|
| **Query** | Fast, efficient | Known primary key, predictable access patterns |
| **Scan** | Slow, expensive | Data export, infrequent analytics |

---

## 8. Advanced Features

### DynamoDB Streams

DynamoDB Streams captures a time-ordered sequence of item-level modifications in a table . Stream records are stored for 24 hours.

**Stream View Types :**

| View Type | Data Included |
|-----------|---------------|
| `KEYS_ONLY` | Only the key attributes of modified items |
| `NEW_IMAGE` | The entire item as it appears after modification |
| `OLD_IMAGE` | The entire item as it appeared before modification |
| `NEW_AND_OLD_IMAGES` | Both before and after images |

**Common use cases :**
- Real-time metrics aggregation
- Cross-region replication (Global Tables use this internally)
- Triggering Lambda functions for event-driven architectures

### Transactions

DynamoDB supports ACID (Atomic, Consistent, Isolated, Durable) transactions across multiple items and tables .

| Operation | Description |
|-----------|-------------|
| `TransactWriteItems` | Atomic, all-or-nothing write across up to 100 items |
| `TransactGetItems` | Atomic, consistent read across up to 100 items |

**Use cases:** Financial transactions, inventory management, any operation requiring coordination across multiple items.

### PartiQL

SQL-compatible query language for DynamoDB:

```sql
-- Select
SELECT * FROM Music WHERE Artist = 'The Acme Band'

-- Insert
INSERT INTO Music VALUE {'Artist': 'No One You Know', 'SongTitle': 'New Song'}

-- Update
UPDATE Music SET Price = 2.49 WHERE Artist = 'No One You Know' AND SongTitle = 'Call Me Today'

-- Delete
DELETE FROM Music WHERE Artist = 'The Acme Band' AND SongTitle = 'Still in Love'
```

---

## 9. DynamoDB Accelerator (DAX)

DynamoDB Accelerator (DAX) is an in-memory cache that delivers microsecond latency for read-heavy workloads .

### Key Features

| Feature | Description |
|---------|-------------|
| **Latency** | Reduces read latency from milliseconds to microseconds  |
| **Compatibility** | API-compatible with DynamoDB—no code changes required |
| **Managed** | Fully managed, highly available in-memory cache |
| **Use Case** | Read-heavy, repeated access patterns |

### When to Use DAX

- Applications with high read-to-write ratios
- Repeated reads of the same items (hot keys)
- Real-time analytics and gaming leaderboards

### When NOT to Use DAX

- Write-heavy workloads (no benefit)
- Applications that can't tolerate eventual consistency
- Small tables where native DynamoDB is already fast

---

## 10. DynamoDB Streams and Triggers

### Streams + Lambda Integration

DynamoDB integrates with AWS Lambda to create **triggers**—automated responses to data changes .

**How it works:**

```
Data Change → DynamoDB Streams → Lambda Trigger → Execute Custom Logic
```

**Example use cases :**
- Send welcome email when new user record is created
- Sync data to OpenSearch for full-text search
- Update denormalized aggregates (e.g., total likes count)
- Fan out changes to other systems via EventBridge

### Kinesis Data Streams for DynamoDB

For advanced streaming use cases, you can capture item-level changes to Kinesis Data Streams, enabling longer retention and integration with Kinesis Data Firehose for data delivery to S3, Redshift, or OpenSearch .

---

## 11. Global Tables: Multi-Region Replication

DynamoDB Global Tables provide fully managed, multi-region, multi-master replication .

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Low-latency access** | Users read/write from the closest region |
| **High availability** | Automatic failover across regions |
| **Active-Active** | Write to any region; replication is automatic |
| **No application changes** | Use standard DynamoDB APIs |

### Architecture

```
US-East-1 Region              EU-West-1 Region
┌─────────────────┐           ┌─────────────────┐
│  DynamoDB       │◄──────────│  DynamoDB       │
│  Table          │ Replication│  Table          │
│  (Active)       │──────────►│  (Active)       │
└─────────────────┘           └─────────────────┘
        ▲                               ▲
        │                               │
    US Users                        EU Users
```

### Pricing Considerations

Global Tables incur additional costs for replicated writes—each write to one region is replicated to others, consuming write capacity in each region .

---

## 12. Backup and Restore

### Backup Types

| Backup Type | Description | Retention |
|-------------|-------------|-----------|
| **On-demand backup** | Manual full backup | Indefinite |
| **Point-in-time recovery (PITR)** | Continuous backup with second-granularity | 35 days  |

### Point-in-Time Recovery

When enabled, PITR protects against accidental writes or deletes by allowing restoration to any point in time within the last 35 days, down to the second .

**Enabling PITR:**
```bash
aws dynamodb update-continuous-backups \
    --table-name Music \
    --point-in-time-recovery-specification PointInTimeRecoveryEnabled=True
```

**Restoring to a point in time:**
```bash
aws dynamodb restore-table-to-point-in-time \
    --source-table-name Music \
    --target-table-name Music-Backup \
    --restore-date-time "2024-01-15T10:00:00Z"
```

### On-Demand Backup

```bash
# Create backup
aws dynamodb create-backup \
    --table-name Music \
    --backup-name Music-Backup-20240115

# Restore from backup
aws dynamodb restore-table-from-backup \
    --target-table-name Music-Restored \
    --backup-arn arn:aws:dynamodb:us-east-1:123456789012:table/Music/backup/123456
```

---

## 13. Security and Compliance

### Encryption at Rest

DynamoDB encrypts all data at rest by default using AWS-owned keys .

| Option | Description |
|--------|-------------|
| **AWS-owned key** | Default; no additional cost |
| **AWS Managed KMS key** | `aws/dynamodb` key in your account |
| **Customer Managed KMS key** | Your own key in KMS with custom policies |

### Encryption in Transit

All DynamoDB data is encrypted in transit using TLS/SSL.

### Access Control

| Control | Description |
|---------|-------------|
| **IAM policies** | Control which users/roles can access tables and operations |
| **Resource-based policies** | Fine-grained access to specific tables |
| **Condition keys** | Restrict access based on request attributes (e.g., `dynamodb:LeadingKeys`) |
| **VPC Endpoints** | Access DynamoDB without traversing the internet |

### Compliance

DynamoDB is eligible for :
- PCI DSS
- SOC 1, 2, 3
- HIPAA (with executed BAA)
- FedRAMP
- ISO 27001, 27017, 27018

---

## 14. Pricing and Cost Optimization

### Free Tier (Always Free) 

| Resource | Free Monthly Amount |
|----------|---------------------|
| Data storage | 25 GB |
| Read Capacity Units (RCU) | 25 (provisioned mode) |
| Write Capacity Units (WCU) | 25 (provisioned mode) |
| Stream read requests | 2.5 million |
| Global Tables replicated WCU | 25 (in 2 regions) |

### On-Demand Pricing (us-east-1 example) 

| Resource | Price |
|----------|-------|
| Write request units | $1.25 per million |
| Read request units | $0.25 per million |
| Data storage | $0.25 per GB-month (25 GB free) |
| Continuous backups (PITR) | $0.20 per GB-month |
| On-demand backups | $0.10 per GB-month |

### Provisioned Capacity Pricing (us-east-1 example) 

| Resource | Price |
|----------|-------|
| Write Capacity Unit (WCU) | $0.00065 per hour |
| Read Capacity Unit (RCU) | $0.00013 per hour |

### Cost Calculation Example

**Scenario:** 10,000 users, each performing 10K reads and 5K writes per month 

| Component | Calculation | Cost |
|-----------|-------------|------|
| Reads (on-demand) | 100M × $0.25/1M | $2.50 |
| Writes (on-demand) | 50M × $1.25/1M | $6.25 |
| Storage (105 GB after free tier) | 80 GB × $0.25 | $20.00 |
| PITR backup (105 GB) | 105 GB × $0.20 | $21.00 |
| **Total (on-demand)** | | **~$50/month** |

**Provisioned mode with reserved capacity would be significantly cheaper for steady workloads.**

### Cost Optimization Strategies 

| Strategy | Savings Potential |
|----------|-------------------|
| Use provisioned capacity for predictable workloads | 50-70% vs on-demand |
| Purchase reserved capacity for 1-3 years | Additional discount |
| Use DAX for read-heavy workloads | Reduces RCU consumption |
| Right-size GSIs | Only project necessary attributes |
| Use S3 for large objects (>400 KB) | Avoids DynamoDB storage costs |
| Delete unused tables and backups | 100% of idle costs |
| Set CloudWatch alarms for throttling | Prevents excessive auto-scaling |

---

## 15. Data Modeling Best Practices

### Single-Table Design

Unlike relational databases where you normalize data across many tables, DynamoDB often uses **single-table design**—storing multiple entity types in one table .

**Example: E-commerce application**

```
PK: "USER#123"           → User record
PK: "ORDER#456"          → Order record
PK: "PRODUCT#789"        → Product record
PK: "USER#123#ORDERS"    → User's orders collection
```

**Why single-table design?**
- Reduces number of API calls (no JOINs across tables)
- Lower latency (one request instead of many)
- Simpler application logic

### Access Pattern-Driven Design

In DynamoDB, you **design your table structure based on your access patterns**, not based on data normalization .

**Process:**
1. List all application access patterns
2. Determine primary keys that satisfy each pattern
3. Add GSIs for additional access patterns
4. Denormalize data to avoid multiple round trips

### Best Practices Summary

| Practice | Description |
|----------|-------------|
| **Use meaningful partition keys** | High-cardinality attributes for even distribution |
| **Avoid hot partitions** | Don't use timestamps as partition keys |
| **Keep items under 400 KB** | Store large objects in S3, reference in DynamoDB  |
| **Use sparse indexes** | GSIs with partition keys only on items that need indexing |
| **Implement exponential backoff** | For retries when throttled |
| **Use batch operations** | `BatchGetItem` and `BatchWriteItem` for multiple items |

---

## 16. Use Cases and Real-World Examples

### Real-World Companies Using DynamoDB

| Company | Use Case | Scale |
|---------|----------|-------|
| **Duolingo** | Stores language lesson data | 31 billion items; 24,000 reads/second  |
| **Amazon retail** | Shopping cart, session management | Millions of concurrent users  |
| **Disney+** | Streaming service metadata | Global scale  |
| **Lyft, Airbnb, Capital One, Nike** | Various production workloads | Enterprise scale  |

### Common Use Cases

| Use Case | Why DynamoDB |
|----------|--------------|
| **Mobile/web backends** | Auto-scaling, low latency, serverless |
| **Gaming** | Leaderboards, player state, session data  |
| **Ad tech** | High throughput, real-time bidding |
| **IoT** | Device state, telemetry ingestion |
| **Real-time analytics** | Streams for real-time processing |
| **Shopping carts** | High write throughput, eventual consistency acceptable |

---

## 17. Limitations and When NOT to Use DynamoDB

### Key Limitations

| Limitation | Value | Impact |
|------------|-------|--------|
| Maximum item size | 400 KB  | Can't store large documents |
| Maximum GSI per table | 20 (default) | Limited query flexibility |
| Maximum LSI per table | 5 | Must be created at table creation |
| Stream retention | 24 hours | Limited replay window |
| No JOIN operations | N/A | Must denormalize or make multiple requests  |

### When NOT to Use DynamoDB 

| Scenario | Better Alternative |
|----------|-------------------|
| **Complex queries with JOINs** | Amazon RDS or Aurora |
| **Ad-hoc analytics and BI** | Redshift or Athena |
| **Large binary objects (>400 KB)** | S3 (store reference in DynamoDB) |
| **Full SQL query capabilities** | RDS/Aurora with SQL |
| **Graph data with complex relationships** | Amazon Neptune |
| **Avoiding vendor lock-in** | MongoDB Atlas or Cassandra |

---

## 18. DynamoDB Glossary

This glossary includes key terms directly related to Amazon DynamoDB.

---

### A

**ACID Transactions**
Atomic, Consistent, Isolated, Durable transactions that enable coordinated, all-or-nothing changes to multiple items across one or more tables .

**Attribute**
A fundamental data element within an item; a key-value pair. Attributes are similar to fields or columns in other database systems .

---

### B

**BatchGetItem**
Operation that retrieves up to 100 items from one or more tables in a single API call.

**BatchWriteItem**
Operation that puts or deletes up to 25 items across one or more tables in a single API call.

---

### C

**Capacity Unit**
Unit of measure for read and write throughput. Read capacity units (RCU) and write capacity units (WCU) determine the throughput you can consume .

**Composite Primary Key**
Primary key consisting of two attributes: a partition key and a sort key. Enables flexible querying with range conditions .

**Conditional Write**
Write operation that succeeds only if a specified condition evaluates to true. Used for optimistic concurrency control.

---

### D

**DAX (DynamoDB Accelerator)**
In-memory cache that delivers microsecond latency for read-heavy workloads. API-compatible with DynamoDB .

**Document Type**
Data type that supports nested attributes, including maps and lists. Enables rich, hierarchical data structures.

**DynamoDB Streams**
Time-ordered sequence of item-level modifications in a table. Stream records persist for 24 hours .

---

### E

**Eventually Consistent Read**
Read operation that may not reflect recent writes. Default consistency mode; consumes half the read capacity of strongly consistent reads .

**Expression Attribute Values**
Placeholders in DynamoDB expressions to prevent injection attacks and handle type safety.

**Expression Attribute Names**
Placeholders for attribute names that conflict with DynamoDB reserved words.

---

### G

**Global Secondary Index (GSI)**
Index with partition and sort keys that can be different from the base table. Quota of 20 per table. Allows querying on alternate attributes .

**Global Table**
Multi-region, multi-master replication feature. Provides low-latency local access for globally distributed applications .

---

### H

**Hash Attribute**
Alternative name for partition key. Derives from internal hash function that determines storage partition .

**Hot Partition**
Partition that receives a disproportionate number of requests, causing throttling. Avoid by choosing high-cardinality partition keys.

---

### I

**Item**
A group of attributes uniquely identifiable by a primary key. Items are similar to rows or records in other databases. No limit on number of items per table .

**Item Collection**
Group of items in a table that share the same partition key.

---

### K

**Kinesis Data Streams for DynamoDB**
Feature that captures item-level changes to a Kinesis data stream, enabling longer retention and advanced streaming applications .

---

### L

**Local Secondary Index (LSI)**
Index with the same partition key as the base table but a different sort key. Must be created when the table is created. Quota of 5 per table .

---

### M

**Map**
Document data type that contains nested attributes. Maps can contain other maps or lists up to 32 levels deep .

**Multi-AZ Replication**
Automatic replication of data across multiple Availability Zones within a region for high availability and durability.

---

### N

**Nested Attribute**
Attribute that contains other attributes (map) or a list of values. DynamoDB supports nesting up to 32 levels deep .

**NoSQL Workbench**
Visual tool for designing, creating, and querying DynamoDB tables. Supports data modeling and visualization .

---

### O

**On-Demand Capacity Mode**
Capacity mode where DynamoDB scales automatically based on workload. Pay per request. Best for unpredictable workloads .

---

### P

**PartiQL**
SQL-compatible query language for DynamoDB. Supports SELECT, INSERT, UPDATE, DELETE statements.

**Partition**
Physical storage unit internal to DynamoDB. Data is distributed across partitions based on partition key hash values.

**Partition Key**
Primary key composed of a single attribute. DynamoDB hashes the partition key to determine storage partition .

**Point-in-Time Recovery (PITR)**
Continuous backup feature that enables restoration to any second within the last 35 days .

**Projection**
The set of attributes copied from the base table to a secondary index. Minimizing projection reduces storage costs .

**Provisioned Capacity Mode**
Capacity mode where you specify read and write capacity units. Supports auto-scaling. Best for predictable workloads .

**Provisioned Throughput**
Maximum read and write capacity that a table or index can consume. Configured in RCU and WCU units.

---

### Q

**Query**
Operation that retrieves items using primary key values. Most efficient read operation in DynamoDB .

---

### R

**Range Attribute**
Alternative name for sort key. Derives from ability to query ranges of values .

**Read Capacity Unit (RCU)**
One strongly consistent read per second for an item up to 4 KB. One eventually consistent read consumes 0.5 RCU .

**Reserved Capacity**
Discounted capacity purchased for 1-3 year commitments. Provides significant savings over on-demand provisioned pricing .

---

### S

**Scalar Attribute**
Attribute that holds a single value. Types include string, number, binary, Boolean, and null .

**Scan**
Operation that reads every item in a table. Inefficient for large tables; prefer Query when possible .

**Schemaless**
Property of DynamoDB where items in the same table can have different attributes. No need to define schema beforehand .

**Secondary Index**
Index that allows querying using an alternate key. Supports global secondary indexes (GSIs) and local secondary indexes (LSIs) .

**Simple Primary Key**
Primary key consisting of only a partition key. No two items can share the same partition key value .

**Sort Key**
Second attribute in a composite primary key. Items with the same partition key are stored sorted by sort key .

**Sparse Index**
Index where only items with a specific attribute are indexed. Efficient for querying subsets of data.

**Strongly Consistent Read**
Read that returns the most recent write. Consumes full read capacity (1 RCU per 4 KB) .

---

### T

**Table**
Collection of data items. DynamoDB stores data in tables, similar to relational databases .

**Time to Live (TTL)**
Feature that automatically deletes items after a specified timestamp. Used for session data, temporary records.

**Transaction**
See ACID Transactions.

---

### W

**Write Capacity Unit (WCU)**
One write per second for an item up to 1 KB. Larger items consume multiple WCUs .

---

## Summary

Amazon DynamoDB is a powerful, fully managed NoSQL database designed for applications that require consistent single-digit millisecond latency at any scale. Its serverless nature, automatic scaling, and flexible data model make it an excellent choice for modern cloud-native applications.

**Key Takeaways:**

- **Core components**: Tables → Items → Attributes 
- **Primary keys**: Partition key only or partition key + sort key 
- **Capacity modes**: On-demand (pay per request) or Provisioned (pay per capacity unit) 
- **Indexes**: GSIs (different keys) and LSIs (same partition key) 
- **Advanced features**: DAX (microsecond caching), Streams (change capture), Global Tables (multi-region) 
- **Security**: Encryption at rest by default, VPC endpoints, IAM fine-grained access 
- **Limitations**: 400 KB item size, no JOINs, vendor lock-in 

**Getting Started Recommendations:**
- Start with the DynamoDB console tutorial (10 minutes, free tier eligible) 
- Use on-demand mode for development and unpredictable workloads
- Design based on access patterns, not normalization
- Enable PITR for production tables
- Use DAX for read-heavy, latency-sensitive applications
- Monitor with CloudWatch metrics (ThrottledRequests, SystemErrors)