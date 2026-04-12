---
title: SNS
description: SNS (Simple Notification Service)
date: 2026-04-12
---
 
 # SNS (Simple Notification Service)

**Simple Notification Service (Amazon SNS)** is a fully managed **publish/subscribe (pub/sub) messaging service** that enables you to decouple and scale microservices, distributed systems, and serverless applications . 

It provides a highly scalable, flexible, and cost-effective way to publish messages from an application and immediately deliver them to subscribers or other applications using a "push" mechanism that eliminates the need to periodically check or "poll" for new information .

---


## 1. What is Amazon SNS?

Amazon SNS is a web service that makes it easy to set up, operate, and send notifications from the cloud . It follows the **publish-subscribe (pub-sub) messaging paradigm**, with notifications being delivered to clients using a **push mechanism** that eliminates the need to periodically check or "poll" for new information and updates .

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Fully Managed** | No servers to provision, patch, or manage—AWS handles all ongoing operations and underlying infrastructure  |
| **Instantaneous Push Delivery** | Messages are pushed immediately to subscribers—no polling required  |
| **Elastic Scaling** | Topics automatically scale to handle any number of publishers, subscribers, and messages without provisioning instructions  |
| **Multi-Protocol Support** | Deliver messages to Lambda, SQS, HTTP/HTTPS, email, SMS, and mobile push  |
| **Cost-Effective** | Pay-as-you-go pricing with no upfront costs; free tier includes 1 million requests monthly  |
| **High Availability** | Messages are stored redundantly across multiple Availability Zones  |

### Free Tier (Permanent)

| Resource | Free Monthly Amount |
|----------|---------------------|
| **Publish requests** | 1 million requests  |
| **HTTP/S deliveries** | 100,000 deliveries  |
| **Email deliveries** | 1,000 deliveries  |
| **SMS messages** | 100 messages (to US numbers)  |

---

## 2. Why Use SNS? Core Value Proposition

Amazon SNS is a versatile service that supports both **application-to-application (A2A)** and **application-to-person (A2P)** messaging patterns .

### Application-to-Application (A2A) Use Cases

| Pattern | Description | Example |
|---------|-------------|---------|
| **Event Fan-Out** | One event triggers multiple independent services | New user registration triggers welcome email, CRM update, and analytics  |
| **Decoupled Microservices** | Services communicate without direct dependencies | Order service publishes to topic; inventory, billing, shipping subscribe independently  |
| **Event-Driven Architecture** | Build responsive, scalable systems | S3 events trigger processing pipelines via SNS  |

### Application-to-Person (A2P) Use Cases

| Pattern | Description | Example |
|---------|-------------|---------|
| **Mobile Push Notifications** | Send notifications to iOS, Android, and other devices | Breaking news alerts, chat messages, promotional offers  |
| **SMS Text Messages** | Send transactional text messages globally | OTP codes, delivery updates, appointment reminders  |
| **Email Notifications** | Send operational alerts via email | CloudWatch alarm notifications, system alerts  |

---

## 3. Core Concepts and Architecture

Understanding these fundamental concepts is essential for working with Amazon SNS.

### Core Components

| Component | Description |
|-----------|-------------|
| **Topic** | An access point that identifies a specific subject or event type for publishing messages  |
| **Publisher** | A component that sends messages to a topic |
| **Subscriber** | A client interested in receiving notifications from topics of interest  |
| **Subscription** | A registration that associates a subscriber endpoint with a topic |
| **Message** | The data sent from a publisher to subscribers (max 256 KB) |

### How SNS Works

```
Publisher → SNS Topic → Subscriber A (Lambda)
                     → Subscriber B (SQS)
                     → Subscriber C (Email)
                     → Subscriber D (SMS)
                     → Subscriber E (HTTP)
```

### Message Lifecycle

| Step | Description |
|------|-------------|
| **1. Create Topic** | Developer creates a topic as an access point for a specific event type  |
| **2. Add Subscribers** | Clients subscribe to the topic with endpoint protocols (SQS, Lambda, email, SMS, HTTP)  |
| **3. Set Policies** | Topic owner configures who can publish and subscribe, and which protocols are supported  |
| **4. Publish** | Publisher sends a message to the topic |
| **5. Fan Out** | SNS replicates and pushes the message to all subscribers  |
| **6. Deliver** | Each subscriber receives the message over its configured channel  |

