---
title: Setup Redis
description: Setting up Redis in docker
date: 2026-03-23
author: maratib
featured: true
sidebar:
  order: 1
---

## Pull the Redis Docker Image

```bash
docker pull redis:latest
```

## Run the Redis Docker Container

```bash
docker run --name my-redis -p 6379:6379 -d redis
```  