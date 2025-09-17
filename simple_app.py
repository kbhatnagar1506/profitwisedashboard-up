#!/usr/bin/env python3

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import os
import json
import hashlib
import secrets
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))

# Files to store data
DATA_FILE = 'user_entries.json'
USERS_FILE = 'users.json'
BUSINESSES_FILE = 'businesses.json'

def load_entries():
    """Load entries from file"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
    except:
        pass
    return []

def save_entries(entries):
    """Save entries to file"""
    with open(DATA_FILE, 'w') as f:
        json.dump(entries, f, indent=2)

def load_users():
    """Load users from file"""
    try:
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
    except:
        pass
    return []

def save_users(users):
    """Save users to file"""
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def load_businesses():
    """Load businesses from file"""
    try:
        if os.path.exists(BUSINESSES_FILE):
            with open(BUSINESSES_FILE, 'r') as f:
                return json.load(f)
    except:
        pass
    return []

def save_businesses(businesses):
    """Save businesses to file"""
    with open(BUSINESSES_FILE, 'w') as f:
        json.dump(businesses, f, indent=2)

def create_demo_user():
    """Create a demo user if none exist"""
    users = load_users()
    if not users:
        demo_user = {
            'id': 1,
            'email': 'demo@profitwise.com',
            'password_hash': hashlib.sha256('demo123'.encode()).hexdigest(),
            'created_at': datetime.now().isoformat(),
            'status': 'active'
        }
        users.append(demo_user)
        save_users(users)

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/mobile')
def mobile():
    """Mobile page"""
    return render_template('mobile.html')

@app.route('/desktop')
def desktop():
    """Desktop page"""
    return render_template('desktop.html')

@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')

@app.route('/login')
def login():
    """Login page"""
    return render_template('login.html')

@app.route('/user_login', methods=['POST'])
def user_login():
    """Handle user login"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400
        
        users = load_users()
        user = next((u for u in users if u['email'] == email), None)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        if user['password_hash'] != password_hash:
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401
        
        # Set session
        session['user_authenticated'] = True
        session['user_id'] = user['id']
        session['user_email'] = user['email']
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'redirect': '/dashboard'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred during login'
        }), 500

@app.route('/user_signup', methods=['POST'])
def user_signup():
    """Handle user signup"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400
        
        users = load_users()
        
        # Check if user already exists
        if any(u['email'] == email for u in users):
            return jsonify({
                'success': False,
                'message': 'User already exists'
            }), 400
        
        # Create new user
        new_user = {
            'id': len(users) + 1,
            'email': email,
            'password_hash': hashlib.sha256(password.encode()).hexdigest(),
            'created_at': datetime.now().isoformat(),
            'status': 'active'
        }
        
        users.append(new_user)
        save_users(users)
        
        # Set session
        session['user_authenticated'] = True
        session['user_id'] = new_user['id']
        session['user_email'] = new_user['email']
        
        return jsonify({
            'success': True,
            'message': 'Account created successfully',
            'redirect': '/onboarding'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred during signup'
        }), 500

@app.route('/onboarding')
def onboarding_page():
    """Onboarding page"""
    if not session.get('user_authenticated'):
        return redirect(url_for('login'))
    return render_template('onboarding.html')

@app.route('/submit_onboarding', methods=['POST'])
def submit_onboarding():
    """Handle onboarding form submission"""
    try:
        if not session.get('user_authenticated'):
            return jsonify({
                'success': False,
                'message': 'User not authenticated'
            }), 401
        
        data = request.get_json()
        user_id = session.get('user_id')
        
        # Load existing businesses
        businesses = load_businesses()
        
        # Check if user already has a business profile
        existing_business = next((b for b in businesses if b['user_id'] == user_id), None)
        
        # Create or update business profile
        business_data = {
            'id': existing_business['id'] if existing_business else len(businesses) + 1,
            'user_id': user_id,
            'category': data.get('category'),
            'business_name': data.get('businessName'),
            'website_url': data.get('websiteUrl'),
            'files': data.get('files', []),
            'financial_data': data.get('financialData', {}),
            'created_at': existing_business.get('created_at', datetime.now().isoformat()) if existing_business else datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'status': 'active',
            'onboarding_completed_at': datetime.now().isoformat(),
            'ip_address': request.remote_addr,
            'user_agent': request.headers.get('User-Agent', ''),
            'onboarding_source': 'web',
            'onboarding_data': data
        }
        
        if existing_business:
            # Update existing business
            for i, business in enumerate(businesses):
                if business['id'] == existing_business['id']:
                    businesses[i] = business_data
                    break
        else:
            # Add new business
            businesses.append(business_data)
        
        save_businesses(businesses)
        
        return jsonify({
            'success': True,
            'message': 'Business profile updated successfully!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred during onboarding'
        }), 500

@app.route('/dashboard')
def dashboard():
    """User dashboard"""
    if not session.get('user_authenticated'):
        return redirect(url_for('index'))
    
    # Check if user has completed onboarding
    user_id = session.get('user_id')
    businesses = load_businesses()
    user_business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    if not user_business:
        # Redirect to onboarding if no business data
        return redirect(url_for('onboarding_page'))
    
    # Pass business data to template
    return render_template('dashboard.html',
                         business_name=user_business.get('business_name'),
                         category=user_business.get('category'),
                         website_url=user_business.get('website_url'),
                         created_at=user_business.get('created_at'))

@app.route('/user_logout')
def user_logout():
    """Logout user"""
    session.pop('user_authenticated', None)
    session.pop('user_id', None)
    session.pop('user_email', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    # Create demo user if none exist
    create_demo_user()
    
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
