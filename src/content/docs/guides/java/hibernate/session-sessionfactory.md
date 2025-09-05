---
title: Session and SessionFactory
slug: guides/java/hibernate/session-sessionfactory
description: Session and SessionFactory
sidebar:
  order: 3
---

- The **SessionFactory** and **Session** are **fundamental components** in Hibernate's architecture. 

- **SessionFactory** is a thread-safe, immutable object that serves as a factory for Session instances and caches compiled mappings. 

- **Session** represents a single unit of work and maintains a persistence context with first-level caching.

![Session](/img/java/hibernate/session.svg)

### SessionFactory Internals
```java
public class HibernateUtil {
    private static final SessionFactory sessionFactory = buildSessionFactory();
    
    private static SessionFactory buildSessionFactory() {
        try {
            // Create SessionFactory from hibernate.cfg.xml
            return new Configuration().configure().buildSessionFactory();
        } catch (Throwable ex) {
            System.err.println("Initial SessionFactory creation failed." + ex);
            throw new ExceptionInInitializerError(ex);
        }
    }
    
    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }
    
    public static void shutdown() {
        getSessionFactory().close();
    }
}
```

### Session Lifecycle
```java
Session session = null;
Transaction transaction = null;

try {
    session = HibernateUtil.getSessionFactory().openSession();
    transaction = session.beginTransaction();
    
    // Perform database operations
    
    transaction.commit();
} catch (Exception e) {
    if (transaction != null) transaction.rollback();
    e.printStackTrace();
} finally {
    if (session != null) session.close();
}
```

### Session States
- **Transient**: Object created but not associated with session
- **Persistent**: Object associated with session and saved in database
- **Detached**: Object was persistent but session closed
- **Removed**: Object scheduled for deletion
