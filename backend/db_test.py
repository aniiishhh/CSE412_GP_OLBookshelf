"""
Simple database connection test script.
Run this script after creating the .env file with your database credentials.
"""

import os
from config import test_connection, DB_HOST, DB_PORT, DB_NAME, DB_USER


def check_env_file():
    """Check if .env file exists"""
    if not os.path.exists(".env"):
        print("\n❌ ERROR: .env file not found!")
        print("Please create a .env file with your database credentials.")
        print("You can use the env.example file as a template:")
        print("    cp env.example .env\n")
        return False
    return True


def print_connection_info():
    """Print the current connection information"""
    print("\n📊 Current Database Connection Settings:")
    print(f"  • Host: {DB_HOST}")
    print(f"  • Port: {DB_PORT}")
    print(f"  • Database: {DB_NAME}")
    print(f"  • User: {DB_USER}")
    print(f"  • Password: {'*' * 8} (hidden)\n")


def main():
    """Test database connection"""
    print("\n🔍 Online Bookshelf - Database Connection Test\n")

    if not check_env_file():
        return

    print_connection_info()

    print("🔌 Testing database connection...")
    success, result = test_connection()

    if success:
        print("\n✅ SUCCESS: Database connection established successfully!")
        book_data = result.get("result")

        if book_data:
            print("\n📚 Book Record from Database:")
            print("-" * 50)
            for key, value in book_data.items():
                print(f"  {key}: {value}")
            print("-" * 50)
        else:
            print("\n⚠️ No book records found in the database.")

        print("\nYou can now proceed to the next step in Phase 1.")
    else:
        print(f"\n❌ ERROR: {result.get('message')}")
        print(f"   Details: {result.get('error')}")
        print("\n1. Check if PostgreSQL server is running")
        print("2. Verify your database credentials in the .env file")
        print("3. Make sure the database exists")


if __name__ == "__main__":
    main()
