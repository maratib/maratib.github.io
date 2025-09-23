---
title: Flask Basics
slug: guides/python/flask-basics
description: Flask Basics
sidebar:
  order: 0
---

Flask is a lightweight Python web framework that's easy to learn and perfect for building web applications quickly.

## 1. Setup and Installation

```bash
# Create virtual environment
python -m venv flask_env
source flask_env/bin/activate  # On Windows: flask_env\Scripts\activate

# Install Flask
pip install flask
```

## 2. Basic Flask Application

```python
# app.py
from flask import Flask

# Create Flask app instance
app = Flask(__name__)

# Basic route
@app.route('/')
def home():
    return 'Hello, Flask World!'

@app.route('/about')
def about():
    return 'About Page'

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
```

Run with: `python app.py`

## 3. Routing and URL Parameters

```python
from flask import Flask
app = Flask(__name__)

# Variable rules
@app.route('/user/<username>')
def show_user(username):
    return f'Hello {username}!'

@app.route('/post/<int:post_id>')
def show_post(post_id):
    return f'Post #{post_id}'

# Multiple parameters
@app.route('/user/<username>/post/<int:post_id>')
def user_post(username, post_id):
    return f'{username}\'s Post #{post_id}'

# HTTP methods
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return 'Login processing...'
    return 'Login form'
```

## 4. Templates with Jinja2

Create `templates/` folder:

```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>{% block title %}My App{% endblock %}</title>
  </head>
  <body>
    <nav>Navigation Bar</nav>
    <div class="content">{% block content %}{% endblock %}</div>
  </body>
</html>
```

```html
<!-- templates/index.html -->
{% extends "base.html" %} {% block title %}Home - My App{% endblock %} {% block
content %}
<h1>Welcome, {{ name }}!</h1>
<ul>
  {% for item in items %}
  <li>{{ item }}</li>
  {% endfor %}
</ul>
{% endblock %}
```

```python
# app.py
from flask import Flask, render_template

@app.route('/')
def index():
    return render_template('index.html',
                         name='John',
                         items=['Apple', 'Banana', 'Cherry'])

@app.route('/user/<name>')
def user(name):
    return render_template('user.html', name=name)
```

## 5. Handling Forms

```python
from flask import Flask, render_template, request, redirect, url_for

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']

        # Process the data (save to database, send email, etc.)
        print(f"Message from {name} ({email}): {message}")

        return redirect(url_for('success'))

    return render_template('contact.html')

@app.route('/success')
def success():
    return 'Message sent successfully!'
```

```html
<!-- templates/contact.html -->
<form method="POST">
  <input type="text" name="name" placeholder="Your Name" required />
  <input type="email" name="email" placeholder="Your Email" required />
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send</button>
</form>
```

## 6. Sessions and Cookies

```python
from flask import Flask, session, redirect, url_for, request

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Important for sessions!

@app.route('/')
def index():
    if 'username' in session:
        return f'Logged in as {session["username"]}'
    return 'You are not logged in'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('index'))
    return '''
        <form method="post">
            <input type="text" name="username">
            <button type="submit">Login</button>
        </form>
    '''

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))
```

## 7. Database Integration with SQLAlchemy

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

# Define models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Post('{self.title}')"

# Create tables
with app.app_context():
    db.create_all()

@app.route('/add_user')
def add_user():
    user = User(username='john', email='john@example.com')
    db.session.add(user)
    db.session.commit()
    return 'User added!'
```

## 8. Flask Blueprints (Modular Applications)

```python
# auth/routes.py
from flask import Blueprint, render_template

auth = Blueprint('auth', __name__)

@auth.route('/login')
def login():
    return render_template('login.html')

@auth.route('/register')
def register():
    return render_template('register.html')
```

```python
# main.py
from flask import Flask
from auth.routes import auth

app = Flask(__name__)
app.register_blueprint(auth, url_prefix='/auth')

@app.route('/')
def home():
    return 'Home Page'
```

## 9. Error Handling

```python
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

@app.errorhandler(403)
def forbidden(error):
    return render_template('403.html'), 403
```

## 10. File Uploads

```python
from flask import Flask, request, redirect, url_for
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return 'File uploaded successfully!'
    return '''
    <form method="post" enctype="multipart/form-data">
        <input type="file" name="file">
        <button type="submit">Upload</button>
    </form>
    '''
```

## 11. RESTful API with Flask

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

# Sample data
books = [
    {'id': 1, 'title': 'Python Basics', 'author': 'John Doe'},
    {'id': 2, 'title': 'Flask Web Development', 'author': 'Jane Smith'}
]

# GET all books
@app.route('/api/books', methods=['GET'])
def get_books():
    return jsonify(books)

# GET single book
@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = next((b for b in books if b['id'] == book_id), None)
    if book:
        return jsonify(book)
    return jsonify({'error': 'Book not found'}), 404

# POST new book
@app.route('/api/books', methods=['POST'])
def add_book():
    new_book = {
        'id': len(books) + 1,
        'title': request.json['title'],
        'author': request.json['author']
    }
    books.append(new_book)
    return jsonify(new_book), 201
```

## 12. Configuration and Environment Variables

```python
import os
from flask import Flask

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    DEBUG = False

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)  # Change based on environment
```

## 13. Complete Example: Blog Application

```python
# app.py
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
db = SQLAlchemy(app)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

@app.route('/')
def index():
    posts = Post.query.order_by(Post.date_posted.desc()).all()
    return render_template('index.html', posts=posts)

@app.route('/post/new', methods=['GET', 'POST'])
def new_post():
    if request.method == 'POST':
        post = Post(title=request.form['title'], content=request.form['content'])
        db.session.add(post)
        db.session.commit()
        flash('Post created successfully!', 'success')
        return redirect(url_for('index'))
    return render_template('create_post.html')

@app.route('/post/<int:post_id>')
def post(post_id):
    post = Post.query.get_or_404(post_id)
    return render_template('post.html', post=post)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
```

## 14. Deployment

```bash
# Install waitress for production server
pip install waitress

# Create wsgi.py
from app import app

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)
```

Run production server: `waitress-serve --port=8000 app:app`

## Key Flask Concepts Summary:

1. **Routes**: Define URL endpoints
2. **Templates**: Jinja2 for dynamic HTML
3. **Forms**: Handle user input
4. **Sessions**: Maintain user state
5. **Database**: SQLAlchemy integration
6. **Blueprints**: Modular app structure
7. **Error Handling**: Custom error pages
8. **REST APIs**: JSON responses
9. **Configuration**: Environment-based settings
10. **Deployment**: Production setup

## Next Steps:

- Explore Flask extensions (Flask-Login, Flask-Mail, Flask-WTF)
