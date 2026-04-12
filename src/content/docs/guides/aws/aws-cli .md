---
title: CLI
description: Complete Guide to AWS CLI (Command Line Interface)
date: 2026-04-09
---

# AWS CLI  
The AWS Command Line Interface (AWS CLI) is a unified tool that provides a command-line interface to manage and automate your AWS services. With just one tool to download and configure, you can control multiple AWS services directly from your terminal and automate them through scripts . This guide covers everything from installation to advanced usage and security best practices.

---



## 1. What is the AWS CLI?

The AWS Command Line Interface (AWS CLI) is a unified tool that allows you to interact with AWS services from your command-line shell. It enables you to control multiple AWS services and automate them through scripts, directly from your terminal or command prompt .

### Key Capabilities

| Capability | Description |
|------------|-------------|
| **Unified Control** | Single tool to manage all AWS services from the command line |
| **Scriptable** | Automate routine tasks using shell scripts |
| **Fast Iteration** | Execute commands without leaving your terminal |
| **Cross-Platform** | Works on Windows, macOS, and Linux |
| **Service Coverage** | Supports all AWS public services |

### AWS CLI Version 2

The current major version is AWS CLI version 2. Version 1 is approaching end-of-support, making version 2 the recommended choice for all users. Version 2 includes:

- Improved installer and automatic updates
- New features like AWS SSO integration and interactive CLI
- Better output formatting options (JSON, YAML, text, table)
- Enhanced performance and reliability 

---

## 2. Why Use the AWS CLI?

While the AWS Management Console provides a graphical interface for managing resources, the AWS CLI offers distinct advantages:

| Feature | AWS Console | AWS CLI |
|---------|-------------|---------|
| **Speed** | Point-and-click navigation | Instant command execution |
| **Repetition** | Manual steps each time | Scriptable and repeatable |
| **Automation** | Limited to manual actions | Full automation via scripts |
| **Multi-Resource** | Tedious for many resources | Bulk operations with simple commands |
| **Version Control** | Cannot version console actions | CLI commands can be stored in Git |
| **CI/CD Integration** | Not applicable | Seamless integration with pipelines |

**Use AWS CLI when you need to:**
- Automate routine tasks (backups, deployments, cleanup)
- Perform bulk operations across many resources
- Integrate AWS management into CI/CD pipelines
- Work in environments without a GUI (servers, containers)
- Execute complex queries and filter results programmatically

---

## 3. Installation Guide

### System Requirements

- **Network Access**: Outbound HTTPS connections on TCP port 443 are required 
- **Python**: Version 2 installed for some legacy features (version 2 is self-contained)

### Installing on macOS

**Using Homebrew (recommended):**
```bash
brew install awscli
```

**Using the macOS installer:**
1. Download the macOS pkg installer from AWS
2. Double-click the downloaded file and follow instructions

### Installing on Windows

**Using the MSI installer (recommended):**
1. Download the AWS CLI MSI installer for Windows
2. Run the downloaded installer
3. Follow the setup wizard instructions

**Using Chocolatey:**
```bash
choco install awscli
```

### Installing on Linux

**Using the bundled installer (recommended for all Linux distributions):**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Verifying Installation:**
```bash
aws --version
# Example output: aws-cli/2.15.0 Python/3.11.6 Linux/5.10.0 source/x86_64
```

---

## 4. Configuration and Setup

After installation, you must configure the AWS CLI with your credentials and default settings .

### Step 1: Obtain Access Keys

1. Sign in to the AWS Management Console
2. Navigate to **IAM** > **Users** > **Your User** > **Security credentials**
3. Click **Create access key**
4. Save both the **Access Key ID** and **Secret Access Key** securely

### Step 2: Run the Configuration Command

```bash
aws configure
```

You will be prompted for:
- **AWS Access Key ID**: Your access key from Step 1
- **AWS Secret Access Key**: Your secret key from Step 1
- **Default region name**: e.g., `us-east-1`, `us-west-2`, `eu-west-1`
- **Default output format**: `json`, `text`, `table`, or `yaml`

### Step 3: Verify Configuration

