---
title: Django Basics
slug: guides/python/django/django-basics
description: Django Basics
sidebar:
  order: 1
---

## Project Setup and Virtual Environment

### Create Virtual Environment

```bash
mkdir django-rest-api-project
cd django-rest-api-project

python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Install Required Packages

```bash
pip install django djangorestframework django-cors-headers pillow
pip install pyyaml uritemplate
```

## Create Django Project and App

### Initialize Project

```bash
django-admin startproject config .
python manage.py startapp api
```

### Project Structure

```
django-rest-api-project/
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── api/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
│   └── urls.py
├── manage.py
└── requirements.txt
```

## Configure Django Settings

<details>
<summary> Update config/settings.py </summary>

```python
"""
Django settings for config project.
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'your-secret-key-here'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party apps
    'rest_framework',
    'corsheaders',

    # Local apps
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

</details>

## Create Models

### Update api/models.py

```python
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(
        Category,
        related_name='products',
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    in_stock = models.BooleanField(default=True)
    quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name
```

## Create Serializers

### Create api/serializers.py

```python
from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'product_count', 'created_at', 'updated_at']

    def get_product_count(self, obj):
        return obj.products.count()

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price',
            'in_stock', 'quantity', 'category', 'category_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class ProductDetailSerializer(ProductSerializer):
    # Extended serializer for detailed product view
    category_details = CategorySerializer(source='category', read_only=True)

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['category_details']
```

## Create Views

### Update api/views.py

```python
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer, ProductDetailSerializer

# Category Views
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# Product Views
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'in_stock']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProductDetailSerializer
        return ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related('category').all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProductDetailSerializer
        return ProductSerializer

# Custom API Views
@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'Categories': '/api/categories/',
        'Products': '/api/products/',
        'Admin': '/admin/',
    }
    return Response(api_urls)

@api_view(['GET'])
def category_products(request, category_id):
    try:
        category = Category.objects.get(id=category_id)
        products = category.products.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response(
            {'error': 'Category not found'},
            status=status.HTTP_404_NOT_FOUND
        )
```

## Configure URLs

### Create api/urls.py

```python
from django.urls import path
from . import views

urlpatterns = [
    # API overview
    path('', views.api_overview, name='api-overview'),

    # Category URLs
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('categories/<int:category_id>/products/', views.category_products, name='category-products'),

    # Product URLs
    path('products/', views.ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
]
```

### Update config/urls.py

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
```

## Register Models in Admin

### Update api/admin.py

```python
from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']
    list_filter = ['created_at']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'in_stock', 'quantity', 'created_at']
    list_filter = ['category', 'in_stock', 'created_at']
    search_fields = ['name', 'description']
    raw_id_fields = ['category']
    list_editable = ['price', 'in_stock', 'quantity']
```

## Create Migrations and Run Server

### Create and Apply Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin user.

### Run Development Server

```bash
python manage.py runserver
```

## Testing the API

### Test Endpoints with curl or Postman

#### 1. API Overview

```bash
curl http://127.0.0.1:8000/api/
```

#### 2. Create a Category

```bash
curl -X POST http://127.0.0.1:8000/api/categories/ \
-H "Content-Type: application/json" \
-d '{"name": "Electronics", "description": "Electronic devices and accessories"}'
```

#### 3. Get All Categories

```bash
curl http://127.0.0.1:8000/api/categories/
```

#### 4. Create a Product

```bash
curl -X POST http://127.0.0.1:8000/api/products/ \
-H "Content-Type: application/json" \
-d '{
  "name": "Smartphone",
  "description": "Latest smartphone with advanced features",
  "price": "699.99",
  "in_stock": true,
  "quantity": 50,
  "category": 1
}'
```

#### 5. Get All Products

```bash
curl http://127.0.0.1:8000/api/products/
```

## Advanced Features

### Add Pagination (Update settings.py)

```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}
```

### Install django-filter

```bash
pip install django-filter
```

Add to INSTALLED_APPS:

```python
INSTALLED_APPS = [
    # ...
    'django_filters',
]
```

### Create Custom Permissions

Create `api/permissions.py`:

```python
from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to admin users
        return request.user and request.user.is_staff
```

Update views to use custom permissions:

```python
from .permissions import IsAdminOrReadOnly

class CategoryListCreateView(generics.ListCreateAPIView):
    # ...
    permission_classes = [IsAdminOrReadOnly]
```

## Error Handling and Validation

### Create Custom Exception Handler

Update `config/settings.py`:

```python
REST_FRAMEWORK = {
    # ...
    'EXCEPTION_HANDLER': 'rest_framework.views.exception_handler',
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}
```

### Add Model Validation

Update `api/models.py`:

```python
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class Product(models.Model):
    # ... existing fields ...

    def clean(self):
        if self.quantity < 0:
            raise ValidationError({
                'quantity': _('Quantity cannot be negative.')
            })

        if self.price < 0:
            raise ValidationError({
                'price': _('Price cannot be negative.')
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
```

## API Documentation

### Install DRF Spectacular for OpenAPI documentation

```bash
pip install drf-spectacular
```

### Update settings.py

```python
INSTALLED_APPS = [
    # ...
    'drf_spectacular',
]

REST_FRAMEWORK = {
    # ...
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Django REST API',
    'DESCRIPTION': 'A complete Django REST API example',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}
```

### Update config/urls.py

```python
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    # ...
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
```

## Testing

### Create tests in api/tests.py

```python
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Category, Product

class CategoryTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name="Test Category",
            description="Test Description"
        )

    def test_create_category(self):
        url = reverse('category-list-create')
        data = {
            'name': 'New Category',
            'description': 'New Description'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2)

    def test_get_categories(self):
        url = reverse('category-list-create')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

class ProductTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name="Test Category",
            description="Test Description"
        )
        self.product = Product.objects.create(
            category=self.category,
            name="Test Product",
            description="Test Description",
            price=99.99,
            in_stock=True,
            quantity=10
        )

    def test_get_products(self):
        url = reverse('product-list-create')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

# Run tests with:
# python manage.py test
```

## Production Readiness

### Environment Variables

Create `.env` file:

```
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
```

### Update settings for production

```python
import os
from pathlib import Path

# Load environment variables
DEBUG = os.getenv('DEBUG', 'False') == 'True'
SECRET_KEY = os.getenv('SECRET_KEY', 'your-fallback-secret-key')
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# Security settings for production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
```

## Final Project Structure

```
django-rest-api-project/
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── api/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── permissions.py
│   ├── tests.py
│   ├── views.py
│   └── urls.py
├── venv/
├── db.sqlite3
├── manage.py
└── requirements.txt
```

## Next Steps

1. **Database**: Switch to PostgreSQL for production
2. **Authentication**: Add JWT or Token authentication
3. **Caching**: Implement Redis for caching
4. **Celery**: Add background tasks
5. **Docker**: Containerize your application
6. **Deployment**: Deploy to AWS, Heroku, or DigitalOcean
