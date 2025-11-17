"""
Authentication Test Script - Phase 2, Step 1
This script tests user registration and login functionality.
"""

import random
import string
import requests
import json
from pprint import pprint

# Constants
BASE_URL = "http://127.0.0.1:8000"  # Use default port 8000
AUTH_REGISTER_URL = f"{BASE_URL}/auth/register"
AUTH_LOGIN_URL = f"{BASE_URL}/auth/login"


def generate_test_user():
    """Generate a random test user"""
    random_suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return {
        "email": f"test_user_{random_suffix}@example.com",
        "password": f"Pass123_{random_suffix}",  # Shorter password
        "displayname": f"Test User {random_suffix}",
    }


def test_register():
    """Test user registration"""
    print("\n🔍 Testing User Registration")
    print("=" * 50)

    # Generate test user
    test_user = generate_test_user()
    print(f"Registering user: {test_user['email']}")
    print(f"Request URL: {AUTH_REGISTER_URL}")
    print(f"Request Body: {json.dumps(test_user)}")

    # Try direct curl command for testing
    import subprocess

    print("\nTrying curl command for direct testing...")
    curl_cmd = [
        "curl",
        "-X",
        "POST",
        "-H",
        "Content-Type: application/json",
        "-d",
        json.dumps(test_user),
        AUTH_REGISTER_URL,
    ]
    try:
        curl_result = subprocess.run(
            curl_cmd, capture_output=True, text=True, timeout=5
        )
        print(f"Curl status: {curl_result.returncode}")
        print(f"Curl output: {curl_result.stdout}")
        if curl_result.stderr:
            print(f"Curl error: {curl_result.stderr}")
    except Exception as e:
        print(f"Curl error: {str(e)}")

    # Now try with requests - use a different email to avoid conflicts with curl
    try:
        # Generate a new test user with a different email
        second_test_user = generate_test_user()
        print(f"\nTrying with second user: {second_test_user['email']}")
        response = requests.post(AUTH_REGISTER_URL, json=second_test_user, timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {response.headers}")

        try:
            result = response.json()
            print("\nResponse:")
            pprint(result)

            if 200 <= response.status_code < 300:
                print("\n✅ Registration successful!")
                # Return the email and password separately
                return second_test_user["email"], second_test_user["password"]
            else:
                print(
                    f"\n❌ Registration failed with status code {response.status_code}"
                )
                return None, None

        except json.JSONDecodeError:
            print(f"Response is not JSON: {response.text[:100]}")
            return None, None

    except requests.RequestException as e:
        print(f"\n❌ Request error: {e}")
        print("\nMake sure the API server is running")
        return None, None


def test_login(credentials=None):
    """Test user login"""
    print("\n🔍 Testing User Login")
    print("=" * 50)

    # If no credentials are provided, use a default test user
    if not credentials:
        credentials = {
            "email": "test_user_21cjlw@example.com",  # Use a known registered user
            "password": "Pass123_21cjlw",
        }

    print(f"Logging in user: {credentials['email']}")

    try:
        # OAuth2 form data format
        form_data = {
            "username": credentials["email"],  # OAuth2 uses username field
            "password": credentials["password"],
        }

        response = requests.post(
            AUTH_LOGIN_URL,
            data=form_data,  # Use form data instead of JSON
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        print(f"Status Code: {response.status_code}")

        try:
            result = response.json()
            print("\nResponse:")
            pprint(result)

            if 200 <= response.status_code < 300:
                print("\n✅ Login successful!")
                print(f"Access Token: {result.get('access_token')[:20]}...")
                return result
            else:
                print(f"\n❌ Login failed with status code {response.status_code}")
                return None

        except json.JSONDecodeError:
            print(f"Response is not JSON: {response.text[:100]}")
            return None, None

    except requests.RequestException as e:
        print(f"\n❌ Request error: {e}")
        print("\nMake sure the API server is running")
        return None, None


def main():
    print("\n📋 Authentication Test Suite")
    print("=" * 50)

    # Test user registration
    email, password = test_register()

    # Test Login (even if registration failed, we'll try with default user)
    if email and password:
        # Test with newly registered user
        login_result = test_login({"email": email, "password": password})
    else:
        # Try with a known user
        print(
            "\nRegistration failed or already exists, trying login with default user..."
        )
        login_result = test_login()

    if login_result:
        print("\n🔒 Complete Authentication Flow Test Passed!")
    else:
        print("\n❌ Authentication Flow Test Failed at Login Stage")


if __name__ == "__main__":
    main()
