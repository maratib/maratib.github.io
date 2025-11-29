---
title: Testing
description: Testing
---

### Testing Pyramid Concept

- **Unit Tests**: Fast, isolated tests of individual components (70%)
- **Integration Tests**: Test interactions between components (20%)
- **End-to-End Tests**: Test complete system flows (10%)

### Why Unit Testing?

- **Fast Feedback**: Run in milliseconds vs minutes for integration tests
- **Early Bug Detection**: Catch issues during development
- **Documentation**: Tests serve as living documentation
- **Safe Refactoring**: Confidence to change code without breaking functionality
- **Design Quality**: Forces better, testable code design

## Testing Fundamentals & Terminology

### Essential Testing Vocabulary

**Test Double**: Generic term for any fake object used in place of real dependencies

```java
// Types of Test Doubles:
// - Mock: Pre-programmed expectations, verifies interactions
// - Stub: Provides canned answers to calls
// - Spy: Wraps real object, can verify interactions
// - Fake: Working implementation for testing
// - Dummy: Object passed but never used
```

**Arrange-Act-Assert (AAA)**: Standard test structure pattern

```java
@Test
void userCreation_Success() {
    // Arrange: Setup test data and mocks
    UserRequest request = new UserRequest("john@email.com", "John");
    when(userRepository.existsByEmail("john@email.com")).thenReturn(false);

    // Act: Execute the method under test
    User result = userService.createUser(request);

    // Assert: Verify the outcome
    assertNotNull(result.getId());
    verify(userRepository).save(any(User.class));
}
```

**FIRST Principles of Good Tests**:

- **Fast**: Tests should run quickly
- **Isolated**: Tests shouldn't depend on each other
- **Repeatable**: Same results in any environment
- **Self-Validating**: Tests should pass or fail automatically
- **Timely**: Write tests before or during development

## Project Setup & Dependencies

### Complete Testing Maven Configuration

<details>
<summary>Maven Configuration</summary>

**pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>
    <!-- Spring Boot Parent -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <dependencies>
        <!-- Production Dependencies -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Test Dependencies -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <!-- Includes:
                 - JUnit 5 (jupiter)
                 - Spring Test & Spring Boot Test
                 - AssertJ (fluent assertions)
                 - Hamcrest (matchers)
                 - Mockito (mocking)
                 - JSONassert (JSON testing)
                 - JsonPath (JSON parsing)
            -->
        </dependency>

        <!-- In-Memory Database for Testing -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- Mockito Inline for Mocking Final Classes -->
        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-inline</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Surefire Plugin for Unit Test Execution -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.0.0</version>
                <configuration>
                    <!-- Include all test classes ending with Test/Tests -->
                    <includes>
                        <include>**/*Test.java</include>
                        <include>**/*Tests.java</include>
                    </includes>
                    <!-- Exclude integration tests -->
                    <excludes>
                        <exclude>**/*IT.java</exclude>
                        <exclude>**/*IntegrationTest.java</exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

</details>

## JUnit 5 Core Features

### Core Annotations and Test Lifecycle

**BasicTestStructure.java**

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * JUnit 5 Test Structure demonstrating lifecycle and core annotations
 */
class BasicTestStructure {

    // Test Lifecycle Annotations
    @BeforeAll
    static void setUpClass() {
        // Runs ONCE before all tests in this class
        // Use for expensive setup (database connections, file loading)
        System.out.println("Setting up test class...");
    }

    @AfterAll
    static void tearDownClass() {
        // Runs ONCE after all tests in this class
        // Use for cleanup (closing connections, deleting files)
        System.out.println("Cleaning up test class...");
    }

    @BeforeEach
    void setUp() {
        // Runs BEFORE EACH test method
        // Use for resetting test state, initializing mocks
        System.out.println("Setting up for test...");
    }

    @AfterEach
    void tearDown() {
        // Runs AFTER EACH test method
        // Use for cleanup after each test
        System.out.println("Cleaning up after test...");
    }

    // Test Method Annotations
    @Test
    void basicAssertions() {
        // Basic assertion methods
        assertEquals(4, 2 + 2, "Addition should work correctly");
        assertTrue("hello".contains("hell"), "String should contain substring");
        assertFalse("hello".contains("world"), "String should not contain substring");
        assertNull(null, "Object should be null");
        assertNotNull("Hello", "Object should not be null");
    }

    @Test
    void exceptionTesting() {
        // Testing expected exceptions
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> { throw new IllegalArgumentException("Invalid parameter"); },
            "Method should throw IllegalArgumentException"
        );

        assertEquals("Invalid parameter", exception.getMessage(),
                    "Exception should have correct message");
    }

    @Test
    @DisplayName("Custom test name for better reporting")
    void testWithDisplayName() {
        // @DisplayName provides readable names in test reports
        assertEquals(1, 1, "Basic equality check");
    }

    @Test
    @Disabled("Temporarily disabled until bug fix")
    void disabledTest() {
        // @Disabled skips this test
        fail("This test should not run");
    }
}
```

### Parameterized Tests - Data-Driven Testing

**ParameterizedTests.java**

```java
import org.junit.jupiter.params.*;
import org.junit.jupiter.params.provider.*;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Parameterized tests allow running the same test with different data sets
 * Reduces code duplication for similar test scenarios
 */
class ParameterizedTests {

    // Test with simple values
    @ParameterizedTest
    @ValueSource(strings = {"racecar", "radar", "level", "madam"})
    void palindromes(String candidate) {
        // This test runs 4 times with different string values
        assertTrue(isPalindrome(candidate),
                  candidate + " should be a palindrome");
    }

    // Test with CSV data (comma-separated values)
    @ParameterizedTest
    @CsvSource({
        "1, 1, 2",
        "2, 3, 5",
        "10, 20, 30",
        "0, 0, 0"
    })
    void addNumbers(int a, int b, int expectedSum) {
        assertEquals(expectedSum, a + b,
                    a + " + " + b + " should equal " + expectedSum);
    }

    // Test with method source (complex data)
    @ParameterizedTest
    @MethodSource("userProvider")
    void userCreation(String email, String name, boolean shouldSucceed) {
        if (shouldSucceed) {
            assertDoesNotThrow(() -> createUser(email, name));
        } else {
            assertThrows(ValidationException.class, () -> createUser(email, name));
        }
    }

