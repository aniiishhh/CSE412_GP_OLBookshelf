INSERT INTO readinglist (userid, bookid, status, progresspages, userrating, note)
VALUES (1, 25, 'READING', 20, NULL, 'Started reading this one!');

--

UPDATE readinglist
SET 
    progresspages = 150,
    userrating = 4.8,
    status = 'COMPLETED'
WHERE 
    userid = 1 AND bookid = 25;
