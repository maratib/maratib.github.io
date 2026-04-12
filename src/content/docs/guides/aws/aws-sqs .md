---
title: SQS
description: SQS (Simple Queue Service)
date: 2026-04-12
---
 
 # SQS (Simple Queue Service)

Amazon **Simple Queue Service (SQS)** is a **fully managed message queuing service** that enables you to decouple and scale microservices, distributed systems, and serverless applications . 

SQS eliminates the complexity of managing message-oriented middleware, allowing software components to communicate asynchronously at any volume without losing messages .

---


## 1. What is Amazon SQS?

Amazon SQS is a fully managed message queuing service that enables you to send, store, and receive messages between software components at any volume, without losing messages or requiring other services to be available .

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Fully Managed** | No software to install, configure, or maintain—AWS handles all ongoing operations and underlying infrastructure  |
| **Elastic Scaling** | Queues automatically scale to handle any load without provisioning instructions  |
| **High Availability** | Messages are stored redundantly across multiple Availability Zones  |
| **Secure** | Server-side encryption (SSE) with AWS KMS integration for sensitive data  |
| **Cost-Effective** | Pay-as-you-go pricing with no upfront costs; free tier includes 1 million requests monthly  |

### Free Tier

AWS Free Tier includes **1 million Amazon SQS requests** per month .

---

## 2. Why Use Message Queues?

Message queues enable you to build applications as independent components that communicate asynchronously . This decoupling provides several advantages:

| Advantage | Description |
|-----------|-------------|
| **Fault Tolerance** | If a component fails, messages remain in the queue for later processing |
| **Scalability** | Each component can scale independently based on demand  |
| **Load Leveling** | Queues buffer requests, smoothing out traffic spikes |
| **Decoupling** | Producers and consumers don't need to be available simultaneously  |

### Example Scenario

In an e-commerce application, when a customer places an order:
1. The order service sends a message to an SQS queue
2. The payment service, inventory service, and fulfillment service each process messages independently 
3. If the fulfillment service is temporarily unavailable, messages remain in the queue until it recovers

---

## 3. Queue Types: Standard vs. FIFO

Amazon SQS offers two queue types, each designed for different messaging requirements .

### Comparison Table

| Feature | Standard Queue | FIFO Queue |
|---------|---------------|------------|
| **Throughput** | Nearly unlimited TPS per API action  | Up to 3,000 TPS (batch) or 300 TPS (non-batch) |
| **Message Ordering** | Best-effort ordering  | Strict First-In-First-Out  |
| **Delivery Guarantee** | At-Least-Once Delivery  | Exactly-Once Processing  |
| **Deduplication** | Not supported | Automatic or manual deduplication |
| **Use Cases** | High-throughput, order-tolerant workloads | Order-critical, duplicate-sensitive workloads |
| **Cost** | Lower per request | Higher per request |

### Standard Queues

Standard queues are designed to support a nearly unlimited number of transactions per second (TPS) per API action . They offer:
- **At-Least-Once Delivery**: Messages are delivered at least once, but occasionally more than one copy may be delivered 
- **Best-Effort Ordering**: Messages might occasionally be delivered in a different order than they were sent 

**Best for:** High-throughput applications where occasional duplicates or out-of-order messages are acceptable .

### FIFO Queues

FIFO (First-In-First-Out) queues are designed to enhance messaging when the order of operations is critical or duplicates cannot be tolerated .

**Key guarantees:**
- **Exactly-Once Processing**: Each message is delivered once and remains available until a consumer processes and deletes it 
- **First-In-First-Out Delivery**: The order in which messages are sent and received is strictly preserved 

**Best for:** Financial transactions, price updates, sequential command processing .

---

## 4. Core Concepts and Architecture

### Basic Architecture

A distributed messaging system with Amazon SQS consists of three main parts :

| Component | Description |
|-----------|-------------|
| **Producer** | Components that send messages to the queue |
| **Queue** | Distributed storage for messages across SQS servers |
| **Consumer** | Components that receive and process messages from the queue |

### Message Lifecycle

The lifecycle of an Amazon SQS message follows these steps :

```
1. Producer sends message → Queue stores message redundantly
                    ↓
2. Consumer polls queue → Message is returned (locked)
                    ↓
3. Consumer processes message during visibility timeout
                    ↓
4. Consumer deletes message → Message removed from queue
```

**Detailed Steps:**

