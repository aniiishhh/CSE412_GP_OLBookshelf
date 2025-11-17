import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { bookService } from '../services/bookService';
import { readingListService } from '../services/readingListService';
import { useAuth } from '../contexts/AuthContext';
import { READING_STATUS } from '../config';
import { BookOpenIcon, StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const bookId = parseInt(id || '0');
  const { isAuthenticated } = useAuth();
  const [readingStatus, setReadingStatus] = useState<string | null>(null);
  const [isAddingToList, setIsAddingToList] = useState(false);

  const { data: book, isLoading, error, execute } = useApi(bookService.getBookById);

  useEffect(() => {
    if (bookId) {
      execute(bookId);
    }
  }, [bookId, execute]);

  const handleAddToReadingList = async (status: string) => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }

    setIsAddingToList(true);
    try {
      await readingListService.addToReadingList({
        bookid: bookId,
        status,
      });
      setReadingStatus(status);
    } catch (error) {
      console.error('Error adding book to reading list:', error);
    } finally {
      setIsAddingToList(false);
    }
  };

  // Render star ratings
  const renderRating = (rating: number | undefined) => {
    if (!rating) return 'No ratings yet';
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-yellow-500" />);
      } else {
        stars.push(<StarOutlineIcon key={i} className="h-5 w-5 text-yellow-500" />);
      }
    }
    
    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-gray-600 dark:text-gray-300">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bookshelf-accent"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
          Error Loading Book
        </h2>
        <p className="text-red-600 dark:text-red-300">
          We couldn't load this book's details. Please try again later.
        </p>
        <Link to="/" className="btn-primary mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Book Header */}
        <div className="bg-bookshelf-paper dark:bg-gray-700 p-6">
          <h1 className="text-3xl font-serif font-bold text-bookshelf-ink dark:text-white">
            {book.title}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
            {book.authors.map(author => author.name).join(', ')}
          </p>
        </div>

        {/* Book Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="w-full md:w-1/3 flex justify-center">
              {book.coverurl ? (
                <img
                  src={book.coverurl}
                  alt={`Cover of ${book.title}`}
                  className="rounded-book shadow-book max-h-80 object-contain"
                />
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-book shadow-book h-80 w-56 flex items-center justify-center">
                  <BookOpenIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="w-full md:w-2/3">
              {/* Rating */}
              <div className="mb-4">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Rating
                </h2>
                {renderRating(book.averagerating)}
              </div>

              {/* Genres */}
              <div className="mb-4">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Genres
                </h2>
                <div className="flex flex-wrap gap-2">
                  {book.genres.map((genre) => (
                    <span
                      key={genre.genreid}
                      className="bg-bookshelf-paper dark:bg-gray-700 text-bookshelf-ink dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Publication Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    ISBN
                  </h2>
                  <p className="text-bookshelf-ink dark:text-white">
                    {book.isbn || 'N/A'}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Published Date
                  </h2>
                  <p className="text-bookshelf-ink dark:text-white">
                    {book.publisheddate ? new Date(book.publisheddate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Pages
                  </h2>
                  <p className="text-bookshelf-ink dark:text-white">
                    {book.pagecount || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Reading List Actions */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-bookshelf-ink dark:text-white mb-3">
                  Add to Your Reading List
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAddToReadingList(READING_STATUS.WANT_TO_READ)}
                    disabled={isAddingToList}
                    className="btn-secondary"
                  >
                    Want to Read
                  </button>
                  <button
                    onClick={() => handleAddToReadingList(READING_STATUS.READING)}
                    disabled={isAddingToList}
                    className="btn-secondary"
                  >
                    Currently Reading
                  </button>
                  <button
                    onClick={() => handleAddToReadingList(READING_STATUS.COMPLETED)}
                    disabled={isAddingToList}
                    className="btn-secondary"
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-bookshelf-ink dark:text-white mb-3">
              Description
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300">
                {book.description || 'No description available.'}
              </p>
            </div>
          </div>

          {/* External Links */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href={`https://www.goodreads.com/search?q=${encodeURIComponent(book.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bookshelf-accent hover:underline flex items-center"
            >
              <span>View on Goodreads</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
