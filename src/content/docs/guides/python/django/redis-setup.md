---
title: Redis Setup
slug: guides/python/django/redis_setup
description: Redis Setup
sidebar:
  order: 4
---

# 3. Redis Caching Setup

## Step 1: Install Redis and Python Client

### Install Redis (Ubuntu/Linux)

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

### Install Redis (macOS)

```bash
brew install redis
brew services start redis
```

### Install Redis (Windows)

Download from [Microsoft Archive](https://github.com/microsoftarchive/redis/releases)

### Install Python Redis client

```bash
pip install redis django-redis
```

## Step 2: Configure Redis in Django Settings

### Update config/settings.py

```python
# Cache configuration
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'KEY_PREFIX': 'django_rest_api'
    }
}

# Session engine (optional)
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'

# Cache timeout settings
CACHE_TTL = 60 * 15  # 15 minutes

# Add to REST_FRAMEWORK configuration
REST_FRAMEWORK = {
    # ... existing settings ...
    'DEFAULT_CACHE_RESPONSE_TIMEOUT': 60 * 15,  # 15 minutes
}
```

## Step 3: Create Cache Utilities

### Create api/cache_utils.py

```python
from django.core.cache import cache
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class CacheManager:
    @staticmethod
    def get_cache_key(model_name, identifier, suffix=None):
        """Generate consistent cache keys"""
        key = f"{model_name}_{identifier}"
        if suffix:
            key += f"_{suffix}"
        return key

    @staticmethod
    def invalidate_pattern(pattern):
        """Invalidate cache keys matching pattern"""
        try:
            keys = cache.keys(pattern)
            if keys:
                cache.delete_many(keys)
                logger.info(f"Invalidated {len(keys)} cache keys with pattern: {pattern}")
        except Exception as e:
            logger.error(f"Error invalidating cache pattern {pattern}: {str(e)}")

    @staticmethod
    def invalidate_model_cache(model_name, instance_id=None):
        """Invalidate cache for specific model"""
        if instance_id:
            pattern = f"*{model_name}_{instance_id}*"
        else:
            pattern = f"*{model_name}_*"
        CacheManager.invalidate_pattern(pattern)

def cache_response(timeout=settings.CACHE_TTL):
    """Decorator to cache API responses"""
    def decorator(func):
        def wrapper(self, *args, **kwargs):
            # Generate cache key based on request
            request = args[0]
            cache_key = f"api_{func.__name__}_{request.method}_{request.get_full_path()}"

            # Try to get from cache
            cached_response = cache.get(cache_key)
            if cached_response is not None:
                return cached_response

            # Execute function and cache result
            response = func(self, *args, **kwargs)
            if response.status_code == 200:
                cache.set(cache_key, response, timeout)

            return response
        return wrapper
    return decorator
```

## Step 4: Implement Cached Views

### Update api/views.py

```python
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
from .cache_utils import cache_response, CacheManager

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    @method_decorator(vary_on_headers("Authorization", "Cookie"))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        instance = serializer.save()
        # Invalidate cache after creation
        CacheManager.invalidate_model_cache('category')

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    @method_decorator(cache_page(60 * 15))
    @method_decorator(vary_on_headers("Authorization", "Cookie"))
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def perform_update(self, serializer):
        instance = serializer.save()
        CacheManager.invalidate_model_cache('category', instance.id)

    def perform_destroy(self, instance):
        instance_id = instance.id
        instance.delete()
        CacheManager.invalidate_model_cache('category', instance_id)

# Create a cached API view
@api_view(['GET'])
@cache_page(60 * 10)  # Cache for 10 minutes
def cached_categories(request):
    """Cached categories view with statistics"""
    from django.db.models import Count, Avg
    from django.core.cache import cache

    cache_key = "cached_categories_stats"
    cached_data = cache.get(cache_key)

    if cached_data is None:
        categories = Category.objects.annotate(
            product_count=Count('products'),
            avg_price=Avg('products__price')
        )
        serializer = CategorySerializer(categories, many=True)

        data = {
            'categories': serializer.data,
            'total_categories': categories.count(),
            'timestamp': timezone.now().isoformat()
        }

        # Cache for 10 minutes
        cache.set(cache_key, data, 60 * 10)
        cached_data = data

    return Response(cached_data)
```

## Step 5: Add Cache Management Endpoints

### Add to api/views.py

```python
from django.core.cache import cache
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes([IsAdminUser])
def clear_cache(request):
    """Clear entire cache (admin only)"""
    try:
        cache.clear()
        return Response({
            'message': 'Cache cleared successfully',
            'status': 'success'
        })
    except Exception as e:
        return Response({
            'message': f'Error clearing cache: {str(e)}',
            'status': 'error'
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def cache_stats(request):
    """Get cache statistics (admin only)"""
    try:
        # This requires redis-py
        import redis
        r = redis.Redis(host='localhost', port=6379, db=1)

        info = r.info()
        stats = {
            'connected_clients': info.get('connected_clients', 0),
            'used_memory': info.get('used_memory_human', '0'),
            'keyspace_hits': info.get('keyspace_hits', 0),
            'keyspace_misses': info.get('keyspace_misses', 0),
            'total_commands_processed': info.get('total_commands_processed', 0),
        }

        # Calculate hit rate
        hits = stats['keyspace_hits']
        misses = stats['keyspace_misses']
        total = hits + misses
        stats['hit_rate'] = round((hits / total * 100), 2) if total > 0 else 0

        return Response(stats)
    except Exception as e:
        return Response({
            'error': f'Could not get cache stats: {str(e)}'
        }, status=500)
```

## Step 6: Update URLs

### Add to api/urls.py

```python
path('cache/clear/', views.clear_cache, name='clear-cache'),
path('cache/stats/', views.cache_stats, name='cache-stats'),
path('categories/cached/', views.cached_categories, name='cached-categories'),
```

## Step 7: Test Caching

### Test Cached Endpoints

```bash
# Test cached categories
curl http://127.0.0.1:8000/api/categories/cached/

# Test cache stats (requires admin token)
ACCESS_TOKEN="your-admin-access-token"
curl http://127.0.0.1:8000/api/cache/stats/ \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Clear cache (admin only)
curl -X POST http://127.0.0.1:8000/api/cache/clear/ \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## Step 8: Monitor Redis

### Install Redis CLI tools

```bash
# Monitor Redis in real-time
redis-cli monitor

# Check Redis info
redis-cli info

# Check memory usage
redis-cli info memory

# Check keys
redis-cli keys "*"
```

---
