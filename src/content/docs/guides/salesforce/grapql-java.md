---
title: GraphQL in Spring Boot
description: GraphQL in Spring Boot
date: 2025-08-02
---
 
# GraphQL in Spring Boot

GraphQL is a query language for APIs that allows clients to request exactly the data they need, making it more efficient than traditional REST APIs (no over fetch, under fetch issue). 

Spring Boot provides excellent support for GraphQL through the `spring-graphql` module, which integrates seamlessly with Spring ecosystem components.

This guide covers everything you need to implement GraphQL in a Spring Boot application, from setup to production-ready features.

---

## 1. What is GraphQL?

GraphQL is a query language for APIs and a runtime for executing those queries against your existing data. It was developed internally by Facebook in 2012 before being publicly released in 2015. Unlike REST, where the server defines the structure of responses, GraphQL lets clients specify exactly what data they need.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Client-Specified Queries** | Clients request exactly the fields they need |
| **Single Endpoint** | All operations use a single `/graphql` endpoint |
| **Strongly Typed Schema** | API capabilities are defined in a schema language |
| **Hierarchical** | Queries mirror the shape of the response |
| **Introspective** | Clients can query the schema itself |

---

## 2. GraphQL vs. REST

Understanding the differences helps determine when GraphQL is the right choice.

| Aspect | REST | GraphQL |
|--------|------|---------|
| **Endpoints** | Multiple endpoints per resource | Single endpoint |
| **Data Fetching** | Over-fetching or under-fetching common | Client requests exact data |
| **Versioning** | Usually via URL (v1, v2) | No versioning needed—schema evolves |
| **Caching** | HTTP caching works naturally | Requires client-side or external caching |
| **File Uploads** | Native support | Requires additional configuration |
| **Learning Curve** | Lower | Higher (schema definition, resolvers) |
| **Best For** | Simple APIs, caching-critical apps | Complex data graphs, mobile apps |

---

## 3. Core GraphQL Concepts

Before implementing GraphQL in Spring Boot, understand these fundamental concepts.

### Schema Definition Language (SDL)

GraphQL APIs are defined using a type system called SDL.

```graphql
# Pseudo-code: Basic schema structure
type Query {
  findBookById(id: ID!): Book
  findAllBooks: [Book!]!
}

type Mutation {
  createBook(input: BookInput!): Book!
  updateBook(id: ID!, input: BookInput!): Book!
}

type Subscription {
  bookAdded: Book!
}

type Book {
  id: ID!
  title: String!
  author: Author!
  publishedYear: Int
}

input BookInput {
  title: String!
  authorId: ID!
  publishedYear: Int
}
```

### Scalar Types

GraphQL has built-in scalar types:

| Scalar | Description |
|--------|-------------|
| `Int` | Signed 32-bit integer |
| `Float` | Signed double-precision floating-point |
| `String` | UTF-8 character sequence |
| `Boolean` | True or false |
| `ID` | Unique identifier (serialized as String) |

### Operation Types

| Operation | Description |
|-----------|-------------|
| **Query** | Read-only data fetch (GET equivalent) |
| **Mutation** | Write operation (POST/PUT/DELETE) |
| **Subscription** | Real-time data stream (WebSocket) |

### Nullability

| Symbol | Meaning |
|--------|---------|
| `String` | Nullable (can be null) |
| `String!` | Non-null (cannot be null) |
| `[String]` | Nullable list of nullable strings |
| `[String!]!` | Non-null list of non-null strings |

---

## 4. Setting Up Spring Boot GraphQL

### Dependencies

```groovy
// build.gradle (pseudo-code)
dependencies {
    // Core Spring Boot GraphQL
    implementation 'org.springframework.boot:spring-boot-starter-graphql'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    
    // For WebSocket support (subscriptions)
    implementation 'org.springframework.boot:spring-boot-starter-websocket'
    
    // Validation
    implementation 'org.springframework.boot:spring-boot-starter-validation'
}
```

### Application Configuration

```yaml
# application.yml (pseudo-code)
spring:
  graphql:
    graphiql:
      enabled: true                    # Enable GraphiQL UI
      path: /graphiql                 # UI endpoint
    websocket:
      path: /graphql-ws               # Subscription WebSocket path
    schema:
      locations: classpath:graphql/   # Schema file location
      file-extensions: .graphqls      # Schema file extension
    tools:
      schema-location-pattern: "**/*.graphqls"
```

