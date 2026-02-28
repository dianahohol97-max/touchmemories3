#!/usr/bin/env python3
"""
verify_checkbox.py — Phase 2: Link
Tests Checkbox ПРРО API by:
  1. Logging in with cashier credentials to obtain a JWT token
  2. Fetching cashier profile to confirm authentication
  3. Checking if a shift is currently open (informational)

IMPORTANT constraint (from findings.md):
  - A shift must be OPEN before receipts can be issued.
  - This script does NOT open a shift — it only reports shift status.
"""

import os
import sys
import json
import urllib.request
import urllib.error
import urllib.parse
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))

CHECKBOX_API_URL = os.getenv("CHECKBOX_API_URL", "https://api.checkbox.ua/api/v1").rstrip("/")
CHECKBOX_LOGIN = os.getenv("CHECKBOX_LOGIN", "")
CHECKBOX_PASSWORD = os.getenv("CHECKBOX_PASSWORD", "")

def check_env():
    missing = []
    if not CHECKBOX_LOGIN or CHECKBOX_LOGIN == "your-cashier-login":
        missing.append("CHECKBOX_LOGIN")
    if not CHECKBOX_PASSWORD or CHECKBOX_PASSWORD == "your-cashier-password":
        missing.append("CHECKBOX_PASSWORD")
    return missing

def post_json(url, data, headers=None):
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={
        "Content-Type": "application/json",
        **(headers or {}),
    })
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.status, json.loads(resp.read().decode())

def get_json(url, headers=None):
    req = urllib.request.Request(url, headers={
        "Content-Type": "application/json",
        **(headers or {}),
    })
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.status, json.loads(resp.read().decode())

def verify():
    print("=" * 60)
    print("🔍  CHECKBOX ПРРО VERIFICATION")
    print("=" * 60)

    missing = check_env()
    if missing:
        print(f"❌  Missing env vars: {', '.join(missing)}")
        print("    → Fill in .env.local and re-run.")
        sys.exit(1)

    # Step 1: Login
    print("   Step 1: Logging in as cashier...")
    try:
        status, resp = post_json(
            f"{CHECKBOX_API_URL}/cashier/signin",
            {"login": CHECKBOX_LOGIN, "password": CHECKBOX_PASSWORD},
        )
        token = resp.get("access_token", "")
        if not token:
            print(f"❌  Login failed — no access_token in response.")
            print(f"    Response: {resp}")
            sys.exit(1)
        print(f"   ✅  Login successful. Token (first 30): {token[:30]}...")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"❌  Login HTTP Error {e.code}: {body}")
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"❌  Connection error: {e.reason}")
        sys.exit(1)

    auth_headers = {"Authorization": f"Bearer {token}"}

    # Step 2: Fetch cashier profile
    print("   Step 2: Fetching cashier profile...")
    try:
        status, profile = get_json(f"{CHECKBOX_API_URL}/cashier/me", auth_headers)
        print(f"   Cashier Name: {profile.get('full_name', 'N/A')}")
        print(f"   Cashier ID:   {profile.get('id', 'N/A')}")
        print(f"✅  Checkbox auth confirmed!")
    except urllib.error.HTTPError as e:
        print(f"❌  Profile fetch failed {e.code}: {e.read().decode()}")
        sys.exit(1)

    # Step 3: Check shift status (informational)
    print("   Step 3: Checking active shift status...")
    try:
        status, shift = get_json(f"{CHECKBOX_API_URL}/shifts/current", auth_headers)
        shift_status = shift.get("status", "unknown")
        shift_id = shift.get("id", "N/A")
        if shift_status == "OPENED":
            print(f"   ✅  Shift is OPEN. Shift ID: {shift_id}")
        else:
            print(f"   ⚠️   No open shift found (status: {shift_status}).")
            print("       → A shift must be opened before issuing receipts.")
            print("       → lib/checkbox.ts will auto-open a shift when needed.")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print("   ℹ️   No active shift. Will be opened automatically at first receipt.")
        else:
            print(f"   ⚠️   Could not fetch shift: {e.code}")

if __name__ == "__main__":
    verify()