---

## 4. Topic Types: Standard vs. FIFO

Amazon SNS offers two topic types, each designed for different messaging requirements .

### Comparison Table

| Feature | Standard Topic | FIFO Topic |
|---------|---------------|------------|
| **Message Ordering** | Best-effort ordering (messages may arrive out of order)  | Strict first-in-first-out ordering  |
| **Message Delivery** | At-least-once delivery  | Exactly-once processing  |
| **Deduplication** | Not supported | Duplicate messages aren't delivered  |
| **Throughput** | Nearly unlimited TPS | Up to 300 TPS (non-batch) or 3,000 TPS (batch) |
| **Subscriber Types** | All types (Lambda, SQS, HTTP, email, SMS, mobile)  | Limited to SQS FIFO, Lambda, and HTTP/HTTPS |
| **Use Cases** | High-throughput, order-tolerant workloads | Order-critical, duplicate-sensitive workloads |

### When to Use Each

| Scenario | Recommended Topic Type |
|----------|----------------------|
| Media encoding, fraud detection, tax calculation, search indexing  | Standard |
| Critical alerting systems, logging  | Standard |
| Bank transaction logging, stock monitoring  | FIFO |
| Flight tracking, inventory management, price updates  | FIFO |

**FIFO Topic Requirements:**
- Topic name must end with `.fifo`
- Subscribers must be FIFO-compatible (SQS FIFO queues, Lambda, HTTP/HTTPS)
- Message deduplication IDs required or auto-generated

---

## 5. Step-by-Step: Creating Your First SNS Topic

### Prerequisites
- AWS account
- AWS Management Console access

### Step 1: Access SNS Console

1. Sign in to **AWS Management Console**
2. Navigate to **SNS** (search in services bar)

### Step 2: Create a Topic

1. Click **Create topic**
2. Select topic type:
   - **Standard** (default, higher throughput)
   - **FIFO** (strict ordering, exactly-once)

### Step 3: Configure Topic Settings

| Setting | Description | Standard | FIFO |
|---------|-------------|----------|------|
| **Name** | Unique identifier | `my-topic` | `my-topic.fifo` |
| **Display name** | Optional friendly name | Optional | Optional |
| **Access policy** | Who can publish/subscribe | Optional | Optional |
| **Encryption** | Enable server-side encryption | Optional | Optional |
| **Delivery retry policy** | Configure retry behavior | Optional | Optional |

### Step 4: Create Topic

Click **Create topic**

### Quick Setup with AWS CLI

```bash
# Create a standard topic
aws sns create-topic --name MyStandardTopic

# Create a FIFO topic
aws sns create-topic --name MyFifoTopic.fifo --attributes FifoTopic=true

# Subscribe an email endpoint
aws sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:123456789012:MyStandardTopic \
    --protocol email \
    --notification-endpoint user@example.com
```

---

## 6. Publishing Messages to Topics

### Message Structure

An SNS message consists of:

| Component | Description | Limit |
|-----------|-------------|-------|
| **Message body** | The actual content (string or JSON) | 256 KB |
| **Subject** | Optional subject line | 100 characters |
| **Message attributes** | Metadata for filtering | 10 attributes |
| **Message ID** | Unique identifier (auto-generated) | - |

### Publishing via AWS CLI

```bash
# Publish a simple message
aws sns publish \
    --topic-arn arn:aws:sns:us-east-1:123456789012:MyStandardTopic \
    --message "Hello from AWS CLI!"

# Publish with subject
aws sns publish \
    --topic-arn arn:aws:sns:us-east-1:123456789012:MyStandardTopic \
    --message "Order #12345 has shipped" \
    --subject "Order Update"

# Publish JSON message with attributes
aws sns publish \
    --topic-arn arn:aws:sns:us-east-1:123456789012:MyStandardTopic \
    --message '{"orderId": "12345", "status": "shipped"}' \
    --message-attributes '{"eventType": {"DataType": "String", "StringValue": "OrderShipped"}}'
```

### Publishing via AWS SDK (Python/Boto3)

