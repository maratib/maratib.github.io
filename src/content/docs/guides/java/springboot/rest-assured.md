---
title: RestAssured
description: RestAssured
---

By following these patterns, you'll create robust, maintainable API tests that provide confidence in your Spring Boot application's REST endpoints while catching regressions early in the development cycle.

## Introduction to RestAssured

### What is RestAssured?

- **Java DSL** (Domain Specific Language) for testing RESTful APIs
- **Simplifies** HTTP request creation and response validation
- **Supports** JSON, XML, and other response formats
- **Integrates seamlessly** with Spring Boot and testing frameworks

### Why Use RestAssured in Spring Boot 3?

- **Easy to read** tests that resemble natural language
- **Comprehensive validation** capabilities for responses
- **Spring Boot Test integration** for application context testing
- **Reduces boilerplate** code for HTTP testing
- **Supports modern authentication** like OAuth2, JWT

## Setup & Configuration

### 1. Maven Dependencies -

#### Add RestAssured to your project

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- For JSON Schema validation -->
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>json-schema-validator</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 2. Test Configuration -

#### Base test class setup

```java
package com.example.demo;

imports ...

/**
 * Base test class that sets up RestAssured configuration for all integration tests
 * Uses RANDOM_PORT to avoid port conflicts during parallel test execution
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test") // Uses application-test.yml for test-specific configuration
public abstract class BaseIntegrationTest {

    @LocalServerPort
    protected int port; // Injected random port number

    /**
     * Setup RestAssured configuration before each test
     * This runs before every test method in subclasses
     */
    @BeforeEach
    void setupRestAssured() {
        // Configure RestAssured to use the random port assigned by Spring
        RestAssured.port = port;
        RestAssured.baseURI = "http://localhost";

        // Enable detailed logging when validation fails - very helpful for debugging
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }

    /**
     * Reset RestAssured after each test to avoid state leakage between tests
     */
    @AfterEach
    void resetRestAssured() {
        RestAssured.reset();
    }
}
```

### 3. Application Test Configuration -

### Test-specific properties

```yaml
# src/test/resources/application-test.yml
# Test-specific configuration
spring:
  datasource:
    url: jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
    username: sa
    password:
    driver-class-name: org.h2.Driver
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: create-drop # Create and drop schema for each test session
    show-sql: true # Show SQL in logs for debugging
    properties:
      hibernate:
        format_sql: true
  h2:
    console:
      enabled: true # Enable H2 console for debugging tests
      path: /h2-console

# Test-specific logging configuration
logging:
  level:
    com.example.demo: DEBUG # Debug level for our application
    org.springframework.web: DEBUG # See web layer details
    org.hibernate.SQL: DEBUG # See all SQL queries
    io.restassured: DEBUG # See RestAssured internal logging

# Custom test properties
app:
  testing:
    timeout: 5000
    max-users: 100
```

### Basic REST API Testing

#### Complete Basic Test examples

**UserControllerBasicTest.java**

