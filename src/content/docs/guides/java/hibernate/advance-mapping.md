---
title: Advanced Mapping
slug: guides/java/hibernate/advanced_mapping
description: Advanced Mapping
sidebar:
  order: 7
---


- Advanced mapping techniques in Hibernate handle complex object relationships, inheritance hierarchies, and specialized data types. 

- These include various relationship types (one-to-many, many-to-many), inheritance strategies, and custom type implementations.

![Core Architecture](/img/java/hibernate/advance-mappings.svg)

### Relationships
```java
// One-to-Many
@Entity
public class Department {
    @Id
    @GeneratedValue
    private Long id;
    
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Employee> employees = new ArrayList<>();
}

@Entity
public class Employee {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dept_id")
    private Department department;
}

// Many-to-Many
@Entity
public class Student {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> courses = new HashSet<>();
}

@Entity
public class Course {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

### Inheritance Strategies
```java
// Single Table (Default)
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "vehicle_type")
public abstract class Vehicle {
    @Id
    @GeneratedValue
    private Long id;
    private String manufacturer;
}

@Entity
@DiscriminatorValue("CAR")
public class Car extends Vehicle {
    private int numberOfDoors;
}

@Entity
@DiscriminatorValue("BIKE")
public class Bike extends Vehicle {
    private boolean hasCarrier;
}

// Joined Table
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Payment {
    @Id
    @GeneratedValue
    private Long id;
    private Double amount;
}

@Entity
public class CreditCardPayment extends Payment {
    private String cardNumber;
    private String expirationDate;
}

// Table Per Class
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Shape {
    @Id
    @GeneratedValue
    private Long id;
    private String color;
}
```
