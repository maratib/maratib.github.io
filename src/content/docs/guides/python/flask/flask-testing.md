---
title: Flask Testing
slug: guides/python/flask-testing
description: Flask Testing
sidebar:
  order: 1
---

Pytest with Flask REST API - Complete Testing Guide

## 1. Project Setup and Dependencies

```bash
# Install required packages
pip install flask flask-sqlalchemy flask-marshmallow marshmallow-sqlalchemy pytest pytest-flask pytest-cov requests

# Create requirements.txt
cat > requirements.txt << EOF
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-Marshmallow==0.14.0
marshmallow-sqlalchemy==0.29.0
pytest==7.4.2
pytest-flask==1.3.0
pytest-cov==4.1.0
requests==2.31.0
EOF
```

## 2. Project Structure

```
flask_api/
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── schemas.py
│   ├── routes.py
│   └── utils.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_models.py
│   ├── test_routes.py
│   ├── test_schemas.py
│   ├── test_factory.py
│   └── fixtures/
│       └── sample_data.py
├── config.py
├── pytest.ini
└── run.py
```

## 3. Flask REST API Application

```python
# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()

def create_app(test_config=None):
    app = Flask(__name__)

    if test_config:
        app.config.update(test_config)
    else:
        app.config.from_object('config.Config')

    db.init_app(app)
    ma.init_app(app)

    from app.routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
```

```python
# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TESTING = False

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False
```

```python
# app/models.py
from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
```

```python
# app/schemas.py
from app import ma
from app.models import User, Post

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_fk = True

class PostSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Post
        include_fk = True

    author = ma.Nested(UserSchema)

user_schema = UserSchema()
users_schema = UserSchema(many=True)
post_schema = PostSchema()
posts_schema = PostSchema(many=True)
```

```python
# app/routes.py
from flask import Blueprint, request, jsonify
from app import db
from app.models import User, Post
from app.schemas import user_schema, users_schema, post_schema, posts_schema

api_bp = Blueprint('api', __name__)

# User routes
@api_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return users_schema.jsonify(users)

@api_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return user_schema.jsonify(user)

@api_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400

    user = User(username=data['username'], email=data['email'])
    db.session.add(user)
    db.session.commit()

    return user_schema.jsonify(user), 201

@api_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']

    db.session.commit()
    return user_schema.jsonify(user)

@api_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})

# Post routes
@api_bp.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return posts_schema.jsonify(posts)

@api_bp.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json()

    if not User.query.get(data['user_id']):
        return jsonify({'error': 'User not found'}), 400

    post = Post(title=data['title'], content=data['content'], user_id=data['user_id'])
    db.session.add(post)
    db.session.commit()

    return post_schema.jsonify(post), 201
```

## 4. Pytest Configuration

```ini
# pytest.ini
[tool:pytest]
testpaths = tests
addopts =
    --verbose
    --color=yes
    --cov=app
    --cov-report=html
    --cov-report=term-missing
python_files = test_*.py
python_classes = Test*
python_functions = test_*
```

## 5. Test Setup and Fixtures

```python
# tests/conftest.py
import pytest
from app import create_app, db as _db
from app.models import User, Post
from config import TestConfig

@pytest.fixture(scope='session')
def app():
    """Create application for the tests."""
    app = create_app(TestConfig)

    with app.app_context():
        _db.create_all()

    yield app

    # Clean up
    with app.app_context():
        _db.drop_all()

@pytest.fixture(scope='function')
def client(app):
    """Create test client."""
    return app.test_client()

@pytest.fixture(scope='function')
def db(app):
    """Create database for the tests."""
    with app.app_context():
        _db.create_all()

    yield _db

    # Clean up after each test
    with app.app_context():
        _db.session.remove()
        _db.drop_all()

@pytest.fixture
def init_database(db):
    """Initialize database with sample data."""
    user1 = User(username='testuser1', email='test1@example.com')
    user2 = User(username='testuser2', email='test2@example.com')
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    post1 = Post(title='First Post', content='Content 1', user_id=user1.id)
    post2 = Post(title='Second Post', content='Content 2', user_id=user2.id)
    db.session.add(post1)
    db.session.add(post2)
    db.session.commit()

    return db

@pytest.fixture
def auth_headers():
    """Return authentication headers (if needed)."""
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

@pytest.fixture
def sample_user_data():
    return {
        'username': 'newuser',
        'email': 'newuser@example.com'
    }

@pytest.fixture
def sample_post_data():
    return {
        'title': 'Test Post',
        'content': 'This is a test post content',
        'user_id': 1
    }
```

