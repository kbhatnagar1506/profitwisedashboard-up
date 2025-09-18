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
import openai
from error_handler import (
    handle_errors, validate_required_fields, validate_user_authentication,
    validate_admin_authentication, safe_json_loads, safe_file_operation,
    retry_on_failure, log_performance, register_error_handlers,
    ProfitWiseError, ValidationError, AuthenticationError, AuthorizationError,
    DataNotFoundError, ExternalServiceError, DatabaseError, AIAnalysisError,
    RateLimitError, error_monitor, get_user_friendly_message
)
import logging

# Configure logger
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Generate a secure secret key for sessions
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))

# OpenAI configuration
openai.api_key = os.environ.get('OPENAI_API_KEY')

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

# Register error handlers
register_error_handlers(app)

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
    """Save businesses to file with backup"""
    try:
        # Create backup of existing data
        if os.path.exists(BUSINESSES_FILE):
            backup_file = f"{BUSINESSES_FILE}.backup"
            with open(BUSINESSES_FILE, 'r') as original:
                with open(backup_file, 'w') as backup:
                    backup.write(original.read())
        
        # Save new data
        with open(BUSINESSES_FILE, 'w') as f:
            json.dump(businesses, f, indent=2)
        
        # Also save to a timestamped backup
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        timestamped_backup = f"{BUSINESSES_FILE}.{timestamp}"
        with open(timestamped_backup, 'w') as f:
            json.dump(businesses, f, indent=2)
        
        print(f"Businesses saved successfully. Backup created: {timestamped_backup}")
        return True
    except Exception as e:
        print(f"Error saving businesses: {e}")
        return False

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
    """User dashboard - redirect to Next.js dashboard"""
    if not session.get('user_authenticated'):
        return redirect(url_for('index'))
    
    # Check if user has completed onboarding
    user_id = session.get('user_id')
    businesses = load_businesses()
    user_business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    if not user_business:
        # Redirect to onboarding if no business data
        return redirect(url_for('onboarding_page'))
    
    # Redirect to dashboard page within Flask app
    return redirect(url_for('dashboard_page'))

@app.route('/dashboard')
def dashboard_page():
    """Dashboard page - embedded Next.js dashboard"""
    if not session.get('user_authenticated'):
        return redirect(url_for('login_page'))
    
    user_id = session.get('user_id')
    businesses = load_businesses()
    user_business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    if not user_business:
        return redirect(url_for('onboarding_page'))
    
    # Get user's business data for the dashboard
    onboarding_data = user_business.get('onboarding_data', {})
    
    return render_template('dashboard.html', 
                         user_name=session.get('user_name', 'User'),
                         business_data=onboarding_data,
                         user_business=user_business)

@app.route('/user_logout')
def user_logout():
    """Logout user"""
    session.pop('user_authenticated', None)
    session.pop('user_email', None)
    return redirect(url_for('index'))

@app.route('/api/dashboard-data')
@handle_errors
@log_performance
def get_dashboard_data():
    """Get user's business data for dashboard"""
    # Validate authentication
    user_id = validate_user_authentication()
    
    # Load business data safely
    businesses = safe_file_operation(load_businesses)
    user_business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    if not user_business:
        raise DataNotFoundError("Business profile not found", resource="business_profile")
    
    # Update last access time
    user_business['last_access'] = datetime.now().isoformat()
    user_business['access_count'] = user_business.get('access_count', 0) + 1
    
    # Save updated access info safely
    businesses = [b for b in businesses if b['user_id'] != user_id]
    businesses.append(user_business)
    safe_file_operation(save_businesses, businesses)
    
    # Extract and format data for dashboard
    onboarding_data = user_business.get('onboarding_data', {})
    
    # Calculate metrics from form data
    monthly_revenue = parse_revenue_range(onboarding_data.get('monthly_revenue', ''))
    revenue_per_customer = parse_currency(onboarding_data.get('revenue_per_customer', ''))
    customer_acquisition_cost = parse_currency(onboarding_data.get('customer_acquisition_cost', ''))
    cash_flow = parse_cash_flow(onboarding_data.get('cash_flow', ''))
    
    # Calculate derived metrics
    estimated_customers = calculate_estimated_customers(monthly_revenue, revenue_per_customer)
    profit_margin = calculate_profit_margin(monthly_revenue, onboarding_data)
    health_score = calculate_health_score(onboarding_data)
    
    dashboard_data = {
        'business_info': {
            'name': onboarding_data.get('business_name', 'Your Business'),
            'category': user_business.get('category', ''),
            'website': onboarding_data.get('website_url', ''),
            'completion_date': user_business.get('onboarding_completed_at', ''),
            'data_completeness': user_business.get('data_completeness', 0)
        },
        'financial_metrics': {
            'monthly_revenue': monthly_revenue,
            'revenue_per_customer': revenue_per_customer,
            'customer_acquisition_cost': customer_acquisition_cost,
            'estimated_customers': estimated_customers,
            'profit_margin': profit_margin,
            'cash_flow_in': cash_flow.get('in', 0),
            'cash_flow_out': cash_flow.get('out', 0),
            'net_cash_flow': cash_flow.get('net', 0)
        },
        'customer_metrics': {
            'retention_rate': parse_retention_rate(onboarding_data.get('customer_retention', '')),
            'revenue_model': onboarding_data.get('revenue_model', ''),
            'seasonality': onboarding_data.get('seasonality', ''),
            'top_customers': onboarding_data.get('top_customers', ''),
            'upsell_cross_sell': onboarding_data.get('upsell_cross_sell', '')
        },
        'growth_metrics': {
            'last_price_change': onboarding_data.get('last_price_change', ''),
            'lead_generation': onboarding_data.get('lead_generation', ''),
            'profit_barriers': onboarding_data.get('profit_barriers', ''),
            'opportunities': onboarding_data.get('cost_revenue_opportunities', ''),
            'unit_economics': onboarding_data.get('unit_economics', '')
        },
        'operational_metrics': {
            'direct_costs': onboarding_data.get('direct_costs', ''),
            'operating_expenses': onboarding_data.get('operating_expenses', ''),
            'fastest_growing_expenses': onboarding_data.get('fastest_growing_expenses', ''),
            'waste_tracking': onboarding_data.get('waste_tracking', ''),
            'financial_tools': onboarding_data.get('financial_tools', '')
        },
        'social_media': {
            'linkedin': onboarding_data.get('linkedin_page', ''),
            'twitter': onboarding_data.get('twitter_handle', ''),
            'instagram': onboarding_data.get('instagram_account', ''),
            'facebook': onboarding_data.get('facebook_page', ''),
            'tiktok_youtube': onboarding_data.get('tiktok_youtube', '')
        },
        'reputation': {
            'yelp': onboarding_data.get('yelp_profile', ''),
            'google_business': onboarding_data.get('google_business', ''),
            'glassdoor': onboarding_data.get('glassdoor', ''),
            'app_store': onboarding_data.get('app_store_reviews', '')
        },
        'analytics': {
            'google_analytics': onboarding_data.get('google_analytics', ''),
            'seo_tools': onboarding_data.get('seo_tools', ''),
            'ecommerce_platforms': onboarding_data.get('ecommerce_platforms', ''),
            'ad_platforms': onboarding_data.get('ad_platforms', '')
        },
        'health_score': health_score,
        'alerts': generate_business_alerts(onboarding_data),
        'recommendations': generate_business_recommendations(onboarding_data)
    }
    
    return jsonify(dashboard_data)

