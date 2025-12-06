---
title: ELK Stack for Observability
description: ELK Stack for Observability in Microservices Architecture
---

**Setting Up Local ELK Stack with Docker**

## ✅ **Prerequisites**

### **What You Need:**

- **Docker & Docker Compose** (installed and running)
- **4-8 GB RAM** available (ELK can be memory-hungry)
- **Docker Hub account** (optional, for pulling images)
- **Basic terminal knowledge**

### **Verify Installation:**

```bash
# Check Docker version
docker --version
# Docker version 20.10.17 or higher

# Check Docker Compose version
docker-compose --version
# Docker Compose version 2.10.2 or higher

# Check available memory (Linux/Mac)
free -h
# At least 4GB free memory recommended
```

---

## 📁 **Project Structure**

```bash
elk-stack-demo/
├── docker-compose.yml          # Main Docker Compose file
├── elasticsearch/
│   ├── config/
│   │   └── elasticsearch.yml   # ES configuration
│   └── data/                   # ES data (auto-created)
├── logstash/
│   ├── config/
│   │   └── logstash.yml        # Logstash configuration
│   ├── pipeline/
│   │   └── logstash.conf       # Pipeline configuration
│   └── patterns/               # Grok patterns (optional)
├── kibana/
│   └── config/
│       └── kibana.yml          # Kibana configuration
├── spring-boot-app/            # Your Spring Boot app
│   ├── src/
│   └── pom.xml
└── logs/                       # Application logs (optional)
```

---

## 🚀 **Basic ELK Setup**

### **Step 1: Create docker-compose.yml**

```yaml
# docker-compose.yml - Basic ELK Stack
version: "3.8"

services:
  # Elasticsearch
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
    container_name: elasticsearch
    environment:
      - node.name=elasticsearch
      - cluster.name=docker-cluster
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m" # Adjust based on your RAM
      - xpack.security.enabled=false # Disable for local dev
      - xpack.security.http.ssl.enabled=false
    ports:
      - "9200:9200" # REST API
      - "9300:9300" # Node communication
    volumes:
      - ./elasticsearch/data:/usr/share/elasticsearch/data
      - ./elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
    networks:
      - elk
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD-SHELL",
          'curl -s http://localhost:9200/_cluster/health | grep -q ''"status":"green"'' || exit 1',
        ]
      interval: 30s
      timeout: 10s
      retries: 5

  # Logstash
  logstash:
    image: docker.elastic.co/logstash/logstash:8.10.0
    container_name: logstash
    environment:
      - "LS_JAVA_OPTS=-Xms256m -Xmx256m"
      - XPACK_MONITORING_ENABLED=false
    ports:
      - "5000:5000" # TCP input (JSON logs)
      - "5001:5001" # TCP input (plain logs)
      - "5002:5002" # UDP input
      - "9600:9600" # Logstash API
    volumes:
      - ./logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml
      - ./logstash/pipeline/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    networks:
      - elk
    depends_on:
      - elasticsearch
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD-SHELL",
          'curl -s http://localhost:9600 | grep -q ''"status":"green"'' || exit 1',
        ]
      interval: 30s
      timeout: 10s
      retries: 5

  # Kibana
  kibana:
    image: docker.elastic.co/kibana/kibana:8.10.0
    container_name: kibana
    environment:
      - SERVER_NAME=kibana
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    volumes:
      - ./kibana/config/kibana.yml:/usr/share/kibana/config/kibana.yml
    networks:
      - elk
    depends_on:
      elasticsearch:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD-SHELL",
          'curl -s http://localhost:5601/api/status | grep -q ''"status":"green"'' || exit 1',
        ]
      interval: 30s
      timeout: 10s
      retries: 5

networks:
  elk:
    driver: bridge

volumes:
  elasticsearch-data:
    driver: local
```

### **Step 2: Create Configuration Files**

#### **2.1 Elasticsearch Configuration**

