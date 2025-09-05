---
title: Advanced Topics
slug: guides/java/hibernate/advance-topics
description: Advanced Topics
sidebar:
  order: 11
---

### Interceptors and Listeners
```java
public class AuditInterceptor extends EmptyInterceptor {
    @Override
    public boolean onSave(Object entity, Serializable id, 
                         Object[] state, String[] propertyNames, 
                         Type[] types) {
        if (entity instanceof Auditable) {
            for (int i = 0; i < propertyNames.length; i++) {
                if ("createdDate".equals(propertyNames[i])) {
                    state[i] = new Date();
                    return true;
                }
            }
        }
        return false;
    }
}

// Usage
Session session = sessionFactory.withOptions()
    .interceptor(new AuditInterceptor())
    .openSession();
```

### Custom Types
```java
public class PhoneNumberType implements UserType {
    // Implement type conversion methods
}

@Entity
public class Contact {
    @Type(type = "com.example.PhoneNumberType")
    private PhoneNumber phoneNumber;
}
```

### Stored Procedures
```java
Query query = session.createStoredProcedureQuery("get_user_by_email")
    .registerStoredProcedureParameter("email_param", String.class, ParameterMode.IN)
    .setParameter("email_param", "john@example.com");

List<Object[]> results = query.getResultList();
```
