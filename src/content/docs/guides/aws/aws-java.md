---
title: AWS for JAva
description: AWS for Java
date: 2026-04-12
---
 
 # Java AWS Developer Guide

## 1. Core AWS Services for Java Developers

### Compute
- **AWS Lambda** - Serverless functions with Java 11/17/21
- **EC2** - Virtual machines with Java runtime
- **ECS/EKS** - Container orchestration (Docker + Java)

### Storage
- **S3** - Object storage (files, backups, static assets)
- **EBS** - Block storage for EC2
- **EFS** - Shared file system

### Databases
- **DynamoDB** - NoSQL, single-digit millisecond latency
- **RDS** - SQL (PostgreSQL, MySQL, Oracle)
- **Aurora** - MySQL/PostgreSQL compatible, 5x faster

### Messaging & Integration
- **SQS** - Queue service (decouple applications)
- **SNS** - Pub/sub notifications
- **EventBridge** - Event bus (cron jobs, event routing)

## 2. Development Setup

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"  # macOS
sudo apt install awscli  # Ubuntu

# Configure credentials
aws configure

# Install SDK v2 (Maven)
```

**pom.xml dependencies:**
```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.21.0</version>
</dependency>
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>dynamodb</artifactId>
    <version>2.21.0</version>
</dependency>
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-lambda-java-core</artifactId>
    <version>1.2.2</version>
</dependency>
```

## 3. Common Java Patterns

### S3 Operations
```java
S3Client s3 = S3Client.builder()
    .region(Region.US_EAST_1)
    .build();

// Upload
s3.putObject(PutObjectRequest.builder()
    .bucket("my-bucket")
    .key("file.txt")
    .build(), 
    RequestBody.fromString("content"));

// Download
GetObjectResponse response = s3.getObject(
    GetObjectRequest.builder()
        .bucket("my-bucket")
        .key("file.txt")
        .build(),
    responseBytes -> System.out.println(responseBytes));
```

### DynamoDB CRUD
```java
DynamoDbClient dynamo = DynamoDbClient.create();

// Put item
PutItemRequest request = PutItemRequest.builder()
    .tableName("Users")
    .item(Map.of(
        "userId", AttributeValue.builder().s("123").build(),
        "name", AttributeValue.builder().s("John").build()
    ))
    .build();
dynamo.putItem(request);

// Query
QueryRequest query = QueryRequest.builder()
    .tableName("Users")
    .keyConditionExpression("userId = :id")
    .expressionAttributeValues(Map.of(
        ":id", AttributeValue.builder().s("123").build()
    ))
    .build();
```

### SQS Messaging
```java
SqsClient sqs = SqsClient.create();

// Send message
SendMessageRequest send = SendMessageRequest.builder()
    .queueUrl("https://sqs.us-east-1.amazonaws.com/123/queue")
    .messageBody("Hello SQS")
    .build();
sqs.sendMessage(send);

// Receive messages
ReceiveMessageRequest receive = ReceiveMessageRequest.builder()
    .queueUrl(queueUrl)
    .maxNumberOfMessages(10)
    .build();