```java
package com.example.demo.controller;

import com.example.demo.BaseIntegrationTest;
import com.example.demo.dto.CreateUserRequest;
import com.example.demo.dto.UserResponse;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Basic REST API testing examples covering common HTTP methods and scenarios
 * Each test method tests a specific endpoint with comprehensive assertions
 */
class UserControllerBasicTest extends BaseIntegrationTest {

    /**
     * Test GET /api/users - Retrieve all users
     * Demonstrates basic GET request with status code and response body validation
     */
    @Test
    void whenGetAllUsers_thenReturn200AndUserList() {
        given() // Start building the request specification
            .contentType(ContentType.JSON) // Set content type header
            .accept(ContentType.JSON)      // Set accept header
        .when() // Perform the action
            .get("/api/users") // HTTP GET request to /api/users
        .then() // Start response validation
            .statusCode(200) // Verify HTTP status code is 200 OK
            .contentType(ContentType.JSON) // Verify response content type
            .body("$.size()", greaterThanOrEqualTo(0)) // JSONPath: check array size
            .body("[0].id", notNullValue()) // Check first element has id
            .body("[0].email", not(emptyString())); // Check first element has email
    }

    /**
     * Test POST /api/users - Create a new user
     * Demonstrates POST request with request body and response validation
     */
    @Test
    void whenCreateUserWithValidData_thenReturn201AndUser() {
        // Create request body using Map (alternative to POJO)
        Map<String, Object> userRequest = Map.of(
            "email", "test@example.com",
            "firstName", "John",
            "lastName", "Doe",
            "age", 30
        );

        given()
            .contentType(ContentType.JSON) // Important for POST requests with body
            .body(userRequest) // Set the request body
        .when()
            .post("/api/users") // HTTP POST request
        .then()
            .statusCode(201) // Verify 201 Created status
            .header("Location", containsString("/api/users/")) // Check Location header
            .body("id", notNullValue()) // Verify response has id
            .body("email", equalTo("test@example.com")) // Verify email matches
            .body("fullName", equalTo("John Doe")) // Verify computed fullName
            .body("createdAt", notNullValue()); // Verify timestamp
    }

    /**
     * Test POST /api/users with POJO - Type-safe request body
     * Demonstrates using Java objects instead of Maps for better type safety
     */
    @Test
    void whenCreateUserWithPojo_thenReturn201AndUser() {
        // Create request using POJO - better type safety and IDE support
        CreateUserRequest request = CreateUserRequest.builder()
            .email("pojo@example.com")
            .firstName("Jane")
            .lastName("Smith")
            .age(25)
            .build();

        given()
            .contentType(ContentType.JSON)
            .body(request) // RestAssured automatically serializes POJO to JSON
        .when()
            .post("/api/users")
        .then()
            .statusCode(201)
            .body("email", equalTo(request.getEmail()))
            .body("fullName", equalTo("Jane Smith"))
            .body("age", equalTo(request.getAge()));
    }

    /**
     * Test GET /api/users/{id} - Get user by ID with path parameter
     * Demonstrates path parameters and extracting response data
     */
    @Test
    void whenGetUserById_thenReturn200AndUser() {
        // First create a user to ensure we have valid ID
        CreateUserRequest request = CreateUserRequest.builder()
            .email("getbyid@example.com")
            .firstName("Get")
            .lastName("ById")
            .age(30)
            .build();

        // Extract the ID from creation response for later use
        Long userId = given()
            .contentType(ContentType.JSON)
            .body(request)
        .when()
            .post("/api/users")
        .then()
            .statusCode(201)
            .extract() // Start response extraction
            .path("id"); // Extract specific field from response

        // Now get the user by extracted ID
        given()
            .pathParam("id", userId) // Set path parameter {id} in URL
        .when()
            .get("/api/users/{id}") // Use path parameter in URL
        .then()
            .statusCode(200)
            .body("id", equalTo(userId.intValue())) // Convert Long to int for comparison
            .body("email", equalTo("getbyid@example.com"))
            .body("fullName", equalTo("Get ById"));
    }

    /**
     * Test GET /api/users/search - Search users with query parameters
     * Demonstrates query parameters for filtering and searching
     */
    @Test
    void whenSearchUsersByEmail_thenReturn200AndFilteredResults() {
        given()
            .queryParam("email", "test") // Add query parameter ?email=test
            .contentType(ContentType.JSON)
        .when()
            .get("/api/users/search") // Endpoint that supports search
        .then()
            .statusCode(200)
            .body("$.size()", greaterThanOrEqualTo(0)) // Array might be empty
            .body("[0].email", containsString("test")); // If results exist, email contains "test"
    }

    /**
     * Test PUT /api/users/{id} - Update existing user
     * Demonstrates PUT request for updates
     */
    @Test
    void whenUpdateUser_thenReturn200AndUpdatedUser() {
        // First create a user
        CreateUserRequest createRequest = CreateUserRequest.builder()
            .email("update@example.com")
            .firstName("Original")
            .lastName("Name")
            .age(25)
            .build();

        Long userId = given()
            .contentType(ContentType.JSON)
            .body(createRequest)
        .when()
            .post("/api/users")
        .then()
            .statusCode(201)
            .extract()
            .path("id");

        // Update the user
        CreateUserRequest updateRequest = CreateUserRequest.builder()
            .email("updated@example.com")
            .firstName("Updated")
            .lastName("Name")
            .age(26)
            .build();

        given()
            .contentType(ContentType.JSON)
            .body(updateRequest)
            .pathParam("id", userId)
        .when()
            .put("/api/users/{id}")
        .then()
            .statusCode(200)
            .body("id", equalTo(userId.intValue()))
            .body("email", equalTo("updated@example.com"))
            .body("fullName", equalTo("Updated Name"))
            .body("age", equalTo(26));
    }

    /**
     * Test DELETE /api/users/{id} - Delete user
     * Demonstrates DELETE request and verifying resource is gone
     */
    @Test
    void whenDeleteUser_thenReturn204AndUserIsRemoved() {
        // First create a user
        CreateUserRequest request = CreateUserRequest.builder()
            .email("delete@example.com")
            .firstName("Delete")
            .lastName("Me")
            .age(25)
            .build();

        Long userId = given()
            .contentType(ContentType.JSON)
            .body(request)
        .when()
            .post("/api/users")
        .then()
            .statusCode(201)
            .extract()
            .path("id");

        // Delete the user
        given()
            .pathParam("id", userId)
        .when()
            .delete("/api/users/{id}")
        .then()
            .statusCode(204); // 204 No Content - successful deletion

        // Verify user is actually deleted
        given()
            .pathParam("id", userId)
        .when()
            .get("/api/users/{id}")
        .then()
            .statusCode(404); // 404 Not Found - user no longer exists
    }

    /**
     * Test validation errors - Invalid request data
     * Demonstrates testing error responses and validation messages
     */
    @Test
    void whenCreateUserWithInvalidData_thenReturn400WithValidationErrors() {
        Map<String, Object> invalidRequest = Map.of(
            "email", "invalid-email", // Invalid email format
            "firstName", "A", // Too short - min 2 characters
            "lastName", "" // Empty - not allowed
            // age missing - validation should catch this if @NotNull
        );

        given()
            .contentType(ContentType.JSON)
            .body(invalidRequest)
        .when()
            .post("/api/users")
        .then()
            .statusCode(400) // 400 Bad Request - validation failed
            .body("timestamp", notNullValue()) // Error response usually has timestamp
            .body("status", equalTo(400))
            .body("error", containsString("Bad Request"))
            .body("errors", not(empty())); // Should contain validation errors
    }
}
```