| Step | Description |
|------|-------------|
| **1. Send** | A producer sends message to the queue; it's distributed across Amazon SQS servers redundantly  |
| **2. Receive** | A consumer polls the queue and receives the message  |
| **3. Lock** | The message is locked (visibility timeout) preventing other consumers from processing it simultaneously  |
| **4. Process** | The consumer processes the message according to application logic |
| **5. Delete** | The consumer deletes the message to prevent it from being received again  |

### Visibility Timeout

When a message is received, it becomes "locked" while being processed. This prevents other computers from processing the same message simultaneously. If message processing fails, the lock expires and the message becomes available again .

**Default visibility timeout:** 30 seconds (configurable up to 12 hours).

### Message Retention

Amazon SQS automatically deletes messages that have been in a queue longer than the maximum message retention period .

| Parameter | Value |
|-----------|-------|
| **Default retention** | 4 days  |
| **Configurable range** | 60 seconds to 1,209,600 seconds (14 days)  |

---

## 5. Step-by-Step: Creating Your First SQS Queue

### Prerequisites
- AWS account
- AWS Management Console access

### Step 1: Access SQS Console

1. Sign in to AWS Management Console
2. Navigate to **SQS** (search in services bar)

### Step 2: Create a Queue

1. Click **Create queue**
2. Select queue type:
   - **Standard** (default, higher throughput)
   - **FIFO** (message ordering, exactly-once processing)

### Step 3: Configure Queue Settings

| Setting | Description | Typical Value |
|---------|-------------|---------------|
| **Queue name** | Unique identifier | `my-queue` (FIFO: `.fifo` suffix) |
| **Visibility timeout** | Time to process messages | 30 seconds (adjust based on processing time) |
| **Message retention period** | How long messages persist | 4 days (60s - 14 days)  |
| **Delivery delay** | Delay before message becomes visible | 0 seconds (0-15 minutes) |
| **Maximum message size** | Per-message size limit | 256 KB (1 KB - 256 KB) |
| **Receive message wait time** | Long polling duration | 0-20 seconds |

### Step 4: Configure Dead-Letter Queue (Optional)

1. Toggle **Dead-letter queue** to enable
2. Select target queue (must be same type: Standard or FIFO)
3. Set **Maximum receives** (e.g., 3 = move after 3 failed processing attempts)

### Step 5: Configure Encryption (Optional)

1. Toggle **Encryption** to enable
2. Choose encryption key type:
   - **AWS owned key** (default, no cost)
   - **AWS managed key** (aws/sqs)
   - **Customer managed key** (your KMS key)

### Step 6: Create Queue

Click **Create queue**

### Quick Setup with AWS CLI

```bash
# Create a standard queue
aws sqs create-queue --queue-name MyStandardQueue

# Create a FIFO queue
aws sqs create-queue --queue-name MyFifoQueue.fifo --attributes FifoQueue=true
```

---

## 6. Sending and Receiving Messages

### Using AWS Console

**Send a message:**
1. Select your queue
2. Click **Send and receive messages**
3. Click **Send message**
4. Enter message body
5. (FIFO) Enter Message Group ID and (optional) Message Deduplication ID

**Receive messages:**
1. Click **Poll for messages**
2. Messages appear in "Messages available" section
3. Click **Receive** next to a message
4. After processing, click **Delete**

### Using AWS CLI

```bash
# Send a message
aws sqs send-message \
    --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue \
    --message-body "Hello from CLI"

# Send with delay (FIFO example)
aws sqs send-message \
    --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue.fifo \
    --message-body "Order #12345" \
    --message-group-id "Orders" \
    --message-deduplication-id "order-12345"

# Receive messages
aws sqs receive-message \
    --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue \
    --max-number-of-messages 10 \
    --wait-time-seconds 20

# Delete a message (using receipt handle)
aws sqs delete-message \
    --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue \
    --receipt-handle "ABC123..."
```

### Using AWS SDK (Python/Boto3)

```python
import boto3

sqs = boto3.client('sqs', region_name='us-east-1')

# Send a message
response = sqs.send_message(
    QueueUrl='https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue',
    MessageBody='Hello from Python!',
    DelaySeconds=10
)
print(f"Message ID: {response['MessageId']}")

# Receive messages
response = sqs.receive_message(
    QueueUrl='https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue',
    MaxNumberOfMessages=5,
    WaitTimeSeconds=10
)

for message in response.get('Messages', []):
    print(f"Processing: {message['Body']}")
    
    # Process the message...
    
    # Delete after successful processing
    sqs.delete_message(
        QueueUrl='https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue',
        ReceiptHandle=message['ReceiptHandle']
    )
```

