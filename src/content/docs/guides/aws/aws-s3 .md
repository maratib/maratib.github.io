---
title: S3
description: SQS (Simple Queue Service)
date: 2026-04-12
---
 
 # S3 (Simple Storage Service)

**Simple Storage Service (Amazon S3)** is an **object storage service** that offers industry-leading scalability, data availability, security, and performance . 

Millions of customers of all sizes and industries use S3 to store, manage, analyze, and protect any amount of data for virtually any use case, such as data lakes, cloud-native applications, and mobile apps . 

S3 is designed for 99.999999999% of data durability and 99.99% availability of objects over a given year.



---
## 1. What is Amazon S3?

Amazon S3 is an object storage service that stores data as objects within buckets . It provides a simple web services interface that you can use to store and retrieve any amount of data, at any time, from anywhere on the web . S3 gives any developer access to the same highly scalable, reliable, fast, and inexpensive data storage infrastructure that Amazon uses to run its own global network of websites .

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Industry-Leading Scalability** | Store virtually any amount of data, up to EB scale, with unparalleled performance . S3 is fully elastic, automatically scaling and contracting as you add or remove data. |
| **Unmatched Durability** | Designed for 99.999999999% (11 nines) data durability . Data is redundantly stored across multiple devices and facilities. |
| **High Availability** | Designed for 99.99% availability of objects over a given year, backed by the strongest SLA in the cloud . |
| **Security & Compliance** | Secure by default with automatic encryption, flexible access controls, and compliance with PCI DSS, SOC, HIPAA, and FedRAMP . |
| **Cost-Effective** | Pay-as-you-go pricing with no upfront costs. Choose from multiple storage classes to optimize costs . |
| **Deep AWS Integration** | Seamlessly integrates with Lambda, CloudFront, Athena, EMR, and dozens of other AWS services . |

### What Problem Does S3 Solve?

Before S3, storing and retrieving data on the internet could be complex and expensive . Organizations had to provision their own storage infrastructure, manage hardware failures, plan for capacity, and handle data replication. S3 revolutionized cloud storage by offering a simple, reliable, and affordable object storage solution that eliminates infrastructure management .

---

## 2. Core Concepts: Buckets and Objects

Amazon S3 stores data as objects within buckets . Understanding these two fundamental concepts is essential.

### Buckets

A **bucket** is a container for objects . Think of a bucket as a top-level folder or directory.

| Bucket Characteristic | Description |
|----------------------|-------------|
| **Global Namespace** | Bucket names must be globally unique across all AWS accounts and regions  |
| **Region-Bound** | Once created, a bucket is permanently bound to its AWS region  |
| **Account Limit** | Up to 100 buckets per AWS account by default (soft limit, can be increased) |
| **Naming Rules** | Must follow internet naming conventions—no underscores, no uppercase letters, etc.  |
| **Access URL** | `http://bucket-name.s3.amazonaws.com/object-key` |

### Objects

An **object** is a file and any metadata that describes that file . Objects are the fundamental entities stored in Amazon S3 .

| Object Characteristic | Description |
|----------------------|-------------|
| **Object Key** | A unique identifier within a bucket (like a file path)  |
| **Maximum Size** | Up to 5 TB per object  |
| **Components** | Data (the file content) + Metadata (descriptive information) |
| **Access URL** | `http://bucket-name.s3.amazonaws.com/key-name` |

### Naming Example

If an object with key value `/photos/mygarden.jpg` is stored in bucket `myawsbucket`, it is addressable using the URL:
```
http://myawsbucket.s3.amazonaws.com/photos/mygarden.jpg
```


### Data Organization Hierarchy

```
AWS Account
    └── Bucket 1 (globally unique name)
        ├── Object A (key: "document.pdf")
        ├── Object B (key: "images/photo.jpg")
        └── Object C (key: "images/thumbnail.jpg")
    └── Bucket 2
        └── ...
```

**Important:** Buckets cannot be nested—you cannot create a bucket inside another bucket . However, you can use object key prefixes (like "folder/subfolder/") to create a logical folder structure.

---

## 3. Storage Classes

