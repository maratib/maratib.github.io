---
title: Lambda
description: Complete Guide to AWS Lambda
date: 2026-04-12
---
 
# AWS Lambda

AWS Lambda is a serverless, event-driven compute service that lets you run code for virtually any application or backend service without provisioning or managing servers . You upload your code as a Lambda function, and AWS handles everything required to run and scale it with high availability across multiple Availability Zones .

This comprehensive guide covers everything you need to know about AWS Lambda, from core concepts to hands-on implementation and advanced optimization strategies.

---


## 1. What is AWS Lambda?

AWS Lambda is a serverless compute service that runs your code in response to events and automatically manages the underlying compute resources for you . It was launched in 2014 and pioneered the Function-as-a-Service (FaaS) model, becoming the backbone of serverless architecture on AWS .

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **No Server Management** | No operating systems to patch, no instances to provision, no infrastructure to maintain. AWS handles the entire compute lifecycle . |
| **Automatic Scaling** | Scales instantly from zero to tens of thousands of concurrent executions. No capacity planning, no auto-scaling groups, no load balancers . |
| **Pay-Per-Use Billing** | Billed per request and per millisecond of compute time. No charge when idle. Free tier covers 1 million requests and 400,000 GB-seconds monthly . |
| **Event-Driven Architecture** | Responds to events from over 200 AWS services and custom applications. |
| **Multiple Language Support** | Native support for Node.js, Python, Java, Go, .NET, Ruby, and custom runtimes . |

---

## 2. Core Concepts

Understanding the following concepts is essential for working with Lambda .

### Function

A **function** is a resource that you can invoke to run your code in Lambda. It has code to process the events that you pass into the function or that other AWS services send to the function .

### Trigger

A **trigger** is a resource or configuration that invokes a Lambda function. Triggers include AWS services that you can configure to invoke a function and event source mappings. An event source mapping reads items from a stream or queue and invokes a function .

### Event

An **event** is a JSON-formatted document that contains data for a Lambda function to process. The runtime converts the event to an object and passes it to your function code .

**Example custom event – weather data:**
```json
{
  "TemperatureK": 281,
  "WindKmh": -3,
  "HumidityPct": 0.55,
  "PressureHPa": 1020
}
```

**Example service event – Amazon SNS notification:**
```json
{
  "Records": [
    {
      "Sns": {
        "Timestamp": "2019-01-02T12:45:07.000Z",
        "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
        "Message": "Hello from SNS!"
      }
    }
  ]
}
```

### Execution Environment

An **execution environment** provides a secure and isolated runtime environment for your Lambda function. It manages the processes and resources required to run the function and provides lifecycle support .

### Deployment Package

You deploy your Lambda function code using a **deployment package**. Lambda supports two types:

| Type | Description |
|------|-------------|
| **.zip file archive** | Contains your function code and dependencies. Lambda provides the operating system and runtime. |
| **Container image** | OCI-compatible image. You include operating system, runtime, code, and dependencies. Up to 10 GB . |

### Runtime

The **runtime** provides a language-specific environment that runs in an execution environment. It relays invocation events, context information, and responses between Lambda and the function .

### Layer

A **Lambda layer** is a .zip file archive that can contain additional code or other content such as libraries, a custom runtime, data, or configuration files. You can include up to five layers per function .

### Extension

**Lambda extensions** enable you to augment your functions by integrating with monitoring, observability, security, and governance tools. An external extension runs as a separate process in the execution environment and can continue after function invocation completes .

### Concurrency

**Concurrency** is the number of requests that your function is serving at any given time. When your function is invoked, Lambda provisions an instance to process the event. If invoked again while a request is still being processed, another instance is provisioned, increasing concurrency .

### Qualifier

A **qualifier** specifies a version or alias when invoking or viewing a function. A version is an immutable snapshot with a numerical qualifier (e.g., `my-function:1`). An alias is a pointer to a version that you can update (e.g., `my-function:BLUE`) .

### Destination

A **destination** is an AWS resource where Lambda can send events from an asynchronous invocation. You can configure destinations for both successful and failed processing .

---

## 3. Supported Languages and Runtimes

