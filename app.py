from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import os
import json
import hashlib
import secrets
from datetime import datetime
import re
from scraper import DataScraper
import threading
import time

app = Flask(__name__)

# Generate a secure secret key for sessions
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))

# Files to store data
DATA_FILE = 'user_entries.json'
USERS_FILE = 'users.json'
BUSINESSES_FILE = 'businesses.json'

# Admin credentials (in production, use environment variables)
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH', hashlib.sha256('ProfitWise2024!'.encode()).hexdigest())

# Generate encrypted admin link
ADMIN_SECRET = os.environ.get('ADMIN_SECRET', secrets.token_urlsafe(32))

# Initialize scraper
scraper = DataScraper()

# Template filter for timestamp conversion
@app.template_filter('timestamp_to_date')
def timestamp_to_date(timestamp):
    """Convert timestamp to readable date"""
    if not timestamp:
        return 'Never'
    try:
        if isinstance(timestamp, (int, float)):
            return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
        else:
            return str(timestamp)
    except:
        return str(timestamp)

def process_scraped_data_async(user_id, business_data):
    """Process scraped data in background thread"""
    try:
        print(f"Starting data scraping for user {user_id}")
        
        # Scrape all available data
        scraped_data = scraper.scrape_all_user_data(business_data)
        
        # Update business data with scraped content
        businesses = load_businesses()
        for business in businesses:
            if business.get('user_id') == user_id:
                business['scraped_data'] = scraped_data
                business['last_scraped'] = time.time()
                break
        
        save_businesses(businesses)
        print(f"Completed data scraping for user {user_id}")
        
    except Exception as e:
        print(f"Error scraping data for user {user_id}: {str(e)}")
        # Still save the business data even if scraping fails
        businesses = load_businesses()
        for business in businesses:
            if business.get('user_id') == user_id:
                business['scraping_error'] = str(e)
                business['last_scraped'] = time.time()
                break
        save_businesses(businesses)

