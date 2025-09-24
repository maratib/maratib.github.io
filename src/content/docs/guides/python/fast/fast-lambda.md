---
title: Fast Lambda
slug: guides/python/fast/fast-lambda
description: Fast Lambda
sidebar:
  order: 13
---

**FastAPI in AWS Lambda**

---

### 1. Why Run FastAPI in Lambda?

- **Serverless** → Pay only for requests.
- **Scalability** → Auto-scales with demand.
- **Low Ops Overhead** → No servers to manage.
- **Integrates Easily** → With API Gateway, S3, DynamoDB, SNS/SQS.

⚠️ Lambda isn’t perfect for all use cases: it has **cold starts** and **execution time limits** (15 mins).

---

### 2. Setup

#### Install Tools

```bash
pip install mangum fastapi uvicorn
```

- **Mangum** → ASGI adapter for AWS Lambda.

---

### 3. FastAPI App with Lambda

#### `main.py`

```python
from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/")
def root():
    return {"msg": "Hello from FastAPI on Lambda"}

@app.get("/items/{item_id}")
def get_item(item_id: int):
    return {"item": item_id, "detail": "Fetched from Lambda"}

# Adapter
handler = Mangum(app)
```

👉 `handler` is the AWS Lambda entrypoint.

---

### 4. Deploy with AWS Lambda

#### Option A) **AWS Console (Manual Upload)**

1. Zip your project (`main.py`, dependencies in `package/`).
2. Upload zip to AWS Lambda.
3. Set handler as:

   ```
   main.handler
   ```

4. Connect via API Gateway.

---

#### Option B) **Serverless Framework**

`serverless.yml`:

```yaml
service: fastapi-lambda
provider:
  name: aws
  runtime: python3.11
  region: us-east-1
functions:
  api:
    handler: main.handler
    events:
      - httpApi:
          path: /
          method: get
      - httpApi:
          path: /items/{item_id}
          method: get
```

Deploy:

```bash
sls deploy
```

---

#### Option C) **AWS SAM CLI**

`template.yaml`:

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31
Resources:
  FastApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: .
      Handler: main.handler
      Runtime: python3.11
      Events:
        ApiGateway:
          Type: Api
          Properties:
            Path: /{proxy+}
            Method: ANY
```

Deploy:

```bash
sam build && sam deploy --guided
```

---

### 5. Folder Structure

```
project/
│── app/
│   ├── main.py        # FastAPI app + Mangum handler
│   ├── requirements.txt
│
│── template.yaml      # SAM template OR serverless.yml
│── package/           # Dependencies for Lambda layer
```

---

### 6. Best Practices

- ✅ Use **Mangum** for ASGI support.
- ✅ Use **Lambda Layers** for dependencies → reduces package size.
- ✅ Minimize **cold starts** by:

- Keeping imports light.
- Using smaller dependencies.
  - ✅ Use **API Gateway HTTP API** (faster, cheaper than REST API).
  - ✅ For heavy workloads → use **AWS Fargate / ECS** instead of Lambda.
  - ✅ Log with **CloudWatch**.
  - ✅ Monitor with **X-Ray (tracing)**.
  - ✅ Store secrets in **AWS Secrets Manager**.

---

### 7. When to Use FastAPI on Lambda?

✅ Small to medium APIs with spiky workloads.

✅ Event-driven triggers (S3 uploads, SNS, SQS).

✅ Prototypes and low-cost APIs.

❌ Not great for high-throughput, always-on, low-latency services (use ECS/EKS).
