"""
Test script for ORM models - Phase 1, Step 3
This script tests that the ORM models correctly map to the database tables
by running a count query on the book table.
"""

from sqlalchemy.orm import Session
from config import engine, get_db
from models import Book


def test_book_count():
    """Test that we can count the number of books in the database"""

    # Get a database session
    db = next(get_db())

    try:
        # Count the books
        book_count = db.query(Book).count()

        print("\n📚 Book Count Test")
        print("=" * 40)
        print(f"Total books in database: {book_count}")

        # Test a simple query to get one book
        first_book = db.query(Book).first()
        if first_book:
            print("\n📖 Sample Book:")
            print(f"Title: {first_book.title}")
            print(f"ISBN: {first_book.isbn}")
            print(f"Average Rating: {first_book.averagerating}")

            # Get authors for this book if any
            if first_book.authors:
                print("\nAuthors:")
                for author in first_book.authors:
                    print(f"- {author.name}")

            # Get genres for this book if any
            if first_book.genres:
                print("\nGenres:")
                for genre in first_book.genres:
                    print(f"- {genre.name}")

        return book_count

    finally:
        db.close()


if __name__ == "__main__":
    print("\n🔍 Testing ORM models with database...")
    try:
        count = test_book_count()
        print("\n✅ SUCCESS: ORM models are correctly mapping to database tables!")
        print(f"Found {count} books in the database.")
    except Exception as e:
        print(f"\n❌ ERROR: Failed to test ORM models: {str(e)}")
        print("\nPlease check your database connection and model definitions.")
