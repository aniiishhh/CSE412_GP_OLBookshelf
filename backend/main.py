from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from config import get_db, test_connection

# Import all models to ensure SQLAlchemy registers them
from models import User, Book, Author, Genre, BookAuthor, BookGenre, ReadingList

# Import routers
from routers import books, authors, genres, users, readinglist, auth

# Initialize FastAPI application
app = FastAPI(
    title="Online Bookshelf API",
    description="API for the Online Bookshelf web application",
    version="1.0.0",
)

# Include routers
app.include_router(auth.router)  # Auth router first for /auth/login and /auth/register
app.include_router(books.router)
app.include_router(authors.router)
app.include_router(genres.router)
app.include_router(users.router)
app.include_router(readinglist.router)


# Root endpoint
@app.get("/", tags=["root"])
def read_root():
    return {"message": "API running"}


# Database connection test endpoint
@app.get("/db-test", tags=["root"])
def test_db():
    success, result = test_connection()
    if not success:
        raise HTTPException(status_code=500, detail=result)
    return {"message": "Database connection successful"}


# Remove the hardcoded endpoint


# Error handling for common HTTP errors
@app.exception_handler(404)
async def not_found_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found", "path": request.url.path},
    )


@app.exception_handler(500)
async def internal_error_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "path": request.url.path},
    )


@app.exception_handler(422)
async def validation_error_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error - check your request parameters",
            "errors": exc.detail if hasattr(exc, "detail") else None,
        },
    )


# Catch all other exceptions
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred", "path": request.url.path},
    )
