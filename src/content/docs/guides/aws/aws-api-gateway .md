---
title: API Gateway
description: Complete Guide to Amazon RDS (Relational Database Service)
date: 2026-04-12
---
 
# API Gateway

Amazon **API Gateway is a fully managed service** that makes it easy for developers to **create, publish, maintain, monitor, and secure APIs** at any scale . 

APIs act as the **front door** for applications to access data, business logic, or functionality from your backend services . 

With API Gateway, you can create RESTful APIs, HTTP APIs, and WebSocket APIs that enable real-time two-way communication applications .

---



## 1. What is Amazon API Gateway?

Amazon API Gateway is a fully managed service that handles all the tasks involved in accepting and processing up to hundreds of thousands of concurrent API calls, including traffic management, authorization and access control, throttling, monitoring, and API version management . It has no minimum fees or startup costs—you pay only for the API calls you receive and the amount of data transferred out .

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Fully Managed** | No servers to provision, patch, or manage—AWS handles everything |
| **Automatic Scaling** | Scales seamlessly from zero to hundreds of thousands of concurrent API calls |
| **Pay-Per-Use Pricing** | No minimum fees; pay only for API calls and data transfer |
| **Multiple API Types** | REST APIs, HTTP APIs, and WebSocket APIs for different use cases |
| **Built-in Security** | IAM, Lambda authorizers, Cognito, and OAuth2/OIDC support |
| **Performance Optimization** | Caching, throttling, and edge-optimized endpoints via CloudFront |

### Why Use API Gateway?

API Gateway helps with several critical aspects of creating and managing APIs :

1. **Metering** - Define usage plans with throttling and quota limits on a per-API-key basis
2. **Security** - Leverage IAM, Amazon Cognito, and Lambda authorizers for access control
3. **Resiliency** - Manage traffic with throttling to withstand traffic spikes
4. **Operations Monitoring** - Dashboard integration with CloudWatch for metrics and logs
5. **Lifecycle Management** - Operate multiple API versions and stages simultaneously
6. **Developer Experience** - Generate SDKs for multiple platforms and create developer portals

---

## 2. API Types: REST API vs. HTTP API vs. WebSocket API

Amazon API Gateway offers three distinct API types, each optimized for different use cases .

### Comparison Table

| Feature | HTTP API | REST API | WebSocket API |
|---------|----------|----------|---------------|
| **Best For** | Serverless workloads, Lambda/HTTP backends | Full-featured APIs needing management tools | Real-time two-way communication |
| **Cost** | $1.00 - $1.17 / 1M requests | $1.51 - $3.50 / 1M requests | $0.80 - $1.00 / 1M messages |
| **Latency** | Up to 60% lower than REST API | Higher latency | Low-latency persistent connections |
| **JWT/OAuth2 Support** | Native OIDC/OAuth2 | Via Lambda authorizer | Via Lambda authorizer |
| **Usage Plans / API Keys** | No | Yes | Yes |
| **Request Validation** | No | Yes | N/A |
| **Caching** | No | Yes | N/A |
| **WAF Integration** | Yes (via other services) | Yes | Yes |
| **Private APIs (VPC)** | No | Yes | No |
| **SDK Generation** | No | Yes | No |

### When to Choose Each API Type

**HTTP APIs are ideal for :**
- Building proxy APIs for AWS Lambda or any HTTP endpoint
- Modern APIs equipped with OIDC and OAuth2 authorization
- Workloads that are likely to grow very large
- Latency-sensitive workloads

**REST APIs are ideal for :**
- Customers needing an all-inclusive set of API management features
- Use cases requiring usage plans, API keys, and request validation
- APIs that need caching and WAF integration

**WebSocket APIs are ideal for :**
- Real-time applications like chat apps and streaming dashboards
- Gaming leaderboards and live notifications
- Any application requiring persistent two-way communication

---

## 3. Core Concepts and Architecture

Understanding these fundamental concepts is essential for working with API Gateway .

### Core Components

