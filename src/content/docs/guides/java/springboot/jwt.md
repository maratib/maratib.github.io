---
title: JWT
description: JWT
---

**JWT Authentication with Refresh Tokens**

## 1. Understanding the Flow

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database

    Note over Client,Database: Initial Login
    Client->>Server: POST /auth/login (credentials)
    Server->>Database: Validate credentials
    Database-->>Server: User details
    Server->>Server: Generate Access Token (short-lived)
    Server->>Server: Generate Refresh Token (long-lived)
    Server->>Database: Store Refresh Token
    Server-->>Client: Access Token + Refresh Token

    Note over Client,Database: Accessing Protected Resources
    Client->>Server: API Request with Access Token
    Server->>Server: Validate Access Token
    Server-->>Client: Protected Data

    Note over Client,Database: Access Token Expired
    Client->>Server: API Request (expired Access Token)
    Server-->>Client: 401 Unauthorized

    Note over Client,Database: Refresh Token Flow
    Client->>Server: POST /auth/refresh (Refresh Token)
    Server->>Database: Validate Refresh Token
    Database-->>Server: Valid token + user info
    Server->>Server: Generate new Access Token
    Server-->>Client: New Access Token
```

## 2. Project Setup

### Dependencies (pom.xml)

<details>
<summary>pom.xml</summary>

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

</details>

## 3. Step-by-Step Implementation

### Step 1: JWT Utility Class

```java
@Component
public class JwtUtil {

    private final String SECRET_KEY = "mySecretKey";
    private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15; // 15 minutes
    private final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7 days

    public String generateAccessToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Date extractExpiration(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
```

**Unit Tests for JwtUtil:**

```java
@ExtendWith(MockitoExtension.class)
class JwtUtilTest {

    @InjectMocks
    private JwtUtil jwtUtil;

    @Test
    void generateAccessToken_ShouldReturnValidToken() {
        // When
        String token = jwtUtil.generateAccessToken("testuser");

        // Then
        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token));
        assertEquals("testuser", jwtUtil.extractUsername(token));
    }

    @Test
    void validateToken_WithInvalidToken_ShouldReturnFalse() {
        // When & Then
        assertFalse(jwtUtil.validateToken("invalid.token.here"));
    }

    @Test
    void isTokenExpired_WithExpiredToken_ShouldReturnTrue() throws InterruptedException {
        // Given - Create a token that expires immediately
        JwtUtil shortLivedJwtUtil = new JwtUtil();
        String token = shortLivedJwtUtil.generateAccessToken("testuser");

        Thread.sleep(1000); // Wait for token to expire

        // When & Then
        assertTrue(shortLivedJwtUtil.isTokenExpired(token));
    }
}
```

### Step 2: Database Entities

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String email;

    // constructors, getters, setters
}

@Entity
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;
    private String username;
    private Date expiryDate;

    // constructors, getters, setters
}
```

### Step 3: Authentication Request/Response DTOs

```java
@Data
public class LoginRequest {
    private String username;
    private String password;
}

@Data
public class JwtResponse {
    private String accessToken;
    private String refreshToken;
    private String type = "Bearer";

    public JwtResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}

@Data
public class TokenRefreshRequest {
    private String refreshToken;
}
```

### Step 4: Authentication Service

```java
@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public JwtResponse authenticate(LoginRequest loginRequest) {
        // Validate user credentials
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

        // Save refresh token
        saveRefreshToken(user.getUsername(), refreshToken);

        return new JwtResponse(accessToken, refreshToken);
    }

    public JwtResponse refreshToken(TokenRefreshRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);

        // Verify refresh token exists in database
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        // Generate new access token
        String newAccessToken = jwtUtil.generateAccessToken(username);

        return new JwtResponse(newAccessToken, refreshToken);
    }

    private void saveRefreshToken(String username, String token) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUsername(username);
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(jwtUtil.extractExpiration(token));

        refreshTokenRepository.save(refreshToken);
    }

    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(refreshTokenRepository::delete);
    }
}
```

**Unit Tests for AuthService:**

```java
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void authenticate_WithValidCredentials_ShouldReturnTokens() {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        User user = new User();
        user.setUsername("testuser");
        user.setPassword("encodedPassword");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateAccessToken("testuser")).thenReturn("accessToken");
        when(jwtUtil.generateRefreshToken("testuser")).thenReturn("refreshToken");

        // When
        JwtResponse response = authService.authenticate(loginRequest);

        // Then
        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void refreshToken_WithValidToken_ShouldReturnNewAccessToken() {
        // Given
        TokenRefreshRequest request = new TokenRefreshRequest();
        request.setRefreshToken("validRefreshToken");

        RefreshToken storedToken = new RefreshToken();
        storedToken.setToken("validRefreshToken");
        storedToken.setUsername("testuser");

        when(jwtUtil.validateToken("validRefreshToken")).thenReturn(true);
        when(jwtUtil.extractUsername("validRefreshToken")).thenReturn("testuser");
        when(refreshTokenRepository.findByToken("validRefreshToken")).thenReturn(Optional.of(storedToken));
        when(jwtUtil.generateAccessToken("testuser")).thenReturn("newAccessToken");

        // When
        JwtResponse response = authService.refreshToken(request);

        // Then
        assertNotNull(response);
        assertEquals("newAccessToken", response.getAccessToken());
        assertEquals("validRefreshToken", response.getRefreshToken());
    }
}
```

