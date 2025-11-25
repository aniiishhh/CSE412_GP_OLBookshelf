from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional

from config import get_db
from models import Author, BookAuthor, Book
from models import AuthorResponse, AuthorCreate, BookResponse

router = APIRouter(
    prefix="/authors",
    tags=["authors"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[AuthorResponse])
def read_authors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=10000),
    name: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Get all authors with optional filtering by name.
    """
    query = db.query(Author)

    # Apply filters if provided
    if name:
        query = query.filter(Author.name.ilike(f"%{name}%"))

    # Apply pagination
    authors = query.offset(skip).limit(limit).all()
    return authors


@router.get("/{author_id}", response_model=AuthorResponse)
def read_author(author_id: int, db: Session = Depends(get_db)):
    """
    Get an author by ID.
    """
    author = db.query(Author).filter(Author.authorid == author_id).first()
    if author is None:
        raise HTTPException(status_code=404, detail="Author not found")
    return author


@router.get("/{author_id}/books", response_model=List[BookResponse])
def read_author_books(
    author_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Get all books by a specific author.
    """
    # Check if the author exists
    author = db.query(Author).filter(Author.authorid == author_id).first()
    if author is None:
        raise HTTPException(status_code=404, detail="Author not found")

    # Get books for this author
    books = (
        db.query(Book)
        .join(BookAuthor, BookAuthor.bookid == Book.bookid)
        .filter(BookAuthor.authorid == author_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return books


@router.post("/", response_model=AuthorResponse, status_code=201)
def create_author(author: AuthorCreate, db: Session = Depends(get_db)):
    """
    Create a new author.
    """
    try:
        # Check if the author already exists
        existing_author = db.query(Author).filter(Author.name == author.name).first()
        if existing_author:
            raise HTTPException(
                status_code=400,
                detail=f"Author with name '{author.name}' already exists",
            )

        # Create new author
        db_author = Author(name=author.name)
        db.add(db_author)
        db.commit()
        db.refresh(db_author)
        return db_author

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.put("/{author_id}", response_model=AuthorResponse)
def update_author(author_id: int, author: AuthorCreate, db: Session = Depends(get_db)):
    """
    Update an author by ID.
    """
    try:
        # Check if the author exists
        db_author = db.query(Author).filter(Author.authorid == author_id).first()
        if db_author is None:
            raise HTTPException(status_code=404, detail="Author not found")

        # Check if the new name conflicts with an existing author
        if author.name != db_author.name:
            existing_author = (
                db.query(Author).filter(Author.name == author.name).first()
            )
            if existing_author:
                raise HTTPException(
                    status_code=400,
                    detail=f"Author with name '{author.name}' already exists",
                )

        # Update author
        db_author.name = author.name
        db.commit()
        db.refresh(db_author)
        return db_author

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{author_id}", status_code=204)
def delete_author(author_id: int, db: Session = Depends(get_db)):
    """
    Delete an author by ID.
    """
    try:
        # Check if the author exists
        db_author = db.query(Author).filter(Author.authorid == author_id).first()
        if db_author is None:
            raise HTTPException(status_code=404, detail="Author not found")

        # Check if the author has books associated
        book_count = (
            db.query(BookAuthor).filter(BookAuthor.authorid == author_id).count()
        )
        if book_count > 0:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot delete author with {book_count} associated books. Remove book associations first.",
            )

        # Delete the author
        db.delete(db_author)
        db.commit()
        return None

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/count", response_model=dict)
def count_authors(db: Session = Depends(get_db)):
    """
    Get the total number of authors in the database.
    """
    count = db.query(Author).count()
    return {"count": count}
