-- 1. Import USERS
COPY "User"(userid, email, passwordhash, displayname, role, createdat)
FROM '/Users/anishk/Documents/ASU Class Files/CSE412/Group Project/OL_Bookshelf/CSE412_GP_OLBookshelf/data/clean_data/users_table.csv'
DELIMITER ',' CSV HEADER;

-- 2. Import BOOKS
COPY Book(title, description, bookformat, pages, averagerating,
          totalratings, reviewscount, isbn, isbn13, imageurl, goodreadslink, bookid)
FROM '/Users/anishk/Documents/ASU Class Files/CSE412/Group Project/OL_Bookshelf/CSE412_GP_OLBookshelf/data/clean_data/books_table.csv'
DELIMITER ',' CSV HEADER;

-- 3. Import AUTHORS
COPY Author(name, authorid)
FROM '/Users/anishk/Documents/ASU Class Files/CSE412/Group Project/OL_Bookshelf/CSE412_GP_OLBookshelf/data/clean_data/authors_table.csv'
DELIMITER ',' CSV HEADER;

-- 4. Import GENRES
COPY Genre(name, genreid)
FROM '/Users/anishk/Documents/ASU Class Files/CSE412/Group Project/OL_Bookshelf/CSE412_GP_OLBookshelf/data/clean_data/genres_table.csv'
DELIMITER ',' CSV HEADER;

-- 5. Import BOOKAUTHOR (Bridge)
COPY BookAuthor(bookid, authorid)
FROM '/Users/anishk/Documents/ASU Class Files/CSE412/Group Project/OL_Bookshelf/CSE412_GP_OLBookshelf/data/clean_data/book_author_table.csv'
DELIMITER ',' CSV HEADER;

-- 6. Import BOOKGENRE (Bridge)
COPY BookGenre(bookid, genreid)
FROM '/Users/anishk/Documents/ASU Class Files/CSE412/Group Project/OL_Bookshelf/CSE412_GP_OLBookshelf/data/clean_data/book_genre_table.csv'
DELIMITER ',' CSV HEADER;

-- 7. Import READINGLIST
COPY ReadingList(userid, bookid, status, progresspages, userrating, note, addedat)
FROM '/Users/anishk/Documents/ASU Class Files/CSE412/Group Project/OL_Bookshelf/CSE412_GP_OLBookshelf/data/clean_data/reading_list_table.csv'
DELIMITER ',' CSV HEADER;