Amazon S3 offers multiple storage classes, each designed for different access patterns and cost profiles . Choosing the right storage class can significantly impact your costs.

### Storage Class Comparison

| Storage Class | Use Case | Durability | Availability | Minimum Storage Duration | Retrieval Time |
|--------------|----------|------------|--------------|------------------------|-----------------|
| **S3 Standard** | Frequently accessed data | 11 nines | 99.99% | None | Milliseconds |
| **S3 Intelligent-Tiering** | Unknown or changing access patterns | 11 nines | 99.9% | 30 days (auto-tiering) | Milliseconds |
| **S3 Standard-IA** | Infrequently accessed data | 11 nines | 99.9% | 30 days | Milliseconds |
| **S3 One Zone-IA** | Infrequent access, recreatable data | 11 nines (single AZ) | 99.5% | 30 days | Milliseconds |
| **S3 Glacier Instant Retrieval** | Long-lived archive, instant access needed | 11 nines | 99.9% | 90 days | Milliseconds |
| **S3 Glacier Flexible Retrieval** | Long-term archive, minutes to hours retrieval | 11 nines | 99.99% (after restore) | 90 days | Minutes to hours |
| **S3 Glacier Deep Archive** | Long-term retention, accessed 1-2 times/year | 11 nines | 99.99% (after restore) | 180 days | 12 hours |

### Storage Class Details

**S3 Standard :**
- Designed for frequently accessed data
- Stores data across a minimum of three Availability Zones
- Ideal for active data, content distribution, big data analytics

**S3 Intelligent-Tiering :**
- Automatically moves data between four access tiers (frequent, infrequent, archive, deep archive)
- Small monthly monitoring and auto-tiering charge
- No retrieval fees, no minimum storage duration
- Best when access patterns are unknown or changing

**S3 Standard-IA (Infrequent Access) :**
- For long-lived, infrequently accessed data
- Stores data across multiple Availability Zones
- Per-GB retrieval fee applies
- Good for backups, disaster recovery, older media

**S3 One Zone-IA :**
- Lower cost than Standard-IA but stores data in a single AZ
- Not resilient to AZ destruction
- Suitable for recreatable data or secondary backups

**S3 Glacier Instant Retrieval :**
- Archive storage with millisecond retrieval
- Same low-latency and high-throughput performance as S3 Standard
- 90-day minimum storage duration
- Great for medical images, news archives, user-generated content archives

**S3 Glacier Flexible Retrieval :**
- Low-cost archive storage with configurable retrieval times
- Three retrieval options: Expedited (1-5 min), Standard (3-5 hours), Bulk (5-12 hours)
- 90-day minimum storage duration
- Alternative to magnetic tape libraries

**S3 Glacier Deep Archive :**
- Lowest cost storage class
- Retrieval time within 12 hours
- 180-day minimum storage duration
- Perfect for long-term retention, compliance archives, digital preservation

### Storage Class Pricing (us-east-1 approximate) 

| Storage Class | Price per GB-month |
|---------------|---------------------|
| S3 Standard | $0.023 |
| S3 Intelligent-Tiering | $0.023 + monitoring fee |
| S3 Standard-IA | $0.0125 |
| S3 One Zone-IA | $0.01 |
| S3 Glacier Instant Retrieval | $0.004 |
| S3 Glacier Flexible Retrieval | $0.0036 |
| S3 Glacier Deep Archive | $0.00099 |

---

## 4. Step-by-Step: Getting Started with S3

### Prerequisites
- AWS account
- AWS Management Console access

### Step 1: Sign In to AWS Console

1. Navigate to the AWS Management Console
2. Search for **S3** in the services search bar

### Step 2: Create a Bucket

1. Click **Create bucket** 

2. **Bucket name**: Enter a globally unique name
   - Must be unique across all AWS accounts
   - No uppercase letters, no underscores
   - Example: `my-unique-bucket-name-2024`

3. **AWS Region**: Choose the region closest to your users
   - Data never leaves this region unless you transfer it 

4. **Object Ownership**: Select ACLs disabled (recommended)
   - New buckets have Block Public Access enabled by default 