| Component | Description |
|-----------|-------------|
| **API Gateway** | AWS service for creating, deploying, and managing APIs that expose backend HTTP endpoints, Lambda functions, or other AWS services |
| **API** | A collection of resources and methods that can be deployed in stages |
| **Resource (REST API)** | A typed object within your API's domain (e.g., `/users`, `/products`) |
| **Method (REST API)** | Standard HTTP verbs (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS) supported for each resource; `ANY` method matches all verbs |
| **Route (HTTP/WebSocket API)** | Defines how incoming requests are directed to integrations (e.g., `GET /users`) |
| **Integration** | Defines how API Gateway communicates with the backend (Lambda, HTTP endpoint, AWS service) |
| **Stage** | A logical reference to a lifecycle state of your API (e.g., 'dev', 'prod', 'beta') |
| **Deployment** | A point-in-time snapshot of your API that can be associated with a stage |

### API Endpoint Types

API Gateway supports three types of API endpoints :

| Endpoint Type | Description |
|---------------|-------------|
| **Edge-Optimized** | Default hostname using CloudFront distribution for global access; requests route to nearest CloudFront POP for lower latency |
| **Regional** | Deployed to a specific Region; ideal for clients in the same Region or when using latency-based routing |
| **Private** | Exposed through interface VPC endpoints; accessible only from within a VPC |

---

## 4. How API Gateway Works

API Gateway sits between your API consumers and your backend services, handling the HTTP lifecycle so you don't have to run API servers .

### Request Flow Diagram

```
Client → API Gateway → [Authentication] → [Throttling] → [Integration] → Backend → Response
```

### Detailed Request Lifecycle

| Step | Description |
|------|-------------|
| **1. Receive** | Client sends HTTP/HTTPS or WebSocket request to API endpoint |
| **2. Authenticate** | API Gateway validates request using configured authorizer (IAM, Lambda, Cognito, JWT) |
| **3. Throttle** | Applies throttling rules to prevent abuse; returns `429 Too Many Requests` if exceeded |
| **4. Route** | Matches request to API resource/method or route definition |
| **5. Transform (optional)** | Applies mapping templates to transform request body/parameters |
| **6. Integrate** | Forwards request to configured backend (Lambda, HTTP endpoint, AWS service) |
| **7. Transform Response** | Applies mapping templates to transform backend response |
| **8. Respond** | Returns response to client with appropriate status code and headers |

### Integration Types

API Gateway can integrate with several backend types :

| Integration Type | Description |
|-----------------|-------------|
| **Lambda Integration** | Invokes a Lambda function; proxy mode passes entire request to function |
| **HTTP Integration** | Calls any HTTP/HTTPS endpoint (public or VPC-internal) |
| **AWS Service Integration** | Directly calls other AWS services (SNS, SQS, Kinesis, Step Functions) |
| **Mock Integration** | Returns static responses without calling a backend—useful for testing |
| **VPC Link Integration** | Accesses resources inside a VPC (ALB, NLB, Cloud Map services) |

---

## 5. Step-by-Step: Creating Your First API

### Prerequisites
- AWS account
- AWS Management Console access or AWS CLI configured
- (For Lambda integration) A Lambda function in the same region

### Method 1: Using AWS Console (Quick Create for HTTP API)

**Step-by-Step Instructions:**

1. **Sign in to AWS Console** and navigate to **API Gateway**

2. **Click Create API**

3. **Choose HTTP API** and click **Build**

4. **Configure integrations**:
   - Select **Add integration**
   - Choose integration type: **Lambda** or **HTTP**
   - For Lambda: Select your Lambda function from dropdown
   - For HTTP: Enter the backend endpoint URL

5. **Configure routes**:
   - Click **Next** to accept default route `$default` (catch-all)
   - Or add specific routes: `GET /users`, `POST /users`, `GET /users/{id}`

6. **Configure stages**:
   - Stage name: `dev` (or `prod`, `staging`)

7. **Review and create** - Click **Create**

Your API is now live at the provided endpoint URL (e.g., `https://{api-id}.execute-api.{region}.amazonaws.com`).

### Method 2: Using AWS CLI (HTTP API)

