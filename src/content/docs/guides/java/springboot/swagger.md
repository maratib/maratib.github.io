---
title: Swagger
description: Swagger
---

**Swagger/OpenAPI with Spring Boot: Complete Guide from Scratch to Pro**

## 1. Introduction to Swagger/OpenAPI

Swagger (now OpenAPI) is a specification for documenting RESTful APIs. SpringDoc OpenAPI is the most popular implementation for Spring Boot applications.

### Key Benefits:

- **Interactive API Documentation**: Test endpoints directly from browser
- **Client SDK Generation**: Generate client code in multiple languages
- **API Design First**: Design API before implementation
- **Validation**: Validate API requests and responses
- **Security Documentation**: Document authentication methods

### SpringDoc vs Springfox:

- **SpringDoc**: Modern, supports OpenAPI 3.0, actively maintained
- **Springfox**: Legacy, limited support, not recommended for new projects

---

## 2. Getting Started with SpringDoc OpenAPI

### Prerequisites

- Java 17+
- Spring Boot 3.x
- Maven or Gradle

### Maven Dependencies

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>

<!-- Optional: For reactive support -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webflux-ui</artifactId>
    <version>2.5.0</version>
</dependency>

<!-- For API-first approach -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-common</artifactId>
    <version>2.5.0</version>