## 6. Model Tests

```python
# tests/test_models.py
import pytest
from app.models import User, Post
from app import db

class TestUserModel:
    def test_create_user(self, db):
        """Test user creation."""
        user = User(username='testuser', email='test@example.com')
        db.session.add(user)
        db.session.commit()

        assert user.id is not None
        assert user.username == 'testuser'
        assert user.email == 'test@example.com'
        assert str(user) == '<User testuser>'

    def test_user_relationship(self, db):
        """Test user-post relationship."""
        user = User(username='testuser', email='test@example.com')
        post = Post(title='Test Post', content='Content', user_id=user.id)

        user.posts.append(post)
        db.session.add(user)
        db.session.commit()

        assert len(user.posts) == 1
        assert user.posts[0].title == 'Test Post'
        assert post.author == user

    def test_unique_constraints(self, db):
        """Test unique constraints on username and email."""
        user1 = User(username='uniqueuser', email='unique@example.com')
        db.session.add(user1)
        db.session.commit()

        # Test duplicate username
        user2 = User(username='uniqueuser', email='different@example.com')
        db.session.add(user2)
        with pytest.raises(Exception):
            db.session.commit()

        db.session.rollback()

        # Test duplicate email
        user3 = User(username='differentuser', email='unique@example.com')
        db.session.add(user3)
        with pytest.raises(Exception):
            db.session.commit()

class TestPostModel:
    def test_create_post(self, db):
        """Test post creation."""
        user = User(username='author', email='author@example.com')
        db.session.add(user)
        db.session.commit()

        post = Post(title='Test Post', content='Test Content', user_id=user.id)
        db.session.add(post)
        db.session.commit()

        assert post.id is not None
        assert post.title == 'Test Post'
        assert post.content == 'Test Content'
        assert post.user_id == user.id
        assert str(post) == '<Post Test Post>'
```

## 7. Route Tests - User Endpoints

```python
# tests/test_routes.py
import pytest
import json
from app.models import User, Post

class TestUserRoutes:
    def test_get_users_empty(self, client, db):
        """Test getting users when database is empty."""
        response = client.get('/api/users')
        assert response.status_code == 200
        assert response.json == []

    def test_get_users_with_data(self, client, init_database):
        """Test getting users with data."""
        response = client.get('/api/users')
        assert response.status_code == 200
        assert len(response.json) == 2
        assert response.json[0]['username'] == 'testuser1'

    def test_get_user_success(self, client, init_database):
        """Test getting a specific user."""
        response = client.get('/api/users/1')
        assert response.status_code == 200
        assert response.json['username'] == 'testuser1'
        assert response.json['email'] == 'test1@example.com'

    def test_get_user_not_found(self, client, db):
        """Test getting a non-existent user."""
        response = client.get('/api/users/999')
        assert response.status_code == 404

    def test_create_user_success(self, client, db, sample_user_data, auth_headers):
        """Test successful user creation."""
        response = client.post(
            '/api/users',
            data=json.dumps(sample_user_data),
            headers=auth_headers
        )
        assert response.status_code == 201
        assert response.json['username'] == 'newuser'
        assert response.json['email'] == 'newuser@example.com'

        # Verify user was actually created
        users = User.query.all()
        assert len(users) == 1
        assert users[0].username == 'newuser'

    def test_create_user_duplicate_username(self, client, init_database, auth_headers):
        """Test creating user with duplicate username."""
        data = {'username': 'testuser1', 'email': 'new@example.com'}
        response = client.post(
            '/api/users',
            data=json.dumps(data),
            headers=auth_headers
        )
        assert response.status_code == 400
        assert 'error' in response.json
        assert 'Username already exists' in response.json['error']

    def test_create_user_duplicate_email(self, client, init_database, auth_headers):
        """Test creating user with duplicate email."""
        data = {'username': 'newuser', 'email': 'test1@example.com'}
        response = client.post(
            '/api/users',
            data=json.dumps(data),
            headers=auth_headers
        )
        assert response.status_code == 400
        assert 'error' in response.json
        assert 'Email already exists' in response.json['error']

    def test_create_user_invalid_data(self, client, db, auth_headers):
        """Test creating user with invalid data."""
        # Missing required fields
        data = {'username': 'incomplete'}
        response = client.post(
            '/api/users',
            data=json.dumps(data),
            headers=auth_headers
        )
        assert response.status_code == 400

    def test_update_user_success(self, client, init_database, auth_headers):
        """Test successful user update."""
        update_data = {'username': 'updateduser', 'email': 'updated@example.com'}
        response = client.put(
            '/api/users/1',
            data=json.dumps(update_data),
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json['username'] == 'updateduser'

        # Verify update in database
        user = User.query.get(1)
        assert user.username == 'updateduser'

    def test_update_user_not_found(self, client, db, auth_headers):
        """Test updating non-existent user."""
        data = {'username': 'newuser'}
        response = client.put(
            '/api/users/999',
            data=json.dumps(data),
            headers=auth_headers
        )
        assert response.status_code == 404

    def test_delete_user_success(self, client, init_database):
        """Test successful user deletion."""
        response = client.delete('/api/users/1')
        assert response.status_code == 200
        assert response.json['message'] == 'User deleted successfully'

        # Verify user was actually deleted
        user = User.query.get(1)
        assert user is None

    def test_delete_user_not_found(self, client, db):
        """Test deleting non-existent user."""
        response = client.delete('/api/users/999')
        assert response.status_code == 404
```

