import { useState, useEffect } from 'react';
import { BookFilters as BookFiltersType } from '../types';

interface BookFiltersProps {
  initialFilters?: BookFiltersType;
  onApplyFilters: (filters: BookFiltersType) => void;
  className?: string;
}

const BookFilters = ({
  initialFilters = {},
  onApplyFilters,
  className = '',
}: BookFiltersProps) => {
  // State for filter values
  const [filters, setFilters] = useState<BookFiltersType>(initialFilters);
  
  // Mock data for genres and authors (would come from API in real app)
  const genres = [
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Non-Fiction' },
    { id: 3, name: 'Science Fiction' },
    { id: 4, name: 'Mystery' },
    { id: 5, name: 'Fantasy' },
    { id: 6, name: 'Romance' },
    { id: 7, name: 'Thriller' },
    { id: 8, name: 'Biography' },
  ];
  
  const authors = [
    { id: 1, name: 'George Orwell' },
    { id: 2, name: 'J.K. Rowling' },
    { id: 3, name: 'Stephen King' },
    { id: 4, name: 'Jane Austen' },
    { id: 5, name: 'F. Scott Fitzgerald' },
    { id: 6, name: 'J.R.R. Tolkien' },
    { id: 7, name: 'Agatha Christie' },
    { id: 8, name: 'Harper Lee' },
  ];
  
  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Special handling for numeric inputs
    if (name === 'minRating' || name === 'maxRating') {
      setFilters({
        ...filters,
        [name]: value ? parseFloat(value) : undefined,
      });
    } else {
      setFilters({
        ...filters,
        [name]: value || undefined,
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
  };
  
  // Reset filters
  const handleReset = () => {
    setFilters({});
    onApplyFilters({});
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Title filter */}
        <div className="mb-4">
          <label 
            htmlFor="title" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={filters.title || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Filter by title..."
          />
        </div>
        
        {/* Author filter */}
        <div className="mb-4">
          <label 
            htmlFor="author" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author
          </label>
          <select
            id="author"
            name="author"
            value={filters.author || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Authors</option>
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Genre filter */}
        <div className="mb-4">
          <label 
            htmlFor="genre" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Genre
          </label>
          <select
            id="genre"
            name="genre"
            value={filters.genre || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Rating range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <input
                type="number"
                id="minRating"
                name="minRating"
                value={filters.minRating || ''}
                onChange={handleInputChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Min"
              />
            </div>
            <div className="w-1/2">
              <input
                type="number"
                id="maxRating"
                name="maxRating"
                value={filters.maxRating || ''}
                onChange={handleInputChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookFilters;
