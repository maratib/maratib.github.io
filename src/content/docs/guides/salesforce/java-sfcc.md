---
title: Jave with SFCC
description: Salesforce Commerce (SFCC)
date: 2025-08-02
---
 
# Java Spring Boot Third-Party Integration with Salesforce Commerce Cloud (SFCC)

Integrating a Java Spring Boot application with Salesforce Commerce Cloud (SFCC) enables seamless e-commerce operations such as product synchronization, order management, inventory updates, and customer data handling. This comprehensive guide covers everything from authentication to advanced data operations using REST APIs.

---


## 1. Understanding SFCC API Landscape

Before diving into code, it's essential to understand which APIs to use for different integration scenarios.

### OCAPI (Open Commerce API)

The legacy but stable API framework for SFCC integration .

| Aspect | Description |
|--------|-------------|
| **API Families** | Shop API (customer-facing), Data API (admin/backend), Meta API (discovery) |
| **Authentication** | OAuth 2.0 Client Credentials flow |
| **Best For** | Legacy integrations, complex custom logic |
| **Version Example** | `/dw/shop/v23_1/`, `/dw/data/v23_1/` |

### SCAPI (Salesforce Commerce API)

The modern API framework for headless and composable commerce .

| Aspect | Description |
|--------|-------------|
| **API Families** | Shopper APIs, Admin APIs |
| **Authentication** | SLAS (Shopper Login and API Access Service) |
| **Best For** | New integrations, headless storefronts |
| **Future** | Primary focus for Salesforce innovation |

### API Selection Guide

| Integration Scenario | Recommended API |
|---------------------|-----------------|
| New Spring Boot integration | SCAPI (future-proof) |
| Maintaining existing OCAPI integration | Continue with OCAPI |
| Complex custom business logic | OCAPI may still be required |
| Real-time inventory/pricing sync | SCAPI with caching |
| Bulk data operations | Bulk API or batch endpoints |

---

## 2. Prerequisites and Setup

### Required Credentials

Before coding, ensure you have the following from your Salesforce Commerce Cloud instance :

| Credential | Description | Where to Obtain |
|------------|-------------|-----------------|
| **Client ID** | OAuth 2.0 client identifier | Business Manager > Administration > OAuth Clients |
| **Client Secret** | OAuth 2.0 client secret | Same as above |
| **Instance URL** | Your SFCC instance domain | e.g., `your-instance.demandware.net` |
| **Site ID** | Your storefront site identifier | Business Manager > Sites |
| **Organization ID** | For SCAPI | Business Manager > Account Settings |

### Spring Boot Project Setup

Create a new Spring Boot project with the following dependencies:

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- HTTP Client -->
    <dependency>
        <groupId>com.squareup.okhttp3</groupId>
        <artifactId>okhttp</artifactId>
        <version>4.12.0</version>
    </dependency>
    
    <!-- JSON Processing -->
    <dependency>
        <groupId>com.google.code.gson</groupId>
        <artifactId>gson</artifactId>
        <version>2.10.1</version>
    </dependency>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>
    
    <!-- Resilience -->
    <dependency>
        <groupId>org.springframework.retry</groupId>
        <artifactId>spring-retry</artifactId>
    </dependency>
    <dependency>
        <groupId>io.github.resilience4j</groupId>
        <artifactId>resilience4j-spring-boot3</artifactId>
        <version>2.2.0</version>
    </dependency>
    
    <!-- Caching -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>
    <dependency>
        <groupId>com.github.ben-manes.caffeine</groupId>
        <artifactId>caffeine</artifactId>
    </dependency>
</dependencies>
```

### Application Configuration

Configure your `application.yml` with SFCC credentials :

```yaml
sfcc:
  ocapi:
    base-url: https://your-instance.demandware.net
    client-id: ${SFCC_CLIENT_ID}
    client-secret: ${SFCC_CLIENT_SECRET}
    site-id: SiteGenesis
    api-version: v23_1
  scapi:
    base-url: https://your-instance.demandware.net
    organization-id: ${SFCC_ORG_ID}
    short-code: ${SFCC_SHORT_CODE}
  token:
    url: https://account.demandware.com/dw/oauth2/access_token
    cache-ttl: 1500  # seconds (25 minutes, tokens expire at 30)
