SELECT 
    b.bookid,
    b.title AS "Book Title",
    STRING_AGG(a.name, ', ') AS "Authors",
    b.averagerating AS "Avg Rating"
FROM 
    book b
JOIN 
    bookauthor ba ON b.bookid = ba.bookid
JOIN 
    author a ON ba.authorid = a.authorid
WHERE 
    b.averagerating < 2
GROUP BY 
    b.bookid, b.title, b.averagerating
ORDER BY 
    b.averagerating DESC
LIMIT 10;