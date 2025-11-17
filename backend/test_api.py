"""
API Endpoint Test Script - Phase 1, Step 4
This script tests that the API endpoints are working correctly.
"""

import requests
import json
from pprint import pprint
from typing import Dict, Any

# Constants
BASE_URL = "http://127.0.0.1:8000"


def test_endpoint(
    endpoint: str,
    method: str = "GET",
    data: Dict[str, Any] = None,
    expected_status: int = None,
) -> None:
    """Test an API endpoint with optional expected status code"""
    url = f"{BASE_URL}{endpoint}"
    print(f"\n🔍 Testing {method} {url}")
    print("=" * 50)

    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        else:
            print(f"❌ Unsupported method: {method}")
            return

        print(f"Status Code: {response.status_code}")

        if response.status_code == 204:
            print("No content response (success)")
            return

        # Parse JSON response
        try:
            response_data = response.json()
            print("\nResponse:")
            if isinstance(response_data, list):
                print(f"List with {len(response_data)} items. First item:")
                if response_data:
                    pprint(response_data[0], depth=1, compact=True)
            else:
                # For dictionaries or other types, limit output
                pprint(response_data, depth=1, compact=True)
        except json.JSONDecodeError:
            print(f"Response is not JSON: {response.text[:100]}")

        # Check if status code matches expected value (if provided)
        if expected_status is not None:
            if response.status_code == expected_status:
                print(f"\n✅ Test passed with expected status code {expected_status}!")
            else:
                print(
                    f"\n❌ Test failed! Expected {expected_status}, got {response.status_code}"
                )
        else:
            # Default behavior for expected success
            if 200 <= response.status_code < 300:
                print("\n✅ Test passed!")
            else:
                print(f"\n❌ Test failed with status code {response.status_code}")

    except requests.RequestException as e:
        print(f"\n❌ Request error: {e}")
        print("\nMake sure the API server is running: uvicorn main:app --reload")


def main():
    print("\n📋 API Endpoint Test Suite")
    print("=" * 50)

    # Root endpoint
    test_endpoint("/")

    # Database test endpoint
    test_endpoint("/db-test")

    # Books endpoints
    test_endpoint("/books")
    test_endpoint(
        "/books/count/"
    )  # Using the proper router endpoint with trailing slash
    test_endpoint("/books/1")  # Assuming book ID 1 exists

    # Error handling tests
    print("\n--- Error Handling Tests ---")
    test_endpoint(
        "/books/999999", expected_status=404
    )  # Testing non-existent book ID (404)
    test_endpoint("/invalid/path", expected_status=404)  # Testing invalid path (404)
    test_endpoint(
        "/books/invalid", expected_status=422
    )  # Testing invalid parameter type (422)

    # Authors endpoints
    test_endpoint("/authors")
    test_endpoint("/authors/1")  # Assuming author ID 1 exists
    test_endpoint("/authors/1/books")  # Books by author ID 1

    # Genres endpoints
    test_endpoint("/genres")
    test_endpoint("/genres/1")  # Assuming genre ID 1 exists
    # Testing the top genres endpoint
    test_endpoint("/genres/top/")  # Top genres with default limit

    print("\n✅ API test suite completed!")
    print("To run the full API, use the command: uvicorn main:app --reload")
    print("Access the API documentation at: http://127.0.0.1:8000/docs")


if __name__ == "__main__":
    main()