### Enable GraphQL in Spring Boot

```java
// Pseudo-code: Main application class
@SpringBootApplication
public class GraphQLApplication {
    public static void main(String[] args) {
        SpringApplication.run(GraphQLApplication.class, args);
    }
}
```

---

## 5. Defining the Schema

### Schema File Location

Place your schema file at `src/main/resources/graphql/schema.graphqls`.

### Complete Schema Example

```graphql
# Pseudo-code: schema.graphqls

# Query operations
type Query {
    # Product queries
    productById(id: ID!): Product
    products(filter: ProductFilter, pagination: PaginationInput): ProductConnection!
    
    # Category queries
    categories: [Category!]!
    categoryById(id: ID!): Category
    
    # Search
    searchProducts(term: String!): [Product!]!
}

# Mutation operations
type Mutation {
    # Product mutations
    createProduct(input: CreateProductInput!): ProductPayload!
    updateProduct(id: ID!, input: UpdateProductInput!): ProductPayload!
    deleteProduct(id: ID!): DeletePayload!
    
    # Category mutations
    createCategory(input: CreateCategoryInput!): Category!
}

# Subscription operations
type Subscription {
    productCreated: Product!
    productUpdated(id: ID!): Product!
    stockAlert(categoryId: ID): Product!
}

# Core types
type Product {
    id: ID!
    name: String!
    description: String
    price: Money!
    category: Category!
    stock: Int!
    tags: [String!]!
    createdAt: String!
    updatedAt: String!
}

type Category {
    id: ID!
    name: String!
    description: String
    parent: Category
    products: [Product!]!
}

type Money {
    amount: Float!
    currency: Currency!
}

enum Currency {
    USD
    EUR
    GBP
    JPY
}

# Input types
input CreateProductInput {
    name: String!
    description: String
    price: MoneyInput!
    categoryId: ID!
    tags: [String!]
}

input MoneyInput {
    amount: Float!
    currency: Currency!
}

input ProductFilter {
    categoryId: ID
    minPrice: Float
    maxPrice: Float
    inStock: Boolean
    tags: [String!]
}

input PaginationInput {
    offset: Int = 0
    limit: Int = 20
}

# Connection type for pagination
type ProductConnection {
    edges: [ProductEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
}

type ProductEdge {
    node: Product!
    cursor: String!
}

type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
}

# Payload types
type ProductPayload {
    code: String!
    success: Boolean!
    message: String
    product: Product
}

type DeletePayload {
    success: Boolean!
    message: String
}
```

---

## 6. Implementing Controllers (DataFetchers)

In Spring GraphQL, controllers are called **DataFetchers** or **Query resolvers**.

### Controller Annotation Approach

```java
// Pseudo-code: GraphQL Controller
@Controller
public class ProductGraphQLController {
    
    private final ProductService productService;
    
    public ProductGraphQLController(ProductService productService) {
        this.productService = productService;
    }
    
    // Query resolver
    @QueryMapping
    public Product productById(@Argument String id) {
        return productService.findById(id);
    }
    
    // Query resolver with complex argument
    @QueryMapping
    public List<Product> products(
        @Argument ProductFilter filter,
        @Argument PaginationInput pagination
    ) {
        return productService.findAll(filter, pagination);
    }
    
    // Mutation resolver
    @MutationMapping
    public ProductPayload createProduct(@Argument CreateProductInput input) {
        Product created = productService.create(input);
        return ProductPayload.success(created);
    }
    
    // Field resolver for nested object
    @SchemaMapping(typeName = "Product", field = "category")
    public Category getCategory(Product product) {
        return categoryService.findById(product.getCategoryId());
    }
}
```

### Alternative: Implementing DataFetcher Interface

```java
// Pseudo-code: DataFetcher interface approach
@Component
public class ProductDataFetcher implements DataFetcher<List<Product>> {
    
    private final ProductService productService;
    
    @Override
    public List<Product> get(DataFetchingEnvironment env) {
        String categoryId = env.getArgument("categoryId");
        Boolean inStock = env.getArgument("inStock");
        return productService.findByCriteria(categoryId, inStock);
    }
}
```

### Registering RuntimeWiring

```java
// Pseudo-code: RuntimeWiring configuration
@Configuration
public class GraphQLConfig {
    
    @Bean
    public RuntimeWiringConfigurer runtimeWiringConfigurer(
        ProductDataFetcher productFetcher
    ) {
        return wiringBuilder -> wiringBuilder
            .type("Query", typeWiring -> typeWiring
                .dataFetcher("products", productFetcher)
            )
            .build();
    }
}
```

