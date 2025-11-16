# Online Bookshelf Backend

This directory contains the FastAPI backend for the Online Bookshelf web application.

## Structure

```
backend/
├── main.py        # Main FastAPI application entry point
├── config.py      # Database configuration and connection
├── db_test.py     # Database connection test script
├── env.example    # Example environment variables (rename to .env)
└── routers/       # (Future) API route modules directory
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
