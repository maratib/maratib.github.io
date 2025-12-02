---
title: Actuator
description: Actuator is a production-ready feature that provides built-in endpoints to help you monitor and manage your application.
---

Spring Boot Actuator provides production-ready features to help you monitor and manage your application. It includes built-in endpoints that expose health, metrics, and other operational information.

### Key Features:

- **Health Monitoring**: Application and dependency health status
- **Metrics Collection**: Application metrics via Micrometer
- **Audit Events**: Security and application events
- **Environment Details**: Configuration properties and environment variables
- **HTTP Tracing**: Request/response tracing
- **Custom Endpoints**: Extensible framework for custom monitoring

---

## 2. Getting Started

### Prerequisites

- Java 17 or later
- Spring Boot 3.x
- Maven or Gradle

### Maven Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Optional: For web endpoints -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### Gradle Dependency

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'org.springframework.boot:spring-boot-starter-web'
}
```

### Basic Configuration

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
      base-path: /actuator
    enabled-by-default: true
```

---

## 3. Core Actuator Endpoints

### Health Endpoint (`/actuator/health`)

```yaml
management:
  endpoint:
    health:
      show-details: always
      show-components: always
      probes:
        enabled: true
```

### Info Endpoint (`/actuator/info`)

```yaml
info:
  app:
    name: My Application
    version: 1.0.0
    description: Spring Boot Actuator Demo
  java:
    version: ${java.version}
```

### Metrics Endpoint (`/actuator/metrics`)

```java
@RestController
public class DemoController {
    private final MeterRegistry meterRegistry;
    private final Counter customCounter;

    public DemoController(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.customCounter = Counter.builder("custom.requests")
            .description("Custom requests counter")
            .register(meterRegistry);
    }

    @GetMapping("/demo")
    public String demo() {
        customCounter.increment();
        meterRegistry.counter("http.requests", "uri", "/demo").increment();
        return "Hello Actuator!";
    }
}
```

### Other Essential Endpoints:

- `/actuator/env`: Environment properties
- `/actuator/beans`: Spring beans
- `/actuator/mappings`: URL mappings
- `/actuator/threaddump`: Thread dump
- `/actuator/heapdump`: Heap dump (binary)
- `/actuator/loggers`: Application loggers
- `/actuator/prometheus`: Prometheus metrics

---

## 4. Advanced Configuration

### Complete Configuration Example

```yaml
management:
  server:
    port: 9090 # Separate management port
    address: 127.0.0.1 # Bind to localhost only
    ssl:
      enabled: true
      key-store: classpath:keystore.p12
      key-store-password: changeit

  endpoints:
    web:
      exposure:
        include: "*"
        exclude: heapdump,threaddump
      base-path: /manage
      discovery:
        enabled: true
      cors:
        allowed-origins: "https://example.com"
        allowed-methods: GET,POST

    jmx:
      exposure:
        include: health,metrics

    enabled-by-default: true

  endpoint:
    health:
      show-details: when-authorized
      show-components: always
      roles: ADMIN
      probes:
        enabled: true
      group:
        liveness:
          include: livenessState
        readiness:
          include: readinessState,db,redis

    metrics:
      enabled: true
      distribution:
        percentiles-histogram:
          http.server.requests: true
        sla:
          http.server.requests: 100ms, 200ms, 500ms

    prometheus:
      enabled: true
      step: 1m

  health:
    defaults:
      enabled: true
    diskspace:
      enabled: true
      threshold: 10MB
    redis:
      enabled: true
      timeout: 2s

  info:
    defaults:
      enabled: true

  metrics:
    enable:
      all: true
    export:
      prometheus:
        enabled: true
        step: 1m
      datadog:
        enabled: false
      influx:
        enabled: false
    tags:
      application: ${spring.application.name}
      region: ${cloud.region:unknown}
    distribution:
      percentiles-histogram:
        http.server.requests: true

  tracing:
    sampling:
      probability: 1.0
```

### Conditional Endpoint Exposure

```java
@Configuration
public class ActuatorConfig {

    @Bean
    @ConditionalOnCloudPlatform(CloudPlatform.KUBERNETES)
    public EndpointFilter<ExposableEndpoint<?>> cloudEndpointFilter() {
        return endpoint -> {
            // Expose additional endpoints in cloud environment
            return endpoint instanceof HealthEndpoint ||
                   endpoint instanceof InfoEndpoint ||
                   endpoint instanceof PrometheusScrapeEndpoint;
        };
    }
}
```

---