def parse_revenue_range(revenue_str):
    """Parse revenue range string to get average value"""
    if not revenue_str:
        return 0
    
    # Extract numbers from strings like "$50,000 - $75,000"
    import re
    numbers = re.findall(r'[\d,]+', revenue_str.replace('$', '').replace(',', ''))
    if len(numbers) >= 2:
        return (int(numbers[0]) + int(numbers[1])) // 2
    elif len(numbers) == 1:
        return int(numbers[0])
    return 0

def parse_currency(currency_str):
    """Parse currency string to get numeric value"""
    if not currency_str:
        return 0
    
    import re
    numbers = re.findall(r'[\d,]+', currency_str.replace('$', '').replace(',', ''))
    if numbers:
        return int(numbers[0])
    return 0

def parse_cash_flow(cash_flow_str):
    """Parse cash flow string like '$60,000 in, $45,000 out'"""
    if not cash_flow_str:
        return {'in': 0, 'out': 0, 'net': 0}
    
    import re
    # Look for patterns like "in" and "out"
    in_match = re.search(r'(\d+(?:,\d+)*).*in', cash_flow_str, re.IGNORECASE)
    out_match = re.search(r'(\d+(?:,\d+)*).*out', cash_flow_str, re.IGNORECASE)
    
    cash_in = int(in_match.group(1).replace(',', '')) if in_match else 0
    cash_out = int(out_match.group(1).replace(',', '')) if out_match else 0
    
    return {
        'in': cash_in,
        'out': cash_out,
        'net': cash_in - cash_out
    }

def parse_retention_rate(retention_str):
    """Parse retention rate from string"""
    if not retention_str:
        return 0
    
    import re
    numbers = re.findall(r'(\d+(?:\.\d+)?)', retention_str)
    if numbers:
        return float(numbers[0])
    return 0

def calculate_estimated_customers(monthly_revenue, revenue_per_customer):
    """Calculate estimated number of customers"""
    if monthly_revenue > 0 and revenue_per_customer > 0:
        return monthly_revenue // revenue_per_customer
    return 0

def calculate_profit_margin(monthly_revenue, onboarding_data):
    """Calculate estimated profit margin"""
    if monthly_revenue == 0:
        return 0
    
    # Estimate based on direct costs and operating expenses
    direct_costs = parse_currency(onboarding_data.get('direct_costs', ''))
    operating_expenses = parse_currency(onboarding_data.get('operating_expenses', ''))
    
    total_costs = direct_costs + operating_expenses
    if total_costs > 0:
        profit = monthly_revenue - total_costs
        return (profit / monthly_revenue) * 100
    return 0