```

---

## 3. Authentication with OAuth 2.0

### The OAuth 2.0 Client Credentials Flow

SFCC APIs use the OAuth 2.0 Client Credentials flow for server-to-server authentication . This flow requires:
- **Client ID** and **Client Secret** for authentication
- No user interaction (machine-to-machine)
- Short-lived access tokens (30 minutes)

### Authentication Service Implementation

```java
package com.example.sfcc.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class SFCCAuthenticationService {
    
    private final WebClient webClient;
    private final String clientId;
    private final String clientSecret;
    private final String tokenUrl;
    
    // In-memory token cache (production should use Redis)
    private String cachedAccessToken;
    private long tokenExpiryTime;
    
    public SFCCAuthenticationService(
            @Value("${sfcc.ocapi.client-id}") String clientId,
            @Value("${sfcc.ocapi.client-secret}") String clientSecret,
            @Value("${sfcc.token.url}") String tokenUrl) {
        
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.tokenUrl = tokenUrl;
        this.webClient = WebClient.builder()
                .baseUrl(tokenUrl)
                .build();
    }
    
    /**
     * Obtains a valid access token, using cache if available.
     * This implements the OAuth 2.0 Client Credentials flow.
     */
    public Mono<String> getAccessToken() {
        // Check cache
        if (isTokenValid()) {
            return Mono.just(cachedAccessToken);
        }
        
        // Request new token
        return webClient.post()
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .bodyValue(String.format(
                    "grant_type=client_credentials&client_id=%s&client_secret=%s",
                    clientId, clientSecret))
                .retrieve()
                .bodyToMono(TokenResponse.class)
                .doOnNext(this::cacheToken)
                .map(TokenResponse::getAccessToken);
    }
    
    private boolean isTokenValid() {
        return cachedAccessToken != null && 
               System.currentTimeMillis() < tokenExpiryTime;
    }
    
    private void cacheToken(TokenResponse response) {
        this.cachedAccessToken = response.getAccessToken();
        this.tokenExpiryTime = System.currentTimeMillis() + 
                               (response.getExpiresIn() * 1000) - 60000; // 1 min buffer
    }
    
    // Token response DTO
    private static class TokenResponse {
        private String access_token;
        private int expires_in;
        
        public String getAccessToken() { return access_token; }
        public int getExpiresIn() { return expires_in; }
    }
}
```

### WebClient Configuration with Authentication

```java
package com.example.sfcc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class SFCCWebClientConfig {
    
    @Bean
    public WebClient sfccWebClient(WebClient.Builder builder,
                                   SFCCAuthenticationService authService,
                                   @Value("${sfcc.ocapi.base-url}") String baseUrl) {
        return builder
                .baseUrl(baseUrl)
                .filter((request, next) -> {
                    // Add bearer token to every request
                    return authService.getAccessToken()
                            .flatMap(token -> {
                                var newRequest = ClientRequest.from(request)
                                        .header("Authorization", "Bearer " + token)
                                        .build();
                                return next.exchange(newRequest);
                            });
                })
                .build();
    }
}
```

---

## 4. Building the SFCC API Client

### Product Service Implementation

The following example demonstrates retrieving product information from SFCC using OCAPI :

```java
package com.example.sfcc.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class SFCCProductService {
    
    private final WebClient sfccWebClient;
    private final String siteId;
    private final String apiVersion;
    
    public SFCCProductService(
            @Qualifier("sfccWebClient") WebClient sfccWebClient,
            @Value("${sfcc.ocapi.site-id}") String siteId,
            @Value("${sfcc.ocapi.api-version}") String apiVersion) {
        this.sfccWebClient = sfccWebClient;
        this.siteId = siteId;
        this.apiVersion = apiVersion;
    }
    
    /**
     * Retrieves a product by its ID using OCAPI Shop API.
     * GET /s/{siteId}/dw/shop/{apiVersion}/products/{productId}
     */
    public Mono<JsonNode> getProduct(String productId) {
        return sfccWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/s/{siteId}/dw/shop/{apiVersion}/products/{productId}")
                        .queryParam("select", "(**)" )  // Request all fields
                        .build(siteId, apiVersion, productId))
                .retrieve()
                .bodyToMono(JsonNode.class);
    }
    
    /**
     * Retrieves products with filtering and pagination.
     * Useful for catalog synchronization jobs.
     */
    public Mono<JsonNode> getProducts(int start, int count, String query) {
        return sfccWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/s/{siteId}/dw/shop/{apiVersion}/product_search")
                        .queryParam("start", start)
                        .queryParam("count", count)
                        .queryParam("q", query)
                        .build(siteId, apiVersion))
                .retrieve()
                .bodyToMono(JsonNode.class);
    }
}
```

### Product DTOs for Type Safety

For better type safety, define DTOs matching SFCC product structure:

```java
package com.example.sfcc.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SFCCProduct {
    private String id;
    private String name;
    private String longDescription;
    private String brand;
    private Price price;
    private List<VariationAttribute> variationAttributes;
    private List<Image> images;
    private Availability availability;
    
    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    // Nested DTOs
    public static class Price {
        private BigDecimal listPrice;
        private BigDecimal salePrice;
        // getters/setters
    }
    
    public static class VariationAttribute {
        private String id;
        private String name;
        private List<VariationValue> values;
        // getters/setters
    }
    
    public static class Availability {
        private boolean available;
        @JsonProperty("ats")
        private int availableToSell;
        // getters/setters
    }
}
```

---

## 5. Implementing Core Commerce Operations

### Order Management Service

Orders are the core transactional entities in SFCC. This service handles order creation, retrieval, and status updates .

```java
package com.example.sfcc.service;

