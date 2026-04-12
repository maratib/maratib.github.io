---
title: IAM
description: AWS IAM Identity Center
date: 2026-04-12
---
 
 # AWS IAM Identity Center

AWS **IAM Identity Center** (formerly AWS Single Sign-On) is a **cloud-based identity and access management service** that simplifies user access management across multiple AWS accounts and business applications . 

It enables you to create or connect workforce identities and manage their access centrally, providing **single sign-on (SSO)** to all assigned accounts and applications from one place .

---



## 1. What is AWS IAM Identity Center?

AWS IAM Identity Center is a cloud-based identity and access management (IAM) service that enables you to centrally manage access to multiple AWS accounts and business applications . It provides a user portal where authorized users can access the AWS accounts and applications they've been granted permission to, using their existing corporate credentials .

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Centralized Access Management** | Manage user access to all AWS accounts and applications from a single location |
| **Single Sign-On (SSO)** | Users sign in once to access all assigned accounts and applications |
| **Multiple Identity Sources** | Use built-in identity store, connect to Active Directory, or integrate with external IdPs (Okta, Azure AD) |
| **Multi-Account Permissions** | Define permission sets once and assign across all accounts in AWS Organizations |
| **Temporary Credentials** | No long-lived access keys—users receive short-lived credentials via role assumption |
| **Audit Ready** | All sign-in and access activity recorded in AWS CloudTrail  |

### What Problem Does It Solve?

In traditional AWS setups, managing access for human users using IAM users creates significant challenges :

| Challenge | Description |
|-----------|-------------|
| **Credential sprawl** | Long-lived access keys stored on laptops or CI systems |
| **Manual user management** | Creating/deleting users across multiple accounts is time-consuming |
| **Delayed access revocation** | When employees leave, access may not be removed promptly |
| **Inconsistent MFA** | Difficulty enforcing multi-factor authentication consistently |
| **Poor audit visibility** | Tracking who accessed what across accounts is complex |

IAM Identity Center solves these problems by federating authentication to your existing identity source while AWS handles authorization through role-based access .

---

## 2. Why IAM Identity Center? Core Value Proposition

### The Traditional IAM User Approach (Not Recommended for Human Users)

```
AWS Account A          AWS Account B          AWS Account C
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ IAM User 1  │       │ IAM User 1  │       │ IAM User 1  │
│ IAM User 2  │       │ IAM User 2  │       │ IAM User 2  │
│ IAM User 3  │       │ IAM User 3  │       │ IAM User 3  │
└─────────────┘       └─────────────┘       └─────────────┘
   Separate credentials, separate MFA, no central management
```

### The IAM Identity Center Approach (Recommended)

```
                    ┌─────────────────────────────────────┐
                    │         IAM Identity Center         │
                    │  (Single control plane for access)  │
                    └─────────────────┬───────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
┌───────────────┐             ┌───────────────┐             ┌───────────────┐
│  AWS Account  │             │  AWS Account  │             │  AWS Account  │
│   (Prod)      │             │   (Staging)   │             │    (Dev)      │
│               │             │               │             │               │
│ Permission    │             │ Permission    │             │ Permission    │
│ Set → Role    │             │ Set → Role    │             │ Set → Role    │
└───────────────┘             └───────────────┘             └───────────────┘
```

### Why This Matters

| Aspect | Traditional IAM Users | IAM Identity Center |
|--------|----------------------|---------------------|
| **User lifecycle** | Manual per account | Centralized, automatic |
| **Credentials** | Long-lived access keys | Temporary, short-lived credentials  |
| **Access revocation** | Manual deletion per account | Disable once—revoked everywhere |
| **Multi-account access** | Switch roles manually | Single sign-on to all accounts |
| **Security best practice** | Not recommended for human users | AWS-recommended approach  |

---

## 3. Core Concepts and Architecture

Understanding these fundamental concepts is essential for working with IAM Identity Center .

### Core Components