AWS Lambda provides managed runtimes for popular languages. All runtimes support both x86_64 and ARM64 (Graviton2) architectures .

| Language | Supported Versions | Runtime Identifier |
|----------|-------------------|-------------------|
| **Node.js** | 20, 22, 24 | `nodejs24.x` |
| **Python** | 3.10 – 3.14 | `python3.14` |
| **Java** | 8, 11, 17, 21, 25 | `java25` |
| **.NET** | 8, 10 | `dotnet10` |
| **Ruby** | 3.2, 3.3, 3.4 | `ruby3.4` |
| **Go** | via provided runtime | `provided.al2023` |
| **Rust** | via provided runtime | `provided.al2023` |
| **Custom** | Any language | `provided.al2023` |

> **Note:** Amazon Linux 2 reaches end-of-life on June 30, 2026. Migrate runtimes using AL2 to AL2023 equivalents .

---

## 4. How Lambda Works

Lambda runs your code in response to events. Each invocation follows this lifecycle :

```
1. Event Trigger → 2. Initialize → 3. Execute → 4. Respond & Reuse
```

### Detailed Lifecycle

| Step | Description |
|------|-------------|
| **Event Trigger** | An event source invokes your function: HTTP request, S3 upload, DynamoDB stream, SQS message, schedule, or any of 200+ AWS integrations. |
| **Initialize** | Lambda provisions a secure Firecracker micro-VM, loads your code and dependencies, and runs initialization logic outside the handler. |
| **Execute** | Your handler function runs with the event payload. Lambda allocates CPU proportional to your memory setting (1,769 MB = approximately 1 vCPU). |
| **Respond & Reuse** | The function returns a response. The execution environment stays warm for subsequent invocations, avoiding cold starts. |

### Cold Starts Explained

A **cold start** occurs when Lambda provisions a new execution environment for a function that hasn't been invoked recently. During a cold start, Lambda downloads your code, initializes extensions, and runs any initialization code outside your handler before your function can process the event.

| Runtime | Typical Cold Start Duration |
|---------|---------------------------|
| Node.js / Python | 50–200 ms |
| Java / .NET | 200 ms – 2 seconds |
| With SnapStart | ~0 ms (Java, Python, .NET) |
| With Provisioned Concurrency | ~0 ms (all runtimes) |



---

## 5. Step-by-Step: Creating Your First Lambda Function

### Prerequisites
- An AWS account
- AWS Management Console access or AWS CLI configured

### Method 1: Using AWS Console (Quick Create)

**Step-by-Step Instructions:**

1. **Sign in to AWS Console** and navigate to **Lambda** at https://console.aws.amazon.com/lambda/

2. **Click Create function**

3. **Choose authoring option**:
   - **Author from scratch** – Start with a blank function
   - **Use a blueprint** – Use pre-built examples
   - **Container image** – Deploy from ECR
   - **Browse serverless app repository** – Find pre-built applications

4. **Configure basic information**:
   - **Function name**: Enter a descriptive name (e.g., `my-first-function`)
   - **Runtime**: Choose your preferred language (e.g., Python 3.14)
   - **Architecture**: x86_64 or arm64 (Graviton2 offers better price-performance)

5. **Permissions**:
   - **Change default execution role**: Choose "Create a new role with basic Lambda permissions" for testing

6. **Advanced settings** (optional):
   - **Memory**: 128 MB to 10,240 MB
   - **Timeout**: Up to 900 seconds (15 minutes)
   - **Environment variables**: Key-value pairs for configuration

7. **Click Create function**

### Example Function Code

**Python:**
```python
import json

def lambda_handler(event, context):
    """
    Example Lambda function that processes incoming events.
    
    Args:
        event (dict): Event data passed to the function
        context (LambdaContext): Runtime information
    Returns:
        dict: Response object
    """
    print(f"Received event: {json.dumps(event)}")
    
    # Extract name from event or use default
    name = event.get('name', 'World')
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': f'Hello, {name}!',
            'input': event
        })
    }
```

**Node.js:**
```javascript
exports.handler = async (event) => {
    console.log(`Received event: ${JSON.stringify(event)}`);
    
    const name = event.name || 'World';
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Hello, ${name}!`,
            input: event
        })
    };
};
```

### Method 2: Using AWS CLI

Create a Lambda function using the AWS CLI:

```bash
# Create a ZIP deployment package
zip function.zip index.js