```python
import boto3
import json

sns = boto3.client('sns', region_name='us-east-1')

# Simple message
response = sns.publish(
    TopicArn='arn:aws:sns:us-east-1:123456789012:MyStandardTopic',
    Message='Hello from Python!'
)
print(f"Message ID: {response['MessageId']}")

# Message with attributes (for filtering)
response = sns.publish(
    TopicArn='arn:aws:sns:us-east-1:123456789012:MyStandardTopic',
    Message=json.dumps({'orderId': '12345', 'status': 'shipped'}),
    Subject='Order Update',
    MessageAttributes={
        'eventType': {
            'DataType': 'String',
            'StringValue': 'OrderShipped'
        },
        'priority': {
            'DataType': 'Number',
            'StringValue': '1'
        }
    }
)
```

### Message Batching

You can publish from 1 to 10 messages per API request . Batching reduces costs because each message in a batch counts as a separate request, but you pay for only one API call.

```python
# Batch publish
entries = [
    {
        'Id': '1',
        'Message': 'Message 1'
    },
    {
        'Id': '2',
        'Message': 'Message 2'
    }
]

response = sns.publish_batch(
    TopicArn='arn:aws:sns:us-east-1:123456789012:MyStandardTopic',
    PublishBatchRequestEntries=entries
)
```

---

## 7. Subscriber Endpoint Types

SNS supports multiple subscriber endpoint types, enabling you to reach both applications and people .

### Application-to-Application Endpoints

| Protocol | Description | Use Case |
|----------|-------------|----------|
| **Lambda** | Invokes a Lambda function with the message  | Serverless event processing |
| **SQS** | Enqueues message to a Standard or FIFO queue  | Durable, decoupled processing with retries |
| **HTTP/HTTPS** | POSTs message to a web endpoint  | Integrate with external systems, webhooks |
| **Kinesis Data Firehose** | Delivers to Firehose streams for S3, Redshift, etc.  | Message archiving and analytics |

### Application-to-Person Endpoints

| Protocol | Description | Use Case |
|----------|-------------|----------|
| **Email / Email-JSON** | Sends email to registered addresses  | Alerts, notifications, reports |
| **SMS** | Sends text messages to mobile phones  | OTP codes, delivery updates |
| **Mobile Push** | Push to iOS (APNs), Android (FCM), Amazon (ADM), Windows (WNS/MPNS)  | App notifications, alerts |

### Adding Subscribers via AWS CLI

```bash
# Subscribe an SQS queue
aws sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:123456789012:MyTopic \
    --protocol sqs \
    --notification-endpoint arn:aws:sqs:us-east-1:123456789012:MyQueue

# Subscribe a Lambda function
aws sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:123456789012:MyTopic \
    --protocol lambda \
    --notification-endpoint arn:aws:lambda:us-east-1:123456789012:function:MyFunction

# Subscribe an HTTP endpoint
aws sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:123456789012:MyTopic \
    --protocol https \
    --notification-endpoint https://my-api.example.com/webhook
```

### Subscription Confirmation

For some protocols (email, HTTP/HTTPS), subscribers must confirm their subscription before receiving messages . SNS sends a confirmation message with a link to confirm.

---

## 8. Message Filtering

Message filtering empowers subscribers to create a filter policy, so they only receive the notifications they are interested in, as opposed to receiving every single message posted to the topic .

### How Filtering Works

```
SNS Topic → Filter Policy Evaluation → Subscriber receives only matching messages
```

### Filter Policy Example

```json
{
  "eventType": ["OrderShipped", "OrderDelivered"],
  "priority": [{"numeric": [">=", 2]}],
  "region": ["US", "EU"]
}
```

### Message Attributes for Filtering

When publishing, include message attributes that subscribers can filter on :

```python
response = sns.publish(
    TopicArn=topic_arn,
    Message=json.dumps({'orderId': '12345'}),
    MessageAttributes={
        'eventType': {
            'DataType': 'String',
            'StringValue': 'OrderShipped'  # Used for filtering
        },
        'priority': {
            'DataType': 'Number',
            'StringValue': '2'  # Used for filtering
        }
    }
)
```

### Filter Policy Operators