| Component | Description |
|-----------|-------------|
| **Identity Source** | Where your user identities are stored (IAM Identity Center directory, Active Directory, external IdP) |
| **Identity Provider (IdP)** | An identity management system such as IAM Identity Center, Microsoft Entra ID (Azure AD), Okta, or your own corporate directory  |
| **AWS Access Portal URL (Start URL)** | Your organization's unique IAM Identity Center URL to access authorized AWS accounts, services, and resources (e.g., `https://your-company.awsapps.com/start`)  |
| **Permission Set** | A collection of IAM policies that defines the permissions for users accessing an AWS account |
| **Assignment** | The association of a user or group with a permission set for a specific AWS account |
| **Session** | The period during which a user is authenticated and authorized to access AWS resources  |

### How IAM Identity Center Works 

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            IAM Identity Center Flow                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. User runs: aws sso login                                                │
│         │                                                                   │
│         ▼                                                                   │
│  2. Browser opens → User authenticates with IdP                            │
│         │                                                                   │
│         ▼                                                                   │
│  3. IAM Identity Center issues refresh token + access token                │
│         │                                                                   │
│         ▼                                                                   │
│  4. SDK/CLI uses access token to request IAM role credentials              │
│         │                                                                   │
│         ▼                                                                   │
│  5. IAM Identity Center returns temporary IAM credentials                  │
│         │                                                                   │
│         ▼                                                                   │
│  6. SDK/CLI makes AWS service calls using temporary credentials            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Session and Token Management 

| Token Type | Description | Lifetime |
|------------|-------------|----------|
| **Access Token** | Used to request IAM role credentials | 1 hour (auto-refreshed) |
| **Refresh Token** | Used to obtain new access tokens | Up to 90 days (configurable) |
| **Permission Set Credentials** | Temporary IAM credentials for AWS service calls | Configurable (1-12 hours) |

---

## 4. Step-by-Step: Enabling IAM Identity Center

### Prerequisites
- AWS account with administrative access
- AWS Management Console access

### Step 1: Navigate to IAM Identity Center

1. Sign in to the **AWS Management Console**
2. In the search bar, type **IAM Identity Center**
3. Click on the service

### Step 2: Enable the Service

If this is your first time using the service:

1. Click **Enable** 
2. Choose your identity source (see next section for options)

**Important Notes:**
- Pay attention to the region selection—once enabled, you cannot directly switch regions 
- If your organization already has a master management region (e.g., `us-east-1` or `ap-northeast-1`), use that region for consistency 

### Step 3: Configure Your Identity Source

You have three options for where your identities live:

| Option | Description | Best For |
|--------|-------------|----------|
| **IAM Identity Center directory** | Built-in identity store | New deployments, no existing IdP |
| **Active Directory** | Connect to AWS Managed AD or on-premises AD via AD Connector | Enterprises already using AD  |
| **External IdP** | Connect to Okta, Azure AD, Ping Identity, etc. via SAML 2.0 | Organizations using third-party IdPs  |

---

## 5. Identity Sources: Where Your Users Live

### Option 1: IAM Identity Center Directory (Built-in)

The simplest option—IAM Identity Center provides a default identity store where you can create users and groups directly.

**Creating a user :**
1. Go to **Users** in the IAM Identity Center console
2. Click **Add user**
3. Enter username, email, first name, last name, display name
4. Choose how the user receives their password (email or generate)
5. Click **Next** and complete the setup

**Creating a group:**
1. Go to **Groups**
2. Click **Create group**
3. Enter a group name (e.g., `Administrators`, `Developers`, `ReadOnly`)
4. Add users to the group

### Option 2: Microsoft Active Directory Integration

For enterprises already using Active Directory, IAM Identity Center can connect to AD in three ways :

| Integration Method | Description |
|-------------------|-------------|
| **AWS Managed Microsoft AD** | Fully managed AD in AWS Directory Service |
| **AD Connector** | Proxy service connecting to on-premises AD |
| **Self-managed AD** | Your own AD instances on EC2 |

