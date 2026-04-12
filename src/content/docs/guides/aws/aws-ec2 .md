---
title: EC2
description: Complete Guide to Amazon EC2 (Elastic Compute Cloud)
date: 2026-04-10
---
 
# EC2 (Elastic Compute Cloud)

Amazon Elastic Compute Cloud (Amazon EC2) is a web service that provides secure, resizable compute capacity in the cloud. It allows you to run virtual servers—known as instances—on AWS infrastructure, paying only for the resources you actually use .

This guide covers everything you need to know to get started with EC2, from core concepts to hands-on implementation.


---

## 1. What is Amazon EC2?

Amazon EC2 (Elastic Compute Cloud) presents a true virtual computing environment, allowing you to use web service interfaces to launch instances with a variety of operating systems, load them with your custom application environment, manage your network's access permissions, and run your image using scalable computing instances .

**Key characteristics:**
- **IaaS (Infrastructure as a Service)** - AWS manages the underlying hardware; you manage the operating system, applications, and configurations 
- **Elastic** - Scale capacity up or down as computing requirements change
- **Fully controlled** - Complete root access to your instances
- **Flexible** - Choose from over 750 instance types and various operating systems 
- **Pay-as-you-go** - Pay only for the compute time you consume 

---

## 2. Core Concepts

Before launching your first instance, understanding these fundamental components is essential. The following diagram illustrates how these components work together :

| Component | Description |
|-----------|-------------|
| **AMI (Amazon Machine Image)** | A template containing the software configuration (operating system, application server, applications) required to launch an instance  |
| **Instance Type** | Defines the hardware specifications including CPU, memory, storage, and networking capacity  |
| **Key Pair** | A set of security credentials (public key stored on the instance, private key on your computer) used to prove identity when connecting  |
| **VPC (Virtual Private Cloud)** | A virtual network dedicated to your AWS account where you launch your instances  |
| **Subnet** | A segment of the IP address range of a VPC that EC2 instances can be attached to  |
| **Security Group** | Acts as a virtual firewall to control inbound and outbound traffic to your instances  |
| **EBS Volume** | Persistent block storage volume for use with EC2 instances  |

---

## 3. EC2 Instance Types and Families

EC2 instances are grouped into families optimized for different workloads. Each family contains multiple instance sizes (e.g., micro, large, xlarge) .

### Instance Family Categories

| Family | Purpose | Example Types | Best For |
|--------|---------|---------------|----------|
| **General Purpose** | Balanced CPU, memory, and networking | A1, T4g, T3, T2, M4, M5 | Web servers, development environments, small databases  |
| **Compute Optimized** | High-performance processors | C4, C5, C5a, C6g | Batch processing, ad serving, gaming servers  |
| **Memory Optimized** | Large memory footprints | R4, R5, R5a, R6g, X1, Z1D | In-memory databases, real-time analytics  |
| **Storage Optimized** | High sequential I/O | I3, I3en, D2, H1 | NoSQL databases, data warehousing, Hadoop  |
| **Accelerated Computing** | Hardware accelerators (GPUs) | P2, P3, G3, F1 | Machine learning, graphics rendering, HPC  |

### Understanding Instance Naming

Instance names follow a pattern: **Family Generation Size**

Example: **t3.micro**
- **t3** = T family, 3rd generation
- **micro** = Size (smallest)

### Free Tier Eligible Instances
For new AWS accounts, the **t2.micro** or **t3.micro** instance type is typically free tier eligible, offering 750 hours per month of compute time .

---

## 4. Step-by-Step: Launching Your First Instance

### Prerequisites
- An AWS account (sign up at aws.amazon.com)
- AWS Management Console access

### Step 1: Log in to AWS Management Console
Navigate to the EC2 dashboard at https://console.aws.amazon.com/ec2/ 

### Step 2: Begin Launch Process
From the EC2 console dashboard, in the "Launch instance" pane, choose **Launch instance** 

### Step 3: Name Your Instance
Under **Name and tags**, enter a descriptive name for your instance (e.g., "MyFirstWebServer").

### Step 4: Choose an AMI (Application and OS Images)
- Select **Quick Start** tab
- Choose your operating system (for first instance, recommend **Amazon Linux**)
- Select an AMI marked **Free Tier eligible** 