5. **Block Public Access settings**:
   - All four settings are enabled by default
   - Keep enabled unless you specifically need public access

6. **Bucket Versioning**: Choose Enable or Disable
   - Recommended for production to protect against accidental deletions

7. **Tags** (optional): Add key-value pairs for cost tracking

8. **Default encryption**: Enabled by default (SSE-S3) 

9. Click **Create bucket**

### Step 3: Upload an Object

1. Click on your bucket name
2. Click **Upload**
3. Click **Add files** or drag and drop files
4. Configure permissions (keep default for now)
5. Click **Upload**

### Step 4: Download or View an Object

1. Click on the object name
2. Click **Open** to view in browser or **Download** to save locally

### Using AWS CLI

```bash
# List buckets
aws s3 ls

# Create a bucket
aws s3 mb s3://my-unique-bucket-name --region us-east-1

# Upload a file
aws s3 cp local-file.txt s3://my-unique-bucket-name/

# Download a file
aws s3 cp s3://my-unique-bucket-name/local-file.txt downloaded-file.txt

# Sync a directory
aws s3 sync ./local-folder s3://my-unique-bucket-name/folder/

# List objects in bucket
aws s3 ls s3://my-unique-bucket-name/
```

---

## 5. Uploading and Downloading Data

S3 provides multiple methods for uploading and downloading data, from simple console uploads to programmatic access.

### Upload Methods

| Method | Best For | Limitations |
|--------|----------|-------------|
| **Console** | Small files, testing | Manual, not automated |
| **AWS CLI** | Scripted uploads, automation | Single-threaded by default |
| **AWS SDK** | Application integration | Requires development |
| **Multipart Upload** | Large files (100MB+) | Must be implemented in code |
| **S3 Transfer Acceleration** | Long-distance, large files | Additional cost |
| **AWS DataSync** | Large-scale migrations | Requires agent setup |

### Multipart Upload

For objects larger than 100 MB, use multipart upload to improve throughput and recoverability .

```bash
# Initiate multipart upload
aws s3api create-multipart-upload --bucket my-bucket --key large-file.zip

# Upload parts (repeat for each part)
aws s3api upload-part --bucket my-bucket --key large-file.zip --part-number 1 --upload-id <upload-id> --body part1.file

# Complete upload
aws s3api complete-multipart-upload --bucket my-bucket --key large-file.zip --upload-id <upload-id> --multipart-upload file://parts.json
```

### S3 Transfer Acceleration

S3 Transfer Acceleration enables fast, secure, and easy transfers of files over long distances between your client and your S3 bucket . It uses AWS edge locations to accelerate uploads.

```bash
# Enable Transfer Acceleration
aws s3api put-bucket-accelerate-configuration --bucket my-bucket --accelerate-configuration Status=Enabled

# Upload using accelerated endpoint
aws s3 cp large-file.zip s3://my-bucket/ --endpoint-url https://my-bucket.s3-accelerate.amazonaws.com
```

### Using wget for Public Objects

If an object is publicly accessible, you can download it using wget :

```bash
wget https://my-bucket.s3.amazonaws.com/path-to-file
```

---

## 6. Security and Access Control

Data stored in Amazon S3 is secure by default; only bucket and object owners have access to the S3 resources they create . Amazon S3 supports multiple access control mechanisms .

### Encryption Options

As of January 5, 2023, Amazon S3 automatically encrypts all object uploads to all buckets .

| Encryption Type | Description | Key Management |
|----------------|-------------|----------------|
| **SSE-S3** | Base level of encryption with S3-managed keys | AWS manages keys |
| **SSE-KMS** | Server-side encryption with KMS keys | AWS KMS (customer or AWS managed) |
| **DSSE-KMS** | Dual-layer server-side encryption with KMS | AWS KMS with double encryption |
| **SSE-C** | Server-side encryption with customer-provided keys | You manage keys |
| **Client-Side Encryption** | Encrypt data before uploading | You manage all aspects |

### Access Control Mechanisms

Amazon SGS provides four different access control mechanisms :

