---
title: Fast Kafka
slug: guides/python/fast/fast-kafka
description: Fast Kafka
sidebar:
  order: 12
---

**Kafka with FastAPI**

---

### 1. Why Kafka with FastAPI?

- **Event Streaming** → Real-time data pipelines (logs, metrics, analytics).
- **Decoupling Services** → Producers don’t need to know consumers.
- **Scalability** → Partitioned topics enable parallel processing.
- **Replayability** → Consumers can re-read messages from a point in time.
- **Fault-Tolerance** → Distributed, replicated logs.

---

### 2. Setup

#### Install Kafka (with Zookeeper)

```bash
brew install kafka        # macOS
```

or use Docker:

```yaml
# docker-compose.yml
version: "3"
services:
  zookeeper:
    image: wurstmeister/zookeeper
    ports:
      - "2181:2181"

  kafka:
    image: wurstmeister/kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
```

Start with:

```bash
docker-compose up -d
```

---

#### Install Python Client

```bash
pip install aiokafka fastapi[all]
```

---

### 3. Connecting Kafka in FastAPI

#### `core/kafka.py`

```python
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
import asyncio

KAFKA_BOOTSTRAP_SERVERS = "localhost:9092"
KAFKA_TOPIC = "events"

async def get_producer():
    producer = AIOKafkaProducer(bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS)
    await producer.start()
    return producer

async def get_consumer(group_id="fastapi-group"):
    consumer = AIOKafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id=group_id,
        auto_offset_reset="earliest"
    )
    await consumer.start()
    return consumer
```

---

### 4. Example Use Cases

#### a) **Producer – Send Events**

```python
from fastapi import FastAPI, Depends
from app.core.kafka import get_producer, KAFKA_TOPIC

app = FastAPI()

@app.post("/produce/")
async def produce_event(message: str, producer=Depends(get_producer)):
    await producer.send_and_wait(KAFKA_TOPIC, message.encode("utf-8"))
    return {"status": "sent", "message": message}
```

---

#### b) **Consumer – Process Events**

```python
# worker.py
import asyncio
from aiokafka import AIOKafkaConsumer
from app.core.kafka import KAFKA_BOOTSTRAP_SERVERS, KAFKA_TOPIC

async def consume():
    consumer = AIOKafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id="worker-group",
        auto_offset_reset="earliest"
    )
    await consumer.start()
    try:
        async for msg in consumer:
            print(f"Received: {msg.value.decode()}")
    finally:
        await consumer.stop()

if __name__ == "__main__":
    asyncio.run(consume())
```

Run in terminal:

```bash
python worker.py
```

---

#### c) **Streaming Example – Log Events**

```python
@app.post("/log/")
async def log_event(user: str, action: str, producer=Depends(get_producer)):
    event = f"{user} performed {action}"
    await producer.send_and_wait(KAFKA_TOPIC, event.encode())
    return {"event": event}
```

Consumers can aggregate logs for dashboards.

---

#### d) **Multiple Consumers (Scaling)**

- Kafka allows **consumer groups**.
- Each consumer in a group processes a subset of partitions.

```python
consumer1 = AIOKafkaConsumer(KAFKA_TOPIC, group_id="analytics", ...)
consumer2 = AIOKafkaConsumer(KAFKA_TOPIC, group_id="billing", ...)
```

---

### 5. Project Structure

```
project/
│── app/
│   ├── core/
│   │   ├── config.py
│   │   ├── kafka.py         # producer & consumer setup
│   │
│   ├── api/
│   │   ├── producer.py      # FastAPI endpoints producing events
│   │
│   ├── main.py              # FastAPI entrypoint
│
│── worker.py                # consumer worker
│── docker-compose.yml       # Kafka + Zookeeper setup
```

---

### 6. Best Practices

✅ Use **partitions** wisely (parallelism).

✅ Use **consumer groups** for scaling.

✅ Always handle **serialization** (JSON/Avro).

✅ Tune **acks**, **retries**, **batch size** for performance.

✅ Monitor Kafka with **Prometheus + Grafana / Confluent Control Center**.

✅ Store schemas in **Schema Registry** (Avro/Protobuf).

✅ Use Kafka for **event sourcing + CQRS** patterns.