    // Data provider method for @MethodSource
    private static Stream<Arguments> userProvider() {
        return Stream.of(
            Arguments.of("valid@email.com", "John Doe", true),
            Arguments.of("invalid-email", "John Doe", false),
            Arguments.of("valid@email.com", "", false),
            Arguments.of(null, "John Doe", false)
        );
    }

    // Helper methods
    private boolean isPalindrome(String str) {
        return new StringBuilder(str).reverse().toString().equals(str);
    }

    private void createUser(String email, String name) {
        if (email == null || !email.contains("@") || name == null || name.trim().isEmpty()) {
            throw new ValidationException("Invalid user data");
        }
        // Actual creation logic
    }
}
```

## Mocking with Mockito

### Mockito Fundamentals and Terminology

**MockitoBasics.java**

```java
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import static org.mockito.Mockito.*;

/**
 * Mockito is the most popular mocking framework for Java
 * Key Concepts:
 * - Mock: Fake object with pre-programmed behavior
 * - Stubbing: Defining mock behavior (when...thenReturn)
 * - Verification: Checking mock interactions (verify)
 * - Argument Matchers: Flexible parameter matching (any(), eq())
 */
@ExtendWith(MockitoExtension.class) // Enables Mockito annotations
class MockitoBasics {

    @Mock
    private UserRepository userRepository; // Creates mock instance

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserService userService; // Injects mocks into this instance

    @Test
    void basicMockingAndStubbing() {
        // Stubbing - defining mock behavior
        when(userRepository.findById(1L))
            .thenReturn(java.util.Optional.of(new User(1L, "john@email.com")));

        when(userRepository.findByEmail(anyString()))
            .thenReturn(java.util.Optional.empty());

        // Verification - checking mock interactions
        userService.findUser(1L);

        verify(userRepository).findById(1L); // Verify method was called
        verify(userRepository, times(1)).findById(1L); // Verify call count
        verify(userRepository, never()).delete(any()); // Verify method never called
    }

    @Test
    void argumentMatchers() {
        // Argument matchers provide flexible parameter matching
        when(userRepository.findByEmailAndStatus(anyString(), eq(UserStatus.ACTIVE)))
            .thenReturn(java.util.Optional.of(new User(1L, "test@email.com")));

        when(userRepository.save(argThat(user -> user.getEmail().contains("@"))))
            .thenAnswer(invocation -> invocation.getArgument(0));

        // any(), anyString(), anyLong(), eq(), isNull(), isNotNull(), argThat()
    }

    @Test
    void voidMethodStubbing() {
        // Stubbing void methods (like sendEmail)
        doNothing().when(emailService).sendWelcomeEmail(any(User.class));
        doThrow(new RuntimeException("Service unavailable"))
            .when(emailService).sendNotification(any(User.class));

        userService.registerUser(new User(1L, "test@email.com"));

        verify(emailService).sendWelcomeEmail(any(User.class));
    }

    @Test
    void verificationModes() {
        userService.processUser(1L);

        // Different verification modes
        verify(userRepository).findById(1L); // Called once (default)
        verify(userRepository, times(1)).findById(1L); // Called exactly once
        verify(userRepository, atLeast(1)).findById(1L); // Called at least once
        verify(userRepository, atMost(5)).findById(1L); // Called at most 5 times
        verify(userRepository, never()).delete(any()); // Never called
        verify(userRepository, timeout(1000)).findById(1L); // Called within timeout
    }