| Mechanism | Scope | Use Case |
|-----------|-------|----------|
| **IAM Policies** | Users and roles across multiple buckets | Organization-wide access control |
| **Bucket Policies** | All objects in a single bucket | Cross-account access, public access |
| **Access Control Lists (ACLs)** | Individual objects (legacy) | Fine-grained object permissions |
| **Query String Authentication** | Single object, time-limited | Presigned URLs for temporary access |

### S3 Block Public Access

S3 Block Public Access is a set of security controls that ensures S3 buckets and objects do not have public access . All new buckets have Block Public Access enabled by default .

- Can be applied at account level or bucket level
- Overrides all other S3 access permissions
- Enforces a "no public access" policy

### Access Points

S3 Access Points provide named network endpoints with dedicated access policies, making it easier to manage access to shared data sets at scale .

### VPC Endpoints

Use gateway VPC endpoints and interface VPC endpoints to connect to S3 resources from your Amazon VPC and from on-premises .

### Presigned URLs

Generate time-limited URLs to grant temporary access to private objects :

```bash
# Generate presigned URL valid for 1 hour
aws s3 presign s3://my-bucket/private-file.pdf --expires-in 3600
```

---

## 7. Static Website Hosting

S3 can host static websites (HTML, CSS, JavaScript, and media files) with a public URL .

### Steps to Enable Static Website Hosting

1. **Create a bucket** with a name matching your domain (e.g., `www.example.com`)

2. **Upload website files** (index.html, error.html, CSS, JS, images)

3. **Enable static website hosting**:
   - Go to bucket Properties tab
   - Scroll to Static website hosting
   - Click Edit
   - Select Enable
   - Enter index document (e.g., `index.html`)
   - Enter error document (optional)
   - Save changes

4. **Make objects public**:
   - Add a bucket policy allowing public read access

5. **Access your website** at:
   ```
   http://my-bucket.s3-website-us-east-1.amazonaws.com
   ```

### Bucket Policy for Static Website

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

### Combine with CloudFront

For better performance, security, and custom domain support, place CloudFront in front of your S3 static website .

---

## 8. Versioning and Object Lifecycle Management

### Versioning

Versioning allows you to preserve, retrieve, and restore every version of every object stored in your S3 bucket . This helps recover from unintended user actions and application failures.

| Versioning Feature | Description |
|--------------------|-------------|
| **Default behavior** | Requests retrieve the most recently written version |
| **Old versions** | Can be retrieved by specifying a version ID |
| **Storage costs** | Storage rates apply for every version stored |
| **Lifecycle integration** | Automatically control lifetime of multiple versions |

```bash
# Enable versioning
aws s3api put-bucket-versioning --bucket my-bucket --versioning-configuration Status=Enabled

# List object versions
aws s3api list-object-versions --bucket my-bucket

# Delete a specific version
aws s3api delete-object --bucket my-bucket --key my-file.txt --version-id <version-id>
```

### Lifecycle Rules

Lifecycle rules automatically transition or expire objects to minimize costs .

**Common lifecycle patterns:**

| Pattern | Description |
|---------|-------------|
| **Transition to IA** | Move objects to Standard-IA after 30 days |
| **Transition to Glacier** | Move to Glacier Flexible Retrieval after 90 days |
| **Expiration** | Delete objects after 365 days |
| **Delete old versions** | Delete previous versions after 30 days |
| **Abort incomplete uploads** | Clean up failed multipart uploads after 7 days |

### Lifecycle Rule Example (CLI)

```bash
# Create lifecycle configuration JSON
cat > lifecycle.json << EOF
{
  "Rules": [
    {
      "Id": "Move to IA after 30 days, Glacier after 90, delete after 365",
      "Status": "Enabled",
      "Prefix": "",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    }
  ]
}
EOF

# Apply lifecycle rule
aws s3api put-bucket-lifecycle-configuration --bucket my-bucket --lifecycle-configuration file://lifecycle.json
```

---

## 9. Replication

Replication automatically copies objects from one S3 bucket to another .

### Replication Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Cross-Region Replication (CRR)** | Copy objects to bucket in different region | Disaster recovery, compliance, latency reduction |
| **Same-Region Replication (SRR)** | Copy objects within same region | Aggregation of logs, dev/prod data sharing |

