---
title: Fargate
description: Complete Guide to AWS Fargate
date: 2026-04-12
---
 
 # AWS Fargate

**AWS Fargate is a serverless compute engine for containers** that works with **ECS** and **EKS**. 

**It allows you to run containers without managing the underlying servers or clusters**, fundamentally changing how teams deploy and scale containerized applications on AWS.

---



## 1. What is AWS Fargate?

AWS Fargate is a serverless, pay-as-you-go compute engine that lets you focus on building applications without managing servers. It is compatible with both Amazon ECS and Amazon EKS, making it a versatile choice for container deployment.

### The Core Value Proposition

Traditional container deployment requires you to provision, configure, and maintain EC2 instances as worker nodes. With Fargate, AWS handles all of this infrastructure management automatically.

| Aspect | Traditional EC2 Launch | AWS Fargate |
|--------|----------------------|-------------|
| **Server Management** | You provision and manage EC2 instances | No servers to manage |
| **Capacity Planning** | You estimate and plan capacity | AWS handles automatically |
| **Patching** | You maintain OS and security updates | AWS manages patching |
| **Scaling** | You configure Auto Scaling groups | Automatic infrastructure scaling |
| **Billing** | Pay for running EC2 instances | Pay per vCPU and memory per task |

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Serverless Simplicity** | No need to provision, configure, or scale virtual machines |
| **Security by Design** | Each task runs in its own isolated compute environment |
| **Right-Sized Compute** | Pay only for the resources your containers actually use |
| **Automatic Scaling** | Fargate scales compute resources based on workload demands |
| **Deep AWS Integration** | Native integration with IAM, CloudWatch, VPC, and other AWS services |

---

## 2. How AWS Fargate Works

Under the hood, Fargate orchestrates isolated Firecracker microVMs for each task or pod. Firecracker is a lightweight virtualization technology (also used by AWS Lambda) that spins up secure, fast-booting VMs.

### The Execution Lifecycle

```
1. Define Task/Pod → 2. Specify Resources → 3. Deploy → 4. Fargate Provisions → 5. Container Runs
```

### Detailed Flow

| Step | Description |
|------|-------------|
| **Define** | Create a task definition (ECS) or pod spec (EKS) specifying container images, CPU/memory, networking, and IAM roles |
| **Resource Specification** | Set CPU and memory requirements for your container |
| **Deployment** | Run the task or deploy the pod through ECS or EKS |
| **Provisioning** | Fargate pulls the container image and launches it inside a Firecracker microVM |
| **Execution** | Container runs with logs sent to CloudWatch and metrics to CloudWatch |

### How Fargate Works with EKS

When you deploy a Pod to EKS with Fargate:
1. You define a **Fargate profile** that specifies which Pods should run on Fargate (using namespace and label selectors)
2. The Fargate profile installs an admission webhook that intercepts new Pods matching your profile
3. The webhook mutates these Pods to be scheduled by the Fargate scheduler instead of the default Kubernetes scheduler
4. The Fargate scheduler evaluates the Pod's CPU and memory requests and calls AWS APIs to launch the appropriate serverless "node"
5. The kubelet joins the cluster and binds your Pod to the new Fargate node

### Fargate Profiles

Fargate profiles support label- and namespace-based selection, allowing you to target only specific workloads for serverless deployment. This enables hybrid clusters where some Pods run on EC2 nodes and others run on Fargate.

---

## 3. Fargate with ECS vs. EKS

AWS Fargate integrates with both container orchestration services, each offering different benefits.

| Feature | ECS with Fargate | EKS with Fargate |
|---------|-----------------|------------------|
| **Orchestration** | AWS-native, simpler setup | Kubernetes-standard, portable |
| **Learning Curve** | Lower | Higher (Kubernetes expertise needed) |
| **Control Plane** | Fully managed by AWS | Fully managed EKS control plane |
| **Pod Networking** | Each task gets its own ENI | Each pod gets its own ENI |
| **Windows Containers** | Supported | Not currently supported |
| **Arm64 (Graviton)** | Supported | Not currently supported |
| **Best For** | Teams new to containers, AWS-centric | Teams with Kubernetes experience, multi-cloud strategies |

