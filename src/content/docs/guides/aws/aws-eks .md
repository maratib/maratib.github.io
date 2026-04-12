---
title: EKS
description: Complete Guide to Amazon EKS (Elastic Kubernetes Service)
date: 2026-04-12
---
 
# EKS (Elastic Kubernetes Service)

Amazon Elastic Kubernetes Service (Amazon EKS) is a managed Kubernetes service that simplifies running Kubernetes on AWS and on-premises . As a fully managed service, Amazon EKS handles the availability and scalability of the Kubernetes control plane, so you can focus on building and deploying applications rather than managing cluster infrastructure.

This comprehensive guide covers everything you need to know about Amazon EKS, from core concepts to hands-on implementation and advanced features.

---



## 1. What is Amazon EKS?

Amazon Elastic Kubernetes Service (Amazon EKS) is a managed Kubernetes service that you can use to run Kubernetes on AWS and on-premises . Kubernetes is an open-source system designed for automating deployment, scaling, and management of containerized applications. Amazon EKS is Kubernetes-conformant, so existing applications that run on upstream Kubernetes are compatible with Amazon EKS .

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Fully Managed Control Plane** | AWS manages the availability and scalability of Kubernetes API servers and etcd persistence layer, running across three Availability Zones for high availability  |
| **Kubernetes Conformance** | Certified Kubernetes-conformant, ensuring compatibility with all existing Kubernetes plugins and tooling  |
| **Multiple Compute Options** | Run containers on EC2 instances or with AWS Fargate serverless compute  |
| **Deep AWS Integration** | Native integration with IAM, VPC, CloudWatch, and other AWS services |
| **Hybrid Capabilities** | EKS Anywhere enables running EKS on-premises for consistent management across cloud and local infrastructure  |
| **EKS Auto Mode** | Automates Kubernetes cluster infrastructure management for compute, storage, and networking  |

---

## 2. Why Kubernetes? Understanding the Value

Kubernetes was designed to improve availability and scalability when running mission-critical, production-quality containerized applications . Rather than running Kubernetes on a single machine, Kubernetes achieves these goals by allowing you to run applications across sets of computers that can expand or contract to meet demand .

### Key Kubernetes Attributes

| Attribute | Description |
|-----------|-------------|
| **Containerized** | Kubernetes is a container orchestration tool requiring containerized applications; containers are stored as images in a container registry and deployed to clusters  |
| **Scalable** | Automatically scales applications based on demand at both the Pod level (Horizontal Pod Autoscaler) and node level (Cluster Autoscaler or Karpenter)  |
| **Available** | Automatically moves running workloads to another available node if an application or node becomes unhealthy  |
| **Declarative** | Uses active reconciliation to constantly check that the declared state matches the actual state; you define desired state via YAML configuration files  |
| **Extensible** | Open source design allows extending Kubernetes through custom controllers, webhooks, and third-party add-ons  |
| **Portable** | Applications can run consistently across on-premises, cloud, edge devices, and IoT environments  |

### What Kubernetes Automates

Kubernetes automates complex tasks including :
- Deploying applications on multiple machines using containers deployed in Pods
- Monitoring container health and restarting failed containers
- Scaling containers up and down based on load
- Updating containers with new versions
- Allocating resources between containers
- Balancing traffic across machines

---

## 3. Core Concepts and Architecture

### Kubernetes Cluster Components

A Kubernetes cluster consists of two main parts :

| Component | Description |
|-----------|-------------|
| **Control Plane (Master Nodes)** | Handles scheduling, scaling, and managing the cluster's overall state. Includes API server, etcd database, scheduler, and controller manager  |
| **Worker Nodes (Data Plane)** | Run the actual applications inside containers. These are EC2 instances (or Fargate) where your workloads execute  |

### EKS Architecture Specifics

Amazon EKS runs the Kubernetes control plane across three Availability Zones for high availability and is designed to detect and replace unhealthy control plane nodes automatically . AWS manages the security and availability of the AWS-hosted Kubernetes control plane, so you can focus on your application workloads .

