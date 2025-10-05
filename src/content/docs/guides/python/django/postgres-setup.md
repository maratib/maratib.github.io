---
title: Postgres Setup
slug: guides/python/django/postgres_setup
description: Postgres Setup
sidebar:
  order: 2
---

# 1. PostgreSQL Database Setup

## Step 1: Install PostgreSQL and Dependencies

### Install PostgreSQL (Ubuntu/Linux)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Install PostgreSQL (macOS)

```bash
brew install postgresql
brew services start postgresql
```

### Install PostgreSQL (Windows)

Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### Install Python PostgreSQL adapter

```bash
pip install psycopg2-binary
# or for better performance:
pip install psycopg2
```

## Step 2: Database Configuration

### Create Database and User

```bash
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE djangorestapi;
CREATE USER django_user WITH PASSWORD 'securepassword123';
ALTER ROLE django_user SET client_encoding TO 'utf8';
ALTER ROLE django_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE django_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE djangorestapi TO django_user;
\q
```

## Step 3: Update Django Settings

### Modify config/settings.py

```python
import os
from pathlib import Path

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'djangorestapi',
        'USER': 'django_user',
        'PASSWORD': 'securepassword123',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Alternatively, use environment variables for security
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'djangorestapi'),
        'USER': os.getenv('DB_USER', 'django_user'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'securepassword123'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

## Step 4: Environment Variables Setup

### Create .env file

```bash
# Create .env file in project root
touch .env
```

### Add environment variables to .env

```env
DEBUG=True
SECRET_KEY=your-super-secret-key-here-make-it-very-long-and-random
DB_NAME=djangorestapi
DB_USER=django_user
DB_PASSWORD=securepassword123
DB_HOST=localhost
DB_PORT=5432
```

### Install python-dotenv

```bash
pip install python-dotenv
```

### Update settings.py to use environment variables

```python
from pathlib import Path
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key-for-dev')

DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}
```

## Step 5: Migrate to PostgreSQL

```bash
# Create new migrations
python manage.py makemigrations

# Apply migrations to PostgreSQL
python manage.py migrate

# Create superuser for new database
python manage.py createsuperuser
```

## Step 6: Test Database Connection

### Create a test view to verify database

```python
# api/views.py
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def database_info(request):
    """View to check database connection info"""
    with connection.cursor() as cursor:
        cursor.execute("SELECT version(), current_database(), current_user")
        row = cursor.fetchone()

    info = {
        'database_version': row[0],
        'database_name': row[1],
        'database_user': row[2],
        'connected': True
    }

    return Response(info)
```

### Add to api/urls.py

```python
path('database-info/', views.database_info, name='database-info'),
```

### Test the connection

```bash
curl http://127.0.0.1:8000/api/database-info/
```
