from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional

from config import get_db
from models import User, ReadingList
from models import UserResponse, UserCreate

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[UserResponse])
def read_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Get all users with pagination.
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    """
    Get a user by ID.
    """
    user = db.query(User).filter(User.userid == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/email/{email}", response_model=UserResponse)
def read_user_by_email(email: str, db: Session = Depends(get_db)):
    """
    Get a user by email.
    """
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user.
    Note: In a real application, this would include password hashing.
    """
    try:
        # Check if the user already exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(
                status_code=400, detail=f"User with email '{user.email}' already exists"
            )

        # In Phase 2, we'll add proper password hashing. For now, a placeholder:
        password_hash = f"placeholder_hash_{user.password}"

        # Create new user
        db_user = User(
            email=user.email,
            passwordhash=password_hash,
            displayname=user.displayname,
            role="USER",  # Default role
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    """
    Update a user by ID.
    Note: In a real application, this would include password hashing.
    """
    try:
        # Check if the user exists
        db_user = db.query(User).filter(User.userid == user_id).first()
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if the email is already in use by another user
        if user.email != db_user.email:
            existing_user = db.query(User).filter(User.email == user.email).first()
            if existing_user:
                raise HTTPException(
                    status_code=400, detail=f"Email '{user.email}' is already in use"
                )

        # In Phase 2, we'll add proper password hashing. For now, a placeholder:
        password_hash = f"placeholder_hash_{user.password}"

        # Update user
        db_user.email = user.email
        db_user.passwordhash = password_hash
        db_user.displayname = user.displayname

        db.commit()
        db.refresh(db_user)
        return db_user

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Delete a user by ID.
    """
    try:
        # Check if the user exists
        db_user = db.query(User).filter(User.userid == user_id).first()
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if the user has reading lists
        reading_list_count = (
            db.query(ReadingList).filter(ReadingList.userid == user_id).count()
        )
        if reading_list_count > 0:
            # In a real app, you might want to delete these or make them anonymous
            # For now, we'll prevent deletion if user has reading lists
            raise HTTPException(
                status_code=400,
                detail=f"Cannot delete user with {reading_list_count} reading list items. Remove these first.",
            )

        # Delete the user
        db.delete(db_user)
        db.commit()
        return None

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/count", response_model=dict)
def count_users(db: Session = Depends(get_db)):
    """
    Get the total number of users in the database.
    """
    count = db.query(User).count()
    return {"count": count}