### Replication Requirements

- Source and destination buckets must have versioning enabled
- Source bucket owner must have permissions to replicate
- Destination bucket must be in same or different region
- IAM role for S3 replication must be created

```bash
# Enable versioning on both buckets
aws s3api put-bucket-versioning --bucket source-bucket --versioning-configuration Status=Enabled
aws s3api put-bucket-versioning --bucket destination-bucket --versioning-configuration Status=Enabled

# Put replication configuration
aws s3api put-bucket-replication --bucket source-bucket --replication-configuration file://replication.json
```

---

## 10. Data Protection and Backup

S3 offers multiple data protection features .

### S3 Replication (Time-Based)

Replicate data to another bucket in same or different region for disaster recovery.

### S3 Versioning

Protect against accidental deletions and overwrites.

### S3 Object Lock

Prevent object deletion or overwrite for a fixed time or indefinitely. Required for compliance with WORM (Write Once Read Many) regulations.

### AWS Backup

Centrally manage backups across AWS services, including S3.

### S3 Glacier Deep Archive

Lowest-cost storage for long-term retention (7-10 years) . Ideal alternative to magnetic tape libraries.

---

## 11. Performance Optimization

### Request Rate Performance

S3 automatically scales to high request rates. For a prefix in a bucket, your applications can achieve at least 3,500 PUT/COPY/POST/DELETE or 5,500 GET/HEAD requests per second.

### Performance Best Practices

| Practice | Description |
|----------|-------------|
| **Use prefix partitioning** | Distribute keys across many prefixes |
| **Add random prefix** | For high-throughput writes, add hash prefix to keys |
| **Use multipart upload** | For objects >100 MB |
| **Use S3 Transfer Acceleration** | For long-distance uploads |
| **Use byte-range fetches** | Download specific byte ranges from objects |
| **Use S3 Select** | Retrieve subset of data using SQL expressions |

### S3 Select

S3 Select allows applications to retrieve only a subset of data from an object using SQL-like expressions, reducing data transfer and improving performance.

---

## 12. Event Notifications and Integrations

S3 can send event notifications to AWS services when objects are created, modified, or deleted .

### Supported Destinations

| Destination | Use Case |
|-------------|----------|
| **AWS Lambda** | Trigger serverless functions for image processing, data transformation |
| **Amazon SQS** | Decouple processing with queues |
| **Amazon SNS** | Fan out notifications to multiple subscribers |
| **Amazon EventBridge** | Advanced event routing and filtering |

### Event Types

- `s3:ObjectCreated:*` - All object creation events
- `s3:ObjectCreated:Put` - PUT operations
- `s3:ObjectCreated:Post` - POST operations
- `s3:ObjectCreated:Copy` - COPY operations
- `s3:ObjectCreated:CompleteMultipartUpload` - Multipart upload completion
- `s3:ObjectRemoved:*` - All object deletion events
- `s3:ObjectRemoved:Delete` - Delete operations
- `s3:ObjectRestore:*` - Object restore events

### Configure Event Notification (CLI)

```bash
# Add bucket notification configuration
aws s3api put-bucket-notification-configuration \
    --bucket my-bucket \
    --notification-configuration file://notification.json
```

### notification.json Example

```json
{
  "LambdaFunctionConfigurations": [
    {
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:123456789012:function:process-image",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            {
              "Name": "prefix",
              "Value": "images/"
            },
            {
              "Name": "suffix",
              "Value": ".jpg"
            }
          ]
        }
      }
    }
  ]
}
```

---

## 13. Monitoring and Logging

### CloudWatch Metrics

S3 automatically sends metrics to CloudWatch :

| Metric | Description |
|--------|-------------|
| `NumberOfObjects` | Total number of objects in bucket |
| `BucketSizeBytes` | Total size of bucket in bytes |
| `AllRequests` | Total number of requests |
| `GetRequests` | Number of GET requests |
| `PutRequests` | Number of PUT requests |
| `4xxErrors` | Client-side errors |
| `5xxErrors` | Server-side errors |
| `FirstByteLatency` | Time to first byte |

### Enable Request Metrics

