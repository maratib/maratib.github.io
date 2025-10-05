---
title: Deploy to AWS
slug: guides/python/django/aws_deploy
description: Deploy to AWS
sidebar:
  order: 7
---

# 7. Deploy to AWS - Complete Production Deployment Guide

## Step 1: AWS Account Setup and Prerequisites

### Create AWS Account

- Go to [aws.amazon.com](https://aws.amazon.com/)
- Create account or sign in
- Set up billing alerts in AWS Budgets

### Install AWS CLI

```bash
# On macOS
brew install awscli

# On Ubuntu
sudo apt update
sudo apt install awscli

# On Windows (using Chocolatey)
choco install awscli

# Verify installation
aws --version
```

### Configure AWS CLI

```bash
aws configure
# Enter:
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region: us-east-1
# Default output format: json
```

## Step 2: Prepare Django Application for Production

### Create Production Requirements

#### Create requirements/production.txt

```bash
mkdir requirements
touch requirements/{base.txt,production.txt,development.txt}
```

#### requirements/base.txt

```txt
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
django-filter==23.3
djangorestframework-simplejwt==5.3.0
celery==5.3.4
redis==5.0.1
flower==1.2.0
psycopg2-binary==2.9.7
Pillow==10.0.1
gunicorn==21.2.0
whitenoise==6.6.0
drf-spectacular==0.26.5
python-dotenv==1.0.0
boto3==1.34.0
django-storages==1.14.2
```

#### requirements/production.txt

```txt
-r base.txt
# Production specific packages
sentry-sdk==1.40.0
psutil==5.9.6
defusedxml==0.7.1
python-memcached==1.59
```

### Update Production Settings

#### Create config/settings/production.py

```python
"""
Production settings for Django REST API
"""
import os
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from pathlib import Path
from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# Allowed hosts
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,  # 10 minutes connection persistence
    }
}

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
X_FRAME_OPTIONS = 'DENY'

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files (if using S3)
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# AWS S3 Configuration
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'us-east-1')
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
AWS_DEFAULT_ACL = 'public-read'
AWS_QUERYSTRING_AUTH = False

# Cache configuration
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.getenv('REDIS_URL', 'redis://localhost:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'CONNECTION_POOL_KWARGS': {
                'max_connections': 100,
                'retry_on_timeout': True
            }
        },
        'KEY_PREFIX': 'django_prod'
    }
}

# Celery Configuration
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

# Email configuration (Amazon SES)
EMAIL_BACKEND = 'django
```
