import React, { useState } from 'react';

interface BookSearchProps {
  onSearch: (query: string) => void;
}

const BookSearch: React.FC<BookSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder="Search by title, author, or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-3 border border-bookshelf-light-border dark:border-bookshelf-dark-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-bookshelf-accent dark:focus:ring-bookshelf-dark-accent bg-white dark:bg-bookshelf-dark-card text-bookshelf-light-text dark:text-bookshelf-dark-text"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-bookshelf-accent dark:bg-bookshelf-dark-accent text-white rounded-r-md hover:opacity-90 transition-opacity"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default BookSearch;