def calculate_health_score(onboarding_data):
    """Calculate business health score based on onboarding data"""
    score = 0
    max_score = 100
    
    # Revenue data (20 points)
    if onboarding_data.get('monthly_revenue'):
        score += 10
    if onboarding_data.get('revenue_model'):
        score += 5
    if onboarding_data.get('revenue_type'):
        score += 5
    
    # Customer data (20 points)
    if onboarding_data.get('customer_retention'):
        score += 10
    if onboarding_data.get('revenue_per_customer'):
        score += 5
    if onboarding_data.get('customer_acquisition_cost'):
        score += 5
    
    # Financial tracking (20 points)
    if onboarding_data.get('financial_tools'):
        score += 10
    if onboarding_data.get('unit_economics'):
        score += 5
    if onboarding_data.get('waste_tracking'):
        score += 5
    
    # Growth planning (20 points)
    if onboarding_data.get('cost_revenue_opportunities'):
        score += 10
    if onboarding_data.get('lead_generation'):
        score += 5
    if onboarding_data.get('upsell_cross_sell'):
        score += 5
    
    # Social presence (10 points)
    social_count = sum(1 for key in ['linkedin_page', 'twitter_handle', 'instagram_account', 'facebook_page'] 
                      if onboarding_data.get(key))
    score += min(social_count * 2.5, 10)
    
    # Document uploads (10 points)
    doc_count = sum(1 for key in ['financial_uploads', 'customer_uploads', 'strategic_uploads'] 
                   if onboarding_data.get(key))
    score += min(doc_count * 3.33, 10)
    
    return min(score, max_score)

def generate_business_alerts(onboarding_data):
    """Generate business alerts based on onboarding data"""
    alerts = []
    
    # Cash flow alerts
    cash_flow = parse_cash_flow(onboarding_data.get('cash_flow', ''))
    if cash_flow['net'] < 0:
        alerts.append({
            'type': 'warning',
            'title': 'Negative Cash Flow',
            'message': 'Your cash outflow exceeds inflow. Consider reviewing expenses or increasing revenue.'
        })
    
    # Low retention rate
    retention = parse_retention_rate(onboarding_data.get('customer_retention', ''))
    if retention > 0 and retention < 70:
        alerts.append({
            'type': 'warning',
            'title': 'Low Customer Retention',
            'message': f'Your customer retention rate of {retention}% is below industry average. Consider improving customer experience.'
        })
    
    # High CAC
    cac = parse_currency(onboarding_data.get('customer_acquisition_cost', ''))
    revenue_per_customer = parse_currency(onboarding_data.get('revenue_per_customer', ''))
    if cac > 0 and revenue_per_customer > 0 and (cac / revenue_per_customer) > 0.3:
        alerts.append({
            'type': 'info',
            'title': 'High Customer Acquisition Cost',
            'message': 'Your CAC is high relative to customer value. Consider optimizing marketing channels.'
        })
    
    return alerts

def generate_business_recommendations(onboarding_data):
    """Generate business recommendations based on onboarding data"""
    recommendations = []
    
    # Revenue diversification
    if onboarding_data.get('revenue_type') == 'one-time':
        recommendations.append({
            'category': 'Revenue',
            'title': 'Consider Recurring Revenue',
            'description': 'Explore subscription models or recurring services to stabilize cash flow.'
        })
    
    # Social media presence
    social_count = sum(1 for key in ['linkedin_page', 'twitter_handle', 'instagram_account', 'facebook_page'] 
                      if onboarding_data.get(key))
    if social_count < 2:
        recommendations.append({
            'category': 'Marketing',
            'title': 'Expand Social Media Presence',
            'description': 'Increase your social media presence to reach more customers and build brand awareness.'
        })
    
    # Financial tracking
    if not onboarding_data.get('financial_tools'):
        recommendations.append({
            'category': 'Operations',
            'title': 'Implement Financial Tracking',
            'description': 'Use proper financial software to track expenses, revenue, and profitability more accurately.'
        })
    
    # Growth opportunities
    if onboarding_data.get('upsell_cross_sell') == 'no':
        recommendations.append({
            'category': 'Growth',
            'title': 'Develop Upselling Strategy',
            'description': 'Create additional revenue streams by upselling or cross-selling to existing customers.'
        })
    
    return recommendations