def load_entries():
    """Load existing entries from file"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_entries(entries):
    """Save entries to file"""
    with open(DATA_FILE, 'w') as f:
        json.dump(entries, f, indent=2)

def load_users():
    """Load existing users from file"""
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_users(users):
    """Save users to file"""
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def load_businesses():
    """Load existing businesses from file"""
    if os.path.exists(BUSINESSES_FILE):
        with open(BUSINESSES_FILE, 'r') as f:
            return json.load(f)
    return []

def save_businesses(businesses):
    """Save businesses to file"""
    with open(BUSINESSES_FILE, 'w') as f:
        json.dump(businesses, f, indent=2)

def hash_password(password):
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed):
    """Verify a password against its hash"""
    return hash_password(password) == hashed

def calculate_data_completeness(data):
    """Calculate the completeness percentage of onboarding data"""
    total_fields = 0
    completed_fields = 0
    
    # Basic business info
    if data.get('category'): completed_fields += 1
    total_fields += 1
    
    if data.get('businessName'): completed_fields += 1
    total_fields += 1
    
    if data.get('websiteUrl'): completed_fields += 1
    total_fields += 1
    
    # Financial data
    financial_data = data.get('financialData', {})
    financial_fields = ['annualRevenue', 'monthlyRevenue', 'monthlyExpenses', 'operatingCosts', 
                       'netProfit', 'grossProfit', 'ebitda', 'profitMargin', 'totalAssets', 
                       'totalLiabilities', 'cashFlow', 'growthRate']
    
    for field in financial_fields:
        total_fields += 1
        if financial_data.get(field): completed_fields += 1
    
    # Files
    total_fields += 1
    if data.get('files') and len(data.get('files', [])) > 0: completed_fields += 1
    
    return round((completed_fields / total_fields) * 100, 2) if total_fields > 0 else 0

def create_demo_user():
    """Create a demo user if none exist"""
    users = load_users()
    if not users:
        demo_user = {
            'id': 1,
            'name': 'Demo User',
            'phone': '+1234567890',
            'email': 'demo@profitwise.app',
            'password': hash_password('ProfitWise2024!'),
            'created_at': datetime.now().isoformat(),
            'last_login': None,
            'status': 'active'
        }
        users.append(demo_user)
        save_users(users)
        print("Demo user created: demo@profitwise.app / ProfitWise2024!")

def is_admin_authenticated():
    """Check if user is authenticated as admin"""
    return session.get('admin_authenticated', False)

def is_mobile_device():
    """Detect if the request is from a mobile device"""
    user_agent = request.headers.get('User-Agent', '').lower()
    mobile_patterns = [
        'mobile', 'android', 'iphone', 'ipad', 'ipod', 
        'blackberry', 'windows phone', 'opera mini'
    ]
    return any(pattern in user_agent for pattern in mobile_patterns)

def require_admin_auth(f):
    """Decorator to require admin authentication"""
    def decorated_function(*args, **kwargs):
        if not is_admin_authenticated():
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@app.route('/')
def index():
    if is_mobile_device():
        return render_template('mobile.html')
    return render_template('index.html')

@app.route('/mobile')
def mobile():
    return render_template('mobile.html')

@app.route('/desktop')
def desktop():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/submit_waitlist', methods=['POST'])
def submit_waitlist():
    """Handle waitlist form submission"""
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        
        if not name or not email:
            return jsonify({'success': False, 'message': 'Name and email are required'}), 400
        
        # Load existing entries
        entries = load_entries()
        
        # Check if email already exists
        if any(entry['email'] == email for entry in entries):
            return jsonify({'success': False, 'message': 'Email already registered'}), 400
        
        # Add new entry
        new_entry = {
            'name': name,
            'email': email,
            'timestamp': datetime.now().isoformat(),
            'id': len(entries) + 1
        }
        
        entries.append(new_entry)
        save_entries(entries)
        
        return jsonify({
            'success': True, 
            'message': 'Successfully added to waitlist!',
            'entry_id': new_entry['id']
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': 'An error occurred'}), 500

@app.route('/admin/entries')
def view_entries():
    """Admin view to see all entries"""
    entries = load_entries()
    return jsonify(entries)

@app.route('/admin/users')
@require_admin_auth
def view_users():
    """Admin view to see all users"""
    users = load_users()
    businesses = load_businesses()
    
    # Remove password hashes for security and add business data
    safe_users = []
    for user in users:
        safe_user = user.copy()
        del safe_user['password']
        
        # Add business profile data
        user_business = next((b for b in businesses if b['user_id'] == user['id']), None)
        if user_business:
            safe_user['business_profile'] = {
                'business_name': user_business.get('business_name'),
                'category': user_business.get('category'),
                'website_url': user_business.get('website_url'),
                'data_completeness': user_business.get('data_completeness', 0),
                'onboarding_completed_at': user_business.get('onboarding_completed_at'),
                'financial_data': user_business.get('financial_data', {}),
                'files_count': len(user_business.get('files', []))
            }
        else:
            safe_user['business_profile'] = None
            
        safe_users.append(safe_user)
    return jsonify(safe_users)

@app.route('/admin/user/<int:user_id>')
@require_admin_auth
def view_user_details(user_id):
    """Admin view to see detailed user information"""
    users = load_users()
    businesses = load_businesses()
    
    # Find user
    user = next((u for u in users if u['id'] == user_id), None)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Find business profile
    business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    # Remove password for security
    safe_user = user.copy()
    del safe_user['password']
    
    # Add business data
    if business:
        safe_user['business_profile'] = business
    else:
        safe_user['business_profile'] = None
    
    return jsonify(safe_user)

@app.route('/admin/export')
@require_admin_auth
def export_all_data():
    """Export all user and business data"""
    users = load_users()
    businesses = load_businesses()
    entries = load_entries()
    
    # Remove passwords for security
    safe_users = []
    for user in users:
        safe_user = user.copy()
        del safe_user['password']
        safe_users.append(safe_user)
    
    export_data = {
        'export_date': datetime.now().isoformat(),
        'total_users': len(safe_users),
        'total_businesses': len(businesses),
        'total_entries': len(entries),
        'users': safe_users,
        'businesses': businesses,
        'waitlist_entries': entries
    }
    
    return jsonify(export_data)

@app.route('/admin')
@require_admin_auth
def admin_dashboard():
    """Admin dashboard with HTML interface"""
    entries = load_entries()
    users = load_users()
    businesses = load_businesses()
    return render_template('admin.html', entries=entries, users=users, businesses=businesses)

@app.route(f'/admin-{ADMIN_SECRET}', methods=['GET', 'POST'])
def admin_login():
    """Admin login page with encrypted URL"""
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        
        # Hash the provided password
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        # Check credentials
        if username == ADMIN_USERNAME and password_hash == ADMIN_PASSWORD_HASH:
            session['admin_authenticated'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            return render_template('admin_login.html', error='Invalid credentials')
    
    return render_template('admin_login.html')

@app.route('/admin/logout')
def admin_logout():
    """Logout admin"""
    session.pop('admin_authenticated', None)
    return redirect(url_for('index'))

@app.route('/user_login', methods=['POST'])
def user_login():
    """Handle user login"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400
        
        # Load users from file
        users = load_users()
        
        # Find user by email
        user = next((u for u in users if u['email'] == email), None)
        
        if user and verify_password(password, user['password']):
            # Update user login information
            user['last_login'] = datetime.now().isoformat()
            user['login_count'] = user.get('login_count', 0) + 1
            user['last_activity'] = datetime.now().isoformat()
            user['last_ip'] = request.remote_addr
            user['last_user_agent'] = request.headers.get('User-Agent', '')
            
            # Save updated user data
            users = load_users()
            for i, u in enumerate(users):
                if u['id'] == user['id']:
                    users[i] = user
                    break
            save_users(users)
            
            session['user_authenticated'] = True
            session['user_email'] = email
            session['user_name'] = user['name']
            session['user_id'] = user['id']
            session['login_time'] = datetime.now().isoformat()
            
            return jsonify({
                'success': True,
                'message': f'Login successful! Welcome back {user["name"]}!'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred during login'
        }), 500

