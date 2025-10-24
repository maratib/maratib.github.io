---
title: Jakarta Persistence Annotations
slug: guides/springboot/jap/jakarta-persistence-annotations
description: Jakarta Persistence Annotations
sidebar:
  order: 1
---

## Table of Jakarta Persistence Annotations

### Entity Definition Annotations

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@Entity` | Marks a class as a JPA entity | `@Entity public class User { ... }` |
| `@Table` | Specifies the database table name and schema | `@Table(name = "users", schema = "app_db")` |
| `@SecondaryTable` | Maps entity to multiple tables | `@SecondaryTable(name = "user_details")` |
| `@MappedSuperclass` | Defines common mapping for subclasses | `@MappedSuperclass public class BaseEntity { ... }` |
| `@EntityListeners` | Specifies callback listener classes | `@EntityListeners(AuditListener.class)` |

### Primary Key Annotations

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@Id` | Marks a field as primary key | `@Id private Long id;` |
| `@GeneratedValue` | Defines primary key generation strategy | `@GeneratedValue(strategy = GenerationType.IDENTITY)` |
| `@SequenceGenerator` | Configures sequence for ID generation | `@SequenceGenerator(name = "seq", sequenceName = "user_seq")` |
| `@TableGenerator` | Configures table for ID generation | `@TableGenerator(name = "id_gen", table = "id_generator")` |
| `@EmbeddedId` | Marks embedded composite primary key | `@EmbeddedId private UserId id;` |
| `@IdClass` | Specifies class for composite primary key | `@IdClass(UserId.class)` |

### Basic Field Mapping Annotations

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@Column` | Maps field to database column | `@Column(name = "user_name", nullable = false)` |
| `@Basic` | Configures basic field mapping | `@Basic(fetch = FetchType.LAZY, optional = false)` |
| `@Transient` | Excludes field from persistence | `@Transient private transientField;` |
| `@Temporal` | Maps Java date/time types to SQL types | `@Temporal(TemporalType.TIMESTAMP)` |
| `@Enumerated` | Maps Java enums to database | `@Enumerated(EnumType.STRING)` |
| `@Lob` | Maps large objects (CLOB/BLOB) | `@Lob private String largeText;` |
| `@Convert` | Specifies attribute converter | `@Convert(converter = BooleanConverter.class)` |

### Relationship Mapping Annotations

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@OneToOne` | Defines one-to-one relationship | `@OneToOne(cascade = CascadeType.ALL)` |
| `@OneToMany` | Defines one-to-many relationship | `@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)` |
| `@ManyToOne` | Defines many-to-one relationship | `@ManyToOne(fetch = FetchType.LAZY)` |
| `@ManyToMany` | Defines many-to-many relationship | `@ManyToMany @JoinTable(...)` |
| `@JoinColumn` | Specifies foreign key column | `@JoinColumn(name = "department_id")` |
| `@JoinTable` | Configures join table for relationships | `@JoinTable(name = "user_role")` |
| `@JoinColumns` | Multiple join columns for composite keys | `@JoinColumns({@JoinColumn(...), @JoinColumn(...)})` |
| `@MapsId` | Shares primary key with associated entity | `@MapsId private User user;` |
| `@PrimaryKeyJoinColumn` | Specifies primary key join column | `@PrimaryKeyJoinColumn(name = "user_id")` |
| `@ForeignKey` | Defines foreign key constraint | `@ForeignKey(name = "fk_user_dept")` |

### Inheritance Mapping Annotations

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@Inheritance` | Defines inheritance strategy | `@Inheritance(strategy = InheritanceType.JOINED)` |
| `@DiscriminatorColumn` | Configures discriminator column | `@DiscriminatorColumn(name = "type")` |
| `@DiscriminatorValue` | Specifies discriminator value | `@DiscriminatorValue("EMPLOYEE")` |

### Embedded and Component Annotations

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@Embeddable` | Marks class as embeddable component | `@Embeddable public class Address { ... }` |
| `@Embedded` | Embeds a component within an entity | `@Embedded private Address address;` |
| `@AttributeOverride` | Overrides embedded component attributes | `@AttributeOverride(name = "street", column = @Column(name = "home_street"))` |
| `@AttributeOverrides` | Multiple attribute overrides | `@AttributeOverrides({...})` |