---

## 7. Working with Queries

### Simple Query Execution

```java
// Pseudo-code: Query service
@Service
public class GraphQLQueryService {
    
    private final GraphQlService graphQlService;
    
    public GraphQLQueryService(GraphQlService graphQlService) {
        this.graphQlService = graphQlService;
    }
    
    public Product executeQuery(String productId) {
        String query = """
            query GetProduct($id: ID!) {
                productById(id: $id) {
                    id
                    name
                    price {
                        amount
                        currency
                    }
                    category {
                        name
                    }
                }
            }
        """;
        
        Map<String, Object> variables = Map.of("id", productId);
        
        ExecutionResult result = graphQlService.execute(query, variables);
        
        if (result.getErrors().isEmpty()) {
            return result.getDataAs(Product.class);
        }
        throw new GraphQLException("Query failed: " + result.getErrors());
    }
}
```

### Batch Query Execution

```java
// Pseudo-code: Batch query with DataLoader
@Component
public class ProductBatchLoader implements BatchLoader<String, Product> {
    
    private final ProductRepository repository;
    
    @Override
    public CompletionStage<List<Product>> load(List<String> ids) {
        return CompletableFuture.supplyAsync(() -> 
            repository.findAllById(ids)
        );
    }
}

// Register in DataFetcher
@Controller
public class ProductController {
    
    @SchemaMapping
    public CompletableFuture<Category> category(
        Product product,
        DataLoader<String, Category> categoryLoader
    ) {
        return categoryLoader.load(product.getCategoryId());
    }
}
```

---

## 8. Working with Mutations

### Basic Mutation

```java
// Pseudo-code: Mutation implementation
@Controller
public class ProductMutationController {
    
    private final ProductService productService;
    private final ValidationService validationService;
    
    @MutationMapping
    public ProductPayload createProduct(@Argument CreateProductInput input) {
        // Validate input
        validationService.validate(input);
        
        // Execute business logic
        Product product = productService.create(input);
        
        // Return payload with result
        return ProductPayload.builder()
            .success(true)
            .code("PRODUCT_CREATED")
            .product(product)
            .build();
    }
}
```

### Mutation with Partial Updates

```java
// Pseudo-code: Update mutation
@MutationMapping
public ProductPayload updateProduct(
    @Argument String id,
    @Argument UpdateProductInput input
) {
    // Check if product exists
    Product existing = productService.findById(id);
    if (existing == null) {
        return ProductPayload.builder()
            .success(false)
            .code("PRODUCT_NOT_FOUND")
            .message("Product with id " + id + " not found")
            .build();
    }
    
    // Apply partial updates
    Product updated = productService.update(id, input);
    
    return ProductPayload.success(updated);
}
```

### Batch Mutation

```java
// Pseudo-code: Batch mutation
@MutationMapping
public List<ProductPayload> bulkCreateProducts(
    @Argument List<CreateProductInput> inputs
) {
    return inputs.stream()
        .map(input -> {
            try {
                Product product = productService.create(input);
                return ProductPayload.success(product);
            } catch (Exception e) {
                return ProductPayload.failure(e.getMessage());
            }
        })
        .collect(Collectors.toList());
}
```

---

## 9. Working with Subscriptions

Subscriptions require WebSocket configuration for real-time data streaming.

### WebSocket Configuration

```java
// Pseudo-code: WebSocket configuration for subscriptions
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/graphql-ws")
            .setAllowedOrigins("*");
    }
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app")
            .enableSimpleBroker("/topic");
    }
}
```

### Subscription Implementation

```java
// Pseudo-code: Subscription resolver
@Controller
public class ProductSubscriptionController {
    
    private final ProductEventPublisher eventPublisher;
    
    @SubscriptionMapping
    public Flux<Product> productCreated() {
        return eventPublisher.getProductCreatedStream();
    }
    
    @SubscriptionMapping
    public Flux<Product> productUpdated(@Argument String id) {
        return eventPublisher.getProductUpdatedStream(id);
    }
    
    @SubscriptionMapping
    public Flux<Product> stockAlert(@Argument String categoryId) {
        return eventPublisher.getStockAlertStream(categoryId);
    }
}
```

### Event Publisher Implementation

