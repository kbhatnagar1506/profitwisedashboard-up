#!/usr/bin/env python3
"""
Build script to generate static export of Next.js dashboard
This script will be run on Heroku during deployment
"""

import os
import subprocess
import sys

def build_dashboard():
    """Build the Next.js dashboard for static export"""
    print("Building Next.js dashboard...")
    
    # Change to dashboard directory
    os.chdir('dashboard')
    
    try:
        # Install dependencies
        print("Installing dependencies...")
        subprocess.run(['npm', 'install'], check=True)
        
        # Build for static export
        print("Building for static export...")
        subprocess.run(['npm', 'run', 'build'], check=True)
        
        print("Dashboard build completed successfully!")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"Build failed: {e}")
        return False
    except FileNotFoundError:
        print("npm not found. Skipping dashboard build.")
        return False
    finally:
        # Change back to root directory
        os.chdir('..')

if __name__ == "__main__":
    success = build_dashboard()
    sys.exit(0 if success else 1)