| Operator | Description | Example |
|----------|-------------|---------|
| **Exact matching** | String or numeric exact match | `"eventType": ["OrderShipped"]` |
| **Anything-but** | Matches anything except specified values | `"eventType": [{"anything-but": "Test"}]` |
| **Prefix matching** | Matches strings starting with prefix | `"eventType": [{"prefix": "Order"}]` |
| **Numeric comparison** | >, >=, <, <=, =, = | `"priority": [{"numeric": [">=", 2]}]` |
| **Exists** | Checks if attribute exists | `"eventType": [{"exists": true}]` |

### Benefits of Filtering

| Benefit | Description |
|---------|-------------|
| **Reduce Lambda invocations** | Only trigger functions for relevant messages  |
| **Lower costs** | Fewer unnecessary message deliveries |
| **Simplify subscriber logic** | Subscribers don't need to filter messages themselves |
| **Improve efficiency** | Each subscriber processes only what they need |

---

## 9. Message Fan-Out Pattern

Message fan-out occurs when a message is sent to a topic and then replicated and pushed to multiple endpoints . Fan-out provides asynchronous event notifications, which in turn allow for parallel processing .

### Architecture Diagram

```
                    ┌─────────────────┐
                    │   SNS Topic     │
                    │  (Event Hub)    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Subscriber A │    │  Subscriber B │    │  Subscriber C │
│  (Lambda)     │    │  (SQS Queue)  │    │  (HTTP)       │
└───────────────┘    └───────────────┘    └───────────────┘
   Process in            Buffer for          External
   real-time             async workers        API call
```

### Real-World Example: E-Commerce Order Processing

When a customer places an order, a single "OrderPlaced" event can fan out to:

| Subscriber | Action |
|------------|--------|
| **Inventory Service (SQS)** | Deduct stock levels |
| **Billing Service (SQS)** | Process payment |
| **Notification Service (Lambda)** | Send confirmation email |
| **Analytics Service (Lambda)** | Track order metrics |
| **Shipping Service (HTTP)** | Notify external fulfillment partner |

### Benefits of Fan-Out

| Benefit | Description |
|---------|-------------|
| **Parallel processing** | Multiple services react simultaneously  |
| **Loose coupling** | Publisher doesn't need to know about subscribers  |
| **Independent scaling** | Each subscriber scales based on its own load |
| **Fault isolation** | One subscriber's failure doesn't affect others |

---

## 10. SNS with AWS Lambda

SNS and Lambda integration is one of the most popular serverless event-processing patterns .

### How It Works

1. A Lambda function subscribes to an SNS topic
2. When a message is published to the topic, SNS invokes the Lambda function
3. Lambda receives the message payload and processes it
4. No polling required—SNS pushes the message 

### Lambda Subscription via AWS CLI

```bash
aws sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:123456789012:MyTopic \
    --protocol lambda \
    --notification-endpoint arn:aws:lambda:us-east-1:123456789012:function:MyFunction
```

### Lambda Event Handler (Python)

```python
import json

def lambda_handler(event, context):
    """
    Handles SNS messages.
    SNS sends messages in a Records array.
    """
    for record in event['Records']:
        sns_message = record['Sns']
        
        message_id = sns_message['MessageId']
        subject = sns_message.get('Subject', 'No Subject')
        message = json.loads(sns_message['Message'])  # Parse JSON body
        
        print(f"Processing message {message_id}")
        print(f"Subject: {subject}")
        print(f"Message data: {message}")
        
        # Process the message (e.g., update database, send email)
        
    return {'statusCode': 200, 'body': 'OK'}
```

### SNS Message Structure in Lambda

```json
{
  "Records": [
    {
      "EventSource": "aws:sns",
      "EventVersion": "1.0",
      "EventSubscriptionArn": "arn:aws:sns:...",
      "Sns": {
        "Type": "Notification",
        "MessageId": "12345678-1234-1234-1234-123456789012",
        "TopicArn": "arn:aws:sns:us-east-1:123456789012:MyTopic",
        "Subject": "Order Update",
        "Message": "{\"orderId\": \"12345\", \"status\": \"shipped\"}",
        "Timestamp": "2024-01-15T12:00:00.000Z",
        "SignatureVersion": "1",
        "Signature": "abcdef123456...",
        "SigningCertUrl": "https://sns.us-east-1.amazonaws.com/...",
        "UnsubscribeUrl": "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe...",
        "MessageAttributes": {
          "eventType": {
            "Type": "String",
            "Value": "OrderShipped"
          }
        }
      }
    }
  ]
}
```