### 1. Simple GET Request - _Testing basic endpoint_

```java
class UserControllerTest extends BaseIntegrationTest {

    @Test
    void shouldReturnAllUsers() {
        given()
            .contentType(ContentType.JSON)
        .when()
            .get("/api/users")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("$.size()", greaterThan(0)) // JSONPath assertion
            .body("[0].id", notNullValue())
            .body("[0].email", not(emptyString()));
    }
}
```

### 2. POST Request with Body - _Testing creation endpoints_

```java
@Test
void shouldCreateNewUser() {
    Map<String, Object> userRequest = Map.of(
        "email", "test@example.com",
        "firstName", "John",
        "lastName", "Doe",
        "age", 30
    );

    given()
        .contentType(ContentType.JSON)
        .body(userRequest)
    .when()
        .post("/api/users")
    .then()
        .statusCode(201)
        .header("Location", containsString("/api/users/"))
        .body("id", notNullValue())
        .body("email", equalTo("test@example.com"))
        .body("fullName", equalTo("John Doe"));
}
```

### 3. Using POJOs for Requests - _Type-safe request bodies_

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class CreateUserRequest {
    private String email;
    private String firstName;
    private String lastName;
    private Integer age;
}

@Value
class UserResponse {
    Long id;
    String email;
    String fullName;
    String status;
}

