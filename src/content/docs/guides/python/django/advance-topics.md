---
title: Advance Topics
slug: guides/python/django/advance_topics
description: Advance Topics
sidebar:
  order: 8
---

## Advanced Filtering and Search

### Install Additional Packages

```bash
pip install django-filter djangorestframework-filters
```

### Create Advanced Filters

#### Create api/filters.py

```python
import django_filters
from django_filters import rest_framework as filters
from .models import Product, Category
from django.db.models import Q

class ProductFilter(filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    in_stock = django_filters.BooleanFilter(field_name='in_stock')
    category_name = django_filters.CharFilter(field_name='category__name', lookup_expr='icontains')

    # Search across multiple fields
    search = django_filters.CharFilter(method='filter_search')

    # Ordering filter
    ordering = django_filters.OrderingFilter(
        fields=(
            ('name', 'name'),
            ('price', 'price'),
            ('created_at', 'created_at'),
            ('updated_at', 'updated_at'),
        )
    )

    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'in_stock', 'category']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(description__icontains=value) |
            Q(category__name__icontains=value)
        )

class CategoryFilter(filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    has_products = django_filters.BooleanFilter(method='filter_has_products')
    min_products = django_filters.NumberFilter(method='filter_min_products')

    ordering = django_filters.OrderingFilter(
        fields=(
            ('name', 'name'),
            ('created_at', 'created_at'),
            ('product_count', 'product_count'),
        )
    )

    class Meta:
        model = Category
        fields = ['name']

    def filter_has_products(self, queryset, name, value):
        if value:
            return queryset.filter(products__isnull=False).distinct()
        return queryset.filter(products__isnull=True)

    def filter_min_products(self, queryset, name, value):
        return queryset.annotate(product_count=Count('products')).filter(product_count__gte=value)
```

### Update Views with Advanced Filtering

#### Update api/views.py

```python
from .filters import ProductFilter, CategoryFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Avg, Sum

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.annotate(
        product_count=Count('products'),
        total_value=Sum('products__price')
    )
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CategoryFilter
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at', 'product_count']

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.select_related('category').annotate(
        category_name=models.F('category__name')
    )
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['name', 'price', 'created_at', 'updated_at']

# Advanced Product Statistics View
@api_view(['GET'])
def product_statistics(request):
    """Get comprehensive product statistics"""
    stats = Product.objects.aggregate(
        total_products=Count('id'),
        total_value=Sum('price'),
        average_price=Avg('price'),
        in_stock_count=Count('id', filter=Q(in_stock=True)),
        out_of_stock_count=Count('id', filter=Q(in_stock=False)),
        total_quantity=Sum('quantity')
    )

    # Category-wise statistics
    category_stats = Category.objects.annotate(
        product_count=Count('products'),
        category_value=Sum('products__price'),
        avg_price=Avg('products__price')
    ).values('name', 'product_count', 'category_value', 'avg_price')

    # Price range distribution
    price_ranges = [
        {'range': '0-50', 'count': Product.objects.filter(price__range=(0, 50)).count()},
        {'range': '51-100', 'count': Product.objects.filter(price__range=(51, 100)).count()},
        {'range': '101-200', 'count': Product.objects.filter(price__range=(101, 200)).count()},
        {'range': '201+', 'count': Product.objects.filter(price__gt=200).count()},
    ]

    return Response({
        'overall_statistics': stats,
        'category_statistics': category_stats,
        'price_distribution': price_ranges,
        'generated_at': timezone.now().isoformat()
    })
```

### Update Settings for Advanced Filtering

#### Update config/settings.py

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'SEARCH_PARAM': 'q',
    'ORDERING_PARAM': 'sort',
}
```

## Rate Limiting and Throttling

### Configure Rate Limiting

#### Update config/settings.py

```python
REST_FRAMEWORK = {
    # ... existing settings ...

    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
        'rest_framework.throttling.ScopedRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day',
        'burst': '60/minute',
        'sustained': '1000/day',
        'product_create': '10/day',
        'category_create': '5/day',
    },
}

# Redis-based throttling (optional)
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
```

### Create Custom Throttles

#### Create api/throttles.py

```python
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

class BurstRateThrottle(UserRateThrottle):
    scope = 'burst'

class SustainedRateThrottle(UserRateThrottle):
    scope = 'sustained'

class ProductCreateThrottle(UserRateThrottle):
    scope = 'product_create'

class CategoryCreateThrottle(UserRateThrottle):
    scope = 'category_create'