**Benefits of AD integration :**
- Users sign in with existing corporate credentials
- Password policies enforced by AD
- Group membership drives AWS access
- Automatic lifecycle management (disable in AD = revoke AWS access)

### Option 3: External Identity Provider (SAML 2.0)

Connect to third-party IdPs such as :
- Microsoft Entra ID (Azure AD)
- Okta Universal Directory
- Ping Identity
- JumpCloud

**Integration steps :**
1. In IAM Identity Center, choose **Add application** > **Add custom SAML 2.0 application**
2. Download the IAM Identity Center SAML metadata file
3. Upload your IdP's metadata file or provide ACS URL
4. Configure attribute mappings (e.g., map `${user:email}` to the Subject field)
5. Assign users/groups to the application

---

## 6. Multi-Account Access with Permission Sets

### What Are Permission Sets?

A **permission set** is a collection of one or more IAM policies that defines the level of access users have when they sign in to an AWS account . IAM Identity Center creates a corresponding IAM role in each account where the permission set is assigned.

### Creating a Permission Set

**Using a predefined policy:**
1. In IAM Identity Center, go to **Permission sets**
2. Click **Create permission set**
3. Select **Predefined permission set**
4. Choose from common policies: `AdministratorAccess`, `PowerUserAccess`, `ReadOnlyAccess`, `ViewOnlyAccess`
5. Configure session duration (1-12 hours)

**Using a custom policy:**
1. Select **Create a custom permission set**
2. Attach one or more IAM policies (AWS managed or customer managed)
3. Optionally, add an inline policy as JSON
4. Set session duration

**Using a permissions boundary:**
1. Select **Create custom permission set with a permissions boundary**
2. Attach a permissions boundary policy to limit maximum permissions

### Assigning Access to AWS Accounts

**To assign a user or group to an AWS account :**

1. In IAM Identity Center, go to **AWS accounts**
2. Select the AWS account(s) you want to grant access to
3. Click **Assign users or groups**
4. Search for and select the users or groups
5. Choose the permission set(s) to assign
6. Click **Submit**

### Multi-Account Assignment Example

```
Group: DevOps Engineers
├── Assigned Permission Set: PowerUserAccess
└── Assigned Accounts: Dev, Staging, Production

Group: ReadOnly Auditors
├── Assigned Permission Set: ReadOnlyAccess
└── Assigned Accounts: All accounts (Management, Prod, Staging, Dev)

User: Jane (Admin)
├── Assigned Permission Set: AdministratorAccess
└── Assigned Accounts: Management account only
```

---

## 7. Application Assignments: SSO to Business Apps

IAM Identity Center provides single sign-on to thousands of pre-integrated business applications .

### Supported Application Types

| Application Type | Examples | Setup Complexity |
|-----------------|----------|------------------|
| **AWS-managed applications** | Salesforce, Box, Microsoft 365, Slack, Zoom | Low—AWS provides configuration templates |
| **Custom SAML 2.0 applications** | Your own or third-party SAML-enabled apps | Medium—manual metadata exchange |
| **AWS applications** | Amazon CodeCatalyst, AWS Console | Native integration |

### Adding a Pre-Integrated Application

1. In IAM Identity Center, go to **Applications**
2. Click **Add application**
3. Search for and select your application (e.g., "Salesforce")
4. Follow the step-by-step configuration wizard
5. Assign users/groups to the application
6. Configure attribute mappings (e.g., map `${user:email}` to application username)

### Adding a Custom SAML 2.0 Application

1. Click **Add application** > **Add custom SAML 2.0 application**
2. Enter a display name (e.g., "MyCustomApp")
3. Download the IAM Identity Center SAML metadata file
4. Upload your application's SAML metadata file or manually enter ACS URL and Audience
5. Configure attribute mappings
6. Assign users/groups
7. Complete setup 

---

## 8. Attribute-Based Access Control (ABAC)