```bash
aws s3api put-bucket-metrics-configuration \
    --bucket my-bucket \
    --id "DailyMetrics" \
    --metrics-configuration '{"Id":"DailyMetrics"}'
```

### Server Access Logging

Configure your S3 bucket to create access log records for all requests made against it . These server access logs capture all requests and can be used for auditing purposes.

```bash
# Enable access logging
aws s3api put-bucket-logging \
    --bucket my-bucket \
    --bucket-logging-status file://logging.json
```

### CloudTrail Integration

S3 supports AWS CloudTrail, which records API calls for your account and delivers log files. This helps with security analysis and compliance auditing.

### S3 Inventory

S3 Inventory provides a scheduled report of your objects and their metadata, helping you manage storage, classify data, and audit encryption status .

---

## 14. Data Transfer to S3

AWS provides a portfolio of data transfer services for any data migration project .

### Online Data Transfer

| Service | Best For |
|---------|----------|
| **AWS CLI/SDK** | Programmatic access, small to medium data |
| **AWS DataSync** | Large-scale migrations, up to 10x faster than open-source tools |
| **AWS Storage Gateway** | Hybrid cloud storage, on-premises file shares backed by cloud storage |
| **AWS Transfer Family** | SFTP, FTPS, FTP access to S3 |
| **Amazon Kinesis** | Streaming data from IoT devices |
| **AWS Direct Connect** | Private connectivity between AWS and on-premises |

### Offline Data Transfer (AWS Snow Family)

| Device | Capacity | Use Case |
|--------|----------|----------|
| **AWS Snowcone** | 8 TB | Edge locations, constrained networks |
| **AWS Snowball Edge** | Up to 210 TB | Large data migrations |
| **AWS Snowmobile** | Up to 100 PB | Exabyte-scale migrations |

---

## 15. Pricing and Cost Optimization

### Pricing Components

S3 pricing is based on three main components :

| Component | Description |
|-----------|-------------|
| **Storage** | Per GB-month based on storage class |
| **Requests** | Per 1,000 requests (PUT, GET, LIST, DELETE) |
| **Data Transfer** | Per GB for data transferred out of S3 |

### Free Tier (First 12 Months) 

| Resource | Free Monthly Amount |
|----------|---------------------|
| S3 Standard storage | 5 GB |
| GET requests | 20,000 requests |
| PUT requests | 2,000 requests |

### Request Pricing (us-east-1 approximate) 

| Request Type | Price per 1,000 requests |
|--------------|--------------------------|
| PUT, COPY, POST, LIST | $0.005 |
| GET, SELECT | $0.0004 |
| Lifecycle Transitions | Varies |

### Data Transfer Pricing (us-east-1 approximate) 

| Transfer Type | Price per GB |
|---------------|--------------|
| Inbound to S3 | Free |
| Outbound to internet | $0.09 (lower at volume) |
| Outbound to CloudFront | Free (CloudFront pricing applies) |
| Outbound to EC2 (same region) | Free |

### Cost Optimization Strategies

| Strategy | Description | Potential Savings |
|----------|-------------|-------------------|
| **Use S3 Intelligent-Tiering** | Automatically moves data between tiers | Optimized for unknown patterns |
| **Implement lifecycle rules** | Automatically expire or transition objects | Significant over time |
| **Delete incomplete multipart uploads** | Clean up failed uploads | Avoids hidden storage costs |
| **Use S3 Storage Lens** | Organization-wide visibility into storage | Identify waste |
| **Enable S3 Inventory** | Understand what you're storing | Make informed decisions |
| **Use requester pays** | Charge data consumers for requests | Transfer costs to users |
| **Compress data before upload** | Reduce storage size | Up to 70% storage reduction |

### Cost Calculation Example

**Scenario:** 100,000 uploads/day, 500 KB each, retained for 60 days 

```
Storage (60 days): 3 TB × $0.023/GB = $65.80/month
PUT requests: 3M × $0.005/1K = $15.00/month
GET requests: 3M × $0.0004/1K = $1.20/month
Data transfer out: 1.5 TB × $0.09/GB = $128.75/month
Total: approximately $210.75/month
```

