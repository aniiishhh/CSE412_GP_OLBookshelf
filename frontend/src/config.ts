export const API_BASE_URL = 'http://127.0.0.1:8000';
export const APP_NAME = 'Online Bookshelf';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Books
  BOOKS: '/books',
  BOOK_DETAIL: (id: number) => `/books/${id}`,
  BOOK_SEARCH: '/books/search',
  
  // Authors
  AUTHORS: '/authors',
  AUTHOR_DETAIL: (id: number) => `/authors/${id}`,
  
  // Genres
  GENRES: '/genres',
  TOP_GENRES: '/genres/top/',
  
  // Reading List
  READING_LIST: '/readinglist',
  READING_LIST_ITEM: (bookId: number) => `/readinglist/${bookId}`,
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
};

// Theme settings
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Reading statuses
export const READING_STATUS = {
  WANT_TO_READ: 'Want to Read',
  READING: 'Reading',
  COMPLETED: 'Completed',
};

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;
