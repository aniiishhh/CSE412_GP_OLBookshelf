# Online Bookshelf Backend

This directory contains the FastAPI backend for the Online Bookshelf web application.

## Structure

```
backend/
├── main.py        # Main FastAPI application entry point
├── config.py      # Database configuration and connection
├── models.py      # SQLAlchemy ORM models and Pydantic schemas
├── db_test.py     # Database connection test script
├── test_models.py # Test script for ORM models
├── test_api.py    # Test script for API endpoints
├── env.example    # Example environment variables (rename to .env)
└── routers/       # API route modules directory
    ├── __init__.py    # Package initialization
    ├── books.py       # Book-related endpoints
    ├── authors.py     # Author-related endpoints
    ├── genres.py      # Genre-related endpoints
    ├── users.py       # User-related endpoints
    └── readinglist.py # Reading list endpoints
```

## Getting Started

1. Activate the virtual environment:

   ```
   source ../venv/bin/activate
   ```

2. Install required packages (if not already installed):

   ```
   pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv
   ```

3. Create a `.env` file with your database credentials:

   ```
   cp env.example .env
   # Edit .env with your actual database credentials
   ```

4. Test your database connection:

   ```
   python db_test.py
   ```

5. Run the FastAPI server:

   ```
   uvicorn main:app --reload
   ```

6. Access the API at [http://127.0.0.1:8000](http://127.0.0.1:8000)
7. Access the API documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
8. Test the database connection endpoint at [http://127.0.0.1:8000/db-test](http://127.0.0.1:8000/db-test)
9. Test the ORM models with:

   ```
   python test_models.py
   ```

10. Check the book count endpoint at [http://127.0.0.1:8000/books/count](http://127.0.0.1:8000/books/count)
11. Test all API endpoints with:

```
python test_api.py
```

12. Explore the API documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
