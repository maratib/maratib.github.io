---
title: Fast Redis
slug: guides/python/fast/fast-redis
description: Fast Redis
sidebar:
  order: 10
---

**Using Redis with FastAPI**

---

### 1. Why Redis with FastAPI?

- **Caching** → Reduce DB load, speed up API responses.
- **Sessions / Tokens** → Store short-lived authentication tokens.
- **Rate Limiting** → Prevent abuse by tracking requests.
- **Background Jobs / Queues** → Async task execution (Celery, RQ).
- **Pub/Sub** → Real-time notifications, chat apps.

---

### 2. Setup

#### Install Redis & Python Client

```bash
brew install redis    # macOS
sudo apt install redis-server   # Linux
```

Start Redis server:

```bash
redis-server
```

Install Python client:

```bash
pip install redis fastapi[all] aioredis
```

---

## 3. Connecting Redis in FastAPI

### `core/redis.py`

```python
import redis.asyncio as redis

redis_client = redis.from_url(
    "redis://localhost:6379",
    decode_responses=True
)
```

👉 Use `redis_client.set`, `get`, `delete`, etc.

---

### 4. Example Use Cases

#### a) **Caching API Responses**

```python
from fastapi import FastAPI, Depends
from app.core.redis import redis_client

app = FastAPI()

@app.get("/items/{item_id}")
async def get_item(item_id: int):
    # Check cache
    cached = await redis_client.get(f"item:{item_id}")
    if cached:
        return {"item": cached, "source": "cache"}

    # Simulate DB call
    data = f"Item data for {item_id}"
    await redis_client.set(f"item:{item_id}", data, ex=60)  # 60s expiry
    return {"item": data, "source": "db"}
```

---

#### b) **Storing Session Tokens**

```python
@app.post("/login")
async def login(username: str):
    session_token = f"token-{username}"
    await redis_client.set(f"session:{username}", session_token, ex=3600)  # 1h session
    return {"token": session_token}

@app.get("/validate")
async def validate(username: str, token: str):
    saved = await redis_client.get(f"session:{username}")
    if saved == token:
        return {"status": "valid"}
    return {"status": "invalid"}
```

---

#### c) **Rate Limiting Example**

```python
from fastapi import HTTPException

@app.get("/limited")
async def limited(username: str):
    key = f"rate:{username}"
    count = await redis_client.incr(key)

    if count == 1:
        await redis_client.expire(key, 60)  # reset after 60s

    if count > 5:
        raise HTTPException(status_code=429, detail="Too many requests")

    return {"message": f"Request {count} allowed"}
```

---

#### d) **Background Tasks with RQ**

```bash
pip install rq
```

Worker:

```python
# worker.py
import redis
from rq import Worker, Queue, Connection

redis_conn = redis.Redis()
queue = Queue(connection=redis_conn)

if __name__ == '__main__':
    with Connection(redis_conn):
        worker = Worker([queue])
        worker.work()
```

Producer in FastAPI:

```python
from rq import Queue
from redis import Redis

redis_conn = Redis()
queue = Queue(connection=redis_conn)

def background_job(x, y):
    return x + y

@app.post("/task")
def create_task(x: int, y: int):
    job = queue.enqueue(background_job, x, y)
    return {"job_id": job.get_id()}
```

---

### 5. Project Structure

```
project/
│── app/
│   ├── core/
│   │   ├── config.py
│   │   ├── redis.py        # Redis connection
│   │
│   ├── api/
│   │   ├── routes/
│   │   │   ├── cache.py    # caching endpoints
│   │   │   ├── auth.py     # sessions with redis
│   │   │   ├── limit.py    # rate limiting
│   │   │   ├── tasks.py    # background tasks
│   │
│   ├── main.py             # FastAPI entrypoint
│
│── worker.py               # RQ worker
```

---

### 6. Best Practices

✅ Use **async redis client** (`redis.asyncio`).

✅ Always set **expiry (ex)** for cache/session keys.

✅ Use **prefixes** (`item:`, `session:`, `rate:`) for key organization.

✅ For distributed tasks → use **RQ / Celery** with Redis.

✅ Use **Redis Cluster / Sentinel** in production for HA.

✅ Monitor with **RedisInsight** or **Prometheus exporters**.
