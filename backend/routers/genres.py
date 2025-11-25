from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional

from config import get_db
from models import Genre, BookGenre, Book
from models import GenreResponse, GenreCreate, BookResponse

router = APIRouter(
    prefix="/genres",
    tags=["genres"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[GenreResponse])
def read_genres(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=10000),
    name: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Get all genres with optional filtering by name.
    """
    query = db.query(Genre)

    # Apply filters if provided
    if name:
        query = query.filter(Genre.name.ilike(f"%{name}%"))

    # Apply pagination
    genres = query.offset(skip).limit(limit).all()
    return genres


@router.get("/{genre_id}", response_model=GenreResponse)
def read_genre(genre_id: int, db: Session = Depends(get_db)):
    """
    Get a genre by ID.
    """
    genre = db.query(Genre).filter(Genre.genreid == genre_id).first()
    if genre is None:
        raise HTTPException(status_code=404, detail="Genre not found")
    return genre


@router.get("/{genre_id}/books", response_model=List[BookResponse])
def read_genre_books(
    genre_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Get all books in a specific genre.
    """
    # Check if the genre exists
    genre = db.query(Genre).filter(Genre.genreid == genre_id).first()
    if genre is None:
        raise HTTPException(status_code=404, detail="Genre not found")

    # Get books for this genre
    books = (
        db.query(Book)
        .join(BookGenre, BookGenre.bookid == Book.bookid)
        .filter(BookGenre.genreid == genre_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return books


@router.post("/", response_model=GenreResponse, status_code=201)
def create_genre(genre: GenreCreate, db: Session = Depends(get_db)):
    """
    Create a new genre.
    """
    try:
        # Check if the genre already exists
        existing_genre = db.query(Genre).filter(Genre.name == genre.name).first()
        if existing_genre:
            raise HTTPException(
                status_code=400, detail=f"Genre with name '{genre.name}' already exists"
            )

        # Create new genre
        db_genre = Genre(name=genre.name)
        db.add(db_genre)
        db.commit()
        db.refresh(db_genre)
        return db_genre

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.put("/{genre_id}", response_model=GenreResponse)
def update_genre(genre_id: int, genre: GenreCreate, db: Session = Depends(get_db)):
    """
    Update a genre by ID.
    """
    try:
        # Check if the genre exists
        db_genre = db.query(Genre).filter(Genre.genreid == genre_id).first()
        if db_genre is None:
            raise HTTPException(status_code=404, detail="Genre not found")

        # Check if the new name conflicts with an existing genre
        if genre.name != db_genre.name:
            existing_genre = db.query(Genre).filter(Genre.name == genre.name).first()
            if existing_genre:
                raise HTTPException(
                    status_code=400,
                    detail=f"Genre with name '{genre.name}' already exists",
                )

        # Update genre
        db_genre.name = genre.name
        db.commit()
        db.refresh(db_genre)
        return db_genre

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{genre_id}", status_code=204)
def delete_genre(genre_id: int, db: Session = Depends(get_db)):
    """
    Delete a genre by ID.
    """
    try:
        # Check if the genre exists
        db_genre = db.query(Genre).filter(Genre.genreid == genre_id).first()
        if db_genre is None:
            raise HTTPException(status_code=404, detail="Genre not found")

        # Check if the genre has books associated
        book_count = db.query(BookGenre).filter(BookGenre.genreid == genre_id).count()
        if book_count > 0:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot delete genre with {book_count} associated books. Remove book associations first.",
            )

        # Delete the genre
        db.delete(db_genre)
        db.commit()
        return None

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/top/", response_model=List[dict])
def get_top_genres(db: Session = Depends(get_db), limit: int = 10):
    """
    Get top genres by number of books.
    """
    from sqlalchemy import func, desc

    top_genres = (
        db.query(
            Genre.genreid, Genre.name, func.count(BookGenre.bookid).label("book_count")
        )
        .join(BookGenre, BookGenre.genreid == Genre.genreid)
        .group_by(Genre.genreid, Genre.name)
        .order_by(desc("book_count"))
        .limit(limit)
        .all()
    )

    result = [
        {"id": g.genreid, "name": g.name, "book_count": g.book_count}
        for g in top_genres
    ]

    return result


@router.get("/count", response_model=dict)
def count_genres(db: Session = Depends(get_db)):
    """
    Get the total number of genres in the database.
    """
    count = db.query(Genre).count()
    return {"count": count}
