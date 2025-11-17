import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useSimpleAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center no-underline">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-powder-petal-500 dark:text-powder-petal-400"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="ml-3 text-xl font-serif font-bold text-twilight-indigo-800 dark:text-twilight-indigo-100">
                Online Bookshelf
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="px-3 py-2 text-twilight-indigo-700 dark:text-twilight-indigo-200 hover:text-powder-petal-500 dark:hover:text-powder-petal-400 rounded-md no-underline transition-colors"
            >
              Browse Books
            </Link>
            
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center px-3 py-2 text-bookshelf-light-text dark:text-bookshelf-dark-text hover:text-bookshelf-light-accent dark:hover:text-bookshelf-dark-accent rounded-md transition-colors focus:outline-none"
                >
                  <span className="mr-2">{user?.displayname}</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-bookshelf-dark-card rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-bookshelf-light-text dark:text-bookshelf-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 no-underline"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/reading-list"
                      className="block px-4 py-2 text-sm text-bookshelf-light-text dark:text-bookshelf-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 no-underline"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Reading List
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-bookshelf-light-text dark:text-bookshelf-dark-text hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-powder-petal-500 dark:text-powder-petal-400 hover:bg-twilight-indigo-50 dark:hover:bg-twilight-indigo-700 rounded-md no-underline transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-powder-petal-500 dark:bg-powder-petal-600 text-white dark:text-white font-semibold rounded-md hover:bg-powder-petal-600 dark:hover:bg-powder-petal-700 transition-colors shadow-sm no-underline"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-bookshelf-light-text dark:text-bookshelf-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              <svg
                className={`h-6 w-6 ${isMenuOpen ? 'hidden' : 'block'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`h-6 w-6 ${isMenuOpen ? 'block' : 'hidden'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} border-t border-gray-200 dark:border-gray-700 mt-2`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-twilight-indigo-700 dark:text-twilight-indigo-200 hover:bg-twilight-indigo-50 dark:hover:bg-twilight-indigo-700 no-underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Browse Books
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-bookshelf-light-text dark:text-bookshelf-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Your Profile
              </Link>
              <Link
                to="/reading-list"
                className="block px-3 py-2 rounded-md text-bookshelf-light-text dark:text-bookshelf-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Reading List
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-bookshelf-light-text dark:text-bookshelf-dark-text hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-powder-petal-500 dark:text-powder-petal-400 hover:bg-twilight-indigo-50 dark:hover:bg-twilight-indigo-700 no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md bg-powder-petal-500 dark:bg-powder-petal-600 text-white dark:text-white font-semibold hover:bg-powder-petal-600 dark:hover:bg-powder-petal-700 no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;