```bash
# Create HTTP API
aws apigatewayv2 create-api \
    --name "my-http-api" \
    --protocol-type HTTP \
    --target "arn:aws:lambda:us-east-1:123456789012:function:my-function"

# Get the API endpoint
aws apigatewayv2 get-api --api-id {api-id}
```

### Method 3: Using AWS CLI (REST API)

```bash
# Create REST API
aws apigateway create-rest-api \
    --name "my-rest-api" \
    --description "My first REST API"

# Get the root resource ID
aws apigateway get-resources --rest-api-id {rest-api-id}

# Create a resource (e.g., /users)
aws apigateway create-resource \
    --rest-api-id {rest-api-id} \
    --parent-id {root-id} \
    --path-part "users"

# Create a GET method
aws apigateway put-method \
    --rest-api-id {rest-api-id} \
    --resource-id {resource-id} \
    --http-method GET \
    --authorization-type NONE

# Set up integration (Lambda example)
aws apigateway put-integration \
    --rest-api-id {rest-api-id} \
    --resource-id {resource-id} \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:123456789012:function:my-function/invocations"

# Deploy the API
aws apigateway create-deployment \
    --rest-api-id {rest-api-id} \
    --stage-name prod
```

---

## 6. Integrations: Connecting to Backends

### Lambda Integration

Lambda integration is the most common pattern for serverless APIs .

**Lambda Proxy Integration (Recommended):**
- API Gateway passes the entire request to Lambda (headers, body, path parameters, query strings)
- Lambda must return a response in a specific format
- Minimal configuration; full control in code

**Lambda Non-Proxy Integration:**
- You configure mapping templates to transform request/response
- More complex but allows filtering/transformation before Lambda

**Example Lambda Response Format for Proxy Integration:**
```json
{
    "isBase64Encoded": false,
    "statusCode": 200,
    "headers": {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    },
    "body": "{\"message\": \"Hello, World!\"}"
}
```

### HTTP Integration

HTTP integrations proxy requests to any HTTP/HTTPS endpoint .

**Use cases:**
- Expose existing HTTP services as APIs
- Integrate with on-premises or third-party services
- Migrate gradually from monolithic services

### AWS Service Integration

Directly integrate with other AWS services without Lambda :

| Service | Integration Pattern |
|---------|---------------------|
| **Amazon SNS** | Publish notifications when API is called |
| **Amazon SQS** | Queue messages for async processing |
| **Amazon Kinesis** | Stream data for real-time analytics |
| **AWS Step Functions** | Start state machine workflows |

### Mock Integration

Returns static responses without calling a backend—useful for :
- Testing APIs before backend is ready
- Providing default responses for certain conditions
- Simulating error scenarios

---

## 7. Authentication and Authorization

API Gateway provides multiple tools to authorize access to your APIs .

### Authorization Methods Comparison

| Method | Best For | Complexity | Features |
|--------|----------|------------|----------|
| **IAM Authorization** | Internal AWS services, machine-to-machine | Medium | Signature Version 4, fine-grained policies |
| **Lambda Authorizer** | Custom auth logic, JWT tokens, OAuth | High | Full custom logic in code |
| **Amazon Cognito** | User authentication (web/mobile apps) | Medium | User pools, social logins, MFA |
| **JWT / OAuth2 (HTTP APIs)** | Modern applications with OIDC providers | Low | Native support in HTTP APIs |

### IAM Authorization

API Gateway can verify signed API calls using the same methodology AWS uses for its own APIs .

```bash
# Require IAM authorization on a method
aws apigateway put-method \
    --rest-api-id {api-id} \
    --resource-id {resource-id} \
    --http-method GET \
    --authorization-type AWS_IAM
```

### Lambda Authorizer (Custom Authorizer)

A Lambda authorizer runs a Lambda function that validates incoming bearer tokens (JWT, SAML, OAuth) and returns IAM policies .

**Use cases:**
- Custom authentication logic
- Integration with third-party identity providers
- Complex authorization rules

### Amazon Cognito User Pools

Cognito user pools provide a fully managed authentication solution for web and mobile apps.

```bash
# Set Cognito authorizer
aws apigateway update-authorizer \
    --rest-api-id {api-id} \
    --authorizer-id {authorizer-id} \
    --provider-arns arn:aws:cognito-idp:us-east-1:123456789012:userpool/us-east-1_abc123
```