@app.route('/api/process-documents', methods=['POST'])
def process_documents():
    """Process uploaded documents and extract data"""
    if not session.get('user_authenticated'):
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        data = request.get_json()
        documents = data.get('documents', [])
        
        extracted_data = {
            'financial_data': {},
            'customer_data': {},
            'strategic_data': {},
            'summary': {
                'total_documents': len(documents),
                'processed_documents': 0,
                'extracted_metrics': 0,
                'errors': []
            }
        }
        
        for doc in documents:
            try:
                doc_type = doc.get('type', 'unknown')
                doc_content = doc.get('content', '')
                
                if doc_type == 'financial':
                    financial_data = extract_financial_data(doc_content)
                    extracted_data['financial_data'].update(financial_data)
                    extracted_data['summary']['processed_documents'] += 1
                    extracted_data['summary']['extracted_metrics'] += len(financial_data)
                
                elif doc_type == 'customer':
                    customer_data = extract_customer_data(doc_content)
                    extracted_data['customer_data'].update(customer_data)
                    extracted_data['summary']['processed_documents'] += 1
                    extracted_data['summary']['extracted_metrics'] += len(customer_data)
                
                elif doc_type == 'strategic':
                    strategic_data = extract_strategic_data(doc_content)
                    extracted_data['strategic_data'].update(strategic_data)
                    extracted_data['summary']['processed_documents'] += 1
                    extracted_data['summary']['extracted_metrics'] += len(strategic_data)
                
            except Exception as e:
                extracted_data['summary']['errors'].append(f"Error processing document: {str(e)}")
        
        # Update user's business data with extracted information
        user_id = session.get('user_id')
        businesses = load_businesses()
        user_business = next((b for b in businesses if b['user_id'] == user_id), None)
        
        if user_business:
            user_business['extracted_data'] = extracted_data
            user_business['updated_at'] = datetime.now().isoformat()
            
            # Save updated data
            businesses = [b for b in businesses if b['user_id'] != user_id]
            businesses.append(user_business)
            save_businesses(businesses)
        
        return jsonify({
            'success': True,
            'extracted_data': extracted_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def extract_financial_data(content):
    """Extract financial data from document content"""
    import re
    
    financial_data = {}
    
    # Extract revenue patterns
    revenue_patterns = [
        r'revenue[:\s]*\$?([\d,]+(?:\.\d{2})?)',
        r'sales[:\s]*\$?([\d,]+(?:\.\d{2})?)',
        r'income[:\s]*\$?([\d,]+(?:\.\d{2})?)',
        r'total[:\s]*revenue[:\s]*\$?([\d,]+(?:\.\d{2})?)'
    ]
    
    for pattern in revenue_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            financial_data['extracted_revenue'] = max([float(m.replace(',', '')) for m in matches])
            break
    
    # Extract profit patterns
    profit_patterns = [
        r'profit[:\s]*\$?([\d,]+(?:\.\d{2})?)',
        r'net[:\s]*income[:\s]*\$?([\d,]+(?:\.\d{2})?)',
        r'earnings[:\s]*\$?([\d,]+(?:\.\d{2})?)'
    ]
    
    for pattern in profit_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            financial_data['extracted_profit'] = max([float(m.replace(',', '')) for m in matches])
            break
    
    # Extract expense patterns
    expense_patterns = [
        r'expenses[:\s]*\$?([\d,]+(?:\.\d{2})?)',
        r'costs[:\s]*\$?([\d,]+(?:\.\d{2})?)',
        r'total[:\s]*expenses[:\s]*\$?([\d,]+(?:\.\d{2})?)'
    ]
    
    for pattern in expense_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            financial_data['extracted_expenses'] = max([float(m.replace(',', '')) for m in matches])
            break
    
    # Extract cash flow patterns
    cash_patterns = [
        r'cash[:\s]*flow[:\s]*\$?([\d,]+(?:\.\d{2})?)',
        r'operating[:\s]*cash[:\s]*\$?([\d,]+(?:\.\d{2})?)'
    ]
    
    for pattern in cash_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            financial_data['extracted_cash_flow'] = max([float(m.replace(',', '')) for m in matches])
            break
    
    return financial_data

def extract_customer_data(content):
    """Extract customer data from document content"""
    import re
    
    customer_data = {}
    
    # Extract customer count patterns
    customer_patterns = [
        r'customers[:\s]*(\d+(?:,\d+)*)',
        r'clients[:\s]*(\d+(?:,\d+)*)',
        r'total[:\s]*customers[:\s]*(\d+(?:,\d+)*)'
    ]
    
    for pattern in customer_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            customer_data['extracted_customer_count'] = max([int(m.replace(',', '')) for m in matches])
            break
    
    # Extract retention rate patterns
    retention_patterns = [
        r'retention[:\s]*(\d+(?:\.\d+)?)%',
        r'retention[:\s]*rate[:\s]*(\d+(?:\.\d+)?)%',
        r'customer[:\s]*retention[:\s]*(\d+(?:\.\d+)?)%'
    ]
    
    for pattern in retention_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            customer_data['extracted_retention_rate'] = max([float(m) for m in matches])
            break
    
    # Extract churn rate patterns
    churn_patterns = [
        r'churn[:\s]*(\d+(?:\.\d+)?)%',
        r'churn[:\s]*rate[:\s]*(\d+(?:\.\d+)?)%',
        r'customer[:\s]*churn[:\s]*(\d+(?:\.\d+)?)%'
    ]
    
    for pattern in churn_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            customer_data['extracted_churn_rate'] = max([float(m) for m in matches])
            break
    
    return customer_data

def extract_strategic_data(content):
    """Extract strategic data from document content"""
    import re
    
    strategic_data = {}
    
    # Extract growth rate patterns
    growth_patterns = [
        r'growth[:\s]*(\d+(?:\.\d+)?)%',
        r'growth[:\s]*rate[:\s]*(\d+(?:\.\d+)?)%',
        r'revenue[:\s]*growth[:\s]*(\d+(?:\.\d+)?)%'
    ]
    
    for pattern in growth_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            strategic_data['extracted_growth_rate'] = max([float(m) for m in matches])
            break
    
    # Extract market share patterns
    market_patterns = [
        r'market[:\s]*share[:\s]*(\d+(?:\.\d+)?)%',
        r'share[:\s]*of[:\s]*market[:\s]*(\d+(?:\.\d+)?)%'
    ]
    
    for pattern in market_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            strategic_data['extracted_market_share'] = max([float(m) for m in matches])
            break
    
    # Extract key metrics
    if 'kpi' in content.lower() or 'key performance' in content.lower():
        strategic_data['has_kpis'] = True
    
    if 'strategy' in content.lower() or 'strategic' in content.lower():
        strategic_data['has_strategy'] = True
    
    if 'goals' in content.lower() or 'objectives' in content.lower():
        strategic_data['has_goals'] = True
    
    return strategic_data

def analyze_business_with_ai(business_data):
    """Comprehensive AI analysis of business data"""
    try:
        if not openai.api_key:
            return {"error": "OpenAI API key not configured"}
        
        # Prepare business data for analysis
        onboarding_data = business_data.get('onboarding_data', {})
        extracted_data = business_data.get('extracted_data', {})
        
        # Create comprehensive business profile
        business_profile = {
            "business_name": onboarding_data.get('business_name', 'Unknown Business'),
            "category": business_data.get('category', 'Unknown'),
            "monthly_revenue": onboarding_data.get('monthly_revenue', ''),
            "revenue_model": onboarding_data.get('revenue_model', ''),
            "customer_retention": onboarding_data.get('customer_retention', ''),
            "revenue_per_customer": onboarding_data.get('revenue_per_customer', ''),
            "customer_acquisition_cost": onboarding_data.get('customer_acquisition_cost', ''),
            "cash_flow": onboarding_data.get('cash_flow', ''),
            "direct_costs": onboarding_data.get('direct_costs', ''),
            "operating_expenses": onboarding_data.get('operating_expenses', ''),
            "profit_barriers": onboarding_data.get('profit_barriers', ''),
            "growth_opportunities": onboarding_data.get('cost_revenue_opportunities', ''),
            "financial_tools": onboarding_data.get('financial_tools', ''),
            "social_media_presence": {
                "linkedin": onboarding_data.get('linkedin_page', ''),
                "twitter": onboarding_data.get('twitter_handle', ''),
                "instagram": onboarding_data.get('instagram_account', ''),
                "facebook": onboarding_data.get('facebook_page', '')
            },
            "extracted_financial_data": extracted_data.get('financial_data', {}),
            "extracted_customer_data": extracted_data.get('customer_data', {}),
            "extracted_strategic_data": extracted_data.get('strategic_data', {})
        }
        
        # Create AI analysis prompt
        prompt = f"""
        As a business analyst and AI consultant, analyze this business data and provide comprehensive insights:

        Business Profile:
        {json.dumps(business_profile, indent=2)}

        Please provide a detailed analysis in the following JSON format:
        {{
            "executive_summary": "Brief overview of business health and key findings",
            "financial_analysis": {{
                "revenue_health": "Analysis of revenue streams and sustainability",
                "profitability": "Assessment of profit margins and cost structure",
                "cash_flow_analysis": "Evaluation of cash flow management",
                "financial_risks": "Identified financial risks and concerns",
                "financial_recommendations": "Specific financial improvement suggestions"
            }},
            "customer_analysis": {{
                "customer_health": "Assessment of customer base and retention",
                "acquisition_efficiency": "Analysis of customer acquisition costs and methods",
                "retention_strategy": "Evaluation of customer retention strategies",
                "customer_risks": "Identified customer-related risks",
                "customer_recommendations": "Specific customer improvement suggestions"
            }},
            "growth_analysis": {{
                "growth_potential": "Assessment of growth opportunities",
                "market_position": "Analysis of competitive position",
                "scalability": "Evaluation of business scalability",
                "growth_barriers": "Identified barriers to growth",
                "growth_recommendations": "Specific growth strategy suggestions"
            }},
            "operational_analysis": {{
                "efficiency": "Assessment of operational efficiency",
                "process_optimization": "Areas for process improvement",
                "technology_adoption": "Technology usage and recommendations",
                "operational_risks": "Identified operational risks",
                "operational_recommendations": "Specific operational improvement suggestions"
            }},
            "strategic_recommendations": [
                "Top 5 strategic recommendations for business improvement"
            ],
            "priority_actions": [
                "Immediate action items (next 30 days)"
            ],
            "long_term_goals": [
                "Long-term strategic goals (6-12 months)"
            ],
            "risk_assessment": {{
                "high_risks": ["Critical risks that need immediate attention"],
                "medium_risks": ["Moderate risks to monitor"],
                "low_risks": ["Minor risks to keep an eye on"]
            }},
            "success_metrics": {{
                "kpis_to_track": ["Key performance indicators to monitor"],
                "benchmarks": "Industry benchmarks and targets",
                "measurement_frequency": "How often to measure these metrics"
            }},
            "ai_confidence_score": 85,
            "analysis_timestamp": "{datetime.now().isoformat()}"
        }}

        Provide a professional, actionable analysis that a business owner can immediately implement.
        """
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert business analyst with 20+ years of experience helping businesses optimize their operations, improve profitability, and scale effectively. Provide detailed, actionable insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=4000,
            temperature=0.3
        )
        
        # Parse AI response
        ai_analysis = response.choices[0].message.content
        
        # Try to parse as JSON, fallback to text if needed
        try:
            analysis_data = json.loads(ai_analysis)
        except json.JSONDecodeError:
            # If not valid JSON, create structured response
            analysis_data = {
                "executive_summary": ai_analysis[:500] + "...",
                "raw_analysis": ai_analysis,
                "ai_confidence_score": 75,
                "analysis_timestamp": datetime.now().isoformat()
            }
        
        return analysis_data
        
    except Exception as e:
        print(f"Error in AI analysis: {e}")
        return {
            "error": f"AI analysis failed: {str(e)}",
            "ai_confidence_score": 0,
            "analysis_timestamp": datetime.now().isoformat()
        }

def generate_ai_recommendations(business_data):
    """Generate AI-powered business recommendations"""
    try:
        if not openai.api_key:
            return {"error": "OpenAI API key not configured"}
        
        onboarding_data = business_data.get('onboarding_data', {})
        
        prompt = f"""
        Based on this business data, generate 10 specific, actionable recommendations:

        Business Data:
        - Category: {business_data.get('category', 'Unknown')}
        - Revenue: {onboarding_data.get('monthly_revenue', 'Not specified')}
        - Revenue Model: {onboarding_data.get('revenue_model', 'Not specified')}
        - Customer Retention: {onboarding_data.get('customer_retention', 'Not specified')}
        - CAC: {onboarding_data.get('customer_acquisition_cost', 'Not specified')}
        - Revenue per Customer: {onboarding_data.get('revenue_per_customer', 'Not specified')}
        - Cash Flow: {onboarding_data.get('cash_flow', 'Not specified')}
        - Profit Barriers: {onboarding_data.get('profit_barriers', 'Not specified')}
        - Growth Opportunities: {onboarding_data.get('cost_revenue_opportunities', 'Not specified')}
        - Financial Tools: {onboarding_data.get('financial_tools', 'Not specified')}

        Provide recommendations in this JSON format:
        {{
            "recommendations": [
                {{
                    "title": "Recommendation title",
                    "description": "Detailed description",
                    "category": "Financial|Customer|Growth|Operations|Marketing",
                    "priority": "High|Medium|Low",
                    "timeline": "Immediate|1-3 months|3-6 months|6+ months",
                    "impact": "High|Medium|Low",
                    "effort": "High|Medium|Low",
                    "specific_actions": ["Action 1", "Action 2", "Action 3"]
                }}
            ]
        }}
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a business consultant providing specific, actionable recommendations."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.4
        )
        
        ai_response = response.choices[0].message.content
        
        try:
            return json.loads(ai_response)
        except json.JSONDecodeError:
            return {
                "recommendations": [{
                    "title": "AI Analysis Available",
                    "description": ai_response[:200] + "...",
                    "category": "General",
                    "priority": "Medium",
                    "timeline": "Immediate",
                    "impact": "Medium",
                    "effort": "Medium",
                    "specific_actions": ["Review AI analysis", "Implement suggestions"]
                }]
            }
        
    except Exception as e:
        print(f"Error generating AI recommendations: {e}")
        return {"error": f"AI recommendations failed: {str(e)}"}

def generate_ai_insights(business_data):
    """Generate AI insights for dashboard display"""
    try:
        if not openai.api_key:
            return {"error": "OpenAI API key not configured"}
        
        onboarding_data = business_data.get('onboarding_data', {})
        
        prompt = f"""
        Generate 5 key insights for a business dashboard based on this data:

        Business: {onboarding_data.get('business_name', 'Unknown')}
        Category: {business_data.get('category', 'Unknown')}
        Revenue: {onboarding_data.get('monthly_revenue', 'Not specified')}
        Revenue Model: {onboarding_data.get('revenue_model', 'Not specified')}
        Customer Retention: {onboarding_data.get('customer_retention', 'Not specified')}
        CAC: {onboarding_data.get('customer_acquisition_cost', 'Not specified')}
        Cash Flow: {onboarding_data.get('cash_flow', 'Not specified')}

        Provide insights in this JSON format:
        {{
            "insights": [
                {{
                    "title": "Insight title",
                    "description": "Brief description",
                    "type": "opportunity|risk|trend|recommendation",
                    "confidence": 85,
                    "action_required": True,
                    "category": "Financial|Customer|Growth|Operations"
                }}
            ]
        }}
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a business intelligence analyst creating dashboard insights."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.3
        )
        
        ai_response = response.choices[0].message.content
        
        try:
            return json.loads(ai_response)
        except json.JSONDecodeError:
            return {
                "insights": [{
                    "title": "AI Analysis Complete",
                    "description": "Your business data has been analyzed by AI",
                    "type": "recommendation",
                    "confidence": 75,
                    "action_required": True,
                    "category": "General"
                }]
            }
        
    except Exception as e:
        print(f"Error generating AI insights: {e}")
        return {"error": f"AI insights failed: {str(e)}"}