import com.example.sfcc.dto.OrderRequest;
import com.example.sfcc.dto.OrderResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class SFCCOrderService {
    
    private final WebClient sfccWebClient;
    private final String siteId;
    private final String apiVersion;
    
    public SFCCOrderService(
            @Qualifier("sfccWebClient") WebClient sfccWebClient,
            @Value("${sfcc.ocapi.site-id}") String siteId,
            @Value("${sfcc.ocapi.api-version}") String apiVersion) {
        this.sfccWebClient = sfccWebClient;
        this.siteId = siteId;
        this.apiVersion = apiVersion;
    }
    
    /**
     * Creates an order from a basket using OCAPI.
     * This is the final step in checkout flow.
     */
    public Mono<OrderResponse> createOrder(String basketId, OrderRequest orderRequest) {
        return sfccWebClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/s/{siteId}/dw/shop/{apiVersion}/orders")
                        .build(siteId, apiVersion))
                .bodyValue(orderRequest)
                .retrieve()
                .bodyToMono(OrderResponse.class);
    }
    
    /**
     * Retrieves order details by order number.
     */
    public Mono<OrderResponse> getOrder(String orderNo) {
        return sfccWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/s/{siteId}/dw/shop/{apiVersion}/orders/{orderNo}")
                        .build(siteId, apiVersion, orderNo))
                .retrieve()
                .bodyToMono(OrderResponse.class);
    }
    
    /**
     * Updates order payment status (e.g., after payment capture).
     */
    public Mono<Void> updateOrderPaymentStatus(String orderNo, String paymentStatus) {
        return sfccWebClient.patch()
                .uri(uriBuilder -> uriBuilder
                        .path("/s/{siteId}/dw/shop/{apiVersion}/orders/{orderNo}")
                        .build(siteId, apiVersion, orderNo))
                .bodyValue(Map.of("paymentStatus", paymentStatus))
                .retrieve()
                .toBodilessEntity()
                .then();
    }
}
```

### Inventory Service

Inventory management is critical for accurate stock display and order fulfillment.

```java
package com.example.sfcc.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

@Service
public class SFCCInventoryService {
    
    private final WebClient sfccWebClient;
    private final String siteId;
    private final String apiVersion;
    
