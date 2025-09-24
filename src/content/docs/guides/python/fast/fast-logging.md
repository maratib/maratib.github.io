---
title: Fast Logging
slug: guides/python/fast/fast-logging
description: Fast Logging
sidebar:
  order: 6
---

**Logging & Monitoring in FastAPI** – With this setup, your FastAPI project will have **enterprise-grade logging & monitoring**.

---

### 1. Why Logging & Monitoring?

- **Logging** → Record system events, errors, performance metrics.
- **Monitoring** → Real-time insight into app health (APM, metrics, tracing).
- Essential for **debugging, scaling, and observability** in production.

---

### 2. Logging Setup in FastAPI

#### a) Basic Python Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)
```

---

#### b) Centralized Logging Config (`core/logging.py`)

```python
import logging
from logging.config import dictConfig

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        },
        "detailed": {
            "format": "%(asctime)s | %(levelname)s | %(name)s | %(filename)s:%(lineno)d | %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
            "level": "INFO",
        },
        "file": {
            "class": "logging.FileHandler",
            "formatter": "detailed",
            "filename": "app.log",
            "level": "DEBUG",
        },
    },
    "root": {"handlers": ["console", "file"], "level": "DEBUG"},
}

def setup_logging():
    dictConfig(LOGGING_CONFIG)
```

👉 Then in `main.py`:

```python
from fastapi import FastAPI
from app.core.logging import setup_logging
import logging

setup_logging()
logger = logging.getLogger("app")

app = FastAPI()

@app.get("/")
def root():
    logger.info("Root endpoint was called")
    return {"msg": "Hello FastAPI"}
```

---

#### c) Request/Response Logging Middleware

```python
from fastapi import Request
import time

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time

    logger.info(
        f"{request.method} {request.url} - Status: {response.status_code} - Duration: {duration:.2f}s"
    )
    return response
```

---

### 3. Monitoring in FastAPI

#### a) Using **Prometheus** Metrics

```bash
pip install prometheus-fastapi-instrumentator
```

```python
from prometheus_fastapi_instrumentator import Instrumentator

@app.on_event("startup")
async def startup():
    Instrumentator().instrument(app).expose(app)
```

👉 Visit `/metrics` → Prometheus-compatible metrics.

---

#### b) OpenTelemetry (Distributed Tracing)

```bash
pip install opentelemetry-api opentelemetry-sdk opentelemetry-instrumentation-fastapi opentelemetry-exporter-otlp
```

```python
from opentelemetry import trace
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

resource = Resource(attributes={SERVICE_NAME: "fastapi-app"})
provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

FastAPIInstrumentor.instrument_app(app)
```

👉 Sends traces to an APM (Jaeger, Datadog, Tempo, etc.).

---

#### c) External Monitoring & Observability Tools

- **Sentry** → Error tracking.

  ```bash
  pip install sentry-sdk
  ```

  ```python
  import sentry_sdk
  from sentry_sdk.integrations.fastapi import FastApiIntegration

  sentry_sdk.init(
      dsn="YOUR_SENTRY_DSN",
      integrations=[FastApiIntegration()],
      traces_sample_rate=1.0,
  )
  ```

- **Elastic APM / Datadog / Grafana Tempo** → Logs + Metrics + Tracing.

---

### 4. Folder Structure for Logging/Monitoring

```
project/
│── app/
│   ├── core/
│   │   ├── config.py
│   │   ├── logging.py       # Logging config
│   │   ├── monitoring.py    # Prometheus / OpenTelemetry setup
│   │
│   ├── main.py              # Initialize logging & monitoring
│   ├── api/...
│   └── services/...
│
│── app.log                  # Log file (if file handler enabled)
```

---

### 5. Best Practices

✅ Use **dictConfig** for flexible logging.

✅ Use **structured logs (JSON)** for ELK / Datadog.

✅ Don’t log sensitive data (passwords, tokens).

✅ Log at correct levels (`DEBUG`, `INFO`, `WARNING`, `ERROR`).

✅ Use **middleware** to log requests/responses.

✅ Use **Prometheus + Grafana** for metrics dashboards.

✅ Use **OpenTelemetry** for distributed tracing.

✅ Integrate **Sentry** for real-time error alerts.

---