    @Test
    void spyExample() {
        // Spy wraps real object, allowing partial mocking
        List<String> realList = new ArrayList<>();
        List<String> spyList = spy(realList);

        // Stub specific method, call real methods for others
        when(spyList.size()).thenReturn(100);

        spyList.add("real element");

        assertEquals(1, realList.size()); // Real list has 1 element
        assertEquals(100, spyList.size()); // Spy reports 100 elements

        verify(spyList).add("real element"); // Can verify interactions
    }
}
```

## Testing Service Layer

### Service Class Under Test

**UserService.java**

```java
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Business logic for user registration
     * - Validates input
     * - Checks for duplicate email
     * - Encodes password
     * - Saves user
     * - Sends welcome email
     */
    public User registerUser(UserRegistrationRequest request) {
        // Validation
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new ValidationException("Email is required");
        }

        // Business rule: Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered: " + request.getEmail());
        }

        // Create user entity
        User user = User.builder()
            .email(request.getEmail())
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .status(UserStatus.ACTIVE)
            .build();

        // Save user
        User savedUser = userRepository.save(user);

        // Send welcome email (fire and forget)
        emailService.sendWelcomeEmail(savedUser);

        return savedUser;
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUserEmail(Long userId, String newEmail) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));

        if (userRepository.existsByEmail(newEmail)) {
            throw new DuplicateEmailException("Email already exists: " + newEmail);
        }

        user.setEmail(newEmail);
        return userRepository.save(user);
    }
}
```

### Comprehensive Service Test

**UserServiceTest.java**

```java
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Comprehensive service layer testing demonstrating:
 * - Mocking dependencies
 * - Testing business logic
 * - Verifying interactions
 * - Exception testing
 * - Argument capture
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Captor
    private ArgumentCaptor<User> userCaptor;

    private UserRegistrationRequest validRequest;

    @BeforeEach
    void setUp() {
        // Common test data setup
        validRequest = UserRegistrationRequest.builder()
            .email("john.doe@example.com")
            .firstName("John")
            .lastName("Doe")
            .password("securePassword123")
            .build();
    }

    @Test
    @DisplayName("Should successfully register user with valid data")
    void registerUser_WithValidData_ReturnsUser() {
        // Arrange: Setup mock behavior
        when(userRepository.existsByEmail(validRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(validRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            return User.builder()
                .id(1L) // Simulate database assigning ID
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .passwordHash(user.getPasswordHash())
                .status(user.getStatus())
                .build();
        });

        // Act: Execute the method under test
        User result = userService.registerUser(validRequest);

        // Assert: Verify the outcome
        assertNotNull(result, "Result should not be null");
        assertEquals(1L, result.getId(), "User should have assigned ID");
        assertEquals("john.doe@example.com", result.getEmail(), "Email should match");
        assertEquals("encodedPassword", result.getPasswordHash(), "Password should be encoded");
        assertEquals(UserStatus.ACTIVE, result.getStatus(), "User should be active");

        // Verify interactions with mocks
        verify(userRepository).existsByEmail(validRequest.getEmail());
        verify(passwordEncoder).encode(validRequest.getPassword());
        verify(userRepository).save(userCaptor.capture());
        verify(emailService).sendWelcomeEmail(any(User.class));

        // Verify captured arguments
        User savedUser = userCaptor.getValue();
        assertEquals("john.doe@example.com", savedUser.getEmail());
        assertEquals("John", savedUser.getFirstName());
    }

    @Test
    @DisplayName("Should throw exception when email already exists")
    void registerUser_WithDuplicateEmail_ThrowsException() {
        // Arrange
        when(userRepository.existsByEmail(validRequest.getEmail())).thenReturn(true);

        // Act & Assert
        DuplicateEmailException exception = assertThrows(
            DuplicateEmailException.class,
            () -> userService.registerUser(validRequest),
            "Should throw DuplicateEmailException"
        );

        assertEquals("Email already registered: john.doe@example.com", exception.getMessage());

        // Verify no interactions with save or email service
        verify(userRepository, never()).save(any(User.class));
        verify(emailService, never()).sendWelcomeEmail(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when email is null")
    void registerUser_WithNullEmail_ThrowsValidationException() {
        // Arrange
        UserRegistrationRequest invalidRequest = UserRegistrationRequest.builder()
            .email(null)
            .firstName("John")
            .lastName("Doe")
            .password("password")
            .build();

        // Act & Assert
        ValidationException exception = assertThrows(
            ValidationException.class,
            () -> userService.registerUser(invalidRequest)
        );

        assertEquals("Email is required", exception.getMessage());
    }

    @Test
    @DisplayName("Should return user when found by ID")
    void getUserById_WhenUserExists_ReturnsUser() {
        // Arrange
        User expectedUser = User.builder().id(1L).email("test@example.com").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(expectedUser));

        // Act
        Optional<User> result = userService.getUserById(1L);

        // Assert
        assertTrue(result.isPresent(), "User should be present");
        assertEquals(expectedUser, result.get(), "Returned user should match expected");
        verify(userRepository).findById(1L);
    }

    @Test
    @DisplayName("Should return empty when user not found by ID")
    void getUserById_WhenUserNotExists_ReturnsEmpty() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<User> result = userService.getUserById(999L);

        // Assert
        assertFalse(result.isPresent(), "User should not be present");
        verify(userRepository).findById(999L);
    }

    @Test
    @DisplayName("Should update user email when new email is available")
    void updateUserEmail_WithAvailableEmail_UpdatesSuccessfully() {
        // Arrange
        User existingUser = User.builder()
            .id(1L)
            .email("old@example.com")
            .firstName("John")
            .lastName("Doe")
            .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        User result = userService.updateUserEmail(1L, "new@example.com");

        // Assert
        assertEquals("new@example.com", result.getEmail(), "Email should be updated");
        verify(userRepository).existsByEmail("new@example.com");
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("new@example.com", savedUser.getEmail());
    }

    @Test
    @DisplayName("Should throw exception when updating to existing email")
    void updateUserEmail_WithExistingEmail_ThrowsException() {
        // Arrange
        User existingUser = User.builder().id(1L).email("old@example.com").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(
            DuplicateEmailException.class,
            () -> userService.updateUserEmail(1L, "existing@example.com")
        );

        verify(userRepository, never()).save(any(User.class));
    }
}
```

## Web Layer Testing

### Testing REST Controllers with MockMVC

**UserController.java**

```java
@RestController
@RequestMapping("/api/v1/users")
@Validated
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
            .map(user -> ResponseEntity.ok(UserResponse.from(user)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        UserResponse response = UserResponse.from(user);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(user.getId())
            .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        User user = userService.updateUser(id, request);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<PageResponse<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        Page<User> users = userService.getUsers(page, size, search);
        PageResponse<UserResponse> response = PageResponse.from(users, UserResponse::from);
        return ResponseEntity.ok(response);
    }
}
```

### Complete Controller Test with MockMVC

**UserControllerTest.java**

```java
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testing REST controllers using MockMVC
 * Key Benefits:
 * - No HTTP server needed (fast execution)
 * - Fine-grained request/response control
 * - Detailed error reporting
 * - Spring Security integration
 */
