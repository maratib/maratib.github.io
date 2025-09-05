---
title: Entity Mapping Annotations
slug: guides/java/hibernate/mapping_annotations
description: Entity Mapping Annotations
sidebar:
  order: 4
---

- Hibernate uses **annotations** to define how `Java objects are mapped to database` tables. 
- These annotations provide metadata about the object-relational mapping, including table names, column mappings, relationships, and constraints. 

```mermaid
classDiagram
    class User {
        -Long id
        -String username
        -String email
        -Date createdAt
        -UserStatus status
        +getId() Long
        +setId(Long id)
        +getUsername() String
        +setUsername(String username)
    }
    
    class UserStatus {
        <<enumeration>>
        ACTIVE
        INACTIVE
        PENDING
    }
    
    User --> UserStatus : status
    User : @Entity
    User : @Table(name="users")
    User : @Id id
    User : @GeneratedValue(strategy=IDENTITY)
    User : @Column(name="username", nullable=false)
    User : @Column(name="email", unique=true)
    User : @Temporal(TemporalType.TIMESTAMP) createdAt
    User : @Enumerated(EnumType.STRING) status
```

### Basic Entity
```java
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;
    
    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserStatus status;
    
    // Constructors, getters, setters
}
```

### Common Annotations

**Class Level:**
- `@Entity`: Marks class as entity
- `@Table`: Specifies table details
- `@SecondaryTable`: Maps entity to multiple tables

**Field Level:**
- `@Id`: Primary key
- `@GeneratedValue`: Auto-generation strategy
- `@Column`: Column mapping
- `@Transient`: Field not persisted
- `@Temporal`: Date/time mapping
- `@Enumerated`: Enum mapping
- `@Lob`: Large object mapping