List<Message> messages = sqs.receiveMessage(receive).messages();
```

### Lambda Handler
```java
public class Handler implements RequestHandler<APIGatewayV2HTTPEvent, APIGatewayV2HTTPResponse> {
    @Override
    public APIGatewayV2HTTPResponse handleRequest(APIGatewayV2HTTPEvent event, Context context) {
        context.getLogger().log("Event: " + event);
        
        return APIGatewayV2HTTPResponse.builder()
            .withStatusCode(200)
            .withBody("{\"message\": \"Hello from Lambda\"}")
            .build();
    }
}
```

## 4. Best Practices

### Performance
- **Use connection pooling** - Reuse HTTP clients, S3/DynamoDB clients
- **Enable SDK metrics** - Monitor retries, latency, throttling
- **Lambda**: Set memory between 1024-3008 MB for CPU performance
- **Batch operations** - Use `putItems` (DynamoDB), `uploadFile` with multipart (S3)

### Security
- **Never hardcode credentials** - Use IAM roles, environment variables
- **Use SSM Parameter Store** for secrets/config
- **Enable encryption at rest** (S3 SSE-S3/KMS, DynamoDB default)
- **Use VPC** for database connections

### Error Handling
```java
try {
    s3.getObject(...);
} catch (S3Exception e) {
    if (e.statusCode() == 404) {
        // Handle not found
    } else if (e.statusCode() == 403) {
        // Handle access denied
    }
}
```

### Cost Optimization
- **Use S3 Intelligent-Tiering** for unpredictable access
- **Right-size DynamoDB** (use on-demand for unpredictable workloads)
- **Use Lambda SnapStart** (Java 11/17) to reduce cold starts from 6s to 200ms
- **Enable DynamoDB DAX** for read-heavy workloads

## 5. Infrastructure as Code

### AWS CDK (Java)
```java
public class MyStack extends Stack {
    public MyStack(final Construct scope, final String id) {
        super(scope, id);
        
        Bucket.Builder.create(this, "MyBucket")
            .versioned(true)
            .encryption(BucketEncryption.S3_MANAGED)
            .build();
        
        Function.Builder.create(this, "MyLambda")
            .runtime(Runtime.JAVA_17)
            .code(Code.fromAsset("target/lambda.jar"))
            .handler("com.example.Handler")
            .build();
    }
}
```

## 6. Testing & Deployment

### Local Testing
```bash
# Install LocalStack
docker run -p 4566:4566 localstack/localstack

# Test against local endpoint
S3Client s3 = S3Client.builder()
    .endpointOverride(URI.create("http://localhost:4566"))
    .region(Region.US_EAST_1)
    .credentialsProvider(StaticCredentialsProvider.create(
        AwsBasicCredentials.create("test", "test")))
    .build();
```

### Deployment Pipeline (GitHub Actions)
```yaml
- name: Build with Maven
  run: mvn clean package
  
- name: Deploy to Lambda
  run: |
    aws lambda update-function-code \
      --function-name my-function \
      --zip-file fileb://target/lambda.jar
      
- name: Deploy CDK stack
  run: cdk deploy --require-approval never
```

## 7. Monitoring & Troubleshooting

### CloudWatch
```java
// Embedded metric format (Lambda)
Map<String, Object> metrics = Map.of(
    "_aws", Map.of("Timestamp", System.currentTimeMillis()),
    "ProcessingTime", 123,
    "RecordsProcessed", 100
);
System.out.println(JsonUtils.toJsonString(metrics));
```

### X-Ray Tracing
```java
// Add to dependencies
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-xray-recorder-sdk-core</artifactId>
    <version>2.14.0</version>
</dependency>

// Instrument client
S3Client s3 = DynamoDbClient.builder()
    .overrideConfiguration(...)
    .build();
```

## 8. Quick Reference: SDK v2 vs v1

| Feature | SDK v2 (current) | SDK v1 (legacy) |
|---------|-----------------|-----------------|
| Package | `software.amazon.awssdk` | `com.amazonaws` |
| Clients | Immutable, builder pattern | Mutable |
| HTTP | Netty, Apache | Apache only |
| Streaming | Non-blocking | Blocking |

## 9. Common Pitfalls

❌ **Recreating clients per request** - Do once, reuse globally  
❌ **Using synchronous calls in Lambda** - Increases duration  
❌ **Ignoring DynamoDB hot partitions** - Use random/suffix keys  
❌ **Large response payloads in API Gateway** - Max 10MB, paginate  
❌ **Missing idempotency** - Use idempotency keys for SQS/Lambda  

## 10. Learning Resources

- **Documentation**: [AWS SDK for Java 2.0](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/home.html)
- **Samples**: [aws-sdk-java-v2-samples](https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javav2)
- **Local development**: LocalStack, DynamoDB Local, S3 Local

---

**Pro tip**: Use `aws-lambda-java-events` for type-safe event handlers (API Gateway, S3, SNS, SQS, DynamoDB streams).