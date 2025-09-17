#!/usr/bin/env python3

from flask import Flask, render_template, session
import os

app = Flask(__name__)
app.secret_key = 'test-secret-key'

# Mock session data
@app.before_request
def before_request():
    session['user_authenticated'] = True
    session['user_id'] = 1
    session['user_email'] = 'test@example.com'

@app.route('/')
def index():
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test Dashboard</title>
    </head>
    <body>
        <h1>Test Dashboard</h1>
        <p><a href="/dashboard">Go to Dashboard</a></p>
        <p><a href="/onboarding">Go to Onboarding</a></p>
    </body>
    </html>
    '''

@app.route('/dashboard')
def dashboard():
    """Test dashboard with mock data"""
    return render_template('dashboard.html',
                         business_name='Test Business',
                         category='Technology',
                         website_url='https://testbusiness.com',
                         created_at='2024-01-15')

@app.route('/onboarding')
def onboarding():
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Onboarding Test</title>
    </head>
    <body>
        <h1>Onboarding Form</h1>
        <form id="onboardingForm">
            <input type="text" id="businessName" placeholder="Business Name" value="Test Business">
            <input type="text" id="websiteUrl" placeholder="Website URL" value="https://testbusiness.com">
            <select id="category">
                <option value="technology">Technology</option>
            </select>
            <button type="button" onclick="submitForm()">Submit</button>
        </form>
        
        <script>
        function submitForm() {
            // Simulate form submission
            window.location.href = '/dashboard';
        }
        </script>
    </body>
    </html>
    '''

if __name__ == '__main__':
    app.run(debug=True, port=5001)