```bash
aws sts get-caller-identity
```

Expected output:
```json
{
    "UserId": "AIDA1234567890EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

### Configuration Files

The AWS CLI stores configuration in two files:

| File | Location | Contents |
|------|----------|----------|
| **Credentials file** | `~/.aws/credentials` (Linux/macOS) or `%USERPROFILE%\.aws\credentials` (Windows) | Access keys and secret keys |
| **Config file** | `~/.aws/config` (Linux/macOS) or `%USERPROFILE%\.aws\config` (Windows) | Region, output format, and profile settings |

**Example credentials file:**
```ini
[default]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**Example config file:**
```ini
[default]
region = us-east-1
output = json
```

---

## 5. Command Structure and Syntax

### Basic Command Pattern

All AWS CLI commands follow this general structure:

```bash
aws <service> <operation> [arguments] [options]
```

| Component | Description | Example |
|-----------|-------------|---------|
| `aws` | The CLI executable | `aws` |
| `<service>` | The AWS service (e.g., `ec2`, `s3`, `iam`) | `ec2` |
| `<operation>` | The API action (e.g., `describe-instances`, `create-bucket`) | `describe-instances` |
| `[arguments]` | Service-specific parameters | `--instance-ids i-12345678` |
| `[options]` | Global CLI options | `--region us-west-2` |

### Command Examples

**List EC2 instances:**
```bash
aws ec2 describe-instances
```

**Create an S3 bucket:**
```bash
aws s3 mb s3://my-new-bucket --region us-east-1
```

**Describe an IAM user:**
```bash
aws iam get-user --user-name my-username
```

### Global Options

Global options apply to any AWS CLI command :

| Option | Description | Example |
|--------|-------------|---------|
| `--region` | AWS region to use | `--region us-west-2` |
| `--output` | Output format (json, text, table, yaml) | `--output table` |
| `--profile` | Named profile to use | `--profile production` |
| `--query` | JMESPath query for filtering output | `--query "Reservations[].Instances[].InstanceId"` |
| `--debug` | Enable debug logging | `--debug` |
| `--no-paginate` | Disable automatic pagination | `--no-paginate` |
| `--cli-read-timeout` | Socket read timeout in seconds | `--cli-read-timeout 120` |

---

## 6. Essential Commands by Service

### EC2 (Elastic Compute Cloud)

| Operation | Command |
|-----------|---------|
| List instances | `aws ec2 describe-instances` |
| Start an instance | `aws ec2 start-instances --instance-ids i-1234567890abcdef0` |
| Stop an instance | `aws ec2 stop-instances --instance-ids i-1234567890abcdef0` |
| Terminate an instance | `aws ec2 terminate-instances --instance-ids i-1234567890abcdef0` |
| List AMIs | `aws ec2 describe-images --owners amazon` |
| Create security group | `aws ec2 create-security-group --group-name my-sg --description "My security group"` |

### S3 (Simple Storage Service)

| Operation | Command |
|-----------|---------|
| List buckets | `aws s3 ls` |
| Create bucket | `aws s3 mb s3://my-bucket-name` |
| Upload file | `aws s3 cp localfile.txt s3://my-bucket/` |
| Download file | `aws s3 cp s3://my-bucket/file.txt .` |
| Sync directory | `aws s3 sync ./local-folder s3://my-bucket/folder/` |
| Remove bucket | `aws s3 rb s3://my-bucket-name --force` |

### IAM (Identity and Access Management)

| Operation | Command |
|-----------|---------|
| List users | `aws iam list-users` |
| Get current user | `aws sts get-caller-identity` |
| Create user | `aws iam create-user --user-name newuser` |
| List roles | `aws iam list-roles` |
| Attach policy to user | `aws iam attach-user-policy --user-name username --policy-arn arn:aws:iam::aws:policy/AdministratorAccess` |

### CloudWatch