class HighLoadThrottle(UserRateThrottle):
    # Dynamic throttling based on system load
    def allow_request(self, request, view):
        # Implement custom logic based on system metrics
        if self.get_system_load() > 80:  # 80% load
            self.rate = '10/minute'
            self.num_requests, self.duration = self.parse_rate(self.rate)

        return super().allow_request(request, view)

    def get_system_load(self):
        # Implement system load detection
        # This is a simplified example
        import psutil
        return psutil.cpu_percent(interval=1)
```

### Apply Throttling to Views

#### Update api/views.py

```python
from rest_framework.throttling import UserRateThrottle, ScopedRateThrottle
from .throttles import ProductCreateThrottle, CategoryCreateThrottle

class CategoryListCreateView(generics.ListCreateAPIView):
    # ... existing code ...
    throttle_classes = [UserRateThrottle, CategoryCreateThrottle]

    def get_throttles(self):
        if self.request.method == 'POST':
            return [CategoryCreateThrottle()]
        return [UserRateThrottle()]

class ProductListCreateView(generics.ListCreateAPIView):
    # ... existing code ...
    throttle_classes = [UserRateThrottle, ProductCreateThrottle]

    def get_throttles(self):
        if self.request.method == 'POST':
            return [ProductCreateThrottle()]
        return [UserRateThrottle()]

# Apply different throttling to different endpoints
@api_view(['GET'])
@throttle_classes([UserRateThrottle])
def product_statistics(request):
    # ... existing code ...

@api_view(['POST'])
@throttle_classes([ScopedRateThrottle])
@throttle_scope('product_create')
def bulk_create_products(request):
    """Bulk create products with strict throttling"""
    # Implementation for bulk creation
    pass