```yaml
# elasticsearch/config/elasticsearch.yml
cluster.name: "docker-cluster"
network.host: 0.0.0.0

# Disable security for local development
xpack.security.enabled: false
xpack.security.http.ssl.enabled: false
xpack.security.transport.ssl.enabled: false

# Minimum master nodes
discovery.type: single-node

# Memory settings
bootstrap.memory_lock: true

# Cluster settings
cluster.routing.allocation.disk.threshold_enabled: true
cluster.routing.allocation.disk.watermark.low: 85%
cluster.routing.allocation.disk.watermark.high: 90%
cluster.routing.allocation.disk.watermark.flood_stage: 95%
```

#### **2.2 Logstash Configuration**

```yaml
# logstash/config/logstash.yml
http.host: "0.0.0.0"
xpack.monitoring.enabled: false
```

#### **2.3 Logstash Pipeline**

```ruby
# logstash/pipeline/logstash.conf
input {
  # TCP input for JSON logs from applications
  tcp {
    port => 5000
    codec => json_lines
    tags => ["json_input"]
  }

  # TCP input for plain text logs
  tcp {
    port => 5001
    codec => line
    tags => ["plain_input"]
  }

  # UDP input (faster but less reliable)
  udp {
    port => 5002
    codec => json_lines
    tags => ["udp_input"]
  }

  # Filebeat input (alternative)
  beats {
    port => 5044
    tags => ["beats_input"]
  }
}

filter {
  # Add metadata
  mutate {
    add_field => {
      "[@metadata][index_name]" => "app-logs-%{+YYYY.MM.dd}"
      "received_at" => "%{@timestamp}"
      "ingest_timestamp" => "%{+YYYY-MM-dd'T'HH:mm:ss.SSS'Z'}"
    }
  }

  # Parse JSON if it's a string
  if [message] {
    json {
      source => "message"
      target => "parsed_json"
    }
  }

  # Extract fields from JSON
  if [parsed_json] {
    mutate {
      add_field => {
        "application" => "%{[parsed_json][service]}"
        "log_level" => "%{[parsed_json][level]}"
        "trace_id" => "%{[parsed_json][traceId]}"
        "span_id" => "%{[parsed_json][spanId]}"
        "user_id" => "%{[parsed_json][userId]}"
      }
    }

    # Copy fields from parsed_json to root
    ruby {
      code => '
        parsed = event.get("parsed_json")
        if parsed
          parsed.each do |key, value|
            event.set(key, value) unless event.get(key)
          end
        end
        event.remove("parsed_json")
      '
    }
  }

  # Parse timestamp if present
  if [timestamp] {
    date {
      match => [ "timestamp", "ISO8601" ]
      target => "@timestamp"
    }
  }

  # GeoIP for IP addresses
  if [client_ip] {
    geoip {
      source => "client_ip"
      target => "geoip"
    }
  }

  # User agent parsing
  if [user_agent] {
    useragent {
      source => "user_agent"
      target => "user_agent_info"
    }
  }

  # Remove sensitive data
  mutate {
    remove_field => [
      "message",  # Keep original message only if needed
      "headers",
      "[parsed_json]"
    ]
  }
}

output {
  # Debug output (uncomment for troubleshooting)
  # stdout {
  #   codec => rubydebug
  # }

  # Send to Elasticsearch
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "%{[@metadata][index_name]}"
    document_id => "%{[@metadata][fingerprint]}"

    # Retry policy
    retry_on_conflict => 3
    retry_max_interval => 30

    # Connection settings
    pool_max => 1000
    pool_max_per_route => 200
  }

  # Fallback to file if Elasticsearch is down
  file {
    path => "/usr/share/logstash/data/failed-%{+YYYY-MM-dd}.log"
    message_format => "%{message}"
    codec => line { format => "%{message}" }
  }
}
```

#### **2.4 Kibana Configuration**

```yaml
# kibana/config/kibana.yml
server.name: kibana
server.host: "0.0.0.0"
elasticsearch.hosts: ["http://elasticsearch:9200"]

# Monitoring
monitoring.ui.container.elasticsearch.enabled: true

# Default settings
i18n.locale: "en"
telemetry.enabled: false

# Development settings
elasticsearch.requestTimeout: 90000
elasticsearch.shardTimeout: 90000
```

### **Step 3: Create Directory Structure**

