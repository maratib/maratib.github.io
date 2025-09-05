---
title: Core Architecture
slug: guides/java/hibernate/core_architecture
description: Core Architecture
sidebar:
  order: 2
---

- Hibernate's architecture is designed to be layered and modular, providing flexibility and extensibility. 
- The core components work together to manage the persistence lifecycle, from object creation to database synchronization. 


![Core Architecture](/img/java/hibernate/core.svg)

**Key Components:**
- **SessionFactory**: Thread-safe, immutable cache of compiled mappings for a single database. Heavyweight object that should be created once during application startup. It internally maintains a connection pool and second-level cache.

- **Session**: Single-threaded, short-lived object representing a conversation between the application and database. Wraps a JDBC connection and serves as a factory for Transaction instances. Maintains first-level cache of persistent objects.

- **Transaction**: Single-threaded, short-lived object that abstracts underlying transaction API (JTA or JDBC). Defines atomic units of work with database.

- **ConnectionProvider**: Factory for JDBC connections, abstracting connection pool implementation (C3P0, HikariCP, etc.)

- **TransactionFactory**: Factory for Transaction instances, abstracting transaction management strategy