---

## 11. SNS with Amazon SQS: The Fan-Out Pattern

A common pattern is to use SNS to publish messages to Amazon SQS queues to reliably send messages to one or many system components asynchronously .

### Why Combine SNS and SQS?

| Challenge | Solution with SNS + SQS |
|-----------|------------------------|
| One message needs to trigger multiple services | SNS fans out to multiple SQS queues  |
| Subscriber might be temporarily unavailable | SQS provides durable message storage  |
| Each service needs independent retry logic | Each SQS queue has its own visibility timeout and DLQ |
| Services process at different speeds | Each queue allows independent scaling |

### Architecture

```
                    ┌─────────────────┐
                    │   SNS Topic     │
                    │  (Order Events) │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   SQS Queue   │    │   SQS Queue   │    │   SQS Queue   │
│   (Inventory) │    │   (Billing)   │    │  (Shipping)   │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Consumer    │    │   Consumer    │    │   Consumer    │
│   (EC2/Lambda)│    │   (EC2/Lambda)│    │   (EC2/Lambda)│
└───────────────┘    └───────────────┘    └───────────────┘
```

### Setup Steps

```bash
# 1. Create SNS topic
aws sns create-topic --name OrderEvents

# 2. Create SQS queues
aws sqs create-queue --queue-name InventoryQueue
aws sqs create-queue --queue-name BillingQueue
aws sqs create-queue --queue-name ShippingQueue

# 3. Subscribe each queue to the SNS topic
aws sns subscribe --topic-arn arn:aws:sns:us-east-1:123456789012:OrderEvents \
    --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:123456789012:InventoryQueue

aws sns subscribe --topic-arn arn:aws:sns:us-east-1:123456789012:OrderEvents \
    --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:123456789012:BillingQueue

aws sns subscribe --topic-arn arn:aws:sns:us-east-1:123456789012:OrderEvents \
    --protocol sqs --notification-endpoint arn:aws:sqs:us-east-1:123456789012:ShippingQueue

# 4. Add SQS policy to allow SNS to send messages
# (Required—SQS queues must grant SNS permission)
```

---

## 12. Mobile Push Notifications

Amazon SNS mobile notifications can fan out mobile push notifications to iOS, Android, Fire OS, Windows, and Baidu-based devices .

### Supported Push Notification Services

| Platform | Service | Devices |
|----------|---------|---------|
| **iOS** | Apple Push Notification Service (APNs) | iPhone, iPad, Apple Watch  |
| **Android** | Firebase Cloud Messaging (FCM) | Android devices  |
| **Amazon** | Amazon Device Messaging (ADM) | Fire OS devices  |
| **Windows** | Windows Push Notification Services (WNS) | Windows devices  |
| **Windows Phone** | Microsoft Push Notification Service (MPNS) | Windows Phone  |

### How Mobile Push Works

1. **Platform Application**: Create a platform application in SNS for each push service (APNs, FCM)
2. **Device Registration**: Mobile app registers device token with SNS
3. **Endpoint ARN**: SNS creates an endpoint ARN for each device
4. **Publish**: Send push notification to platform endpoint or topic

### Platform Application Setup (FCM Example)

```bash
# Create platform application for FCM
aws sns create-platform-application \
    --name MyAndroidApp \
    --platform FCM \
    --attributes PlatformCredential=YOUR_FCM_SERVER_KEY
```

---

## 13. SMS Text Messaging

Amazon SNS supports sending text messages (SMS messages) to one or multiple phone numbers in over 200 countries and regions .

### SMS Use Cases

| Use Case | Description |
|----------|-------------|
| **One-Time Passcodes (OTP)** | Login verification codes  |
| **Delivery Updates** | Package tracking notifications  |
| **Appointment Reminders** | Healthcare, service appointments |
| **System Alerts** | Critical operational notifications |
| **Two-Factor Authentication (2FA)** | Secondary authentication factor |

### Sending SMS via AWS CLI