# Create the function
aws lambda create-function \
    --function-name my-cli-function \
    --runtime nodejs20.x \
    --role arn:aws:iam::123456789012:role/lambda-execution-role \
    --handler index.handler \
    --zip-file fileb://function.zip \
    --memory-size 256 \
    --timeout 10
```

### Method 3: Using AWS SDK

```javascript
const { LambdaClient, CreateFunctionCommand } = require('@aws-sdk/client-lambda');

const lambda = new LambdaClient({ region: 'us-east-1' });

const createCommand = new CreateFunctionCommand({
  FunctionName: 'my-sdk-function',
  Runtime: 'python3.14',
  Role: 'arn:aws:iam::123456789012:role/lambda-execution-role',
  Handler: 'lambda_function.lambda_handler',
  Code: {
    S3Bucket: 'my-deployment-bucket',
    S3Key: 'function.zip'
  },
  MemorySize: 512,
  Timeout: 30
});

const response = await lambda.send(createCommand);
console.log(`Function created: ${response.FunctionArn}`);
```



---

## 6. Invoking Lambda Functions

Lambda supports three invocation types :

| Invocation Type | Description | Use Case |
|----------------|-------------|----------|
| **Synchronous (RequestResponse)** | Function executes and returns a response immediately. Client waits for result. | API backends, microservices |
| **Asynchronous (Event)** | Function is queued for execution. Client receives acknowledgment immediately without waiting. | Event processing, S3 notifications |
| **Poll-Based (Event Source Mapping)** | Lambda polls a stream or queue and invokes the function with batches of records. | SQS, Kinesis, DynamoDB Streams |

### Invoking via AWS CLI

**Synchronous invocation:**
```bash
aws lambda invoke \
    --function-name my-function \
    --invocation-type RequestResponse \
    --payload '{"name": "AWS User"}' \
    response.json
```

**Asynchronous invocation:**
```bash
aws lambda invoke \
    --function-name my-function \
    --invocation-type Event \
    --payload '{"name": "AWS User"}' \
    response.json
```

### Invoking via AWS SDK

```javascript
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const lambda = new LambdaClient({ region: 'us-east-1' });

const invokeCommand = new InvokeCommand({
  FunctionName: 'my-function',
  InvocationType: 'RequestResponse',
  Payload: JSON.stringify({ name: 'AWS User' })
});

const response = await lambda.send(invokeCommand);
const result = JSON.parse(new TextDecoder().decode(response.Payload));
console.log(result);
```

### Function URLs (HTTPS Endpoints)

Lambda provides built-in HTTPS endpoints for your functions without needing API Gateway. Features include :
- IAM authentication
- CORS support
- Response streaming
- No additional cost

```bash
# Create a function URL
aws lambda create-function-url-config \
    --function-name my-function \
    --auth-type AWS_IAM
```

---

## 7. Lambda Triggers and Event Sources

Lambda integrates natively with over 200 AWS services . Here are the most common event sources:

### AWS Service Integration Table

| Service | Trigger Type | Common Use Case |
|---------|-------------|-----------------|
| **Amazon S3** | Object creation/deletion | Image resizing, file processing  |
| **Amazon API Gateway** | HTTP/REST API requests | Web APIs, microservices  |
| **Amazon DynamoDB** | Stream records | Real-time data sync, change tracking |
| **Amazon SQS** | Queue messages | Decoupled microservices, batch processing |
| **Amazon SNS** | Topic notifications | Fan-out messaging, alerts |
| **Amazon EventBridge** | Schedule or event pattern | Cron jobs, event routing  |
| **Amazon Kinesis** | Data stream records | Real-time analytics |
| **Amazon MSK / Kafka** | Topic messages | Streaming data processing  |
| **CloudFront (Lambda@Edge)** | CDN requests | Edge computing, content personalization |

### Example: S3 Trigger Configuration

To automatically process files uploaded to S3:

```bash
# Add S3 bucket notification to invoke Lambda
aws s3api put-bucket-notification-configuration \
    --bucket my-source-bucket \
    --notification-configuration file://notification.json