## 8. Route Tests - Post Endpoints

```python
# tests/test_routes_posts.py
import pytest
import json
from app.models import Post

class TestPostRoutes:
    def test_get_posts_empty(self, client, db):
        """Test getting posts when database is empty."""
        response = client.get('/api/posts')
        assert response.status_code == 200
        assert response.json == []

    def test_get_posts_with_data(self, client, init_database):
        """Test getting posts with data."""
        response = client.get('/api/posts')
        assert response.status_code == 200
        assert len(response.json) == 2
        assert response.json[0]['title'] == 'First Post'

    def test_create_post_success(self, client, init_database, sample_post_data, auth_headers):
        """Test successful post creation."""
        response = client.post(
            '/api/posts',
            data=json.dumps(sample_post_data),
            headers=auth_headers
        )
        assert response.status_code == 201
        assert response.json['title'] == 'Test Post'
        assert response.json['content'] == 'This is a test post content'

        # Verify post was actually created
        posts = Post.query.all()
        assert len(posts) == 3  # 2 from init + 1 new

    def test_create_post_invalid_user(self, client, init_database, auth_headers):
        """Test creating post with non-existent user."""
        data = {
            'title': 'Test Post',
            'content': 'Content',
            'user_id': 999  # Non-existent user
        }
        response = client.post(
            '/api/posts',
            data=json.dumps(data),
            headers=auth_headers
        )
        assert response.status_code == 400
        assert 'error' in response.json
        assert 'User not found' in response.json['error']

    def test_create_post_missing_fields(self, client, init_database, auth_headers):
        """Test creating post with missing required fields."""
        data = {'title': 'Incomplete Post'}  # Missing content and user_id
        response = client.post(
            '/api/posts',
            data=json.dumps(data),
            headers=auth_headers
        )
        assert response.status_code == 400
```

## 9. Schema Tests

```python
# tests/test_schemas.py
import pytest
from app.schemas import user_schema, users_schema, post_schema, posts_schema
from app.models import User, Post

class TestUserSchema:
    def test_user_serialization(self, db):
        """Test user object serialization."""
        user = User(username='testuser', email='test@example.com')
        db.session.add(user)
        db.session.commit()

        result = user_schema.dump(user)
        assert result['username'] == 'testuser'
        assert result['email'] == 'test@example.com'
        assert 'id' in result

    def test_users_serialization(self, db):
        """Test multiple users serialization."""
        user1 = User(username='user1', email='user1@example.com')
        user2 = User(username='user2', email='user2@example.com')
        db.session.add_all([user1, user2])
        db.session.commit()

        users = [user1, user2]
        result = users_schema.dump(users)
        assert len(result) == 2
        assert result[0]['username'] == 'user1'
        assert result[1]['username'] == 'user2'

class TestPostSchema:
    def test_post_serialization(self, db):
        """Test post object serialization with author."""
        user = User(username='author', email='author@example.com')
        post = Post(title='Test Post', content='Content', user_id=user.id)

        user.posts.append(post)
        db.session.add(user)
        db.session.commit()

        result = post_schema.dump(post)
        assert result['title'] == 'Test Post'
        assert result['content'] == 'Content'
        assert result['author']['username'] == 'author'
```

## 10. Integration Tests

