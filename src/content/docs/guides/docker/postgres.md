---
title: Setup Postgres
description: Setting up Postgres in docker
date: 2026-03-23
author: maratib
featured: true
sidebar:
  order: 0
---

## Pull the Postgres Docker Image

```bash
docker pull postgres:14
```

## Run the Postgres Docker Container

```bash
docker run --name mypostgres \
-e POSTGRES_PASSWORD=mysecretpassword \
-p 5432:5432 \
-v postgres_data:/var/lib/postgresql/data \
-d postgres:14

```  