from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional

from config import get_db
from models import Book, Author, BookAuthor, Genre, BookGenre
from models import BookResponse, BookCreate, PaginatedBookResponse

router = APIRouter(
    prefix="/books",
    tags=["books"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=PaginatedBookResponse)
def read_books(
    skip: int = Query(0, ge=0),
    limit: int = Query(12, ge=1, le=100),
    title: Optional[str] = None,
    author: Optional[List[str]] = Query(None),
    genre: Optional[List[str]] = Query(None),
    min_rating: Optional[float] = None,
    max_rating: Optional[float] = None,
    db: Session = Depends(get_db),
):
    """
    Get all books with optional filtering and pagination.
    """
    query = db.query(Book)

    # Apply filters if provided
    if title:
        query = query.filter(Book.title.ilike(f"%{title}%"))

    if author:
        query = query.join(Book.authors).filter(Author.name.in_(author)).distinct()

    if genre:
        query = query.join(Book.genres).filter(Genre.name.in_(genre)).distinct()

    if min_rating is not None:
        query = query.filter(Book.averagerating >= min_rating)

    if max_rating is not None:
        query = query.filter(Book.averagerating <= max_rating)

    # Get total count before pagination
    total = query.count()

    # Apply pagination
    books = query.offset(skip).limit(limit).all()

    page = (skip // limit) + 1
    pages = (total + limit - 1) // limit if limit > 0 else 0

    return {
        "items": books,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
    }


@router.get("/{book_id}", response_model=BookResponse)
def read_book(book_id: int, db: Session = Depends(get_db)):
    """
    Get a book by ID.
    """
    book = db.query(Book).filter(Book.bookid == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.post("/", response_model=BookResponse, status_code=201)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    """
    Create a new book.
    """
    try:
        # Check if the book already exists
        existing_book = db.query(Book).filter(Book.isbn == book.isbn).first()
        if existing_book:
            raise HTTPException(
                status_code=400, detail=f"Book with ISBN {book.isbn} already exists"
            )

        # Create the book object from the request data
        db_book = Book(
            title=book.title,
            description=book.description,
            bookformat=book.bookformat,
            pages=book.pages,
            averagerating=book.averagerating,
            totalratings=book.totalratings,
            reviewscount=book.reviewscount,
            isbn=book.isbn,
            isbn13=book.isbn13,
            imageurl=book.imageurl,
            goodreadslink=book.goodreadslink,
        )

        # Add the book to the database
        db.add(db_book)
        db.flush()  # Flush to get the book ID

        # Process authors
        for author_name in book.authors:
            # Check if author exists, if not create it
            author = db.query(Author).filter(Author.name == author_name).first()
            if not author:
                author = Author(name=author_name)
                db.add(author)
                db.flush()

            # Create book-author relationship
            book_author = BookAuthor(bookid=db_book.bookid, authorid=author.authorid)
            db.add(book_author)

        # Process genres
        for genre_name in book.genres:
            # Check if genre exists, if not create it
            genre = db.query(Genre).filter(Genre.name == genre_name).first()
            if not genre:
                genre = Genre(name=genre_name)
                db.add(genre)
                db.flush()

            # Create book-genre relationship
            book_genre = BookGenre(bookid=db_book.bookid, genreid=genre.genreid)
            db.add(book_genre)

        # Commit all changes
        db.commit()
        db.refresh(db_book)
        return db_book

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.put("/{book_id}", response_model=BookResponse)
def update_book(book_id: int, book: BookCreate, db: Session = Depends(get_db)):
    """
    Update a book by ID.
    """
    try:
        # Check if the book exists
        db_book = db.query(Book).filter(Book.bookid == book_id).first()
        if db_book is None:
            raise HTTPException(status_code=404, detail="Book not found")

        # Update book details
        db_book.title = book.title
        db_book.description = book.description
        db_book.bookformat = book.bookformat
        db_book.pages = book.pages
        db_book.averagerating = book.averagerating
        db_book.totalratings = book.totalratings
        db_book.reviewscount = book.reviewscount
        db_book.isbn = book.isbn
        db_book.isbn13 = book.isbn13
        db_book.imageurl = book.imageurl
        db_book.goodreadslink = book.goodreadslink

        # Remove existing book-author relationships
        db.query(BookAuthor).filter(BookAuthor.bookid == book_id).delete()

        # Process authors
        for author_name in book.authors:
            # Check if author exists, if not create it
            author = db.query(Author).filter(Author.name == author_name).first()
            if not author:
                author = Author(name=author_name)
                db.add(author)
                db.flush()

            # Create book-author relationship
            book_author = BookAuthor(bookid=db_book.bookid, authorid=author.authorid)
            db.add(book_author)

        # Remove existing book-genre relationships
        db.query(BookGenre).filter(BookGenre.bookid == book_id).delete()

        # Process genres
        for genre_name in book.genres:
            # Check if genre exists, if not create it
            genre = db.query(Genre).filter(Genre.name == genre_name).first()
            if not genre:
                genre = Genre(name=genre_name)
                db.add(genre)
                db.flush()

            # Create book-genre relationship
            book_genre = BookGenre(bookid=db_book.bookid, genreid=genre.genreid)
            db.add(book_genre)

        # Commit all changes
        db.commit()
        db.refresh(db_book)
        return db_book

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{book_id}", status_code=204)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    """
    Delete a book by ID.
    """
    try:
        # Check if the book exists
        db_book = db.query(Book).filter(Book.bookid == book_id).first()
        if db_book is None:
            raise HTTPException(status_code=404, detail="Book not found")

        # Delete the book (cascading will handle related entities)
        db.delete(db_book)
        db.commit()
        return None

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/count/", response_model=dict)
def count_books(db: Session = Depends(get_db)):
    """
    Get the total number of books in the database.
    """
    count = db.query(Book).count()
    return {"count": count}
