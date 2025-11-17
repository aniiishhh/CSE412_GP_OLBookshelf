from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional

from config import get_db
from models import ReadingList, User, Book
from models import ReadingListResponse, ReadingListCreate, ReadingListUpdate

router = APIRouter(
    prefix="/readinglist",
    tags=["readinglist"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{user_id}", response_model=List[ReadingListResponse])
def read_user_reading_list(
    user_id: int,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Get a user's reading list with optional filtering by status.
    """
    # Check if the user exists
    user = db.query(User).filter(User.userid == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Query reading list
    query = db.query(ReadingList).filter(ReadingList.userid == user_id)

    # Apply status filter if provided
    if status:
        if status.lower() not in ["want", "reading", "completed", "dropped"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid status. Must be one of: want, reading, completed, dropped",
            )
        query = query.filter(ReadingList.status == status.lower())

    # Apply pagination
    reading_list = query.offset(skip).limit(limit).all()
    return reading_list


@router.get("/{user_id}/{book_id}", response_model=ReadingListResponse)
def read_user_book_status(user_id: int, book_id: int, db: Session = Depends(get_db)):
    """
    Get a specific book from a user's reading list.
    """
    # Check if the record exists
    reading_list_item = (
        db.query(ReadingList)
        .filter(ReadingList.userid == user_id, ReadingList.bookid == book_id)
        .first()
    )

    if reading_list_item is None:
        raise HTTPException(
            status_code=404,
            detail=f"Book {book_id} not found in user {user_id}'s reading list",
        )

    return reading_list_item


@router.post("/", response_model=ReadingListResponse, status_code=201)
def add_to_reading_list(
    item: ReadingListCreate, user_id: int, db: Session = Depends(get_db)
):
    """
    Add a book to a user's reading list.
    """
    try:
        # Check if the user exists
        user = db.query(User).filter(User.userid == user_id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if the book exists
        book = db.query(Book).filter(Book.bookid == item.bookid).first()
        if book is None:
            raise HTTPException(status_code=404, detail="Book not found")

        # Check if the book is already in the user's reading list
        existing_item = (
            db.query(ReadingList)
            .filter(ReadingList.userid == user_id, ReadingList.bookid == item.bookid)
            .first()
        )

        if existing_item:
            raise HTTPException(
                status_code=400, detail="Book already exists in the user's reading list"
            )

        # Create new reading list item
        db_item = ReadingList(
            userid=user_id,
            bookid=item.bookid,
            status=item.status,
            progresspages=item.progresspages,
            userrating=item.userrating,
            note=item.note,
        )

        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.patch("/{user_id}/{book_id}", response_model=ReadingListResponse)
def update_reading_list_item(
    user_id: int, book_id: int, item: ReadingListUpdate, db: Session = Depends(get_db)
):
    """
    Update a book's status, progress, rating, or note in a user's reading list.
    """
    try:
        # Check if the record exists
        db_item = (
            db.query(ReadingList)
            .filter(ReadingList.userid == user_id, ReadingList.bookid == book_id)
            .first()
        )

        if db_item is None:
            raise HTTPException(
                status_code=404,
                detail=f"Book {book_id} not found in user {user_id}'s reading list",
            )

        # Update fields
        db_item.status = item.status
        if item.progresspages is not None:
            db_item.progresspages = item.progresspages
        if item.userrating is not None:
            db_item.userrating = item.userrating
        if item.note is not None:
            db_item.note = item.note

        db.commit()
        db.refresh(db_item)
        return db_item

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{user_id}/{book_id}", status_code=204)
def delete_reading_list_item(user_id: int, book_id: int, db: Session = Depends(get_db)):
    """
    Remove a book from a user's reading list.
    """
    try:
        # Check if the record exists
        db_item = (
            db.query(ReadingList)
            .filter(ReadingList.userid == user_id, ReadingList.bookid == book_id)
            .first()
        )

        if db_item is None:
            raise HTTPException(
                status_code=404,
                detail=f"Book {book_id} not found in user {user_id}'s reading list",
            )

        # Delete the reading list item
        db.delete(db_item)
        db.commit()
        return None

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/stats/{user_id}", response_model=dict)
def get_reading_stats(user_id: int, db: Session = Depends(get_db)):
    """
    Get statistics about a user's reading list.
    """
    from sqlalchemy import func

    # Check if the user exists
    user = db.query(User).filter(User.userid == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Get counts by status
    status_counts = (
        db.query(ReadingList.status, func.count(ReadingList.bookid).label("count"))
        .filter(ReadingList.userid == user_id)
        .group_by(ReadingList.status)
        .all()
    )

    # Convert to dictionary
    status_dict = {status: count for status, count in status_counts}

    # Get average rating given by user
    avg_rating = (
        db.query(func.avg(ReadingList.userrating).label("avg_rating"))
        .filter(ReadingList.userid == user_id, ReadingList.userrating.isnot(None))
        .scalar()
    )

    # Get total number of books in reading list
    total_books = db.query(ReadingList).filter(ReadingList.userid == user_id).count()

    return {
        "total_books": total_books,
        "average_rating": float(avg_rating) if avg_rating else None,
        "status_counts": {
            "want": status_dict.get("want", 0),
            "reading": status_dict.get("reading", 0),
            "completed": status_dict.get("completed", 0),
            "dropped": status_dict.get("dropped", 0),
        },
    }
