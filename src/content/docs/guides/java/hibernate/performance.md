---
title: Performance Optimization
slug: guides/java/hibernate/performance
description: Performance Optimization
sidebar:
  order: 9
---


- Performance optimization in Hibernate involves strategies to minimize database interactions, reduce memory consumption, and improve query efficiency. 

- Key techniques include proper fetch strategies, batch processing, pagination, and connection pooling.

![Core Architecture](/img/java/hibernate/performance.svg)

### Fetch Strategies
```java
// Eager vs Lazy Loading
@OneToMany(fetch = FetchType.LAZY) // Default for collections
@ManyToOne(fetch = FetchType.EAGER) // Default for single-valued associations

// Batch Fetching
@Entity
@BatchSize(size = 10)
public class Department {
    @OneToMany(mappedBy = "department")
    private List<Employee> employees;
}

// Fetch Joins
String hql = "SELECT d FROM Department d JOIN FETCH d.employees WHERE d.id = :id";
```

### Pagination
```java
Query<User> query = session.createQuery("FROM User ORDER BY username", User.class);
query.setFirstResult(0); // start index
query.setMaxResults(10); // page size
List<User> users = query.getResultList();
```
