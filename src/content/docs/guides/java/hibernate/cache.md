---
title: Caching
slug: guides/java/hibernate/cache
description: Caching
sidebar:
  order: 8
---

## 9. Caching

**Description:**  
- Hibernate provides a sophisticated caching system to improve application performance. 
- It includes first-level cache (session cache), second-level cache (SessionFactory cache), and query cache. - Proper caching configuration can significantly reduce database round-trips and improve application responsiveness.

![Core Architecture](/img/java/hibernate/caching.svg)

### First Level Cache (Session Cache)
```java
Session session = sessionFactory.openSession();
User user1 = session.get(User.class, 1L); // Hits database
User user2 = session.get(User.class, 1L); // Returns from cache - no database hit
session.close();
```

### Second Level Cache (SessionFactory Cache)
```xml
<!-- Enable second level cache -->
<property name="hibernate.cache.use_second_level_cache">true</property>
<property name="hibernate.cache.region.factory_class">org.hibernate.cache.ehcache.EhCacheRegionFactory</property>
```

```java
@Entity
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product {
    // entity fields
}
```

### Query Cache
```xml
<property name="hibernate.cache.use_query_cache">true</property>
```

```java
Query query = session.createQuery("FROM Product WHERE category = :category");
query.setParameter("category", "electronics");
query.setCacheable(true);
List<Product> products = query.list();
```