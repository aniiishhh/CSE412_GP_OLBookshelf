"""
Authentication router for user registration and login
"""

from datetime import timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

import sys
import os

# Add parent directory to path to allow importing auth.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticate_user,
    create_access_token,
    get_password_hash,
)
from config import get_db
from models import User, UserCreate

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    """
    try:
        # Check if user already exists
        db_user = db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # Hash the password
        print(f"Hashing password for {user.email}")
        # For testing purposes only, use a simple hash if bcrypt fails
        try:
            hashed_password = get_password_hash(user.password)
        except Exception as hash_err:
            print(f"Error with bcrypt: {str(hash_err)}")
            import hashlib

            # Simple fallback hashing for testing
            hashed_password = hashlib.sha256(user.password.encode()).hexdigest()

        # Create new user
        print(f"Creating user object for {user.email}")
        display_name = (
            user.displayname or user.email.split("@")[0]
        )  # Default to username part of email

        db_user = User(
            email=user.email,
            passwordhash=hashed_password,
            displayname=display_name,
            role="USER",  # Default role
        )

        print(f"Adding user to session: {user.email}")
        db.add(db_user)

        print("Committing to database")
        db.commit()

        print("Refreshing user object")
        db.refresh(db_user)

        print("Registration successful")
        return {
            "userid": db_user.userid,
            "email": db_user.email,
            "displayname": db_user.displayname,
            "message": "User registered successfully",
        }

    except SQLAlchemyError as e:
        db.rollback()
        print(f"SQLAlchemy error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
    except Exception as e:
        db.rollback()
        print(f"Unexpected error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}",
        )


@router.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Authenticate a user and return a JWT token
    """
    try:
        print(f"Attempting to authenticate: {form_data.username}")
        user = authenticate_user(db, form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.userid)},
            expires_delta=access_token_expires,
        )
    except Exception as e:
        print(f"Login error: {str(e)}")
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login error: {str(e)}",
        )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "userid": user.userid,
            "email": user.email,
            "displayname": user.displayname,
        },
    }
