---
title: Layered Architecture 
description: Layered Architecture 
---

**Spring Boot Layered Architecture (N-Tier)**

This N-Tier architecture provides a clean separation that makes Spring Boot applications easier to develop, test, and maintain.

## 1. Presentation Layer

![Presentation Layer](/img/springboot/presentation-layer.svg)

**Explanation:**
- **Controllers**: Handle HTTP requests, map URLs to methods, and manage API endpoints
- **DTOs (Data Transfer Objects)**: Separate objects for request/response to decouple API from domain models
- **Exception Handlers**: Centralize exception handling and transform exceptions to proper HTTP responses
- **Validation**: Validate incoming requests using annotations like `@Valid`
- **Responsibilities**: Receive requests, validate input, invoke business logic, and return appropriate HTTP responses

## 2. Business/Service Layer

![Business Layer](/img/springboot/business-layer.svg)

**Explanation:**
- **Service Interfaces**: Define contracts for business operations
- **Service Implementations**: Contain the actual business logic and rules
- **Business Logic**: Core application functionality, workflows, and rules
- **Transaction Management**: Handle ACID properties using `@Transactional`
- **Domain Models**: Represent business entities and concepts
- **Responsibilities**: Implement business rules, coordinate transactions, and orchestrate data flow

## 3. Persistence Layer

![Persistence Layer](/img/springboot/persistence-layer.svg)

**Explanation:**
- **Repository Interfaces**: Define data access contracts
- **Repository Implementations**: Concrete data access implementations (often provided by Spring Data)
- **Entity Classes**: JPA entities that map to database tables
- **DAO Pattern**: Data Access Objects for custom database operations
- **ORM Mapping**: Object-Relational Mapping configuration
- **Query Builders**: Programmatic query construction
- **Responsibilities**: Handle all database operations, SQL generation, and object-relational mapping

## 4. Complete N-Tier Architecture

```mermaid
flowchart TD
    External[External Client] --> PresentationLayer
    
    subgraph PresentationLayer [Presentation Layer]
        Controller[Controllers]
        DTO[DTOs]
        ExceptionHandler[Exception Handlers]
        Validation[Validation]
    end
    
    PresentationLayer --> BusinessLayer
    
    subgraph BusinessLayer [Business Layer]
        ServiceInterface[Service Interfaces]
        ServiceImpl[Service Implementations]
        BusinessLogic[Business Logic]
        TransactionMgmt[Transaction Management]
    end
    
    BusinessLayer --> PersistenceLayer
    
    subgraph PersistenceLayer [Persistence Layer]
        Repository[Repositories]
        Entity[Entities]
        DAO[DAOs]
        ORM[ORM Mapping]
    end
    
    PersistenceLayer --> Database[(Database)]
    
    style PresentationLayer fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style BusinessLayer fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    style PersistenceLayer fill:#ffecb3,stroke:#ff6f00,stroke-width:2px
    style Database fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style External fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
```

**Complete Architecture Flow:**
1. **Request Flow**: External Client → Presentation Layer → Business Layer → Persistence Layer → Database
2. **Response Flow**: Database → Persistence Layer → Business Layer → Presentation Layer → External Client
3. **Dependency Direction**: Higher layers depend on lower layers, but not vice versa

## Key Benefits of This Architecture:

1. **Separation of Concerns**: Each layer has a distinct responsibility
2. **Testability**: Layers can be tested independently using mocks
3. **Maintainability**: Changes in one layer don't necessarily affect others
4. **Scalability**: Components can be scaled independently
5. **Flexibility**: Implementation details can change without affecting other layers