```bash
# Create all directories
mkdir -p elk-stack-demo/{elasticsearch/{config,data},logstash/{config,pipeline,patterns},kibana/config,logs}

# Create configuration files
cd elk-stack-demo
touch elasticsearch/config/elasticsearch.yml
touch logstash/config/logstash.yml
touch logstash/pipeline/logstash.conf
touch kibana/config/kibana.yml
```

### **Step 4: Start ELK Stack**

```bash
# Navigate to your project directory
cd elk-stack-demo

# Start all services
docker-compose up -d

# Check if all services are running
docker-compose ps

# Expected output:
# NAME                COMMAND                  STATUS         PORTS
# elasticsearch       "/bin/tini -- /usr/…"   Up 2 minutes   0.0.0.0:9200->9200/tcp, 0.0.0.0:9300->9300/tcp
# kibana              "/bin/tini -- /usr/…"   Up 2 minutes   0.0.0.0:5601->5601/tcp
# logstash            "/usr/local/bin/dock…"  Up 2 minutes   0.0.0.0:5000-5002->5000-5002/tcp, 0.0.0.0:9600->9600/tcp
```

### **Step 5: Verify Installation**

```bash
# Check Elasticsearch
curl -X GET "http://localhost:9200/_cluster/health?pretty"

# Expected response:
# {
#   "cluster_name" : "docker-cluster",
#   "status" : "green",
#   "timed_out" : false,
#   "number_of_nodes" : 1,
#   "number_of_data_nodes" : 1,
#   ...
# }

# Check Logstash
curl -X GET "http://localhost:9600/?pretty"

# Check Kibana (open in browser)
# http://localhost:5601
```

---

## 🔗 **Spring Boot Integration**

### **Step 1: Add Dependencies to Spring Boot**

```xml
<!-- pom.xml -->
<dependencies>
    <!-- Spring Boot Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Logging dependencies -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-logging</artifactId>
    </dependency>

    <!-- Logstash Logback Encoder -->
    <dependency>
        <groupId>net.logstash.logback</groupId>
        <artifactId>logstash-logback-encoder</artifactId>
        <version>7.4</version>
    </dependency>

    <!-- Sleuth for distributed tracing -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-sleuth</artifactId>
    </dependency>

    <!-- Lombok for @Slf4j -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

### **Step 2: Configure Logback for ELK**

```xml
<!-- src/main/resources/logback-spring.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <!-- Property placeholders -->
    <springProperty scope="context" name="APP_NAME" source="spring.application.name" defaultValue="spring-app"/>
    <springProperty scope="context" name="LOGSTASH_HOST" source="logstash.host" defaultValue="localhost"/>
    <springProperty scope="context" name="LOGSTASH_PORT" source="logstash.port" defaultValue="5000"/>

    <!-- Console Appender (for local development) -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
            <providers>
                <timestamp>
                    <fieldName>timestamp</fieldName>
                    <pattern>yyyy-MM-dd'T'HH:mm:ss.SSS'Z'</pattern>
                    <timeZone>UTC</timeZone>
                </timestamp>
                <version/>
                <logLevel/>
                <loggerName/>
                <pattern>
                    <pattern>
                        {
                            "service": "${APP_NAME}",
                            "environment": "${ENVIRONMENT:-local}",
                            "pid": "${PID:-}",
                            "thread": "%thread",
                            "class": "%logger{40}"
                        }
                    </pattern>
                </pattern>
                <message/>
                <mdc/>  <!-- Important: Includes traceId, spanId from Sleuth -->
                <arguments/>
                <stackTrace>
                    <fieldName>stacktrace</fieldName>
                </stackTrace>
                <context/>
            </providers>
        </encoder>
    </appender>

    <!-- Logstash TCP Appender (sends to ELK) -->
    <appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <destination>${LOGSTASH_HOST}:${LOGSTASH_PORT}</destination>

        <!-- Connection strategy -->
        <connectionStrategy>
            <roundRobin>
                <connectionTTL>5 minutes</connectionTTL>
            </roundRobin>
        </connectionStrategy>

        <!-- Encoder -->
        <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
            <providers>
                <timestamp>
                    <fieldName>@timestamp</fieldName>
                    <pattern>yyyy-MM-dd'T'HH:mm:ss.SSS'Z'</pattern>
                    <timeZone>UTC</timeZone>
                </timestamp>
                <version/>
                <logLevel>
                    <fieldName>level</fieldName>
                </logLevel>
                <loggerName>
                    <fieldName>logger</fieldName>
                </loggerName>
                <pattern>
                    <pattern>
                        {
                            "service": "${APP_NAME}",
                            "environment": "${ENVIRONMENT:-local}",
                            "host": "${HOSTNAME:-unknown}",
                            "pid": "${PID:-}",
                            "thread": "%thread"
                        }
                    </pattern>
                </pattern>
                <message/>
                <mdc/>
                <arguments/>
                <stackTrace>
                    <fieldName>stacktrace</fieldName>
                </stackTrace>
                <logstashMarkers/>
                <context/>
            </providers>
        </encoder>

        <!-- Keep alive -->
        <keepAliveDuration>5 minutes</keepAliveDuration>

        <!-- Reconnection delay -->
        <reconnectionDelay>1 second</reconnectionDelay>

        <!-- Connection timeout -->
        <connectionTimeout>5 seconds</connectionTimeout>

        <!-- Write timeout -->
        <writeTimeout>30 seconds</writeTimeout>
    </appender>

    <!-- Async Logstash Appender (better performance) -->
    <appender name="ASYNC_LOGSTASH" class="ch.qos.logback.classic.AsyncAppender">
        <appender-ref ref="LOGSTASH"/>
        <queueSize>10000</queueSize>
        <discardingThreshold>0</discardingThreshold>
        <includeCallerData>false</includeCallerData>
        <neverBlock>true</neverBlock>
    </appender>

    <!-- Root Logger -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="ASYNC_LOGSTASH"/>
    </root>

    <!-- Specific loggers -->
    <logger name="com.yourcompany" level="DEBUG"/>
    <logger name="org.springframework" level="INFO"/>
    <logger name="org.hibernate" level="WARN"/>
