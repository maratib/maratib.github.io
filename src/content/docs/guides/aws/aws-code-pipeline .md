---
title: CodePipeline
description: What is AWS CodePipeline?
date: 2026-04-10
---
# AWS CodePipeline 
AWS CodePipeline is a fully managed continuous delivery service that automates the build, test, and deploy phases of your release process. This guide will walk you through its core concepts, key features, and step-by-step implementation.

---

## 🚀 What is AWS CodePipeline?

AWS CodePipeline is a fully managed continuous delivery service that helps you automate your release pipelines for fast and reliable application and infrastructure updates . It allows you to model and visualize your software release process, from source code changes to deployment in production.

**Key benefits:**
- **Fully managed** - No servers to maintain or scale
- **Highly configurable** - Short learning curve, especially if familiar with AWS ecosystem 
- **Seamless integrations** - Works with both AWS services (CodeCommit, CodeBuild, CodeDeploy, S3, ECS) and third-party tools (GitHub, Jenkins) 

---

## 🏗️ Core Concepts

### Pipeline
A pipeline defines your release workflow, describing how new code changes progress through your release process. It consists of a series of stages that represent logical divisions in your workflow.

### Stages
Stages are logical groupings of actions in your pipeline. Common stages include:
- **Source** - Retrieves source code from a repository
- **Build** - Compiles code and runs unit tests
- **Test** - Runs automated tests
- **Deploy** - Deploys to target environments
- **Approval** - Manual review step

### Actions
Actions are tasks performed within a stage, such as:
- Building code with AWS CodeBuild
- Deploying to AWS Elastic Beanstalk
- Running a custom Lambda function

### Artifacts
Files created or used by pipeline actions. CodePipeline stores these in an S3 bucket and passes them between stages.

---

## ⚙️ How It Works

Here's the typical flow through a CodePipeline:

1. **Source Stage** - Pipeline detects changes in your source repository (CodeCommit, GitHub, S3, ECR) and pulls the latest code
2. **Build Stage** - Code is compiled and tests are run using AWS CodeBuild, Jenkins, or other build providers 
3. **Test Stage** - Automated tests execute against build artifacts
4. **Deploy Stage** - Successful builds deploy to environments using CodeDeploy, Elastic Beanstalk, ECS, CloudFormation, or S3 
5. **Approval Stage** - Optional manual review before proceeding

**Parallel execution** - CodePipeline can run actions within a stage simultaneously to accelerate your workflow.

---

## 🛠️ Key Features

### AWS Service Integrations
CodePipeline integrates directly with numerous AWS services :

| Service | Role in Pipeline |
|---------|------------------|
| **CodeCommit** | Source code repository |
| **ECR** | Container image source |
| **S3** | Source artifact storage |
| **CodeBuild** | Build and test execution |
| **CodeDeploy** | Deployment automation |
| **Elastic Beanstalk** | Application deployment |
| **ECS/Fargate** | Container deployment |
| **CloudFormation** | Infrastructure as code deployments |
| **Lambda** | Custom pipeline logic |

### Third-Party Integrations
- **GitHub** - Source code retrieval with webhook support 
- **Jenkins** - Build server integration via plugin 

### Custom Actions & Plugins
You can integrate your own systems using the CodePipeline open-source agent, Jenkins plugin, or by registering custom actions .

### Declarative Templates
Define pipeline structure using JSON or YAML documents, making your pipelines version-controllable and repeatable. CloudFormation templates can create complete pipeline setups .

### Access Control
AWS IAM manages who can change or execute your release workflows through IAM users, roles, and SAML-integrated directories .

### Notifications
Create Amazon SNS notifications for pipeline events, including status messages and resource links .

---

## 📋 Step-by-Step Setup Guide

### Prerequisites
- AWS account with appropriate permissions
- Source code in a supported repository
- IAM role for CodePipeline to access resources

### Method 1: Using AWS Management Console

**Step 1: Create a New Pipeline**
1. Navigate to CodePipeline in AWS Console
2. Click "Create pipeline"
3. Provide a pipeline name and create or select a service role

**Step 2: Configure Source Stage**
1. Select source provider (CodeCommit, GitHub, S3, or ECR)
2. For GitHub: Click "Connect to GitHub" and authenticate
3. Select repository and branch 

**Step 3: Configure Build Stage**
Select build provider and specify:
- **AWS CodeBuild** - Choose existing project or create new
- **Jenkins** - Provide provider name, server URL, and project name
- **Other providers** - Solano CI, etc. 

**Step 4: Configure Deployment Stage**
Select deployment provider and specify:
- **AWS CodeDeploy** - Application name and deployment group
- **Elastic Beanstalk** - Application and environment name
- **AWS CloudFormation** - Stack name and template
- **Amazon ECS** - Cluster and service name
- **No deployment** - Pipeline stops after build

**Step 5: Review and Create**
Review configuration and click "Create pipeline"

### Method 2: Using AWS CLI

Basic pipeline creation command:
```bash
aws codepipeline create-pipeline --cli-input-json file://pipeline.json
```

### Method 3: Using CloudFormation

Define pipeline infrastructure as code. Example parameter configuration:
```yaml
Parameters:
  GitHubOwner:
    Type: String
    Default: your-username
  BucketName:
    Type: String
    Description: S3 bucket for artifacts
```

Then deploy the stack:
```bash
aws cloudformation create-stack \
  --stack-name my-codepipeline \
  --template-body file://codepipeline.yml \
  --capabilities CAPABILITY_IAM \
  --parameters ParameterKey=GitHubOwner,ParameterValue=yourusername
```


### Method 4: AWS Secrets Manager for Credentials