@app.route('/dashboard')
def dashboard():
    """User dashboard - serve Next.js dashboard"""
    if not session.get('user_authenticated'):
        return redirect(url_for('index'))
    
    # Check if user has completed onboarding
    user_id = session.get('user_id')
    businesses = load_businesses()
    user_business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    if not user_business:
        # Redirect to onboarding if no business data
        return redirect(url_for('onboarding_page'))
    
    # Serve the Next.js dashboard HTML
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>ProfitWise Dashboard - AI-Powered Business Intelligence</title>
        <meta name="description" content="Comprehensive business analytics and AI-powered insights to optimize your business performance and growth."/>
        <link rel="icon" href="/static/favicon.ico" sizes="256x256" type="image/x-icon"/>
        <style>
            body {{
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                background: #0a0a0a;
                color: #ededed;
            }}
            .dashboard-container {{
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }}
            .dashboard-header {{
                background: #1a1a1a;
                border-bottom: 1px solid #262626;
                padding: 1rem 2rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }}
            .dashboard-logo {{
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }}
            .dashboard-logo h1 {{
                margin: 0;
                font-size: 1.5rem;
                font-weight: 700;
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }}
            .dashboard-content {{
                flex: 1;
                padding: 2rem;
                display: grid;
                grid-template-columns: 250px 1fr;
                gap: 2rem;
            }}
            .sidebar {{
                background: #1a1a1a;
                border-radius: 12px;
                padding: 1.5rem;
                height: fit-content;
            }}
            .sidebar h2 {{
                margin: 0 0 1rem 0;
                font-size: 1.25rem;
                color: #f8fafc;
            }}
            .sidebar p {{
                margin: 0 0 2rem 0;
                color: #94a3b8;
                font-size: 0.875rem;
            }}
            .nav-item {{
                display: block;
                padding: 0.75rem 1rem;
                margin: 0.25rem 0;
                color: #94a3b8;
                text-decoration: none;
                border-radius: 8px;
                transition: all 0.2s;
            }}
            .nav-item:hover {{
                background: #262626;
                color: #f8fafc;
            }}
            .nav-item.active {{
                background: #3b82f6;
                color: white;
            }}
            .main-content {{
                background: #1a1a1a;
                border-radius: 12px;
                padding: 2rem;
            }}
            .business-health {{
                background: linear-gradient(135deg, #10b981, #059669);
                border-radius: 12px;
                padding: 2rem;
                margin-bottom: 2rem;
                color: white;
            }}
            .health-score {{
                font-size: 3rem;
                font-weight: 700;
                margin: 0;
            }}
            .metrics-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
            }}
            .metric-card {{
                background: #262626;
                padding: 1.5rem;
                border-radius: 8px;
                text-align: center;
            }}
            .metric-value {{
                font-size: 2rem;
                font-weight: 700;
                margin: 0;
                color: #f8fafc;
            }}
            .metric-label {{
                color: #94a3b8;
                font-size: 0.875rem;
                margin: 0.5rem 0 0 0;
            }}
            .quick-actions {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 1rem;
                margin-top: 2rem;
            }}
            .action-btn {{
                background: #262626;
                border: 1px solid #404040;
                color: #f8fafc;
                padding: 1rem;
                border-radius: 8px;
                text-decoration: none;
                text-align: center;
                transition: all 0.2s;
            }}
            .action-btn:hover {{
                background: #3b82f6;
                border-color: #3b82f6;
            }}
            .logout-btn {{
                background: #dc2626;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            }}
            .logout-btn:hover {{
                background: #b91c1c;
            }}
        </style>
    </head>
    <body>
        <div class="dashboard-container">
            <div class="dashboard-header">
                <div class="dashboard-logo">
                    <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-weight: 700;">P</span>
                    </div>
                    <h1>ProfitWise Dashboard</h1>
                </div>
                <button class="logout-btn" onclick="window.location.href='/user_logout'">Logout</button>
            </div>
            
            <div class="dashboard-content">
                <div class="sidebar">
                    <h2>Business Intelligence</h2>
                    <p>AI-Powered Dashboard</p>
                    
                    <a href="#" class="nav-item active">Overview</a>
                    <a href="#" class="nav-item">Financial Analytics</a>
                    <a href="#" class="nav-item">Customer Intelligence</a>
                    <a href="#" class="nav-item">Growth Opportunities</a>
                    <a href="#" class="nav-item">Cash Flow</a>
                    <a href="#" class="nav-item">Social Media</a>
                    <a href="#" class="nav-item">AI Recommendations</a>
                    <a href="#" class="nav-item">AI Chat</a>
                    <a href="#" class="nav-item">Business Health</a>
                    <a href="#" class="nav-item">Settings</a>
                    
                    <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #404040;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #94a3b8; font-size: 0.875rem;">Health Score</span>
                            <span style="color: #10b981; font-weight: 600;">85%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: #94a3b8; font-size: 0.875rem;">Active Alerts</span>
                            <span style="color: #f59e0b; font-weight: 600;">1</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #94a3b8; font-size: 0.875rem;">AI Insights</span>
                            <span style="color: #3b82f6; font-weight: 600;">3</span>
                        </div>
                    </div>
                </div>
                
                <div class="main-content">
                    <div class="business-health">
                        <h2 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%;"></div>
                            Business Health: 85%
                        </h2>
                        <div style="background: rgba(255,255,255,0.2); height: 8px; border-radius: 4px; margin: 1rem 0;">
                            <div style="background: white; height: 100%; width: 85%; border-radius: 4px;"></div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
                            <div>
                                <div style="font-size: 1.5rem; font-weight: 700;">$45K/mo</div>
                                <div style="font-size: 0.875rem; opacity: 0.9;">Revenue (+12%)</div>
                            </div>
                            <div>
                                <div style="font-size: 1.5rem; font-weight: 700;">$12K/mo</div>
                                <div style="font-size: 0.875rem; opacity: 0.9;">Profit (26.7%)</div>
                            </div>
                            <div>
                                <div style="font-size: 1.5rem; font-weight: 700;">150</div>
                                <div style="font-size: 0.875rem; opacity: 0.9;">Customers (+8)</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-value">$45,231</div>
                            <div class="metric-label">Monthly Revenue</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">150</div>
                            <div class="metric-label">Active Customers</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">26.7%</div>
                            <div class="metric-label">Profit Margin</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value">94.2%</div>
                            <div class="metric-label">Customer Retention</div>
                        </div>
                    </div>
                    
                    <div class="quick-actions">
                        <a href="/onboarding" class="action-btn">Update Info</a>
                        <a href="#" class="action-btn">Upload Docs</a>
                        <a href="#" class="action-btn">Voice Input</a>
                        <a href="#" class="action-btn">Export Data</a>
                        <a href="#" class="action-btn">AI Chat</a>
                        <a href="#" class="action-btn">Settings</a>
                    </div>
                    
                    <div style="margin-top: 2rem; padding: 1.5rem; background: #262626; border-radius: 8px; border-left: 4px solid #f59e0b;">
                        <h3 style="margin: 0 0 0.5rem 0; color: #f59e0b;">Business Alert</h3>
                        <p style="margin: 0; color: #94a3b8;">Cash flow projection shows potential shortage in Q3 - Review recommended actions</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

@app.route('/user_logout')
def user_logout():
    """Logout user"""
    session.pop('user_authenticated', None)
    session.pop('user_email', None)
    return redirect(url_for('index'))

@app.route('/login')
def login_page():
    """Login page"""
    return render_template('login.html')

@app.route('/onboarding')
def onboarding_page():
    """Onboarding page for new users"""
    if not session.get('user_authenticated'):
        return redirect(url_for('login_page'))
    return render_template('onboarding.html')

@app.route('/user_signup', methods=['POST'])
def user_signup():
    """Handle user signup"""
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        if not all([name, phone, email, password]):
            return jsonify({
                'success': False,
                'message': 'All fields are required'
            }), 400
        
        # Basic validation
        if len(password) < 6:
            return jsonify({
                'success': False,
                'message': 'Password must be at least 6 characters long'
            }), 400
        
        # Email validation
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            return jsonify({
                'success': False,
                'message': 'Please enter a valid email address'
            }), 400
        
        # Phone validation
        phone_regex = r'^[\+]?[1-9][\d]{0,15}$'
        if not re.match(phone_regex, phone.replace(' ', '')):
            return jsonify({
                'success': False,
                'message': 'Please enter a valid phone number'
            }), 400
        
        # Load existing users
        users = load_users()
        
        # Check if email already exists
        if any(user['email'] == email for user in users):
            return jsonify({
                'success': False,
                'message': 'An account with this email already exists'
            }), 400
        
        # Create new user
        new_user = {
            'id': len(users) + 1,
            'name': name,
            'phone': phone,
            'email': email,
            'password': hash_password(password),
            'created_at': datetime.now().isoformat(),
            'last_login': None,
            'status': 'active',
            'profile_complete': False,
            'onboarding_completed': False,
            'business_profile': None,
            'login_count': 0,
            'last_activity': datetime.now().isoformat(),
            'ip_address': request.remote_addr,
            'user_agent': request.headers.get('User-Agent', ''),
            'signup_source': 'web'
        }
        
        users.append(new_user)
        save_users(users)
        
        # Set session
        session['user_authenticated'] = True
        session['user_email'] = email
        session['user_name'] = name
        session['user_id'] = new_user['id']
        
        return jsonify({
            'success': True,
            'message': f'Account created successfully! Welcome {name}!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred during signup'
        }), 500

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
            'data_completeness': calculate_data_completeness(data),
            'ip_address': request.remote_addr,
            'user_agent': request.headers.get('User-Agent', ''),
            'onboarding_source': 'web',
            # Store all detailed onboarding data
            'onboarding_data': {
                # Step 1: Business Category (already stored as category)
                # Step 2: Business Info
                'business_name': data.get('businessName'),
                'website_url': data.get('websiteUrl'),
                # Step 3: Document Upload (already stored as files)
                # Step 4: Revenue Data
                'monthly_revenue': data.get('monthlyRevenue'),
                'revenue_model': data.get('revenueModel'),
                'top_revenue_sources': data.get('topRevenueSources'),
                'revenue_type': data.get('revenueType'),
                'seasonality': data.get('seasonality'),
                # Step 5: Costs Data
                'direct_costs': data.get('directCosts'),
                'top_suppliers': data.get('topSuppliers'),
                'operating_expenses': data.get('operatingExpenses'),
                'fastest_growing_expenses': data.get('fastestGrowingExpenses'),
                'waste_tracking': data.get('wasteTracking'),
                # Step 6: Customer Data
                'customer_acquisition_cost': data.get('customerAcquisitionCost'),
                'revenue_per_customer': data.get('revenuePerCustomer'),
                'customer_retention': data.get('customerRetention'),
                'top_customers': data.get('topCustomers'),
                # Step 7: Growth & Pricing
                'last_price_change': data.get('lastPriceChange'),
                'discount_impact': data.get('discountImpact'),
                'lead_generation': data.get('leadGeneration'),
                'upsell_cross_sell': data.get('upsellCrossSell'),
                # Step 8: Cash Flow & Debt
                'cash_flow': data.get('cashFlow'),
                'cash_shortages': data.get('cashShortages'),
                'debt_loans': data.get('debtLoans'),
                # Step 9: Strategy & Efficiency
                'profit_barriers': data.get('profitBarriers'),
                'unit_economics': data.get('unitEconomics'),
                'cost_revenue_opportunities': data.get('costRevenueOpportunities'),
                'financial_tools': data.get('financialTools'),
                # Step 10-12: Document Uploads
                'financial_uploads': data.get('financialUploads', []),
                'customer_uploads': data.get('customerUploads', []),
                'strategic_uploads': data.get('strategicUploads', []),
                # Step 13: Marketing & Social Media
                'linkedin_page': data.get('linkedinPage'),
                'twitter_handle': data.get('twitterHandle'),
                'instagram_account': data.get('instagramAccount'),
                'facebook_page': data.get('facebookPage'),
                'tiktok_youtube': data.get('tiktokYoutube'),
                # Step 14: Reputation & Reviews
                'yelp_profile': data.get('yelpProfile'),
                'google_business': data.get('googleBusiness'),
                'glassdoor': data.get('glassdoor'),
                'app_store_reviews': data.get('appStoreReviews'),
                # Step 15: Analytics & Tools
                'google_analytics': data.get('googleAnalytics'),
                'seo_tools': data.get('seoTools'),
                'ecommerce_platforms': data.get('ecommercePlatforms'),
                'ad_platforms': data.get('adPlatforms')
            }
        }
        
        if existing_business:
            # Update existing business
            businesses = [b for b in businesses if b['user_id'] != user_id]
        
        businesses.append(business_data)
        save_businesses(businesses)
        
        # Update user profile to mark onboarding as completed
        users = load_users()
        for i, user in enumerate(users):
            if user['id'] == user_id:
                users[i]['onboarding_completed'] = True
                users[i]['profile_complete'] = True
                users[i]['business_profile'] = business_data['id']
                users[i]['last_activity'] = datetime.now().isoformat()
                break
        save_users(users)
        
        # Start background scraping process
        scraping_thread = threading.Thread(
            target=process_scraped_data_async,
            args=(user_id, business_data)
        )
        scraping_thread.daemon = True
        scraping_thread.start()
        
        return jsonify({
            'success': True,
            'message': 'Business profile updated successfully! Data scraping started in background.'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred during onboarding'
        }), 500

@app.route('/admin/dashboard')
@require_admin_auth
def admin_dashboard_protected():
    """Protected admin dashboard"""
    entries = load_entries()
    users = load_users()
    businesses = load_businesses()
    
    # Create a lookup dictionary for business profiles
    business_lookup = {b['id']: b for b in businesses}
    
    # Add business profile data to users
    for user in users:
        if user.get('business_profile'):
            user['business_profile_data'] = business_lookup.get(user['business_profile'])
        else:
            user['business_profile_data'] = None
    
    return render_template('admin.html', entries=entries, users=users, businesses=businesses)

@app.route('/admin/user/<int:user_id>')
@require_admin_auth
def view_user_profile(user_id):
    """View detailed user profile with scraped data"""
    users = load_users()
    businesses = load_businesses()
    
    # Find user
    user = next((u for u in users if u['id'] == user_id), None)
    if not user:
        return "User not found", 404
    
    # Find user's business profile
    business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    return render_template('user_profile.html', user=user, business=business, admin_secret=ADMIN_SECRET)

@app.route('/admin/trigger-scraping/<int:user_id>')
@require_admin_auth
def trigger_scraping(user_id):
    """Manually trigger data scraping for a user"""
    businesses = load_businesses()
    business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    if not business:
        return jsonify({'success': False, 'message': 'Business profile not found'}), 404
    
    # Start background scraping
    scraping_thread = threading.Thread(
        target=process_scraped_data_async,
        args=(user_id, business)
    )
    scraping_thread.daemon = True
    scraping_thread.start()
    
    return jsonify({'success': True, 'message': 'Data scraping started'})

if __name__ == '__main__':
    # Create demo user if none exist
    create_demo_user()
    
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
