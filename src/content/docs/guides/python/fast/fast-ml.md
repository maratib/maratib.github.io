---
title: Fast ML
slug: guides/python/fast/fast-ml
description: Fast ML
sidebar:
  order: 16
---

**FastAPI with Machine Learning (ML)**

---

### 1. Why FastAPI for ML?

- ✅ **Training → Serving Pipeline**: Train with scikit-learn, serve with FastAPI.
- ✅ **Low Latency**: Async API for fast predictions.
- ✅ **Flexibility**: Works with ML frameworks (Scikit-Learn, XGBoost, LightGBM).
- ✅ **Production Ready**: Add logging, monitoring, and CI/CD easily.
- ✅ **Use Cases**: Predictive analytics, fraud detection, recommendation, demand forecasting.

---

### 2. Setup

```bash
pip install fastapi[all] scikit-learn joblib pandas numpy
```

---

### 3. Training a Simple Model

#### `ml/train.py`

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib

# Sample dataset
data = pd.DataFrame({
    "age": [25, 32, 47, 51, 62],
    "salary": [50000, 60000, 80000, 90000, 120000],
    "purchased": [0, 0, 1, 1, 1]
})

X = data[["age", "salary"]]
y = data["purchased"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Evaluate
preds = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, preds))

# Save model
joblib.dump(model, "ml/model.pkl")
```

---

### 4. Serving the Model with FastAPI

#### `ml/predict.py`

```python
import joblib
import numpy as np

# Load model
model = joblib.load("ml/model.pkl")

def predict_purchase(age: int, salary: float):
    input_data = np.array([[age, salary]])
    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1]
    return {"prediction": int(prediction), "probability": float(probability)}
```

---

#### `main.py`

```python
from fastapi import FastAPI
from pydantic import BaseModel
from ml.predict import predict_purchase

app = FastAPI(title="ML with FastAPI")

class InputData(BaseModel):
    age: int
    salary: float

@app.post("/predict/")
def get_prediction(data: InputData):
    return predict_purchase(data.age, data.salary)
```

---

### 5. Example Endpoints

- **Train Model API (Optional)** → retrain on new data.
- **Predict API** → real-time inference.
- **Batch Prediction API** → upload CSV, return results.

---

### 6. Background Task for Retraining

```python
from fastapi import BackgroundTasks

def retrain_model():
    import subprocess
    subprocess.run(["python", "ml/train.py"])

@app.post("/retrain/")
def retrain(background_tasks: BackgroundTasks):
    background_tasks.add_task(retrain_model)
    return {"message": "Model retraining started"}
```

---

### 7. Project Structure

```
project/
│── app/
│   ├── ml/
│   │   ├── train.py        # Training script
│   │   ├── predict.py      # Prediction logic
│   │   ├── model.pkl       # Saved model
│   │
│   ├── main.py             # FastAPI app
│
│── data/                   # Training datasets
│── requirements.txt
```

---

### 8. Best Practices

✅ Save models with **joblib/pickle**.

✅ Version models → `model_v1.pkl`, `model_v2.pkl`.

✅ Use **background tasks** for retraining.

✅ For large datasets → move training to **Spark/Databricks**.

✅ Use **MLflow** for experiment tracking & model registry.

✅ Containerize with Docker for reproducible ML APIs.

✅ Add **unit tests** for training & prediction pipelines.

---

## 9. Scaling ML with FastAPI

- **Batch Inference** → run with Celery + Redis.
- **Model Monitoring** → track drift, accuracy in production.
- **CI/CD** → Auto-deploy retrained models.
- **Feature Store** → Keep consistent features across training/inference.
- **MLOps** → Use Kubeflow, MLflow, or SageMaker for production ML.
