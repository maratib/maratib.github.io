---
title: Celery Setup
slug: guides/python/django/celery_setup
description: Celery Setup
sidebar:
  order: 5
---

# 4. Celery Background Tasks Setup

## Step 1: Install Celery and Redis

```bash
pip install celery redis flower
```

## Step 2: Configure Celery

### Create config/celery.py

```python
import os
from celery import Celery

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
```

### Update config/**init**.py

```python
from .celery import app as celery_app

__all__ = ('celery_app',)
```

## Step 3: Configure Celery in Settings

### Update config/settings.py

```python
# Celery Configuration
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'
CELERY_ENABLE_UTC = True

# Task specific settings
CELERY_TASK_ALWAYS_EAGER = False  # Set to True for testing without worker
CELERY_TASK_EAGER_PROPAGATES = True
```

## Step 4: Create Tasks

### Create api/tasks.py

```python
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import Product, Category
import logging
import time

logger = logging.getLogger(__name__)

@shared_task
def send_product_notification(product_id, subject, message):
    """Send notification about product changes"""
    try:
        product = Product.objects.get(id=product_id)

        # Simulate sending email (configure email settings first)
        # send_mail(
        #     subject,
        #     f"{message}\n\nProduct: {product.name}\nPrice: ${product.price}",
        #     settings.DEFAULT_FROM_EMAIL,
        #     ['admin@example.com'],
        #     fail_silently=False,
        # )

        logger.info(f"Notification sent for product: {product.name}")
        return f"Notification sent for {product.name}"

    except Product.DoesNotExist:
        logger.error(f"Product with id {product_id} not found")
        return "Product not found"

@shared_task
def update_product_prices(percentage_increase):
    """Update all product prices by percentage (background task)"""
    try:
        products = Product.objects.all()
        updated_count = 0

        for product in products:
            old_price = product.price
            new_price = old_price * (1 + percentage_increase / 100)
            product.price = new_price
            product.save()
            updated_count += 1

            # Log each update
            logger.info(f"Updated {product.name}: ${old_price} -> ${new_price}")

        return f"Updated {updated_count} products with {percentage_increase}% increase"

    except Exception as e:
        logger.error(f"Error updating prices: {str(e)}")
        raise

@shared_task
def generate_category_report():
    """Generate a report of categories and their products"""
    try:
        categories = Category.objects.prefetch_related('products').all()
        report_data = []

        for category in categories:
            product_count = category.products.count()
            total_value = sum(product.price * product.quantity for product in category.products.all())

            report_data.append({
                'category': category.name,
                'product_count': product_count,
                'total_value': round(total_value, 2),
                'average_price': round(total_value / product_count, 2) if product_count > 0 else 0
            })

        # Simulate report generation time
        time.sleep(5)

        logger.info(f"Generated report for {len(report_data)} categories")
        return report_data

    except Exception as e:
        logger.error(f"Error generating category report: {str(e)}")
        raise

@shared_task
def cleanup_old_data(days_old=30):
    """Clean up old data (example task)"""
    from django.utils import timezone
    from datetime import timedelta

    cutoff_date = timezone.now() - timedelta(days=days_old)

    # Example: Archive or delete old data
    # This is just a template - implement based on your needs
    deleted_count = 0

    logger.info(f"Cleanup completed. Deleted {deleted_count} old records.")
    return f"Cleaned up {deleted_count} records older than {days_old} days"

@shared_task(bind=True)
def long_running_task(self, items):
    """Example of a long-running task with progress tracking"""
    total_items = len(items)
    results = []

    for i, item in enumerate(items):
        # Simulate work
        time.sleep(2)

        # Update task state
        self.update_state(
            state='PROGRESS',
            meta={
                'current': i + 1,
                'total': total_items,
                'percent': int((i + 1) / total_items * 100),
                'status': f'Processing item {i + 1} of {total_items}'
            }
        )

        results.append(f"Processed: {item}")

    return {
        'total_processed': total_items,
        'results': results,
        'status': 'Completed successfully'
    }
```

## Step 5: Create Task Management Views

### Update api/views.py

```python
from .tasks import (
    send_product_notification,
    update_product_prices,
    generate_category_report,
    long_running_task,
    cleanup_old_data
)
from celery.result import AsyncResult

@api_view(['POST'])
@permission_classes([IsAdminUser])
def trigger_price_update(request):
    """Trigger background task to update prices"""
    percentage = request.data.get('percentage', 10)

    task = update_product_prices.delay(percentage)

    return Response({
        'task_id': task.id,
        'status': 'Task started',
        'message': f'Price update task initiated with {percentage}% increase'
    })

@api_view(['POST'])
@permission_classes([IsAdminUser])
def trigger_category_report(request):
    """Trigger background task to generate category report"""
    task = generate_category_report.delay()

    return Response({
        'task_id': task.id,
        'status': 'Task started',
        'message': 'Category report generation started'
    })

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_task_status(request, task_id):
    """Check status of a Celery task"""
    task_result = AsyncResult(task_id)

    response_data = {
        'task_id': task_id,
        'status': task_result.status,
    }

    if task_result.status == 'SUCCESS':
        response_data['result'] = task_result.result
    elif task_result.status == 'FAILURE':
        response_data['error'] = str(task_result.result)
    elif task_result.status == 'PROGRESS':
        response_data['progress'] = task_result.result

    return Response(response_data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def trigger_long_task(request):
    """Trigger a long-running task with progress tracking"""
    items = request.data.get('items', ['item1', 'item2', 'item3', 'item4', 'item5'])

    task = long_running_task.delay(items)

    return Response({
        'task_id': task.id,
        'status': 'Long-running task started',
        'items_count': len(items),
        'estimated_time': f'{len(items) * 2} seconds'
    })
```

## Step 6: Update URLs

### Add to api/urls.py

```python
# Task management URLs
path('tasks/update-prices/', views.trigger_price_update, name='update-prices'),
path('tasks/generate-report/', views.trigger_category_report, name='generate-report'),
path('tasks/long-task/', views.trigger_long_task, name='long-task'),
path('tasks/status/<str:task_id>/', views.get_task_status, name='task-status'),
```

## Step 7: Start Celery Worker

### Create celery.sh script

```bash
#!/bin/bash
# celery.sh

echo "Starting Celery Worker..."
celery -A config worker --loglevel=info
```

### Make executable and run

```bash
chmod +x celery.sh
./celery.sh
```

### Alternatively, run directly:

```bash
celery -A config worker --loglevel=info
```

## Step 8: Start Flower for Monitoring

```bash
celery -A config flower --port=5555
```

Access Flower at: http: //localhost:5555

## Step 9: Test Celery Tasks

### Test Price Update Task

```bash
ACCESS_TOKEN="your-admin-access-token"

curl -X POST http://127.0.0.1:8000/api/tasks/update-prices/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"percentage": 5}'
```

### Check Task Status

```bash
# Use the task_id from previous response
TASK_ID="your-task-id-here"

curl http://127.0.0.1:8000/api/tasks/status/$TASK_ID/ \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### Test Long Running Task

```bash
curl -X POST http://127.0.0.1:8000/api/tasks/long-task/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"items": ["apple", "banana", "cherry", "date", "elderberry"]}'
```

---
