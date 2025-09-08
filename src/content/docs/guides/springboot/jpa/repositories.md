---
title: Spring Data Repositories
slug: guides/springboot/jap/repositories
description: Spring Data Repositories
---

### 1. Repository Interface Hierarchy

This diagram shows the core repository hierarchy, starting from the base `Repository` marker interface up to the new, more specialized interfaces like `ListCrudRepository`.

```mermaid
flowchart TD
    A[Repository<br><sup>Marker Interface</sup>] --> B[CrudRepository<T, ID>];
    A --> C[PagingAndSortingRepository<T, ID>];

    B --> D[ListCrudRepository<T, ID><br><sup>New: Returns List</sup>];
    C --> E[ListPagingAndSortingRepository<T, ID><br><sup>New: Returns List</sup>];

    B --> F[JpaRepository<T, ID><br><sup>JPA-specific methods</sup>];
    F -.->|extends| C;
    F -.->|extends| B;

```

**Key Takeaway:** The new `ListCrudRepository` and `ListPagingAndSortingRepository` (introduced in recent Spring Data versions) are now the recommended starting points, returning `List` instead of `Iterable`.

---

### 2. Repository Query Methods

This diagram illustrates the various ways to define queries in a Spring Data repository interface.

```mermaid
flowchart TD
    A[Developer Defines<br>Repository Interface]

    subgraph B [Spring Data's Query Lookup Strategies]
        direction LR
        B1["<b>1. @Query Annotation</b><br>Explicit JPQL or SQL"]
        B2["<b>2. Method Name Derivation</b><br>Parse method name into query"]
        B3["<b>3. Named Query</b><br>Entity-linked query definition"]
    end

    A -- "Declares Methods" --> B

    B --> C{Spring Data JPA<br>Runtime Engine}
    C --> D[Creates & Executes<br>the JPA Query]
    D --> E[(Database)]

    
    
```

**Key Takeaway:** You don't write the implementation. Spring Data JPA parses the method name or annotation at runtime to create the query.

---

### 3. Additional Repository Modules (MongoDB, etc.)

This diagram shows how the Spring Data umbrella project provides a consistent programming model across different data stores through its module-specific repositories.

```mermaid
flowchart TD
    A[Spring Data Commons] --> B[Defines Core Interfaces<br>e.g., Repository, CrudRepository];

    B --> C[Spring Data JPA];
    B --> D[Spring Data MongoDB];
    B --> E[Spring Data Redis];
    B --> F[Spring Data Elasticsearch];

    subgraph G [Module-Specific Repositories]
        C --> C1[JpaRepository];
        D --> D1[MongoRepository];
        E --> E1[RedisRepository];
        F --> F1[ElasticsearchRepository];
    end

```

**Key Takeaway:** The common interfaces from Spring Data Commons allow you to switch between different persistence technologies (e.g., from JPA to MongoDB) with minimal changes to your service layer code.

---

### 4. The Complete Spring Data JPA Architecture

This diagram provides an overview of how all the components fit together, from your interface definition to the database.

```mermaid
flowchart TD
    A[Your Interface<br><code>interface UserRepository<br>extends JpaRepository<User, Long></code>] --> B[JpaRepository];

    subgraph C [Spring Data JPA]
        B --> D[SimpleJpaRepository<br><sup>Default Implementation</sup>];
        D --> E[Query Execution Engine];
        E --> F[EntityManager];
    end

    F --> G[JPA Provider<br>Hibernate / EclipseLink];
    G --> H[(Database)];

    C --o I[Persistence Layer];
    G --o I;
    H --o I;

    J[Your Entity Class<br><code>@Entity class User</code>] -.->|is managed by| F;
    J -.->|is mapped to| H;

    
```

### Breakdown of the Query Strategies:

**1. `@Query` Annotation (Explicit & Most Powerful)**
```java
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.email = ?1") // JPQL
    // @Query(value = "SELECT * FROM users WHERE email = ?1", nativeQuery = true) // SQL
    User findByEmailAddress(String email);
}
```

**2. Method Name Derivation (Declarative & Concise)**
```java
public interface UserRepository extends JpaRepository<User, Long> {
    // Parsed as: WHERE active = true AND lastName = :name
    List<User> findByActiveTrueAndLastName(String name);
    
    // Keywords: findBy, readBy, queryBy, getBy, existsBy, countBy, deleteBy/removeBy
    // Supports: And, Or, Between, LessThan, Like, IgnoreCase, OrderBy
}
```

**3. Named Query (Externalized Definition)**
```java
@Entity
@NamedQuery(name = "User.findByActiveStatus",
            query = "SELECT u FROM User u WHERE u.active = ?1")
public class User { ... }

// In the repository interface
public interface UserRepository extends JpaRepository<User, Long> {
    User findByActiveStatus(boolean active); // Automatically uses named query
}
```

The runtime engine evaluates these strategies in a specific order (typically `@Query` first, then Named Query, then Method Name parsing) to provide the implementation for your interface.

## Key Components Explained:

### **Core Repository Interfaces:**
- **CrudRepository**: Basic CRUD operations (save, findById, delete, etc.)
- **PagingAndSortingRepository**: Adds pagination and sorting capabilities
- **JpaRepository**: JPA-specific methods (flush, saveAndFlush, deleteInBatch)

### **Query Types:**
- **Derived Query Methods**: Auto-generated from method names
- **JPQL Queries**: Custom queries using `@Query` annotation
- **Native Queries**: SQL queries with `nativeQuery = true`
- **Projection Queries**: Interface-based data projections

### **Special Repositories:**
- **Reactive Repositories**: For reactive programming support
- **MongoDB Repositories**: MongoDB-specific repository support
- **Data REST Repositories**: REST exposure with `@RepositoryRestResource`

### **Configuration:**
- **@EnableJpaRepositories**: Manual repository configuration
- **Auto-configuration**: Spring Boot's automatic setup

This hierarchy represents the repository structure available in Spring Boot 3.4 and later versions, showing the inheritance chain and various repository types supported.