```python
# tests/test_integration.py
import pytest
import json

class TestIntegration:
    def test_full_user_workflow(self, client, db, auth_headers):
        """Test complete user CRUD workflow."""
        # Create user
        user_data = {'username': 'workflowuser', 'email': 'workflow@example.com'}
        create_response = client.post(
            '/api/users',
            data=json.dumps(user_data),
            headers=auth_headers
        )
        assert create_response.status_code == 201
        user_id = create_response.json['id']

        # Get user
        get_response = client.get(f'/api/users/{user_id}')
        assert get_response.status_code == 200
        assert get_response.json['username'] == 'workflowuser'

        # Update user
        update_data = {'username': 'updatedworkflow'}
        update_response = client.put(
            f'/api/users/{user_id}',
            data=json.dumps(update_data),
            headers=auth_headers
        )
        assert update_response.status_code == 200
        assert update_response.json['username'] == 'updatedworkflow'

        # Create post for user
        post_data = {
            'title': 'Workflow Post',
            'content': 'Content from workflow',
            'user_id': user_id
        }
        post_response = client.post(
            '/api/posts',
            data=json.dumps(post_data),
            headers=auth_headers
        )
        assert post_response.status_code == 201

        # Get posts and verify
        posts_response = client.get('/api/posts')
        assert posts_response.status_code == 200
        assert len(posts_response.json) == 1
        assert posts_response.json[0]['title'] == 'Workflow Post'

        # Delete user
        delete_response = client.delete(f'/api/users/{user_id}')
        assert delete_response.status_code == 200

        # Verify user is gone
        final_get_response = client.get(f'/api/users/{user_id}')
        assert final_get_response.status_code == 404

    def test_error_handling(self, client, db):
        """Test various error scenarios."""
        # Invalid JSON
        response = client.post(
            '/api/users',
            data='invalid json',
            headers={'Content-Type': 'application/json'}
        )
        assert response.status_code == 400

        # Non-existent endpoint
        response = client.get('/api/nonexistent')
        assert response.status_code == 404

        # Method not allowed
        response = client.patch('/api/users/1')
        assert response.status_code == 405
```

## 11. Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_routes.py

# Run tests with verbose output
pytest -v

# Run tests and generate HTML coverage report
pytest --cov=app --cov-report=html

# Run specific test class
pytest tests/test_routes.py::TestUserRoutes

# Run specific test method
pytest tests/test_routes.py::TestUserRoutes::test_create_user_success -v
```

## 12. Advanced Testing Techniques

```python
# tests/test_advanced.py
import pytest
import time
from unittest.mock import patch, MagicMock

class TestAdvanced:
    def test_database_rollback(self, client, db):
        """Test that database changes are rolled back after each test."""
        # This test should not affect other tests
        user_data = {'username': 'tempuser', 'email': 'temp@example.com'}
        response = client.post('/api/users', json=user_data)
        assert response.status_code == 201

        # In the next test, the database should be clean again

    @patch('app.routes.db.session.commit')
    def test_database_error(self, mock_commit, client, db, auth_headers):
        """Test handling of database errors."""
        mock_commit.side_effect = Exception("Database error")

        user_data = {'username': 'erroruser', 'email': 'error@example.com'}
        response = client.post(
            '/api/users',
            data=json.dumps(user_data),
            headers=auth_headers
        )

        assert response.status_code == 500

    def test_performance(self, client, init_database):
        """Test API response time."""
        start_time = time.time()

        for _ in range(10):
            response = client.get('/api/users')
            assert response.status_code == 200

        end_time = time.time()
        assert (end_time - start_time) < 1.0  # Should complete in under 1 second

    def test_content_type_validation(self, client, init_database):
        """Test content-type header validation."""
        user_data = {'username': 'test', 'email': 'test@example.com'}

        # Missing content-type
        response = client.post('/api/users', data=json.dumps(user_data))
        assert response.status_code == 400 or 415  # Depending on Flask version

        # Wrong content-type
        response = client.post(
            '/api/users',
            data=json.dumps(user_data),
            headers={'Content-Type': 'text/plain'}
        )
        assert response.status_code == 400 or 415
```

## Key Testing Concepts:

1. **Fixtures**: Reusable test setup
2. **Database Testing**: Isolated test database
3. **HTTP Methods**: Testing all CRUD operations
4. **Error Handling**: Testing error responses
5. **Validation**: Testing input validation
6. **Serialization**: Testing JSON output
7. **Integration**: Testing complete workflows
8. **Mocking**: Testing external dependencies

## Best Practices:

- Use separate test database
- Keep tests isolated and independent
- Test both success and failure cases
- Use meaningful test names
- Test edge cases and boundary conditions
- Run tests automatically in CI/CD