| Operation | Command |
|-----------|---------|
| List metrics | `aws cloudwatch list-metrics --namespace AWS/EC2` |
| Get metric statistics | `aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization --period 3600 --statistics Average --start-time 2024-01-01T00:00:00Z --end-time 2024-01-02T00:00:00Z` |
| Put custom metric | `aws cloudwatch put-metric-data --namespace MyApp --metric-name PageViews --value 100 --timestamp $(date -u +"%Y-%m-%dT%H:%M:%SZ")` |

### Lambda

| Operation | Command |
|-----------|---------|
| List functions | `aws lambda list-functions` |
| Invoke function | `aws lambda invoke --function-name my-function output.json` |
| Get function configuration | `aws lambda get-function-configuration --function-name my-function` |
| Update function code | `aws lambda update-function-code --function-name my-function --zip-file fileb://function.zip` |

---

## 7. Output Formatting and Filtering

The AWS CLI supports multiple output formats and powerful filtering capabilities to help you extract exactly the data you need .

### Output Formats

**JSON (default):**
```bash
aws ec2 describe-instances --output json
```

**Text (tab-separated values):**
```bash
aws ec2 describe-instances --output text
```

**Table (human-readable):**
```bash
aws ec2 describe-instances --output table
```

**YAML:**
```bash
aws ec2 describe-instances --output yaml
```

### Querying with JMESPath

The `--query` parameter uses JMESPath, a JSON query language, to filter and reshape output .

**Get only instance IDs:**
```bash
aws ec2 describe-instances --query "Reservations[].Instances[].InstanceId"
```

**Get instance IDs and states:**
```bash
aws ec2 describe-instances --query "Reservations[].Instances[].[InstanceId,State.Name]"
```

**Filter by tag value:**
```bash
aws ec2 describe-instances --query "Reservations[].Instances[?Tags[?Key=='Environment' && Value=='Production']]"
```

**Get specific fields with names:**
```bash
aws ec2 describe-instances --query "Reservations[].Instances[].[InstanceId,State.Name,InstanceType]" --output table
```

### Filtering with --filters

Many services support server-side filtering with the `--filters` parameter :

```bash
# Filter EC2 instances by state
aws ec2 describe-instances --filters Name=instance-state-name,Values=running,stopped

# Filter by tag
aws ec2 describe-instances --filters Name=tag:Environment,Values=Production

# Filter S3 objects by prefix
aws s3api list-objects --bucket my-bucket --prefix "logs/2024/"
```

### Pagination

For commands that return large result sets, the AWS CLI automatically paginates results by making multiple API calls .

**Control pagination:**
```bash
# Limit to 10 items per page
aws ec2 describe-instances --max-items 10

# Get next page using token
aws ec2 describe-instances --max-items 10 --starting-token <next-token>

# Disable automatic pagination (single API call only)
aws ec2 describe-instances --no-paginate
```

---

## 8. Working with Named Profiles

Named profiles allow you to manage multiple AWS accounts or configurations from a single CLI installation .

### Creating a Named Profile

```bash
aws configure --profile dev-account
```

You will be prompted for:
- Access key ID for the dev account
- Secret access key for the dev account
- Default region (e.g., `us-east-1`)
- Default output format

### Using Named Profiles

```bash
# Use the dev profile
aws s3 ls --profile dev-account

# Use the production profile
aws ec2 describe-instances --profile production

# Combine profile with other options
aws s3 cp file.txt s3://bucket/ --profile staging --region eu-west-1
```

### Profile Best Practices

| Practice | Why |
|----------|-----|
| Use descriptive profile names | `dev`, `prod`, `staging`, `personal` |
| Never use default for production | Prevents accidental destructive commands |
| Use profiles in scripts | Makes scripts reusable across environments |
| Store profiles in config file | Separate credentials (credentials file) from settings (config file) |

**Example config file with profiles:**
```ini
[default]
region = us-east-1
output = json

[profile dev]
region = us-west-2
output = table

[profile production]
region = us-east-1
output = json
```

---

## 9. Security and Access Control

### IAM Roles vs. Access Keys

Access keys are long-lived credentials that pose a security risk if compromised. IAM roles with short-lived credentials are preferred for production .

**Best practices for credentials :**