### When to Choose Each

- **Choose ECS + Fargate** if you want the simplest, most integrated experience and don't need Kubernetes-specific features
- **Choose EKS + Fargate** if you have existing Kubernetes expertise, need portability across clouds, or require Kubernetes ecosystem tools

---

## 4. Step-by-Step: Deploying a Container with Fargate

### Prerequisites
- An AWS account
- AWS CLI configured (optional)
- Docker installed locally (for building images)
- Basic understanding of containers

### Method 1: Using ECS Console (Simplest)

#### Step 1: Push a Container Image to Amazon ECR

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repository
aws ecr create-repository --repository-name my-fargate-app --region us-east-1

# Tag your local image
docker tag my-app:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/my-fargate-app:latest

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/my-fargate-app:latest
```

#### Step 2: Create a Task Definition

A task definition is a blueprint that describes your application:

```json
{
  "family": "my-fargate-task",
  "taskRoleArn": "arn:aws:iam::account-id:role/ecsTaskRole",
  "executionRoleArn": "arn:aws:iam::account-id:role/ecsExecutionRole",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "web-app",
      "image": "account-id.dkr.ecr.us-east-1.amazonaws.com/my-fargate-app:latest",
      "portMappings": [{"containerPort": 80, "protocol": "tcp"}],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-fargate-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

**Key parameters explained**:
- `requiresCompatibilities: ["FARGATE"]` - Specifies serverless launch type
- `networkMode: "awsvpc"` - Each task gets its own ENI
- `cpu` and `memory` - Resources allocated to the task

#### Step 3: Create an ECS Cluster

1. Navigate to **Amazon ECS** in the AWS Console
2. Click **Create cluster**
3. Choose **Networking only (Fargate)** template
4. Name your cluster (e.g., `my-fargate-cluster`)
5. Click **Create**

#### Step 4: Run the Task as a Service

1. In your cluster, go to the **Services** tab
2. Click **Create**
3. Select **Fargate** as the launch type
4. Choose your task definition and revision
5. Set **Desired tasks** (e.g., `1`)
6. Configure VPC, subnets, and security groups
7. (Optional) Configure load balancing
8. Click **Create**

### Method 2: Using EKS with Fargate

#### Create a Fargate EKS Cluster with eksctl

```bash
# Create a Fargate-only EKS cluster
eksctl create cluster --name my-fargate-cluster --fargate
```

**What happens automatically**:
- EKS control plane provisioned across multiple Availability Zones
- Default Fargate profile created
- CoreDNS is scheduled onto Fargate
- No EC2 worker nodes are created

#### Create a Fargate Profile for Your Workload

```bash
# Create a Fargate profile for the "frontend" namespace
eksctl create fargateprofile --cluster my-fargate-cluster --name frontend-profile --namespace frontend

# Create the namespace
kubectl create namespace frontend
```

#### Deploy an Application

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

```bash
kubectl apply -f deployment.yaml
kubectl get pods -n frontend
```

**Note:** Unlike traditional EKS clusters, you will not see any worker nodes in the EC2 console—Fargate is completely serverless.

---

## 5. Networking and Security

### VPC Integration

On AWS Fargate, each ECS Task or Kubernetes Pod is given a dedicated elastic network interface (ENI) attached into your virtual private cloud (VPC). All traffic in and out of the containerized workload goes through this ENI.

| Networking Feature | Description |
|-------------------|-------------|
| **Dedicated ENI** | Each task/pod gets its own network interface |
| **Security Groups** | VPC Security Groups can be used to secure the ENI |
| **VPC Flow Logs** | Monitor traffic flows for compliance and troubleshooting |
| **Private Subnets** | Run workloads in private subnets for added security |
| **Public IP Assignment** | Optional public IP for internet-facing tasks |

### Security Isolation

With Fargate, each workload runs on its own single-use, single-tenant compute instance. Each Amazon ECS Task or Kubernetes pod runs on a newly provisioned instance, isolated by a virtualization boundary.

**Key security features**:
- **Task-level IAM roles** - Each task can have a unique IAM role
- **Compliance programs** - PCI DSS, SOC, FIPS 140-2, FedRAMP, and HIPAA eligible
- **HIPAA-eligible** - Can process encrypted Protected Health Information (PHI) with executed BAA

### Security Best Practices

| Practice | Description |
|----------|-------------|
| **Use IAM task roles** | Assign granular permissions to specific containers |
| **Run in private subnets** | Keep workloads isolated from the internet |
| **Enable image scanning** | Use Amazon Inspector to catch vulnerabilities pre-deployment |
| **Centralize logging** | Enable CloudTrail for compliance auditing |

---

## 6. Storage Options

### Ephemeral Storage

Each workload that runs on AWS Fargate is given full access to ephemeral storage to use while the workload is running.

| Launch Type | Default Storage | Maximum Storage |
|-------------|----------------|-----------------|
| **ECS with Fargate** | 20 GiB | 200 GiB |
| **EKS with Fargate** | 20 GiB | 175 GiB |

**Important:** Once the workload has stopped, any data stored in ephemeral storage is erased.

### Persistent Storage with EFS

For stateful workloads requiring data persistence beyond task/pod lifecycle, Fargate supports Amazon Elastic File System (EFS).

**EFS integration benefits:**
- Persistent storage across task restarts
- Shared file access across multiple tasks
- Automatic scaling of storage capacity

### What About EBS?

**EBS volumes are NOT supported on Fargate**. If your application requires EBS block storage, you must use EC2-based ECS or EKS instead.

---

## 7. Auto Scaling and High Availability

### Service Auto Scaling (ECS)

Fargate integrates with ECS Service Auto Scaling to automatically adjust the number of tasks based on demand.

| Scaling Policy | Description |
|----------------|-------------|
| **Target Tracking** | Scale based on metric target (e.g., 70% CPU) |
| **Step Scaling** | Scale based on CloudWatch alarm thresholds |
| **Scheduled Scaling** | Scale based on predictable patterns (e.g., scale up at 9 AM) |

### Horizontal Pod Autoscaler (EKS)

For EKS with Fargate, you can use Kubernetes Horizontal Pod Autoscaler (HPA) to scale pod replicas based on CPU/memory utilization or custom metrics.

### High Availability Design

| Practice | Description |
|----------|-------------|
| **Multiple Availability Zones** | Deploy tasks/pods across multiple AZs |
| **Load Balancing** | Use ALB or NLB to distribute traffic |
| **Desired Task Count** | Run multiple replicas for redundancy |
| **Health Checks** | Configure health checks for automatic replacement of unhealthy tasks |

---

## 8. Monitoring and Observability

### CloudWatch Integration

Fargate provides built-in integration with Amazon CloudWatch for monitoring.

| Monitoring Tool | Purpose |
|----------------|---------|
| **CloudWatch Logs** | Automatically collect logs from containers |
| **CloudWatch Metrics** | Visualize CPU, memory, and network usage |
| **Container Insights** | Collect and analyze logs with operational dashboards |
| **AWS X-Ray** | End-to-end tracing for request flows |

### Logging Configuration in Task Definition

```json
"logConfiguration": {
  "logDriver": "awslogs",
  "options": {
    "awslogs-group": "/ecs/my-fargate-app",
    "awslogs-region": "us-east-1",
    "awslogs-stream-prefix": "ecs"
  }
}
```

### FireLens for Advanced Log Routing

FireLens for Amazon ECS can be used via task definition parameters to route logs to an AWS service or AWS Partner Network destination.

### Troubleshooting Fargate Tasks

| Issue | Troubleshooting Step |
|-------|---------------------|
| Container won't start | Check CloudWatch Logs for container-specific output |
| Networking issues | Verify subnets and security groups allow required access |
| Resource constraints | Review CPU/memory settings in task definition |
| Need live debugging | Use ECS Exec to SSH into running containers |

---

## 9. Pricing and Cost Optimization

### Pricing Model

With AWS Fargate, you pay only for the amount of vCPU, memory, and storage resources provisioned by your containerized applications.

| Component | Billing Basis |
|-----------|---------------|
| **vCPU** | Per second from image pull to task/pod termination |
| **Memory** | Per second from image pull to task/pod termination |
| **Ephemeral Storage** | First 20 GB included; additional storage billed |

**Minimum charge:** 1 minute per task

### Fargate Spot

Fargate Spot is available for fault-tolerant workloads, offering significant cost savings. You can enable Fargate Spot capacity in your compute environment for workloads that can tolerate interruptions.

### Cost Optimization Strategies

| Strategy | Description |
|----------|-------------|
| **Right-size resources** | Use AWS Compute Optimizer for recommendations |
| **Use Fargate Spot** | For batch jobs and fault-tolerant workloads |
| **Minimize idle time** | Fargate works best for intermittent workloads |
| **Consider EC2 for always-on** | Always-on workloads may be cheaper on EC2 |

### When Fargate is More Cost-Effective

- Bursty workloads with variable demand
- Development and testing environments
- Short-lived batch jobs
- Microservices with low average utilization

### When EC2 May Be Cheaper

- Always-on services with consistent high utilization
- Large-scale sustained workloads
- GPU-accelerated workloads (not supported on Fargate)

---

## 10. Limitations and When NOT to Use Fargate

### Technical Limitations

| Limitation | Impact | Workaround |
|------------|--------|------------|
| **No EBS volumes** | Cannot use block storage | Use EFS for persistent storage |
| **No DaemonSets (EKS)** | DaemonSets cannot schedule on Fargate | Run agents as sidecar containers |
| **No GPU support** | Cannot run GPU-accelerated workloads | Use EC2-based ECS/EKS |
| **No privileged containers** | Cannot run Docker-in-Docker or similar | Use rootless build tools like Kaniko |
| **No host access** | Cannot SSH into underlying nodes | Use ECS Exec for debugging |
| **Cold start latency** | Containers take time to spin up | Not ideal for latency-sensitive services |

### When NOT to Choose Fargate

| Scenario | Better Alternative |
|----------|-------------------|
| **GPU workloads** | EC2-based ECS/EKS |
| **Always-on high-throughput services** | EC2 launch type for cost efficiency |
| **Need fine-grained OS control** | Self-managed EC2 nodes |
| **DaemonSet requirements (EKS)** | EC2-based node groups |
| **Latency-sensitive applications** | EC2 with warm pools |
| **EBS-dependent applications** | EC2 launch type |

### Fargate is a Good Fit For

| Use Case | Why |
|----------|-----|
| **Microservices** | Independent scaling and isolation |
| **Web applications and APIs** | Automatic scaling with traffic |
| **Batch processing** | Short-lived, interruptible jobs |
| **CI/CD pipelines** | Ephemeral build agents |
| **Event-driven workloads** | Scale to zero between events |
| **Teams without infra expertise** | No server management required |

---

## 11. Best Practices

### Task Definition Design

| Practice | Description |
|----------|-------------|
| **Specify CPU and memory appropriately** | Test locally to understand requirements |
| **Use multi-architecture images** | Support both x86 and Arm64 |
| **Enable zstd compression** | Improves startup times |
| **Set log configuration** | Always configure CloudWatch Logs |

### Security Best Practices

| Practice | Description |
|----------|-------------|
| **Use least privilege IAM roles** | Grant only necessary permissions |
| **Run in private subnets** | Default for production workloads |
| **Enable VPC Flow Logs** | Monitor network traffic |
| **Scan container images** | Use Amazon Inspector before deployment |
| **Rotate secrets** | Use Secrets Manager for sensitive data |

### Cost Optimization

| Practice | Description |
|----------|-------------|
| **Right-size tasks** | Use AWS Compute Optimizer for recommendations |
| **Use Fargate Spot for batch** | Significant savings for fault-tolerant jobs |
| **Monitor with Cost Explorer** | Track and optimize spend |
| **Set budgets and alerts** | Avoid unexpected charges |

### Operational Excellence

| Practice | Description |
|----------|-------------|
| **Use multiple Availability Zones** | Deploy across AZs for high availability |
| **Configure health checks** | Enable automatic replacement of unhealthy tasks |
| **Implement structured logging** | Use consistent log formats |
| **Set up CloudWatch alarms** | Alert on critical metrics (CPU, memory, errors) |
| **Use ECS Exec for debugging** | Live debugging without SSH access |

---

## 12. Fargate Glossary

This glossary includes key terms directly related to AWS Fargate.

---

### A

**awsvpc networking mode**
Networking mode where each Fargate task receives its own Elastic Network Interface (ENI) with a private IP address. Required for Fargate tasks.

---

### C

**CloudWatch Container Insights**
Monitoring feature that collects and aggregates metrics and logs from Fargate containers, providing operational dashboards for troubleshooting.

**Cold Start**
The latency experienced when a Fargate task or pod first starts up as AWS provisions the underlying Firecracker microVM and pulls container images.

**Compute Environment (AWS Batch)**
A logical grouping of Fargate compute resources used for batch processing jobs. Configured with maximum vCPUs, networking, and optional Fargate Spot.

---

### E

**ECS Exec**
Feature allowing live debugging of running Fargate containers by executing commands directly inside the container without requiring SSH access.

**EFS (Elastic File System)**
AWS shared file storage service. Fargate tasks can mount EFS volumes for persistent storage that survives task restarts.

**ENI (Elastic Network Interface)**
Virtual network interface attached to each Fargate task or pod. Provides VPC connectivity and can be secured with security groups.

**Ephemeral Storage**
Temporary storage (20 GiB default, up to 200 GiB for ECS or 175 GiB for EKS) provided to each Fargate task. Data is erased when the task stops.

---

### F

**Fargate Launch Type**
Launch type for Amazon ECS that runs containers on AWS Fargate serverless compute instead of EC2 instances.

**Fargate Profile**
EKS configuration that defines which pods run on Fargate. Uses namespace and label selectors to target specific workloads for serverless execution.

**Fargate Scheduler**
Custom Kubernetes scheduler used when running EKS pods on Fargate. Intercepts pods matched by Fargate profiles and provisions serverless infrastructure.

**Fargate Spot**
Fargate capacity using EC2 Spot Instances at discounted rates. Suitable for fault-tolerant, stateless, or batch workloads that can tolerate interruptions.

**Firecracker**
Lightweight virtualization technology (also used by AWS Lambda) that powers Fargate, providing secure, fast-booting microVMs for each task or pod.

---

### I

**Isolation Boundary**
Security feature where each Fargate task or pod runs in its own dedicated kernel and compute environment, preventing interference between workloads.

---

### P

**Platform Version**
Specific runtime environment version for Fargate that determines available features and operating system versions. For Windows containers, specific platform versions are required.

---

### S

**Sidecar Container**
Secondary container running alongside the main application container within the same Fargate task. Used for logging, monitoring, security agents, or other auxiliary functions.

---

### T

**Task Definition (ECS)**
JSON-formatted blueprint describing one or more containers for an ECS task. For Fargate, specifies CPU, memory, networking mode, IAM roles, and container images.

---

### Z

**zstd Compression**
Alternative container image compression format (vs. default gzip) that decompresses more quickly, resulting in faster Fargate task startup times.

---

## Summary

AWS Fargate fundamentally changes how teams deploy containers on AWS by eliminating server management entirely. With its serverless model, per-second billing, and automatic scaling, Fargate enables teams to focus on building applications rather than managing infrastructure.

**Key takeaways:**

- **Fargate is serverless compute for containers** - No EC2 instances to provision, patch, or scale
- **Works with both ECS and EKS** - Choose your orchestration tool
- **Isolation by design** - Each task/pod runs in its own dedicated compute environment
- **Pay only for what you use** - Per-second billing for vCPU and memory
- **Ideal for variable workloads** - Bursty traffic, microservices, batch processing, and dev/test environments
- **Not for everything** - GPU workloads, DaemonSets, and always-on high-throughput services may be better on EC2

**Getting started recommendations:**
- Start with ECS + Fargate for the simplest path to serverless containers
- Use the AWS Copilot CLI for building and deploying production-ready applications on Fargate
- Leverage the AWS Fargate workshops for hands-on learning