### Essential Kubernetes Objects

| Object | Description |
|--------|-------------|
| **Pod** | The smallest deployable unit in Kubernetes; a collection of related containers providing a service or functionality  |
| **Deployment** | Manages the desired state for Pods and ReplicaSets; ensures a specified number of Pod replicas are running |
| **Service** | Exposes Pods as network services; enables communication between Pods and external traffic  |
| **Namespace** | Virtual clusters within a physical cluster that provide scope for names and divide cluster resources between multiple users/teams  |
| **ConfigMap** | Stores non-confidential configuration data in key-value pairs that Pods can consume  |

### Kubernetes Manifests

Kubernetes uses YAML-formatted configuration files (called manifests) that describe the desired state of the application . These files can specify which containers to run, resource limits, number of Pod replicas, CPU/memory allocation, affinity rules, and more .

---

## 4. Compute Options: EC2 vs. Fargate

EKS supports two primary compute options for running your containerized workloads .

| Feature | EC2 Launch Type | Fargate Launch Type |
|---------|-----------------|---------------------|
| **Management** | You manage worker nodes (EC2 instances) | AWS manages everything—fully serverless |
| **Control** | Full control over instances, custom AMIs, GPU access | No infrastructure access |
| **Billing** | Pay for EC2 instances (per second/hour) | Pay per Pod vCPU and memory resources |
| **Best For** | Large steady workloads, GPU needs, regulatory compliance | Bursty workloads, microservices, event-driven apps |
| **Customization** | Use custom AMIs, launch templates, spot instances | Limited to Fargate platform version capabilities |

### Managed Node Groups

Amazon EKS lets you create, update, scale, and terminate nodes for your cluster with a single command . Managed node groups run Amazon EC2 instances using the latest EKS-optimized or custom AMIs in your AWS account, while updates and terminations drain nodes designed to keep your applications available .

### EC2 Spot Instances with EKS

Managed node groups can leverage Amazon EC2 Spot Instances to reduce costs, ideal for stateless, fault-tolerant applications such as big data, CI/CD, web servers, and test workloads .

### AWS Graviton Processors

EKS supports AWS Graviton-based EC2 instances, providing price-performance benefits for containerized workloads running on ARM architecture .

---

## 5. Step-by-Step: Creating Your First EKS Cluster

### Prerequisites

Before creating an EKS cluster, ensure you have :

- An AWS account with appropriate permissions
- Basic understanding of cloud services and Linux command line
- The following tools installed:
  - **eksctl** - CLI tool to create and manage EKS clusters 
  - **kubectl** - Standard Kubernetes command-line tool for cluster interaction 
  - **Docker** - For building and packaging container images 
- AWS CLI configured with appropriate credentials

### Installing Required Tools

#### Install eksctl

Follow the official eksctl documentation for your operating system. After installation, verify with:
```bash
eksctl version
```

#### Install kubectl

Follow the official Kubernetes documentation for kubectl installation based on your operating system .

### Step 2: Create the EKS Cluster

The simplest way to create an EKS cluster is using eksctl :

```bash
eksctl create cluster --name my-eks-cluster --region us-east-2
```

**What happens automatically :**
- A Kubernetes control plane is provisioned across multiple Availability Zones
- Worker nodes (EC2 instances) are created and registered to the cluster
- Networking resources (VPC, subnets, security groups) are configured
- The `~/.kube/config` file is updated automatically for kubectl access

### Step 3: Verify Cluster Access

Test your connection to the cluster :

```bash
# List nodes in the cluster
kubectl get nodes

# List pods across all namespaces
kubectl get pods --all-namespaces

# List namespaces
kubectl get namespaces
```

If each command returns a list of resources, your connection to the Kubernetes cluster is successful .

### Alternative Creation Methods

| Method | Description |
|--------|-------------|
| **AWS Management Console** | Use the EKS console for guided cluster creation |
| **AWS CLI** | Use `aws eks create-cluster` command |
| **CloudFormation** | Deploy clusters as infrastructure as code |
| **Terraform** | Use AWS EKS Terraform module for IaC deployments  |

