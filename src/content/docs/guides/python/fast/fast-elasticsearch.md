---
title: Fast ElasticSearch
slug: guides/python/fast/fast-elasticsearch
description: Fast ElasticSearch
sidebar:
  order: 14
---

**FastAPI with Elasticsearch**

---

### 1. Why Use Elasticsearch with FastAPI?

- **Full-Text Search** → Powerful search engine (better than SQL `LIKE`).
- **Analytics** → Aggregations, trends, dashboards.
- **Scalable Storage** → Handles billions of documents.
- **Use Cases** → E-commerce product search, logs (ELK stack), recommendation engines.

---

### 2. Setup

#### Install Elasticsearch (Docker Recommended)

```yaml
# docker-compose.yml
version: "3"
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.14.3
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.14.3
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
```

Run:

```bash
docker-compose up -d
```

---

#### Install Python Client

```bash
pip install elasticsearch fastapi[all]
```

---

### 3. Connecting Elasticsearch in FastAPI

#### `core/elasticsearch.py`

```python
from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")

INDEX_NAME = "items"

def create_index():
    if not es.indices.exists(index=INDEX_NAME):
        es.indices.create(index=INDEX_NAME, body={
            "mappings": {
                "properties": {
                    "name": {"type": "text"},
                    "description": {"type": "text"},
                    "price": {"type": "float"},
                    "in_stock": {"type": "boolean"}
                }
            }
        })
```

Call `create_index()` at startup.

---

### 4. Example Use Cases

#### a) **Index a Document**

```python
from fastapi import FastAPI
from app.core.elasticsearch import es, INDEX_NAME

app = FastAPI()

@app.post("/items/")
def add_item(item: dict):
    res = es.index(index=INDEX_NAME, document=item)
    return {"result": res["result"], "id": res["_id"]}
```

---

#### b) **Get a Document by ID**

```python
@app.get("/items/{item_id}")
def get_item(item_id: str):
    res = es.get(index=INDEX_NAME, id=item_id)
    return res["_source"]
```

---

#### c) **Search Items** (Full-Text Search)

```python
@app.get("/search/")
def search_items(query: str):
    res = es.search(
        index=INDEX_NAME,
        body={
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["name", "description"]
                }
            }
        }
    )
    return [hit["_source"] for hit in res["hits"]["hits"]]
```

---

#### d) **Filtering & Sorting**

```python
@app.get("/filter/")
def filter_items(min_price: float = 0, max_price: float = 1000):
    res = es.search(
        index=INDEX_NAME,
        body={
            "query": {
                "range": {
                    "price": {"gte": min_price, "lte": max_price}
                }
            },
            "sort": [{"price": "asc"}]
        }
    )
    return [hit["_source"] for hit in res["hits"]["hits"]]
```

---

#### e) **Aggregations (Analytics Example)**

```python
@app.get("/stats/")
def price_stats():
    res = es.search(
        index=INDEX_NAME,
        body={
            "aggs": {
                "avg_price": {"avg": {"field": "price"}},
                "max_price": {"max": {"field": "price"}},
                "min_price": {"min": {"field": "price"}}
            }
        },
        size=0  # don’t return docs, only stats
    )
    return res["aggregations"]
```

---

### 5. Project Structure

```
project/
│── app/
│   ├── core/
│   │   ├── elasticsearch.py   # connection & index creation
│   │
│   ├── api/
│   │   ├── search.py          # search endpoints
│   │   ├── items.py           # CRUD endpoints
│   │
│   ├── main.py                # FastAPI app startup
│
│── docker-compose.yml         # Elasticsearch + Kibana
```

---

### 6. Best Practices

✅ Use **index mappings** for structured data.

✅ Use **bulk API** for batch inserts (not one-by-one).

✅ Set proper **analyzers** for text fields (language-specific).

✅ Use **pagination (`from`, `size`)** carefully (or `search_after` for deep pagination).

✅ Monitor ES with **Kibana + Prometheus exporters**.

✅ Use **Elasticsearch in AWS OpenSearch** for managed service.

✅ Don’t use ES as a primary DB — use it for **search + analytics**.
