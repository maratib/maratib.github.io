---
title: YAML Configuration
description: YAML Configuration
---

## How to Activate Profiles

<br>

### From application.yml

```yaml
spring:
  profiles:
    active: dev
```

### From CLI

```
java -jar app.jar --spring.profiles.active=prod
```

### From environment variable

```
export SPRING_PROFILES_ACTIVE=test
```

### From VSCode run config launch.json

```json
"args": "--spring.profiles.active=dev",
```

### From IDE run config

```ini
-Dspring.profiles.active=dev
```

## Spring Boot YAML basic profile setup

- A **common base config** (in `application.yml`)
- **Environment-specific profiles** (`application-dev.yml`, `application-test.yml`, `application-prod.yml`)
- Each profile **extends** the common configuration using `spring.config.import`

### **application.yml**

```yaml
# application.yml
spring:
  application:
    name: sample-app

  datasource:
    url: jdbc:mysql://localhost:3306/common_db
    username: common_user
    password: common_pass
    driver-class-name: com.mysql.cj.jdbc.Driver

server:
  port: 8080

logging:
  level:
    root: INFO
    com.example: INFO
```

---

### **application-dev.yml**

```yaml
# application-dev.yml

spring:
  config:
    import: application.yml

  datasource:
    url: jdbc:mysql://localhost:3306/dev_db
    username: dev_user
    password: dev_pass

server:
  port: 8081

logging:
  level:
    com.example: DEBUG
```

---

### **application-test.yml**

```yaml
# application-test.yml

spring:
  config:
    import: application.yml

spring:
  datasource:
    url: jdbc:h2:mem:test_db
    username: sa
    password:
    driver-class-name: org.h2.Driver

server:
  port: 8082

logging:
  level:
    com.example: TRACE
```

---

### **application-prod.yml**

```yaml
# application-prod.yml

spring:
  config:
    import: application.yml

spring:
  datasource:
    url: jdbc:mysql://prod-db:3306/prod_db
    username: ${DB_USER}
    password: ${DB_PASS}

server:
  port: 80

logging:
  level:
    root: WARN
    com.example: INFO
```

## Spring Boot YAML advance profile setup

**the complete, extended Spring Boot YAML configuration setup**

- Common config
- Dev, Test, Production profiles
- Property-map merging examples
- Multiple `import` hierarchy
- Secrets isolation (`application-secrets.yml`)
- Full microservice-style config structure

---

### **application.yml**

```yaml
# application.yml
spring:
  application:
    name: sample-app

  profiles:
    active: dev  # default profile (can be overridden)

  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: common_user
    password: common_pass
    url: jdbc:mysql://localhost:3306/common_db

server:
  port: 8080

logging:
  level:
    root: INFO
    com.sample: INFO

app:
  name: Sample Application
  features:
    cache: false
    metrics: true

# Import secrets (not committed to Git)
spring:
  config:
    import: optional:application-secrets.yml
```

---

### **application-dev.yml**

```yaml
# application-dev.yml
spring:
  config:
    import:
      - application.yml
      - optional:application-secrets.yml

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/dev_db
    username: dev_user
    password: dev_pass

server:
  port: 8081

logging:
  level:
    com.sample: DEBUG

app:
  features:
    cache: false  # override base
    debug-mode: true
```

---

### **application-test.yml**

```yaml
# application-test.yml
spring:
  config:
    import:
      - application.yml

spring:
  datasource:
    url: jdbc:h2:mem:test_db
    username: sa
    password:
    driver-class-name: org.h2.Driver

server:
  port: 8082

logging:
  level:
    com.sample: TRACE

app:
  features:
    cache: false
    metrics: false  # override for test
```

---

### **application-prod.yml**

```yaml
# application-prod.yml
spring:
  config:
    import:
      - application.yml
      - optional:application-secrets.yml

spring:
  datasource:
    url: jdbc:mysql://prod-db:3306/prod_db
    username: ${DB_USER}
    password: ${DB_PASS}

server:
  port: 80

logging:
  level:
    root: WARN
    com.sample: INFO

app:
  features:
    cache: true
    metrics: true
    audit: true
```

---

### **application-secrets.yml**

> ⚠ **Do NOT commit this file to Git. Put it in `.gitignore`.**

```yaml
# application-secrets.yml
spring:
  datasource:
    username: ${SECRET_DB_USER}
    password: ${SECRET_DB_PASS}

jwt:
  secret: ${JWT_SECRET_KEY}

api:
  key: ${EXTERNAL_API_KEY}
```

---

## **Multiple Import Hierarchy Example**

A profile can import multiple layers:

```
application.yml  →  application-common.yml  →  application-dev.yml
```

### application.yml

```yaml
spring:
  config:
    import:
      - application-common.yml
      - optional:application-secrets.yml
```

### application-common.yml:

```yaml
server:
  forward-headers-strategy: framework
  error:
    include-stacktrace: on_param
```

### application-dev.yml:

```yaml
spring:
  config:
    import:
      - application.yml
      - optional:application-secrets.yml

debug: true
```

---

## **Property Map Merging Example**

Base file:

```yaml
app:
  mail:
    host: smtp.example.com
    ports:
      - 587
      - 465
```