### Collection and Element Annotations

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@ElementCollection` | Maps collection of basic/embeddable types | `@ElementCollection @CollectionTable(...)` |
| `@CollectionTable` | Configures table for element collection | `@CollectionTable(name = "user_phones")` |
| `@OrderColumn` | Maintains order in list collections | `@OrderColumn(name = "item_order")` |
| `@MapKeyColumn` | Defines key column for maps | `@MapKeyColumn(name = "phone_type")` |
| `@MapKey` | Uses entity property as map key | `@MapKey(name = "id")` |
| `@MapKeyEnumerated` | Uses enum as map key | `@MapKeyEnumerated(EnumType.STRING)` |
| `@MapKeyTemporal` | Uses date as map key | `@MapKeyTemporal(TemporalType.DATE)` |
| `@MapKeyJoinColumn` | Join column for map keys | `@MapKeyJoinColumn(name = "product_id")` |

### Query and Named Operation Annotations

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@NamedQuery` | Defines reusable JPQL query | `@NamedQuery(name = "User.findByEmail", query = "SELECT u FROM User u WHERE u.email = :email")` |
| `@NamedQueries` | Multiple named queries | `@NamedQueries({@NamedQuery(...), @NamedQuery(...)})` |
| `@NamedNativeQuery` | Defines reusable native SQL query | `@NamedNativeQuery(name = "User.findAll", query = "SELECT * FROM users")` |
| `@SqlResultSetMapping` | Maps native SQL query results | `@SqlResultSetMapping(name = "UserMapping", entities = @EntityResult(...))` |
| `@EntityResult` | Maps entity result in native query | `@EntityResult(entityClass = User.class)` |
| `@ColumnResult` | Maps column result in native query | `@ColumnResult(name = "user_count")` |
| `@ConstructorResult` | Maps constructor result in native query | `@ConstructorResult(targetClass = UserDTO.class, columns = {...})` |

### Callback and Listener Annotations

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@PrePersist` | Method called before entity persistence | `@PrePersist public void beforeSave() { ... }` |
| `@PostPersist` | Method called after entity persistence | `@PostPersist public void afterSave() { ... }` |
| `@PreUpdate` | Method called before entity update | `@PreUpdate public void beforeUpdate() { ... }` |
| `@PostUpdate` | Method called after entity update | `@PostUpdate public void afterUpdate() { ... }` |
| `@PreRemove` | Method called before entity removal | `@PreRemove public void beforeDelete() { ... }` |
| `@PostRemove` | Method called after entity removal | `@PostRemove public void afterDelete() { ... }` |
| `@PostLoad` | Method called after entity loading | `@PostLoad public void afterLoad() { ... }` |

### Locking and Versioning Annotations

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@Version` | Enables optimistic locking | `@Version private Long version;` |
| `@Lock` | Specifies lock mode for queries | `@Lock(LockModeType.PESSIMISTIC_WRITE)` |

### Cache Annotations

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@Cacheable` | Marks entity as cacheable | `@Cacheable` |

### Validation Annotations (Bean Validation)

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@NotNull` | Field cannot be null | `@NotNull private String name;` |
| `@Size` | Size constraint for strings/collections | `@Size(min = 2, max = 50) private String name;` |
| `@Min` / `@Max` | Minimum/maximum value constraints | `@Min(18) private int age;` |
| `@Email` | Validates email format | `@Email private String email;` |
| `@Pattern` | Regex pattern validation | `@Pattern(regexp = "[A-Za-z0-9]+") private String username;` |
| `@Past` / `@Future` | Date constraints | `@Past private Date birthDate;` |
| `@Positive` / `@Negative` | Number sign constraints | `@Positive private BigDecimal amount;` |
| `@Digits` | Digit constraints for numbers | `@Digits(integer=3, fraction=2) private BigDecimal price;` |

### Utility Annotations

| Annotation | Description | Usage Example |
|------------|-------------|---------------|
| `@PersistenceContext` | Injects EntityManager | `@PersistenceContext private EntityManager em;` |
| `@PersistenceUnit` | Injects EntityManagerFactory | `@PersistenceUnit private EntityManagerFactory emf;` |
| `@PersistentContexts` | Multiple persistence contexts | `@PersistentContexts({...})` |
| `@PersistentUnits` | Multiple persistence units | `@PersistentUnits({...})` |

## Key Jakarta Persistence Packages:

```java
import jakarta.persistence.*;                    // Core JPA annotations
import jakarta.persistence.criteria.*;           // Criteria API
import jakarta.persistence.metamodel.*;          // Metamodel
import jakarta.validation.constraints.*;         // Bean Validation constraints
```

## Common Strategy Enums:

| Enum Type | Values | Description |
|-----------|---------|-------------|
| `GenerationType` | `AUTO`, `IDENTITY`, `SEQUENCE`, `TABLE` | Primary key generation strategies |
| `InheritanceType` | `SINGLE_TABLE`, `JOINED`, `TABLE_PER_CLASS` | Inheritance mapping strategies |
| `TemporalType` | `DATE`, `TIME`, `TIMESTAMP` | Date/time mapping types |
| `EnumType` | `ORDINAL`, `STRING` | Enum mapping strategies |
| `FetchType` | `LAZY`, `EAGER` | Fetch strategies |
| `CascadeType` | `ALL`, `PERSIST`, `MERGE`, `REMOVE`, `REFRESH`, `DETACH` | Cascade operation types |
| `LockModeType` | `READ`, `WRITE`, `OPTIMISTIC`, `PESSIMISTIC_READ`, `PESSIMISTIC_WRITE` | Lock modes |

This table covers the core Jakarta Persistence (JPA) annotations that are part of the official specification. These annotations are standardized and work across different JPA implementations (Hibernate, EclipseLink, OpenJPA, etc.).