```

## Advanced Serializer Features

### Create Advanced Serializers

#### Update api/serializers.py

```python
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Product

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """
    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

class CategorySerializer(DynamicFieldsModelSerializer):
    product_count = serializers.SerializerMethodField()
    total_value = serializers.SerializerMethodField()
    is_popular = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'product_count',
            'total_value', 'is_popular', 'created_at', 'updated_at'
        ]

    def get_product_count(self, obj):
        return obj.products.count()

    def get_total_value(self, obj):
        return sum(product.price for product in obj.products.all())

    def get_is_popular(self, obj):
        return obj.products.count() > 5

class ProductSerializer(DynamicFieldsModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_details = CategorySerializer(source='category', read_only=True)
    price_with_tax = serializers.SerializerMethodField()
    stock_status = serializers.SerializerMethodField()
    discount_price = serializers.SerializerMethodField()

    # Custom validation
    name = serializers.CharField(validators=[
        serializers.RegexValidator(
            regex='^[A-Za-z0-9\s\-_]+$',
            message='Product name can only contain letters, numbers, spaces, hyphens, and underscores'
        )
    ])

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'price_with_tax',
            'discount_price', 'in_stock', 'quantity', 'stock_status',
            'category', 'category_name', 'category_details',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'price': {'min_value': 0},
            'quantity': {'min_value': 0},
        }

    def get_price_with_tax(self, obj):
        # Example: 10% tax
        return round(float(obj.price) * 1.10, 2)

    def get_stock_status(self, obj):
        if obj.quantity == 0:
            return 'out_of_stock'
        elif obj.quantity < 10:
            return 'low_stock'
        else:
            return 'in_stock'

    def get_discount_price(self, obj):
        # Example: 15% discount for products over $100
        if obj.price > 100:
            return round(float(obj.price) * 0.85, 2)
        return None

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        if value > 10000:
            raise serializers.ValidationError("Price seems too high. Please verify.")
        return value

    def validate(self, data):
        # Cross-field validation
        if data.get('quantity', 0) == 0 and data.get('in_stock', False):
            raise serializers.ValidationError({
                'in_stock': 'Product cannot be in stock if quantity is 0.'
            })
        return data

class BulkProductSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        products = [Product(**item) for item in validated_data]
        return Product.objects.bulk_create(products)

    def update(self, instance, validated_data):
        # Bulk update implementation
        pass

class ProductBulkSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        list_serializer_class = BulkProductSerializer

class ProductExportSerializer(serializers.ModelSerializer):
    """Serializer for product data export"""
    category_name = serializers.CharField(source='category.name')
    created_date = serializers.DateTimeField(source='created_at', format='%Y-%m-%d')

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'quantity',
            'in_stock', 'category_name', 'created_date'
        ]
```

## Advanced View Features

### Create Advanced Views

#### Update api/views.py

```python
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.http import HttpResponse
import csv
import json

class ProductViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing product instances.
    """
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    filterset_class = ProductFilter
    throttle_classes = [UserRateThrottle]

    def get_serializer_class(self):
        if self.action == 'create' and isinstance(self.request.data, list):
            return ProductBulkSerializer
        elif self.action == 'list':
            return ProductSerializer
        return super().get_serializer_class()

    def get_serializer(self, *args, **kwargs):
        # Dynamic fields support
        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()

        # Handle fields query parameter
        fields = self.request.query_params.get('fields')
        if fields:
            kwargs['fields'] = fields.split(',')

        return serializer_class(*args, **kwargs)

    @action(detail=False, methods=['get'])
    def export(self, request):
        """Export products to CSV"""
        products = self.filter_queryset(self.get_queryset())
        serializer = ProductExportSerializer(products, many=True)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="products_export.csv"'

        writer = csv.writer(response)
        writer.writerow(['ID', 'Name', 'Description', 'Price', 'Quantity', 'In Stock', 'Category', 'Created Date'])

        for product in serializer.data:
            writer.writerow([
                product['id'],
                product['name'],
                product['description'],
                product['price'],
                product['quantity'],
                'Yes' if product['in_stock'] else 'No',
                product['category_name'],
                product['created_date'],
            ])

        return response

    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate a product"""
        product = self.get_object()
        product.pk = None
        product.name = f"{product.name} (Copy)"
        product.save()

        serializer = self.get_serializer(product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        """Bulk delete products"""
        product_ids = request.data.get('ids', [])
        deleted_count, _ = Product.objects.filter(id__in=product_ids).delete()

        return Response({
            'deleted_count': deleted_count,
            'message': f'Successfully deleted {deleted_count} products'
        })

    @action(detail=False, methods=['get'])
    def price_ranges(self, request):
        """Get price range statistics"""
        stats = Product.objects.aggregate(
            min_price=Min('price'),
            max_price=Max('price'),
            avg_price=Avg('price'),
            median_price=Percentile('price', 0.5)
        )

        return Response(stats)

class AdvancedCategoryView(APIView):
    """
    Advanced category operations
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def get(self, request, format=None):
        # Complex aggregation
        from django.db.models import Count, Avg, Sum

        categories = Category.objects.annotate(
            product_count=Count('products'),
            total_value=Sum('products__price'),
            avg_price=Avg('products__price'),
            low_stock_count=Count('products', filter=Q(products__quantity__lt=10)),
            out_of_stock_count=Count('products', filter=Q(products__quantity=0))
        )

        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        # Bulk category creation
        serializer = CategorySerializer(data=request.data, many=isinstance(request.data, list))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Data Export Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_products_json(request):
    """Export products as JSON"""
    products = Product.objects.select_related('category').all()
    serializer = ProductExportSerializer(products, many=True)

    response = HttpResponse(
        json.dumps(serializer.data, indent=2),
        content_type='application/json'
    )
    response['Content-Disposition'] = 'attachment; filename="products_export.json"'
    return response

@api_view(['GET'])
def api_health_check(request):
    """Comprehensive API health check"""
    from django.db import connection
    from django.core.cache import cache
    import redis
    import psutil
    import os

    health_data = {
        'status': 'healthy',
        'timestamp': timezone.now().isoformat(),
        'version': '1.0.0',
    }

    # Database health
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        health_data['database'] = 'connected'
    except Exception as e:
        health_data['database'] = 'error'
        health_data['status'] = 'degraded'
        health_data['database_error'] = str(e)

    # Cache health
    try:
        cache.set('health_check', 'ok', 5)
        health_data['cache'] = 'connected' if cache.get('health_check') == 'ok' else 'error'
    except Exception as e:
        health_data['cache'] = 'error'
        health_data['status'] = 'degraded'
        health_data['cache_error'] = str(e)

    # System resources
    health_data['system'] = {
        'cpu_percent': psutil.cpu_percent(),
        'memory_percent': psutil.virtual_memory().percent,
        'disk_usage': psutil.disk_usage('/').percent,
    }

    # Application metrics
    health_data['metrics'] = {
        'total_products': Product.objects.count(),
        'total_categories': Category.objects.count(),
        'total_users': User.objects.count(),
    }

    status_code = 200 if health_data['status'] == 'healthy' else 503
    return Response(health_data, status=status_code)
