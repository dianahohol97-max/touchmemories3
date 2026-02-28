#!/usr/bin/env python3
"""
verify_supabase.py — Phase 2: Link
Tests Supabase connection using SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
Runs a lightweight health check via the REST API.
"""

import os
import sys
import json
import urllib.request
import urllib.error
from dotenv import load_dotenv

# Load .env.local from project root (two levels up from tools/)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

def check_env():
    missing = []
    if not SUPABASE_URL or "YOUR_PROJECT" in SUPABASE_URL:
        missing.append("NEXT_PUBLIC_SUPABASE_URL")
    if not SERVICE_KEY or SERVICE_KEY == "your-supabase-service-role-key":
        missing.append("SUPABASE_SERVICE_ROLE_KEY")
    return missing

def verify():
    print("=" * 60)
    print("🔍  SUPABASE VERIFICATION")
    print("=" * 60)

    missing = check_env()
    if missing:
        print(f"❌  Missing env vars: {', '.join(missing)}")
        print("    → Fill in .env.local and re-run.")
        sys.exit(1)

    print(f"   URL: {SUPABASE_URL}")

    # Health check: list tables via REST (returns empty array if no tables — that's OK)
    url = f"{SUPABASE_URL}/rest/v1/"
    req = urllib.request.Request(
        url,
        headers={
            "apikey": SERVICE_KEY,
            "Authorization": f"Bearer {SERVICE_KEY}",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode()
            status = resp.status
            print(f"   HTTP Status: {status}")
            print(f"✅  Supabase connection successful!")
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"❌  HTTP Error {e.code}: {body}")
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"❌  Connection error: {e.reason}")
        print("    → Check SUPABASE_URL is correct and Supabase project is active.")
        sys.exit(1)

if __name__ == "__main__":
    verify()