    /**
     * Retrieves inventory levels for multiple products in a single request.
     * Uses the product_search endpoint with inventory fields.
     */
    public Mono<JsonNode> getBulkInventory(List<String> productIds) {
        String query = String.format("id={%s}", String.join(",", productIds));
        
        return sfccWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/s/{siteId}/dw/shop/{apiVersion}/product_search")
                        .queryParam("q", query)
                        .queryParam("select", "id,inventory")
                        .build(siteId, apiVersion))
                .retrieve()
                .bodyToMono(JsonNode.class);
    }
    
    /**
     * Updates inventory for a specific product variant (size/color).
     * Note: This typically requires Data API access with higher privileges.
     */
    public Mono<Void> updateInventory(String productId, int availableToSell) {
        return sfccWebClient.patch()
                .uri(uriBuilder -> uriBuilder
                        .path("/dw/data/{apiVersion}/inventory/{productId}")
                        .build(apiVersion, productId))
                .bodyValue(Map.of("ats", availableToSell))
                .retrieve()
                .toBodilessEntity()
                .then();
    }
}
```

### Customer Management Service

```java
package com.example.sfcc.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class SFCCCustomerService {
    
    private final WebClient sfccWebClient;
    private final String siteId;
    private final String apiVersion;
    
    /**
     * Authenticates a customer and returns an access token.
     * This uses the Shopper Login API (SCAPI approach).
     */
    public Mono<CustomerAuthResponse> authenticateCustomer(String email, String password) {
        return sfccWebClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/dw/shop/{apiVersion}/customers/auth")
                        .build(apiVersion))
                .bodyValue(Map.of(
                    "type", "credentials",
                    "email", email,
                    "password", password
                ))
                .retrieve()
                .bodyToMono(CustomerAuthResponse.class);
    }
    
    /**
     * Retrieves customer profile including addresses and order history.
     */
    public Mono<CustomerProfile> getCustomerProfile(String customerId, String authToken) {
        return sfccWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/dw/shop/{apiVersion}/customers/{customerId}")
                        .queryParam("select", "(**)" )
                        .build(apiVersion, customerId))
                .header("Authorization", "Bearer " + authToken)
                .retrieve()
                .bodyToMono(CustomerProfile.class);
    }
}
```

---

## 6. Advanced Data Operations

### Bulk API for Large Data Volumes

For synchronizing large catalogs (thousands of products), use batch operations to reduce API calls .

```java
package com.example.sfcc.service;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class SFCCBatchService {
    
    private final WebClient sfccWebClient;
    private final String siteId;
    private final String apiVersion;
    
    /**
     * Batch product retrieval - up to 50 products per request.
     * Significantly reduces API calls for catalog sync jobs.
     */
    public Mono<JsonNode> getProductsBatch(List<String> productIds) {
        String ids = String.join(",", productIds);
        
        return sfccWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/s/{siteId}/dw/shop/{apiVersion}/products/({ids})")
                        .build(siteId, apiVersion, ids))
                .retrieve()
                .bodyToMono(JsonNode.class);
    }
    
    /**
     * Bulk price update using Data API batch endpoint.
     * Note: Requires Data API access with appropriate permissions.
     */
    public Mono<Void> bulkUpdatePrices(List<PriceUpdate> priceUpdates) {
        return sfccWebClient.patch()
                .uri(uriBuilder -> uriBuilder
                        .path("/dw/data/{apiVersion}/price_books/standard-price-book/price_table")
                        .build(apiVersion))
                .bodyValue(Map.of("prices", priceUpdates))
                .retrieve()
                .toBodilessEntity()
                .then();
    }
}
```

### Webhook Handling for Real-Time Events

Spring Boot can receive webhooks from SFCC when events occur (order placement, inventory changes).

```java
package com.example.sfcc.webhook;

import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/webhooks/sfcc")
public class SFCCWebhookController {
    
    private final OrderSyncService orderSyncService;
    private final InventoryUpdateService inventoryUpdateService;
    
    @PostMapping("/order-created")
    public Mono<Void> handleOrderCreated(@RequestBody OrderWebhookPayload payload) {
        // Validate webhook signature (security-critical)
        if (!isValidSignature(payload.getSignature())) {
            return Mono.error(new SecurityException("Invalid webhook signature"));
        }
        
        // Process order asynchronously
        return orderSyncService.syncToERP(payload.getOrderNo());
    }
    
    @PostMapping("/inventory-update")
    public Mono<Void> handleInventoryUpdate(@RequestBody InventoryWebhookPayload payload) {
        return inventoryUpdateService.processUpdate(payload);
    }
}
```

---

## 7. Error Handling and Resilience

### Retry Configuration

Implement retry logic with exponential backoff for transient failures :

```java
package com.example.sfcc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.backoff.ExponentialBackOffPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;

@Configuration
@EnableRetry
public class ResilienceConfig {
    
    @Bean
    public RetryTemplate sfccRetryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();
        
        ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
        backOffPolicy.setInitialInterval(1000);
        backOffPolicy.setMultiplier(2);
        backOffPolicy.setMaxInterval(30000);
        retryTemplate.setBackOffPolicy(backOffPolicy);
        
        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
        retryPolicy.setMaxAttempts(3);
        retryTemplate.setRetryPolicy(retryPolicy);
        