@app.route('/api/save-dashboard-state', methods=['POST'])
def save_dashboard_state():
    """Save dashboard state and user interactions"""
    if not session.get('user_authenticated'):
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        data = request.get_json()
        user_id = session.get('user_id')
        businesses = load_businesses()
        user_business = next((b for b in businesses if b['user_id'] == user_id), None)
        
        if not user_business:
            return jsonify({'error': 'No business data found'}), 404
        
        # Save dashboard state
        dashboard_state = {
            'active_section': data.get('active_section', 'Overview'),
            'last_updated': datetime.now().isoformat(),
            'user_preferences': data.get('user_preferences', {}),
            'viewed_sections': data.get('viewed_sections', []),
            'interactions': data.get('interactions', []),
            'bookmarks': data.get('bookmarks', []),
            'notes': data.get('notes', {}),
            'filters': data.get('filters', {}),
            'settings': data.get('settings', {})
        }
        
        user_business['dashboard_state'] = dashboard_state
        user_business['last_dashboard_update'] = datetime.now().isoformat()
        
        # Save extracted data if provided
        if 'extracted_data' in data:
            user_business['extracted_data'] = data['extracted_data']
        
        # Save analytics data
        if 'analytics' in data:
            if 'analytics' not in user_business:
                user_business['analytics'] = {}
            user_business['analytics'].update(data['analytics'])
        
        # Save AI chat history
        if 'chat_history' in data:
            if 'chat_history' not in user_business:
                user_business['chat_history'] = []
            user_business['chat_history'].extend(data['chat_history'])
            # Keep only last 100 messages
            user_business['chat_history'] = user_business['chat_history'][-100:]
        
        # Save reports and exports
        if 'reports' in data:
            if 'reports' not in user_business:
                user_business['reports'] = []
            user_business['reports'].extend(data['reports'])
        
        # Save alerts and notifications
        if 'alerts' in data:
            if 'alerts' not in user_business:
                user_business['alerts'] = []
            user_business['alerts'].extend(data['alerts'])
        
        # Update business data
        businesses = [b for b in businesses if b['user_id'] != user_id]
        businesses.append(user_business)
        
        if save_businesses(businesses):
            return jsonify({
                'success': True,
                'message': 'Dashboard state saved successfully',
                'timestamp': datetime.now().isoformat()
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to save data'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/get-dashboard-state')
def get_dashboard_state():
    """Get saved dashboard state for user"""
    if not session.get('user_authenticated'):
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session.get('user_id')
    businesses = load_businesses()
    user_business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    if not user_business:
        return jsonify({'error': 'No business data found'}), 404
    
    return jsonify({
        'dashboard_state': user_business.get('dashboard_state', {}),
        'extracted_data': user_business.get('extracted_data', {}),
        'analytics': user_business.get('analytics', {}),
        'chat_history': user_business.get('chat_history', []),
        'reports': user_business.get('reports', []),
        'alerts': user_business.get('alerts', []),
        'last_updated': user_business.get('last_dashboard_update', ''),
        'access_count': user_business.get('access_count', 0),
        'last_access': user_business.get('last_access', '')
    })

@app.route('/api/export-user-data')
def export_user_data():
    """Export all user data for backup"""
    if not session.get('user_authenticated'):
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session.get('user_id')
    businesses = load_businesses()
    user_business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    if not user_business:
        return jsonify({'error': 'No business data found'}), 404
    
    # Create comprehensive export
    export_data = {
        'user_info': {
            'user_id': user_id,
            'export_timestamp': datetime.now().isoformat(),
            'data_version': '1.0'
        },
        'business_profile': user_business,
        'export_metadata': {
            'total_sections': len(user_business.get('onboarding_data', {})),
            'data_completeness': user_business.get('data_completeness', 0),
            'last_updated': user_business.get('updated_at', ''),
            'access_count': user_business.get('access_count', 0)
        }
    }
    
    return jsonify(export_data)

@app.route('/api/import-user-data', methods=['POST'])
def import_user_data():
    """Import user data from backup"""
    if not session.get('user_authenticated'):
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        data = request.get_json()
        user_id = session.get('user_id')
        businesses = load_businesses()
        
        # Validate import data
        if 'business_profile' not in data:
            return jsonify({'error': 'Invalid import data format'}), 400
        
        import_data = data['business_profile']
        
        # Update user's business data
        user_business = next((b for b in businesses if b['user_id'] == user_id), None)
        if user_business:
            # Merge imported data
            user_business.update(import_data)
            user_business['imported_at'] = datetime.now().isoformat()
            user_business['import_source'] = data.get('user_info', {}).get('export_timestamp', 'unknown')
        else:
            # Create new business profile
            import_data['user_id'] = user_id
            import_data['imported_at'] = datetime.now().isoformat()
            user_business = import_data
        
        # Save updated data
        businesses = [b for b in businesses if b['user_id'] != user_id]
        businesses.append(user_business)
        
        if save_businesses(businesses):
            return jsonify({
                'success': True,
                'message': 'Data imported successfully',
                'timestamp': datetime.now().isoformat()
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to save imported data'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ai-analysis', methods=['POST'])
@handle_errors
@log_performance
def run_ai_analysis():
    """Run comprehensive AI analysis on business data"""
    # Validate authentication
    user_id = validate_user_authentication()
    
    # Load and validate business data
    businesses = safe_file_operation(load_businesses)
    user_business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    if not user_business:
        raise DataNotFoundError("Business profile not found", resource="business_profile")
    
    # Run AI analysis with retry mechanism
    ai_analysis = analyze_business_with_ai_safe(user_business)
    ai_recommendations = generate_ai_recommendations_safe(user_business)
    ai_insights = generate_ai_insights_safe(user_business)
    
    # Save AI analysis to business data
    user_business['ai_analysis'] = {
        'comprehensive_analysis': ai_analysis,
        'recommendations': ai_recommendations,
        'insights': ai_insights,
        'analysis_timestamp': datetime.now().isoformat(),
        'analysis_version': '1.0'
    }
    
    # Update business data safely
    businesses = [b for b in businesses if b['user_id'] != user_id]
    businesses.append(user_business)
    safe_file_operation(save_businesses, businesses)
    
    return jsonify({
        'success': True,
        'analysis': ai_analysis,
        'recommendations': ai_recommendations,
        'insights': ai_insights,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/ai-insights')
def get_ai_insights():
    """Get AI insights for dashboard"""
    if not session.get('user_authenticated'):
        return jsonify({'error': 'Not authenticated'}), 401
    
    user_id = session.get('user_id')
    businesses = load_businesses()
    user_business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    if not user_business:
        return jsonify({'error': 'No business data found'}), 404
    
    ai_data = user_business.get('ai_analysis', {})
    
    return jsonify({
        'analysis': ai_data.get('comprehensive_analysis', {}),
        'recommendations': ai_data.get('recommendations', {}),
        'insights': ai_data.get('insights', {}),
        'last_analysis': ai_data.get('analysis_timestamp', ''),
        'has_analysis': bool(ai_data)
    })

# Safe wrapper functions for AI operations with error handling
@retry_on_failure(max_retries=3, delay=1.0)
def analyze_business_with_ai_safe(business_data):
    """Safe wrapper for AI analysis with error handling"""
    try:
        result = analyze_business_with_ai(business_data)
        if result.get('error'):
            raise AIAnalysisError(f"AI analysis failed: {result['error']}", analysis_type="comprehensive")
        return result
    except openai.error.OpenAIError as e:
        raise AIAnalysisError(f"OpenAI API error: {str(e)}", analysis_type="comprehensive")
    except Exception as e:
        raise AIAnalysisError(f"Analysis error: {str(e)}", analysis_type="comprehensive")

@retry_on_failure(max_retries=3, delay=1.0)
def generate_ai_recommendations_safe(business_data):
    """Safe wrapper for AI recommendations with error handling"""
    try:
        result = generate_ai_recommendations(business_data)
        if result.get('error'):
            raise AIAnalysisError(f"AI recommendations failed: {result['error']}", analysis_type="recommendations")
        return result
    except openai.error.OpenAIError as e:
        raise AIAnalysisError(f"OpenAI API error: {str(e)}", analysis_type="recommendations")
    except Exception as e:
        raise AIAnalysisError(f"Recommendations error: {str(e)}", analysis_type="recommendations")

@retry_on_failure(max_retries=3, delay=1.0)
def generate_ai_insights_safe(business_data):
    """Safe wrapper for AI insights with error handling"""
    try:
        result = generate_ai_insights(business_data)
        if result.get('error'):
            raise AIAnalysisError(f"AI insights failed: {result['error']}", analysis_type="insights")
        return result
    except openai.error.OpenAIError as e:
        raise AIAnalysisError(f"OpenAI API error: {str(e)}", analysis_type="insights")
    except Exception as e:
        raise AIAnalysisError(f"Insights error: {str(e)}", analysis_type="insights")

@app.route('/api/ai-chat', methods=['POST'])
@handle_errors
@log_performance
def ai_chat():
    """AI chat endpoint for business questions"""
    # Validate authentication
    user_id = validate_user_authentication()
    
    # Validate request data
    data = request.get_json()
    if not data:
        raise ValidationError("Request data is required")
    
    message = data.get('message', '').strip()
    if not message:
        raise ValidationError("Message is required", field="message")
    
    if len(message) > 1000:
        raise ValidationError("Message too long (max 1000 characters)", field="message")
    
    # Get user's business data for context
    businesses = safe_file_operation(load_businesses)
    user_business = next((b for b in businesses if b['user_id'] == user_id), None)
    
    if not user_business:
        raise DataNotFoundError("Business profile not found", resource="business_profile")
    
    # Create context from business data
    onboarding_data = user_business.get('onboarding_data', {})
    business_context = f"""
    Business Context:
    - Name: {onboarding_data.get('business_name', 'Unknown')}
    - Category: {user_business.get('category', 'Unknown')}
    - Revenue: {onboarding_data.get('monthly_revenue', 'Not specified')}
    - Revenue Model: {onboarding_data.get('revenue_model', 'Not specified')}
    - Customer Retention: {onboarding_data.get('customer_retention', 'Not specified')}
    - CAC: {onboarding_data.get('customer_acquisition_cost', 'Not specified')}
    - Cash Flow: {onboarding_data.get('cash_flow', 'Not specified')}
    """
    
    # Call OpenAI API with error handling
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"You are ProfitWi$e AI, an expert business consultant. Use this business context to provide helpful, actionable advice: {business_context}"},
                {"role": "user", "content": message}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        # Save chat message to business data
        if 'chat_history' not in user_business:
            user_business['chat_history'] = []
        
        user_business['chat_history'].append({
            'role': 'user',
            'content': message,
            'timestamp': datetime.now().isoformat()
        })
        
        user_business['chat_history'].append({
            'role': 'assistant',
            'content': ai_response,
            'timestamp': datetime.now().isoformat()
        })
        
        # Keep only last 50 messages
        user_business['chat_history'] = user_business['chat_history'][-50:]
        
        # Update business data safely
        businesses = [b for b in businesses if b['user_id'] != user_id]
        businesses.append(user_business)
        safe_file_operation(save_businesses, businesses)
        
        return jsonify({
            'success': True,
            'response': ai_response,
            'timestamp': datetime.now().isoformat()
        })
    
    except openai.error.OpenAIError as e:
        raise AIAnalysisError(f"OpenAI API error: {str(e)}", analysis_type="chat")
    except Exception as e:
        raise AIAnalysisError(f"Chat error: {str(e)}", analysis_type="chat")

@app.route('/api/error-log', methods=['POST'])
@handle_errors
def log_error():
    """Log client-side errors for monitoring"""
    try:
        data = request.get_json()
        if not data:
            raise ValidationError("Error log data is required")
        
        # Log the error (in production, you'd send this to a monitoring service)
        logger.error(f"Client-side error: {data.get('error', {}).get('message', 'Unknown error')}", extra={
            "client_error": data,
            "user_agent": request.headers.get('User-Agent'),
            "ip_address": request.remote_addr
        })
        
        return jsonify({
            "success": True,
            "message": "Error logged successfully"
        })
    except Exception as e:
        logger.error(f"Failed to log client error: {str(e)}")
        return jsonify({
            "success": False,
            "message": "Failed to log error"
        }), 500

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