### OAuth2 / OIDC (HTTP APIs)

HTTP APIs offer native OIDC and OAuth2 support without requiring a Lambda authorizer .

---

## 8. API Deployment and Stages

### Deployments

A **deployment** is a point-in-time snapshot of your API that makes it available for clients to call .

```bash
# Create a deployment
aws apigateway create-deployment \
    --rest-api-id {rest-api-id} \
    --stage-name prod
```

### Stages

A **stage** is a logical reference to a lifecycle state of your API (e.g., 'dev', 'prod', 'beta', 'v2') . API stages are identified by API ID and stage name.

**Benefits of stages:**
- Run multiple versions of the same API simultaneously
- Test new versions before production release
- Configure different settings per stage (throttling, caching, logging)
- Stage variables for environment-specific configuration

### Stage Variables

Stage variables allow you to configure your API differently for each stage without modifying code.

**Example stage variables:**
- `lambdaAlias`: Points to different Lambda aliases (dev, prod)
- `backendUrl`: Different backend endpoints per environment

### Auto-Deploy (HTTP APIs)

HTTP APIs support automatic deployment of changes to a stage without manual deployment commands .

```yaml
# AWS CDK example
new HttpStage(this, "Stage", {
    httpApi: api,
    stageName: "beta",
    autoDeploy: true,  // Changes deploy automatically
});
```

---

## 9. Custom Domain Names and SSL

### Setting Up Custom Domains

Custom domain names provide simpler, more intuitive URLs for your APIs. You can map multiple APIs to the same domain using base path mappings .

**Requirements:**
- SSL/TLS certificate in AWS Certificate Manager (ACM)
- Domain name registered (Route 53 or other registrar)

### Base Path Mappings

Base path mappings allow you to host multiple APIs on the same domain :

| Domain | Mapping Key | API Stage | URL |
|--------|-------------|-----------|-----|
| `api.example.com` | (none) | `prod` | `https://api.example.com` |
| `api.example.com` | `v2` | `v2` | `https://api.example.com/v2` |
| `api.example.com` | `beta` | `beta` | `https://api.example.com/beta` |

### IP Address Type for Domain Names

You can configure the IP address type for your custom domain name—`IPV4` (default) or `DUAL_STACK` .

### Custom Domain Setup Steps

1. Request certificate in ACM in `us-east-1` (required for CloudFront/edge-optimized)
2. Create domain name in API Gateway referencing the certificate
3. Configure API mapping (associate domain with API stage)
4. Create DNS record (Route 53 A or CNAME) pointing to API endpoint

---

## 10. Monitoring and Observability

### CloudWatch Integration

API Gateway provides a metrics dashboard through integration with Amazon CloudWatch, offering performance metrics covering API calls, latency data, and error rates .

### Key Metrics to Monitor

| Metric | Description |
|--------|-------------|
| `Count` | Total number of API requests |
| `Latency` | Time between API Gateway receiving request and returning response |
| `IntegrationLatency` | Time API Gateway waits for backend response |
| `4XXError` | Client-side errors (authentication, invalid requests) |
| `5XXError` | Server-side errors (backend failures, timeouts) |
| `CacheHitCount` / `CacheMissCount` | Cache performance |

### CloudWatch Logs

Enable CloudWatch Logs for detailed execution logs including request/response bodies, integration errors, and access logs .

```bash
# Enable access logging for a stage
aws apigateway update-stage \
    --rest-api-id {api-id} \
    --stage-name prod \
    --patch-operations op=replace,path=/accessLogSettings/destinationArn,value=arn:aws:logs:... \
    --patch-operations op=replace,path=/accessLogSettings/format,value='$context.requestId $context.identity.sourceIp $context.httpMethod $context.resourcePath $context.status'
```

### X-Ray Tracing

Enable AWS X-Ray to trace requests through API Gateway and downstream services for end-to-end visibility.

```bash
# Enable X-Ray tracing
aws apigateway update-stage \
    --rest-api-id {api-id} \
    --stage-name prod \
    --tracing-enabled
```