---

## 6. Deploying Applications to EKS

### Step 1: Build and Push a Container Image

Before deploying to EKS, you need a container image stored in a registry accessible to your cluster . Amazon ECR (Elastic Container Registry) is the recommended registry for EKS workloads.

```bash
# Build your Docker image
docker build -t my-app .

# Tag the image for ECR
docker tag my-app:latest <account-id>.dkr.ecr.<region>.amazonaws.com/my-app:latest

# Push to ECR
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/my-app:latest
```

### Step 2: Create Kubernetes Manifests

Create a YAML file defining your application's Deployment and Service :

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment
  namespace: default
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app-container
        image: <account-id>.dkr.ecr.<region>.amazonaws.com/my-app:latest
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8080
  selector:
    app: my-app
```

### Step 3: Deploy to EKS

Apply the manifest to your cluster :

```bash
kubectl apply -f deployment.yaml
```

### Step 4: Verify Deployment

```bash
# Check deployment status
kubectl get deployments

# Check pods
kubectl get pods

# Check service and get external IP
kubectl get services
```

### Step 5: Access Your Application

For a Service with `type: LoadBalancer`, AWS automatically provisions an Elastic Load Balancer. Copy the EXTERNAL-IP from `kubectl get services` and paste it into your browser .

---

## 7. Networking in EKS

### VPC Native Networking

Your EKS clusters run in an Amazon VPC, allowing you to use your own VPC security groups and network access control lists (NACLs) . EKS uses the Amazon VPC Container Network Interface (CNI), allowing Kubernetes pods to receive IP addresses directly from the VPC .

### IPv6 Support

Amazon EKS supports IPv6, enabling you to scale containerized applications beyond the limits of private IPv4 address space . Pods are assigned globally routable IPv6 addresses while still communicating with IPv4-based endpoints .

### Load Balancing

Amazon EKS supports multiple load balancing options :

| Load Balancer Type | Use Case |
|-------------------|----------|
| **Application Load Balancer (ALB)** | HTTP/HTTPS traffic, path-based routing, microservices |
| **Network Load Balancer (NLB)** | TCP/UDP/TLS traffic, high-performance, low-latency |
| **Classic Load Balancer (CLB)** | Legacy applications |

### Service Mesh Options

EKS supports multiple service mesh solutions for advanced application networking :

- **AWS App Mesh** - AWS-native service mesh
- **Istio** - Popular open-source service mesh
- **VPC Lattice** - Managed application networking service for cross-cluster connectivity 

### Network Policies

Amazon EKS works with the Project Calico network policy engine to provide fine-grained networking policies for your Kubernetes workloads .

---

## 8. Security and Access Control

### IAM Integration for RBAC

Amazon EKS integrates Kubernetes RBAC (Role-Based Access Control) with AWS IAM . You can assign RBAC roles to each IAM entity, allowing access permission control over your Kubernetes control plane nodes .

### EKS Pod Identity

EKS cluster administrators can obtain IAM credentials required for authenticating Kubernetes applications to access AWS resources. EKS Pod Identity supports the reuse of policies across IAM roles .

### Security Layers

| Layer | Controls |
|-------|----------|
| **Cluster Access** | IAM authentication via `aws-iam-authenticator`  |
| **Pod Permissions** | IAM roles for service accounts (IRSA) |
| **Network Security** | Security groups, network policies, private endpoints |
| **Container Security** | Image signing, vulnerability scanning, admission controllers |

### Container Image Signature Verification

Amazon EKS is compatible with container image signature verification, enabling deployment of only approved container workloads. You can verify images signed by AWS Signer before deploying to your clusters .

### Private Endpoint Configuration

For enhanced security, you can configure EKS clusters with private-only endpoints or hybrid endpoint configurations . This ensures cluster API access remains within your VPC.

---

## 9. Storage Options for EKS

EKS supports multiple storage options for persistent and ephemeral workloads.

### CSI Drivers (Container Storage Interface)

| Storage Service | CSI Driver | Use Case |
|----------------|------------|----------|
| **Amazon EBS** | EBS CSI Driver | Persistent block storage for stateful applications  |
| **Amazon EFS** | EFS CSI Driver | Shared file storage across multiple Pods  |
| **Amazon S3** | S3 CSI Driver (Mountpoint) | Object storage access from containers |

### Storage Classes and Persistent Volumes

Kubernetes StorageClasses define different storage types, and PersistentVolumeClaims (PVCs) request storage resources. EKS supports dynamic provisioning of EBS and EFS volumes.

### Best Practices for Storage

| Practice | Description |
|----------|-------------|
| **Use StatefulSets** | For stateful applications requiring stable storage and network identity |
| **Enable encryption** | Encrypt EBS volumes and EFS data at rest |
| **Regular snapshots** | Use EBS snapshots for backup and disaster recovery |
| **Match IOPS to workload** | Choose appropriate EBS volume types (gp3, io2) for performance needs |

---

## 10. Auto Scaling and High Availability

### Multi-Layer Scaling

EKS supports scaling at multiple levels :

| Scaling Type | Tool | Description |
|--------------|------|-------------|
| **Pod Scaling (Horizontal)** | Horizontal Pod Autoscaler (HPA) | Scales number of Pod replicas based on CPU/memory or custom metrics  |
| **Pod Scaling (Vertical)** | Vertical Pod Autoscaler (VPA) | Adjusts CPU/memory requests for existing Pods |
| **Node Scaling** | Cluster Autoscaler or Karpenter | Adds or removes worker nodes based on pending Pods  |

### Karpenter

Karpenter is an advanced, open-source auto-scaling solution for Kubernetes that provisions right-sized compute capacity in response to changing application load .

### EKS Auto Mode

EKS Auto Mode is designed to automate Kubernetes cluster infrastructure management for compute, storage, and networking on AWS . It simplifies management by:
- Provisioning infrastructure automatically
- Selecting optimal compute instances
- Dynamically scaling resources
- Patching operating systems
- Managing add-ons 

### High Availability Architecture

| Practice | Description |
|----------|-------------|
| **Multi-AZ deployment** | EKS control plane runs across three Availability Zones by default  |
| **Spread Pods across AZs** | Use topology spread constraints or pod anti-affinity |
| **Multiple node groups** | Deploy worker nodes across multiple AZs |
| **Cluster Autoscaler** | Automatically adjust node count based on workload demands |

---

## 11. Monitoring and Observability

### EKS Console (Hosted Kubernetes Console)

EKS provides an integrated console for Kubernetes clusters. Cluster operators and application developers can use EKS as a single place to organize, visualize, and troubleshoot Kubernetes applications .

### Monitoring Tools

| Tool | Purpose |
|------|---------|
| **CloudWatch Container Insights** | Collects metrics and logs from EKS clusters |
| **AWS X-Ray** | Distributed tracing for microservices  |
| **Prometheus + Grafana** | Open-source monitoring and visualization |
| **AWS Distro for OpenTelemetry (ADOT)** | Collects metrics and traces from containerized applications |

### Logging

Container logs can be sent to CloudWatch Logs using the fluent-bit or fluentd DaemonSet. Key logs to monitor:
- Application logs (stdout/stderr from containers)
- Kubernetes system component logs (kubelet, container runtime)
- EKS control plane logs (API server, controller manager, scheduler)

### Metrics to Monitor

| Metric | Importance |
|--------|------------|
| **CPU/Memory utilization (Pod/Node level)** | Detects resource pressure and scaling needs |
| **Pod restart count** | Identifies application instability |
| **API request latency** | Indicates control plane or application issues |
| **Scheduling failures** | Shows capacity or resource constraint problems |

---

## 12. CI/CD and GitOps

### CI/CD Pipeline Integration

EKS integrates with standard CI/CD tools for automated application deployment :

| Tool | Purpose |
|------|---------|
| **AWS CodePipeline + CodeBuild** | AWS-native CI/CD |
| **Jenkins** | Popular open-source automation server |
| **GitHub Actions** | GitHub-native CI/CD |
| **Argo CD** | GitOps continuous delivery tool  |

### GitOps with EKS

EKS Capabilities include managed GitOps through Argo CD, helping enable application deployment and management across multiple clusters . This capability:
- Synchronizes desired application state from Git repositories
- Provides native AWS integrations with IAM Identity Center
- Integrates with AWS Secrets Manager for credential management
- Reduces networking setup required for multi-cluster management 

### Deployment Strategies

| Strategy | Description |
|----------|-------------|
| **Rolling Update** | Gradually replaces old Pods with new ones (default) |
| **Blue/Green** | Runs two versions simultaneously and switches traffic |
| **Canary** | Routes small percentage of traffic to new version first |

---

## 13. Advanced Features and Add-ons

### EKS Add-ons

Amazon EKS offers a curated set of Kubernetes software (add-ons) that provide key operational capabilities .

**AWS-provided add-ons :**
- **CoreDNS** - Cluster DNS capabilities
- **kube-proxy** - Service networking capabilities
- **Amazon VPC CNI** - Pod networking through VPC integration
- **EBS CSI Driver** - Block storage integration
- **ALB Ingress Controller** - Application load balancing

**Third-party add-ons :**
- Independent Software Vendor (ISV) add-ons for observability, service mesh, GitOps, and storage
- Open-source community add-ons directly from the EKS console

### EKS Connector

Amazon EKS helps you connect any conformant Kubernetes cluster to AWS and visualize it in the EKS console . This includes:
- EKS Anywhere clusters running on-premises
- Self-managed clusters on EC2
- Other Kubernetes clusters running outside AWS 

### AWS Controllers for Kubernetes (ACK)

ACK gives you management control over AWS services from within your Kubernetes environment, enabling you to build scalable and available Kubernetes applications utilizing AWS services .

### Kube Resource Orchestrator (KRO)

EKS Capabilities provide managed Kube Resource Orchestrator (KRO) that enables you to define custom Kubernetes APIs using configuration, allowing you to create prescriptive multi-resource configurations that encapsulate organizational standards and best practices .

### EKS Anywhere

EKS Anywhere provides support for registering external instances (on-premises servers or VMs) to your EKS cluster, enabling consistent container management across cloud and on-premises environments .

---

## 14. EKS vs. Self-Managed Kubernetes

| Aspect | Amazon EKS | Self-Managed Kubernetes |
|--------|-----------|------------------------|
| **Control Plane** | Fully managed by AWS across 3 AZs  | You manage all control plane components |
| **Upgrades** | Managed cluster updates with tested versions  | Manual upgrade planning and execution |
| **Hardware** | No infrastructure management | You provision and maintain hardware |
| **Add-ons** | Curated and managed add-ons available  | Self-manage all add-ons and extensions |
| **Cost** | Pay for control plane + worker nodes | Pay for all infrastructure + operational overhead |
| **Expertise Required** | Lower - AWS handles undifferentiated heavy lifting  | Higher - Deep Kubernetes operational expertise needed |
| **Best For** | Production workloads, teams wanting to focus on applications | Teams with specialized requirements or existing Kubernetes expertise |

---

## 15. Best Practices

### Cluster Design

| Practice | Description |
|----------|-------------|
| **Use managed node groups** | Simplifies node lifecycle management  |
| **Deploy across multiple AZs** | Ensures high availability for both control plane and workloads |
| **Right-size node instances** | Match instance types to workload requirements (general purpose, compute-optimized, memory-optimized) |
| **Separate workloads by namespace** | Use namespaces for environment isolation (dev/staging/prod)  |

### Security Best Practices

| Practice | Description |
|----------|-------------|
| **Use IAM roles for service accounts (IRSA)** | Grant Pods least-privilege AWS access |
| **Enable Pod Security Standards** | Enforce security policies at Pod level |
| **Regular image scanning** | Scan container images for vulnerabilities in ECR |
| **Restrict security group rules** | Only allow necessary traffic to cluster endpoints |
| **Use private endpoints** | Configure clusters with private-only API access for production  |

### Operational Best Practices

| Practice | Description |
|----------|-------------|
| **Implement resource requests and limits** | Prevents resource contention and ensures scheduling |
| **Use readiness and liveness probes** | Ensures traffic only goes to healthy Pods |
| **Enable Cluster Autoscaler or Karpenter** | Automatically scales node capacity  |
| **Centralize logging** | Send all container logs to CloudWatch Logs |
| **Backup etcd (self-managed)** | For self-managed clusters, backup etcd regularly |

### Cost Optimization

| Practice | Description |
|----------|-------------|
| **Use EC2 Spot Instances** | For fault-tolerant, stateless workloads  |
| **Right-size node instances** | Avoid over-provisioning worker nodes |
| **Use Fargate for bursty workloads** | Pay only for Pod resources when running |
| **Delete unused resources** | Clean up old Pods, Services, and PersistentVolumeClaims |

---

## 16. EKS Glossary

This glossary includes key terms directly related to Amazon EKS and Kubernetes.

---

### A

**Add-on**
Curated Kubernetes software providing operational capabilities for EKS clusters. Includes both AWS-provided add-ons (CoreDNS, VPC CNI) and third-party add-ons from ISVs and open-source community .

**Amazon ECR (Elastic Container Registry)**
Fully managed container registry used to store, manage, and deploy container images. EKS tasks pull images from ECR to run.

**Amazon EKS (Elastic Kubernetes Service)**
AWS managed Kubernetes service that runs Kubernetes control planes across multiple Availability Zones, eliminating the need to install, operate, and maintain your own control plane .

**AWS Controllers for Kubernetes (ACK)**
Enables management control over AWS services from within your Kubernetes environment using native Kubernetes APIs .

**aws-iam-authenticator**
Authenticates EC2 instances or users to access EKS with appropriate AWS credentials; these credentials can have policies applied that grant or deny access and functionality .

**AWS CLI**
Command line tool used to interact with AWS services, including EKS commands like `aws eks --args` .

---

### C

**Cluster**
One or more containers running on one or more EC2 instances, managed as a unified Kubernetes environment .

**Cluster Autoscaler**
Kubernetes tool that automatically adjusts the number of nodes in your cluster based on pending Pods and node utilization .

**ConfigMap**
Kubernetes API object used to store non-confidential configuration data in key-value pairs. Pods can consume ConfigMaps as environment variables, command-line arguments, or configuration files .

**Container**
Virtualized operating system, service, or combination of both; the unit of deployment in Kubernetes that runs inside Pods .

**Container Runtime**
Software that runs containers on Kubernetes nodes (e.g., containerd, CRI-O) .

**Control Plane**
The master node(s) of a Kubernetes cluster responsible for managing overall cluster state. Includes API server, etcd database, scheduler, and controller manager .

---

### D

**Deployment**
Kubernetes object that manages the desired state for Pods and ReplicaSets, including rolling updates and rollbacks.

---

### E

**EC2 Instance**
Virtual server in AWS that serves as a worker node in EKS clusters. Instances are loaded with AMIs and provide compute capacity for containers .

**EKS Anywhere**
Deployment option for running EKS on-premises, providing consistent Kubernetes management across cloud and local infrastructure .

**EKS Auto Mode**
EKS capability that automates cluster infrastructure management for compute, storage, and networking .

**EKS Connector**
Enables connecting any conformant Kubernetes cluster (on-premises, self-managed, or other clouds) to AWS for visualization in EKS console .

**eksctl**
Command line tool specifically for creating and managing Kubernetes clusters on EKS .

**Event**
Report of a state change somewhere in the Kubernetes cluster; helps with debugging and monitoring .

---

### F

**Fargate**
Serverless compute engine for containers; with Fargate launch type, AWS manages all infrastructure, and you pay per Pod vCPU and memory .

---

### G

**GitOps**
Operational framework that uses Git repositories as the single source of truth for declarative infrastructure and application configuration. EKS Capabilities include managed GitOps through Argo CD .

**Graviton**
AWS family of ARM-based processors offering price-performance benefits for containerized workloads on EKS .

---

### H

**Horizontal Pod Autoscaler (HPA)**
Kubernetes controller that automatically scales the number of Pod replicas based on observed CPU utilization or custom metrics .

---

### I

**IAM (Identity and Access Management)**
AWS identity management service used to control access to EKS clusters through integration with Kubernetes RBAC .

---

### K

**Karpenter**
Open-source, flexible Kubernetes cluster autoscaler that provisions right-sized compute capacity in response to changing application load .

**kubeconfig**
Configuration file used to access a Kubernetes cluster. Default location is `~/.kube/config` .

**kubectl**
Command line interface for running commands against Kubernetes clusters; the standard tool for interacting with EKS clusters .

**Kubernetes (K8s)**
Open-source container orchestration system for automating deployment, scaling, and management of containerized applications .

**Kubeflow**
Tool for making machine learning workflow deployments on Kubernetes simple, portable, and scalable .

---

### M

**Manifest**
YAML-formatted file containing metadata and desired state for Kubernetes resources (Deployments, Services, etc.) .

**Managed Node Group**
EKS feature that lets you create, update, scale, and terminate nodes with a single command; runs EC2 instances using EKS-optimized or custom AMIs .

---

### N

**Namespace**
Virtual cluster within a physical Kubernetes cluster that provides scope for names; divides cluster resources between multiple users or teams .

**Nitro System**
AWS combination of dedicated hardware and lightweight hypervisor that provides underlying security and performance for EKS infrastructure .

**Node**
Worker machine in a Kubernetes cluster that runs containerized applications. Can be EC2 instances (EC2 launch type) or Fargate resources .

---

### P

**Pod**
Smallest deployable unit in Kubernetes; a collection of related containers providing a service or functionality .

**Pod Identity**
EKS feature providing workflow for obtaining IAM credentials required for authenticating Kubernetes applications to access AWS resources .

---

### S

**Service**
Kubernetes object that exposes Pods as network services; enables stable IP addresses and load balancing for dynamic Pod sets .

**Service Mesh**
Infrastructure layer for managing service-to-service communication. EKS supports AWS App Mesh, Istio, and VPC Lattice .

**Spot Instance**
EC2 capacity available at discount prices; EKS managed node groups can leverage Spot Instances for cost savings on fault-tolerant workloads .

---

### V

**VPC (Virtual Private Cloud)**
Isolated network environment where EKS clusters run; supports native VPC security groups, NACLs, and networking policies .

**VPC CNI (Container Network Interface)**
EKS networking component that assigns VPC IP addresses to Kubernetes Pods, enabling native VPC integration .

**VPC Lattice**
Managed application networking service for connecting, securing, and monitoring services across accounts and VPCs; integrates with EKS through Gateway API Controller .

---

## Summary

Amazon EKS provides a managed Kubernetes experience that simplifies running containerized applications at scale on AWS. With its fully managed control plane, multiple compute options (EC2 and Fargate), deep AWS integration, and Kubernetes conformance, EKS enables teams to focus on application development rather than infrastructure management .

**Key takeaways:**
- **EKS manages the control plane** - AWS handles Kubernetes masters across three Availability Zones
- **Choose compute wisely** - EC2 launch type for control and cost optimization; Fargate for serverless simplicity 
- **Use eksctl for simplicity** - The easiest way to create and manage production-grade clusters 
- **Implement GitOps** - Use Argo CD or similar tools for declarative application management 
- **Auto scale at all levels** - HPA for Pods, Cluster Autoscaler/Karpenter for nodes 
- **Secure with IAM + RBAC** - Leverage IAM authentication integrated with Kubernetes RBAC 
- **Monitor comprehensively** - Use CloudWatch Container Insights, Prometheus, and AWS X-Ray
- **EKS vs. self-managed** - Choose EKS to offload operational burden and focus on applications 