        return retryTemplate;
    }
}
```

### HTTP Status Code Handling

| Status Code | Meaning | Handling Strategy |
|-------------|---------|-------------------|
| 200-299 | Success | Normal processing |
| 400 | Bad Request | Log, fix request format |
| 401 | Unauthorized | Refresh token, retry |
| 403 | Forbidden | Check API permissions |
| 429 | Too Many Requests | Exponential backoff, reduce rate |
| 500-504 | Server Error | Retry with backoff |

### Global Error Handler

```java
package com.example.sfcc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import reactor.core.publisher.Mono;

@RestControllerAdvice
public class SFCCExceptionHandler {
    
    @ExceptionHandler(WebClientResponseException.class)
    public Mono<ErrorResponse> handleWebClientException(WebClientResponseException ex) {
        if (ex.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
            return Mono.just(new ErrorResponse("RATE_LIMITED", 
                "SFCC rate limit exceeded. Please retry after backoff."));
        }
        if (ex.getStatusCode().is5xxServerError()) {
            return Mono.just(new ErrorResponse("SFCC_SERVER_ERROR", 
                "SFCC service temporarily unavailable."));
        }
        return Mono.just(new ErrorResponse("API_ERROR", ex.getMessage()));
    }
}
```

---

## 8. Security Best Practices

### Credential Management

| Practice | Implementation |
|----------|----------------|
| **Never hardcode credentials** | Use environment variables or secrets manager  |
| **Rotate secrets regularly** | Implement automated rotation (e.g., every 90 days) |
| **Use dedicated API clients** | Separate client per integration |
| **Apply least privilege** | Grant only necessary permissions per client |

### Environment Variable Configuration

```yaml
# Never commit this file with real credentials
# Use environment variables in production
sfcc:
  ocapi:
    client-id: ${SFCC_CLIENT_ID}
    client-secret: ${SFCC_CLIENT_SECRET}
```

### Production Secret Management with AWS Secrets Manager

```java
@Service
public class SecretManagerService {
    
    @Value("${aws.secrets.sfcc-credentials}")
    private String secretName;
    
    public SFCCCredentials getCredentials() {
        GetSecretValueRequest request = GetSecretValueRequest.builder()
                .secretId(secretName)
                .build();
        
        GetSecretValueResponse response = secretsClient.getSecretValue(request);
        return parseCredentials(response.secretString());
    }
}
```

### Logging Sensitive Data

```java
// GOOD - Redact sensitive data
log.info("Authenticating with client ID: {}", mask(clientId));

// BAD - Never log full credentials
log.debug("Using client secret: {}", clientSecret);
```

---

## 9. Testing Strategies

### Unit Tests with MockWebServer

```java
package com.example.sfcc.service;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import reactor.test.StepVerifier;

class SFCCProductServiceTest {
    
    private MockWebServer mockWebServer;
    private SFCCProductService productService;
    
    @BeforeEach
    void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
        
        WebClient webClient = WebClient.builder()
                .baseUrl(mockWebServer.url("/").toString())
                .build();
        
        productService = new SFCCProductService(webClient, "SiteGenesis", "v23_1");
    }
    
    @Test
    void getProduct_ReturnsProduct_WhenSuccessful() {
        String mockResponse = """
            {
                "id": "PROD123",
                "name": "Test Product",
                "price": {"listPrice": 29.99}
            }
            """;
        
        mockWebServer.enqueue(new MockResponse()
                .setBody(mockResponse)
                .addHeader("Content-Type", "application/json"));
        
        StepVerifier.create(productService.getProduct("PROD123"))
                .expectNextMatches(product -> 
                    product.get("id").asText().equals("PROD123"))
                .verifyComplete();
    }
    
    @AfterEach
    void tearDown() throws IOException {
        mockWebServer.shutdown();
    }
}
```

### Integration Tests with Testcontainers

```java
@Testcontainers
@SpringBootTest
class SFCCIntegrationTest {
    
    @Container
    static WireMockContainer wiremock = new WireMockContainer("wiremock/wiremock:latest")
            .withMapping("sfcc-product.json", WireMock.get(urlEqualTo("/s/SiteGenesis/dw/shop/v23_1/products/PROD123"))
                    .willReturn(aResponse()
                        .withStatus(200)
                        .withBodyFile("product-response.json")));
    
