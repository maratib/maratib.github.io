---
title: Setup Kafka 
description: Setting up Kafka in docker
date: 2026-03-23
author: maratib
featured: true
sidebar:
  order: 2
---

## Option 1: Quickstart with a Single Kafka Container (KRaft mode) 

For a simple, single-broker setup using Kafka's built-in KRaft mode, you can use the official apache/kafka image and the Docker CLI. This approach is fast and ideal for basic testing. 

### 1. Pull and run the Kafka image 

from your terminal, mapping the default port 9092 to your host machine:

```bash
docker run -d --name broker -p 9092:9092 apache/kafka:latest
```
This command starts the Kafka container in the background (-d).

### 2. Verify the installation 
by running the Kafka command-line tools from within the container.

1. Open a shell in the container:

```bash
docker exec -it broker /bin/bash
```
2. Inside the container, create a topic:
```bash
/opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic test-topic
```
3. You can then produce and consume messages using other built-in scripts.

### 3. Stop and remove the container when finished:
```bash
docker rm -f broker
```
 
## Option 2: Using Docker Compose for a Persistent Environment 
Using docker compose is the recommended method for development as it simplifies the management of services and networking, allowing for easier setup of multi-container environments or tools like Kafka UI. 

### 1. Create a docker-compose.yml 
file in a new project directory. This example uses the Bitnami images which are popular and well-maintained.
```yaml
version: '3'
services:
  zookeeper:
    image: bitnami/zookeeper:latest
    ports:
      - "2181:2181"
    environment:
      ALLOW_ANONYMOUS_LOGIN: "yes"

  kafka:
    image: bitnami/kafka:latest
    ports:
      - "9092:9092"
    environment:
      KAFKA_CFG_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_CFG_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      ALLOW_PLAINTEXT_LISTENER: "yes"
    depends_on:
      - zookeeper
```      
Note the use of localhost:9092 in KAFKA_CFG_ADVERTISED_LISTENERS so that clients on your Mac can connect to the container.

### 2. Start the services 
from your terminal in the same directory as the docker-compose.yml file:
```bash
docker-compose up -d
````
This command will download the necessary images and start the Zookeeper and Kafka containers in detached mode.

### 3. Verify the containers 
are running in your Docker Desktop dashboard or via the command line:
```bash
docker ps
```

### 4.Interact with Kafka by executing commands inside the kafka container.

1. Open a shell in the Kafka container:
```bash
docker exec -it kafka /bin/bash
```

2. Once inside the container, you can use the Kafka CLI tools, for example, to list topics:

```bash
kafka-topics.sh --list --bootstrap-server localhost:9092
```

3. Stop the services when you are done:
```bash
docker-compose down
```

