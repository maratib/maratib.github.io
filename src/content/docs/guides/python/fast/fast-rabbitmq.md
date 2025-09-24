---
title: Fast RabbitMQ
slug: guides/python/fast/fast-rabbitmq
description: Fast RabbitMQ
sidebar:
  order: 11
---

**RabbitMQ with FastAPI**

---

### 1. Why RabbitMQ with FastAPI?

- **Message Queueing** → Decouple services, reliable delivery.
- **Background Tasks** → Offload heavy jobs.
- **Event-Driven Architecture** → Services communicate via events.
- **Scalability** → Producers & consumers scale independently.

---

### 2. Setup

#### Install RabbitMQ

```bash
brew install rabbitmq        # macOS
sudo apt-get install rabbitmq-server  # Linux
```

Start server:

```bash
rabbitmq-server
```

Management UI at → [http://localhost:15672](http://localhost:15672) (default: guest/guest).

---

#### Install Python Client

```bash
pip install aio-pika fastapi[all]
```

---

### 3. Connecting RabbitMQ in FastAPI

#### `core/rabbitmq.py`

```python
import aio_pika
import asyncio

RABBITMQ_URL = "amqp://guest:guest@localhost/"

async def get_connection():
    return await aio_pika.connect_robust(RABBITMQ_URL)

async def get_channel():
    connection = await get_connection()
    channel = await connection.channel()
    await channel.set_qos(prefetch_count=10)
    return channel
```

---

### 4. Example Use Cases

#### a) **Producer – Send Message**

```python
from fastapi import FastAPI, Depends
from app.core.rabbitmq import get_channel
import aio_pika

app = FastAPI()

@app.post("/send/")
async def send_message(message: str, channel=Depends(get_channel)):
    queue = await channel.declare_queue("task_queue", durable=True)
    await channel.default_exchange.publish(
        aio_pika.Message(body=message.encode(), delivery_mode=aio_pika.DeliveryMode.PERSISTENT),
        routing_key=queue.name,
    )
    return {"status": "sent", "message": message}
```

---

#### b) **Consumer – Process Messages**

```python
# worker.py
import asyncio
import aio_pika

RABBITMQ_URL = "amqp://guest:guest@localhost/"

async def main():
    connection = await aio_pika.connect_robust(RABBITMQ_URL)
    channel = await connection.channel()
    queue = await channel.declare_queue("task_queue", durable=True)

    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            async with message.process():
                print(f"Received: {message.body.decode()}")
                await asyncio.sleep(2)  # simulate work

if __name__ == "__main__":
    asyncio.run(main())
```

👉 Run worker in separate terminal:

```bash
python worker.py
```

---

#### c) **Background Task Pattern**

Instead of blocking requests, offload heavy work to RabbitMQ:

```python
@app.post("/process-data/")
async def process_data(data: str, channel=Depends(get_channel)):
    queue = await channel.declare_queue("data_queue", durable=True)
    await channel.default_exchange.publish(
        aio_pika.Message(body=data.encode(), delivery_mode=aio_pika.DeliveryMode.PERSISTENT),
        routing_key=queue.name,
    )
    return {"status": "queued", "data": data}
```

Worker consumes and processes data asynchronously.

---

#### d) **Pub/Sub Example**

- **Exchange type = fanout** → Broadcast message to all queues.

```python
@app.post("/broadcast/")
async def broadcast(message: str, channel=Depends(get_channel)):
    exchange = await channel.declare_exchange("broadcast", aio_pika.ExchangeType.FANOUT)
    await exchange.publish(aio_pika.Message(body=message.encode()), routing_key="")
    return {"status": "broadcasted"}
```

Consumers bind to `"broadcast"` exchange and receive messages.

---

### 5. Project Structure

```
project/
│── app/
│   ├── core/
│   │   ├── config.py
│   │   ├── rabbitmq.py      # connection helpers
│   │
│   ├── api/
│   │   ├── producer.py      # endpoints for producing messages
│   │
│   ├── main.py              # FastAPI entrypoint
│
│── worker.py                # message consumer
```

---

### 6. Best Practices

✅ Use **durable queues + persistent messages** for reliability.

✅ Set **QoS (prefetch_count)** to avoid overload.

✅ Separate **producer (FastAPI)** and **consumer (workers)**.

✅ Use **dead-letter exchanges (DLX)** for failed messages.

✅ Monitor with **RabbitMQ Management UI** or **Prometheus exporter**.

✅ Use **correlation_id + reply_to** for request/response pattern.

✅ Use **docker-compose** for local dev (RabbitMQ + FastAPI + worker).