</configuration>
```

### **Step 3: Spring Boot Application Properties**

```yaml
# application.yml
spring:
  application:
    name: user-service

  # Sleuth configuration for distributed tracing
  sleuth:
    enabled: true
    sampler:
      probability: 1.0 # Sample 100% in development
    baggage:
      enabled: true
      remote-fields: userId,correlationId,sessionId

# Logstash configuration
logstash:
  host: localhost
  port: 5000

# Server configuration
server:
  port: 8080

# Logging configuration
logging:
  config: classpath:logback-spring.xml
  level:
    root: INFO
    com.example: DEBUG
```

### **Step 4: Create Sample Spring Boot Application**

```java
// Main Application
@SpringBootApplication
@Slf4j
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
        log.info("Demo application started with ELK logging!");
    }
}

// Sample Controller
@RestController
@RequestMapping("/api")
@Slf4j
public class UserController {

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        // Add custom fields to MDC
        MDC.put("userId", id);
        MDC.put("endpoint", "/api/users/{id}");

        log.info("Fetching user with id: {}", id);

        try {
            // Simulate business logic
            User user = userService.findById(id);

            // Log success with structured data
            Map<String, Object> logData = new HashMap<>();
            logData.put("user_id", id);
            logData.put("action", "GET_USER");
            logData.put("status", "SUCCESS");
            log.info("User retrieved successfully", logData);

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            // Log error
            Map<String, Object> errorData = new HashMap<>();
            errorData.put("user_id", id);
            errorData.put("error", e.getMessage());
            log.error("Failed to retrieve user", errorData);

            return ResponseEntity.status(500).build();
        } finally {
            // Clean up MDC
            MDC.remove("userId");
            MDC.remove("endpoint");
        }
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        log.info("Creating user: {}", user.getEmail());

        // Business logic here

        return ResponseEntity.ok(user);
    }
}

// User Service with Method Logging
@Service
@Slf4j
public class UserService {

