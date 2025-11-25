from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime,
    ForeignKey,
    CheckConstraint,
    func,
)
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import datetime

from config import Base


# SQLAlchemy ORM Models


class User(Base):
    __tablename__ = "User"

    userid = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    passwordhash = Column(Text, nullable=False)
    displayname = Column(String(100))
    role = Column(String(10), default="USER")
    createdat = Column(DateTime, default=func.now())

    # Relationships
    reading_lists = relationship("ReadingList", back_populates="user")


class Book(Base):
    __tablename__ = "book"

    bookid = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text)
    bookformat = Column(String(50))
    pages = Column(Integer)
    averagerating = Column(Float)
    totalratings = Column(Integer)
    reviewscount = Column(Integer)
    isbn = Column(String(20), unique=True, nullable=False)
    isbn13 = Column(String(30))
    imageurl = Column(Text)
    goodreadslink = Column(Text)

    # Relationships
    authors = relationship("Author", secondary="bookauthor", back_populates="books")
    genres = relationship("Genre", secondary="bookgenre", back_populates="books")
    reading_lists = relationship("ReadingList", back_populates="book")


class Author(Base):
    __tablename__ = "author"

    authorid = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)

    # Relationships
    books = relationship("Book", secondary="bookauthor", back_populates="authors")


class Genre(Base):
    __tablename__ = "genre"

    genreid = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

    # Relationships
    books = relationship("Book", secondary="bookgenre", back_populates="genres")


class BookAuthor(Base):
    __tablename__ = "bookauthor"

    bookid = Column(
        Integer, ForeignKey("book.bookid", ondelete="CASCADE"), primary_key=True
    )
    authorid = Column(
        Integer, ForeignKey("author.authorid", ondelete="CASCADE"), primary_key=True
    )


class BookGenre(Base):
    __tablename__ = "bookgenre"

    bookid = Column(
        Integer, ForeignKey("book.bookid", ondelete="CASCADE"), primary_key=True
    )
    genreid = Column(
        Integer, ForeignKey("genre.genreid", ondelete="CASCADE"), primary_key=True
    )


class ReadingList(Base):
    __tablename__ = "readinglist"

    userid = Column(
        Integer, ForeignKey("User.userid", ondelete="CASCADE"), primary_key=True
    )
    bookid = Column(
        Integer, ForeignKey("book.bookid", ondelete="CASCADE"), primary_key=True
    )
    status = Column(String(15), nullable=False)
    progresspages = Column(Integer)
    userrating = Column(Float)
    note = Column(Text)
    addedat = Column(DateTime, default=func.now())

    # Relationships
    user = relationship("User", back_populates="reading_lists")
    book = relationship("Book", back_populates="reading_lists")

    __table_args__ = (
        CheckConstraint(
            "status IN ('WANT', 'READING', 'COMPLETED', 'DROPPED')", name="valid_status"
        ),
        CheckConstraint("progresspages >= 0", name="valid_progress"),
        CheckConstraint("userrating >= 0 AND userrating <= 5", name="valid_rating"),
    )


# Pydantic Models for API request/response validation


class AuthorBase(BaseModel):
    name: str


class AuthorCreate(AuthorBase):
    pass


class AuthorResponse(AuthorBase):
    authorid: int

    class Config:
        from_attributes = True


class GenreBase(BaseModel):
    name: str


class GenreCreate(GenreBase):
    pass


class GenreResponse(GenreBase):
    genreid: int

    class Config:
        from_attributes = True


class BookBase(BaseModel):
    title: str
    description: Optional[str] = None
    bookformat: Optional[str] = None
    pages: Optional[int] = None
    averagerating: Optional[float] = None
    totalratings: Optional[int] = None
    reviewscount: Optional[int] = None
    isbn: str
    isbn13: Optional[str] = None
    imageurl: Optional[str] = None
    goodreadslink: Optional[str] = None


class BookCreate(BookBase):
    authors: List[str] = []
    genres: List[str] = []


class BookResponse(BookBase):
    bookid: int
    authors: List[AuthorResponse] = []
    genres: List[GenreResponse] = []

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    email: EmailStr
    displayname: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    userid: int
    role: str
    createdat: datetime

    class Config:
        from_attributes = True


class ReadingListBase(BaseModel):
    status: str
    progresspages: Optional[int] = None
    userrating: Optional[float] = None
    note: Optional[str] = None

    @validator("status")
    def validate_status(cls, v):
        allowed = ["WANT", "READING", "COMPLETED", "DROPPED"]
        normalized = v.upper()
        if normalized not in allowed:
            allowed_display = ", ".join(a.lower() for a in allowed)
            raise ValueError(f"Status must be one of: {allowed_display}")
        return normalized

    @validator("userrating")
    def validate_rating(cls, v):
        if v is not None and (v < 0 or v > 5):
            raise ValueError("Rating must be between 0 and 5")
        return v


class ReadingListCreate(ReadingListBase):
    bookid: int


class ReadingListUpdate(ReadingListBase):
    pass


class ReadingListResponse(ReadingListBase):
    userid: int
    bookid: int
    addedat: datetime
    book: BookResponse

    class Config:
        from_attributes = True


class PaginatedBookResponse(BaseModel):
    items: List[BookResponse]
    total: int
    page: int
    limit: int
    pages: int


# Count query function example
def count_books(db):
    """Count the number of books in the database"""
    return db.query(Book).count()