Dev override (adds new port, merges list):

```yaml
app:
  mail:
    ports:
      - 2525
```

**Merged output during runtime:**

```yaml
app.mail.ports = [587, 465, 2525]
```

---

## **Microservice-Friendly Structure (Recommended)**

```
config/
 ├── application.yml
 ├── application-common.yml
 ├── application-dev.yml
 ├── application-test.yml
 ├── application-prod.yml
 ├── application-secrets.yml
 └── application-monitoring.yml
```

Example `application-monitoring.yml`:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
```

Imported from prod:

```yaml
spring:
  config:
    import:
      - application.yml
      - application-monitoring.yml
      - optional:application-secrets.yml
```

## Spring Boot YAML cloud profile setup

**complete version of the Spring Boot configuration using Spring Cloud Config Server**,

- **Config Server setup**
- **Externalized YAML files in a Git repo**
- **Client-side bootstrap config**
- **Profiles (dev, test, prod)**
- **Shared/common config**
- **Secrets file**
- **Hierarchical imports**

✔ **Only configuration files**
✔ **No Java code**

---

### **Config Server**

This file lives **in the Config Server JAR** (not the client apps).

```yaml
# Config Server: application.yml
server:
  port: 8888

spring:
  application:
    name: config-server

  cloud:
    config:
      server:
        git:
          uri: https://github.com/your-org/your-config-repo.git
          clone-on-start: true
          search-paths:
            - configs
```

---

#### **Folder Structure in Git (Config Repo)**

```
your-config-repo/
└── configs/
    ├── sample-app.yml
    ├── sample-app-dev.yml
    ├── sample-app-test.yml
    ├── sample-app-prod.yml
    ├── sample-app-secrets.yml
    ├── sample-app-common.yml
    └── sample-app-monitoring.yml
```

> These YAML files are **fetched dynamically** by Spring Cloud Config Clients.

---

### **Common Config**

```yaml
# sample-app.yml (default, shared for all profiles)
spring:
  application:
    name: sample-app

  datasource:
    url: jdbc:mysql://localhost:3306/common_db
    username: common_user
    password: common_pass
    driver-class-name: com.mysql.cj.jdbc.Driver

server:
  port: 8080

logging:
  level:
    root: INFO
    com.sample: INFO

app:
  features:
    metrics: true
    cache: false

spring:
  config:
    import:
      - optional:sample-app-common.yml
      - optional:sample-app-secrets.yml
```

---

### **Common Shared Config**

```yaml
# sample-app-common.yml
server:
  forward-headers-strategy: framework

management:
  endpoints:
    web:
      exposure:
        include: health,info
```

---

### **Secrets File**

> (Do NOT commit to public GitHub)

```yaml
# sample-app-secrets.yml
spring:
  datasource:
    username: ${SECRET_DB_USER}
    password: ${SECRET_DB_PASS}

jwt:
  secret: ${JWT_SECRET_KEY}
```

---

### **Dev Profile**

```yaml
# sample-app-dev.yml
spring:
  config:
    import:
      - sample-app.yml
      - optional:sample-app-secrets.yml

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/dev_db
    username: dev_user
    password: dev_pass

server:
  port: 8081

logging:
  level:
    com.sample: DEBUG

app:
  features:
    debug-mode: true
    cache: false
```

---

### **Test Profile**

```yaml
# sample-app-test.yml
spring:
  config:
    import:
      - sample-app.yml

spring:
  datasource:
    url: jdbc:h2:mem:test_db
    driver-class-name: org.h2.Driver
    username: sa
    password:

logging:
  level:
    com.sample: TRACE

server:
  port: 8082

app:
  features:
    metrics: false
```

---

### **Production Profile**

```yaml
# sample-app-prod.yml
spring:
  config:
    import:
      - sample-app.yml
      - optional:sample-app-secrets.yml
      - optional:sample-app-monitoring.yml

spring:
  datasource:
    url: jdbc:mysql://prod-db:3306/prod_db
    username: ${DB_USER}
    password: ${DB_PASS}

server:
  port: 80

logging:
  level:
    root: WARN
    com.sample: INFO

app:
  features:
    metrics: true
    audit: true
    cache: true
```

---

### **Monitoring Add-on File**

```yaml
# sample-app-monitoring.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus

management:
  metrics:
    export:
      prometheus:
        enabled: true
```

---

### **Client App**

Every **client application** needs this file to load config **from the Config Server**.

```yaml
# bootstrap.yml (client app)
spring:
  application:
    name: sample-app

  cloud:
    config:
      uri: http://localhost:8888
      fail-fast: true
      retry:
        max-attempts: 5
        initial-interval: 2000

# Optional: fallback local settings
spring:
  config:
    import:
      - optional:application-local.yml
```

---

### **Client App Profile Activation**

Clients still use **local profile activation**, but config loads from server.

```yaml
# application.yml (client app)
spring:
  profiles:
    active: dev
```

---

## **How Each Client App Loads Config**

Example:

**When profile = dev**

Client fetches:

```
GET /sample-app/dev
```

Config from:

1. `sample-app.yml`
2. `sample-app-dev.yml`
3. `sample-app-common.yml`
4. `sample-app-secrets.yml`
5. (optional) monitoring file
