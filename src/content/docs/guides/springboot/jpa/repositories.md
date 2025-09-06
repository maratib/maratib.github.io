---
title: Spring Data Repositories
slug: guides/springboot/jap/repositories
description: Spring Data Repositories
---

![Repositories](/img/springboot/springboot_repositories.svg)

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