```bash
# Send SMS to a single number
aws sns publish \
    --phone-number "+1234567890" \
    --message "Your verification code is 456789"

# Send with message attributes (sender ID, max price)
aws sns publish \
    --phone-number "+1234567890" \
    --message "Your order has shipped!" \
    --message-attributes '{
        "AWS.SNS.SMS.SenderID": {"DataType": "String", "StringValue": "MyApp"},
        "AWS.SNS.SMS.MaxPrice": {"DataType": "Number", "StringValue": "0.50"}
    }'
```

### SMS Sandbox

Before moving to production, you can use the Amazon SNS sandbox to validate your SMS workloads . In the sandbox:
- You can only send messages to verified phone numbers
- You can request to move out of the sandbox (requires use case documentation)

### SMS Pricing Examples (per message)

| Destination | Approximate Cost |
|-------------|------------------|
| United States | $0.00645  |
| India | $0.0022  |
| United Kingdom | $0.0479  |
| Canada | $0.0075  |

**Note:** Prices vary by country and are subject to change. Always check the official AWS SNS pricing page for current rates.

---

## 14. Email Notifications

Amazon SNS supports the delivery of notifications to email addresses subscribed to topics .

### Use Cases for Email Notifications

| Use Case | Description |
|----------|-------------|
| **Application alerts** | DevOps workflow visibility  |
| **CloudWatch alarm notifications** | Metric threshold breaches  |
| **S3 event notifications** | File upload alerts |
| **System reports** | Daily/weekly summary reports |

### Email Subscription Types

| Type | Description |
|------|-------------|
| **Email** | Plain text email with notification body  |
| **Email-JSON** | JSON-formatted email for programmatic processing  |

### Limitations

| Limitation | Value |
|------------|-------|
| **Delivery rate** | Capped at 10 messages per second  |
| **Recommendation** | For higher-volume email, use SNS + Lambda + Amazon SES  |

---

## 15. Message Delivery Retries and Dead-Letter Queues

Amazon SNS uses several strategies that work together to provide message durability .

### Retry Policy

If a subscribed endpoint isn't available, Amazon SNS executes a message delivery retry policy . The retry policy includes:

| Parameter | Default | Description |
|-----------|---------|-------------|
| **Initial delay** | 1 second | Wait before first retry |
| **Maximum retries** | 3 | Number of retry attempts |
| **Backoff factor** | 2.0 | Exponential backoff multiplier |
| **Maximum delay** | 20 seconds | Maximum wait between retries |

### Dead-Letter Queues (DLQs)

To preserve any messages that aren't delivered before the delivery retry policy ends, you can create a dead-letter queue (SQS) .

```bash
# Configure DLQ for an SNS subscription
aws sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:123456789012:MyTopic \
    --protocol sqs \
    --notification-endpoint arn:aws:sqs:us-east-1:123456789012:MyQueue \
    --attributes '{"RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:123456789012:MyDLQ\"}"}'
```

---

## 16. Security and Encryption

### Server-Side Encryption (SSE)

Amazon SNS provides encrypted topics to protect your messages from unauthorized and anonymous access .

| Feature | Description |
|---------|-------------|
| **Encryption algorithm** | 256-bit AES-GCM  |
| **Key management** | AWS KMS customer master keys (CMK)  |
| **Encryption scope** | Messages are encrypted as soon as SNS receives them  |
| **Decryption** | Messages are decrypted as they are delivered to endpoints  |

### Encryption Options

| Option | Description |
|--------|-------------|
| **AWS owned key** | Default, no additional cost |
| **AWS managed key** | `aws/sns` key in your account |
| **Customer managed key** | Your own KMS key with custom policies |

### Network Privacy with VPC Endpoints

Amazon SNS supports VPC Endpoints (VPCE) via AWS PrivateLink. You can use VPC Endpoints to privately publish messages to Amazon SNS topics from an Amazon Virtual Private Cloud (VPC), without traversing the public internet .

### Access Control

| Method | Description |
|--------|-------------|
| **IAM policies** | Control which users/roles can perform SNS actions |
| **Topic policies** | Resource-based policies for cross-account access  |
| **VPC endpoints** | Private access without internet traversal  |

### CloudTrail Auditing

SNS supports AWS CloudTrail, which records AWS API calls for your account and delivers log files to you . CloudTrail captures:
- API caller identity
- Time of API call
- Source IP address
- Request parameters
- Response elements