</dependency>
```

### Gradle Dependencies

```gradle
dependencies {
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0'

    // For reactive applications
    implementation 'org.springdoc:springdoc-openapi-starter-webflux-ui:2.5.0'

    // Optional: Swagger Annotations
    implementation 'io.swagger.core.v3:swagger-annotations:2.2.20'
}
```

### Basic Configuration

```yaml
# application.yml
springdoc:
  api-docs:
    path: /api-docs
    enabled: true
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
    operationsSorter: method
    tagsSorter: alpha
    try-it-out-enabled: true
    filter: true
  packages-to-scan: com.example.api
  paths-to-match: /api/**
  show-actuator: false
```

### Basic Controller Example

```java
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {

    @GetMapping
    @Operation(
        summary = "Get all users",
        description = "Retrieves a list of all users with pagination support"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved users"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    public ResponseEntity<Page<UserResponse>> getUsers(
            @Parameter(description = "Page number", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "10")
            @RequestParam(defaultValue = "10") int size) {
        // Implementation
        return ResponseEntity.ok(userService.getUsers(page, size));
    }
}
```

---

## 3. Basic API Documentation

### Annotations Overview

#### @Tag - Controller/API Grouping

```java
@RestController
@RequestMapping("/api/v1/products")
@Tag(
    name = "Product Management",
    description = "APIs for managing products in the catalog",
    externalDocs = @ExternalDocumentation(
        description = "Product API Documentation",
        url = "https://example.com/docs/products"
    )
)
public class ProductController {
    // Controller methods
}
```

#### @Operation - Method Documentation

```java
@PostMapping
@Operation(
    summary = "Create a new product",
    description = "Creates a new product in the system. Requires ADMIN role.",
    operationId = "createProduct",
    tags = {"Product Management"},
    security = @SecurityRequirement(name = "bearerAuth"),
    requestBody = @RequestBody(
        description = "Product data",
        required = true,
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ProductRequest.class),
            examples = {
                @ExampleObject(
                    name = "Simple Product",
                    summary = "A simple product example",
                    value = """
                        {
                          "name": "Smartphone",
                          "description": "Latest smartphone model",
                          "price": 999.99,
                          "category": "ELECTRONICS",
                          "stock": 100
                        }
                        """
                )
            }
        )
    )
)
public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
            .body(productService.createProduct(request));
}
```

#### @Parameter - Parameter Documentation

```java
@GetMapping("/search")
@Operation(summary = "Search products")
public ResponseEntity<List<ProductResponse>> searchProducts(
        @Parameter(
            name = "keyword",
            description = "Search keyword for product name or description",
            example = "laptop",
            required = false,
            schema = @Schema(type = "string", minLength = 2)
        ) @RequestParam(required = false) String keyword,

        @Parameter(
            name = "minPrice",
            description = "Minimum price filter",
            example = "100.00",
            required = false,
            schema = @Schema(type = "number", format = "double", minimum = "0")
        ) @RequestParam(required = false) Double minPrice,

        @Parameter(
            name = "maxPrice",
            description = "Maximum price filter",
            example = "1000.00",
            required = false,
            schema = @Schema(type = "number", format = "double")
        ) @RequestParam(required = false) Double maxPrice,

        @Parameter(
            name = "categories",
            description = "Product categories to filter",
            example = "[\"ELECTRONICS\", \"COMPUTERS\"]",
            required = false,
            schema = @Schema(
                type = "array",
                implementation = String.class,
                allowableValues = {"ELECTRONICS", "COMPUTERS", "BOOKS", "CLOTHING"}
            )
        ) @RequestParam(required = false) List<String> categories) {
    // Implementation
}
```

### Schema Documentation

#### DTO Classes with @Schema

```java
@Schema(description = "User registration request")
public class UserRegistrationRequest {

    @Schema(
        description = "User's full name",
        example = "John Doe",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minLength = 2,
        maxLength = 100
    )
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;

    @Schema(
        description = "Valid email address",
        example = "john.doe@example.com",
        requiredMode = Schema.RequiredMode.REQUIRED,
        pattern = "^[A-Za-z0-9+_.-]+@(.+)$"
    )
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Schema(
        description = "Password (8-20 characters)",
        example = "SecurePass123!",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minLength = 8,
        maxLength = 20,
        format = "password"
    )
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$",
        message = "Password must contain at least one digit, one lowercase, one uppercase, one special character"
    )
    private String password;

    @Schema(
        description = "User role",
        example = "USER",
        allowableValues = {"USER", "ADMIN", "MODERATOR"},
        defaultValue = "USER"
    )
    private String role = "USER";

    // Getters and setters
}
```

#### Response DTO

```java
@Schema(description = "User response with details")
public class UserResponse {

    @Schema(description = "User ID", example = "123")
    private Long id;

    @Schema(description = "User name", example = "John Doe")
    private String name;

    @Schema(description = "User email", example = "john.doe@example.com")
    private String email;

    @Schema(
        description = "Account status",
        example = "ACTIVE",
        allowableValues = {"ACTIVE", "INACTIVE", "SUSPENDED"}
    )
    private String status;

    @Schema(description = "Registration date", example = "2024-01-15T10:30:00Z")
    private LocalDateTime registeredAt;

    @Schema(description = "Last login timestamp", example = "2024-01-20T14:25:00Z")
    private LocalDateTime lastLogin;

    @Schema(description = "User roles")
    private Set<RoleResponse> roles;

    // Nested DTO
    @Schema(description = "User address")
    private AddressResponse address;

    // Getters and setters
}

@Schema(description = "Address information")
public class AddressResponse {
    @Schema(description = "Street address", example = "123 Main St")
    private String street;

    @Schema(description = "City", example = "New York")
    private String city;

    @Schema(description = "Postal code", example = "10001")
    private String postalCode;

    @Schema(description = "Country code", example = "US")
    private String country;
}
```

---

## 4. Advanced Configuration

### Complete Configuration Example

```yaml
# application.yml
springdoc:
  api-docs:
    path: /v3/api-docs
    enabled: true
    groups:
      enabled: true
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
    display-request-duration: true
    doc-expansion: none
    filter: true
    operations-sorter: alpha
    tags-sorter: alpha
    default-models-expand-depth: 2
    default-model-expand-depth: 2
    validator-url: ""
    syntax-highlight:
      activated: true
      theme: monokai
    try-it-out-enabled: true
    persist-authorization: true
    with-credentials: true
    display-operation-id: false
    use-root-path: false
    tags-sorter: alpha
    default-model-rendering: example
    show-common-extensions: true
    query-config-enabled: true
    default-fields-expand-level: 1
    deep-linking: true
    layout: BaseLayout
    request-snippets-enabled: true
    show-extensions: true
    show-common-extensions: true
    supported-submit-methods:
      - get
      - post
      - put
      - delete
      - patch
      - head
      - options
      - trace

  cache:
    disabled: false

  packages-to-scan: com.example.api
  paths-to-match: /api/**
  default-consumes-media-type: application/json
  default-produces-media-type: application/json
  model-and-view-allowed: false
  override-with-generic-response: false
  writer-with-default-pretty-printer: false

  # Actuator integration
  show-actuator: true
  actuator:
    default-consumes-media-type: application/json
    default-produces-media-type: application/json
```

### Programmatic Configuration

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("E-Commerce Platform API")
                .version("1.0.0")
                .description("API documentation for E-Commerce Platform")
                .termsOfService("https://example.com/terms")
                .contact(new Contact()
                    .name("API Support")
                    .url("https://example.com/support")
                    .email("support@example.com"))
                .license(new License()
                    .name("Apache 2.0")
                    .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
            .externalDocs(new ExternalDocumentation()
                .description("Complete documentation")
                .url("https://docs.example.com"))
            .servers(List.of(
                new Server()
                    .url("https://api.example.com")
                    .description("Production server"),
                new Server()
                    .url("https://staging-api.example.com")
                    .description("Staging server"),
                new Server()
                    .url("http://localhost:8080")
                    .description("Local development")
            ))
            .tags(List.of(
                new Tag()
                    .name("User Management")
                    .description("Operations about users"),
                new Tag()
                    .name("Product Management")
                    .description("Operations about products"),
                new Tag()
                    .name("Order Management")
                    .description("Operations about orders")
            ))
            .components(new Components()
                .addSchemas("ErrorResponse", new Schema<ErrorResponse>()
                    .type("object")
                    .addProperty("timestamp", new Schema<String>()
                        .type("string")
                        .format("date-time")
                        .example("2024-01-15T10:30:00Z"))
                    .addProperty("status", new Schema<Integer>()
                        .type("integer")
                        .format("int32")
                        .example(400))
                    .addProperty("error", new Schema<String>()
                        .type("string")
                        .example("Bad Request"))
                    .addProperty("message", new Schema<String>()
                        .type("string")
                        .example("Invalid request parameters"))
                    .addProperty("path", new Schema<String>()
                        .type("string")
                        .example("/api/v1/users"))));
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
            .group("public")
            .pathsToMatch("/api/v1/public/**")
            .addOpenApiCustomizer(openApi -> {
                openApi.info(new Info()
                    .title("Public API")
                    .description("Publicly accessible APIs")
                    .version("1.0.0"));
            })
            .build();
    }

    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
            .group("admin")
            .pathsToMatch("/api/v1/admin/**")
            .addOpenApiCustomizer(openApi -> {
                openApi.info(new Info()
                    .title("Admin API")
                    .description("Administrative APIs")
                    .version("1.0.0"));

                // Add security requirement for admin API
                openApi.addSecurityItem(new SecurityRequirement()
                    .addList("bearerAuth", List.of("write:admin", "read:admin")));
            })
            .build();
    }

    @Bean
    public GroupedOpenApi internalApi() {
        return GroupedOpenApi.builder()
            .group("internal")
            .pathsToMatch("/api/v1/internal/**")
            .pathsToExclude("/api/v1/internal/health")
            .build();
    }
}
```

### Custom Schema Resolver

```java
@Component
public class CustomSchemaResolver implements SchemaResolver {

    @Override
    public ResolvedSchema resolveSchema(ResolvedSchema resolvedSchema,
                                        AnnotatedType type,
                                        SchemaResolverContext context) {
        Class<?> schemaClass = type.getType().getErasedType();

        if (schemaClass == Page.class) {
            // Customize Page schema
            Schema<?> pageSchema = new Schema<>();
            pageSchema.name("Page");
            pageSchema.addProperty("content", new ArraySchema()
                .items(new Schema<>().type("object")));
            pageSchema.addProperty("pageable", new Schema<>().type("object"));
            pageSchema.addProperty("totalElements", new Schema<>()
                .type("integer")
                .format("int64"));
            pageSchema.addProperty("totalPages", new Schema<>()
                .type("integer")
                .format("int32"));
            pageSchema.addProperty("last", new Schema<>().type("boolean"));
            pageSchema.addProperty("size", new Schema<>()
                .type("integer")
                .format("int32"));
            pageSchema.addProperty("number", new Schema<>()
                .type("integer")
                .format("int32"));
            pageSchema.addProperty("sort", new Schema<>().type("object"));
            pageSchema.addProperty("first", new Schema<>().type("boolean"));
            pageSchema.addProperty("numberOfElements", new Schema<>()
                .type("integer")
                .format("int32"));
            pageSchema.addProperty("empty", new Schema<>().type("boolean"));

            return new ResolvedSchema()
                .schema(pageSchema)
                .schemaModel(new ModelImpl().type("object"));
        }

        return resolvedSchema;
    }
}
```

---

## 5. Security Integration

### Security Scheme Configuration

```java
@Configuration
public class OpenApiSecurityConfig {

    @Bean
    public OpenAPI customOpenAPIWithSecurity() {
        final String securitySchemeName = "bearerAuth";
        final String apiKeySchemeName = "apiKey";

        return new OpenAPI()
            .addSecurityItem(new SecurityRequirement()
                .addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName,
                    new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("""
                            Provide JWT token in format: Bearer {token}
                            You can obtain the token from the /api/v1/auth/login endpoint
                            """)
                )
                .addSecuritySchemes(apiKeySchemeName,
                    new SecurityScheme()
                        .name("X-API-Key")
                        .type(SecurityScheme.Type.APIKEY)
                        .in(SecurityScheme.In.HEADER)
                        .description("API key for external services")
                )
                .addSecuritySchemes("basicAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("basic")
                        .description("Basic authentication")
                )
                .addSecuritySchemes("oauth2",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.OAUTH2)
                        .flows(new OAuthFlows()
                            .authorizationCode(new OAuthFlow()
                                .authorizationUrl("https://example.com/oauth/authorize")
                                .tokenUrl("https://example.com/oauth/token")
                                .refreshUrl("https://example.com/oauth/refresh")
                                .scopes(new Scopes()
                                    .addString("read", "Read access")
                                    .addString("write", "Write access")
                                    .addString("admin", "Admin access"))
                            )
                        )
                )
            );
    }
}
```

### Method-Level Security Documentation

```java
@RestController
@RequestMapping("/api/v1/orders")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    @GetMapping("/{id}")
    @Operation(
        summary = "Get order by ID",
        security = @SecurityRequirement(name = "bearerAuth", scopes = {"read:orders"}),
        parameters = {
            @Parameter(
                name = "id",
                description = "Order ID",
                required = true,
                in = ParameterIn.PATH,
                schema = @Schema(type = "string", format = "uuid")
            )
        }
    )
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable UUID id) {
        // Implementation
    }

    @PostMapping
    @Operation(
        summary = "Create new order",
        security = @SecurityRequirement(name = "bearerAuth", scopes = {"write:orders"}),
        requestBody = @RequestBody(
            description = "Order data",
            required = true,
            content = @Content(
                schema = @Schema(implementation = OrderRequest.class)
            )
        )
    )
    @PreAuthorize("hasRole('USER')")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@Valid @RequestBody OrderRequest request) {
        // Implementation
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Delete order",
        security = @SecurityRequirement(name = "bearerAuth", scopes = {"admin:orders"}),
        parameters = {
            @Parameter(
                name = "id",
                description = "Order ID",
                required = true,
                in = ParameterIn.PATH
            )
        }
    )
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable Long id) {
        // Implementation
    }
}
```

### Spring Security Integration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/**", "/swagger-ui/**", "/v3/api-docs/**")
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/webjars/**",
                    "/swagger-resources/**"
                ).permitAll()
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .csrf(csrf -> csrf.ignoringRequestMatchers(
                "/swagger-ui/**",
                "/v3/api-docs/**",
                "/api/**"
            ))
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults())
            );

        return http.build();
    }
}
```

---

## 6. Customizing Documentation {#customizing}

### Custom Model Converters

```java
@Component
public class PageableModelConverter implements ModelConverter {

    @Override
    public ResolvedSchema resolve(
            SchemaResolverContext context,
            ModelConverterContextChain chain,
            AnnotatedType type) {

        if (type.getType() instanceof Class) {
            Class<?> clazz = (Class<?>) type.getType();

            if (Pageable.class.isAssignableFrom(clazz)) {
                Schema<?> schema = new Schema<>();
                schema.addProperty("page", new Schema<Integer>()
                    .type("integer")
                    .format("int32")
                    .description("Page number (0-indexed)")
                    .example(0));
                schema.addProperty("size", new Schema<Integer>()
                    .type("integer")
                    .format("int32")
                    .description("Page size")
                    .example(20));
                schema.addProperty("sort", new Schema<String>()
                    .type("string")
                    .description("Sort properties in format: property(,asc|desc)")
                    .example("createdAt,desc"));

                return new ResolvedSchema()
                    .schema(schema)
                    .schemaModel(new ModelImpl().type("object"));
            }
        }

        return chain.resolve(context, type);
    }
}
```

### Custom Operation Customizer

```java
@Component
public class GlobalOperationCustomizer implements OperationCustomizer {

    @Override
    public Operation customize(Operation operation, HandlerMethod handlerMethod) {

        // Add global parameters
        if (operation.getParameters() == null) {
            operation.setParameters(new ArrayList<>());
        }

        // Add correlation ID header
        operation.addParametersItem(new Parameter()
            .in("header")
            .name("X-Correlation-ID")
            .description("Correlation ID for request tracking")
            .schema(new Schema<String>()
                .type("string")
                .format("uuid"))
            .required(false));

        // Add request timestamp header
        operation.addParametersItem(new Parameter()
            .in("header")
            .name("X-Request-Timestamp")
            .description("Request timestamp in ISO 8601 format")
            .schema(new Schema<String>()
                .type("string")
                .format("date-time"))
            .required(false));

        // Add global responses
        if (operation.getResponses() == null) {
            operation.setResponses(new ApiResponses());
        }

        operation.getResponses().addApiResponse("400",
            new ApiResponse()
                .description("Bad Request")
                .content(new Content()
                    .addMediaType("application/json",
                        new MediaType().schema(new Schema<ErrorResponse>()
                            .$ref("#/components/schemas/ErrorResponse")))));

        operation.getResponses().addApiResponse("401",
            new ApiResponse()
                .description("Unauthorized")
                .content(new Content()
                    .addMediaType("application/json",
                        new MediaType().schema(new Schema<ErrorResponse>()
                            .$ref("#/components/schemas/ErrorResponse")))));

        operation.getResponses().addApiResponse("500",
            new ApiResponse()
                .description("Internal Server Error")
                .content(new Content()
                    .addMediaType("application/json",
                        new MediaType().schema(new Schema<ErrorResponse>()
                            .$ref("#/components/schemas/ErrorResponse")))));

        return operation;
    }
}
```

### Customizing Swagger UI

```java
@Configuration
public class SwaggerUIConfig {

    @Bean
    public SwaggerUiConfigProperties swaggerUiConfig() {
        SwaggerUiConfigProperties config = new SwaggerUiConfigProperties();

        config.setTryItOutEnabled(true);
        config.setPersistAuthorization(true);
        config.setDisplayRequestDuration(true);
        config.setDefaultModelsExpandDepth(2);
        config.setDefaultModelExpandDepth(2);
        config.setDisplayOperationId(false);
        config.setDocExpansion(DocExpansion.LIST);
        config.setFilter(true);
        config.setMaxDisplayedTags(20);
        config.setShowExtensions(true);
        config.setShowCommonExtensions(true);
        config.setSupportedSubmitMethods(
            SwaggerUiConfigProperties.SubmitMethod.GET,
            SwaggerUiConfigProperties.SubmitMethod.POST,
            SwaggerUiConfigProperties.SubmitMethod.PUT,
            SwaggerUiConfigProperties.SubmitMethod.DELETE,
            SwaggerUiConfigProperties.SubmitMethod.PATCH
        );

        // Custom OAuth configuration
        config.setOauth2RedirectUrl("http://localhost:8080/swagger-ui/oauth2-redirect.html");

        return config;
    }

    @Bean
    public SwaggerUiOAuthProperties swaggerUiOAuthProperties() {
        SwaggerUiOAuthProperties oauth = new SwaggerUiOAuthProperties();
        oauth.setClientId("swagger-ui");
        oauth.setClientSecret("secret");
        oauth.setUsePkceWithAuthorizationCodeGrant(true);

        return oauth;
    }
}
```

### Internationalization Support

```java
@Configuration
public class OpenApiI18nConfig {

    @Bean
    @Primary
    public OpenAPI openAPI(LocaleResolver localeResolver) {
        return new OpenAPI()
            .info(new Info()
                .title(getLocalizedTitle())
                .description(getLocalizedDescription())
                .version("1.0.0"));
    }

    private String getLocalizedTitle() {
        Locale locale = LocaleContextHolder.getLocale();

        return switch (locale.getLanguage()) {
            case "es" -> "Plataforma de Comercio Electrónico API";
            case "fr" -> "API de Plateforme de Commerce Électronique";
            case "de" -> "E-Commerce-Plattform-API";
            default -> "E-Commerce Platform API";
        };
    }

    private String getLocalizedDescription() {
        Locale locale = LocaleContextHolder.getLocale();

        return switch (locale.getLanguage()) {
            case "es" -> "Documentación de API para la Plataforma de Comercio Electrónico";
            case "fr" -> "Documentation API pour la Plateforme de Commerce Électronique";
            case "de" -> "API-Dokumentation für die E-Commerce-Plattform";
            default -> "API documentation for E-Commerce Platform";
        };
    }
}
```

---

## 7. Testing with Swagger UI

### Test Data Preparation

```java
@Component
public class SwaggerTestData {

    @PostConstruct
    public void initializeTestData() {
        // This data will be available in Swagger examples
    }
}

@RestController
@RequestMapping("/api/v1/test")
@Tag(name = "Testing", description = "API testing utilities")
public class TestController {

    @PostMapping("/auth/login")
    @Operation(summary = "Get authentication token for testing")
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Successfully authenticated",
            content = @Content(
                schema = @Schema(implementation = AuthResponse.class),
                examples = {
                    @ExampleObject(
                        name = "Admin token",
                        value = """
                            {
                              "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                              "tokenType": "Bearer",
                              "expiresIn": 3600,
                              "roles": ["ROLE_ADMIN", "ROLE_USER"]
                            }
                            """
                    ),
                    @ExampleObject(
                        name = "User token",
                        value = """
                            {
                              "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                              "tokenType": "Bearer",
                              "expiresIn": 3600,
                              "roles": ["ROLE_USER"]
                            }
                            """
                    )
                }
            )
        )
    })
    public ResponseEntity<AuthResponse> getTestToken(
            @Parameter(description = "User role for test token",
                      example = "ADMIN")
            @RequestParam(defaultValue = "USER") String role) {

        // Generate test token based on role
        String token = generateTestToken(role);

        AuthResponse response = AuthResponse.builder()
            .accessToken(token)
            .tokenType("Bearer")
            .expiresIn(3600)
            .roles(List.of("ROLE_" + role.toUpperCase()))
            .build();

        return ResponseEntity.ok(response);
    }

    private String generateTestToken(String role) {
        // Generate JWT token for testing
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                + "test-token-for-" + role.toLowerCase();
    }
}
```

### Automated API Testing

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "springdoc.api-docs.enabled=true",
    "springdoc.swagger-ui.enabled=true"
})
class OpenApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testOpenApiDocumentation() throws Exception {
        // Test that OpenAPI documentation is generated
        mockMvc.perform(get("/v3/api-docs"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.openapi").value("3.0.1"))
            .andExpect(jsonPath("$.info.title").exists())
            .andExpect(jsonPath("$.paths").exists());
    }

    @Test
    void testSwaggerUi() throws Exception {
        // Test that Swagger UI is accessible
        mockMvc.perform(get("/swagger-ui.html"))
            .andExpect(status().isOk());
    }

    @Test
    void testApiSpecConformity() throws Exception {
        // Validate API spec against OpenAPI 3.0 schema
        String apiSpec = mockMvc.perform(get("/v3/api-docs"))
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Parse and validate
        OpenAPIV3Parser parser = new OpenAPIV3Parser();
        SwaggerParseResult result = parser.readContents(apiSpec);

        assertTrue(result.getMessages().isEmpty(),
            "OpenAPI spec should be valid");
        assertNotNull(result.getOpenAPI(),
            "OpenAPI spec should be parseable");
    }
}
```

---

## 8. Code Generation

### OpenAPI Generator Configuration

```xml
<!-- pom.xml -->
<build>
    <plugins>
        <plugin>
            <groupId>org.openapitools</groupId>
            <artifactId>openapi-generator-maven-plugin</artifactId>
            <version>7.0.0</version>
            <executions>
                <execution>
                    <goals>
                        <goal>generate</goal>
                    </goals>
                    <configuration>
                        <inputSpec>${project.basedir}/src/main/resources/api/openapi.yaml</inputSpec>
                        <generatorName>spring</generatorName>
                        <apiPackage>com.example.api.generated</apiPackage>
                        <modelPackage>com.example.api.generated.model</modelPackage>
                        <supportingFilesToGenerate>ApiUtil.java</supportingFilesToGenerate>
                        <configOptions>
                            <delegatePattern>true</delegatePattern>
                            <useSpringBoot3>true</useSpringBoot3>
                            <useTags>true</useTags>
                            <interfaceOnly>true</interfaceOnly>
                            <skipDefaultInterface>true</skipDefaultInterface>
                            <useBeanValidation>true</useBeanValidation>
                            <performBeanValidation>true</performBeanValidation>
                            <useOptional>true</useOptional>
                            <unhandledException>true</unhandledException>
                            <dateLibrary>java8</dateLibrary>
                            <java8>true</java8>
                            <hideGenerationTimestamp>true</hideGenerationTimestamp>
                            <openApiNullable>false</openApiNullable>
                            <additionalModelTypeAnnotations>
                                @io.swagger.v3.oas.annotations.media.Schema(description = "${description}")
                            </additionalModelTypeAnnotations>
                        </configOptions>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

### Client SDK Generation

```yaml
# openapi-config.yaml
generatorName: java
inputSpec: http://localhost:8080/v3/api-docs
outputDir: generated-sdk/java
groupId: com.example
artifactId: api-client
artifactVersion: 1.0.0
invokerPackage: com.example.client
apiPackage: com.example.client.api
modelPackage: com.example.client.model
library: webclient
useBeanValidation: true
performBeanValidation: true
dateLibrary: java8
java8: true
```

```bash
# Generate Java client
openapi-generator generate \
  -i http://localhost:8080/v3/api-docs \
  -g java \
  -c openapi-config.yaml

# Generate TypeScript client
openapi-generator generate \
  -i http://localhost:8080/v3/api-docs \
  -g typescript-axios \
  -o generated-sdk/typescript

# Generate Python client
openapi-generator generate \
  -i http://localhost:8080/v3/api-docs \
  -g python \
  -o generated-sdk/python
```

### API-First Development

```yaml
# src/main/resources/api/openapi.yaml
openapi: 3.0.3
info:
  title: E-Commerce Platform API
  version: 1.0.0
  description: API specification for E-Commerce Platform
  contact:
    name: API Team
    email: api@example.com
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html

servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
```