    @LogExecution  // Custom annotation for logging
    public User findById(String id) {
        log.debug("Looking up user in database: {}", id);

        // Simulate database call
        try {
            Thread.sleep(100);  // Simulate latency
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        return new User(id, "john.doe@example.com");
    }
}

// Custom Logging Annotation
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface LogExecution {
    String value() default "";
}

// Logging Aspect
@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Around("@annotation(LogExecution)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();

        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        // Log method entry
        Map<String, Object> entryLog = new HashMap<>();
        entryLog.put("method", methodName);
        entryLog.put("class", className);
        entryLog.put("action", "METHOD_ENTRY");
        log.debug("Method execution started", entryLog);

        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;

            // Log method exit with execution time
            Map<String, Object> exitLog = new HashMap<>();
            exitLog.put("method", methodName);
            exitLog.put("class", className);
            exitLog.put("execution_time_ms", executionTime);
            exitLog.put("action", "METHOD_EXIT");
            log.debug("Method execution completed", exitLog);

            return result;

        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;

            // Log error
            Map<String, Object> errorLog = new HashMap<>();
            errorLog.put("method", methodName);
            errorLog.put("class", className);
            errorLog.put("execution_time_ms", executionTime);
            errorLog.put("error", e.getMessage());
            errorLog.put("action", "METHOD_ERROR");
            log.error("Method execution failed", errorLog);

            throw e;
        }
    }
}
```

### **Step 5: Generate Test Logs**

```bash
# Run your Spring Boot application
cd spring-boot-app
mvn spring-boot:run

# Generate some test requests
curl http://localhost:8080/api/users/123
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Generate error logs
curl http://localhost:8080/api/users/nonexistent
```

---

## 📊 **Kibana Dashboard Setup**

### **Step 1: Access Kibana**

1. Open browser: `http://localhost:5601`
2. Wait for Kibana to load (may take 1-2 minutes on first start)

### **Step 2: Create Index Pattern**

1. **Click "☰" menu → "Stack Management"**
2. **Click "Index Patterns" → "Create index pattern"**
3. **Enter pattern:** `app-logs-*`
4. **Click "Next step"**
5. **Select `@timestamp` as Time field**
6. **Click "Create index pattern"**

### **Step 3: Explore Logs**

1. **Click "☰" menu → "Discover"**
2. **Select `app-logs-*` index pattern**
3. **You'll see your Spring Boot logs!**
4. **Try searching:**
   - `level: ERROR`
   - `service: user-service`
   - `traceId: *`

### **Step 4: Create Visualizations**

#### **4.1 Log Level Distribution (Pie Chart)**

1. **Visualize → Create visualization → Pie**
2. **Select `app-logs-*`**
3. **Add bucket: Split slices**
4. **Aggregation: Terms**
5. **Field: `log_level.keyword`**
6. **Size: 5**
7. **Save as: "Log Level Distribution"**

#### **4.2 Errors Over Time (Line Chart)**

1. **Visualize → Create visualization → Line**
2. **Select `app-logs-*`**
3. **X-axis: Date Histogram, Field: `@timestamp`**
4. **Add filter: `log_level: ERROR`**
5. **Y-axis: Count**
6. **Save as: "Errors Over Time"**

#### **4.3 Top Services (Data Table)**

1. **Visualize → Create visualization → Data Table**
2. **Select `app-logs-*`**
3. **Add bucket: Split rows**
4. **Aggregation: Terms**
5. **Field: `service.keyword`**
6. **Size: 10**
7. **Save as: "Top Services by Log Volume"**

### **Step 5: Create Dashboard**

1. **Dashboard → Create dashboard**
2. **Click "Add" → Select all visualizations you created**
3. **Arrange widgets as needed**
4. **Save as: "Application Monitoring Dashboard"**

### **Step 6: Set Up Alerting (Optional)**