| Practice | Description |
|----------|-------------|
| **Use IAM roles** | Instead of embedding long-lived access keys |
| **Rotate keys regularly** | Every 90 days or less; delete unused keys immediately |
| **Use named profiles** | Separate credentials for different environments |
| **Never share credentials** | Each user gets their own access keys |
| **Enable MFA** | For sensitive operations |

### Enforcing MFA for Sensitive Commands

For operations that affect production resources, require MFA authentication :

```bash
# Get session token with MFA
aws sts get-session-token --serial-number arn:aws:iam::123456789012:mfa/username --token-code 123456

# Use the temporary credentials
export AWS_ACCESS_KEY_ID=<temporary-access-key>
export AWS_SECRET_ACCESS_KEY=<temporary-secret>
export AWS_SESSION_TOKEN=<session-token>
```

### Auditing with the CLI

Use CLI commands to audit permissions and identify permission creep :

```bash
# Check current user's permissions
aws iam list-attached-user-policies --user-name myusername
aws iam list-user-policies --user-name myusername

# See what actions are allowed
aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::123456789012:user/myusername --action-names ec2:DescribeInstances s3:ListBucket
```

### CI/CD Integration Security

For CI/CD pipelines, assign task-specific roles rather than admin-level keys. This limits the blast radius if the automation environment is compromised .

---

## 10. Scripting and Automation

### Basic Bash Script Example

```bash
#!/bin/bash
# Script to backup all EC2 instances by creating AMIs

# Set variables
BACKUP_DATE=$(date +%Y%m%d)
REGION="us-east-1"

# Get all instance IDs
INSTANCE_IDS=$(aws ec2 describe-instances \
    --region $REGION \
    --query "Reservations[].Instances[?State.Name=='running'].InstanceId" \
    --output text)

# Create AMI for each instance
for INSTANCE_ID in $INSTANCE_IDS; do
    AMI_NAME="backup-$INSTANCE_ID-$BACKUP_DATE"
    echo "Creating AMI $AMI_NAME from instance $INSTANCE_ID"
    
    aws ec2 create-image \
        --instance-id $INSTANCE_ID \
        --name $AMI_NAME \
        --description "Automated backup created on $BACKUP_DATE"
done

echo "Backup complete"
```

### Python Script with Boto3

While the CLI is great for one-off commands, Python scripts using Boto3 (AWS SDK for Python) offer more programmatic control:

```python
#!/usr/bin/env python3
import boto3
from datetime import datetime

ec2 = boto3.client('ec2', region_name='us-east-1')

# Get all running instances
response = ec2.describe_instances(
    Filters=[{'Name': 'instance-state-name', 'Values': ['running']}]
)

for reservation in response['Reservations']:
    for instance in reservation['Instances']:
        instance_id = instance['InstanceId']
        ami_name = f"backup-{instance_id}-{datetime.now().strftime('%Y%m%d')}"
        
        print(f"Creating AMI {ami_name}")
        ec2.create_image(
            InstanceId=instance_id,
            Name=ami_name,
            Description="Automated backup"
        )
```

### Using AWS CloudShell

For quick CLI access without local installation, AWS CloudShell provides a browser-based terminal pre-configured with the AWS CLI and your credentials . CloudShell is available directly from the AWS Management Console and includes common development tools.

---

## 11. Advanced Features

### AWS CLI Version 2 Enhancements

**AWS SSO Integration:**
```bash
aws configure sso
# Follow prompts to configure SSO authentication
```

**Interactive CLI (auto-prompt):**
```bash
aws ec2 describe-instances --cli-auto-prompt
```

**YAML output support:**
```bash
aws ec2 describe-instances --output yaml
```

### Using --cli-input-json

For complex API calls, you can provide parameters as a JSON file :

```bash
# Create a JSON file with parameters
cat > params.json << EOF
{
  "ImageId": "ami-12345678",
  "InstanceType": "t2.micro",
  "MinCount": 1,
  "MaxCount": 1
}
EOF

# Run command using JSON input
aws ec2 run-instances --cli-input-json file://params.json
```

### Generating CLI Skeletons

Generate a JSON skeleton to understand required parameters :