---

## 17. Monitoring and Observability

### CloudWatch Metrics

| Metric | Description |
|--------|-------------|
| `NumberOfMessagesPublished` | Messages published to your topics |
| `NumberOfNotificationsDelivered` | Messages successfully delivered to subscribers |
| `NumberOfNotificationsFailed` | Messages that failed delivery |
| `PublishSize` | Size of published messages |
| `SMSMonthToDateSpentUSD` | SMS spending for current month |
| `SMSSuccessRate` | Percentage of successful SMS deliveries |

### CloudWatch Logs

Enable delivery logging to capture:
- Delivery attempts (successes and failures)
- Message payloads
- Endpoint responses

### AWS X-Ray

X-Ray can be enabled for SNS to trace messages as they flow through topics to downstream services.

---

## 18. Pricing and Cost Optimization

### Pricing Model (us-east-1 approximate)

| Component | Price |
|-----------|-------|
| **Publish requests** | $0.50 per 1 million requests  |
| **HTTP/S deliveries** | $0.60 per 1 million deliveries  |
| **Email deliveries** | $2.00 per 100,000 deliveries  |
| **SMS deliveries** | Varies by country ($0.0022 - $0.15)  |
| **Lambda & SQS deliveries** | Free (billed by respective services)  |
| **Mobile push deliveries** | $0.50 per 1 million deliveries  |

### Free Tier (Permanent)

| Resource | Free Monthly Amount |
|----------|---------------------|
| Publish requests | 1 million  |
| HTTP/S deliveries | 100,000  |
| Email deliveries | 1,000  |
| SMS (US numbers) | 100 messages  |

### Cost Optimization Strategies

| Strategy | Description |
|----------|-------------|
| **Use batching** | Publish up to 10 messages per API call  |
| **Use message filtering** | Reduce unnecessary deliveries to subscribers  |
| **Right-size topic type** | FIFO topics cost more than Standard |
| **Monitor SMS costs** | SMS pricing varies significantly by country |
| **Use SQS for durability** | SQS deliveries are free at SNS level  |

---

## 19. Limitations and Best Practices

### Key Limitations

| Limitation | Value | Impact |
|------------|-------|--------|
| **Message size** | 256 KB maximum  | For larger payloads, use S3 + reference |
| **Email delivery rate** | 10 messages/second  | Not suitable for high-volume email |
| **No message persistence** | Messages delivered and discarded  | Use DLQ or SQS for durability |
| **FIFO throughput** | 300 TPS (non-batch) / 3,000 TPS (batch) | Lower than Standard |

### Best Practices

| Category | Practice |
|----------|----------|
| **Design** | Make message processing idempotent to handle potential duplicates  |
| **Filtering** | Use message attributes (not body) for filtering when possible  |
| **Durability** | Configure dead-letter queues for critical subscriptions  |
| **Cost** | Use batching to reduce API requests  |
| **Security** | Enable encryption for sensitive topics |
| **Monitoring** | Set CloudWatch alarms for delivery failures |
| **SMS** | Always get user consent before sending SMS  |

---

## 20. SNS vs. SQS vs. EventBridge vs. Kinesis

| Feature | Amazon SNS | Amazon SQS | Amazon EventBridge | Amazon Kinesis |
|---------|-----------|-----------|-------------------|----------------|
| **Pattern** | Pub/Sub (push) | Queue (pull) | Event bus | Stream (ordered) |
| **Delivery** | All subscribers receive each message | Single consumer per message | Rule-based routing | All consumers read |
| **Persistence** | No (deliver and discard)  | Yes (up to 14 days) | No | Yes (up to 365 days) |
| **Ordering** | FIFO topics available | FIFO queues available | Best-effort | Strict per shard |
| **Filtering** | Yes (filter policies)  | No | Yes (event patterns) | No |
| **Use Case** | Fan-out, notifications  | Work queues, decoupling | SaaS event routing | Real-time streaming |

### When to Use Each

| Scenario | Recommended Service |
|----------|-------------------|
| One event triggers multiple services | SNS  |
| Need durable message storage with retries | SQS  |
| Routing events from SaaS applications | EventBridge  |
| High-volume ordered data processing | Kinesis  |
| Mobile push notifications | SNS  |
| SMS or email alerts | SNS  |