```java
// Pseudo-code: Event publisher using Project Reactor
@Service
public class ProductEventPublisher {
    
    private final Sinks.Many<Product> productCreatedSink = Sinks.many().multicast().onBackpressureBuffer();
    private final Map<String, Sinks.Many<Product>> productUpdateSinks = new ConcurrentHashMap<>();
    
    public Flux<Product> getProductCreatedStream() {
        return productCreatedSink.asFlux();
    }
    
    public Flux<Product> getProductUpdatedStream(String productId) {
        return productUpdateSinks.computeIfAbsent(productId, 
            id -> Sinks.many().multicast().onBackpressureBuffer()
        ).asFlux();
    }
    
    public void emitProductCreated(Product product) {
        productCreatedSink.tryEmitNext(product);
    }
    
    public void emitProductUpdated(Product product) {
        Sinks.Many<Product> sink = productUpdateSinks.get(product.getId());
        if (sink != null) {
            sink.tryEmitNext(product);
        }
    }
}
```

---

## 10. Error Handling

### Custom Exception Resolver

```java
// Pseudo-code: GraphQL exception resolver
@Component
public class CustomDataFetcherExceptionResolver implements DataFetcherExceptionResolver {
    
    @Override
    public CompletableFuture<List<GraphQLError>> resolveException(
        Throwable exception, DataFetchingEnvironment environment
    ) {
        if (exception instanceof ProductNotFoundException) {
            GraphQLError error = GraphqlErrorBuilder.newError(environment)
                .message("Product not found: " + exception.getMessage())
                .errorType(ErrorType.NOT_FOUND)
                .extension("code", "PRODUCT_NOT_FOUND")
                .build();
            return CompletableFuture.completedFuture(List.of(error));
        }
        
        if (exception instanceof ValidationException) {
            GraphQLError error = GraphqlErrorBuilder.newError(environment)
                .message("Validation failed")
                .errorType(ErrorType.VALIDATION_ERROR)
                .extension("validationErrors", getValidationErrors(exception))
                .build();
            return CompletableFuture.completedFuture(List.of(error));
        }
        
        // Re-throw other exceptions for default handling
        return CompletableFuture.completedFuture(Collections.emptyList());
    }
}
```

### Global Error Handling

```java
// Pseudo-code: Global error handler
@ControllerAdvice
public class GraphQLExceptionHandler {
    
    @ExceptionHandler(ProductNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleNotFound(ProductNotFoundException ex) {
        return Map.of(
            "error", "NOT_FOUND",
            "message", ex.getMessage(),
            "timestamp", Instant.now().toString()
        );
    }
}
```

### Error Response Structure

```json
// Pseudo-code: Error response example
{
  "errors": [
    {
      "message": "Product not found: PROD-12345",
      "locations": [{"line": 3, "column": 9}],
      "path": ["productById"],
      "extensions": {
        "code": "PRODUCT_NOT_FOUND",
        "errorType": "NOT_FOUND"
      }
    }
  ],
  "data": null
}
```

---

## 11. Input Validation

### Bean Validation with @Validated

```java
// Pseudo-code: Input validation using annotations
@Controller
@Validated
public class ProductMutationController {
    
    @MutationMapping
    public ProductPayload createProduct(
        @Argument @Valid CreateProductInput input
    ) {
        // Validation happens automatically
        return productService.create(input);
    }
}

// Input class with validation constraints
public class CreateProductInput {
    
    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than zero")
    private MoneyInput price;
    
    @NotBlank(message = "Category ID is required")
    @Pattern(regexp = "^CAT-[0-9]+$", message = "Invalid category ID format")
    private String categoryId;
}
```

### Custom Validator

```java
// Pseudo-code: Custom validation logic
@Component
public class ProductInputValidator implements Validator {
    
    private final CategoryService categoryService;
    
    @Override
    public boolean supports(Class<?> clazz) {
        return CreateProductInput.class.equals(clazz);
    }
    
    @Override
    public void validate(Object target, Errors errors) {
        CreateProductInput input = (CreateProductInput) target;
        
        // Validate category exists
        if (!categoryService.existsById(input.getCategoryId())) {
            errors.rejectValue("categoryId", 
                "category.not.found", 
                "Category does not exist");
        }
        
        // Validate unique product name within category
        if (productService.existsByNameAndCategory(
            input.getName(), input.getCategoryId()
        )) {
            errors.rejectValue("name", 
                "name.duplicate", 
                "Product name already exists in this category");
        }
    }
}
```

