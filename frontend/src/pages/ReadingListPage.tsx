import React from 'react';

const ReadingListPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">My Reading List</h1>
      <p className="mt-4 text-bookshelf-light-muted dark:text-bookshelf-dark-muted">
        Track your reading progress and manage your personal library.
      </p>
      
      <div className="mt-8 card">
        <p className="text-bookshelf-light-muted dark:text-bookshelf-dark-muted italic">
          Your reading list is empty. Start adding books from the browse page!
        </p>
      </div>
    </div>
  );
};

export default ReadingListPage;