## 5. Security and Access Control

### Spring Security Integration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/actuator/**")
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults())
            .csrf(csrf -> csrf.ignoringRequestMatchers("/actuator/**"));

        return http.build();
    }
}
```

### Role-Based Access Control

```yaml
management:
  endpoint:
    health:
      roles: MONITOR
    env:
      roles: ADMIN
    metrics:
      roles: MONITOR,ADMIN
```

### JWT Authentication for Actuator

```java
@Configuration
@EnableWebSecurity
public class ActuatorSecurityConfig {

    @Bean
    @Order(1)
    public SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/actuator/**")
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/actuator/health/**").permitAll()
                .requestMatchers("/actuator/info").permitAll()
                .requestMatchers("/actuator/prometheus").hasIpAddress("192.168.1.0/24")
                .requestMatchers("/actuator/**").hasAuthority("SCOPE_actuator")
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults())
            );

        return http.build();
    }
}
```

---

## 6. Health Indicators

### Built-in Health Indicators

```yaml
management:
  health:
    # Enable/disable specific health indicators
    db:
      enabled: true
    redis:
      enabled: true
    diskspace:
      enabled: true
      threshold: 10MB
    ping:
      enabled: true
    mail:
      enabled: false
```

### Custom Health Indicator

```java
@Component
public class CustomHealthIndicator implements HealthIndicator {

    private final ExternalServiceClient serviceClient;
    private boolean lastStatus = true;

    public CustomHealthIndicator(ExternalServiceClient serviceClient) {
        this.serviceClient = serviceClient;
    }

    @Override
    public Health health() {
        try {
            boolean isHealthy = serviceClient.checkHealth();
            lastStatus = isHealthy;

            if (isHealthy) {
                return Health.up()
                    .withDetail("responseTime", serviceClient.getLastResponseTime() + "ms")
                    .withDetail("version", "1.2.3")
                    .build();
            } else {
                return Health.down()
                    .withDetail("error", "Service unavailable")
                    .withDetail("lastSuccessfulCheck",
                        LocalDateTime.now().minusMinutes(5))
                    .build();
            }
        } catch (Exception e) {
            return Health.down(e)
                .withDetail("lastKnownStatus", lastStatus ? "UP" : "DOWN")
                .build();
        }
    }
}
```

### Composite Health Indicators

```java
@Component
public class DatabaseHealthIndicator extends AbstractHealthIndicator {

    private final DataSource dataSource;
    private final DatabaseProperties properties;

    public DatabaseHealthIndicator(DataSource dataSource,
                                   DatabaseProperties properties) {
        this.dataSource = dataSource;
        this.properties = properties;
    }

    @Override
    protected void doHealthCheck(Health.Builder builder) throws Exception {
        if (dataSource == null) {
            builder.down().withDetail("message", "DataSource not configured");
            return;
        }

        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();

            Health.Builder dbBuilder = builder.up()
                .withDetail("database", metaData.getDatabaseProductName())
                .withDetail("version", metaData.getDatabaseProductVersion())
                .withDetail("driver", metaData.getDriverName())
                .withDetail("maxConnections", properties.getMaxConnections());

            // Check connection pool status
            if (dataSource instanceof HikariDataSource) {
                HikariDataSource hikari = (HikariDataSource) dataSource;
                dbBuilder.withDetail("activeConnections", hikari.getHikariPoolMXBean().getActiveConnections())
                        .withDetail("idleConnections", hikari.getHikariPoolMXBean().getIdleConnections())
                        .withDetail("waitingThreads", hikari.getHikariPoolMXBean().getThreadsAwaitingConnection());
            }

        } catch (SQLException e) {
            builder.down(e)
                .withDetail("errorCode", e.getErrorCode())
                .withDetail("sqlState", e.getSQLState());
        }
    }
}
```

### Kubernetes Probes

```yaml
# For Kubernetes deployments
management:
  endpoint:
    health:
      probes:
        enabled: true
      group:
        liveness:
          include: livenessState
        readiness:
          include: readinessState,custom,db,redis
```

```java
@Component
public class LivenessStateHealthIndicator implements HealthIndicator {

    private final ApplicationEventPublisher eventPublisher;
    private volatile HealthComponent.Status status = HealthComponent.Status.UP;

    @EventListener
    public void onStateChange(AvailabilityChangeEvent<HealthComponent.Status> event) {
        this.status = event.getState();
    }

    @Override
    public Health health() {
        return status == HealthComponent.Status.UP ?
            Health.up().build() : Health.down().build();
    }
}
```

---

## 7. Metrics and Monitoring {#metrics}

### Micrometer Integration

```java
@Configuration
public class MetricsConfig {

    @Bean
    public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
        return registry -> registry.config()
            .commonTags(
                "application", "my-app",
                "environment", System.getenv().getOrDefault("ENV", "dev"),
                "instance", System.getenv().getOrDefault("HOSTNAME", "unknown")
            );
    }

    @Bean
    public TimedAspect timedAspect(MeterRegistry registry) {
        return new TimedAspect(registry);
    }

    @Bean
    public CountedAspect countedAspect(MeterRegistry registry) {
        return new CountedAspect(registry);
    }
}
```

### Custom Metrics

```java
@Service
public class OrderService {

    private final MeterRegistry meterRegistry;
    private final Counter orderCounter;
    private final DistributionSummary orderAmountSummary;
    private final Timer orderProcessingTimer;
    private final LongTaskTimer longRunningTaskTimer;

    public OrderService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;

        // Create custom counters
        this.orderCounter = Counter.builder("orders.total")
            .description("Total number of orders")
            .tag("type", "all")
            .register(meterRegistry);

        // Create distribution summary
        this.orderAmountSummary = DistributionSummary.builder("orders.amount")
            .description("Order amount distribution")
            .baseUnit("USD")
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(meterRegistry);

        // Create timer
        this.orderProcessingTimer = Timer.builder("orders.processing.time")
            .description("Time taken to process orders")
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(meterRegistry);

        // Create long task timer
        this.longRunningTaskTimer = LongTaskTimer.builder("orders.long.running")
            .description("Long running order processing tasks")
            .register(meterRegistry);
    }

    @Timed(value = "orders.process", extraTags = {"priority", "high"})
    @Counted(value = "orders.counted", description = "Counted orders")
    public Order processOrder(OrderRequest request) {
        return orderProcessingTimer.record(() -> {
            orderCounter.increment();
            orderAmountSummary.record(request.getAmount());

            // Business logic
            Order order = createOrder(request);

            // Simulate processing
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            return order;
        });
    }

    public void startLongRunningTask() {
        LongTaskTimer.Sample sample = longRunningTaskTimer.start();

        // Store sample ID for later stop
        CompletableFuture.runAsync(() -> {
            try {
                // Long running task
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                sample.stop();
            }
        });
    }
}
```

### Prometheus Configuration

```yaml
management:
  metrics:
    export:
      prometheus:
        enabled: true
        step: 1m
        descriptions: true
      datadog:
        enabled: false
        apiKey: ${DATADOG_API_KEY}
        step: 10s
      influx:
        enabled: false
        db: mydb
        uri: http://localhost:8086
        step: 10s

    tags:
      application: ${spring.application.name}
      instance: ${spring.application.instance-id:${random.value}}

    distribution:
      percentiles-histogram:
        http.server.requests: true
        http.client.requests: true
      sla:
        http.server.requests: 10ms, 50ms, 100ms, 200ms
```

### Grafana Dashboard Example

```json
{
  "dashboard": {
    "title": "Spring Boot Application Metrics",
    "panels": [
      {
        "title": "HTTP Requests Rate",
        "targets": [
          {
            "expr": "rate(http_server_requests_seconds_count[5m])",
            "legendFormat": "{{method}} {{uri}} {{status}}"
          }
        ]
      },
      {
        "title": "JVM Memory",
        "targets": [
          {
            "expr": "jvm_memory_used_bytes{area=\"heap\"}",
            "legendFormat": "{{instance}}"
          }
        ]
      }
    ]
  }
}
```

---

## 8. Custom Actuator Endpoints

### Creating Custom Endpoint

```java
@Component
@Endpoint(id = "features")
public class FeaturesEndpoint {

    private final List<Feature> features;

    public FeaturesEndpoint(FeatureService featureService) {
        this.features = featureService.getFeatures();
    }

    @ReadOperation
    public List<Feature> features() {
        return features;
    }

    @ReadOperation
    public Feature feature(@Selector String name) {
        return features.stream()
            .filter(f -> f.getName().equals(name))
            .findFirst()
            .orElse(null);
    }

    @WriteOperation
    public void enableFeature(@Selector String name, boolean enabled) {
        features.stream()
            .filter(f -> f.getName().equals(name))
            .findFirst()
            .ifPresent(f -> f.setEnabled(enabled));
    }

    @DeleteOperation
    public Feature deleteFeature(@Selector String name) {
        // Implementation
        return null;
    }
}

// Web-specific endpoint
@Component
@WebEndpoint(id = "webinfo")
public class WebInfoEndpoint {

    @ReadOperation
    public Map<String, Object> webInfo(WebServer webServer) {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("serverPort", webServer.getPort());
        info.put("contextPath", webServer.getContextPath());
        info.put("startupTime", webServer.getStartupTime());
        return info;
    }
}

// JMX-specific endpoint
@Component
@JmxEndpoint(id = "jmxinfo")
public class JmxInfoEndpoint {

    @ReadOperation
    public Map<String, Object> jmxInfo(MBeanServer mBeanServer) {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("mbeanCount", mBeanServer.getMBeanCount());
        return info;
    }
}
```

### Endpoint with Complex Operations

```java
@Component
@Endpoint(id = "cache")
public class CacheEndpoint {

    private final CacheManager cacheManager;

    public CacheEndpoint(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @ReadOperation
    public Map<String, Object> cacheInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("caches", cacheManager.getCacheNames());
        return info;
    }

    @ReadOperation
    public CacheStats cacheStats(@Selector String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache == null) {
            throw new NotFoundException("Cache not found: " + cacheName);
        }

        // Get native cache to access statistics
        if (cache.getNativeCache() instanceof com.github.benmanes.caffeine.cache.Cache) {
            com.github.benmanes.caffeine.cache.Cache<?, ?> caffeineCache =
                (com.github.benmanes.caffeine.cache.Cache<?, ?>) cache.getNativeCache();
            com.github.benmanes.caffeine.cache.stats.CacheStats stats =
                caffeineCache.stats();

            return CacheStats.builder()
                .hitCount(stats.hitCount())
                .missCount(stats.missCount())
                .loadSuccessCount(stats.loadSuccessCount())
                .loadFailureCount(stats.loadFailureCount())
                .totalLoadTime(stats.totalLoadTime())
                .evictionCount(stats.evictionCount())
                .evictionWeight(stats.evictionWeight())
                .build();
        }

        return null;
    }

    @WriteOperation
    public void clearCache(@Selector String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        }
    }

    @DeleteOperation
    public void evict(@Selector String cacheName, String key) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.evict(key);
        }
    }
}
```

### Reactive Custom Endpoint

```java
@Component
@Endpoint(id = "reactive")
public class ReactiveEndpoint {

    @ReadOperation
    public Mono<Map<String, Object>> reactiveInfo() {
        return Mono.fromCallable(() -> {
            Map<String, Object> info = new HashMap<>();
            info.put("timestamp", Instant.now());
            info.put("availableProcessors", Runtime.getRuntime().availableProcessors());
            info.put("freeMemory", Runtime.getRuntime().freeMemory());
            info.put("totalMemory", Runtime.getRuntime().totalMemory());
            return info;
        });
    }
}
```

---

## 9. Production Best Practices

### Security Checklist

```yaml
# production-actuator.yml
management:
  server:
    port: 9090
    address: 127.0.0.1 # Bind to localhost only
    ssl:
      enabled: true

  endpoints:
    web:
      exposure:
        include: health,info,prometheus
      base-path: /internal
      path-mapping:
        health: status
        prometheus: metrics

    jmx:
      enabled: false # Disable JMX in production if not needed

  endpoint:
    health:
      show-details: never
      show-components: on-demand
      probes:
        enabled: true

    prometheus:
      enabled: true

    shutdown:
      enabled: false # Never enable shutdown in production!

    heapdump:
      enabled: false # Can be enabled temporarily for debugging

    threaddump:
      enabled: false # Can be enabled temporarily for debugging

  metrics:
    export:
      prometheus:
        enabled: true
      datadog:
        enabled: true
        apiKey: ${DATADOG_API_KEY}
        step: 30s
    enable:
      jvm: true
      logback: true
      system: true
      process: true
      http: true
```

### Monitoring Setup

```java
@Configuration
public class ProductionMonitoringConfig {

    @Bean
    @Profile("prod")
    public MeterRegistryCustomizer<MeterRegistry> productionTags() {
        return registry -> registry.config()
            .commonTags(
                "environment", "production",
                "region", System.getenv().getOrDefault("AWS_REGION", "unknown"),
                "availabilityZone", System.getenv().getOrDefault("AWS_AZ", "unknown"),
                "service", "order-service"
            );
    }

    @Bean
    @Profile("prod")
    public InfluxMeterRegistry influxRegistry(InfluxConfig config) {
        return InfluxMeterRegistry.builder(config)
            .clock(Clock.SYSTEM)
            .build();
    }

    @Bean
    @Profile("prod")
    public NewRelicMeterRegistry newRelicRegistry(NewRelicConfig config) {
        return NewRelicMeterRegistry.builder(config)
            .clock(Clock.SYSTEM)
            .build();
    }
}
```

### Circuit Breaker Integration

```java
@Service
public class ResilientService {

    private final CircuitBreakerRegistry circuitBreakerRegistry;
    private final Timer timer;

    public ResilientService(CircuitBreakerRegistry circuitBreakerRegistry,
                           MeterRegistry meterRegistry) {
        this.circuitBreakerRegistry = circuitBreakerRegistry;
        this.timer = Timer.builder("external.service.call")
            .register(meterRegistry);
    }

    @Timed(value = "service.call", extraTags = {"type", "external"})
    public String callExternalService() {
        CircuitBreaker circuitBreaker = circuitBreakerRegistry
            .circuitBreaker("externalService");

        return circuitBreaker.executeSupplier(() -> {
            return timer.record(() -> {
                // External service call
                return externalClient.call();
            });
        });
    }
}
```

### Alerting Rules (Prometheus)

```yaml
# prometheus-rules.yml
groups:
  - name: spring-boot-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_server_requests_seconds_count{status=~"5.."}[5m]) / rate(http_server_requests_seconds_count[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.instance }}"
          description: "Error rate is {{ $value }} for {{ $labels.instance }}"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency on {{ $labels.instance }}"
          description: "95th percentile latency is {{ $value }}s"

      - alert: JVMMemoryUsage
        expr: jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"} > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High JVM heap usage on {{ $labels.instance }}"
          description: "Heap usage is {{ $value }}%"
```

---

## 10. Troubleshooting

### Common Issues and Solutions

#### Issue 1: Endpoints Not Accessible

```yaml
# Check these configurations:
management:
  endpoints:
    web:
      exposure:
        include: "*" # or specify endpoints explicitly
      base-path: /actuator # default
    enabled-by-default: true # ensure endpoints are enabled
```

#### Issue 2: Security Blocking Access

```java
// Ensure security configuration permits actuator access
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/actuator/**").permitAll()  // or hasRole("ACTUATOR")
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

#### Issue 3: Health Indicators Showing DOWN

```java
// Debug health indicators
@Component
public class DebugHealthIndicator implements HealthIndicator {

    private final ApplicationContext context;

    public DebugHealthIndicator(ApplicationContext context) {
        this.context = context;
    }

    @Override
    public Health health() {
        Map<String, HealthComponent> components = new HashMap<>();

        // Check all health indicators
        Map<String, HealthIndicator> indicators = context.getBeansOfType(HealthIndicator.class);
        indicators.forEach((name, indicator) -> {
            components.put(name, indicator.health());
        });

        return Health.composite(components).build();
    }
}
```

#### Issue 4: Metrics Not Showing

```yaml
# Enable metrics export
management:
  metrics:
    enable:
      all: true # or specify specific metrics
    export:
      prometheus:
        enabled: true
```

### Debugging Tools

```java
@RestController
@RequestMapping("/debug")
public class DebugController {

    private final MeterRegistry meterRegistry;

    public DebugController(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    @GetMapping("/metrics")
    public List<String> listMetrics() {
        return meterRegistry.getMeters().stream()
            .map(meter -> meter.getId().getName())
            .distinct()
            .collect(Collectors.toList());
    }

    @GetMapping("/metrics/{name}")
    public String getMetric(@PathVariable String name) {
        return meterRegistry.find(name).meters().stream()
            .map(meter -> meter.getId().toString())
            .collect(Collectors.joining("\n"));
    }
}
```

### Performance Considerations

```yaml
management:
  metrics:
    export:
      # Adjust for high-volume applications
      prometheus:
        step: 30s # Increase for high volume
      statsd:
        flavor: datadog
        max-packet-length: 1432 # Optimize for network

  tracing:
    sampling:
      probability: 0.1 # Sample only 10% of requests in high volume

  endpoint:
    metrics:
      enabled: true # Can be disabled if using Prometheus endpoint
```

### Logging Configuration

```yaml
logging:
  level:
    org.springframework.boot.actuate: INFO
    io.micrometer: INFO
    org.springframework.security: WARN

  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"

  file:
    name: logs/application.log
    max-size: 10MB
    max-history: 30
```