---

## 12. Security and Authorization

### Method-Level Security

```java
// Pseudo-code: Security with @PreAuthorize
@Controller
public class ProductMutationController {
    
    @MutationMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('product:write')")
    public ProductPayload createProduct(@Argument CreateProductInput input) {
        return productService.create(input);
    }
    
    @QueryMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Product productById(@Argument String id) {
        return productService.findById(id);
    }
}
```

### Field-Level Security

```java
// Pseudo-code: Field-level authorization
@Controller
public class ProductController {
    
    @SchemaMapping
    public Money price(Product product, DataFetchingEnvironment env) {
        boolean isAdmin = SecurityContextHolder.getContext()
            .getAuthentication()
            .getAuthorities()
            .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        
        if (!isAdmin && product.getPrice() != null) {
            // Mask price for non-admin users
            return Money.builder()
                .amount(0.0)
                .currency(product.getPrice().getCurrency())
                .build();
        }
        return product.getPrice();
    }
}
```

### Security Configuration

```java
// Pseudo-code: Spring Security configuration
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/graphiql", "/graphql-ws").permitAll()
                .requestMatchers("/graphql").authenticated()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter()))
            )
            .build();
    }
}
```

---

## 13. Pagination and Filtering

### Cursor-Based Pagination

```java
// Pseudo-code: Connection resolver
@Controller
public class ProductConnectionController {
    
    @QueryMapping
    public ProductConnection products(
        @Argument ProductFilter filter,
        @Argument PaginationInput pagination
    ) {
        List<Product> products = productService.findAll(filter, pagination);
        boolean hasNextPage = productService.hasNext(pagination);
        
        List<ProductEdge> edges = products.stream()
            .map(product -> ProductEdge.builder()
                .node(product)
                .cursor(encodeCursor(product.getId()))
                .build())
            .collect(Collectors.toList());
        
        return ProductConnection.builder()
            .edges(edges)
            .pageInfo(PageInfo.builder()
                .hasNextPage(hasNextPage)
                .hasPreviousPage(pagination.getOffset() > 0)
                .startCursor(edges.isEmpty() ? null : edges.get(0).getCursor())
                .endCursor(edges.isEmpty() ? null : edges.get(edges.size() - 1).getCursor())
                .build())
            .totalCount(productService.count(filter))
            .build();
    }
}
```

### Filter Implementation

```java
// Pseudo-code: Dynamic filter building
@Service
public class ProductFilterService {
    
    public Predicate<Product> buildPredicate(ProductFilter filter) {
        List<Predicate<Product>> predicates = new ArrayList<>();
        
        if (filter.getCategoryId() != null) {
            predicates.add(p -> p.getCategoryId().equals(filter.getCategoryId()));
        }
        
        if (filter.getMinPrice() != null) {
            predicates.add(p -> p.getPrice().getAmount() >= filter.getMinPrice());
        }
        
        if (filter.getMaxPrice() != null) {
            predicates.add(p -> p.getPrice().getAmount() <= filter.getMaxPrice());
        }
        
        if (filter.getInStock() != null && filter.getInStock()) {
            predicates.add(p -> p.getStock() > 0);
        }
        
        if (filter.getTags() != null && !filter.getTags().isEmpty()) {
            predicates.add(p -> p.getTags().containsAll(filter.getTags()));
        }
        
        return predicates.stream().reduce(Predicate::and).orElse(p -> true);
    }
}
```

---

## 14. Testing GraphQL APIs

### Unit Testing DataFetchers

```java
// Pseudo-code: Unit test for query resolver
@ExtendWith(MockitoExtension.class)
class ProductQueryResolverTest {
    
    @Mock
    private ProductService productService;
    
    @InjectMocks
    private ProductGraphQLController controller;
    
    @Test
    void productById_ReturnsProduct_WhenExists() {
        // Arrange
        String productId = "PROD-123";
        Product expectedProduct = Product.builder()
            .id(productId)
            .name("Test Product")
            .build();
        
        when(productService.findById(productId)).thenReturn(expectedProduct);
        
        // Act
        Product result = controller.productById(productId);
        
        // Assert
        assertThat(result.getId()).isEqualTo(productId);
        assertThat(result.getName()).isEqualTo("Test Product");
        verify(productService).findById(productId);
    }
}
```

### Integration Testing with GraphQLTester