---

## 11. Throttling, Quotas, and Usage Plans

API Gateway helps you manage traffic with throttling so that backend operations can withstand traffic spikes .

### Throttling Concepts

| Concept | Description |
|---------|-------------|
| **Burst Limit** | Maximum number of requests API Gateway handles simultaneously before throttling |
| **Rate Limit** | Maximum number of requests per second |
| **Quota** | Maximum number of requests per day, week, or month |

### Usage Plans

Usage plans help you declare plans for third-party developers that restrict access only to authorized users .

**Components:**
- **API Key** - Alphanumeric string identifying an app developer
- **Usage Plan** - Defines throttling and quota limits for API keys
- **Associated APIs** - Which API stages the plan applies to

### Use Case: Monetizing APIs

1. Create a usage plan with specific throttling and quota limits
2. Associate the plan with your API stage
3. Generate or import API keys
4. Distribute keys to third-party developers
5. Monitor usage metrics per API key

---

## 12. Caching for Performance Optimization

API Gateway can cache the output of API calls to avoid calling your backend every time, improving performance for frequently accessed data .

### Cache Configuration

| Parameter | Options |
|-----------|---------|
| **Cache Capacity** | 0.5 GB, 1.6 GB, 6.1 GB, 13.5 GB, 28.4 GB, 58.2 GB, 118 GB, 237 GB |
| **Time to Live (TTL)** | Seconds to keep cached responses (default: 300) |
| **Encryption** | Option to encrypt cache data |

### Cache Behavior

- Cache keys include: method, path, query parameters, headers (configurable)
- Cache invalidation via `Cache-Control: max-age=0` header
- Separate cache per stage

### When to Use Caching

- Read-heavy workloads with repeated identical requests
- Expensive backend computations
- Data that changes infrequently

### When NOT to Use Caching

- Write-heavy workloads
- Real-time data requiring freshness
- Small APIs with low traffic (cache overhead may exceed benefit)

---

## 13. Request and Response Transformation

API Gateway can transform requests and responses using mapping templates .

### Mapping Templates

A **mapping template** is a script in Velocity Template Language (VTL) that transforms request/response bodies between frontend and backend formats .

**Use cases:**
- Convert XML to JSON
- Filter or restructure data
- Combine multiple data sources
- Add computed fields

### Content Type Handling

APIs built on API Gateway can accept any payloads sent over HTTPS. Typical data formats include JSON, XML, query string parameters, and request headers .

### Identity Transform

The simplest mapping is an identity transform that passes headers/body through the integration as-is from client to backend .

---

## 14. WebSocket APIs for Real-Time Communication

WebSocket APIs maintain a persistent connection between connected users and enable message transfer between them .

### How WebSocket APIs Work

API Gateway maintains a persistent connection between clients and API Gateway itself. There is no persistent connection between API Gateway and backend integrations—backend services are invoked as needed based on message content .

### WebSocket Routes

| Route Key | Description |
|-----------|-------------|
| `$connect` | Invoked when client attempts to connect |
| `$disconnect` | Invoked when client disconnects |
| `$default` | Invoked when no other route matches |
| Custom key | Matches specific message content (e.g., `sendMessage`) |

### Callback URLs

When a new client connects through a WebSocket connection, you can call an integration in API Gateway to store the client's callback URL. You can then use that callback URL to send messages to the client from the backend system .

### Use Cases for WebSocket APIs

- Chat applications
- Real-time dashboards and notifications
- Gaming leaderboards
- Live sports scores
- Collaborative editing

---

## 15. Private APIs and VPC Integration

### Private APIs

Private API endpoints are exposed through interface VPC endpoints and allow clients to securely access private API resources inside a VPC. Private APIs are isolated from the public internet and can only be accessed using VPC endpoints for API Gateway that have been granted access .

### VPC Links

VPC Links (formerly VPC Link for REST APIs) enable API Gateway to access resources inside your VPC .

**Supported targets:**
- Private Application Load Balancers (ALB)
- Private Network Load Balancers (NLB)
- Services registered in AWS Cloud Map (e.g., ECS tasks)

