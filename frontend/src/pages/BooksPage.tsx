import React, { useState, useEffect } from 'react';
import BookSearch from '../components/BookSearch';
import BookCard from '../components/BookCard';

// Mock book data
const mockBooks = [
  {
    id: 1,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200',
    average_rating: 4.5,
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200',
    average_rating: 4.3,
  },
  {
    id: 3,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    cover_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=200',
    average_rating: 4.2,
  },
  {
    id: 4,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover_url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=200',
    average_rating: 4.0,
  },
  {
    id: 5,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    cover_url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=200',
    average_rating: 3.8,
  },
  {
    id: 6,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    cover_url: 'https://images.unsplash.com/photo-1518744386442-2d48ac5b5aa0?q=80&w=200',
    average_rating: 4.7,
  },
];

interface Book {
  id: number;
  title: string;
  author: string;
  cover_url?: string;
  average_rating?: number;
}

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulate loading data
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setBooks(mockBooks);
      setLoading(false);
    };
    
    loadBooks();
  }, []);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      setBooks(mockBooks);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = mockBooks.filter(
      book => 
        book.title.toLowerCase().includes(lowerQuery) || 
        book.author.toLowerCase().includes(lowerQuery)
    );
    
    setBooks(filtered);
  };
  
  // Render loading skeleton
  const renderSkeleton = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div key={`skeleton-${index}`} className="bg-bookshelf-light-card dark:bg-bookshelf-dark-card rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-bookshelf-accent dark:text-bookshelf-dark-accent mb-6">Browse Books</h1>
      
      <div className="mb-8">
        <BookSearch onSearch={handleSearch} />
        
        {searchQuery && (
          <p className="mt-4 text-bookshelf-light-text dark:text-bookshelf-dark-text">
            Showing results for: <span className="font-medium">{searchQuery}</span>
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          renderSkeleton()
        ) : books.length > 0 ? (
          books.map(book => <BookCard key={book.id} book={book} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-bookshelf-light-muted dark:text-bookshelf-dark-muted text-lg">No books found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;