#!/usr/bin/env python3

import requests
import json

# Base URL
BASE_URL = "http://localhost:5001"

def test_complete_flow():
    """Test the complete user flow from login to dashboard"""
    
    # Create a session to maintain cookies
    session = requests.Session()
    
    print("🚀 Testing ProfitWise Complete Flow")
    print("=" * 50)
    
    # Step 1: Login
    print("1. Testing login...")
    login_data = {
        "email": "demo@profitwise.com",
        "password": "demo123"
    }
    
    response = session.post(f"{BASE_URL}/user_login", json=login_data)
    if response.status_code == 200:
        result = response.json()
        if result['success']:
            print("✅ Login successful!")
        else:
            print(f"❌ Login failed: {result['message']}")
            return
    else:
        print(f"❌ Login request failed: {response.status_code}")
        return
    
    # Step 2: Access onboarding
    print("\n2. Testing onboarding access...")
    response = session.get(f"{BASE_URL}/onboarding")
    if response.status_code == 200:
        print("✅ Onboarding page accessible!")
    else:
        print(f"❌ Onboarding page failed: {response.status_code}")
        return
    
    # Step 3: Submit onboarding data
    print("\n3. Testing onboarding submission...")
    onboarding_data = {
        "category": "technology",
        "businessName": "Test Business Inc",
        "websiteUrl": "https://testbusiness.com",
        "files": [],
        "financialData": {
            "monthlyRevenue": "50000",
            "revenueModel": "subscription",
            "topRevenueSources": "SaaS subscriptions",
            "revenueType": "recurring",
            "seasonality": "stable",
            "directCosts": "20000",
            "topSuppliers": "AWS, Google Cloud",
            "operatingExpenses": "15000",
            "fastestGrowingExpenses": "Marketing",
            "wasteTracking": "Minimal",
            "customerAcquisitionCost": "200",
            "revenuePerCustomer": "1000",
            "customerRetention": "95",
            "topCustomers": "Enterprise clients",
            "lastPriceChange": "6 months ago",
            "discountImpact": "Positive",
            "leadGeneration": "Inbound marketing",
            "upsellCrossSell": "Regular",
            "cashFlow": "Positive",
            "cashShortages": "None",
            "debtLoans": "None",
            "profitBarriers": "Scaling costs",
            "unitEconomics": "Healthy",
            "costRevenueOpportunities": "Automation",
            "financialTools": "QuickBooks, Stripe",
            "linkedinPage": "https://linkedin.com/company/testbusiness",
            "twitterHandle": "@testbusiness",
            "instagramAccount": "@testbusiness",
            "facebookPage": "https://facebook.com/testbusiness",
            "tiktokYoutube": "https://youtube.com/testbusiness",
            "yelpProfile": "https://yelp.com/biz/testbusiness",
            "googleBusiness": "https://g.page/testbusiness",
            "glassdoor": "https://glassdoor.com/company/testbusiness",
            "appStoreReviews": "4.5 stars",
            "googleAnalytics": "Connected",
            "seoTools": "SEMrush, Ahrefs",
            "ecommercePlatforms": "Shopify",
            "adPlatforms": "Google Ads, Facebook Ads"
        }
    }
    
    response = session.post(f"{BASE_URL}/submit_onboarding", json=onboarding_data)
    if response.status_code == 200:
        result = response.json()
        if result['success']:
            print("✅ Onboarding submission successful!")
        else:
            print(f"❌ Onboarding submission failed: {result['message']}")
            return
    else:
        print(f"❌ Onboarding submission request failed: {response.status_code}")
        return
    
    # Step 4: Access dashboard
    print("\n4. Testing dashboard access...")
    response = session.get(f"{BASE_URL}/dashboard")
    if response.status_code == 200:
        print("✅ Dashboard accessible!")
        
        # Check if dashboard contains expected content
        content = response.text
        if "ProfitWise Dashboard" in content and "Business Health" in content:
            print("✅ Dashboard contains expected content!")
        else:
            print("⚠️ Dashboard content may be incomplete")
    else:
        print(f"❌ Dashboard access failed: {response.status_code}")
        return
    
    print("\n🎉 Complete flow test successful!")
    print("=" * 50)
    print("✅ User can now:")
    print("   - Login to the system")
    print("   - Complete onboarding")
    print("   - Access the AI-powered dashboard")
    print("   - See their business data and insights")

if __name__ == "__main__":
    test_complete_flow()