---

## 7. Key Features and Functionality

### Long Polling

Long polling reduces extraneous polling to minimize cost while receiving new messages as quickly as possible . When your queue is empty, long-poll requests wait for a specified amount of time for the next message to arrive .

| Benefit | Description |
|---------|-------------|
| **Cost reduction** | Fewer empty receive requests |
| **Lower latency** | Messages delivered immediately upon arrival |
| **Configuration** | 1-20 seconds (default: 0) |

### Batch Operations

You can send, receive, or delete messages in batches. Batches cost the same amount as single messages, making SQS even more cost-effective for customers that use batching .

| Batch API | Maximum Messages |
|-----------|------------------|
| `SendMessageBatch` | 10 messages per request |
| `ReceiveMessage` | 10 messages per request (max) |
| `DeleteMessageBatch` | 10 messages per request |

### Large Messages

Message payloads up to **256 KB** are supported . For larger messages:
- Use the **Amazon SQS Extended Client Library for Java**, which uses S3 to store the message payload 
- A reference to the payload is sent using SQS

### Delay Queues and Scheduled Delivery

SQS supports setting a specific delivery time for messages :
- **Per-message delay**: Set when sending individual messages
- **Queue-level delay**: Default delay applied to all messages in the queue (0-15 minutes)

### Message Locking

When a message is received, it becomes "locked" while being processed. This is designed to keep other computers from processing the message simultaneously. If the message processing fails, the lock will expire and the message will be available again .

### Queue Sharing

Amazon SQS queues can be shared:
- Anonymously or with specific AWS accounts 
- Restricted by IP address and time-of-day 
- Via queue policies (similar to S3 bucket policies)

---

## 8. Dead-Letter Queues (DLQs)

### What is a Dead-Letter Queue?

A dead-letter queue is a queue that other (source) queues can target for messages that can't be processed successfully . When a message's maximum receive count is exceeded, Amazon SQS moves the message to the DLQ associated with the original queue .

### How DLQs Work

```
Source Queue → Message fails processing (max receives exceeded) → DLQ
```

| Step | Description |
|------|-------------|
| **1** | Consumer receives message from source queue |
| **2** | Consumer fails to process and does NOT delete message |
| **3** | Visibility timeout expires, message returns to queue |
| **4** | Counter increments for each receive attempt |
| **5** | After "max receives" threshold, message moves to DLQ  |

### DLQ Requirements

| Requirement | Description |
|-------------|-------------|
| **Type matching** | DLQ must be same type as source queue (Standard or FIFO)  |
| **Configuration** | Set `RedrivePolicy` attribute on source queue |
| **Max receives** | Number of times a message can be received before moving to DLQ |

### Using DLQs

Once you've remediated the issues, you can move the messages from the DLQ to their respective source queues .

**Use DLQs to:**
- Debug problematic messages without blocking queue processing 
- Identify and fix consumer issues
- Prevent infinite retry loops

---

## 9. Security and Encryption

### Server-Side Encryption (SSE)

Amazon SQS offers server-side encryption (SSE) to protect the contents of messages .

| Feature | Description |
|---------|-------------|
| **Encryption at rest** | Messages are encrypted as soon as SQS receives them  |
| **Decryption** | SQS decrypts messages only when sent to an authorized consumer  |
| **Key management** | Uses keys managed in AWS Key Management Service (AWS KMS)  |
| **Integration** | Amazon KMS logs encryption key usage to CloudTrail  |

### Encryption Options

| Option | Description |
|--------|-------------|
| **AWS owned key** | Default, no additional cost |
| **AWS managed key** | `aws/sqs` key in your account |
| **Customer managed key** | Your own KMS key with custom policies |

### Access Control

SQS provides multiple access control mechanisms :

| Method | Description |
|--------|-------------|
| **IAM policies** | Control which users/roles can perform SQS actions |
| **Queue policies** | Resource-based policies for cross-account access |
| **VPC endpoints** | Access SQS without traversing the public internet |

---

## 10. Monitoring and Observability

### CloudWatch Metrics

Amazon SQS integrates with CloudWatch to provide queue-level metrics .

