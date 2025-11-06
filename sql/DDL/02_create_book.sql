DROP TABLE IF EXISTS Book CASCADE;

CREATE TABLE Book (
    BookID SERIAL PRIMARY KEY,
    Title VARCHAR(500) NOT NULL,
    Description TEXT,
    BookFormat VARCHAR(50),
    Pages INT CHECK (Pages >= 0),
    AverageRating DECIMAL(2,1) CHECK (AverageRating >= 0 AND AverageRating <= 5),
    TotalRatings INT CHECK (TotalRatings >= 0),
    ReviewsCount INT CHECK (ReviewsCount >= 0),
    ISBN VARCHAR(20) UNIQUE NOT NULL,
    ISBN13 VARCHAR(30),
    ImageURL TEXT,
    GoodreadsLink TEXT
);