@Test
void shouldCreateUserWithPojo() {
    CreateUserRequest request = CreateUserRequest.builder()
        .email("pojo@example.com")
        .firstName("Jane")
        .lastName("Smith")
        .age(25)
        .build();

    given()
        .contentType(ContentType.JSON)
        .body(request)
    .when()
        .post("/api/users")
    .then()
        .statusCode(201)
        .body("email", equalTo(request.getEmail()))
        .body("fullName", equalTo("Jane Smith"));
}
```

### 4. Path Parameters - _Testing endpoints with dynamic segments_

```java
@Test
void shouldGetUserById() {
    // First create a user to get ID
    CreateUserRequest request = CreateUserRequest.builder()
        .email("pathparam@example.com")
        .firstName("Path")
        .lastName("Param")
        .build();

    Long userId = given()
        .contentType(ContentType.JSON)
        .body(request)
    .when()
        .post("/api/users")
    .then()
        .extract()
        .path("id");

    // Then get by ID
    given()
        .pathParam("id", userId)
    .when()
        .get("/api/users/{id}")
    .then()
        .statusCode(200)
        .body("id", equalTo(userId.intValue()))
        .body("email", equalTo("pathparam@example.com"));
}
```

### 5. Query Parameters - _Testing filtering and search_

```java
@Test
void shouldSearchUsersByEmail() {
    given()
        .queryParam("email", "test@example.com")
    .when()
        .get("/api/users/search")
    .then()
        .statusCode(200)
        .body("$.size()", greaterThanOrEqualTo(0))
        .body("[0].email", containsString("test@example.com"));
}

@Test
void shouldGetUsersWithPagination() {
    given()
        .queryParam("page", 0)
        .queryParam("size", 10)
        .queryParam("sort", "firstName,asc")
    .when()
        .get("/api/users")
    .then()
        .statusCode(200)
        .header("X-Total-Count", notNullValue())
        .body("content.size()", lessThanOrEqualTo(10));
}
```

## Request Specifications

### 1. Request Specification Builder - _Reusable request configuration_

```java
public class RequestSpecs {

    public static RequestSpecification jsonRequest() {
        return new RequestSpecBuilder()
            .setContentType(ContentType.JSON)
            .setAccept(ContentType.JSON)
            .addHeader("X-API-Version", "1")
            .build();
    }

    public static RequestSpecification authRequest(String token) {
        return new RequestSpecBuilder()
            .setContentType(ContentType.JSON)
            .addHeader("Authorization", "Bearer " + token)
            .build();
    }

    public static RequestSpecification multipartRequest() {
        return new RequestSpecBuilder()
            .setContentType("multipart/form-data")
            .build();
    }
}

// Usage in tests
@Test
void shouldUseRequestSpecification() {
    given()
        .spec(RequestSpecs.jsonRequest())
        .body(createUserRequest)
    .when()
        .post("/api/users")
    .then()
        .statusCode(201);
}
```

### 2. Base Specification for All Tests - _Common configuration_

```java
public abstract class SecureApiTest extends BaseIntegrationTest {

    protected RequestSpecification authenticatedSpec;

    @BeforeEach
    void setupAuthentication() {
        String token = obtainAuthToken();

        authenticatedSpec = new RequestSpecBuilder()
            .setBasePath("/api")
            .setPort(port)
            .setContentType(ContentType.JSON)
            .addHeader("Authorization", "Bearer " + token)
            .build();
    }