**Cost savings recommendations:**
- Use lifecycle rules to expire old objects
- Add CloudFront for CDN delivery (reduces transfer costs)
- Use S3 Intelligent-Tiering for changing access patterns

---

## 16. Limitations and Best Practices

### Key Limitations

| Limitation | Value | Impact |
|------------|-------|--------|
| **Maximum object size** | 5 TB  | Larger objects must be split |
| **Maximum bucket count** | 100 per account (soft limit) | Request increase for more |
| **Bucket name uniqueness** | Global across all AWS | Choose unique names carefully |
| **Region immutability** | Cannot move bucket between regions | Plan region before creation |
| **Key length** | 1,024 bytes maximum | Very long keys may impact performance |

### Design Best Practices

| Practice | Description |
|----------|-------------|
| **Use unique bucket names** | Recommended across all regions  |
| **Plan region strategy first** | Buckets cannot move between regions  |
| **Use meaningful key names** | Include prefixes for logical organization |
| **Enable versioning for production** | Protects against accidental deletions |
| **Enable default encryption** | Automatically encrypt all new objects  |
| **Use lifecycle rules early** | Prevents cost spiral as data accumulates  |

### Security Best Practices

| Practice | Description |
|----------|-------------|
| **Never use root user for S3 access** | Create IAM users or roles |
| **Keep Block Public Access enabled** | Unless public access is explicitly required  |
| **Use bucket policies over ACLs** | Simpler, more powerful access control |
| **Enable S3 access logging** | Audit all requests |
| **Use presigned URLs for temporary access** | Avoid making objects public |
| **Rotate access keys regularly** | Every 90 days |
| **Enable MFA Delete** | Require MFA to delete versions |

### Operational Best Practices

| Practice | Description |
|----------|-------------|
| **Tag all resources** | Enable cost tracking and management |
| **Set up billing alerts** | Avoid unexpected charges |
| **Monitor with S3 Storage Lens** | Organization-wide visibility |
| **Regularly review bucket contents** | Identify and remove unnecessary data  |
| **Establish tagging conventions early** | Enforce across all applications  |
| **Test disaster recovery procedures** | Regular restore testing |

---

## 17. S3 Glossary

This glossary includes key terms directly related to Amazon S3.

---

### A

**Access Control List (ACL)**
A legacy access control mechanism for S3 buckets and objects. Allows granting read/write permissions to specific AWS accounts or predefined groups. For new buckets, ACLs are automatically disabled, with access managed through bucket policies and IAM .

**Access Point**
A named network endpoint with a dedicated access policy for an S3 bucket. Simplifies managing access to shared datasets at scale .

**Amazon S3**
Simple Storage Service. An object storage service offering industry-leading scalability, data availability, security, and performance. Stores data as objects within buckets .

---

### B

**Block Public Access**
A set of security controls that ensures S3 buckets and objects do not have public access. All new buckets have Block Public Access enabled by default. Overrides other access permissions to enforce a "no public access" policy .

**Bucket**
A container for objects stored in Amazon S3. Buckets are the highest-level organizational unit. Must have a globally unique name and are bound to a specific AWS region .

**Bucket Policy**
A resource-based IAM policy attached to an S3 bucket that defines permissions for the bucket and its objects. Can grant cross-account access, public access, or restrict access based on conditions like IP address .

---

### C

**Cross-Region Replication (CRR)**
Automatic, asynchronous copying of objects from a bucket in one AWS region to a bucket in a different region. Used for disaster recovery, compliance, and latency reduction .

---

### D

**Data Transfer**
The movement of data into or out of S3. Inbound data transfer is free. Outbound transfer to the internet incurs charges per GB, with rates decreasing at higher volumes .

**Durability**
The probability that an object will not be lost over a given year. S3 is designed for 99.999999999% (11 nines) data durability .

---

### E

**Encryption**
S3 automatically encrypts all object uploads as of January 5, 2023. Supports SSE-S3 (S3-managed keys), SSE-KMS (AWS KMS keys), DSSE-KMS (dual-layer), and SSE-C (customer-provided keys) .