    @Test
    void testProductSync() {
        // Integration test implementation
    }
}
```

---

## 10. Deployment Considerations

### Production Configuration Checklist

| Item | Action |
|------|--------|
| **Environment variables** | Set SFCC_CLIENT_ID, SFCC_CLIENT_SECRET in deployment environment |
| **Token caching** | Use Redis for distributed token cache in multi-instance deployments |
| **Rate limiting** | Implement client-side rate limiting to avoid 429 errors |
| **Health checks** | Add `/actuator/health` endpoint monitoring |
| **Log aggregation** | Send logs to CloudWatch, DataDog, or ELK stack |

### Kubernetes Deployment Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sfcc-integration-service
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: app
        image: sfcc-integration:latest
        env:
        - name: SFCC_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: sfcc-credentials
              key: client-id
        - name: SFCC_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              name: sfcc-credentials
              key: client-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

---

## 11. SFCC Spring Boot Integration Glossary

### A

**Access Token**
A short-lived credential (typically 30 minutes) obtained via OAuth 2.0 that must be included in the `Authorization: Bearer` header of all SFCC API requests .

**API Version**
SFCC APIs are versioned (e.g., `v23_1`). Always specify the version in API paths.

---

### C

**Client Credentials Flow**
OAuth 2.0 authentication flow for server-to-server integrations where the application acts on its own behalf, not a specific user .

**Client ID / Client Secret**
OAuth 2.0 credentials identifying your Spring Boot application to SFCC. Obtain these from Business Manager > Administration > OAuth Clients .

---

### D

**Data API**
OCAPI family for administrator and system integration access. Used for catalog updates, inventory management, and order processing from back-end systems.

---

### O

**OAuth 2.0**
Industry-standard authorization protocol. SFCC APIs require OAuth 2.0 Client Credentials flow for server-to-server authentication .

**OCAPI (Open Commerce API)**
Legacy SFCC API framework with Shop, Data, and Meta API families. Stable and well-documented but receiving no new feature development .

---

### P

**PK Chunking**
Performance optimization technique for Bulk API that splits large query result sets into manageable chunks .

---

### R

**Rate Limiting**
SFCC throttles API requests per client to ensure platform stability. HTTP 429 responses indicate rate limit exceeded—implement exponential backoff .

---

### S

**SCAPI (Salesforce Commerce API)**
Modern SFCC API framework introduced for headless and composable commerce. The recommended choice for new Spring Boot integrations .

**Security Token**
Additional credential appended to password when authenticating OCAPI Data API calls .

**Shop API**
OCAPI family for customer-facing operations: product browsing, basket management, checkout, and order submission.

**Shopper API**
SCAPI family for customer-facing operations including Shopper Products, Shopper Baskets, Shopper Orders, and Shopper Customers.

**Site ID**
Identifier for your storefront within SFCC (e.g., `SiteGenesis`). Required in most Shop API calls.

---

### W

**WebClient**
Spring WebFlux's reactive HTTP client. Preferred over RestTemplate for non-blocking SFCC integrations.

---

## Summary

Integrating Java Spring Boot applications with Salesforce Commerce Cloud requires understanding OAuth 2.0 authentication, REST API patterns, and enterprise integration best practices. By following this guide, you can build robust, scalable integrations that handle product synchronization, order management, inventory updates, and customer data flows.

**Key Takeaways:**

- **API selection matters** - Use SCAPI for new projects, OCAPI for maintaining legacy integrations 
- **OAuth 2.0 Client Credentials** is the authentication method for server-to-server integration 
- **Cache access tokens** to avoid excessive authentication requests (tokens expire at 30 minutes)
- **Implement retry logic** with exponential backoff for transient failures and rate limits 
- **Use batch operations** to reduce API calls and improve throughput
- **Never hardcode credentials** - use environment variables or secrets managers 
- **Log everything** - comprehensive logging is essential for debugging integration issues

**Getting Started Recommendations:**
1. Create OAuth API Client in SFCC Business Manager
2. Set up your Spring Boot project with WebClient
3. Implement token retrieval and caching
4. Start with a simple product retrieval endpoint
5. Add error handling and retry logic
6. Deploy with proper credential management