@WebMvcTest(UserController.class) // Slice test - only web layer
@Import({ObjectMapper.class, SecurityConfig.class}) // Import required beans
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc; // Main testing utility for web layer

    @MockBean
    private UserService userService; // Mock the service layer

    @Autowired
    private ObjectMapper objectMapper; // JSON serialization/deserialization

    private User testUser;
    private CreateUserRequest createRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(1L)
            .email("test@example.com")
            .firstName("John")
            .lastName("Doe")
            .build();

        createRequest = CreateUserRequest.builder()
            .email("new@example.com")
            .firstName("Jane")
            .lastName("Smith")
            .password("password123")
            .build();
    }

    @Test
    @DisplayName("GET /api/v1/users/{id} - Should return user when exists")
    void getUserById_WhenUserExists_ReturnsUser() throws Exception {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(Optional.of(testUser));

        // Act & Assert
        mockMvc.perform(get("/api/v1/users/{id}", 1L) // Path variable
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.email").value("test@example.com"))
            .andExpect(jsonPath("$.fullName").value("John Doe"));

        verify(userService).getUserById(1L);
    }

    @Test
    @DisplayName("GET /api/v1/users/{id} - Should return 404 when user not found")
    void getUserById_WhenUserNotExists_ReturnsNotFound() throws Exception {
        // Arrange
        when(userService.getUserById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/v1/users/{id}", 999L))
            .andExpect(status().isNotFound());

        verify(userService).getUserById(999L);
    }

    @Test
    @DisplayName("POST /api/v1/users - Should create user and return 201 with location header")
    void createUser_WithValidRequest_ReturnsCreated() throws Exception {
        // Arrange
        User newUser = User.builder()
            .id(2L)
            .email(createRequest.getEmail())
            .firstName(createRequest.getFirstName())
            .lastName(createRequest.getLastName())
            .build();

        when(userService.createUser(any(CreateUserRequest.class))).thenReturn(newUser);

        // Act & Assert
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isCreated())
            .andExpect(header().exists("Location"))
            .andExpect(header().string("Location", containsString("/api/v1/users/2")))
            .andExpect(jsonPath("$.id").value(2))
            .andExpect(jsonPath("$.email").value("new@example.com"))
            .andExpect(jsonPath("$.fullName").value("Jane Smith"));

        verify(userService).createUser(any(CreateUserRequest.class));
    }

    @Test
    @DisplayName("POST /api/v1/users - Should return 400 for invalid request")
    void createUser_WithInvalidRequest_ReturnsBadRequest() throws Exception {
        // Arrange
        CreateUserRequest invalidRequest = CreateUserRequest.builder()
            .email("invalid-email") // Invalid email format
            .firstName("") // Empty first name
            .lastName("Doe")
            .password("123") // Too short password
            .build();

        // Act & Assert - Spring Validation should catch these errors
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors").isArray())
            .andExpect(jsonPath("$.errors.length()").value(3)); // Three validation errors

        verify(userService, never()).createUser(any());
    }

    @Test
    @DisplayName("PUT /api/v1/users/{id} - Should update user and return 200")
    void updateUser_WithValidRequest_ReturnsOk() throws Exception {
        // Arrange
        UpdateUserRequest updateRequest = UpdateUserRequest.builder()
            .firstName("Johnny")
            .lastName("Smith")
            .build();

        User updatedUser = User.builder()
            .id(1L)
            .email("test@example.com")
            .firstName("Johnny")
            .lastName("Smith")
            .build();

        when(userService.updateUser(eq(1L), any(UpdateUserRequest.class))).thenReturn(updatedUser);

        // Act & Assert
        mockMvc.perform(put("/api/v1/users/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("Johnny"))
            .andExpect(jsonPath("$.lastName").value("Smith"));

        verify(userService).updateUser(eq(1L), any(UpdateUserRequest.class));
    }

    @Test
    @DisplayName("DELETE /api/v1/users/{id} - Should delete user and return 204")
    void deleteUser_WhenUserExists_ReturnsNoContent() throws Exception {
        // Arrange
        doNothing().when(userService).deleteUser(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/v1/users/{id}", 1L))
            .andExpect(status().isNoContent());

        verify(userService).deleteUser(1L);
    }

    @Test
    @DisplayName("GET /api/v1/users - Should return paginated users")
    void getUsers_WithPagination_ReturnsPage() throws Exception {
        // Arrange
        Page<User> userPage = new PageImpl<>(
            List.of(testUser),
            PageRequest.of(0, 10),
            1L
        );

        when(userService.getUsers(0, 10, null)).thenReturn(userPage);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users")
                .param("page", "0")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content.length()").value(1))
            .andExpect(jsonPath("$.content[0].email").value("test@example.com"))
            .andExpect(jsonPath("$.totalElements").value(1))
            .andExpect(jsonPath("$.totalPages").value(1))
            .andExpect(jsonPath("$.size").value(10));

        verify(userService).getUsers(0, 10, null);
    }

    @Test
    @DisplayName("GET /api/v1/users - Should return filtered users with search")
    void getUsers_WithSearch_ReturnsFilteredResults() throws Exception {
        // Arrange
        Page<User> userPage = new PageImpl<>(
            List.of(testUser),
            PageRequest.of(0, 10),
            1L
        );

        when(userService.getUsers(0, 10, "john")).thenReturn(userPage);

        // Act & Assert
        mockMvc.perform(get("/api/v1/users")
                .param("page", "0")
                .param("size", "10")
                .param("search", "john"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content.length()").value(1));

        verify(userService).getUsers(0, 10, "john");
    }
}
```

### Testing Security with MockMVC

**SecurityControllerTest.java**

```java
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;

/**
 * Testing secured endpoints with Spring Security Test
 */
@WebMvcTest(SecureController.class)
@Import(SecurityConfig.class)
class SecurityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("Should allow access to public endpoint without authentication")
    void publicEndpoint_WithoutAuth_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/public"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should deny access to secured endpoint without authentication")
    void securedEndpoint_WithoutAuth_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/secure"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER") // Mock authenticated user with USER role
    @DisplayName("Should allow access to secured endpoint with USER role")
    void securedEndpoint_WithUserRole_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/secure"))
            .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Should deny access to admin endpoint with USER role")
    void adminEndpoint_WithUserRole_ReturnsForbidden() throws Exception {
        mockMvc.perform(get("/api/admin"))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Should allow access to admin endpoint with ADMIN role")
    void adminEndpoint_WithAdminRole_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/admin"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should authenticate with CSRF token for state-changing operations")
    void postWithCsrf_WithValidToken_ReturnsOk() throws Exception {
        mockMvc.perform(post("/api/secure-action")
                .with(csrf())) // Include CSRF token
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should reject state-changing operations without CSRF token")
    void postWithoutCsrf_ReturnsForbidden() throws Exception {
        mockMvc.perform(post("/api/secure-action")
                .with(user("user").roles("USER"))) // Authenticated but no CSRF
            .andExpect(status().isForbidden());
    }
}
```

## Data Layer Testing

### Repository Testing with @DataJpaTest

**UserRepository.java**

```java
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByStatusOrderByLastNameAsc(UserStatus status);

    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:name% OR u.lastName LIKE %:name%")
    List<User> findByNameContaining(@Param("name") String name);

    Page<User> findByStatus(UserStatus status, Pageable pageable);

    long countByStatus(UserStatus status);

    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.lastLoginAt < :cutoffDate")
    int deactivateInactiveUsers(@Param("status") UserStatus status,
                               @Param("cutoffDate") LocalDateTime cutoffDate);
}
```

**UserRepositoryTest.java**

```java
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

/**
 * Testing JPA repositories with @DataJpaTest
 * Key Features:
 * - Auto-configured test database (H2 by default)
 * - TestEntityManager for database operations
 * - Automatic transaction rollback
 * - Only JPA components loaded
 */
@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager; // JPA testing utility

    @Autowired
    private UserRepository userRepository;

    private User activeUser;
    private User inactiveUser;

    @BeforeEach
    void setUp() {
        // Clear any existing data
        entityManager.clear();

        // Create test users
        activeUser = User.builder()
            .email("active@example.com")
            .firstName("John")
            .lastName("Doe")
            .status(UserStatus.ACTIVE)
            .lastLoginAt(LocalDateTime.now())
            .build();

        inactiveUser = User.builder()
            .email("inactive@example.com")
            .firstName("Jane")
            .lastName("Smith")
            .status(UserStatus.INACTIVE)
            .lastLoginAt(LocalDateTime.now().minusMonths(2))
            .build();

        // Persist test data
        entityManager.persistAndFlush(activeUser);
        entityManager.persistAndFlush(inactiveUser);
    }

    @Test
    @DisplayName("Should find user by email when user exists")
    void findByEmail_WhenUserExists_ReturnsUser() {
        // Act
        Optional<User> found = userRepository.findByEmail("active@example.com");

        // Assert
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("active@example.com");
        assertThat(found.get().getFirstName()).isEqualTo("John");
    }

    @Test
    @DisplayName("Should return empty when user with email does not exist")
    void findByEmail_WhenUserNotExists_ReturnsEmpty() {
        // Act
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");

        // Assert
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("Should return true when email exists")
    void existsByEmail_WhenEmailExists_ReturnsTrue() {
        // Act & Assert
        assertThat(userRepository.existsByEmail("active@example.com")).isTrue();
    }

    @Test
    @DisplayName("Should return false when email does not exist")
    void existsByEmail_WhenEmailNotExists_ReturnsFalse() {
        // Act & Assert
        assertThat(userRepository.existsByEmail("unknown@example.com")).isFalse();
    }

    @Test
    @DisplayName("Should find users by status ordered by last name")
    void findByStatusOrderByLastNameAsc_ReturnsOrderedUsers() {
        // Arrange - Add more users
        User userC = User.builder()
            .email("c@example.com")
            .firstName("Charlie")
            .lastName("Brown")
            .status(UserStatus.ACTIVE)
            .build();

        User userA = User.builder()
            .email("a@example.com")
            .firstName("Alice")
            .lastName("Adams")
            .status(UserStatus.ACTIVE)
            .build();

        entityManager.persist(userC);
        entityManager.persist(userA);
        entityManager.flush();

        // Act
        List<User> activeUsers = userRepository.findByStatusOrderByLastNameAsc(UserStatus.ACTIVE);

        // Assert
        assertThat(activeUsers).hasSize(3);
        assertThat(activeUsers.get(0).getLastName()).isEqualTo("Adams"); // A
        assertThat(activeUsers.get(1).getLastName()).isEqualTo("Brown"); // B
        assertThat(activeUsers.get(2).getLastName()).isEqualTo("Doe");   // D
    }

    @Test
    @DisplayName("Should find users by name containing search term")
    void findByNameContaining_WithMatchingName_ReturnsUsers() {
        // Act
        List<User> users = userRepository.findByNameContaining("oh");

        // Assert - Should find "John" Doe
        assertThat(users).hasSize(1);
        assertThat(users.get(0).getFirstName()).isEqualTo("John");
    }

    @Test
    @DisplayName("Should return paginated users by status")
    void findByStatus_WithPagination_ReturnsPage() {
        // Act
        Page<User> userPage = userRepository.findByStatus(
            UserStatus.ACTIVE,
            PageRequest.of(0, 5)
        );

        // Assert
        assertThat(userPage.getContent()).hasSize(1);
        assertThat(userPage.getTotalElements()).isEqualTo(1);
        assertThat(userPage.getTotalPages()).isEqualTo(1);
        assertThat(userPage.getNumber()).isEqualTo(0);
    }

    @Test
    @DisplayName("Should count users by status")
    void countByStatus_ReturnsCorrectCount() {
        // Act & Assert
        assertThat(userRepository.countByStatus(UserStatus.ACTIVE)).isEqualTo(1);
        assertThat(userRepository.countByStatus(UserStatus.INACTIVE)).isEqualTo(1);
    }

    @Test
    @DisplayName("Should update user status for inactive users")
    void deactivateInactiveUsers_UpdatesMatchingUsers() {
        // Arrange
        LocalDateTime cutoffDate = LocalDateTime.now().minusMonths(1);

        // Act
        int updatedCount = userRepository.deactivateInactiveUsers(
            UserStatus.SUSPENDED,
            cutoffDate
        );

        // Assert
        assertThat(updatedCount).isEqualTo(1); // Only inactiveUser should match

        // Verify the update
        User updatedUser = entityManager.find(User.class, inactiveUser.getId());
        assertThat(updatedUser.getStatus()).isEqualTo(UserStatus.SUSPENDED);

        // Active user should not be updated
        User activeUserAfter = entityManager.find(User.class, activeUser.getId());
        assertThat(activeUserAfter.getStatus()).isEqualTo(UserStatus.ACTIVE);
    }

    @Test
    @DisplayName("Should cascade operations correctly")
    void saveUser_WithRelatedEntities_CascadesCorrectly() {
        // Arrange
        User user = User.builder()
            .email("cascade@example.com")
            .firstName("Cascade")
            .lastName("Test")
            .build();

        Address address = Address.builder()
            .street("123 Main St")
            .city("Test City")
            .user(user)
            .build();

        user.setAddresses(List.of(address));

        // Act
        User savedUser = userRepository.save(user);
        entityManager.flush();
        entityManager.clear(); // Clear persistence context to test database state

        // Assert
        User foundUser = userRepository.findById(savedUser.getId()).orElseThrow();
        assertThat(foundUser.getAddresses()).hasSize(1);
        assertThat(foundUser.getAddresses().get(0).getStreet()).isEqualTo("123 Main St");
    }
}
```

### Testing Database Constraints and Validation

**UserRepositoryConstraintsTest.java**

```java
@DataJpaTest
class UserRepositoryConstraintsTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should enforce unique email constraint")
    void saveUser_WithDuplicateEmail_ThrowsException() {
        // Arrange
        User user1 = User.builder()
            .email("duplicate@example.com")
            .firstName("First")
            .lastName("User")
            .build();

        User user2 = User.builder()
            .email("duplicate@example.com") // Same email
            .firstName("Second")
            .lastName("User")
            .build();

        // Act & Assert
        entityManager.persistAndFlush(user1);

        assertThatExceptionOfType(DataIntegrityViolationException.class)
            .isThrownBy(() -> entityManager.persistAndFlush(user2));
    }

    @Test
    @DisplayName("Should enforce not null constraints")
    void saveUser_WithNullRequiredFields_ThrowsException() {
        // Arrange
        User invalidUser = User.builder()
            .email(null) // Required field
            .firstName("John")
            .lastName("Doe")
            .build();

        // Act & Assert
        assertThatExceptionOfType(DataIntegrityViolationException.class)
            .isThrownBy(() -> entityManager.persistAndFlush(invalidUser));
    }

    @Test
    @DisplayName("Should enforce field length constraints")
    void saveUser_WithExceedingLength_ThrowsException() {
        // Arrange
        User invalidUser = User.builder()
            .email("test@example.com")
            .firstName("A".repeat(51)) // Exceeds 50 character limit
            .lastName("Doe")
            .build();

        // Act & Assert
        assertThatExceptionOfType(DataIntegrityViolationException.class)
            .isThrownBy(() -> entityManager.persistAndFlush(invalidUser));
    }
}
```

## Advanced Testing Patterns

### Custom Test Annotations

**TestAnnotations.java**

```java
// Custom composite annotation for service tests
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@ExtendWith(MockitoExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
public @interface ServiceTest {
}

// Custom composite annotation for web tests
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@WebMvcTest
@AutoConfigureJsonTesters
@Import(ObjectMapperConfig.class)
@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
public @interface WebLayerTest {
    Class<?>[] value() default {};
}

// Custom composite annotation for repository tests
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional(propagation = Propagation.NOT_SUPPORTED) // No automatic rollback
@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
public @interface RepositoryTest {
}

// Usage example
@ServiceTest
class UserServiceCustomTest {
    // Test methods...
}

@WebLayerTest(UserController.class)
class UserControllerCustomTest {
    // Test methods...
}

@RepositoryTest
class UserRepositoryCustomTest {
    // Test methods...
}
```

### Test Containers for Integration Testing

**TestContainersConfig.java**

```java
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class TestContainersIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    void testWithRealDatabase() {
        // Test with actual PostgreSQL database
        // Useful for testing database-specific features
    }
}
```

# Complete Unit Testing Guide for Spring Boot 3 - Final Part

## Testing Best Practices

### Test Organization and Structure

**TestNamingConventions.java**

```java
/**
 * PRO TESTING PATTERN: Consistent test naming
 * Pattern: MethodName_StateUnderTest_ExpectedBehavior
 */
class UserServiceNamingTest {

    @Test
    void registerUser_WithValidData_ReturnsUser() { }

    @Test
    void registerUser_WithDuplicateEmail_ThrowsException() { }

    @Test
    void findUserById_WhenUserExists_ReturnsUser() { }

    @Test
    void findUserById_WhenUserNotExists_ReturnsEmpty() { }

    @Test
    void updateUser_WithValidData_UpdatesSuccessfully() { }
}

/**
 * PRO TESTING PATTERN: Given-When-Then structure
 * Makes tests more readable and structured
 */
class GivenWhenThenTest {

    @Test
    void userRegistration_SuccessScenario() {
        // Given - Setup test data and preconditions
        UserRequest request = validUserRequest();
        when(userRepository.existsByEmail(any())).thenReturn(false);

        // When - Execute the action being tested
        User result = userService.registerUser(request);

        // Then - Verify the outcomes and postconditions
        assertThat(result).isNotNull();
        verify(userRepository).save(any(User.class));
    }
}
```

### Test Data Management

**TestDataFactories.java**

```java
/**
 * PRO TESTING PATTERN: Test Data Builders
 * Eliminates duplication in test data setup
 */
class TestDataBuilders {

    static User.UserBuilder validUser() {
        return User.builder()
            .email("test@example.com")
            .firstName("John")
            .lastName("Doe")
            .status(UserStatus.ACTIVE);
    }

    static UserRequest.UserRequestBuilder validUserRequest() {
        return UserRequest.builder()
            .email("request@example.com")
            .firstName("Jane")
            .lastName("Smith")
            .password("Secure123!");
    }

    static UserResponse.UserResponseBuilder validUserResponse() {
        return UserResponse.builder()
            .id(1L)
            .email("response@example.com")
            .fullName("Response User");
    }
}

// Usage in tests
@Test
void withTestDataBuilder() {
    User user = TestDataBuilders.validUser()
        .id(1L)
        .email("specific@example.com")
        .build();

    UserRequest request = TestDataBuilders.validUserRequest()
        .email("new@example.com")
        .build();
}
```

### Assertion Best Practices

**AssertionPatterns.java**

```java
import static org.assertj.core.api.Assertions.*;

/**
 * PRO TESTING PATTERN: Use AssertJ for fluent assertions
 * More readable and powerful than JUnit assertions
 */
class AssertionBestPracticesTest {

    @Test
    void assertJ_FluentAssertions() {
        User user = User.builder()
            .id(1L)
            .email("john@example.com")
            .firstName("John")
            .lastName("Doe")
            .age(30)
            .build();

        // Fluent assertions chain
        assertThat(user)
            .isNotNull()
            .hasFieldOrPropertyWithValue("id", 1L)
            .hasFieldOrPropertyWithValue("email", "john@example.com")
            .extracting(User::getFullName)
            .isEqualTo("John Doe");

        // Collection assertions
        List<User> users = List.of(user);
        assertThat(users)
            .hasSize(1)
            .first()
            .extracting(User::getEmail)
            .isEqualTo("john@example.com");

        // Exception assertions
        assertThatThrownBy(() -> userService.registerUser(null))
            .isInstanceOf(ValidationException.class)
            .hasMessageContaining("Request cannot be null");
    }

    @Test
    void customAssertions_ForDomainObjects() {
        User user = TestDataBuilders.validUser().build();

        // Custom assertion for domain-specific checks
        assertThatUser(user)
            .hasActiveStatus()
            .hasValidEmail()
            .hasName("John Doe");
    }

    // Custom AssertJ assertion
    private AbstractUserAssert assertThatUser(User user) {
        return new AbstractUserAssert(user, AbstractUserAssert.class);
    }
}
```

### Test Configuration and Environment

**TestConfiguration.java**

```java
/**
 * PRO TESTING PATTERN: Externalize test configuration
 */
@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public PasswordEncoder testPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Primary
    public Clock testClock() {
        return Clock.fixed(Instant.now(), ZoneId.systemDefault());
    }
}

