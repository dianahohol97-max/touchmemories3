#!/usr/bin/env python3
"""
verify_monobank.py — Phase 2: Link
Tests Monobank Acquiring token by calling the public key endpoint.
A valid 200 response means the token is active and the merchant account is accessible.
"""

import os
import sys
import json
import urllib.request
import urllib.error
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))

MONOBANK_TOKEN = os.getenv("MONOBANK_TOKEN", "")

PUBKEY_URL = "https://api.monobank.ua/api/merchant/pubkey"
MERCHANT_INFO_URL = "https://api.monobank.ua/api/merchant/details"

def check_env():
    if not MONOBANK_TOKEN or MONOBANK_TOKEN == "your-monobank-api-token":
        return ["MONOBANK_TOKEN"]
    return []

def verify():
    print("=" * 60)
    print("🔍  MONOBANK ACQUIRING VERIFICATION")
    print("=" * 60)

    missing = check_env()
    if missing:
        print(f"❌  Missing env vars: {', '.join(missing)}")
        print("    → Fill in .env.local and re-run.")
        sys.exit(1)

    # Fetch merchant public key — proves token is valid
    req = urllib.request.Request(
        PUBKEY_URL,
        headers={"X-Token": MONOBANK_TOKEN},
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = json.loads(resp.read().decode())
            print(f"   HTTP Status: {resp.status}")
            print(f"   Public Key (first 40 chars): {body.get('key', '')[:40]}...")
            print(f"✅  Monobank token is valid!")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"❌  HTTP Error {e.code}: {body}")
        if e.code == 403:
            print("    → Token is invalid or not activated for acquiring.")
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"❌  Connection error: {e.reason}")
        sys.exit(1)

    # Also fetch merchant details for extra confirmation
    req2 = urllib.request.Request(
        MERCHANT_INFO_URL,
        headers={"X-Token": MONOBANK_TOKEN},
    )
    try:
        with urllib.request.urlopen(req2, timeout=10) as resp:
            details = json.loads(resp.read().decode())
            print(f"   Merchant Name: {details.get('name', 'N/A')}")
            print(f"   Merchant EDRPOU/IPN: {details.get('edrpou', 'N/A')}")
    except Exception:
        pass  # Details are bonus info, not critical for verification

if __name__ == "__main__":
    verify()
