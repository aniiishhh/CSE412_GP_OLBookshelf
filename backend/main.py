from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from config import get_db, test_connection

# Initialize FastAPI application
app = FastAPI(
    title="Online Bookshelf API",
    description="API for the Online Bookshelf web application",
    version="1.0.0",
)


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "API running"}


# Database connection test endpoint
@app.get("/db-test")
def test_db():
    success, result = test_connection()
    if not success:
        raise HTTPException(status_code=500, detail=result)
    return {"message": "Database connection successful"}