Attribute-Based Access Control (ABAC) allows you to define permissions based on user attributes rather than static IAM policies .

### How ABAC Works

Instead of creating separate permission sets for "Finance Users" and "Engineering Users," you create a single permission set with tags, and access is granted based on user attributes.

### Supported Attributes

IAM Identity Center allows you to select user attributes from your identity source, such as :
- `costCenter`
- `title` (job title)
- `locale`
- `department`
- Custom attributes

### Example: ABAC for Environment Access

```
Policy condition: 
   Allow access to EC2 resources only if 
   aws:ResourceTag/Environment == user:department

User Attributes:
   John → department = "production"
   Mary → department = "development"

Result:
   John can access production EC2 instances
   Mary can access development EC2 instances
```

### Configuring ABAC

1. In your identity source, define user attributes (e.g., in AD or Okta)
2. In IAM Identity Center, select which attributes to sync
3. Create IAM policies that reference the attributes using `${aws:PrincipalTag/key}`
4. Assign the permission set to users/groups

---

## 9. AWS CLI Integration with IAM Identity Center

### Setting Up CLI for IAM Identity Center

**Step 1: Run the configuration wizard**

```bash
aws configure sso
```

**Step 2: Follow the prompts**
- SSO session name (e.g., `my-sso-session`)
- SSO start URL (e.g., `https://your-company.awsapps.com/start`)
- SSO region (the region where IAM Identity Center is enabled)
- Choose the AWS account and permission set

**Step 3: Start a session**

```bash
aws sso login
```

This opens a browser for authentication. After successful login, your credentials are cached.

### Profile Configuration Example

Your `~/.aws/config` file will contain entries like:

```ini
[profile my-dev-profile]
sso_session = my-sso-session
sso_account_id = 123456789012
sso_role_name = DeveloperAccess
region = us-east-1
output = json

[sso-session my-sso-session]
sso_start_url = https://my-company.awsapps.com/start
sso_region = us-east-1
sso_registration_scopes = sso:account:access
```

### Using the CLI with SSO

```bash
# Use the configured profile
aws s3 ls --profile my-dev-profile

# Or set environment variable
export AWS_PROFILE=my-dev-profile
aws ec2 describe-instances
```

### Session Management

```bash
# Check active session
aws sts get-caller-identity

# Log out (removes cached credentials)
aws sso logout
```

### How CLI Authentication Works 

1. `aws sso login` opens a browser for IdP authentication
2. IAM Identity Center issues a refresh token and access token (cached to `~/.aws/sso/cache/`)
3. When you run an AWS command, the CLI uses the access token to request IAM role credentials
4. The CLI calls `getRoleCredentials` to obtain temporary credentials
5. Temporary credentials are used to sign AWS service requests
6. Access tokens auto-refresh hourly using the refresh token
7. When the refresh token expires (up to 90 days), re-authentication is required 

---

## 10. Security Features: MFA and Session Management

### Multi-Factor Authentication (MFA)

IAM Identity Center supports MFA for all users regardless of identity source .

**MFA Methods:**

| Method | Description | Support |
|--------|-------------|---------|
| **Authenticator app TOTP** | Time-based one-time passwords (Google Authenticator, Twilio Authy) | Yes |
| **FIDO2 security keys** | YubiKey, hardware tokens | Yes  |
| **Built-in biometrics** | Touch ID (MacBook), facial recognition (Windows Hello) | Yes  |
| **IdP MFA** | MFA enforced by external identity provider (Okta, Azure AD) | Yes |

**Enforcing MFA:**

1. In IAM Identity Center, go to **Settings** > **Multi-factor authentication**
2. Choose MFA configuration:
   - **Enabled** (users must enroll)
   - **Optional** (users can choose)
   - **Disabled**
3. Configure MFA device management (allow users to manage their own devices)

### Session Duration Configuration

You can configure session durations at multiple levels :