### When to Use Private APIs

- Internal microservices communication
- Compliance requirements prohibiting public endpoints
- Backend services that shouldn't be internet-accessible

---

## 16. Developer Portal and SDK Generation

### Developer Portal

A developer portal is an application that allows your customers to register, discover, and subscribe to your API products (usage plans), manage their API keys, and view their usage metrics for your APIs .

### SDK Generation (REST APIs Only)

API Gateway generates custom SDKs for mobile and web app development .

**Supported platforms:**
- Android (Java)
- iOS (Objective-C and Swift)
- JavaScript (web applications)
- Java
- Ruby

```bash
# Generate SDK from API
aws apigateway get-sdk \
    --rest-api-id {api-id} \
    --stage-name prod \
    --sdk-type javascript \
    my-javascript-sdk.zip
```

---

## 17. Pricing and Cost Optimization

### Pricing Model

API Gateway has a tiered pricing model that reduces your cost as your API usage scales . You pay for API calls received and data transferred out .

### Pricing by API Type (us-east-1 approximate)

| API Type | Price per Million Requests |
|----------|---------------------------|
| **HTTP API** | $1.00 - $1.17 |
| **REST API** | $1.51 - $3.50 |
| **WebSocket Messages** | $0.80 - $1.00 |
| **WebSocket Connection Minutes** | $0.25 per million minutes |

### Free Tier (First 12 Months)

| Resource | Free Monthly Amount |
|----------|---------------------|
| REST API calls | 1 million |
| HTTP API calls | 1 million |
| WebSocket messages | 1 million |

### Additional Costs

| Feature | Cost |
|---------|------|
| **Data Transfer** | Standard AWS data transfer rates |
| **Cache** | $0.02 - $3.80 per hour (by cache size) |
| **Custom Domain** | Included (certificate from ACM may have costs) |

### Cost Calculation Example

**Scenario:** 10 million API requests per month with HTTP API

```
10,000,000 requests × $1.00/1M = $10.00
Free tier credit (first year): 1,000,000 requests = -$1.00
Total (HTTP API): ~$9.00 per month

Same scenario with REST API:
10,000,000 × $3.50/1M = $35.00 - $3.50 = ~$31.50 per month
Savings with HTTP API: ~71% ($22.50/month)
```

### Cost Optimization Strategies

| Strategy | Savings Potential |
|----------|-------------------|
| **Use HTTP APIs** | Up to 71% cheaper than REST APIs |
| **Enable caching** | Reduces backend calls, may reduce integration costs |
| **Use data transfer optimization** | Keep APIs and clients in same region |
| **Monitor usage** | Set budgets and alarms for unexpected spikes |
| **Clean up unused APIs** | Delete unused stages and deployments |

---

## 18. Limitations and When NOT to Use API Gateway

### Key Limitations

| Limitation | Value | Impact |
|------------|-------|--------|
| **Integration timeout** | 29 seconds (max) | Long-running operations fail |
| **Payload size** | 10 MB max | Large files must use alternative patterns |
| **Regional APIs per account** | 600 (default) | Large organizations may need multiple accounts |
| **WebSocket connection duration** | 2 hours (max) | Requires reconnection strategy |
| **WebSocket idle timeout** | 10 minutes | Heartbeat required for long idle periods |
| **No HTTP endpoints** | HTTPS only | API Gateway only exposes HTTPS endpoints  |

### When NOT to Use API Gateway

| Scenario | Better Alternative |
|----------|-------------------|
| **Ultra-low-latency requirements** | Run your own reverse proxy (e.g., NGINX on EC2) |
| **Long-running operations (>29 seconds)** | Use async pattern: accept request, return job ID |
| **Large file uploads (>10 MB)** | Use S3 presigned URLs, process asynchronously |
| **GraphQL APIs** | AWS AppSync (built for GraphQL) |
| **Simple Lambda HTTP endpoints** | Lambda Function URLs (free, simpler) |
| **Need fine-grained HTTP control** | Self-managed API server |

---

## 19. Best Practices

### API Design Best Practices

