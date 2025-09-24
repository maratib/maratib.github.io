---
title: Fast Background Tasks
slug: guides/python/fast/fast-background-tasks
description: Fast Background Tasks
sidebar:
  order: 5
---

**Running tasks in background in FastAPI**

---

### 1. What are Background Tasks?

- **Background tasks** let you run logic **after returning a response** to the client.
- Useful when you don’t want the client to wait for heavy operations.

👉 Example use cases:

- Sending emails after signup
- Logging / analytics
- Data processing (e.g., resizing images)
- Notifications

---

### 2. Why Background Tasks?

- ✅ Keep APIs **fast** → respond immediately.
- ✅ Offload **non-critical work**.
- ✅ Built-in → no need for Celery/Redis for small tasks.

---

### 3. Basic Example

```python
from fastapi import FastAPI, BackgroundTasks

app = FastAPI()

def write_log(message: str):
    with open("log.txt", "a") as f:
        f.write(message + "\n")

@app.post("/log/")
def log(background_tasks: BackgroundTasks, msg: str):
    background_tasks.add_task(write_log, msg)
    return {"status": "Message logged in background"}
```

✔️ Flow:

1. Client calls `/log/`
2. Response returned immediately ✅
3. `write_log()` runs **in background**

---

### 4. Advanced Example — Sending Email

```python
import time
from fastapi import FastAPI, BackgroundTasks

app = FastAPI()

def send_email(email: str, subject: str, body: str):
    time.sleep(5)  # Simulate email sending delay
    print(f"Sent email to {email}: {subject}")

@app.post("/send-mail/")
def send_mail(background_tasks: BackgroundTasks, email: str):
    background_tasks.add_task(send_email, email, "Welcome!", "Thanks for joining 🎉")
    return {"status": f"Email to {email} is being sent in background"}
```

---

### 5. Combining with Depends

Background tasks can also be injected along with dependencies:

```python
from fastapi import Depends

def get_current_user(token: str = "test123"):
    if token != "test123":
        raise Exception("Invalid Token")
    return {"username": "admin"}

@app.post("/notify/")
def notify_user(background_tasks: BackgroundTasks, user: dict = Depends(get_current_user)):
    background_tasks.add_task(write_log, f"Notification sent to {user['username']}")
    return {"status": "Notification scheduled"}
```

---

### 6. Key Benefits in FastAPI

- ✅ Integrated, no extra setup
- ✅ Perfect for **lightweight tasks**
- ✅ Runs in the same process (not a queue system)
- ✅ Great for **logging, caching, notifications, async jobs**

---

### 7. How FastAPI Uses Background Tasks Under the Hood

**Request cycle with Background Tasks:**

```
Client Request
     ↓
FastAPI Router
     ↓
Run Endpoint
     ↓
Return Response (immediately)
     ↓
Background Task executes (after response sent)
```

---

⚠️ **Note:**

- For <span style="color: red">**heavy tasks (long-running, CPU-intensive)**</span>, you should use **Celery, RQ, Dramatiq** with a message broker (Redis, RabbitMQ).
- BackgroundTasks are best for **small async jobs**.