/**
 * PRO TESTING PATTERN: Profile-specific test properties
 */
@ActiveProfiles("test")
@SpringBootTest
class ProfileSpecificTest {

    @Value("${app.test.timeout}")
    private long testTimeout;

    @Test
    void testWithCustomProperties() {
        assertThat(testTimeout).isEqualTo(5000L);
    }
}
```

## Common Testing Anti-Patterns and Solutions

### Testing Anti-Patterns

**TestingAntiPatterns.java**

```java
/**
 * ANTI-PATTERN: Test method does too much
 * SOLUTION: One assertion per test scenario
 */
class AntiPatternsTest {

    // ❌ ANTI-PATTERN: Kitchen sink test
    @Test
    void testUserScenarios() {
        // Tests creation, update, deletion all in one
        // Hard to debug and understand what failed
    }

    // ✅ SOLUTION: Focused single-responsibility tests
    @Test
    void createUser_WithValidData_Success() { }

    @Test
    void updateUser_WithNewEmail_Success() { }

    @Test
    void deleteUser_WhenExists_Success() { }
}

/**
 * ANTI-PATTERN: Testing implementation details
 * SOLUTION: Test behavior, not implementation
 */
class ImplementationTesting {

    // ❌ ANTI-PATTERN: Testing private methods
    @Test
    void testPrivateMethod() {
        // Using reflection to test private methods
        // Tests become brittle and break with refactoring
    }

