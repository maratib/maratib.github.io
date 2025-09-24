---
title: Fast AI
slug: guides/python/fast/fast-ai
description: Fast AI
sidebar:
  order: 15
---

**FastAPI with AI**

---

### 1. Why Use FastAPI with AI?

- **Model Serving** → Deploy ML/DL models as REST or GraphQL APIs.
- **Scalable Inference** → Handle thousands of requests using async FastAPI.
- **Pre/Post-Processing** → Handle data transformations around models.
- **Integration** → Combine AI models with Redis, Kafka, or Elasticsearch.
- **Real Use Cases**:

  - NLP APIs (chatbots, summarization)
  - Computer Vision (image recognition, OCR)
  - Recommendation Systems
  - Fraud Detection

---

### 2. Setup

#### Install Dependencies

```bash
pip install fastapi[all] pydantic torch transformers scikit-learn
```

---

### 3. Simple AI Model in FastAPI

#### `ml/model.py`

```python
from transformers import pipeline

# Load HuggingFace model
sentiment_model = pipeline("sentiment-analysis")

def analyze_sentiment(text: str):
    return sentiment_model(text)[0]
```

---

#### `main.py`

```python
from fastapi import FastAPI
from pydantic import BaseModel
from ml.model import analyze_sentiment

app = FastAPI(title="AI with FastAPI")

class TextRequest(BaseModel):
    text: str

@app.post("/sentiment/")
def get_sentiment(request: TextRequest):
    result = analyze_sentiment(request.text)
    return {"label": result["label"], "score": result["score"]}
```

✅ Now you can run:

```bash
uvicorn main:app --reload
```

And test:

```bash
curl -X POST "http://127.0.0.1:8000/sentiment/" -H "Content-Type: application/json" -d '{"text":"I love FastAPI!"}'
```

---

### 4. Example Use Cases

#### a) **Text Classification (NLP)**

```python
from transformers import pipeline
classifier = pipeline("zero-shot-classification")

@app.post("/classify/")
def classify_text(request: TextRequest):
    labels = ["sports", "politics", "tech", "entertainment"]
    result = classifier(request.text, candidate_labels=labels)
    return result
```

---

#### b) **Image Recognition**

```python
from fastapi import UploadFile, File
from PIL import Image
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet18

model = resnet18(pretrained=True)
model.eval()
transform = transforms.Compose([transforms.Resize(256), transforms.CenterCrop(224), transforms.ToTensor()])

@app.post("/predict-image/")
async def predict_image(file: UploadFile = File(...)):
    image = Image.open(file.file)
    img_tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        outputs = model(img_tensor)
    predicted_class = outputs.argmax().item()
    return {"predicted_class": predicted_class}
```

---

#### c) **Background Tasks for Long AI Jobs**

```python
from fastapi import BackgroundTasks

def long_running_task(text: str):
    result = analyze_sentiment(text)
    with open("results.txt", "a") as f:
        f.write(str(result) + "\n")

@app.post("/async-sentiment/")
def async_sentiment(request: TextRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(long_running_task, request.text)
    return {"message": "Processing in background"}
```

---

#### d) **Streaming AI Responses** (e.g., Chatbot)

```python
from fastapi.responses import StreamingResponse
import time

@app.get("/chatbot/")
async def chatbot():
    async def generate():
        for word in ["Hello", "from", "AI", "FastAPI"]:
            yield word + " "
            time.sleep(0.5)
    return StreamingResponse(generate(), media_type="text/plain")
```

---

### 5. Project Structure

```
project/
│── app/
│   ├── ml/
│   │   ├── model.py         # AI models
│   │   ├── utils.py         # Pre/Post processing
│   │
│   ├── api/
│   │   ├── nlp.py           # Text endpoints
│   │   ├── vision.py        # Image endpoints
│   │
│   ├── main.py              # FastAPI entry
│
│── models/                  # Pre-trained model weights
│── requirements.txt
```

---

### 6. Best Practices

✅ Use **Docker** for reproducible AI environments.

✅ Use **GPU-enabled inference** (e.g., `torch.cuda.is_available()`).

✅ Use **Redis/Kafka** for async model serving.

✅ Use **ONNX Runtime / TorchScript** for optimized inference.

✅ Use **Prometheus/Grafana** to monitor inference latency.

✅ Use **batching** for high-traffic inference.

✅ Offload training to dedicated pipelines → keep FastAPI only for inference.

---

### 7. Scaling AI with FastAPI

- **Serverless** → AWS Lambda + API Gateway for lightweight inference.
- **Containers** → Deploy with Kubernetes for scaling.
- **Model Registry** → Use MLflow for model versioning.
- **Vector Search** → Use Elasticsearch + embeddings for semantic search.