```

Where `notification.json` contains:
```json
{
  "LambdaFunctionConfigurations": [
    {
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:process-file",
      "Events": ["s3:ObjectCreated:*"]
    }
  ]
}
```

---

## 8. Deployment Packages: ZIP vs. Container Images

Lambda supports two deployment package types .

| Feature | ZIP Archive | Container Image |
|---------|-------------|-----------------|
| **Maximum size** | 50 MB (direct upload) / 250 MB (S3) | 10 GB |
| **Runtime** | Lambda provides | You provide |
| **Operating System** | Lambda provides (AL2/AL2023) | You include |
| **Custom dependencies** | Included in ZIP | Included in image |
| **Layers** | Supported | Not supported |
| **Startup time** | Faster | Slightly slower |
| **Best for** | Simple functions, standard dependencies | ML models, large binaries, custom environments |

### ZIP Package Structure

```
function.zip
├── index.js (or lambda_function.py)
├── node_modules/ (or other dependencies)
└── package.json (or requirements.txt)
```

### Container Image Example (Dockerfile)

```dockerfile
FROM public.ecr.aws/lambda/python:3.14

# Copy function code
COPY app.py ${LAMBDA_TASK_ROOT}

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Set the CMD to your handler
CMD ["app.lambda_handler"]
```

Build and push to ECR:
```bash
docker build -t my-lambda-image .
docker tag my-lambda-image:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-lambda-repo:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-lambda-repo:latest

# Create function from container image
aws lambda create-function \
    --function-name my-container-function \
    --package-type Image \
    --code ImageUri=123456789012.dkr.ecr.us-east-1.amazonaws.com/my-lambda-repo:latest \
    --role arn:aws:iam::123456789012:role/lambda-execution-role
```

---

## 9. Lambda Layers and Extensions

### Lambda Layers

Layers provide a convenient way to package libraries and dependencies that you can use with multiple Lambda functions .

**Benefits of layers:**
- Reduce deployment package size
- Promote code sharing across functions
- Separate business logic from dependencies
- Enable faster iterations

**Example: Creating a Python layer with requests library**

```bash
# Create directory structure
mkdir -p python/lib/python3.14/site-packages

# Install dependencies into layer directory
pip install requests -t python/lib/python3.14/site-packages/

# Create ZIP archive
zip -r requests-layer.zip python/

# Publish layer
aws lambda publish-layer-version \
    --layer-name requests-layer \
    --description "Requests library for Python" \
    --zip-file fileb://requests-layer.zip \
    --compatible-runtimes python3.14
```

**Attaching a layer to a function:**
```bash
aws lambda update-function-configuration \
    --function-name my-function \
    --layers arn:aws:lambda:us-east-1:123456789012:layer:requests-layer:1
```

### Lambda Extensions

Extensions enable you to integrate Lambda with monitoring, observability, security, and governance tools .

**Extension types:**

| Type | Description |
|------|-------------|
| **Internal extension** | Runs in the runtime process, shares the same lifecycle as the runtime |
| **External extension** | Runs as a separate process in the execution environment, initialized before function invocation, continues after invocation completes |

---

## 10. Networking and Security

### VPC Integration

Lambda runs your code within a VPC by default. You can optionally configure Lambda to access resources behind your own VPC, allowing you to leverage custom security groups and network access control lists .

**To enable VPC access for your function:**
```bash
aws lambda update-function-configuration \
    --function-name my-function \
    --vpc-config SubnetIds=subnet-12345678,subnet-87654321,SecurityGroupIds=sg-12345678
```

### Security Features

| Feature | Description |
|---------|-------------|
| **IAM Integration** | Granular permissions using IAM roles for execution and invocation  |
| **Code Signing** | Verify that unaltered code published by approved developers is deployed  |
| **Encryption** | Environment variables can be encrypted with KMS |
| **Resource-based policies** | Control which accounts and services can invoke your function |
| **Isolation** | Each function runs in an isolated Firecracker micro-VM on AWS Nitro  |

### IAM Execution Role Example

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "dynamodb:PutItem"
      ],
      "Resource": [
        "arn:aws:s3:::my-bucket/*",
        "arn:aws:dynamodb:us-east-1:123456789012:table/my-table"
      ]
    }
  ]
}
```

