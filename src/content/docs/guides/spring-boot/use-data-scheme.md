---
title: Using data.sql and schema.sql
slug: guides/spring-boot/use-data-schema
description: Using data.sql and schema in spring boot
sidebar:
  order: 4
---
> **_NOTE:_** If you are using only loading data from `data.sql` use the following settings to defer the entities created by spring boot, this will create tables before inserting data into those tables.
```properties
    jpa.defer-datasource-initialization: true
```

### 1. Place the files
- Create the following files in your src/main/resources directory:
- `schema.sql`: Contains the Data Definition Language (DDL) scripts to create your database tables.
- `data.sql`: Contains the Data Manipulation Language (DML) scripts to populate your tables with initial data. 

#### File structure: `src/main/resources`
```
└── src/
    └── main/
        └── java/
        └── resources/
            ├── application.properties
            ├── schema.sql
            └── data.sql
```            
### 2. Create the SQL scripts
`src/main/resources/schema.sql`

This file should contain `CREATE TABLE` and other DDL statements. 
```sql
-- DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
```


`src/main/resources/data.sql` 

This file should contain `INSERT statements` to populate your tables with data. 
```sql
INSERT INTO users (name, email) VALUES
    ('John Doe', 'john.doe@example.com'),
    ('Jane Smith', 'jane.smith@example.com');
```

### 3. Configure application.properties
The `behavior of these scripts varies depending` on whether you are using an embedded database (like H2) or an external database (like MySQL or PostgreSQL). 

`For an embedded database (e.g., H2):`  
Spring Boot initializes the database automatically by default. No extra configuration is needed. 

`For a non-embedded database:`  
You must explicitly set `spring.sql.init.mode to always`. This is a crucial step to ensure the scripts run on a persistent database.

`src/main/resources/application.properties`

```properties
# Example configuration for MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/mydatabase
spring.datasource.username=root
spring.datasource.password=password

# Enable script-based initialization for non-embedded databases
spring.sql.init.mode=always

# Disable Hibernate's automatic schema generation to avoid conflicts
spring.jpa.hibernate.ddl-auto=none
```

> **_NOTE:_** Disabling `spring.jpa.hibernate.ddl-auto` is a best practice to prevent conflicts with your SQL scripts. Otherwise, Hibernate might try to create tables before your `schema.sql` script runs. 

<details>
<summary>Advanced features and tips</summary>

#### Database-specific scripts

For different database vendors, you can use platform-specific naming conventions, such as `schema-h2.sql` or `data-mysql.sql`. You then set the platform in your `application.properties` file: 

```properties
spring.datasource.platform=mysql
```
#### Error handling

By default, Spring Boot's database initializer will fail the application startup if an exception occurs during script execution. You can change this behavior with the `continue-on-error` property: 

```properties
spring.sql.init.continue-on-error=true
```

#### Disabling initialization

If you need to turn off database initialization entirely, you can set the `initialization-mode` property to `never`: 

```properties
spring.sql.init.mode=never
```

#### Alternative migration tools
For more complex, production-level projects, using dedicated database migration tools like Flyway or Liquibase is often recommended over `schema.sql` and `data.sql`. These tools provide robust version control for your database schema and support for complex migrations. 