```java
// Pseudo-code: Integration test
@SpringBootTest
@AutoConfigureGraphQlTester
class GraphQLIntegrationTest {
    
    @Autowired
    private GraphQlTester graphQlTester;
    
    @Test
    void queryProduct_ReturnsExpectedData() {
        String query = """
            query GetProduct($id: ID!) {
                productById(id: $id) {
                    id
                    name
                    price {
                        amount
                        currency
                    }
                }
            }
        """;
        
        graphQlTester.document(query)
            .variable("id", "PROD-123")
            .execute()
            .path("productById.id")
            .entity(String.class)
            .isEqualTo("PROD-123")
            .path("productById.name")
            .entity(String.class)
            .isEqualTo("Test Product")
            .path("productById.price.amount")
            .entity(Float.class)
            .isGreaterThan(0);
    }
    
    @Test
    void mutationCreateProduct_ReturnsProduct() {
        String mutation = """
            mutation Create($input: CreateProductInput!) {
                createProduct(input: $input) {
                    success
                    code
                    product {
                        id
                        name
                    }
                }
            }
        """;
        
        Map<String, Object> input = Map.of(
            "name", "New Product",
            "price", Map.of("amount", 99.99, "currency", "USD"),
            "categoryId", "CAT-001"
        );
        
        graphQlTester.document(mutation)
            .variable("input", input)
            .execute()
            .path("createProduct.success")
            .entity(Boolean.class)
            .isTrue()
            .path("createProduct.product.name")
            .entity(String.class)
            .isEqualTo("New Product");
    }
}
```

### Testing Subscriptions

```java
// Pseudo-code: Subscription test
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SubscriptionTest {
    
    @LocalServerPort
    private int port;
    
    @Test
    void productCreated_EmitsEvents() {
        String subscriptionQuery = """
            subscription {
                productCreated {
                    id
                    name
                }
            }
        """;
        
        // Create WebSocket connection
        GraphQlTester graphQlTester = GraphQlTester.builder()
            .webSocketClient(WebSocketClient.create("ws://localhost:" + port + "/graphql-ws"))
            .build();
        
        // Subscribe and verify events
        graphQlTester.document(subscriptionQuery)
            .executeSubscription()
            .toFlux("productCreated")
            .next()
            .path("name")
            .entity(String.class)
            .satisfies(name -> assertThat(name).isNotBlank());
    }
}
```

---

## 15. Performance Optimization

### DataLoader for N+1 Problem

```java
// Pseudo-code: DataLoader configuration
@Configuration
public class DataLoaderConfig {
    
    @Bean
    public DataLoader<String, Category> categoryDataLoader(
        CategoryRepository repository
    ) {
        BatchLoader<String, Category> batchLoader = ids -> 
            CompletableFuture.supplyAsync(() -> 
                repository.findAllById(ids).stream()
                    .collect(Collectors.toMap(Category::getId, Function.identity()))
            );
        
        return DataLoader.newDataLoader(batchLoader);
    }
}

// Usage in resolver
@Controller
public class ProductController {
    
    @SchemaMapping
    public CompletableFuture<Category> category(
        Product product,
        @ContextValue DataLoader<String, Category> categoryLoader
    ) {
        return categoryLoader.load(product.getCategoryId());
    }
}
```

### Query Complexity Analysis

```java
// Pseudo-code: Complexity analysis
@Component
public class ComplexityAnalyzer implements Instrumentation {
    
    @Override
    public CompletableFuture<ExecutionResult> instrumentExecution(
        ExecutionInput executionInput, 
        InstrumentationState state
    ) {
        int complexity = calculateComplexity(executionInput.getQuery());
        int maxComplexity = 1000;
        
        if (complexity > maxComplexity) {
            throw new GraphQLException("Query too complex: " + complexity);
        }
        
        return CompletableFuture.completedFuture(null);
    }
    
    private int calculateComplexity(String query) {
        // Count fields, depth, and multiplicities
        return fieldCount + (depth * 10) + (listMultiplicity * 5);
    }
}
```

### Caching with @Caching

```java
// Pseudo-code: Caching query results
@Service
@CacheConfig(cacheNames = "products")
public class CachedProductService {
    
    @Cacheable(key = "#id")
    public Product findById(String id) {
        return productRepository.findById(id).orElse(null);
    }
    
    @CachePut(key = "#result.id")
    public Product update(Product product) {
        return productRepository.save(product);
    }
    
    @CacheEvict(key = "#id")
    public void delete(String id) {
        productRepository.deleteById(id);
    }
    
    @Caching(evict = {
        @CacheEvict(cacheNames = "products", allEntries = true),
        @CacheEvict(cacheNames = "productLists", allEntries = true)
    })
    public void clearAllCaches() {
        // Clear all product caches
    }
}
```