---

## 21. SNS Glossary

This glossary includes key terms directly related to Amazon SNS.

---

### A

**Application-to-Application (A2A) Messaging**
Pattern where SNS delivers messages between software applications or services. Examples include Lambda functions, SQS queues, and HTTP endpoints .

**Application-to-Person (A2P) Messaging**
Pattern where SNS delivers messages directly to end users via email, SMS, or mobile push notifications .

**ARN (Amazon Resource Name)**
Unique identifier for an SNS topic. Format: `arn:aws:sns:region:account-id:topic-name` .

---

### D

**Dead-Letter Queue (DLQ)**
An SQS queue configured for an SNS subscription that receives messages that couldn't be delivered after the retry policy ends .

**Deduplication (FIFO)**
Feature that ensures duplicate messages aren't delivered to subscribers. Requires message deduplication IDs or auto-generation .

---

### F

**Fan-Out**
The pattern where a single message published to a topic is replicated and pushed to multiple subscribers in parallel .

**FIFO Topic (First-In-First-Out)**
Topic type that preserves strict message ordering and provides exactly-once processing. Topic names must end with `.fifo` .

**Filter Policy**
A JSON policy that subscribers attach to subscriptions to receive only messages that match specified criteria. Reduces unnecessary message deliveries .

**Filter Policy Scope**
Determines whether filtering applies to message attributes (default) or message body. Body filtering incurs additional costs .

---

### M

**Message**
The data sent from a publisher to subscribers. Maximum size is 256 KB. Can be plain text, JSON, or XML .

**Message Attribute**
Metadata attached to a message used for filtering and routing. Includes data type (String, Number, Binary) and value .

**Message Body Filtering**
Filtering based on content within the message payload. Incurs additional cost per GB of scanned data .

**Mobile Push Notification**
Notifications delivered to mobile devices through platform-specific services like APNs (iOS) and FCM (Android) .

---

### P

**Platform Application**
An SNS resource that represents your mobile app registered with a push notification service (APNs, FCM, ADM, WNS) .

**Pub/Sub (Publish-Subscribe)**
Messaging paradigm where publishers send messages to topics without knowing subscribers, and subscribers receive messages without knowing publishers .

**Publisher**
A component that sends messages to an SNS topic .

---

### R

**Retry Policy**
Configuration that defines how SNS attempts redelivery when a subscriber endpoint is unavailable. Includes initial delay, max retries, and backoff factor .

---

### S

**SMS (Short Message Service)**
Text messaging capability in SNS supporting over 200 countries. Requires sandbox verification for production use .

**Standard Topic**
Topic type offering high throughput with at-least-once delivery and best-effort ordering. Suitable for most use cases .

**Subscriber**
A client that receives notifications from an SNS topic. Can be Lambda, SQS, HTTP, email, SMS, or mobile endpoint .

**Subscription**
The registration that associates a subscriber endpoint with a topic .

---

### T

**Topic**
An access point that identifies a specific subject or event type for publishing messages. Publishers send to topics; subscribers receive from topics .

---

## Summary

Amazon SNS is a powerful, fully managed pub/sub messaging service that enables both application-to-application and application-to-person communication at any scale. With its push-based delivery, multiple protocol support, and automatic scaling, SNS is the natural choice for building decoupled, event-driven architectures on AWS.

**Key Takeaways:**

- **Two topic types**: Standard (high throughput) and FIFO (ordered, exactly-once) 
- **Push-based delivery**: No polling required—messages pushed immediately 
- **Multiple protocols**: Lambda, SQS, HTTP, email, SMS, mobile push 
- **Message filtering**: Subscribers receive only relevant messages 
- **Fan-out pattern**: One message triggers multiple independent services 
- **Free tier**: 1 million requests monthly, permanently 

**Getting Started Recommendations:**
- Start with Standard topics for most use cases
- Use FIFO topics when message order or deduplication is critical 
- Implement message filtering to reduce costs and unnecessary processing 
- Configure dead-letter queues for production workloads 
- Use SNS + SQS fan-out for durable, decoupled processing 
- Enable encryption for sensitive message payloads 