| Level | Where to Configure | Default | Range |
|-------|-------------------|---------|-------|
| **User session** (access portal) | IAM Identity Center settings | 8 hours | 15 min - 90 days |
| **Permission set session** (role duration) | Individual permission set | 1 hour | 1-12 hours |

**Configuring user session duration:**

```
Settings → User portal → Session duration → Select desired duration
```

**Configuring permission set session duration:**

```
Permission sets → Select permission set → Edit → Session duration
```

### Access Token Lifecycle 

```
┌─────────────────────────────────────────────────────────────────┐
│                     Token Lifecycle                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  aws sso login ──→ Access Token (1 hour) ──→ Expires           │
│                          │                                      │
│                          ▼                                      │
│                   Auto-refresh using                            │
│                   Refresh Token (up to 90 days)                 │
│                          │                                      │
│                          ▼                                      │
│              Refresh Token expires ──→ Re-authenticate         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Auditing and Monitoring

### CloudTrail Integration

All administrative and multi-account access activity is recorded in AWS CloudTrail, providing visibility to audit IAM Identity Center activity centrally .

**Auditable events include:**

| Event Category | Examples |
|----------------|----------|
| **Authentication** | Sign-in attempts, sign-out, MFA enrollment |
| **Access** | User access to AWS accounts, application launches |
| **Administration** | Permission set creation/modification, user/group management, assignment changes |
| **Directory integration** | IdP configuration changes, SCIM sync events |

### CloudWatch Logging

Enable CloudWatch logging for detailed access logs including:

- Which users accessed which accounts
- Timestamps of access
- Permission sets used
- Session durations

### Security Monitoring Best Practices 

| Practice | Description |
|----------|-------------|
| **Centralize logs** | Aggregate CloudTrail logs to a dedicated security account |
| **Forward to SIEM** | Send logs to SIEM or log analytics platform |
| **Monitor unusual patterns** | Detect unauthorized access attempts, privilege escalation |
| **Alert on break-glass access** | Configure alerts for emergency role usage |
| **Regular audit reviews** | Review permission assignments quarterly |

---

## 12. Integration with AWS Organizations

### Why AWS Organizations is Required

IAM Identity Center requires integration with AWS Organizations to manage multi-account access . This enables you to:

- Select one or more accounts from your organization
- Grant users access to all accounts being used for an application or team
- Centrally manage permissions across your entire AWS environment

### Delegated Administration

IAM Identity Center supports delegated administration from a member account, allowing you to :

- Designate an account for centralized administration
- Reduce the need to use the management account
- Follow security best practices

**Setting delegated administrator:**

1. In AWS Organizations, register the delegated administrator account for IAM Identity Center
2. In the delegated account, manage all IAM Identity Center configurations

### Multi-Account Architecture Recommendation 

```
┌─────────────────────────────────────────────────────────────────┐
│                     AWS Organization                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐                                       │
│  │  Management Account  │ ← Root user access only (break-glass)│
│  │  (billing, orgs)     │                                       │
│  └─────────────────────┘                                       │
│                                                                 │
│  ┌─────────────────────┐                                       │
│  │  Security Account    │ ← CloudTrail, SIEM, security tools   │
│  └─────────────────────┘                                       │
│                                                                 │
│  ┌─────────────────────┐                                       │
│  │  Shared Services    │ ← Networking, CI/CD, artifacts        │
│  └─────────────────────┘                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Workload Accounts                                       │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                │   │
│  │  │   Dev    │ │ Staging  │ │   Prod   │                │   │
│  │  └──────────┘ └──────────┘ └──────────┘                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Pricing

AWS IAM Identity Center is **free** to use. You pay only for the underlying AWS services you use:

| Component | Cost |
|-----------|------|
| **IAM Identity Center service** | Free |
| **Built-in identity directory** | Free |
| **AWS Managed Microsoft AD** | Standard Directory Service pricing |
| **SAML integrations** | Free |
| **CloudTrail logging** | Standard CloudTrail pricing |

---

## 14. Enterprise Best Practices

### Identity Source Selection