```json
// Create a watcher for error spikes
PUT _watcher/watch/error_spike_alert
{
  "trigger": {
    "schedule": {
      "interval": "5m"
    }
  },
  "input": {
    "search": {
      "request": {
        "indices": ["app-logs-*"],
        "body": {
          "query": {
            "bool": {
              "must": [
                {
                  "range": {
                    "@timestamp": {
                      "gte": "now-5m/m",
                      "lte": "now/m"
                    }
                  }
                },
                {
                  "term": {
                    "log_level.keyword": "ERROR"
                  }
                }
              ]
            }
          }
        }
      }
    }
  },
  "condition": {
    "compare": {
      "ctx.payload.hits.total": {
        "gt": 10
      }
    }
  },
  "actions": {
    "send_email": {
      "email": {
        "to": "admin@example.com",
        "subject": "Error Spike Alert",
        "body": "Found {{ctx.payload.hits.total}} errors in the last 5 minutes"
      }
    }
  }
}
```

---

## ⚙️ **Advanced Configuration**

### **1. Filebeat for File Logs**

```yaml
# filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/spring-app/*.log
    json.keys_under_root: true
    json.add_error_key: true

output.logstash:
  hosts: ["logstash:5044"]

# Update docker-compose.yml to include Filebeat
filebeat:
  image: docker.elastic.co/beats/filebeat:8.10.0
  container_name: filebeat
  volumes:
    - ./logs:/var/log/spring-app
    - ./filebeat.yml:/usr/share/filebeat/filebeat.yml
  networks:
    - elk
  depends_on:
    - logstash
```

### **2. Nginx as Reverse Proxy**

```yaml
# Add to docker-compose.yml
nginx:
  image: nginx:alpine
  container_name: nginx
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    - ./nginx/ssl:/etc/nginx/ssl
  networks:
    - elk
  depends_on:
    - kibana
    - elasticsearch
```

### **3. Metricbeat for System Metrics**

```yaml
# Add to docker-compose.yml
metricbeat:
  image: docker.elastic.co/beats/metricbeat:8.10.0
  container_name: metricbeat
  volumes:
    - ./metricbeat.yml:/usr/share/metricbeat/metricbeat.yml
    - /var/run/docker.sock:/var/run/docker.sock:ro
  networks:
    - elk
  depends_on:
    - elasticsearch
```

### **4. Elasticsearch Curator for Log Rotation**

```yaml
# curator.yml
actions:
  1:
    action: delete_indices
    description: "Delete indices older than 30 days"
    options:
      timeout_override: 300
      continue_if_exception: false
      disable_action: false
    filters:
      - filtertype: pattern
        kind: prefix
        value: app-logs-
      - filtertype: age
        source: creation_date
        direction: older
        unit: days
        unit_count: 30
```

---

## 🔧 **Troubleshooting**

### **Common Issues and Solutions**

| Problem                       | Symptoms                       | Solution                                      |
| ----------------------------- | ------------------------------ | --------------------------------------------- |
| **Elasticsearch won't start** | Container exits immediately    | Check memory: `docker logs elasticsearch`     |
| **No logs in Kibana**         | "No results found" in Discover | Check index pattern, verify Logstash pipeline |
| **High CPU usage**            | System slows down              | Reduce Java heap size, adjust sampling        |
| **Connection refused**        | Can't connect to ports         | Check if ports are already in use             |
| **Disk space full**           | Elasticsearch read-only        | Increase disk space, implement retention      |

### **Diagnostic Commands**

```bash
# Check container logs
docker-compose logs elasticsearch
docker-compose logs logstash
docker-compose logs kibana

# Check Elasticsearch indices
curl "localhost:9200/_cat/indices?v"

# Check Logstash pipeline
curl "localhost:9600/_node/pipeline?pretty"

# Test Logstash TCP input
echo '{"message":"test log"}' | nc localhost 5000

# Check disk usage
docker system df

# Restart services
docker-compose restart logstash
docker-compose restart elasticsearch

# Full reset (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

### **Monitoring Commands**

```bash
# Monitor resource usage
docker stats

# Check network connectivity
docker network inspect elk-stack-demo_elk

# View running processes in container
docker exec -it elasticsearch ps aux

# Check JVM heap
curl "localhost:9200/_cat/nodes?v&h=name,heap*"
```

---

## 🚀 **Production Considerations**

### **1. Security Hardening**

```yaml
# Enable security in elasticsearch.yml
xpack.security.enabled: true
xpack.security.http.ssl.enabled: true
xpack.security.transport.ssl.enabled: true

