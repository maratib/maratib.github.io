---
title: Uvicorn vs Gunicorn
slug: guides/python/fast/unicorn
description: Uvicorn vs Gunicorn
sidebar:
  order: 20
---

#### What is Uvicorn?

**Uvicorn** is an **ASGI (Asynchronous Server Gateway Interface) server** implementation for Python. It's specifically designed to work with async web frameworks like FastAPI, Starlette, and Django 3.0+.

#### Key Characteristics:

- **ASGI server** - Built for asynchronous Python web applications
- **Lightweight** - Minimal overhead, designed for high performance
- **Single-process** - Typically runs as a single process (though can be scaled)
- **Development-friendly** - Excellent for development with auto-reload feature
- **Built for async** - Natively supports async/await patterns

#### Basic Usage:

```bash
# Development with auto-reload
uvicorn main:app --reload

# Production with specific settings
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Gunicorn

#### What is Gunicorn?

**Gunicorn** (Green Unicorn) is a **WSGI (Web Server Gateway Interface) server** for Python. It's a pre-fork worker model server that's been widely used for traditional synchronous Python web applications.

#### Key Characteristics:

- **WSGI server** - Originally designed for synchronous frameworks
- **Process manager** - Manages multiple worker processes
- **Production-ready** - Battle-tested for production deployments
- **Load balancing** - Distributes requests among worker processes
- **Mature ecosystem** - Extensive configuration options

#### Basic Usage:

```bash
# Basic usage with synchronous workers
gunicorn main:app --workers 4

# With specific bind settings
gunicorn main:app --bind 0.0.0.0:8000 --workers 4
```

### Key Differences

| Aspect             | Uvicorn                               | Gunicorn                              |
| ------------------ | ------------------------------------- | ------------------------------------- |
| **Interface**      | ASGI (Asynchronous)                   | WSGI (Synchronous)                    |
| **Primary Use**    | Async frameworks (FastAPI, Starlette) | Sync frameworks (Flask, Django)       |
| **Architecture**   | Can run standalone or as worker       | Process manager with worker processes |
| **Performance**    | Better for I/O-bound async apps       | Better for CPU-bound sync apps        |
| **Worker Types**   | Uvicorn workers (async)               | Sync, async, gevent, etc. workers     |
| **Learning Curve** | Simpler for async apps                | More configuration options            |

### Detailed Comparison

#### 1. Architecture Differences

**Uvicorn (Standalone ASGI):**

```
Client Request → Uvicorn Process → Async Application
```

**Gunicorn with Uvicorn Workers:**

```
Client Request → Gunicorn Master → Multiple Uvicorn Workers → Async Application
```

#### 2. When to Use Which?

##### Use Uvicorn Alone When:

- **Development environment** - Fast reload, easy debugging
- **Simple deployments** - Less complex configuration needed
- **Small to medium traffic** - When you don't need advanced process management
- **Testing/POC** - Quick setup and iteration

##### Use Gunicorn + Uvicorn Workers When:

- **Production environment** - Need process management and monitoring
- **High traffic** - Better load distribution and fault tolerance
- **Zero-downtime deployments** - Graceful worker reloads
- **Advanced configuration** - Need fine-tuned performance settings

#### 3. Performance Characteristics

```python
# Example: FastAPI app performance comparison
"""
Uvicorn alone:
- Lower memory overhead per request
- Better for long-lived connections (WebSockets)
- Optimal for pure async workloads

Gunicorn + Uvicorn workers:
- Better CPU utilization on multi-core systems
- Process isolation (if one worker crashes, others survive)
- Better for mixed async/sync workloads
"""
```

### Practical Examples

#### Example 1: Development Setup

**Uvicorn (Recommended for development):**

```bash
# Development with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# With debug level logging
uvicorn main:app --reload --log-level debug
```

#### Example 2: Production Setup

**Option A: Uvicorn Alone (Simpler)**

```bash
# Multiple workers with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# With process manager like supervisord or systemd
```

**Option B: Gunicorn + Uvicorn Workers (Recommended for production)**

```bash
# Install required packages
pip install gunicorn uvicorn

# Run with uvicorn workers
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# With more configuration
gunicorn main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --timeout 120 \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 100
```

#### Example 3: Configuration Files

**Uvicorn Configuration (`uvicorn_config.py`):**

```python
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        workers=4,
        reload=False,  # Disable in production
        log_level="info"
    )
```

**Gunicorn Configuration (`gunicorn_conf.py`):**

```python
# gunicorn_conf.py
import multiprocessing

# Server socket
bind = "0.0.0.0:8000"

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"

# Timeout
timeout = 120
keepalive = 5

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Process naming
proc_name = "fastapi_app"
```

### Best Practices

#### 1. Development

```bash
# Use uvicorn with reload for development
uvicorn main:app --reload --host localhost --port 8000
```

#### 2. Production

```bash
# Use gunicorn with uvicorn workers for production
gunicorn main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --timeout 120
```

#### 3. Docker Deployment

```dockerfile
FROM python:3.9

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# Use gunicorn as entrypoint for production
CMD ["gunicorn", "main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

#### 4. Worker Calculation

```python
# Optimal worker calculation
import multiprocessing

# General formula
workers = multiprocessing.cpu_count() * 2 + 1

# For I/O heavy apps (more workers)
workers = multiprocessing.cpu_count() * 3

# For CPU heavy apps (fewer workers)
workers = multiprocessing.cpu_count() + 1
```

### Common Deployment Scenarios

#### Scenario 1: Small Application

```bash
# Direct uvicorn (simpler)
uvicorn main:app --workers 2 --host 0.0.0.0 --port 8000
```

#### Scenario 2: Medium Traffic API

```bash
# Gunicorn + Uvicorn workers (recommended)
gunicorn main:app --workers 8 --worker-class uvicorn.workers.UvicornWorker
```

#### Scenario 3: High Traffic with Load Balancer

```bash
# Multiple instances behind load balancer
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
# Run multiple instances on different ports
```

### Monitoring and Management

#### With Uvicorn Alone:

```bash
# Basic monitoring needed
# Use process manager like supervisord or systemd
```

#### With Gunicorn:

```bash
# Built-in process management
gunicorn main:app --workers 4 --preload  # Preload app before forking

# Graceful reload
kill -HUP <master_pid>
```

### Conclusion

**Uvicorn** is your go-to for development and simpler async applications, while **Gunicorn + Uvicorn workers** provides a robust production-grade solution for high-traffic deployments. The combination gives you the best of both worlds: Gunicorn's process management and Uvicorn's async capabilities.

For most FastAPI applications in production, the recommended approach is:

```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```