### Step 5: Choose an Instance Type
Under **Instance type**, select an instance type marked **Free Tier eligible** (e.g., t2.micro or t3.micro) 

### Step 6: Create or Select a Key Pair
Under **Key pair (login)**:
- If you have an existing key pair, select it from the dropdown
- To create a new key pair:
  1. Choose **Create new key pair**
  2. Enter a name (e.g., "my-key-pair")
  3. Choose key pair type (RSA or ED25519)
  4. Choose private key format (.pem for OpenSSH, .ppk for PuTTY)
  5. **Download and save the private key file** - you cannot download it again! 

> ⚠️ **Warning:** If you choose "Proceed without a key pair," you will not be able to connect to your instance using standard methods .

### Step 7: Configure Network Settings
Under **Network settings**:
- Default VPC and subnet are automatically selected
- Auto-assign public IP is enabled by default
- A security group is created with the following rules :

| Connection Type | Rule | Source |
|----------------|------|--------|
| SSH (Linux) | Port 22 | 0.0.0.0/0 |
| RDP (Windows) | Port 3389 | 0.0.0.0/0 |

> ⚠️ **Security Warning:** `0.0.0.0/0` allows traffic from any IP address worldwide. This is acceptable for temporary testing but **unsafe for production**. In production, restrict access to specific IP addresses or ranges .

### Step 8: Configure Storage
Under **Configure storage**:
- A root volume is automatically configured (typically 8-30 GB gp2 or gp3 SSD)
- This is sufficient for testing purposes
- Additional data volumes can be added as needed 

### Step 9: Review and Launch
- Review the summary of your instance configuration
- Click **Launch instance** 

### Step 10: Verify Launch Success
If successful:
- A success notification appears with the instance ID
- Click the instance ID to view the Instances page
- Initial instance state: **pending**
- After start: state changes to **running**
- After status checks pass: instance is ready for connections 

---

## 5. Connecting to Your Instance

The connection method depends on your instance's operating system.

### Connecting to Linux Instances (SSH)

**Prerequisites:** SSH client installed (macOS/Linux includes it; Windows can use OpenSSH or WSL)

**Steps:**
1. Open the EC2 console and navigate to **Instances**
2. Select your instance and click **Connect** 
3. Choose the **SSH client** tab
4. Set permissions for your private key file (Linux/macOS):
   ```bash
   chmod 400 my-key-pair.pem
   ```
5. Copy the example SSH command:
   ```bash
   ssh -i my-key-pair.pem ec2-user@ec2-198-51-100-1.us-east-2.compute.amazonaws.com
   ```
6. Run the command in your terminal
7. If prompted about host authenticity, type **yes** 

**Default usernames by AMI:**
- Amazon Linux: `ec2-user`
- Ubuntu: `ubuntu`
- Debian: `admin`
- Fedora: `fedora`
- RHEL: `ec2-user` or `root`

### Connecting to Windows Instances (RDP)

**Steps:**
1. In the EC2 console, select your Windows instance and click **Connect**
2. Choose the **RDP client** tab
3. Click **Get password** 
4. Upload your private key (.pem) file
5. Click **Decrypt password** - the administrator password appears
6. **Download Remote Desktop File** (.rdp)
7. Open the .rdp file with Remote Desktop Connection
8. Enter the decrypted password when prompted 

**Default Administrator usernames by language:**
- English: `Administrator`
- French: `Administrateur`
- Portuguese: `Administrador`
- Other languages: `Administrator (Other)` 

### Alternative Connection Methods

- **EC2 Instance Connect** - Browser-based SSH connection (available for supported AMIs) 
- **AWS Systems Manager Session Manager** - No need for public IP addresses or bastion hosts
- **Third-party tools** - PuTTY (Windows), MobaXterm, etc.

---

## 6. Managing EC2 Instances

### Instance States

| State | Description |
|-------|-------------|
| **pending** | Instance is preparing to launch - you are not billed |
| **running** | Instance is operational - billing begins |
| **stopping** | Instance is preparing to stop |
| **stopped** | Instance is shut down - you are not billed (EBS storage persists) |
| **terminating** | Instance is preparing for permanent deletion |
| **terminated** | Instance is permanently deleted - cannot be recovered |