### Step 5: JWT Authentication Filter

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String token = extractToken(request);

            if (token != null && jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token);

                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication", e);
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

### Step 6: Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/**").permitAll()
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### Step 7: Authentication Controller

```java
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest loginRequest) {
        JwtResponse response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refreshToken(@RequestBody TokenRefreshRequest request) {
        JwtResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody TokenRefreshRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok("Logged out successfully");
    }
}
```

## 4. Integration Tests

```java
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AuthIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeAll
    void setup() {
        // Create test user
        User user = new User();
        user.setUsername("testuser");
        user.setPassword(passwordEncoder.encode("password"));
        user.setEmail("test@example.com");
        userRepository.save(user);
    }

    @Test
    void fullAuthenticationFlow_ShouldWork() {
        // Step 1: Login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        ResponseEntity<JwtResponse> loginResponse = restTemplate.postForEntity(
            "/auth/login", loginRequest, JwtResponse.class);

        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(loginResponse.getBody()).isNotNull();
        assertThat(loginResponse.getBody().getAccessToken()).isNotEmpty();
        assertThat(loginResponse.getBody().getRefreshToken()).isNotEmpty();

        String accessToken = loginResponse.getBody().getAccessToken();
        String refreshToken = loginResponse.getBody().getRefreshToken();

        // Step 2: Access protected endpoint
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> protectedResponse = restTemplate.exchange(
            "/api/protected", HttpMethod.GET, entity, String.class);

        assertThat(protectedResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Step 3: Refresh token
        TokenRefreshRequest refreshRequest = new TokenRefreshRequest();
        refreshRequest.setRefreshToken(refreshToken);

        ResponseEntity<JwtResponse> refreshResponse = restTemplate.postForEntity(
            "/auth/refresh", refreshRequest, JwtResponse.class);

        assertThat(refreshResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(refreshResponse.getBody().getAccessToken()).isNotEmpty();
        assertThat(refreshResponse.getBody().getAccessToken()).isNotEqualTo(accessToken);
    }

    @Test
    void accessProtectedEndpoint_WithoutToken_ShouldFail() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/protected", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }
}
```

## 5. Request Flow Diagram

```mermaid
graph TD
    A[Client Request] --> B[JWT Filter]
    B --> C{Has Valid JWT?}
    C -->|Yes| D[Set Authentication]
    C -->|No| E[Continue Filter Chain]
    D --> E
    E --> F[Controller]
    F --> G[Service]
    G --> H[Database]
    H --> G
    G --> F
    F --> I[Response to Client]
```

## 6. Complete Request Journey Example

**Scenario: User accesses protected resource**

1. **Initial Request:**

```
GET /api/protected
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **JWT Filter Processing:**

   - Extract token from Authorization header
   - Validate token signature and expiration
   - Set SecurityContext with username

3. **Controller Execution:**

```java
@RestController
public class ProtectedController {
    @GetMapping("/api/protected")
    public String protectedData() {
        // SecurityContext has authentication from filter
        return "Protected data for: " + SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
```

4. **Token Expiration Scenario:**

```
GET /api/protected
Authorization: Bearer expired.token.here

Response: 401 Unauthorized
```

5. **Token Refresh:**

```
POST /auth/refresh
{
    "refreshToken": "valid.refresh.token.here"
}

Response:
{
    "accessToken": "new.access.token",
    "refreshToken": "same.refresh.token",
    "type": "Bearer"
}
```

## Key Points to Remember:

1. **Access Token**: Short-lived (15-30 minutes), used for API access
2. **Refresh Token**: Long-lived (7 days), stored in database, used to get new access tokens
3. **Security**: Refresh tokens can be revoked, access tokens cannot
4. **Stateless**: Server doesn't store access tokens, only validates them
5. **Validation**: Always validate token signature and expiration

## JWT Authentication System

### Component Flow Diagram

![Date Time](/img/java/jwt/1.svg)

## Detailed Request Flow Diagrams

### 1. Login Request Flow

![Date Time](/img/java/jwt/2.svg)

### 2. Protected API Request Flow

![Date Time](/img/java/jwt/3.svg)

### 3. Token Refresh Flow

![Date Time](/img/java/jwt/4.svg)

## 4. Logout Flow

![Date Time](/img/java/jwt/5.svg)

### 5. Complete System Architecture

![Date Time](/img/java/jwt/6.svg)

### 6. Error Handling Flow

![Date Time](/img/java/jwt/7.svg)

## 7. Token Lifecycle Flow

![Date Time](/img/java/jwt/8.svg)

## Color Scheme Summary:

- **🌐 Client/Network**: Deep Blue (#1e3a5f)
- **🛡️ Security**: Dark Red (#2d3748)
- **🎮 Controllers**: Dark Purple (#553c9a)
- **🔄 Services**: Dark Brown (#744210)
- **🗄️ Database**: Dark Pink (#702459)
- **🔑 JWT**: Dark Teal (#234e52)
- **✅ Success**: Green accents
- **❌ Errors**: Red accents
- **⚠️ Warnings**: Orange accents
