import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import BookSearch from '../components/BookSearch';

// Mock book data
const mockFeaturedBooks = [
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
];

const mockNewReleases = [
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

const mockPopularGenres = [
  { id: 1, name: 'Fiction', count: 1245 },
  { id: 2, name: 'Mystery', count: 842 },
  { id: 3, name: 'Science Fiction', count: 753 },
  { id: 4, name: 'Fantasy', count: 621 },
  { id: 5, name: 'Romance', count: 518 },
  { id: 6, name: 'Biography', count: 412 },
];

interface Book {
  id: number;
  title: string;
  author: string;
  cover_url?: string;
  average_rating?: number;
}

const HomePage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [newReleases, setNewReleases] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setFeaturedBooks(mockFeaturedBooks);
      setNewReleases(mockNewReleases);
      setLoading(false);
    };
    
    loadBooks();
  }, []);
  
  const handleSearch = (query: string) => {
    // In a real app, this would navigate to the books page with the search query
    console.log('Search query:', query);
  };
  
  // Render loading skeleton
  const renderSkeleton = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div key={`skeleton-${index}`} className="bg-white dark:bg-bookshelf-dark-card rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    ));
  };

  return (
    <div className="bg-bookshelf-light-bg dark:bg-bookshelf-dark-bg">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Discover Your Next Great Read
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Track your reading journey, find new books, and connect with a community of book lovers.
          </p>
          
          <div className="max-w-xl mx-auto">
            <BookSearch onSearch={handleSearch} />
          </div>
        </div>
      </div>
      
      {/* Featured books section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-bookshelf-light-text dark:text-bookshelf-dark-text">
            Featured Books
          </h2>
          <Link 
            to="/books" 
            className="text-bookshelf-light-accent dark:text-bookshelf-dark-accent hover:underline flex items-center"
          >
            View all
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {loading ? renderSkeleton() : featuredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
      
      {/* New releases section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-bookshelf-light-text dark:text-bookshelf-dark-text">
              New Releases
            </h2>
            <Link 
              to="/books?sort=newest" 
              className="text-bookshelf-light-accent dark:text-bookshelf-dark-accent hover:underline flex items-center"
            >
              View all
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {loading ? renderSkeleton() : newReleases.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Genres section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-serif font-bold text-bookshelf-light-text dark:text-bookshelf-dark-text mb-6">
          Popular Genres
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {mockPopularGenres.map(genre => (
            <Link 
              key={genre.id} 
              to={`/books?genre=${genre.name}`}
              className="card hover:shadow-lg transition-all duration-300 text-center p-4 no-underline"
            >
              <h3 className="font-semibold text-bookshelf-light-text dark:text-bookshelf-dark-text mb-1">
                {genre.name}
              </h3>
              <p className="text-sm text-bookshelf-light-muted dark:text-bookshelf-dark-muted">
                {genre.count} books
              </p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Call to action */}
      <div className="bg-bookshelf-light-accent dark:bg-bookshelf-dark-accent text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Start Your Reading Journey Today
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Create your account to track your reading progress, build your personal library, and connect with other readers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/register" 
              className="px-6 py-3 bg-white text-bookshelf-light-accent dark:text-bookshelf-dark-accent font-medium rounded-md shadow-sm hover:bg-gray-100 transition-colors no-underline"
            >
              Sign up for free
            </Link>
            <Link 
              to="/books" 
              className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors no-underline"
            >
              Explore books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;