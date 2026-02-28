#!/usr/bin/env python3
"""
verify_nova_poshta.py — Phase 2: Link
Tests Nova Poshta API key by:
  1. Searching for a well-known city (Kyiv / Київ) via Address.getCities
  2. Fetching warehouses in Kyiv as a secondary check
  3. Validating sender counterparty ref (if provided)

Nova Poshta uses JSON-RPC style — all calls POST to a single endpoint.
"""

import os
import sys
import json
import urllib.request
import urllib.error
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))

NP_API_KEY = os.getenv("NOVA_POSHTA_API_KEY", "")
NP_API_URL = os.getenv("NOVA_POSHTA_API_URL", "https://api.novaposhta.ua/v2.0/json/")
NP_SENDER_REF = os.getenv("NOVA_POSHTA_SENDER_REF", "")

def check_env():
    missing = []
    if not NP_API_KEY or NP_API_KEY == "your-nova-poshta-api-key":
        missing.append("NOVA_POSHTA_API_KEY")
    return missing

def np_call(model, method, props):
    """Make a Nova Poshta JSON-RPC call."""
    payload = {
        "apiKey": NP_API_KEY,
        "modelName": model,
        "calledMethod": method,
        "methodProperties": props,
    }
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        NP_API_URL,
        data=body,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())

def verify():
    print("=" * 60)
    print("🔍  NOVA POSHTA VERIFICATION")
    print("=" * 60)

    missing = check_env()
    if missing:
        print(f"❌  Missing env vars: {', '.join(missing)}")
        print("    → Fill in .env.local and re-run.")
        sys.exit(1)

    # Step 1: Search for Kyiv
    print("   Step 1: Searching for city 'Київ'...")
    try:
        resp = np_call("Address", "getCities", {"FindByString": "Київ", "Page": 1, "Limit": 5})
        if not resp.get("success"):
            errors = resp.get("errors", [])
            print(f"❌  API returned errors: {errors}")
            if any("apiKey" in e.lower() for e in errors):
                print("    → API key is invalid or inactive.")
            sys.exit(1)

        cities = resp.get("data", [])
        if not cities:
            print("❌  No cities returned. Unexpected response.")
            sys.exit(1)

        kyiv = next((c for c in cities if "Київ" in c.get("Description", "")), cities[0])
        kyiv_ref = kyiv.get("Ref")
        print(f"   City: {kyiv.get('Description', 'N/A')} (Ref: {kyiv_ref})")
        print(f"✅  Nova Poshta API key is valid!")
    except urllib.error.URLError as e:
        print(f"❌  Connection error: {e.reason}")
        sys.exit(1)

    # Step 2: Fetch warehouses in Kyiv
    print("   Step 2: Fetching first 3 warehouses in Київ...")
    try:
        resp2 = np_call("Address", "getWarehouses", {
            "CityRef": kyiv_ref,
            "Page": 1,
            "Limit": 3,
        })
        warehouses = resp2.get("data", [])
        for wh in warehouses:
            print(f"   📦 {wh.get('Description', 'N/A')}")
        print(f"✅  Warehouse lookup working. ({resp2.get('info', {}).get('totalCount', '?')} total in Київ)")
    except urllib.error.URLError as e:
        print(f"⚠️   Warehouse lookup failed (non-critical): {e.reason}")

    # Step 3: Validate sender ref (informational)
    if NP_SENDER_REF and NP_SENDER_REF != "your-sender-counterparty-ref":
        print(f"   Step 3: Sender Ref provided: {NP_SENDER_REF}")
        print("   ℹ️   Sender ref validation requires TTN creation — will be tested in Phase 3.")
    else:
        print("   ⚠️   NOVA_POSHTA_SENDER_REF not set.")
        print("       → Required for TTN creation. Set it before Phase 3.")

if __name__ == "__main__":
    verify()