**Event Notification**
A mechanism that sends notifications to AWS Lambda, SQS, SNS, or EventBridge when objects are created, modified, or deleted. Enables event-driven architectures .

---

### G

**Glacier**
See **S3 Glacier**.

---

### I

**Intelligent-Tiering**
Storage class that automatically moves data between four access tiers (frequent, infrequent, archive, deep archive) based on changing access patterns. Small monthly monitoring fee but no retrieval charges .

**Inventory**
A scheduled report of objects and their metadata in a bucket. Helps manage storage, classify data, and audit encryption status .

---

### K

**Key (Object Key)**
The unique identifier for an object within a bucket. Serves as the "filename" in the S3 namespace. Example: `images/photo.jpg` .

---

### L

**Lifecycle Rule**
A configuration that automatically transitions objects between storage classes or expires (deletes) objects based on age. Essential for cost optimization .

---

### M

**Multipart Upload**
A feature that allows uploading large objects in multiple parts. Recommended for objects larger than 100 MB. Improves throughput and recoverability .

---

### O

**Object**
A file and any metadata that describes that file. The fundamental entity stored in Amazon S3. Can be up to 5 TB in size .

**Object Key**
See **Key**.

---

### P

**Presigned URL**
A URL that grants temporary access to a private S3 object. Contains authentication information and an expiration time. Generated using AWS CLI or SDK .

**Prefix**
The part of an object key before the final slash. Used to create logical folder structures and improve request performance. Example: `images/2024/` in key `images/2024/photo.jpg`.

---

### R

**Replication**
Automatic copying of objects from one S3 bucket to another. Supports both cross-region replication (CRR) and same-region replication (SRR) .

---

### S

**S3 Glacier**
Archive storage service integrated with S3. Includes three classes: Instant Retrieval (milliseconds), Flexible Retrieval (minutes to hours), and Deep Archive (12 hours) .

**S3 Select**
Feature that allows applications to retrieve only a subset of data from an object using SQL-like expressions. Reduces data transfer and improves performance.

**Same-Region Replication (SRR)**
Automatic copying of objects within the same AWS region. Used for log aggregation, dev/prod data sharing, and compliance .

**Server Access Logging**
Detailed logging of all requests made against a bucket. Records requester, bucket name, request time, action, response status, and error codes .

**Storage Class**
The tier of storage for an object, determining cost, availability, and retrieval time. Options include Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant Retrieval, Glacier Flexible Retrieval, and Glacier Deep Archive .

**Storage Lens**
Organization-wide visibility into S3 storage usage and activity. Provides metrics, trends, and recommendations for cost optimization.

---

### T

**Transfer Acceleration**
Feature that enables fast, secure, and easy transfers of files over long distances using AWS edge locations. Additional cost applies .

---

### V

**Versioning**
Feature that preserves, retrieves, and restores every version of every object stored in a bucket. Protects against accidental deletions and overwrites. Storage rates apply for every version stored .

---

## Summary

Amazon S3 is the foundational storage service of AWS, providing virtually unlimited object storage with industry-leading durability, availability, and scalability. Its flexible storage classes, comprehensive security features, and deep integration with other AWS services make it the right choice for almost any data storage need.

**Key Takeaways:**

- **Buckets contain objects** - Buckets are globally unique containers; objects are files with keys
- **Multiple storage classes** - Choose based on access frequency from Standard (milliseconds) to Deep Archive (12-hour retrieval)
- **Secure by default** - Automatic encryption, Block Public Access enabled by default, fine-grained IAM controls
- **Durability design** - 99.999999999% (11 nines) durability across multiple facilities and Availability Zones
- **Lifecycle management** - Automate transitions and expiration to optimize costs
- **Event-driven** - Trigger Lambda, SQS, SNS on object changes
- **Cost-effective** - Pay-as-you-go with free tier for new users

**Getting Started Recommendations:**
- Start with S3 Standard for active data
- Enable versioning for production buckets
- Implement lifecycle rules early to prevent cost spiral
- Keep Block Public Access enabled unless public access is required
- Use bucket policies and IAM over ACLs
- Tag all resources for cost tracking
- Set up S3 Storage Lens for organization-wide visibility