For secure GitHub integration, store tokens in Secrets Manager:
```bash
aws secretsmanager create-secret \
  --name GITHUB_TOKEN \
  --secret-string ghp_yourtokenhere
```


---

## 🔗 Integration Examples

### CodeCommit + CodeBuild + CodeDeploy Pipeline

This classic pipeline:
1. Pulls code from CodeCommit repository
2. Builds using CodeBuild with a buildspec.yml file
3. Deploys using CodeDeploy with an appspec.yml file

### GitHub + Jenkins + Elastic Beanstalk Pipeline

Alternative approach:
1. Source from GitHub repository
2. Build with Jenkins server (configured with CodePipeline plugin)
3. Deploy to Elastic Beanstalk environment 

### ECR + ECS/Fargate Pipeline

For containerized applications:
1. Source from ECR repository
2. Build container images (optional)
3. Deploy to ECS/Fargate service

---

## 🔐 Security Best Practices

### IAM Roles and Permissions
- Create dedicated service roles for each pipeline
- Follow least privilege principle when assigning policies
- Use IAM roles rather than long-term access keys

### Credential Management
- Store sensitive information in AWS Secrets Manager
- Never hardcode credentials in pipeline definitions
- Use environment variables for configuration

### Source Control Security
- Limit GitHub token permissions to necessary scopes (repo, workflow)
- Rotate tokens regularly
- Use branch protection rules 

---

## 📊 Monitoring and Management

### Pipeline Visualization
The CodePipeline console provides visual pipeline representation, showing:
- Stage and action status (In progress, Succeeded, Failed)
- Execution timestamps
- Artifact links

### AWS CloudWatch Integration
Monitor pipeline performance and set alarms for:
- Pipeline failures
- Execution duration thresholds
- Approval action delays

### Notifications
Configure SNS notifications for:
- Pipeline state changes
- Stage failures
- Approval action waiting status

### EventBridge Events
CodePipeline emits events to EventBridge for advanced routing and automation.

---

## 💡 Best Practices

### Pipeline Design
1. **Start simple** - Begin with source, build, deploy stages, then add complexity 
2. **Use parallel actions** - Speed up pipelines by running independent actions concurrently
3. **Implement approval gates** - Add manual approval for production deployments
4. **Keep pipelines focused** - One pipeline per application or microservice

### Artifact Management
1. **Use S3 versioning** - Enable on artifact buckets for audit trails
2. **Encrypt artifacts** - Use KMS for sensitive artifacts
3. **Clean up old artifacts** - Implement lifecycle policies

### Testing Strategy
1. **Multiple test stages** - Separate unit, integration, and end-to-end tests
2. **Automated testing** - Use CodeBuild for test execution
3. **Pre-deployment validation** - Test in staging before production

### Infrastructure as Code
1. **Version control pipelines** - Store CloudFormation templates in source control
2. **Parameterize templates** - Make pipelines reusable across environments
3. **Use nested stacks** - For complex pipeline architectures

---

## ⚠️ Limitations and Considerations

When using AWS CodePipeline, be aware of:

- **Deployment strategy flexibility** - Less control compared to dedicated CI/CD tools
- **Service dependencies** - Requires other AWS services for detailed monitoring
- **Potential bottlenecks** - Complex workflows with many stages may slow execution 
- **Approval workflows** - Basic manual approvals only; advanced approval logic requires additional services
- **Third-party integration** - Limited support for tools outside AWS ecosystem
- **Enterprise scaling** - May require additional management for large-scale applications 

---

## 🎯 Getting Started Next Steps

1. **Complete the Simple Pipeline Walkthrough** - Basic introduction to core concepts 
2. **Try the Four Stage Pipeline** - Full software release process setup 
3. **Explore sample CloudFormation templates** - Infrastructure as code approach 
4. **Review product integrations** - Understand available pre-built developer tool integrations 

---

## 📚 Additional Resources

- **AWS CodePipeline Documentation** - Detailed API and user guides
- **Product Integrations Page** - Complete list of pre-built integrations
- **AWS CodePipeline Workshop** - Hands-on learning exercises
- **GitHub Samples** - Example pipeline configurations

---
# AWS CodePipeline Glossary (Focused)

This glossary includes only terms directly related to AWS CodePipeline and its core functionality.

---

## A

**Action**
A task performed within a pipeline stage. Examples include source code retrieval, build execution, test running, and deployment.

**Approval Action**
A manual action that pauses pipeline execution until a user approves or rejects the transition to the next stage.

**Artifact**
A file or set of files produced by or used in pipeline actions. Artifacts are stored in an S3 bucket and passed between stages.

**Artifact Bucket**
An S3 bucket that CodePipeline uses to store artifacts generated during pipeline execution.

---

## C

**Custom Action**
An action type defined by a user to integrate third-party tools or custom systems that are not natively supported by CodePipeline.

---

## E

**Execution**
A single run of a pipeline from start to finish, triggered by a source change or manual start.

**Execution ID**
A unique identifier assigned to each pipeline execution for tracking and debugging purposes.

---

## P

**Pipeline**
The core CodePipeline resource that defines a complete release workflow as a series of stages and actions.

**Pipeline Execution**
See Execution.

---

## S

**Stage**
A logical grouping of actions within a pipeline. Stages run sequentially, but actions within a stage can run in parallel.

**Stage Transition**
The movement from one stage to the next. Transitions can be manually disabled to pause pipeline execution.

**Source Action**
An action that retrieves source code from a repository such as CodeCommit, GitHub, S3, or ECR.

**Source Artifact**
The artifact produced by a source action, typically containing the raw source code.

---

## T

**Transition**
See Stage Transition.

---

## Numeric

**100-Item Limit**
The maximum number of actions allowed in a single pipeline.