    // ✅ SOLUTION: Test public contract
    @Test
    void publicMethod_ProducesExpectedResult() {
        // Test what the method promises to do
        // Not how it does it internally
    }
}

/**
 * ANTI-PATTERN: Over-mocking
 * SOLUTION: Mock only external dependencies
 */
class MockingAntiPatterns {

    // ❌ ANTI-PATTERN: Mocking everything
    @Test
    void overMockedTest() {
        // Mocking domain objects, value objects
        // Complex setup that doesn't test real behavior
    }

    // ✅ SOLUTION: Mock only external dependencies
    @Test
    void properlyMockedTest() {
        // Mock only: databases, external APIs, file systems
        // Don't mock: domain logic, simple calculations
    }
}
```

### Test Maintenance Patterns

**TestMaintenance.java**

```java
/**
 * PRO TESTING PATTERN: Page Object Pattern for Web Tests
 */
class LoginPage {

    private final MockMvc mockMvc;

    LoginPage(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    ResultActions loginWith(String username, String password) throws Exception {
        return mockMvc.perform(post("/login")
            .param("username", username)
            .param("password", password));
    }

    ResultActions navigateToLogin() throws Exception {
        return mockMvc.perform(get("/login"));
    }
}

/**
 * PRO TESTING PATTERN: Test Data Cleanup
 */
@Transactional
class DataCleanupTest {

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void cleanupTestData() {
        userRepository.deleteAllInBatch();
    }