---

## 11. Performance Optimization: Cold Starts and Concurrency

### Managing Cold Starts

**Strategies to reduce cold start latency :**

| Strategy | Description | Cost Impact |
|----------|-------------|-------------|
| **SnapStart** | Caches a snapshot of initialized execution environment. Up to 10x faster cold starts for Java, Python, and .NET. | Free |
| **Provisioned Concurrency** | Pre-initializes specified number of execution environments. Eliminates cold starts completely. | Additional charge per GB-second |
| **ARM64 (Graviton2)** | Offers comparable or better cold start performance at 20% lower cost. | Lower cost |
| **Smaller deployment size** | Minimize code and dependencies to reduce load time. | Free |
| **Optimized initialization** | Move heavy initialization outside handler and reuse connections. | Free |

### Concurrency Management

**Concurrency controls :**

| Control | Description |
|---------|-------------|
| **Reserved Concurrency** | Guarantees maximum concurrency for a function, protecting it from other functions in the account. |
| **Provisioned Concurrency** | Pre-initializes execution environments to handle expected load without cold starts. |
| **Unreserved Concurrency** | The pool of concurrency available to all functions without reserved concurrency. |

**Example: Setting reserved concurrency**
```bash
aws lambda put-function-concurrency \
    --function-name critical-function \
    --reserved-concurrent-executions 100
```

---

## 12. Monitoring and Observability

### Built-in Monitoring

Lambda provides built-in observability through :

| Service | Purpose |
|---------|---------|
| **Amazon CloudWatch** | Collects metrics (invocations, duration, errors, throttles) and logs |
| **AWS X-Ray** | Distributed tracing for request flows |
| **CloudWatch Application Signals** | Application performance monitoring |

### Key Metrics to Monitor

| Metric | Description | Alarm Threshold |
|--------|-------------|-----------------|
| `Invocations` | Number of function invocations | Monitor for spikes |
| `Duration` | Function execution time | > 80% of timeout |
| `Errors` | Number of failed invocations | > 0 |
| `Throttles` | Number of throttled invocations | > 0 |
| `ConcurrentExecutions` | Number of concurrent executions | > 80% of limit |

### Structured Logging Example (Python)

```python
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    # Structured logging with correlation ID
    logger.info(json.dumps({
        "event_type": "function_start",
        "request_id": context.aws_request_id,
        "function_name": context.function_name,
        "event": event
    }))
    
    try:
        result = process_event(event)
        
        logger.info(json.dumps({
            "event_type": "function_complete",
            "request_id": context.aws_request_id,
            "status": "success"
        }))
        
        return result
    except Exception as e:
        logger.error(json.dumps({
            "event_type": "function_error",
            "request_id": context.aws_request_id,
            "error": str(e)
        }))
        raise
```

---

## 13. Lambda@Edge: Running at the Edge

Lambda@Edge allows you to run Lambda functions across AWS locations globally in response to Amazon CloudFront events .

### Supported Events

| Event | Timing | Use Case |
|-------|--------|----------|
| **Viewer Request** | When CloudFront receives a request from a viewer | URL rewriting, authentication |
| **Origin Request** | Before forwarding request to origin | Header modification, request transformation |
| **Origin Response** | After receiving response from origin | Response transformation, caching control |
| **Viewer Response** | Before returning response to viewer | Response modification, A/B testing |

### Lambda@Edge Example