| Scenario | Recommendation |
|----------|----------------|
| **Already have Active Directory** | Connect AD as identity source  |
| **Use Okta or Azure AD** | Configure SAML 2.0 federation |
| **New to AWS, no IdP** | Use built-in IAM Identity Center directory |

### Access Management Best Practices

| Practice | Description |
|----------|-------------|
| **Never create IAM users for humans** | Use IAM Identity Center for all human access  |
| **Use group-based assignments** | Assign permissions to groups, never individual users  |
| **Follow least privilege** | Create purpose-built permission sets with minimal required permissions  |
| **Implement break-glass access** | Maintain emergency IAM roles for extreme scenarios  |
| **Automate lifecycle** | IdP integration enables automatic access revocation |

### Security Best Practices

| Practice | Description |
|----------|-------------|
| **Enforce MFA for all users** | Mandatory MFA for all AWS-access users  |
| **Use conditional access** | Restrict access based on device, location, or risk level |
| **Regular access reviews** | Quarterly permission audits |
| **Session duration limits** | Shorter sessions for privileged access |
| **Centralize logging** | Aggregate all CloudTrail logs to security account  |

### Permission Set Design

| Permission Set | Typical Users | Policies |
|----------------|---------------|----------|
| **Infrastructure Admin** | Senior DevOps, Platform team | `AdministratorAccess` (restricted) |
| **Application Developer** | Developers | `PowerUserAccess` + custom restrictions |
| **Read-Only Auditor** | Security, Compliance | `ReadOnlyAccess` |
| **Billing Viewer** | Finance team | `ViewOnlyAccess` + billing policies |
| **Break-Glass Emergency** | Designated admins | `AdministratorAccess` (audited, strong MFA) |

---

## 15. Troubleshooting Common Issues

### Issue: Unable to Enable IAM Identity Center

**Possible causes:**
- Region selection—once enabled in one region, you cannot switch 
- AWS Organizations not configured

**Solutions:**
- Enable in your organization's designated master region
- Set up AWS Organizations first if not already done

### Issue: CLI Authentication Fails

**Possible causes:**
- Expired session
- Incorrect profile configuration
- Network/firewall blocking access portal

**Solutions :**
```bash
# Refresh session
aws sso login

# Clear cached credentials
aws sso logout

# Verify profile configuration
aws configure list --profile my-profile

# Check token cache
ls ~/.aws/sso/cache/
```

### Issue: User Cannot Access Assigned Account

**Possible causes:**
- User not assigned to the permission set
- Permission set not assigned to the correct account
- User session expired

**Solutions:**
- Verify assignment in IAM Identity Center console
- Check that user is in the correct group
- Ask user to re-authenticate at access portal

### Issue: SAML Integration Failing

**Possible causes:**
- Metadata mismatch
- Incorrect attribute mapping
- Certificate expiration

**Solutions:**
- Re-download and exchange metadata files
- Verify attribute mappings (e.g., `${user:email}` for Subject)
- Check certificate validity dates

---

## 16. IAM Identity Center Glossary

This glossary includes key terms directly related to AWS IAM Identity Center.

---

### A

**Access Portal**
The web-based user interface where users sign in to access their assigned AWS accounts and applications. Each organization has a unique access portal URL (e.g., `https://your-company.awsapps.com/start`) .

**Access Token**
A temporary credential issued upon authentication that is used to request IAM role credentials. Access tokens are valid for 1 hour and are automatically refreshed .

**Application Assignment**
The configuration that enables single sign-on to a business application (SaaS or custom) through IAM Identity Center.

**Assignment**
The association of a user or group with a permission set for a specific AWS account. Assignments determine who can access which accounts and with what permissions .

**Attribute-Based Access Control (ABAC)**
An authorization strategy that defines permissions based on user attributes (e.g., department, cost center) rather than static IAM policies .

**AWS Managed Microsoft AD**
A fully managed Microsoft Active Directory service in AWS Directory Service that can be used as an identity source for IAM Identity Center.

