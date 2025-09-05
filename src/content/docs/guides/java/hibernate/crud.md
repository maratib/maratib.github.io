---
title: CRUD Operations
slug: guides/java/hibernate/crud
description: CRUD Operations
sidebar:
  order: 5
---

- Hibernate simplifies CRUD (Create, Read, Update, Delete) operations through its Session API. 
- These operations manage the persistence lifecycle of entities, handling SQL generation, transaction management, and object state transitions automatically.

```mermaid
stateDiagram-v2
    [*] --> Transient
    Transient --> Persistent : session.save()
    Persistent --> Detached : session.close()
    Persistent --> Removed : session.delete()
    Detached --> Persistent : session.update()
    Removed --> [*]
    
    state Persistent {
        [*] --> Loaded
        Loaded --> Modified : setter methods
        Modified --> Flushed : session.flush()
        Flushed --> Loaded
    }
```

```java
// Create
Session session = sessionFactory.openSession();
Transaction tx = session.beginTransaction();
User user = new User("john_doe", "john@example.com");
session.save(user);
tx.commit();
session.close();

// Read
User user = session.get(User.class, 1L); // Immediate load
User user = session.load(User.class, 1L); // Proxy, lazy load

// Update
session.update(user); // For detached objects
// For persistent objects, changes are automatically detected

// Delete
session.delete(user);
```