    private String obtainAuthToken() {
        // Implementation to get auth token
        return given()
            .contentType(ContentType.JSON)
            .body(Map.of("username", "admin", "password", "password"))
            .when()
            .post("/api/auth/login")
            .then()
            .statusCode(200)
            .extract()
            .path("accessToken");
    }
}
```

## Response Validation

### 1. Comprehensive Response Validation - _Multiple assertion types_

```java
@Test
void shouldValidateUserResponseComprehensively() {
    given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/users/1")
    .then()
        // Status validation
        .statusCode(200)
        .statusLine(containsString("OK"))

        // Header validation
        .header("Content-Type", containsString(ContentType.JSON.toString()))
        .header("X-Rate-Limit-Limit", notNullValue())

        // Cookie validation (if any)
        .cookie("SESSION", notNullValue())

        // Body validation with JSONPath
        .body("id", equalTo(1))
        .body("email", matchesPattern("^[A-Za-z0-9+_.-]+@(.+)$"))
        .body("firstName", not(emptyOrNullString()))
        .body("lastName", not(emptyOrNullString()))
        .body("age", allOf(greaterThanOrEqualTo(18), lessThanOrEqualTo(100)))
        .body("roles", hasSize(greaterThan(0)))
        .body("roles", hasItem("USER"))
        .body("createdAt", notNullValue())
        .body("updatedAt", notNullValue());
}
```

### 2. Extracting Response Data - _Using response in multiple assertions_

```java
@Test
void shouldExtractAndUseResponseData() {
    UserResponse user = given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/users/1")
    .then()
        .statusCode(200)
        .extract()
        .as(UserResponse.class); // Using POJO for extraction

    // Additional assertions on extracted object
    assertThat(user.getId()).isEqualTo(1L);
    assertThat(user.getEmail()).contains("@");
    assertThat(user.getFullName()).isNotBlank();
}
```

### 3. Response Time Validation - _Performance testing_

```java
@Test
void shouldReturnResponseWithinAcceptableTime() {
    given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/users")
    .then()
        .statusCode(200)
        .time(lessThan(2000L)) // Response time less than 2 seconds
        .body("$", hasSize(greaterThan(0)));
}

@Test
void shouldValidateResponseTimeWithCustomMatcher() {
    given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/users")
    .then()
        .time(both(greaterThan(100L)).and(lessThan(1000L))); // Between 100ms and 1 second
}
```

### 4. Complex JSON Path Assertions - _Nested object validation_

```java
@Test
void shouldValidateNestedJsonStructure() {
    given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/users/1/orders")
    .then()
        .statusCode(200)
        .body("$", hasSize(greaterThan(0)))
        .body("[0].id", notNullValue())
        .body("[0].orderNumber", matchesPattern("ORD-\\d+"))
        .body("[0].customer.id", equalTo(1))
        .body("[0].customer.email", not(emptyString()))
        .body("[0].items.size()", greaterThan(0))
        .body("[0].items[0].product.name", not(emptyString()))
        .body("[0].items[0].quantity", greaterThan(0))
        .body("[0].totalAmount", greaterThan(0.0f))
        .body("[0].status", in("PENDING", "PROCESSING", "COMPLETED"));
}
```

## Authentication & Security

### 1. Basic Authentication - _Testing secured endpoints_

```java
@Test
void shouldAccessWithBasicAuth() {
    given()
        .auth()
        .basic("admin", "password")
        .contentType(ContentType.JSON)
    .when()
        .get("/api/admin/users")
    .then()
        .statusCode(200);
}

@Test
void shouldRejectInvalidBasicAuth() {
    given()
        .auth()
        .basic("admin", "wrongpassword")
        .contentType(ContentType.JSON)
    .when()
        .get("/api/admin/users")
    .then()
        .statusCode(401);
}
```

### 2. JWT Token Authentication - _Testing OAuth2 secured endpoints_

```java
@Test
void shouldAccessWithBearerToken() {
    String accessToken = obtainAccessToken();

    given()
        .auth()
        .oauth2(accessToken)
        .contentType(ContentType.JSON)
    .when()
        .get("/api/protected/users")
    .then()
        .statusCode(200);
}

@Test
void shouldRejectExpiredToken() {
    String expiredToken = "expired.jwt.token";

    given()
        .auth()
        .oauth2(expiredToken)
        .contentType(ContentType.JSON)
    .when()
        .get("/api/protected/users")
    .then()
        .statusCode(401)
        .body("error", equalTo("invalid_token"));
}
```

### 3. API Key Authentication - _Testing API key secured endpoints_

```java
@Test
void shouldAccessWithApiKey() {
    given()
        .header("X-API-Key", "test-api-key-123")
        .contentType(ContentType.JSON)
    .when()
        .get("/api/external/users")
    .then()
        .statusCode(200);
}

@Test
void shouldRejectInvalidApiKey() {
    given()
        .header("X-API-Key", "invalid-key")
        .contentType(ContentType.JSON)
    .when()
        .get("/api/external/users")
    .then()
        .statusCode(403)
        .body("error", equalTo("Forbidden"));
}
```

## JSON Schema Validation

### 1. Schema Definition - _Defining expected response structure_

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "firstName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "lastName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "age": {
      "type": "integer",
      "minimum": 18,
      "maximum": 100
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1
    },
    "createdAt": {
      "type": "string",
      "format": "date-time"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["id", "email", "firstName", "lastName", "createdAt"],
  "additionalProperties": false
}
```

