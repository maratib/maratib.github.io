---
title: Scalar API Docs
description: Scalar API Docs
---

# Scalar API Documentation: Complete Guide from Scratch to Pro

## Table of Contents

1. [Introduction to Scalar](#introduction)
2. [Getting Started with Scalar](#getting-started)
3. [Basic Integration with Spring Boot](#basic-integration)
4. [Advanced Configuration](#advanced-configuration)
5. [Customizing Scalar UI](#customizing-ui)
6. [API Reference Documentation](#api-reference)
7. [Interactive API Playground](#interactive-playground)
8. [Multi-file Documentation](#multi-file)
9. [Theming and Branding](#theming)
10. [Production Deployment](#production)
11. [Troubleshooting](#troubleshooting)

---

## 1. Introduction to Scalar {#introduction}

Scalar is a modern, beautiful, and highly customizable OpenAPI documentation tool that provides an exceptional developer experience. It's designed as a drop-in replacement for Swagger UI with better performance and more features.

### Key Features:

- **Blazing Fast**: Built with modern web technologies (Vue 3)
- **Beautiful UI**: Modern, clean, and responsive design
- **Interactive Playground**: Advanced API testing capabilities
- **Multiple Themes**: Light, dark, and custom themes
- **Markdown Support**: Rich documentation with markdown
- **TypeScript Support**: Excellent for TypeScript/JavaScript projects
- **Easy Customization**: Highly customizable UI and functionality

### Scalar vs Swagger UI:

| Feature           | Scalar              | Swagger UI      |
| ----------------- | ------------------- | --------------- |
| Performance       | ⚡ Faster (Vue 3)   | Slower (React)  |
| Bundle Size       | 50% smaller         | Larger bundle   |
| Customization     | Highly customizable | Limited         |
| Themes            | Multiple built-in   | Limited options |
| Playground        | Advanced features   | Basic           |
| Markdown Support  | Full support        | Limited         |
| Mobile Experience | Excellent           | Good            |

---

## 2. Getting Started with Scalar {#getting-started}

### Installation Options

#### Option 1: CDN (Quick Start)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>API Reference</title>
    <link
      rel="icon"
      type="image/svg+xml"
      href="https://cdn.scalar.com/logo.svg"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest/dist/style.css"
    />
  </head>
  <body>
    <div id="scalar-api-reference"></div>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest/dist/browser/standalone.js"></script>
    <script>
      ScalarStandalone({
        configuration: {
          spec: {
            url: "https://petstore3.swagger.io/api/v3/openapi.json",
          },
        },
      });
    </script>
  </body>
</html>
```

#### Option 2: NPM Package

```bash
# Install Scalar
npm install @scalar/api-reference

# Or with yarn
yarn add @scalar/api-reference

# Or with pnpm
pnpm add @scalar/api-reference
```

#### Option 3: Spring Boot Starter

```xml
<!-- Maven -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```

### Basic Spring Boot Integration

```java
@Configuration
public class ScalarConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("E-Commerce API")
                .version("1.0.0")
                .description("API documentation with Scalar")
                .contact(new Contact()
                    .name("API Team")
                    .email("api@example.com"))
            )
            .externalDocs(new ExternalDocumentation()
                .description("Full documentation")
                .url("https://docs.example.com"));
    }
}
```

```yaml
# application.yml
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    enabled: false # Disable Swagger UI
  scalar:
    enabled: true
    path: /scalar
    title: API Documentation
    theme: default
```

---

## 3. Basic Integration with Spring Boot {#basic-integration}

### Complete Spring Boot Configuration

```yaml
# application.yml
springdoc:
  # OpenAPI configuration
  api-docs:
    path: /openapi.json
    enabled: true
    version: openapi_3_1

  # Scalar configuration
  scalar:
    enabled: true
    path: /reference
    title: API Reference
    favicon: https://cdn.scalar.com/logo.svg
    theme: bluePlanet
    layout: modern
    default-open: true
    hide-download-button: false
    hide-servers: false
    hide-info: false
    hide-security: false
    hide-schemes: false
    hide-model-example: false
    hide-try-it: false
    try-it-out-enabled: true
    show-sidebar: true
    sidebar-width: 300
    auto-expand-responses: false
    cors-proxy-url: ""
    on-request:
      - name: ""
        value: ""
    authentication:
      preferred-security-scheme: bearerAuth

  # Additional configuration
  cache:
    disabled: false
  model-and-view-allowed: false
  override-with-generic-response: false

  # Grouping APIs
  group-configs:
    - group: public
      paths-to-match: /api/public/**
      packages-to-scan: com.example.api.public
    - group: admin
      paths-to-match: /api/admin/**
      packages-to-scan: com.example.api.admin
```

### Programmatic Configuration

```java
@Configuration
public class ScalarSpringBootConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("E-Commerce Platform API")
                .version("1.0.0")
                .description("""
                    # Welcome to Our API

                    This is the official API documentation for the E-Commerce Platform.

                    ## Getting Started
                    1. Get your API key from the dashboard
                    2. Use the API key in the Authorization header
                    3. Explore the available endpoints

                    ## Rate Limits
                    - Free tier: 100 requests/hour
                    - Pro tier: 10,000 requests/hour

                    ## Support
                    Contact support@example.com for assistance
                    """))
            .externalDocs(new ExternalDocumentation()
                .description("API Guide")
                .url("https://docs.example.com/api-guide"))
            .servers(List.of(
                new Server()
                    .url("https://api.example.com")
                    .description("Production"),
                new Server()
                    .url("https://staging-api.example.com")
                    .description("Staging"),
                new Server()
                    .url("http://localhost:8080")
                    .description("Local Development")
            ))
            .components(new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("""
                            Use your JWT token for authentication.
                            Format: `Bearer {token}`
                            """))
                .addSecuritySchemes("apiKey",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.APIKEY)
                        .in(SecurityScheme.In.HEADER)
                        .name("X-API-Key")
                        .description("API key for partner integrations"))
            )
            .tags(List.of(
                new Tag()
                    .name("Authentication")
                    .description("Authentication and authorization endpoints"),
                new Tag()
                    .name("Users")
                    .description("User management operations"),
                new Tag()
                    .name("Products")
                    .description("Product catalog operations")
            ));
    }

    @Bean
    public ScalarProperties scalarProperties() {
        ScalarProperties props = new ScalarProperties();
        props.setEnabled(true);
        props.setPath("/docs");
        props.setTitle("API Documentation");
        props.setTheme("purple");
        props.setLayout("modern");
        props.setDefaultOpen(true);
        props.setTryItOutEnabled(true);
        props.setHideDownloadButton(false);
        props.setHideServers(false);
        props.setHideInfo(false);

        // Configure CORS proxy
        props.setCorsProxyUrl("");

        // Configure authentication
        ScalarAuthentication auth = new ScalarAuthentication();
        auth.setPreferredSecurityScheme("bearerAuth");
        props.setAuthentication(auth);

        return props;
    }
}
```

### Controller with Scalar Annotations

```java
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

    @GetMapping
    @Operation(
        summary = "List users",
        description = """
            # Get All Users

            Retrieves a paginated list of users. Supports filtering and sorting.

            ## Permissions
            - **Admin**: Can view all users
            - **Manager**: Can view users in their department

            ## Examples
            ### Get first page
            \`\`\`bash
            curl -X GET "https://api.example.com/api/v1/users?page=0&size=20"
            \`\`\`

            ### Search users
            \`\`\`bash
            curl -X GET "https://api.example.com/api/v1/users?search=john&active=true"
            \`\`\`
            """,
        operationId = "listUsers",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Successful operation",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = UserPageResponse.class),
                    examples = {
                        @ExampleObject(
                            name = "Success Response",
                            description = "Paginated list of users",
                            value = """
                                {
                                  "content": [
                                    {
                                      "id": 1,
                                      "email": "john@example.com",
                                      "name": "John Doe",
                                      "role": "USER",
                                      "active": true,
                                      "createdAt": "2024-01-15T10:30:00Z"
                                    }
                                  ],
                                  "pageable": {
                                    "pageNumber": 0,
                                    "pageSize": 20
                                  },
                                  "totalElements": 150,
                                  "totalPages": 8
                                }
                                """
                        )
                    }
                )
            )
        }
    )
    @Parameter(name = "page", description = "Page number (0-indexed)", example = "0")
    @Parameter(name = "size", description = "Page size", example = "20")
    @Parameter(name = "sort", description = "Sort by field (format: field,asc|desc)",
               example = "createdAt,desc")
    public ResponseEntity<Page<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sort) {
        // Implementation
        return ResponseEntity.ok(userService.findAll(page, size, sort));
    }

    @PostMapping
    @Operation(
        summary = "Create user",
        description = """
            Creates a new user account.

            **Important**: Email must be unique.
            """,
        requestBody = @RequestBody(
            description = "User data",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UserCreateRequest.class),
                examples = {
                    @ExampleObject(
                        name = "Regular User",
                        value = """
                            {
                              "email": "new.user@example.com",
                              "name": "New User",
                              "password": "SecurePass123!",
                              "role": "USER"
                            }
                            """
                    ),
                    @ExampleObject(
                        name = "Admin User",
                        value = """
                            {
                              "email": "admin@example.com",
                              "name": "Admin User",
                              "password": "AdminPass123!",
                              "role": "ADMIN"
                            }
                            """
                    )
                }
            )
        )
    )
    @ApiResponse(responseCode = "201", description = "User created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "409", description = "Email already exists")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserCreateRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity
            .created(URI.create("/api/v1/users/" + response.getId()))
            .body(response);
    }
}
```

---

## 4. Advanced Configuration {#advanced-configuration}

### Custom Scalar Configuration

```java
@Configuration
public class AdvancedScalarConfig {

    @Value("${app.version}")
    private String appVersion;

    @Value("${app.environment}")
    private String environment;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("E-Commerce Platform API")
                .version(appVersion)
                .description(generateAPIDescription())
                .termsOfService("https://example.com/terms")
                .contact(new Contact()
                    .name("API Support")
                    .url("https://support.example.com")
                    .email("support@example.com"))
                .license(new License()
                    .name("Commercial")
                    .url("https://example.com/license"))
                .extensions(Map.of(
                    "x-logo", Map.of(
                        "url", "https://example.com/logo.png",
                        "backgroundColor", "#FFFFFF",
                        "altText", "Company Logo"
                    ),
                    "x-api-version", appVersion,
                    "x-environment", environment
                )))
            .externalDocs(new ExternalDocumentation()
                .description("Developer Guide")
                .url("https://developers.example.com"))
            .servers(generateServers())
            .tags(generateTags())
            .components(generateComponents())
            .extensions(Map.of(
                "x-scalar", Map.of(
                    "theme", "purple",
                    "layout", "modern",
                    "defaultOpen", true,
                    "tryItOutEnabled", true,
                    "authentication", Map.of(
                        "preferredSecurityScheme", "bearerAuth"
                    )
                )
            ));
    }

    private String generateAPIDescription() {
        return """
            # E-Commerce Platform API

            Welcome to the official API documentation for our E-Commerce Platform.

            ## Features
            - **RESTful Design**: Follows REST principles
            - **JSON Responses**: All responses in JSON format
            - **JWT Authentication**: Secure token-based authentication
            - **Rate Limiting**: Protection against abuse
            - **Webhook Support**: Real-time event notifications

            ## Quick Start
            1. [Create an account](https://app.example.com/signup)
            2. [Generate API key](https://app.example.com/api-keys)
            3. Start building!

            ## SDKs
            We provide official SDKs for:
            - [JavaScript/TypeScript](https://github.com/example/js-sdk)
            - [Python](https://github.com/example/python-sdk)
            - [Java](https://github.com/example/java-sdk)

            ## Support
            - **Documentation**: [docs.example.com](https://docs.example.com)
            - **Community**: [community.example.com](https://community.example.com)
            - **Email**: support@example.com
            """;
    }

    private List<Server> generateServers() {
        List<Server> servers = new ArrayList<>();

        servers.add(new Server()
            .url("https://api.example.com")
            .description("Production API")
            .variables(Map.of(
                "environment", new ServerVariable()
                    .defaultValue("production")
                    .description("API environment")
                    .enumValues(List.of("production"))
            )));

        if (!"production".equals(environment)) {
            servers.add(new Server()
                .url("https://staging-api.example.com")
                .description("Staging API (Testing only)"));

            servers.add(new Server()
                .url("http://localhost:8080")
                .description("Local Development"));
        }

        return servers;
    }

    private List<Tag> generateTags() {
        return List.of(
            new Tag()
                .name("Authentication")
                .description("Authentication and authorization")
                .externalDocs(new ExternalDocumentation()
                    .description("Auth Guide")
                    .url("https://docs.example.com/authentication")),
            new Tag()
                .name("Users")
                .description("User management")
                .externalDocs(new ExternalDocumentation()
                    .description("User Management Guide")
                    .url("https://docs.example.com/users")),
            new Tag()
                .name("Products")
                .description("Product catalog management")
                .externalDocs(new ExternalDocumentation()
                    .description("Product Guide")
                    .url("https://docs.example.com/products")),
            new Tag()
                .name("Orders")
                .description("Order processing")
                .externalDocs(new ExternalDocumentation()
                    .description("Order Guide")
                    .url("https://docs.example.com/orders")),
            new Tag()
                .name("Webhooks")
                .description("Webhook management")
                .externalDocs(new ExternalDocumentation()
                    .description("Webhook Guide")
                    .url("https://docs.example.com/webhooks"))
        );
    }

    private Components generateComponents() {
        return new Components()
            .schemas(generateSchemas())
            .securitySchemes(generateSecuritySchemes())
            .responses(generateResponses())
            .parameters(generateParameters())
            .examples(generateExamples())
            .requestBodies(generateRequestBodies())
            .headers(generateHeaders())
            .links(generateLinks())
            .callbacks(generateCallbacks());
    }

    private Map<String, SecurityScheme> generateSecuritySchemes() {
        Map<String, SecurityScheme> schemes = new HashMap<>();

        // JWT Bearer Token
        schemes.put("bearerAuth", new SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .description("""
                ## JWT Authentication

                Use your JWT token for authentication.

                ### How to get a token:
                1. Call `/api/v1/auth/login` with credentials
                2. Extract token from response
                3. Use in Authorization header

                ### Header format:
                \`\`\`
                Authorization: Bearer {token}
                \`\`\`

                ### Token expiration:
                - Access tokens: 1 hour
                - Refresh tokens: 7 days
                """));

        // API Key
        schemes.put("apiKey", new SecurityScheme()
            .type(SecurityScheme.Type.APIKEY)
            .in(SecurityScheme.In.HEADER)
            .name("X-API-Key")
            .description("""
                ## API Key Authentication

                For partner integrations and server-to-server communication.

                ### How to get an API key:
                1. Go to [API Keys](https://app.example.com/api-keys)
                2. Click "Create New Key"
                3. Copy the generated key

                ### Permissions:
                Different keys can have different permissions:
                - **read-only**: Can only read data
                - **read-write**: Can read and write data
                - **admin**: Full access

                ### Security:
                - Never commit API keys to version control
                - Rotate keys regularly
                - Use different keys for different environments
                """));

        // OAuth2
        schemes.put("oauth2", new SecurityScheme()
            .type(SecurityScheme.Type.OAUTH2)
            .flows(new OAuthFlows()
                .authorizationCode(new OAuthFlow()
                    .authorizationUrl("https://auth.example.com/oauth/authorize")
                    .tokenUrl("https://auth.example.com/oauth/token")
                    .refreshUrl("https://auth.example.com/oauth/refresh")
                    .scopes(new Scopes()
                        .addString("read", "Read access")
                        .addString("write", "Write access")
                        .addString("admin", "Admin access")
                    )
                )
            )
            .description("OAuth 2.0 authentication for third-party applications"));

        return schemes;
    }
}
```

### Security Configuration

```java
@Configuration
public class ScalarSecurityConfig {

    @Bean
    public SecurityFilterChain scalarSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/docs/**", "/openapi.json", "/api-docs/**")
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(
                    "/docs",
                    "/docs/**",
                    "/openapi.json",
                    "/api-docs/**",
                    "/v3/api-docs/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("""
                        default-src 'self';
                        script-src 'self' 'unsafe-inline' https://cdn.scalar.com;
                        style-src 'self' 'unsafe-inline' https://cdn.scalar.com;
                        img-src 'self' data: https:;
                        font-src 'self' https://cdn.scalar.com;
                        connect-src 'self' https://api.example.com;
                        frame-ancestors 'none';
                        base-uri 'self';
                        form-action 'self';
                        """
                    )
                )
                .frameOptions(FrameOptionsConfig::deny)
                .xssProtection(xss -> xss.enableBlock())
            )
            .csrf(csrf -> csrf
                .ignoringRequestMatchers(
                    "/docs/**",
                    "/openapi.json",
                    "/api-docs/**"
                )
            );

        return http.build();
    }
}
```

---

## 5. Customizing Scalar UI {#customizing-ui}

### Theme Configuration

```java
@Configuration
public class ScalarThemeConfig {

    @Bean
    public ScalarProperties scalarProperties() {
        ScalarProperties props = new ScalarProperties();
        props.setEnabled(true);
        props.setPath("/docs");
        props.setTitle("API Documentation");

        // Theme configuration
        props.setTheme("purple");
        props.setLayout("modern");
        props.setDefaultOpen(true);
        props.setDarkMode(true);

        // Custom theme colors
        Map<String, String> customTheme = new HashMap<>();
        customTheme.put("--scalar-color-1", "#6366f1");
        customTheme.put("--scalar-color-2", "#8b5cf6");
        customTheme.put("--scalar-color-3", "#a855f7");
        customTheme.put("--scalar-color-accent", "#ec4899");
        customTheme.put("--scalar-background-1", "#0f172a");
        customTheme.put("--scalar-background-2", "#1e293b");
        customTheme.put("--scalar-background-3", "#334155");
        customTheme.put("--scalar-background-accent", "#7c3aed");
        customTheme.put("--scalar-border-color", "#475569");
        customTheme.put("--scalar-text-1", "#f8fafc");
        customTheme.put("--scalar-text-2", "#cbd5e1");
        customTheme.put("--scalar-text-3", "#94a3b8");

        props.setCustomTheme(customTheme);

        // Font configuration
        props.setFont("Inter, system-ui, sans-serif");
        props.setFontCode("'JetBrains Mono', 'Courier New', monospace");

        return props;
    }
}
```

### Custom HTML Template

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>API Reference - E-Commerce Platform</title>

    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />

    <!-- Scalar Styles -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest/dist/style.css"
    />

    <!-- Custom Styles -->
    <style>
      :root {
        /* Brand Colors */
        --brand-primary: #7c3aed;
        --brand-secondary: #8b5cf6;
        --brand-accent: #ec4899;

        /* Custom Scalar Theme */
        --scalar-color-1: var(--brand-primary);
        --scalar-color-2: var(--brand-secondary);
        --scalar-color-3: #a855f7;
        --scalar-color-accent: var(--brand-accent);

        /* Dark Theme */
        --scalar-background-1: #0f172a;
        --scalar-background-2: #1e293b;
        --scalar-background-3: #334155;
        --scalar-background-accent: var(--brand-primary);

        /* Light Theme */
        .light-mode {
          --scalar-background-1: #ffffff;
          --scalar-background-2: #f8fafc;
          --scalar-background-3: #f1f5f9;
          --scalar-text-1: #0f172a;
          --scalar-text-2: #475569;
          --scalar-text-3: #64748b;
        }

        /* Typography */
        --scalar-font: "Inter", system-ui, sans-serif;
        --scalar-font-code: "JetBrains Mono", "Courier New", monospace;
      }

      /* Custom Header */
      .scalar-header {
        background: linear-gradient(
          135deg,
          var(--brand-primary),
          var(--brand-secondary)
        );
        color: white;
        padding: 2rem;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .scalar-header h1 {
        margin: 0;
        font-size: 2.5rem;
        font-weight: 700;
      }

      .scalar-header p {
        margin: 0.5rem 0 0;
        opacity: 0.9;
        font-size: 1.1rem;
      }

      /* Custom Footer */
      .scalar-footer {
        background: var(--scalar-background-2);
        color: var(--scalar-text-2);
        padding: 2rem;
        text-align: center;
        border-top: 1px solid var(--scalar-border-color);
        font-size: 0.9rem;
      }

      .scalar-footer a {
        color: var(--scalar-color-accent);
        text-decoration: none;
      }

      .scalar-footer a:hover {
        text-decoration: underline;
      }

      /* Theme Toggle */
      .theme-toggle {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
        background: var(--scalar-background-2);
        border: 1px solid var(--scalar-border-color);
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .theme-toggle:hover {
        transform: scale(1.1);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .scalar-header h1 {
          font-size: 2rem;
        }

        .theme-toggle {
          top: 0.5rem;
          right: 0.5rem;
          width: 40px;
          height: 40px;
        }
      }
    </style>
  </head>
  <body class="dark-mode">
    <!-- Theme Toggle -->
    <button class="theme-toggle" id="themeToggle">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>

    <!-- Custom Header -->
    <header class="scalar-header">
      <h1>E-Commerce Platform API</h1>
      <p>Version 1.0.0 • Production Ready • Built with Spring Boot</p>
    </header>

    <!-- Scalar Container -->
    <div id="scalar-api-reference"></div>

    <!-- Custom Footer -->
    <footer class="scalar-footer">
      <p>
        © 2024 E-Commerce Platform. All rights reserved. |
        <a href="https://docs.example.com" target="_blank"
          >Full Documentation</a
        >
        | <a href="https://status.example.com" target="_blank">API Status</a> |
        <a href="mailto:support@example.com">Support</a>
      </p>
      <p>
        <small>
          Using Scalar API Reference • OpenAPI 3.1 • Last updated:
          <span id="lastUpdated"></span>
        </small>
      </p>
    </footer>

    <!-- Scalar Script -->
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest/dist/browser/standalone.js"></script>

    <!-- Custom Script -->
    <script>
      // Set last updated date
      document.getElementById("lastUpdated").textContent =
        new Date().toLocaleDateString();

      // Theme toggle functionality
      const themeToggle = document.getElementById("themeToggle");
      const body = document.body;

      themeToggle.addEventListener("click", () => {
        if (body.classList.contains("dark-mode")) {
          body.classList.remove("dark-mode");
          body.classList.add("light-mode");
          localStorage.setItem("theme", "light");
        } else {
          body.classList.remove("light-mode");
          body.classList.add("dark-mode");
          localStorage.setItem("theme", "dark");
        }
      });

      // Load saved theme
      const savedTheme = localStorage.getItem("theme") || "dark";
      body.classList.remove("dark-mode", "light-mode");
      body.classList.add(savedTheme + "-mode");

      // Initialize Scalar
      ScalarStandalone({
        configuration: {
          spec: {
            url: window.location.origin + "/openapi.json",
          },
          theme: "purple",
          layout: "modern",
          darkMode: savedTheme === "dark",
          search: {
            enabled: true,
            placeholder: "Search API endpoints...",
          },
          sidebar: {
            enabled: true,
            width: 300,
            autoCloseOnMobile: true,
          },
          toc: {
            enabled: true,
            depth: 3,
          },
          tryIt: {
            enabled: true,
            corsProxy: "",
            authentication: {
              preferredSecurityScheme: "bearerAuth",
            },
          },
          codeSamples: {
            enabled: true,
            languages: [
              { lang: "curl", label: "cURL" },
              { lang: "javascript", label: "JavaScript" },
              { lang: "python", label: "Python" },
              { lang: "java", label: "Java" },
              { lang: "go", label: "Go" },
            ],
          },
          hide: {
            downloadButton: false,
            tryIt: false,
            toc: false,
            sidebar: false,
            servers: false,
            info: false,
            security: false,
          },
          customization: {
            hideBranding: false,
            favicon: "/favicon.ico",
            logo: {
              light: "/logo-light.png",
              dark: "/logo-dark.png",
              href: "https://example.com",
              altText: "E-Commerce Platform",
            },
            colors: {
              primary: "#7c3aed",
              secondary: "#8b5cf6",
              accent: "#ec4899",
            },
          },
          onRequest: (request) => {
            // Add custom headers to all requests
            request.headers["X-Request-ID"] = crypto.randomUUID();
            request.headers["X-Client-Version"] = "1.0.0";
            return request;
          },
        },
      });
    </script>
  </body>
</html>
```

### Custom Components

```javascript
// Custom Scalar components
const CustomScalarComponents = {
  // Custom header component
  Header: {
    template: `
            <div class="custom-header">
                <div class="header-content">
                    <div class="header-logo">
                        <img :src="logoUrl" alt="Logo" />
                        <div class="header-text">
                            <h1>{{ title }}</h1>
                            <p>{{ description }}</p>
                        </div>
                    </div>
                    <div class="header-actions">
                        <button @click="toggleTheme" class="theme-btn">
                            {{ themeIcon }}
                        </button>
                        <a :href="docsUrl" target="_blank" class="docs-btn">
                            Full Docs
                        </a>
                    </div>
                </div>
                <div class="header-nav">
                    <a v-for="link in navLinks" :href="link.url" :key="link.text">
                        {{ link.text }}
                    </a>
                </div>
            </div>
        `,
    props: ["title", "description", "logoUrl"],
    data() {
      return {
        isDark: true,
        navLinks: [
          { text: "Getting Started", url: "https://docs.example.com/start" },
          { text: "Authentication", url: "https://docs.example.com/auth" },
          { text: "API Reference", url: "#" },
          { text: "Examples", url: "https://docs.example.com/examples" },
          { text: "Support", url: "https://docs.example.com/support" },
        ],
        docsUrl: "https://docs.example.com",
      };
    },
    computed: {
      themeIcon() {
        return this.isDark ? "🌙" : "☀️";
      },
    },
    methods: {
      toggleTheme() {
        this.isDark = !this.isDark;
        this.$emit("theme-change", this.isDark ? "dark" : "light");
      },
    },
  },

  // Custom footer component
  Footer: {
    template: `
            <div class="custom-footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <h4>Resources</h4>
                        <a href="https://docs.example.com">Documentation</a>
                        <a href="https://github.com/example/api">GitHub</a>
                        <a href="https://status.example.com">Status</a>
                        <a href="https://blog.example.com">Blog</a>
                    </div>
                    <div class="footer-section">
                        <h4>Support</h4>
                        <a href="mailto:support@example.com">Email Support</a>
                        <a href="https://community.example.com">Community</a>
                        <a href="https://twitter.com/example">Twitter</a>
                        <a href="https://discord.gg/example">Discord</a>
                    </div>
                    <div class="footer-section">
                        <h4>Legal</h4>
                        <a href="https://example.com/terms">Terms of Service</a>
                        <a href="https://example.com/privacy">Privacy Policy</a>
                        <a href="https://example.com/cookies">Cookie Policy</a>
                        <a href="https://example.com/security">Security</a>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>© 2024 E-Commerce Platform. All rights reserved.</p>
                    <p>API Version: {{ apiVersion }} | Built with Scalar</p>
                </div>
            </div>
        `,
    props: ["apiVersion"],
  },
};
```

---

## 6. API Reference Documentation {#api-reference}

### Complete API Documentation Example

```java
@RestController
@RequestMapping("/api/v1/products")
@Tag(
    name = "Products",
    description = """
        # Product Management API

        Manage your product catalog with these
```