### Instance Management Actions

| Action | Effect | Billing Impact |
|--------|--------|----------------|
| **Start** | Boots a stopped instance | Billing resumes when running |
| **Stop** | Shuts down the instance | No billing for instance hours (EBS storage still billed) |
| **Reboot** | Restarts the instance (same host) | Billing continues uninterrupted |
| **Terminate** | Permanently deletes the instance | Billing stops; data deleted |
| **Hibernate** | Saves RAM contents to EBS and stops | No instance billing; EBS storage billed; RAM state preserved  |

### Hibernation Feature
You can hibernate EBS-backed instances to preserve the contents of memory (RAM). This is useful for applications that take a long time to bootstrap and persist state into memory. When you resume the instance, the RAM contents are restored .

### Vertical Scaling (Resizing)
You can change an instance's type to add or remove capacity:
1. Stop the instance
2. Modify instance type (Actions > Instance Settings > Change instance type)
3. Start the instance

---

## 7. Storage Options

### Amazon EBS (Elastic Block Store)

EBS provides persistent block storage volumes for use with EC2 instances .

**Volume Types:**

| Type | Use Case | Performance |
|------|----------|-------------|
| **gp3/gp2 (General Purpose SSD)** | Boot volumes, dev/test | Baseline 3000-16000 IOPS |
| **io1/io2 (Provisioned IOPS SSD)** | Critical business apps | Up to 64,000 IOPS |
| **st1 (Throughput Optimized HDD)** | Big data, data warehouses | Up to 500 MB/s throughput |
| **sc1 (Cold HDD)** | Infrequent access workloads | Lower cost, lower throughput |

**EBS Features:**
- **Snapshots** - Point-in-time backups stored in S3 
- **Encryption** - Encrypt volumes at rest using KMS
- **Elastic Volumes** - Modify volume size, type, or IOPS without downtime

### Instance Store (Ephemeral Storage)

Some instance types include physically attached storage. This storage is **temporary** - data is lost when the instance is stopped or terminated. Ideal for temporary data, caches, and scratch space .

### Comparison: EBS vs. Instance Store

| Feature | EBS | Instance Store |
|---------|-----|----------------|
| Persistence | Survives instance stop/termination | Lost on stop/termination |
| Lifecycle | Independent of instance | Tied to instance |
| Snapshots | Yes | No |
| Encryption | Yes | No |
| Use Case | Persistent data, boot volumes | Temporary data, caches |

---

## 8. Networking and Security

### Virtual Private Cloud (VPC)

A VPC is a logically isolated section of the AWS cloud where you can launch AWS resources in a virtual network that you define .

**Key VPC Components:**
- **Subnets** - Segments of VPC IP address range (public or private)
- **Route Tables** - Rules that control traffic leaving subnets 
- **Internet Gateway (IGW)** - Enables internet access for public subnets 
- **NAT Gateway** - Enables private subnets to access the internet

### Security Groups

Security groups act as virtual firewalls controlling traffic to your instances .

**Characteristics:**
- **Stateful** - Return traffic is automatically allowed
- **Allow rules only** - No deny rules (use NACLs for denies)
- **Instance-level** - Applies to associated instances
- **Evaluates all rules** - All rules are evaluated before allowing traffic

**Common Security Group Rules:**

| Type | Protocol | Port | Source | Purpose |
|------|----------|------|--------|---------|
| SSH | TCP | 22 | Your IP | Linux administration |
| RDP | TCP | 3389 | Your IP | Windows administration |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web server access |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure web access |
| Custom TCP | TCP | 3306 | App Server IP | MySQL database access |

### Network Interfaces (ENI)

An Elastic Network Interface (ENI) is a virtual network interface that you can attach to an instance in a VPC. You can attach multiple ENIs to a single instance .

### Elastic IP Addresses (EIP)

An Elastic IP address is a static, public IPv4 address associated with your account, not a specific instance .

**Use Cases:**
- Mask instance failure by remapping EIP to a replacement instance 
- Maintain consistent IP address for DNS records
- Configure reverse DNS records

> **Note:** You are charged for Elastic IP addresses that are allocated but not associated with a running instance.