# Generate certificates
docker exec -it elasticsearch \
  bin/elasticsearch-certutil ca
docker exec -it elasticsearch \
  bin/elasticsearch-certutil cert --ca elastic-stack-ca.p12

# Set passwords
docker exec -it elasticsearch \
  bin/elasticsearch-setup-passwords auto
```

### **2. Performance Optimization**

```yaml
# Production docker-compose.yml adjustments
elasticsearch:
  environment:
    - "ES_JAVA_OPTS=-Xms4g -Xmx4g" # Adjust based on host RAM
    - indices.query.bool.max_clause_count=4096
    - thread_pool.write.queue_size=1000
  ulimits:
    memlock:
      soft: -1
      hard: -1
  deploy:
    resources:
      limits:
        memory: 8g
      reservations:
        memory: 4g
```

### **3. High Availability Setup**

```yaml
# Multi-node Elasticsearch cluster
elasticsearch-01:
  environment:
    - node.name=es-01
    - cluster.initial_master_nodes=es-01,es-02,es-03
    - discovery.seed_hosts=elasticsearch-01,elasticsearch-02,elasticsearch-03

elasticsearch-02:
  environment:
    - node.name=es-02
    - cluster.initial_master_nodes=es-01,es-02,es-03
    - discovery.seed_hosts=elasticsearch-01,elasticsearch-02,elasticsearch-03

elasticsearch-03:
  environment:
    - node.name=es-03
    - cluster.initial_master_nodes=es-01,es-02,es-03
    - discovery.seed_hosts=elasticsearch-01,elasticsearch-02,elasticsearch-03
```

### **4. Backup and Restore**

```bash
# Create snapshot repository
curl -X PUT "localhost:9200/_snapshot/my_backup" -H 'Content-Type: application/json' -d'
{
  "type": "fs",
  "settings": {
    "location": "/usr/share/elasticsearch/backups"
  }
}'

# Create snapshot
curl -X PUT "localhost:9200/_snapshot/my_backup/snapshot_1?wait_for_completion=true"

# Restore snapshot
curl -X POST "localhost:9200/_snapshot/my_backup/snapshot_1/_restore"
```

---

## 📝 **Quick Start Script**

Create a setup script for easy initialization:

```bash
#!/bin/bash
# setup-elk.sh

echo "🚀 Setting up ELK Stack with Docker..."

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p {elasticsearch/{config,data},logstash/{config,pipeline},kibana/config}

# Download configuration files
echo "📄 Downloading configuration files..."
curl -o docker-compose.yml https://raw.githubusercontent.com/your-repo/elk-stack/main/docker-compose.yml
curl -o elasticsearch/config/elasticsearch.yml https://raw.githubusercontent.com/your-repo/elk-stack/main/elasticsearch/config/elasticsearch.yml
curl -o logstash/pipeline/logstash.conf https://raw.githubusercontent.com/your-repo/elk-stack/main/logstash/pipeline/logstash.conf

# Start ELK stack
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to become healthy..."
sleep 60

# Verify installation
echo "✅ Verifying installation..."
curl -s http://localhost:9200/_cluster/health | grep -q '"status":"green"' && echo "Elasticsearch: ✓" || echo "Elasticsearch: ✗"
curl -s http://localhost:9600 | grep -q '"status":"green"' && echo "Logstash: ✓" || echo "Logstash: ✗"

echo "🎉 ELK Stack is running!"
echo "🔗 Access Kibana at: http://localhost:5601"
echo "📊 Elasticsearch API: http://localhost:9200"
echo "📨 Logstash TCP input: localhost:5000"
```

---

## 🎯 **Summary**

### **What We've Built:**

1. **✅ Complete ELK Stack** with Docker Compose
2. **✅ Spring Boot Integration** with structured JSON logging
3. **✅ Distributed Tracing** with Spring Cloud Sleuth
4. **✅ Kibana Dashboards** for visualization
5. **✅ Production-ready** configurations

### **Access Points:**

- **Kibana UI**: http://localhost:5601
- **Elasticsearch API**: http://localhost:920