```

## Update URLs for Advanced Features

### Update api/urls.py

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, AdvancedCategoryView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    # API overview
    path('', views.api_overview, name='api-overview'),

    # Health check
    path('health/', views.api_health_check, name='api-health'),

    # Router URLs
    path('', include(router.urls)),

    # Category URLs
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/advanced/', AdvancedCategoryView.as_view(), name='category-advanced'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('categories/<int:category_id>/products/', views.category_products, name='category-products'),

    # Statistics and exports
    path('statistics/products/', views.product_statistics, name='product-statistics'),
    path('export/products/json/', views.export_products_json, name='export-products-json'),

    # Authentication URLs
    path('auth/register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('auth/profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('auth/protected/', views.protected_view, name='protected-view'),

    # Cache management
    path('cache/clear/', views.clear_cache, name='clear-cache'),
    path('cache/stats/', views.cache_stats, name='cache-stats'),

    # Task management
    path('tasks/update-prices/', views.trigger_price_update, name='update-prices'),
    path('tasks/generate-report/', views.trigger_category_report, name='generate-report'),
    path('tasks/status/<str:task_id>/', views.get_task_status, name='task-status'),
]
```

## Performance Optimization

### Database Optimization

#### Create api/query_utils.py

```python
from django.db import models
from django.db.models import Prefetch

class ProductQuerySet(models.QuerySet):
    def with_optimized_relations(self):
        return self.select_related('category').prefetch_related(
            Prefetch('category__products',
                    queryset=Product.objects.only('id', 'name', 'price'))
        )

    def for_list_display(self):
        return self.only(
            'id', 'name', 'price', 'in_stock', 'quantity',
            'category__name', 'created_at'
        )

    def with_aggregates(self):
        from django.db.models import Count, Avg
        return self.annotate(
            similar_products_count=Count('category__products'),
            category_avg_price=Avg('category__products__price')
        )

class ProductManager(models.Manager):
    def get_queryset(self):
        return ProductQuerySet(self.model, using=self._db)

    def optimized_list(self):
        return self.get_queryset().with_optimized_relations().for_list_display()

    def with_statistics(self):
        return self.get_queryset().with_optimized_relations().with_aggregates()
```

### Update Models with Optimized Managers

#### Update api/models.py

```python
from .query_utils import ProductManager

class Product(models.Model):
    # ... existing fields ...

    objects = ProductManager()

    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['price']),
            models.Index(fields=['category', 'in_stock']),
            models.Index(fields=['created_at']),
        ]

class Category(models.Model):
    # ... existing fields ...

    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['created_at']),
        ]
```

### Update Views for Performance

#### Update api/views.py

```python
class ProductListCreateView(generics.ListCreateAPIView):
    def get_queryset(self):
        # Use optimized queryset based on action
        if self.request.method == 'GET':
            return Product.objects.optimized_list()
        return Product.objects.all()

    def get_serializer_class(self):
        # Use lightweight serializer for lists
        if self.request.method == 'GET' and not self.request.query_params.get('detailed'):
            return ProductListSerializer  # Create a lightweight version
        return super().get_serializer_class()
```

## Testing the Advanced Features

### Test Advanced Filtering

```bash
# Search across multiple fields
curl "http://127.0.0.1:8000/api/products/?search=electronic"

# Price range filtering
curl "http://127.0.0.1:8000/api/products/?min_price=50&max_price=200"

# Multiple field filtering
curl "http://127.0.0.1:8000/api/products/?in_stock=true&category_name=Electronics"

# Dynamic fields
curl "http://127.0.0.1:8000/api/products/?fields=id,name,price,category_name"

# Ordering
curl "http://127.0.0.1:8000/api/products/?ordering=-price"
```

### Test Rate Limiting

```bash
# Test throttling (make multiple rapid requests)
for i in {1..15}; do
  curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:8000/api/products/"
done
```

### Test Export Features

```bash
# Export products to CSV
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  "http://127.0.0.1:8000/api/products/export/" -o products.csv

# Export to JSON
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  "http://127.0.0.1:8000/api/export/products/json/" -o products.json
```

### Test Health Check

```bash
curl "http://127.0.0.1:8000/api/health/"
```

### Test Bulk Operations

```bash
# Bulk delete products
curl -X POST "http://127.0.0.1:8000/api/products/bulk_delete/" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ids": [1, 2, 3]}'

# Duplicate product
curl -X POST "http://127.0.0.1:8000/api/products/1/duplicate/" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```