---

## 9. Advanced Features

### Auto Scaling

EC2 Auto Scaling helps maintain application availability by automatically adding or removing EC2 instances according to conditions you define .

**Components:**
- **Launch Template** - Configuration for instances to launch
- **Auto Scaling Group** - Defines where and how to launch instances
- **Scaling Policies** - When to scale (e.g., CPU > 70%)
- **Health Checks** - Replace unhealthy instances automatically

### Load Balancing (ELB)

Elastic Load Balancing automatically distributes incoming application traffic across multiple EC2 instances in multiple Availability Zones .

### Bare Metal Instances

Bare metal instances provide direct access to the processor and memory of the underlying server. These are ideal for workloads that require access to hardware feature sets (like Intel VT-x) or applications that need to run in non-virtualized environments for licensing or support requirements. They are built on the Nitro system and offer the same security, reliability, and AWS service integration as virtual instances .

### EC2 Fleet

With a single API call, EC2 Fleet lets you provision compute capacity across instance types, Availability Zones, and purchase models (On-Demand and Spot) to optimize scale, performance, and cost .

### Enhanced Networking

Enhanced Networking provides high packet-per-second (PPS) performance, low network jitter, and low latencies. It uses a new network virtualization stack for higher I/O performance and lower CPU utilization .

### Elastic Fabric Adapter (EFA)

EFA is a network interface for EC2 instances that enables running HPC applications requiring high levels of inter-instance communications at scale. It uses operating system bypass to enhance inter-instance communication performance, critical for scaling HPC applications like computational fluid dynamics, weather modeling, and reservoir simulation .

### GPU Instances

- **P3 instances** - Next-generation general-purpose GPU compute instances for machine learning, HPC, computational finance, seismic analysis, and genomics 
- **GPU Graphics instances** - For 3D visualizations, graphics-intensive remote workstations, 3D rendering, and application streaming 

### Optimized CPU Configurations

The Optimize CPUs feature allows you to specify a custom number of vCPUs when launching new instances (saving on vCPU-based licensing costs) and disable multithreading for workloads that perform well with single-threaded CPUs .

### Amazon Time Sync Service

Provides a highly accurate, reliable time source to EC2 instances using a fleet of redundant satellite-connected and atomic reference clocks. All instances in a VPC can access the service at a universally reachable IP address .

---

## 10. Pricing and Cost Optimization

### Pricing Models

| Model | Description | Best For |
|-------|-------------|----------|
| **On-Demand** | Pay for compute capacity by the hour or second | Short-term workloads, unknown patterns, development |
| **Savings Plans** | Commit to consistent compute usage (1 or 3 years) | Steady-state workloads |
| **Reserved Instances** | Reserve capacity for 1-3 years (up to 72% savings) | Predictable, continuous workloads |
| **Spot Instances** | Bid on spare capacity (up to 90% discount) | Fault-tolerant, flexible workloads  |
| **Dedicated Hosts** | Physical server fully dedicated to you | Compliance, licensing requirements |

### Free Tier Benefits

New AWS customers receive:
- **750 hours/month** of select EC2 instances (t2.micro or t3.micro) for 12 months 
- For accounts created after July 15, 2025: **$200 in credits** for eligible services over 6 months 

### Cost Optimization Strategies

1. **Right-size instances** - Monitor utilization and downsize over-provisioned instances
2. **Use Auto Scaling** - Scale down during low-demand periods
3. **Leverage Spot Instances** - For non-production and fault-tolerant workloads
4. **Purchase Savings Plans** - For steady-state workloads
5. **Stop unused instances** - Development and test instances outside business hours
6. **Delete unattached EBS volumes** - You're billed for provisioned storage even if unused
7. **Use snapshots for backup** - Instead of running idle instances

---

## 11. Best Practices

### Security Best Practices

| Practice | Description |
|----------|-------------|
| **Restrict security group rules** | Allow only necessary IP ranges, not `0.0.0.0/0` for SSH/RDP  |
| **Use IAM roles** | Grant permissions to instances, not long-term credentials  |
| **Enable encryption** | Encrypt EBS volumes and snapshots |
| **Keep instances updated** | Regularly run `sudo apt update && sudo apt upgrade` (Ubuntu) or similar  |
| **Use Systems Manager** | For patch management and compliance |
| **Audit regularly** | Review security groups, IAM roles, and access logs |

