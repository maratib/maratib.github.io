---
title: HQL and Criteria API
slug: guides/java/hibernate/hql
description: HQL and Criteria API
sidebar:
  order: 6
---


Hibernate provides multiple ways to query data: 
- HQL (Hibernate Query Language), 
- Criteria API, and 
- Native SQL. 
- HQL is an object-oriented query language similar to SQL but works with persistent objects instead of database tables. 

- Criteria API offers a type-safe, programmatic way to create queries.

![HQL](/img/java/hibernate/hql.svg)

### HQL (Hibernate Query Language)
```java
// Basic query
Query<User> query = session.createQuery("FROM User WHERE email = :email", User.class);
query.setParameter("email", "john@example.com");
List<User> users = query.getResultList();

// Join query
Query<Object[]> query = session.createQuery(
    "SELECT u.username, p.productName FROM User u JOIN u.products p WHERE u.id = :userId", 
    Object[].class
);

// Native SQL
SQLQuery query = session.createSQLQuery("SELECT * FROM users WHERE age > :age");
query.addEntity(User.class);
query.setParameter("age", 18);
```

### Criteria API (Type-safe queries)
```java
CriteriaBuilder builder = session.getCriteriaBuilder();
CriteriaQuery<User> criteria = builder.createQuery(User.class);
Root<User> root = criteria.from(User.class);

// Simple criteria
criteria.select(root).where(builder.equal(root.get("email"), "john@example.com"));

// Complex criteria with joins
Join<User, Product> products = root.join("products", JoinType.LEFT);
criteria.select(root)
       .where(builder.and(
           builder.equal(root.get("status"), "ACTIVE"),
           builder.greaterThan(products.get("price"), 100.0)
       ));

List<User> users = session.createQuery(criteria).getResultList();
```