| Practice | Description |
|----------|-------------|
| **Use HTTP APIs by default** | Cheaper, faster, and sufficient for most use cases |
| **Design for idempotency** | Handle duplicate requests safely |
| **Use meaningful resource paths** | `/users/{id}` not `/getUserById` |
| **Version APIs properly** | Use stages or path versioning (`/v1/users`) |

### Security Best Practices

| Practice | Description |
|----------|-------------|
| **Enable throttling** | Protect backend from traffic spikes |
| **Use least privilege IAM** | Grant minimum necessary permissions |
| **Implement authentication** | Never leave APIs publicly accessible without auth |
| **Enable CloudTrail** | Audit API Gateway configuration changes |
| **Use WAF for REST APIs** | Protect against common web exploits |
| **Rotate API keys regularly** | Especially for production usage plans |

### Performance Best Practices

| Practice | Description |
|----------|-------------|
| **Enable caching for read-heavy APIs** | Reduces latency and backend load |
| **Use edge-optimized endpoints** | For globally distributed clients |
| **Right-size Lambda memory** | For Lambda integrations, memory affects performance |
| **Minimize mapping template complexity** | Complex VTL adds latency |

### Operational Best Practices

| Practice | Description |
|----------|-------------|
| **Enable access logging** | Essential for debugging and compliance |
| **Set up CloudWatch alarms** | Alert on 5XX errors, high latency, throttling |
| **Use stage variables** | Environment-specific configuration |
| **Implement canary deployments** | Test new versions with percentage of traffic |
| **Tag resources** | Track costs and manage environments |

---

## 20. API Gateway Glossary

This glossary includes key terms directly related to Amazon API Gateway.

---

### A

**API Deployment**
A point-in-time snapshot of your API Gateway API. To be available for clients to use, the deployment must be associated with one or more API stages .

**API Endpoint**
A hostname for an API in API Gateway that is deployed to a specific Region. The hostname format is `{api-id}.execute-api.{region}.amazonaws.com` .

**API Key**
An alphanumeric string that API Gateway uses to identify an app developer who uses your REST or WebSocket API. API Gateway can generate API keys on your behalf, or you can import them from a CSV file .

**API Stage**
A logical reference to a lifecycle state of your API (e.g., 'dev', 'prod', 'beta', 'v2'). API stages are identified by API ID and stage name .

**App Developer**
An app creator who may or may not have an AWS account and interacts with the API that you, the API developer, have deployed. App developers are your customers, typically identified by an API key .

---

### B

**Base Path Mapping**
Configuration that maps a custom domain name to a specific API stage, allowing multiple APIs to be hosted on the same domain using different paths .

**Burst Limit**
The maximum number of requests API Gateway handles simultaneously before applying throttling.

---

### C

**Callback URL**
When a new client connects through a WebSocket connection, you can call an integration to store the client's callback URL, which can be used to send messages from the backend system .

**CORS (Cross-Origin Resource Sharing)**
Browser security feature that restricts HTTP requests from scripts running in different domains. API Gateway provides built-in CORS support .

---

### D

**Deployment**
See API Deployment.

**Developer Portal**
An application that allows your customers to register, discover, and subscribe to your API products (usage plans), manage their API keys, and view their usage metrics for your APIs .

---

### E

**Edge-Optimized API Endpoint**
The default hostname of an API Gateway API deployed to a specific Region while using a CloudFront distribution. API requests route to the nearest CloudFront POP, improving connection time for geographically diverse clients .

---

### H

**HTTP API**
API Gateway API type optimized for building APIs that proxy to AWS Lambda functions or HTTP backends. Cheaper and faster than REST APIs, ideal for serverless workloads .

**HTTP Proxy Integration**
A simplified integration where API Gateway passes the entire request and response between frontend and HTTP backend without modification .

---

### I

**Integration**
Defines how API Gateway communicates with the backend—Lambda function, HTTP endpoint, or other AWS service .

**Integration Request**
The internal interface of a WebSocket API route or REST API method where you map the request body/parameters to the formats required by the backend .

**Integration Response**
The internal interface where you map status codes, headers, and payload from the backend to the response format returned to the client .

**Integration Timeout**
Maximum time API Gateway waits for backend response (29 seconds hard limit) .