### 2. Schema Validation in Tests - _Validating against JSON schema_

```java
@Test
void shouldValidateResponseAgainstSchema() {
    given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/users/1")
    .then()
        .statusCode(200)
        .body(matchesJsonSchemaInClasspath("schemas/user-schema.json"));
}

@Test
void shouldValidateArrayResponseAgainstSchema() {
    given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/users")
    .then()
        .statusCode(200)
        .body(matchesJsonSchemaInClasspath("schemas/users-array-schema.json"));
}
```

### 3. Dynamic Schema Validation - _Programmatic schema validation_

```java
@Test
void shouldValidateWithDynamicSchema() {
    String dynamicSchema = "{\n" +
        "  \"$schema\": \"http://json-schema.org/draft-07/schema#\",\n" +
        "  \"type\": \"object\",\n" +
        "  \"properties\": {\n" +
        "    \"id\": {\"type\": \"integer\"},\n" +
        "    \"name\": {\"type\": \"string\"}\n" +
        "  },\n" +
        "  \"required\": [\"id\", \"name\"]\n" +
        "}";

    given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/products/1")
    .then()
        .statusCode(200)
        .body(matchesJsonSchema(dynamicSchema));
}
```

## Testing Different Content Types

### 1. XML API Testing - _Testing XML responses_

```java
@Test
void shouldHandleXmlResponse() {
    given()
        .accept(ContentType.XML)
    .when()
        .get("/api/xml/users/1")
    .then()
        .statusCode(200)
        .contentType(ContentType.XML)
        .body("user.id", equalTo("1"))
        .body("user.email", equalTo("test@example.com"))
        .body("user.firstName", equalTo("John"))
        .body("user.lastName", equalTo("Doe"));
}
```

### 2. File Upload Testing - _Testing multipart/form-data_

```java
@Test
void shouldUploadFile() {
    File file = new File("src/test/resources/test-image.jpg");

    given()
        .contentType("multipart/form-data")
        .multiPart("file", file, "image/jpeg")
        .multiPart("description", "Test image upload")
    .when()
        .post("/api/files/upload")
    .then()
        .statusCode(201)
        .body("filename", equalTo(file.getName()))
        .body("size", greaterThan(0))
        .body("contentType", equalTo("image/jpeg"));
}
```

### 3. File Download Testing - _Testing file download endpoints_

```java
@Test
void shouldDownloadFile() {
    byte[] fileContent = given()
        .contentType(ContentType.JSON)
    .when()
        .get("/api/files/1/download")
    .then()
        .statusCode(200)
        .contentType(ContentType.APPLICATION_OCTET_STREAM)
        .header("Content-Disposition", containsString("attachment"))
        .extract()
        .asByteArray();

    assertThat(fileContent.length).isGreaterThan(0);
}
```

## Database Integration Testing

### 1. Test Data Setup - _Preparing test data_

```java
@DataJpaTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .email("test@example.com")
            .firstName("Test")
            .lastName("User")
            .age(30)
            .build();

        testUser = entityManager.persistAndFlush(testUser);
    }

    @Test
    void shouldFindUserByEmail() {
        Optional<User> found = userRepository.findByEmail("test@example.com");

        assertThat(found).isPresent();
        assertThat(found.get().getId()).isEqualTo(testUser.getId());
    }
}
```

### 2. @Sql Annotation - _Loading test data from SQL files_

```java
@Test
@Sql(scripts = "/test-data/cleanup-users.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
@Sql(scripts = "/test-data/sample-users.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
void shouldGetUsersFromTestData() {
    given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/users")
    .then()
        .statusCode(200)
        .body("$.size()", equalTo(5))
        .body("[0].email", equalTo("user1@example.com"))
        .body("[4].email", equalTo("user5@example.com"));
}
```

### 3. Transactional Tests - _Automatic rollback_