### Operational Best Practices

| Practice | Description |
|----------|-------------|
| **Use naming tags** | Apply meaningful tags (Name, Environment, Cost Center) to all resources |
| **Create AMIs** | Capture configured instances as AMIs for replication  |
| **Take snapshots** | Regular EBS snapshots for backup and disaster recovery  |
| **Monitor with CloudWatch** | Track CPU, memory, disk, and network metrics  |
| **Use multiple Availability Zones** | Deploy across AZs for high availability |
| **Implement lifecycle policies** | Automate backup retention and cleanup |

### Reliability Best Practices

| Practice | Description |
|----------|-------------|
| **Use Auto Scaling groups** | Maintain instance availability automatically |
| **Deploy behind load balancers** | Distribute traffic and perform health checks |
| **Design for failure** | Assume instances will fail; architect accordingly |
| **Test recovery procedures** | Regularly practice restoring from backups and AMIs |

### Cost Best Practices

| Practice | Description |
|----------|-------------|
| **Shut down non-production instances** | During off-hours  |
| **Remove idle resources** | Unused EBS volumes, Elastic IPs, snapshots  |
| **Use AWS Budgets** | Set alerts for unexpected spending |
| **Review Trusted Advisor** | Identify cost optimization opportunities |

---

## 12. EC2 Glossary

This glossary includes key terms related to Amazon EC2.

---

### A

**AMI (Amazon Machine Image)**
A template that contains the software configuration (operating system, application server, and applications) required to launch an instance. AMIs can be public (provided by AWS) or private (customized by you) .

**Auto Scaling**
A web service that automatically launches or terminates EC2 instances based on user-defined policies, schedules, and health checks to maintain application availability .

**Availability Zone**
A distinct location within an AWS Region engineered to be isolated from failures in other Availability Zones. AZs provide inexpensive, low-latency network connectivity to other AZs in the same Region .

---

### B

**Bare Metal Instances**
EC2 instances that provide direct access to the processor and memory of the underlying server. Ideal for workloads requiring access to hardware feature sets or non-virtualized environments .

---

### C

**CloudWatch**
AWS monitoring service used to track EC2 metrics including CPU utilization, disk I/O, network traffic, and custom metrics.

---

### D

**Dedicated Host**
A physical server fully dedicated to your use, providing visibility and control over the physical host for compliance and licensing requirements.

---

### E

**EBS (Elastic Block Store)**
Provides persistent block storage volumes for use with EC2 instances. EBS volumes are independent of instance lifecycle and support snapshots and encryption .

**EC2 (Elastic Compute Cloud)**
A web service that provides secure, resizable compute capacity in the cloud. EC2 allows you to run virtual servers on AWS infrastructure .

**EFA (Elastic Fabric Adapter)**
A network interface for EC2 instances that enables HPC applications requiring high levels of inter-instance communications to run at scale. Uses operating system bypass for enhanced performance .

**EIP (Elastic IP Address)**
A static, public IPv4 address associated with your account (not a specific instance). Elastic IPs are designed for dynamic cloud computing, allowing you to mask instance or AZ failures by remapping addresses .

**ENI (Elastic Network Interface)**
A virtual network interface that you can attach to an instance in a VPC. Multiple ENIs can be attached to a single instance .

**Enhanced Networking**
Feature providing high packet-per-second performance, low network jitter, and low latencies using a new network virtualization stack .

---

### F

**Free Tier**
AWS program offering 750 hours/month of select EC2 instances for 12 months for new accounts. For accounts created after July 15, 2025, $200 in credits are provided over 6 months .

---

### G

**General Purpose Instances**
EC2 instance family providing a balance of compute, memory, and networking resources. Suitable for web servers, development environments, and small databases .

**GPU Instances**
EC2 instances equipped with graphics processing units for machine learning, HPC, computational finance, 3D visualizations, and graphics-intensive workloads .

---

### H

**Hibernation**
A feature allowing you to pause an EBS-backed EC2 instance and resume it later. The contents of memory (RAM) are saved to EBS and restored upon resumption .

---