    @Test
    void testWithCleanSlate() {
        // Each test starts with clean database
    }
}
```

## Pro Testing Terms Glossary

### A-C

**AAA Pattern** - Arrange-Act-Assert: Standard test structure

```java
@Test
void test_AAA_Pattern() {
    // Arrange: Setup test data and mocks
    User user = TestDataBuilders.validUser().build();

    // Act: Execute the method under test
    User result = userService.createUser(user);

    // Assert: Verify the outcome
    assertThat(result).isNotNull();
}
```

**Assertion** - Verification of expected outcome in tests

```java
// Different types of assertions:
assertEquals(expected, actual);          // JUnit
assertThat(actual).isEqualTo(expected); // AssertJ (fluent)
verify(mock).methodCall();              // Mockito (behavior)
```

**Boundary Testing** - Testing at the edges of input ranges

```java
@Test
void boundaryTesting_Examples() {
    // Minimum valid value
    testWithAge(18); // Minimum age

    // Maximum valid value
    testWithAge(100); // Maximum age

    // Just below minimum
    testWithAge(17); // Should fail

    // Just above maximum
    testWithAge(101); // Should fail
}
```

**Code Coverage** - Metric showing how much code is exercised by tests

```java
// Aim for high coverage of business logic
// Don't chase 100% - focus on meaningful tests

public class CoverageExample {
    public String businessMethod(int input) {
        if (input > 100) {           // Branch 1
            return "High";           // Statement 1
        } else if (input > 50) {     // Branch 2
            return "Medium";         // Statement 2
        } else {
            return "Low";            // Statement 3
        }
    }
}
```

### D-F

**Data-Driven Testing** - Running same test with different data sets

```java
@ParameterizedTest
@CsvSource({
    "1, 1, 2",
    "2, 3, 5",
    "10, 20, 30"
})
void dataDriven_AdditionTest(int a, int b, int expected) {
    assertEquals(expected, a + b);
}
```

**Dependency Injection** - Providing test dependencies externally

```java
@ExtendWith(MockitoExtension.class)
class DependencyInjectionTest {

    @Mock
    private UserRepository repository; // Injected mock