---

## 16. GraphQL Spring Boot Glossary

### A

**Argument**
A value passed to a field or directive in a GraphQL query. In Spring GraphQL, `@Argument` annotation binds these to method parameters .

**Abstract Syntax Tree (AST)**
A tree representation of the GraphQL query structure. Used internally for validation and execution planning.

---

### D

**DataFetcher**
The component responsible for retrieving data for a specific field in a GraphQL query. Spring GraphQL uses `@SchemaMapping` and `@QueryMapping` annotations to define DataFetchers .

**DataLoader**
A utility that batches and caches data loading requests to solve the N+1 query problem. Especially useful for resolving relationships in GraphQL schemas .

**Directive**
An annotation-like construct that can modify query execution behavior. Spring GraphQL supports built-in directives like `@include`, `@skip`, and `@deprecated`.

---

### F

**Field Resolver**
A specialized DataFetcher that resolves a specific field on a type. Implemented using `@SchemaMapping` annotation.

---

### G

**GraphiQL**
An in-browser IDE for testing GraphQL queries. Spring Boot automatically enables it when `spring.graphql.graphiql.enabled=true`.

**GraphQL Schema**
The complete type definition of a GraphQL API, written in Schema Definition Language (SDL). Defines all possible queries, mutations, subscriptions, and data types .

**GraphQL Service**
The core Spring component that executes GraphQL queries against a schema. Accessed via `GraphQlService` interface.

---

### I

**Instrumentation**
A mechanism for intercepting GraphQL query execution phases. Used for logging, metrics collection, and complexity analysis .

**Introspection**
The ability for clients to query the GraphQL schema itself. Allows tools to auto-complete and validate queries against the schema.

---

### M

**Mutation**
One of three GraphQL operation types (Query, Mutation, Subscription). Used for data modification operations (create, update, delete) .

---

### N

**N+1 Problem**
A performance anti-pattern where one initial query results in N additional queries. Solved in GraphQL using DataLoader .

**Nullability**
In GraphQL, types can be marked as nullable (default) or non-null using `!` suffix. Spring GraphQL respects these constraints when returning data.

---

### P

**Payload**
A GraphQL object type that wraps mutation results, often containing status codes, messages, and the mutated object itself .

---

### Q

**Query**
The most common GraphQL operation type. Used for read-only data retrieval. Corresponds to `@QueryMapping` annotation in Spring .

---

### R

**Resolver**
See DataFetcher.

**RuntimeWiring**
The configuration mechanism that maps GraphQL schema types to DataFetcher implementations in Spring GraphQL.

---

### S

**Scalar**
A primitive data type in GraphQL (Int, Float, String, Boolean, ID). Spring GraphQL supports custom scalars via `RuntimeWiring`.

**Schema Definition Language (SDL)**
The syntax used to define GraphQL schemas. Files typically have `.graphqls` extension .

**Subscription**
GraphQL operation type for real-time event streaming over WebSocket. Implemented using `@SubscriptionMapping` annotation .

---

### V

**Variables**
Query parameters that can be passed separately from the query string. Used for dynamic query execution and query reuse .

---

## Summary

GraphQL in Spring Boot provides a powerful, type-safe way to build flexible APIs that give clients exactly the data they request. By leveraging Spring's GraphQL module, you can build production-ready GraphQL APIs with minimal boilerplate.

**Key Takeaways:**

- **Single endpoint** - All operations use `/graphql`, simplifying API management
- **Client-specified responses** - Reduces over-fetching and under-fetching
- **Strong typing** - Schema defines all possible operations and data shapes
- **Built-in Spring integration** - Works seamlessly with Spring Security, Validation, and Data
- **Subscription support** - Real-time data streaming via WebSocket
- **Performance patterns** - DataLoader solves N+1 queries; batching improves throughput

**Getting Started Recommendations:**
1. Start with a simple schema defining Query operations
2. Use `@QueryMapping` and `@MutationMapping` annotations
3. Implement DataLoader for relationship resolution
4. Add GraphiQL for interactive API exploration
5. Write integration tests using GraphQlTester
6. Monitor query complexity to prevent performance issues