---

### L

**Lambda Authorizer (Custom Authorizer)**
Lambda function that validates incoming bearer tokens (JWT, SAML, OAuth) and returns IAM policies to authorize API access .

**Lambda Proxy Integration**
Integration where API Gateway sends the entire request as input to a Lambda function and transforms the function output to an HTTP response. Requires minimal configuration .

---

### M

**Mapping Template**
A script in Velocity Template Language (VTL) that transforms request/response bodies between frontend and backend formats. Can reference context and stage variables .

**Method (REST API)**
Standard HTTP verb (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS) supported for each resource. `ANY` method matches all verbs .

**Mock Integration**
Integration where API responses are generated directly from API Gateway without calling a backend. Useful for testing before backend is ready .

**Model**
A data schema specifying the data structure of a request or response payload. Required for generating strongly typed SDKs and for payload validation .

---

### P

**Private API**
API exposed through interface VPC endpoints, accessible only from within a VPC and isolated from the public internet .

**Private Integration**
Integration type for clients to access resources inside a customer's VPC through a private REST API endpoint without exposing resources to the public internet .

**Proxy Integration**
Simplified API Gateway integration configuration. Can be HTTP proxy integration or Lambda proxy integration .

---

### Q

**Quota**
Maximum number of requests allowed per day, week, or month, enforced through usage plans.

---

### R

**Rate Limit**
Maximum number of requests per second allowed for an API or API key.

**Regional API Endpoint**
API hostname deployed to a specific Region for serving clients in the same AWS Region. Requests target the Region-specific API without CloudFront distribution .

**Resource (REST API)**
A typed object that is part of your API's domain. Each resource may have a data model, relationships to other resources, and can respond to different methods .

**REST API**
API Gateway API type offering full API management features including usage plans, API keys, request validation, and caching .

**Route (HTTP/WebSocket API)**
Defines how incoming requests or messages are directed to integrations. Routes consist of a method/path (HTTP) or route key (WebSocket) .

**Route Key (WebSocket)**
An attribute in the WebSocket message body used to direct messages to specific integrations. Default keys include `$connect`, `$disconnect`, and `$default` .

---

### S

**Stage**
See API Stage.

**Stage Variable**
Configuration variable specific to an API stage, allowing environment-specific values (e.g., Lambda alias, backend URL) without code changes.

---

### T

**Throttling**
Traffic management feature that limits the number of requests API Gateway processes to protect backend systems from traffic spikes .

---

### U

**Usage Plan**
Provides selected API clients with access to one or more deployed REST or WebSocket APIs. Configures throttling and quota limits enforced on individual client API keys .

---

### V

**VPC Link**
Resource enabling API Gateway to access resources inside a customer's VPC, such as private ALBs, NLBs, or Cloud Map services.

---

### W

**WebSocket API**
API type enabling real-time two-way communication applications with persistent client connections .

**WebSocket Connection**
Persistent connection maintained between client and API Gateway. No persistent connection exists between API Gateway and backend integrations .

---

## Summary

Amazon API Gateway is a powerful, fully managed service that serves as the front door for your backend services. With its multiple API types, built-in security, automatic scaling, and pay-per-use pricing, API Gateway enables teams to build and manage APIs efficiently without infrastructure overhead.

**Key Takeaways:**

- **Three API types** - HTTP APIs (cheaper/faster), REST APIs (full features), WebSocket APIs (real-time)
- **Fully managed** - No servers to provision, patch, or scale
- **Built-in security** - IAM, Lambda authorizers, Cognito, OAuth2/OIDC
- **Automatic scaling** - Handles hundreds of thousands of concurrent calls
- **Developer tools** - SDK generation, developer portal, API documentation
- **Production-ready features** - Stages, deployments, canary releases, custom domains

**Getting Started Recommendations:**
- Start with HTTP APIs for most serverless use cases
- Use the quick create workflow for your first API
- Enable CloudWatch logs and access logging from the beginning
- Implement throttling and usage plans for production APIs
- Use Lambda proxy integration for simplest configuration
- Consider WebSocket APIs for real-time applications