    @InjectMocks
    private UserService service; // Dependencies auto-injected
}
```

**Equivalence Partitioning** - Dividing input data into valid/invalid partitions

```java
@Test
void equivalencePartitioning_Examples() {
    // Valid partition: 18-100
    testWithAge(30);  // Should succeed

    // Invalid partitions: <18, >100
    testWithAge(17);  // Should fail
    testWithAge(101); // Should fail
}
```

**F.I.R.S.T. Principles** - Properties of good tests

```java
// Fast - Run quickly (<1 second)
@Test
void fastTest() { /* Uses mocks, no I/O */ }

// Isolated - Don't depend on other tests
@Test
void isolatedTest() { /* No shared state */ }

// Repeatable - Same results every time
@Test
void repeatableTest() { /* No randomness */ }

// Self-Validating - Automatic pass/fail
@Test
void selfValidatingTest() { /* No manual checks */ }

// Thorough/Timely - Cover scenarios, written with code
@Test
void thoroughTest() { /* Covers edge cases */ }
```

### G-M

**Given-When-Then** - Behavior-Driven Development (BDD) test structure

```java
@Test
void givenWhenThen_Example() {
    // Given: Initial context and setup
    User existingUser = TestDataBuilders.validUser().build();

    // When: Action occurs
    User updatedUser = userService.updateEmail(existingUser, "new@email.com");

    // Then: Expected outcomes
    assertThat(updatedUser.getEmail()).isEqualTo("new@email.com");
}
```

**Integration Test** - Testing multiple components together

```java
@SpringBootTest
class IntegrationTest {
    // Tests interaction between components
    // Slower but more realistic than unit tests
}
```

**Mock Object** - Fake object simulating real dependency behavior

```java
@Mock
private EmailService emailService; // Mock object

@Test
void mock_Usage() {
    // Stub behavior
    when(emailService.send(any())).thenReturn(true);

    // Verify interactions
    verify(emailService).send(any(Email.class));
}
```

**Mutation Testing** - Quality metric by introducing faults

```java
// Original code:
public int calculate(int a, int b) {
    return a + b;  // Mutation: change to a - b
}

// Good test should fail when mutation introduced
@Test
void calculate_AddsNumbers() {
    assertEquals(5, calculator.calculate(2, 3));
}
```

### P-S

**Parameterized Test** - Single test method with multiple data sets

```java
@ParameterizedTest
@ValueSource(strings = {"", "  ", "\t", "\n"})
void isEmpty_BlankStrings_ReturnsTrue(String input) {
    assertTrue(StringUtils.isEmpty(input));
}
```

**Regression Test** - Ensuring fixed bugs don't reoccur

```java
@Test
void regression_Bug123_EmailValidation() {
    // This bug was fixed in version 1.2.3
    // Test ensures it doesn't come back
    assertThrows(ValidationException.class,
        () -> userService.registerUser("invalid-email"));
}
```

**Spy** - Partial mock that calls real methods by default

```java
@Spy
private List<String> realList = new ArrayList<>();

@Test
void spy_Example() {
    // Real method called
    realList.add("actual");

    // Stubbed method
    when(realList.size()).thenReturn(100);

    assertEquals(1, realList.size()); // Real: 1 element
}
```

**Stub** - Test double providing canned responses

```java
@Test
void stub_Example() {
    // Stub provides predetermined responses
    when(userRepository.findById(1L))
        .thenReturn(Optional.of(testUser));

    // No logic - just returns what we tell it
}
```

### T-Z

**Test Double** - Generic term for fake test objects

```java
// Types of test doubles:
Mock mock = mock(Repository.class);      // Verify interactions
Stub stub = new StubRepository();        // Predefined responses
Fake fake = new FakeDatabase();          // Working implementation
Spy spy = spy(realObject);               // Wrap real object
Dummy dummy = null;                      // Never used
```

**Test Fixture** - Fixed state for running tests

```java
class TestFixture {

    private User testUser;
    private UserService userService;

    @BeforeEach
    void setUp() {
        // This is the test fixture
        testUser = TestDataBuilders.validUser().build();
        userService = new UserService();
    }
}
```

**Unit Test** - Isolated test of a single component

```java
@ExtendWith(MockitoExtension.class)
class UnitTest {
    // Tests one class in isolation
    // Fast execution (<100ms)
    // No external dependencies
}
```

**White Box Testing** - Testing with knowledge of internal implementation

```java
@Test
void whiteBox_Example() {
    // We know the method uses caching internally
    // We test that cache is used on second call

    service.getUser(1L); // First call - hits database
    service.getUser(1L); // Second call - should use cache

    verify(database, times(1)).findById(1L); // Only called once
}
```

## Quick Reference Index

### Testing Frameworks

- **JUnit 5**: Modern testing framework (`@Test`, `@BeforeEach`)
- **Mockito**: Mocking framework (`@Mock`, `when().thenReturn()`)
- **AssertJ**: Fluent assertions (`assertThat(actual).isEqualTo(expected)`)
- **Spring Test**: Spring integration testing (`@SpringBootTest`)

### Test Types

- **Unit Test**: Single component, isolated, fast
- **Integration Test**: Multiple components, slower, realistic
- **Slice Test**: Specific layer (`@WebMvcTest`, `@DataJpaTest`)

### Key Annotations

```java
@Test void testMethod() { }                    // Marks test method
@BeforeEach void setUp() { }                  // Runs before each test
@AfterEach void tearDown() { }               // Runs after each test
@DisplayName("Descriptive name")             // Custom test name
@ParameterizedTest                           // Data-driven test
@Mock private Dependency dependency;         // Creates mock
@InjectMocks private Service service;        // Injects mocks
@WebMvcTest(Controller.class)                // Web layer test slice
@DataJpaTest                                // Data layer test slice
@SpringBootTest                             // Full integration test
```

### Common Assertions

```java
// JUnit Assertions
assertEquals(expected, actual);
assertTrue(condition);
assertNull(object);
assertThrows(Exception.class, () -> method());

// AssertJ Fluent Assertions
assertThat(actual).isEqualTo(expected);
assertThat(collection).hasSize(3).contains(element);
assertThat(exception).hasMessageContaining("error");

// Mockito Verifications
verify(mock).methodCall();
verify(mock, times(2)).methodCall();
verify(mock, never()).methodCall();
```

### Testing Principles

- **FIRST**: Fast, Isolated, Repeatable, Self-Validating, Thorough
- **AAA**: Arrange, Act, Assert
- **Given-When-Then**: BDD structure
- **One Assert Per Test**: Single responsibility