```java
@SpringBootTest
@Transactional
class TransactionalUserTest {

    @Test
    void shouldCreateUserInTransaction() {
        // This will be rolled back after test
        given()
            .spec(RequestSpecs.jsonRequest())
            .body(CreateUserRequest.builder()
                .email("transactional@example.com")
                .firstName("Transactional")
                .lastName("Test")
                .build())
        .when()
            .post("/api/users")
        .then()
            .statusCode(201);

        // Verify in same transaction
        given()
            .spec(RequestSpecs.jsonRequest())
        .when()
            .get("/api/users?email=transactional@example.com")
        .then()
            .statusCode(200)
            .body("$.size()", equalTo(1));
    }
    // Changes automatically rolled back
}
```

## Best Practices & Patterns

### 1. Test Data Builder Pattern - _Clean test data creation_

```java
public class TestDataBuilder {

    public static CreateUserRequest.CreateUserRequestBuilder defaultUser() {
        return CreateUserRequest.builder()
            .email("test@example.com")
            .firstName("Test")
            .lastName("User")
            .age(25);
    }

    public static CreateUserRequest.CreateUserRequestBuilder adminUser() {
        return defaultUser()
            .email("admin@example.com")
            .firstName("Admin")
            .lastName("User");
    }

    public static CreateUserRequest.CreateUserRequestBuilder withEmail(String email) {
        return defaultUser().email(email);
    }
}

// Usage in tests
@Test
void shouldUseTestDataBuilder() {
    CreateUserRequest request = TestDataBuilder
        .withEmail("builder@example.com")
        .build();

    given()
        .spec(RequestSpecs.jsonRequest())
        .body(request)
    .when()
        .post("/api/users")
    .then()
        .statusCode(201)
        .body("email", equalTo("builder@example.com"));
}
```

### 2. Page Object Pattern for APIs - _Organizing API interactions_

```java
public class UserApiClient {

    private final RequestSpecification spec;

    public UserApiClient(RequestSpecification spec) {
        this.spec = spec;
    }

    public UserResponse createUser(CreateUserRequest request) {
        return given(spec)
            .body(request)
        .when()
            .post("/api/users")
        .then()
            .statusCode(201)
            .extract()
            .as(UserResponse.class);
    }

    public UserResponse getUserById(Long id) {
        return given(spec)
            .pathParam("id", id)
        .when()
            .get("/api/users/{id}")
        .then()
            .statusCode(200)
            .extract()
            .as(UserResponse.class);
    }

    public List<UserResponse> searchUsers(String email) {
        return given(spec)
            .queryParam("email", email)
        .when()
            .get("/api/users/search")
        .then()
            .statusCode(200)
            .extract()
            .jsonPath()
            .getList(".", UserResponse.class);
    }
}

// Usage in tests
@Test
void shouldUseApiClient() {
    UserApiClient userClient = new UserApiClient(RequestSpecs.jsonRequest());

    CreateUserRequest request = TestDataBuilder.defaultUser().build();
    UserResponse createdUser = userClient.createUser(request);

    UserResponse fetchedUser = userClient.getUserById(createdUser.getId());
    assertThat(fetchedUser.getEmail()).isEqualTo(createdUser.getEmail());
}
```

### 3. Parallel Test Execution - _Faster test execution_

```java
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Execution(ExecutionMode.CONCURRENT)
class ParallelUserTests extends BaseIntegrationTest {

    @RepeatedTest(5)
    void shouldHandleConcurrentUserCreation() {
        String uniqueEmail = "user_" + Thread.currentThread().getId() + "_" + System.currentTimeMillis() + "@example.com";

        CreateUserRequest request = TestDataBuilder
            .withEmail(uniqueEmail)
            .build();

        given()
            .spec(RequestSpecs.jsonRequest())
            .body(request)
        .when()
            .post("/api/users")
        .then()
            .statusCode(201)
            .body("email", equalTo(uniqueEmail));
    }
}
```

### 4. Environment-specific Testing - _Different configurations per environment_