| Metric | Description |
|--------|-------------|
| `ApproximateNumberOfMessagesVisible` | Messages available for retrieval |
| `ApproximateNumberOfMessagesNotVisible` | Messages in flight (locked) |
| `ApproximateNumberOfMessagesDelayed` | Messages delayed and not yet available |
| `NumberOfMessagesReceived` | Messages received by consumers |
| `NumberOfMessagesSent` | Messages sent by producers |
| `NumberOfMessagesDeleted` | Messages successfully deleted |
| `SendMessageLatency` | Time to send a message |
| `ApproximateAgeOfOldestMessage` | Age of the oldest message in queue |

### CloudTrail Integration

SQS logs API calls to CloudTrail for auditing purposes, including:
- Queue creation, deletion, and modification
- Policy changes
- Encryption key usage

---

## 11. SQS vs. SNS: Choosing the Right Service

Amazon SQS and SNS are both messaging services but serve different purposes .

### High-Level Comparison

| Aspect | Amazon SQS | Amazon SNS |
|--------|-----------|------------|
| **Pattern** | Point-to-point (queue)  | Publish-subscribe (topic)  |
| **Message Delivery** | Pull-based (consumers poll)  | Push-based (subscribers receive immediately)  |
| **Message Retention** | Up to 14 days  | No retention (real-time delivery) |
| **Fan-out** | Single consumer per message | Multiple subscribers per message  |
| **When to Use** | Task distribution, decoupling | Broadcast notifications, alerts |

### Detailed Comparison

| Feature | SQS | SNS |
|---------|-----|-----|
| **Messaging Pattern** | Queue (point-to-point) | Topic (publish-subscribe)  |
| **Subscribers** | Single consumer per message | Multiple subscribers per message  |
| **Message Persistence** | Messages stored until deleted | No persistence—real-time delivery only |
| **Retry Logic** | Visibility timeout + DLQ | Configurable retry policies |
| **Protocols** | SDK, CLI, API | Email, SMS, HTTP/HTTPS, Lambda, SQS, mobile push  |

### When to Use Each

| Scenario | Recommended Service |
|----------|-------------------|
| One service needs to process a task | SQS |
| Many services need to receive the same notification | SNS |
| Need message durability and retry | SQS |
| Need to broadcast real-time alerts | SNS |

### Using SQS and SNS Together

You can combine both services for robust event-driven architectures :

```
Event → SNS Topic → Multiple SQS Queues → Multiple Consumer Services
```

**Benefits of combining:**
- SNS handles fan-out to multiple subscribers
- Each SQS queue provides durable storage and retry logic
- Each consumer processes independently 

---

## 12. Common Use Cases

### 1. Decouple Microservices

Separate frontend and backend systems so they can scale independently .

**Example:** Banking application where customers receive immediate response while bill payments are processed asynchronously in the background .

### 2. Task Distribution

Place work in a single queue where multiple workers in an Auto Scaling group scale up or down based on workload and latency requirements .

**Example:** Processing high numbers of credit card validation requests across multiple worker nodes .

### 3. Batch Processing

Batch messages for future processing .

**Example:** Schedule multiple entries to be added to a database or process uploaded media (images, videos) while resizing or encoding .

### 4. Load Leveling

Buffer requests during traffic spikes to prevent backend overload.

**Example:** E-commerce checkout system during holiday sales.

### 5. Asynchronous Communication

Enable components to communicate without needing to be available simultaneously.

**Example:** User uploads media file; downstream services process it independently when resources are available.

---

## 13. Pricing and Cost Optimization

### Pricing Model

SQS pricing is based on requests and data transfer .

| Component | Standard Queue | FIFO Queue |
|-----------|---------------|------------|
| **Requests** | $0.40 per 1 million | $0.50 per 1 million |
| **Data transfer** | Standard AWS rates | Standard AWS rates |

### What Counts as a Request?

Each of the following API actions counts as one request :
- `SendMessage`
- `ReceiveMessage`
- `DeleteMessage`
- `ChangeMessageVisibility`
- Batch variants (each message in batch counts separately)

**Note:** Batching messages costs the same as sending single messages, making it more cost-effective .

### Free Tier

The AWS Free Tier includes **1 million requests** per month .

### Cost Optimization Strategies

| Strategy | Description |
|----------|-------------|
| **Use batching** | Send, receive, or delete up to 10 messages per API call  |
| **Enable long polling** | Reduce empty receive requests  |
| **Right-size retention period** | Shorter retention reduces storage costs |
| **Delete unused queues** | No cost for queue metadata, but unused queues can be cleaned up |

---

## 14. Limitations and Best Practices

### Key Limitations