```javascript
// Viewer request function to redirect based on user agent
exports.handler = async (event, context) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const userAgent = headers['user-agent'][0].value;
    
    if (userAgent.includes('Mobile')) {
        // Redirect mobile users to mobile site
        const response = {
            status: '302',
            statusDescription: 'Found',
            headers: {
                location: [{
                    key: 'Location',
                    value: `https://m.example.com${request.uri}`
                }]
            }
        };
        return response;
    }
    
    return request;
};
```

---

## 14. Pricing and Cost Optimization

### Pricing Model

AWS Lambda charges based on requests and duration. The free tier is generous and never expires .

| Component | x86 Price | ARM (Graviton2) Price |
|-----------|-----------|----------------------|
| **Requests** | $0.20 per 1 million | $0.20 per 1 million |
| **Duration** | $0.0000166667 per GB-s | $0.0000133334 per GB-s |
| **Provisioned Concurrency** | $0.0000041667 per GB-s | $0.0000033334 per GB-s |
| **Ephemeral Storage** (above 512 MB) | $0.0000000309 per GB-s | $0.0000000309 per GB-s |

### Free Tier (Always Free)

- **1 million** requests per month
- **400,000 GB-seconds** of compute time per month
- **100 GiB** of response streaming per month

### Cost Calculation Example

**API handling 10 million requests per month (200ms avg, 256 MB memory):**

```
Requests: 10M × $0.20/1M = $2.00
Duration: 500,000 GB-s × $0.0000166667 = $8.33
Free tier credit: (1M requests + 400K GB-s) = -$6.87
Total (x86): ~$3.46 per month
Total (ARM): ~$3.14 per month
```



### Cost Optimization Strategies

| Strategy | Description | Potential Savings |
|----------|-------------|-------------------|
| **Use ARM64 (Graviton2)** | 20% lower cost with better price-performance | 20% |
| **Right-size memory** | More memory allocates more CPU. Find optimal memory for your workload | Varies |
| **Minimize duration** | Optimize code to run faster | Varies |
| **Use SnapStart** | Eliminates cold starts without Provisioned Concurrency cost | Significant for Java |
| **Clean up unused functions** | Delete functions you no longer need | 100% of idle cost |
| **Use Savings Plans** | Commit to consistent compute usage for up to 17% discount | Up to 17% |

---

## 15. Limits and Quotas

Key limits to keep in mind when designing your Lambda architecture :

| Resource | Limit | Notes |
|----------|-------|-------|
| **Memory** | 128 MB – 10,240 MB | Configurable per function |
| **Timeout** | 900 seconds (15 minutes) | Maximum execution time |
| **Package size (.zip)** | 50 MB (direct) / 250 MB (S3) | For ZIP deployments |
| **Container image** | Up to 10 GB | From Amazon ECR |
| **Ephemeral storage (/tmp)** | 512 MB – 10,240 MB | Configurable |
| **Concurrency** | 1,000 per region (default) | Can be increased |
| **Payload (synchronous)** | 6 MB request / 6 MB response | Total combined size |
| **Payload (asynchronous)** | 256 KB | For event payloads |
| **Layers per function** | 5 | Maximum layers you can attach |
| **Environment variables** | 4 KB total | For all variables combined |
| **Function name length** | 64 characters | Maximum |

---

## 16. Use Cases

Lambda powers a wide variety of serverless applications :

### REST & GraphQL APIs

Build scalable APIs that handle millions of requests. Pair with API Gateway or use Lambda Function URLs for simpler endpoints .

**Example:** E-commerce backend with product catalog, shopping cart, and checkout endpoints.

### Data Processing & ETL

Process streams from Kinesis and DynamoDB, transform files uploaded to S3, or run event-driven ETL pipelines at any scale .

**Example:** Real-time log processing, clickstream analytics, data transformation.

### Scheduled Tasks & Cron

Run recurring jobs using EventBridge Scheduler: cleanup routines, report generation, data syncs, and automated DevOps workflows .

**Example:** Daily database backup, weekly report generation, hourly data sync.

### Real-Time File Processing

Resize images, transcode video, parse documents, or generate thumbnails automatically when files are uploaded to S3 .

**Example:** Serverless image processing pipeline that creates thumbnails and web-optimized versions.

### AI & ML Inference

Run ML models for real-time inference. Deploy models as container images (up to 10 GB) with GPU-optimized libraries .

**Example:** Fraud detection, sentiment analysis, image classification.

### Event-Driven Microservices

Build loosely coupled services communicating through SNS, SQS, and EventBridge. Scale each function independently .

**Example:** Order processing system with separate functions for validation, payment, inventory, and shipping.

### Intelligent Document Processing (IDP)

Automate extraction, analysis, and validation of information from various document types using Lambda with AI services .

**Example:** Invoice processing, contract analysis, form data extraction.

### Chatbots and Generative AI

Manage entire chatbot workflows including pre/post processing, prompt engineering, model selection, and guardrails .

**Example:** Customer service chatbot, AI-powered help desk, virtual assistant.

---

## 17. Best Practices

### Code Design

| Practice | Description |
|----------|-------------|
| **Make functions stateless** | Store state in databases or caches, not in function memory  |
| **Initialize outside handler** | Move SDK clients, database connections, and heavy initialization outside the handler to reuse across invocations |
| **Use environment variables** | Store configuration values as environment variables, not hardcoded |
| **Handle errors gracefully** | Implement retry logic with exponential backoff for transient failures |
| **Use dead-letter queues** | Configure DLQs for asynchronous invocations to capture failed events |

### Security Best Practices

| Practice | Description |
|----------|-------------|
| **Least privilege IAM roles** | Grant only the permissions your function needs |
| **Use execution roles** | Never embed AWS credentials in function code |
| **Encrypt sensitive data** | Use KMS for environment variables and Secrets Manager for secrets |
| **Enable code signing** | Verify that only approved code is deployed  |
| **Run in VPC when needed** | Use VPC for private resources, but avoid it for internet-facing functions |

### Performance Best Practices

| Practice | Description |
|----------|-------------|
| **Right-size memory** | Test different memory configurations to find optimal performance/cost balance |
| **Use ARM64/Graviton2** | Better price-performance for most workloads |
| **Enable SnapStart for Java** | Dramatically reduces cold start latency at no cost |
| **Reuse connections** | Use connection pooling for databases and HTTP clients |
| **Minimize deployment size** | Remove unnecessary dependencies from deployment packages |

### Operational Best Practices

| Practice | Description |
|----------|-------------|
| **Implement structured logging** | Use JSON format for easier log analysis |
| **Set up monitoring and alerts** | Configure CloudWatch alarms for errors and throttles |
| **Use versioning and aliases** | Implement blue-green deployments with aliases  |
| **Tag resources** | Apply tags for cost tracking and resource management |
| **Test locally** | Use AWS SAM or Lambda RIE for local testing before deployment |

---

## 18. Lambda Glossary

This glossary includes key terms directly related to AWS Lambda.

---

### A

**Alias**
A pointer to a specific function version that you can update to map to a different version or split traffic between two versions. Example: `my-function:BLUE` .

**ARM64 / Graviton2**
64-bit ARM architecture for Lambda functions using AWS Graviton2 processors. Offers 20% lower cost and up to 34% better price-performance compared to x86_64 .

**Asynchronous Invocation**
Invocation type where events are queued for processing. Lambda returns an acknowledgment immediately without waiting for the function to complete. Destinations can be configured for success and failure cases .

---

### C

**CloudWatch**
AWS monitoring service that collects Lambda metrics (invocations, duration, errors, throttles) and logs. Integrated with Lambda for built-in observability .

**Code Signing**
Lambda feature that verifies that unaltered code published by approved developers is deployed in your functions. Provides trust and integrity controls .

**Cold Start**
The latency experienced when Lambda provisions a new execution environment for a function that hasn't been invoked recently. During a cold start, Lambda downloads code, initializes extensions, and runs initialization code before processing the event .

**Concurrency**
The number of requests that your function is serving at any given time. Lambda provisions additional instances automatically as concurrency increases .

**Container Image**
OCI-compatible deployment package type for Lambda functions. Supports up to 10 GB images from Amazon ECR. Requires you to include the operating system and runtime .

---

### D

**Destination**
An AWS resource where Lambda can send events from an asynchronous invocation. Supported destinations include SQS, SNS, Lambda, and EventBridge .

**Deployment Package**
A ZIP archive or container image containing your function code and dependencies. Deployed to Lambda to create or update a function .

---

### E

**Event**
A JSON-formatted document containing data for a Lambda function to process. The runtime converts the event to an object and passes it to your function code .

**Event Source Mapping**
A Lambda resource that reads items from a stream or queue and invokes a function with batches of records. Used for SQS, Kinesis, and DynamoDB Streams .

**Execution Environment**
A secure and isolated runtime environment for your Lambda function. Manages processes and resources required to run the function .

**Extension**
Code that augments your Lambda function by integrating with monitoring, observability, security, and governance tools. Can run as internal (in runtime process) or external (separate process) .

---

### F

**FaaS (Function-as-a-Service)**
Cloud computing model where developers write and deploy individual functions that execute in response to events. AWS Lambda pioneered this model in 2014 .

**Firecracker**
Lightweight virtualization technology (also used by AWS Lambda) that powers Firecracker microVMs, providing secure, fast-booting isolation for each function invocation .

**Function**
The core Lambda resource that contains your code and configuration. You invoke a function to run your code in response to events .

**Function URL**
Built-in HTTPS endpoint for a Lambda function that enables direct invocation without API Gateway. Supports IAM authentication, CORS, and response streaming .

---

### I

**Instruction Set Architecture**
Determines the type of computer processor that Lambda uses to run the function. Choices: `arm64` (Graviton2) or `x86_64` .

**Invocation**
A single execution of your Lambda function, triggered by an event source or direct API call.

---

### L

**Lambda@Edge**
Lambda feature that runs functions globally in response to Amazon CloudFront events (viewer/origin requests and responses) .

**Layer**
A .zip file archive containing additional code, libraries, custom runtimes, data, or configuration files. Up to five layers per function. Contents are extracted to `/opt` in the execution environment .

---

### M

**Memory**
Compute resource allocated to Lambda functions ranging from 128 MB to 10,240 MB. CPU, network bandwidth, and disk I/O are allocated proportionally to memory .

---

### P

**Provisioned Concurrency**
Pre-initialized execution environments that remain initialized, eliminating cold starts. Ideal for latency-critical applications. Additional cost applies .

---

### Q

**Qualifier**
Used when invoking or viewing a function to specify a version or alias. Example: `my-function:1` (version) or `my-function:BLUE` (alias) .

---

### R

**Reserved Concurrency**
Concurrency limit guaranteed for a specific function. Protects the function from being throttled by other functions in the same account .

**Runtime**
Language-specific environment that runs in the execution environment. Relays invocation events, context, and responses between Lambda and the function .

---

### S

**SnapStart**
Lambda feature that caches a snapshot of initialized execution environments. Provides up to 10x faster cold starts for Java, Python, and .NET at no additional cost .

**Synchronous Invocation**
Invocation type where the client waits for the function to complete and returns the response directly. Used for API backends and microservices .

---

### T

**Timeout**
Maximum execution time for a Lambda function, configurable up to 900 seconds (15 minutes) .

**Trigger**
A resource or configuration that invokes a Lambda function. Includes AWS services configured to invoke a function and event source mappings .

---

### V

**Version**
An immutable snapshot of a function's code and configuration. Versions have numerical qualifiers (e.g., `1`, `2`, `3`) and cannot be changed after creation .

---

### X

**X-Ray**
AWS distributed tracing service integrated with Lambda for tracing request flows through functions and downstream services .

---

### Z

**ZIP Archive**
Deployment package type for Lambda functions. Contains function code and dependencies. Lambda provides the operating system and runtime .

---

## Summary

AWS Lambda fundamentally changes how teams build and deploy applications by eliminating server management. With its event-driven architecture, automatic scaling, and pay-per-use pricing, Lambda enables developers to focus on business logic rather than infrastructure.

**Key Takeaways:**

- **Serverless compute** - No servers to provision, patch, or manage. AWS handles everything .
- **Event-driven** - Responds to events from over 200 AWS services and custom applications .
- **Automatic scaling** - Scales from zero to tens of thousands of concurrent executions instantly .
- **Pay-per-use** - Billed per request and per millisecond of compute time. Free tier covers 1M requests monthly .
- **Multiple languages** - Native support for Node.js, Python, Java, Go, .NET, Ruby, and custom runtimes .
- **Flexible deployment** - Deploy as ZIP archives or container images up to 10 GB .
- **Performance optimization** - SnapStart, Provisioned Concurrency, and ARM64/Graviton2 options .

**Getting Started Recommendations:**
- Start with the Lambda console using a simple Python or Node.js function
- Use the free tier to experiment without cost
- Add triggers from S3, API Gateway, or EventBridge to see event-driven architecture in action
- Use Lambda Layers to share common dependencies across functions
- Implement structured logging from the beginning