### I

**IaaS (Infrastructure as a Service)**
A cloud computing model where the provider manages underlying infrastructure, while customers manage operating systems, applications, and configurations. EC2 is an IaaS service .

**Instance**
A virtual server running in the AWS cloud. Instances are the core resource of Amazon EC2 .

**Instance Store**
Temporary, physically attached storage for EC2 instances. Data is lost when the instance is stopped or terminated. Ideal for temporary data, caches, and scratch space .

**Instance Type**
A specification defining the hardware characteristics of an instance, including CPU, memory, storage, and networking capacity. Examples: t3.micro, m5.large, c5.xlarge .

**Internet Gateway (IGW)**
A VPC component that connects a network to the internet, enabling public internet access for instances in public subnets .

---

### K

**Key Pair**
A set of security credentials consisting of a public key (stored on the instance) and a private key (stored on your computer). Used to prove identity when connecting to an instance .

---

### N

**Nitro System**
A collection of AWS-built hardware offload and hardware protection components designed to provide high-performance networking and storage resources to EC2 instances. Powers bare metal and virtualized instances .

---

### O

**On-Demand**
EC2 pricing model where you pay for compute capacity by the hour or second with no long-term commitments. Best for short-term, unpredictable workloads.

**Optimize CPUs**
Feature allowing you to specify a custom number of vCPUs when launching instances and disable multithreading for single-threaded workloads. Helps save on vCPU-based licensing costs .

---

### P

**Placement Group**
A logical grouping of instances that influences network performance and fault tolerance. Options include cluster (low latency), spread (isolated hardware), and partition (grouped partitions).

---

### R

**Region**
A geographical area containing multiple Availability Zones. AWS Regions are geographically dispersed and isolated from each other .

**Reserved Instance**
A pricing model where you commit to using a specific instance type in a specific region for 1 or 3 years in exchange for significant discounts (up to 72%).

**Root Volume**
The EBS volume containing the operating system and boot information for an instance. Required for every EC2 instance .

**Route Table**
A set of routing rules that controls the traffic leaving any subnet associated with the route table. Each subnet can be associated with only one route table at a time .

---

### S

**Savings Plans**
A flexible pricing model offering lower prices in exchange for a commitment to consistent compute usage (measured in $/hour) for 1 or 3 years.

**Security Group**
A virtual firewall that controls inbound and outbound traffic for associated instances. Security groups are stateful and support only allow rules .

**Snapshot**
A point-in-time backup of an EBS volume, stored in S3. Snapshots can be used to create new EBS volumes or AMIs .

**Spot Instance**
An EC2 instance that uses spare compute capacity at steep discounts (up to 90% off On-Demand). Can be interrupted by AWS with 2-minute notice. Best for fault-tolerant, flexible workloads .

**Subnet**
A segment of the IP address range of a VPC. EC2 instances are launched within subnets. Subnets can be public (with internet access) or private (without direct internet access) .

---

### T

**Tags**
Key-value pairs used to identify, organize, and track AWS resources including EC2 instances, volumes, and snapshots.

**Terminate**
The action of permanently deleting an EC2 instance. Terminated instances cannot be recovered .

**Time Sync Service**
AWS service providing accurate, reliable time to EC2 instances using redundant satellite-connected and atomic reference clocks .

---

### V

**VPC (Virtual Private Cloud)**
A logically isolated section of the AWS cloud where you can launch AWS resources in a virtual network that you define. Each AWS account comes with a default VPC in each Region .

**Vertical Scaling**
The practice of changing an instance type to add more CPU, memory, or storage capacity (scaling up) or reduce capacity (scaling down). Contrasts with horizontal scaling (adding more instances) .

---

## Summary

Amazon EC2 provides the foundational compute building block for AWS cloud applications. By understanding instance types, storage options, networking, security, and pricing models, you can effectively deploy and manage virtual servers in the cloud.

**Key takeaways:**
- Start with free tier eligible instances (t2.micro or t3.micro) for learning
- Always restrict security group rules to necessary IP ranges
- Use key pairs for secure instance access
- Stop or terminate unused instances to avoid unnecessary charges
- Leverage AMIs and snapshots for backup and replication
- Choose instance families based on your workload requirements