```java
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class EnvironmentAwareTests extends BaseIntegrationTest {

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @Test
    void shouldRunWithTestProfile() {
        assertThat(activeProfile).isEqualTo("test");

        given()
            .spec(RequestSpecs.jsonRequest())
        .when()
            .get("/api/users")
        .then()
            .statusCode(200);
    }
}
```

## Common Pitfalls & Solutions

### 1. Port Configuration Issues - _Solving random port problems_

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PortConfigurationTest {

    @LocalServerPort
    private int serverPort;

    @BeforeEach
    void setup() {
        // Always set RestAssured port in @BeforeEach, not in field initialization
        RestAssured.port = serverPort;
    }

    @Test
    void shouldUseCorrectPort() {
        given()
            .contentType(ContentType.JSON)
        .when()
            .get("/api/health")
        .then()
            .statusCode(200);
    }
}
```

### 2. JSON Serialization Issues - _Handling date formats and custom serialization_

```java
@Test
void shouldHandleCustomDateFormats() {
    given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/users/1")
    .then()
        .statusCode(200)
        .body("createdAt", matchesPattern("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"))
        .body("birthDate", matchesPattern("\\d{4}-\\d{2}-\\d{2}"));
}

@Test
void shouldHandleCustomSerialization() {
    // For custom serializers, extract and parse manually
    String response = given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/custom-data")
    .then()
        .statusCode(200)
        .extract()
        .asString();

    ObjectMapper mapper = new ObjectMapper();
    CustomResponse customResponse = mapper.readValue(response, CustomResponse.class);

    assertThat(customResponse.getCustomField()).isNotNull();
}
```

### 3. Handling SSL and Self-Signed Certificates - _Testing in different environments_

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, properties = {
    "server.ssl.enabled=true",
    "server.port=8443"
})
class SslTest {

    @BeforeEach
    void setup() {
        // Trust all certificates for testing
        RestAssured.useRelaxedHTTPSValidation();
        RestAssured.port = 8443;
        RestAssured.baseURI = "https://localhost";
    }

    @Test
    void shouldWorkWithSsl() {
        given()
            .contentType(ContentType.JSON)
        .when()
            .get("/api/secure-endpoint")
        .then()
            .statusCode(200);
    }
}
```

### 4. Async Endpoint Testing - _Testing asynchronous operations_

```java
@Test
void shouldTestAsyncEndpoint() {
    given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .post("/api/async/users")
    .then()
        .statusCode(202)
        .header("Location", notNullValue());

    // Poll for completion
    await().atMost(10, TimeUnit.SECONDS)
        .until(() -> {
            String status = given()
                .spec(RequestSpecs.jsonRequest())
            .when()
                .get("/api/async/users/status")
            .then()
                .extract()
                .path("status");
            return "COMPLETED".equals(status);
        });
}
```

### 5. Large Response Handling - _Testing with large datasets_

```java
@Test
void shouldHandleLargeResponseEfficiently() {
    given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/users")
    .then()
        .statusCode(200)
        .time(lessThan(5000L)) // Ensure performance
        .body("$", hasSize(lessThanOrEqualTo(1000))) // Validate pagination
        .body("size()", greaterThan(0));
}

@Test
void shouldStreamLargeResponse() {
    // For very large responses, use streaming
    InputStream stream = given()
        .spec(RequestSpecs.jsonRequest())
    .when()
        .get("/api/large-data")
        .asInputStream();

    // Process stream efficiently
    try (stream) {
        // Process the stream
        assertThat(stream).isNotNull();
    }
}
```

## Conclusion

### Key RestAssured Benefits in Spring Boot 3:

- **Fluid DSL** makes tests readable and maintainable
- **Comprehensive validation** capabilities for all response aspects
- **Seamless Spring Boot integration** with test contexts
- **Powerful JSON/XML handling** with path assertions
- **Flexible authentication** support for modern security

### Recommended Testing Strategy:

1. **Start with** basic status code and content type validation
2. **Use RequestSpecification** for reusable configuration
3. **Implement JSON schema validation** for contract testing
4. **Create test data builders** for clean test setup
5. **Use page object pattern** for complex API interactions
6. **Handle authentication** properly for secured endpoints
7. **Test edge cases** and error scenarios comprehensively