**AWS Organizations**
AWS service for centrally managing multiple AWS accounts. IAM Identity Center integrates with AWS Organizations to enable multi-account access management .

---

### D

**Delegated Administration**
The ability to designate a member account in AWS Organizations to administer IAM Identity Center, reducing the need to use the management account .

---

### F

**Federation**
The process of establishing trust between IAM Identity Center and an external identity provider to enable single sign-on (SSO) .

---

### G

**Group**
A collection of users that can be assigned permissions collectively. Best practice is to assign permissions to groups rather than individual users .

---

### I

**IAM Identity Center (formerly AWS Single Sign-On)**
AWS's cloud-based identity and access management service for centrally managing access to multiple AWS accounts and business applications .

**Identity Provider (IdP)**
An identity management system such as IAM Identity Center, Microsoft Entra ID (Azure AD), Okta, or your own corporate directory service .

**Identity Source**
The directory where user identities are stored. Can be IAM Identity Center's built-in directory, Active Directory, or an external identity provider.

---

### M

**Multi-Factor Authentication (MFA)**
A security feature requiring additional verification beyond a password. IAM Identity Center supports TOTP authenticator apps, FIDO2 security keys, and built-in biometrics .

**Multi-Account Permissions**
The capability to define permissions once (as permission sets) and assign them across multiple AWS accounts in an organization .

---

### P

**Permission Set**
A collection of one or more IAM policies that defines the permissions users receive when accessing an AWS account. Permission sets are created centrally and assigned to accounts .

**PKCE (Proof Key for Code Exchange)**
An OAuth 2.0 authentication grant flow for devices with a browser. Starting with AWS CLI version 2.22.0, PKCE is the default authorization behavior .

---

### R

**Refresh Token**
A credential used to obtain new access tokens after the current access token expires. Refresh tokens are valid for up to 90 days .

---

### S

**SAML 2.0 (Security Assertion Markup Language 2.0)**
An XML-based standard for exchanging authentication and authorization data between an identity provider and a service provider. Used for federating external IdPs with IAM Identity Center .

**SCIM (System for Cross-domain Identity Management)**
A protocol for automating user provisioning between an identity provider and IAM Identity Center. Enables automatic user creation, updates, and deactivation .

**Session**
The period of time during which a user is authenticated and authorized to access AWS resources. Sessions end when the refresh token expires or the user logs out .

**SSO (Single Sign-On)**
An authentication method that allows users to sign in once and access multiple applications and AWS accounts without re-authenticating.

**Start URL**
Another name for the AWS access portal URL—your organization's unique IAM Identity Center URL for accessing authorized accounts and resources .

---

### U

**User**
An individual identity that can be granted access to AWS accounts and applications. Users can be created in the IAM Identity Center directory or synchronized from an external identity source.

---

## Summary

AWS IAM Identity Center is the AWS-recommended solution for managing human user access to AWS accounts and applications. By centralizing identity management, eliminating long-lived credentials, and integrating with existing identity providers, it provides a secure, scalable, and enterprise-ready access management solution.

**Key Takeaways:**

- **Centralized management** - One place to manage access to all AWS accounts and applications
- **No long-lived credentials** - Users receive temporary, short-lived credentials via role assumption 
- **Flexible identity sources** - Built-in directory, Active Directory, or external IdPs (Okta, Azure AD) 
- **Multi-account ready** - Integrates with AWS Organizations for seamless cross-account access 
- **Security-first** - MFA enforcement, session controls, and complete CloudTrail auditing 
- **CLI integrated** - `aws configure sso` and `aws sso login` for secure command-line access 

**Getting Started Recommendations:**
- Enable IAM Identity Center in your designated master region
- Choose your identity source (built-in directory is simplest for testing)
- Create permission sets based on job functions (ReadOnly, PowerUser, Administrator)
- Assign permissions to groups, not individual users
- Enforce MFA for all users from day one
- Use the AWS CLI with `aws configure sso` for secure programmatic access