```bash
aws ec2 run-instances --generate-cli-skeleton
```

This outputs a template you can fill in and use with `--cli-input-json`.

### JMESPath Advanced Queries

**Get unique values across resources:**
```bash
aws ec2 describe-instances --query "Reservations[].Instances[].InstanceType" --output text | sort | uniq
```

**Join data from multiple sources:**
```bash
# Get instance IDs with their names from tags
aws ec2 describe-instances --query "Reservations[].Instances[].[InstanceId, Tags[?Key=='Name'].Value | [0]]"
```

---

## 12. Troubleshooting Common Issues

### Authentication and Permissions Errors

**Error:** `Unable to locate credentials`

**Solutions:**
- Run `aws configure` to set up credentials
- Check that `~/.aws/credentials` exists and has valid keys
- Set environment variables: `export AWS_ACCESS_KEY_ID=...`

**Error:** `User is not authorized to perform: ec2:DescribeInstances`

**Solutions:**
- Attach appropriate IAM policy to your user/role
- Check that you're using the correct profile
- Verify resource-based policies aren't blocking access

### Network and Connection Issues

**Error:** `Could not connect to the endpoint URL`

**Solutions:**
- Verify outbound HTTPS (port 443) connectivity 
- Check if you need a proxy: `export HTTP_PROXY=http://proxy:8080`
- Verify the region endpoint is correct

### CLI-Specific Issues

**Error:** `Invalid choice: 'service'`

**Solution:** Update the AWS CLI to the latest version:
```bash
# macOS
brew upgrade awscli

# Linux
sudo ./aws/install --update

# Windows - download latest installer
```

**Slow performance or timeouts:**
```bash
# Increase timeout values
aws ec2 describe-instances --cli-read-timeout 120 --cli-connect-timeout 60
```

---

## 13. Best Practices

### Security Best Practices

| Practice | Command/Configuration |
|----------|----------------------|
| Never hardcode credentials | Use `aws configure` or environment variables |
| Rotate keys every 90 days | `aws iam create-access-key` then delete old one |
| Use MFA for sensitive commands | Require `sts get-session-token` first |
| Audit permissions regularly | `aws iam list-attached-user-policies`  |
| Use IAM roles over keys | Use EC2 instance profiles or SSO  |

### Operational Best Practices

| Practice | Example |
|----------|---------|
| Use named profiles | `--profile prod` vs using default |
| Store commands in version control | Commit scripts to Git |
| Test with `--dry-run` first | `aws ec2 run-instances --dry-run` |
| Use `--query` for filtering | Reduces data transfer and processing |
| Enable CloudTrail logging | Audit all CLI actions |

### Scripting Best Practices

| Practice | Why |
|----------|-----|
| Use error handling | `set -e` in bash scripts |
| Log all actions | Write to both console and log file |
| Implement idempotency | Same command can be run multiple times safely |
| Use `--no-cli-pager` in scripts | Prevents scripts from hanging |
| Validate inputs | Check required variables before execution |

### Command Discipline

Access control in AWS CLI is not just about IAM—it's about habits. Profile separation, minimal permissions, regular audits, and session limits all contribute to a secure environment .

**Safe command practices:**
- Always specify a profile for production operations
- Use `--dry-run` before destructive commands
- Review `--query` output before passing to `--cli-input-json`
- Enable `--debug` only when troubleshooting

---

## 14. AWS CLI Glossary

This glossary includes key terms directly related to the AWS Command Line Interface.

---

### A

**Access Key ID**
A unique identifier associated with a secret access key. The combination of access key ID and secret access key is used to cryptographically sign programmatic AWS requests .

**AWS CLI (Command Line Interface)**
A unified tool to manage AWS services from the command line. With one tool to download and configure, you can control multiple AWS services and automate them through scripts .

---

### C

**CLI Auto-Prompt**
Interactive feature in AWS CLI version 2 that guides you through command parameters by prompting for each required and optional input.

**Credentials File**
File located at `~/.aws/credentials` (Linux/macOS) or `%USERPROFILE%\.aws\credentials` (Windows) that stores AWS access keys and secret keys for one or more profiles.

