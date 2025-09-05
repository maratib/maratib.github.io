---
title: Setup and Configuration
slug: guides/java/hibernate/setup
description: Setup and Configuration
sidebar:
  order: 1
---

- Configure the framework to connect to database

- Provide entity mappings
- This can be done through XML configuration, properties files or programmatically.
- Configuration include Connection details, connection pooling settings, dialect and mapping file/class declarations



![Setup and Configuration](/img/java/hibernate/setup.svg)

### Maven Dependency
```xml
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-core</artifactId>
    <version>5.6.0.Final</version>
</dependency>
```

### hibernate.cfg.xml (XML Configuration)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-configuration PUBLIC
        "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
        "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
    <session-factory>
        <!-- Database connection settings -->
        <property name="hibernate.connection.driver_class">com.mysql.cj.jdbc.Driver</property>
        <property name="hibernate.connection.url">jdbc:mysql://localhost:3306/mydb</property>
        <property name="hibernate.connection.username">root</property>
        <property name="hibernate.connection.password">password</property>
        
        <!-- JDBC connection pool settings -->
        <property name="hibernate.c3p0.min_size">5</property>
        <property name="hibernate.c3p0.max_size">20</property>
        
        <!-- SQL dialect -->
        <property name="hibernate.dialect">org.hibernate.dialect.MySQL8Dialect</property>
        
        <!-- Echo all executed SQL to stdout -->
        <property name="hibernate.show_sql">true</property>
        
        <!-- Drop and re-create the database schema on startup -->
        <property name="hibernate.hbm2ddl.auto">update</property>
        
        <!-- Mention annotated classes -->
        <mapping class="com.example.User"/>
    </session-factory>
</hibernate-configuration>
```