| Limitation | Value |
|------------|-------|
| **Maximum message size** | 256 KB  |
| **Message retention** | 14 days maximum  |
| **Visibility timeout** | 12 hours maximum |
| **Delivery delay** | 15 minutes maximum |
| **Batch size** | 10 messages per batch API call |

### Best Practices

| Category | Practice |
|----------|----------|
| **Design** | Make message processing idempotent to handle potential duplicates  |
| **Configuration** | Set appropriate visibility timeout based on processing time |
| **Error handling** | Configure dead-letter queues for unprocessable messages  |
| **Scaling** | Use multiple consumers for increased throughput |
| **Security** | Enable encryption for sensitive data |
| **Monitoring** | Set CloudWatch alarms for queue depth and message age |
| **Cost** | Use long polling and batching to reduce API calls  |

---

## 15. SQS Glossary

This glossary includes key terms directly related to Amazon SQS.

---

### A

**At-Least-Once Delivery**
Delivery guarantee for standard queues where a message is delivered at least once, but occasionally more than one copy may be delivered . Consumers should be idempotent to handle duplicates.

---

### B

**Batch Operations**
API actions that send, receive, or delete up to 10 messages in a single request. Batching reduces costs as each message in a batch counts as one request .

**Best-Effort Ordering**
Ordering guarantee for standard queues where messages might occasionally be delivered in a different order than they were sent .

---

### D

**Dead-Letter Queue (DLQ)**
A queue that receives messages from another queue when the source queue's consumer fails to process them successfully after a specified number of receive attempts . DLQs help with debugging and prevent infinite retry loops.

**Delivery Delay**
A configurable period (0 seconds to 15 minutes) that delays message delivery after being sent to the queue .

---

### E

**Exactly-Once Processing**
Delivery guarantee for FIFO queues where each message is delivered once and remains available until a consumer processes and deletes it, preventing duplicates .

---

### F

**FIFO Queue (First-In-First-Out)**
Queue type that guarantees strict message ordering and exactly-once processing. Messages are sent and received in the same order . Queue names must end with `.fifo`.

**Fan-Out**
Messaging pattern where one message is delivered to multiple subscribers. SNS provides native fan-out; SQS with SNS enables fan-out with durable queues .

---

### L

**Long Polling**
A receive message request that waits up to 20 seconds for a message to arrive in the queue, reducing empty responses and lowering costs .

---

### M

**Message Group ID (FIFO)**
A FIFO queue attribute that groups messages within the same queue. Messages with the same group ID are processed in order; different groups can be processed in parallel.

**Message Retention Period**
The duration (60 seconds to 14 days) that SQS stores messages before automatic deletion. Default is 4 days .

**Message Visibility Timeout**
The period during which a received message is locked and invisible to other consumers. If not deleted within this period, the message becomes available again .

---

### P

**Producer**
A component that sends messages to an SQS queue .

**Publish-Subscribe (Pub/Sub)**
Messaging pattern where publishers send messages to topics and subscribers receive them. SNS implements this pattern; SQS uses point-to-point .

**Pull-Based Delivery**
A delivery model where consumers actively request messages from the queue. SQS uses pull-based delivery .

---

### Q

**Queue**
A distributed storage system for messages, redundantly stored across multiple Availability Zones .

**Queue Policy**
A resource-based IAM policy attached to an SQS queue that controls access, including cross-account permissions and IP-based restrictions .

---

### S

**Standard Queue**
Queue type supporting high throughput (nearly unlimited TPS) with at-least-once delivery and best-effort ordering .

---

### V

**Visibility Timeout**
See **Message Visibility Timeout**.

---

## Summary

Amazon SQS is a foundational service for building decoupled, scalable, and fault-tolerant applications on AWS. By providing reliable message queuing without infrastructure management, SQS enables you to focus on application logic rather than message delivery concerns.

**Key Takeaways:**

- **Two queue types**: Standard (high throughput) and FIFO (ordered, exactly-once) 
- **Fully managed**: No servers to provision, patch, or scale 
- **Decoupled architecture**: Components communicate asynchronously for better fault tolerance 
- **Reliable delivery**: At-least-once for Standard, exactly-once for FIFO 
- **Dead-letter queues**: Handle failed messages without blocking processing 
- **Secure by design**: Encryption at rest with KMS integration 

**Getting Started Recommendations:**
- Start with Standard queues for most use cases
- Use FIFO queues when message order or deduplication is critical 
- Enable dead-letter queues for production workloads
- Configure long polling to reduce costs 
- Set appropriate visibility timeouts based on processing time
- Monitor queue metrics with CloudWatch alarms