---

### D

**Debug Mode**
CLI option (`--debug`) that outputs detailed information about request/response cycles, including API calls, parameter serialization, and response parsing for troubleshooting.

**Dry Run**
Parameter (`--dry-run`) that checks whether you have the required permissions for an action without actually executing it. Returns `DryRunOperation` if successful, otherwise `UnauthorizedOperation` .

---

### E

**Endpoint URL**
The AWS service endpoint that the CLI communicates with. Can be overridden with `--endpoint-url` for testing with local mock services or connecting to specific regional endpoints.

---

### G

**Global Options**
Command-line options that apply to any AWS CLI command, including `--region`, `--output`, `--profile`, `--query`, and `--debug`.

---

### I

**Interactive CLI**
Feature enabled with `--cli-auto-prompt` that provides an interactive prompt for building AWS CLI commands with tab completion and parameter guidance.

---

### J

**JMESPath**
A JSON query language used with the `--query` parameter to filter and reshape AWS CLI output. Supports nested expressions, wildcards, and functions .

---

### M

**MFA (Multi-Factor Authentication)**
Security feature requiring a time-based one-time password (TOTP) in addition to access keys. Can be enforced for CLI operations using `aws sts get-session-token`.

**Max Items**
Pagination parameter (`--max-items`) that limits the number of results returned in a single API call. Use with `--starting-token` to paginate through large result sets .

---

### N

**Named Profile**
A named configuration within the AWS CLI config file that stores a specific set of credentials, region, and output format. Enables switching between multiple AWS accounts or configurations using `--profile` .

**Next Token**
Pagination token returned when more results are available than were returned in the current response. Used with `--starting-token` to retrieve subsequent pages .

**No Paginate**
Option (`--no-paginate`) that disables automatic pagination, making the CLI perform only a single API call and return only the first page of results .

---

### O

**Output Format**
Specifies how CLI command results are displayed. Supported formats: `json` (default), `text` (tab-separated), `table` (human-readable), and `yaml` (version 2 only).

---

### P

**Page Size**
Parameter (`--page-size`) that controls how many items the AWS CLI requests per API call during pagination. Smaller page sizes reduce memory usage but increase the number of API calls .

**Pagination**
Automatic handling of AWS API pagination where the CLI makes multiple API calls to retrieve all results for commands that return large datasets .

**Profile**
See Named Profile.

---

### Q

**Query**
Parameter (`--query`) that uses JMESPath syntax to filter and reshape command output. Essential for extracting specific data points from JSON responses .

---

### S

**Secret Access Key**
A cryptographic key used in conjunction with the access key ID to sign programmatic AWS requests. Must be kept confidential .

**Session Token**
Temporary credential for limited-privilege API access, obtained through `sts get-session-token` or AWS SSO. Used with access key ID and secret access key for MFA-authenticated sessions .

**Skeleton**
JSON or YAML template generated by `--generate-cli-skeleton` that shows the required parameter structure for a command. Can be filled in and used with `--cli-input-json` .

**Starting Token**
Pagination parameter (`--starting-token`) that specifies where to begin retrieving results, typically using a `NextToken` value from a previous response .

---

## Summary

The AWS CLI is an essential tool for anyone managing AWS resources, whether for simple one-off tasks or complex automation pipelines. By mastering the CLI, you can work faster, more repeatably, and with greater control than the console alone allows.

**Key Takeaways:**

- **Single tool, all services** - Control any AWS service from your terminal
- **Scriptable and automatable** - Integrate AWS management into your workflows
- **Powerful filtering** - Use JMESPath queries to extract exactly the data you need
- **Secure by design** - Use named profiles, IAM roles, and MFA for production access
- **Version 2 is the future** - Migrate from version 1 for better features and support

**Getting Started Recommendations:**
- Install AWS CLI version 2 on your development machine
- Run `aws configure` to set up your default credentials
- Practice with `aws s3 ls` and `aws ec2 describe-instances`
- Create named profiles for different environments
- Learn JMESPath queries to filter output efficiently
- Store your CLI commands and scripts in version control