DROP TABLE IF EXISTS ReadingList CASCADE;

CREATE TABLE ReadingList (
    UserID INT NOT NULL,
    BookID INT NOT NULL,
    Status VARCHAR(15) NOT NULL CHECK (Status IN ('WANT', 'READING', 'COMPLETED', 'DROPPED')),
    ProgressPages INT CHECK (ProgressPages >= 0),
    UserRating DECIMAL(2,1) CHECK (UserRating >= 0 AND UserRating <= 5),
    Note TEXT,
    AddedAt TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (UserID, BookID),
    FOREIGN KEY (UserID) REFERENCES "User"(UserID) ON DELETE CASCADE,
    FOREIGN KEY (BookID) REFERENCES Book(BookID) ON DELETE CASCADE
);