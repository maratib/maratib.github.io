---
title: Setup RabbitMQ 
description: Setting up RabbitMQ in docker
date: 2026-03-23
author: maratib
featured: true
sidebar:
  order: 3
---

### 1. Pull the official RabbitMQ Docker image 
with the management plugin enabled. This plugin provides a web-based UI for management and monitoring.
```bash
docker pull rabbitmq:3-management
```
### . Run a RabbitMQ container 
using the following command. This command runs the container in detached mode (-d), assigns it a name (--name), and maps the necessary ports from the container to your host machine:

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

1. 5672: The default port for the RabbitMQ server (AMQP connections).
2. 15672: The port for the management console UI.

### 3. Verify the container 
is running by opening Docker Desktop or using the following command in your terminal:
```bash
docker ps
```
You should see a container named rabbitmq with the status Up.
### 4. Access the RabbitMQ Management Console 
by opening a web browser and navigating to http://localhost:15672/. The default username and password for the management console are both guest. 

### Optional: Persisting Data
To ensure your data (messages, user definitions, etc.) is not lost when the container is stopped or removed, mount a local directory as a volume to the container's data directory (`/var/lib/rabbitmq`). 
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 -v /path/to/your/data:/var/lib/rabbitmq rabbitmq:3-management
```
Replace `/path/to/your/data` with the absolute path of the directory on your Mac where you want to store the data. 
