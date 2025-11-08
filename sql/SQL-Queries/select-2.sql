SELECT 
    g.name AS "Genre",
    COUNT(bg.bookid) AS "Total Books"
FROM 
    genre g
LEFT JOIN 
    bookgenre bg ON g.genreid = bg.genreid
GROUP BY 
    g.name
ORDER BY 
    COUNT(bg.bookid) DESC
LIMIT 10;