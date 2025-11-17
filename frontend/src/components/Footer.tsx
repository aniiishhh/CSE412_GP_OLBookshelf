import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-bookshelf-light-card dark:bg-bookshelf-dark-card border-t border-bookshelf-light-border dark:border-bookshelf-dark-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and copyright */}
          <div className="flex items-center mb-4 md:mb-0">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-bookshelf-accent dark:text-bookshelf-dark-accent"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="ml-2 text-sm font-medium text-bookshelf-light-text dark:text-bookshelf-dark-text">
              &copy; {currentYear} Online Bookshelf
            </span>
          </div>
          
          {/* Navigation links */}
          <div className="flex space-x-6">
            <Link to="/" className="text-sm text-bookshelf-light-muted dark:text-bookshelf-dark-muted hover:text-bookshelf-accent dark:hover:text-bookshelf-dark-accent no-underline">
              Books
            </Link>
            <Link to="/reading-list" className="text-sm text-bookshelf-light-muted dark:text-bookshelf-dark-muted hover:text-bookshelf-accent dark:hover:text-bookshelf-dark-accent no-underline">
              Reading List
            </Link>
            <Link to="/profile" className="text-sm text-bookshelf-light-muted dark:text-bookshelf-dark-muted hover:text-bookshelf-accent dark:hover:text-bookshelf-dark-accent no-underline">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;