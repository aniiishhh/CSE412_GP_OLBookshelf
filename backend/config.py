import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import psycopg2

# Load environment variables from .env file
load_dotenv()

# Database connection settings
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "bookshelf")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

# SQLAlchemy connection URL
if DB_PASSWORD:
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
else:
    DATABASE_URL = f"postgresql://{DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Check connection before using from pool
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create declarative base for ORM models
Base = declarative_base()


# Function to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Function to test database connection
def test_connection():
    """Test database connection"""
    try:
        with engine.connect() as connection:
            # Execute the query and fetch a full row as a dictionary
            result_proxy = connection.execute(text("SELECT * FROM book LIMIT 1"))
            column_names = result_proxy.keys()
            row = result_proxy.fetchone()

            if row:
                # Convert row to a dictionary
                book_data = {col: value for col, value in zip(column_names, row)}
                return True, {
                    "message": "Database connection successful",
                    "result": book_data,
                }
            else:
                return True, {
                    "message": "Database connection successful, but no books found",
                    "result": None,
                }
    except Exception as e:
        return False, {"message": "Database connection failed", "error": str(e)}
