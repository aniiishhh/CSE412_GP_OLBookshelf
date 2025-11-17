import { Book, BookListItem, PaginatedResponse, BookFilters } from '../types';

const API_URL = 'http://localhost:8000';

export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Service for book-related API calls
 */
export const bookService = {
  /**
   * Get a paginated list of books with optional filters
   */
  async getBooks(
    pagination: PaginationParams = { page: 1, limit: 12 },
    filters?: BookFilters
  ): Promise<PaginatedResponse<BookListItem>> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());

      // Add filters if provided
      if (filters) {
        if (filters.title) queryParams.append('title', filters.title);
        if (filters.author) queryParams.append('author', filters.author);
        if (filters.genre) queryParams.append('genre', filters.genre);
        if (filters.minRating) queryParams.append('min_rating', filters.minRating.toString());
        if (filters.maxRating) queryParams.append('max_rating', filters.maxRating.toString());
      }

      // Make API request
      const response = await fetch(`${API_URL}/books?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching books:', error);
      
      // For now, return mock data for development
      return getMockBooks(pagination, filters);
    }
  },

  /**
   * Get a single book by ID
   */
  async getBookById(id: number): Promise<Book> {
    try {
      const response = await fetch(`${API_URL}/books/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch book: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching book ${id}:`, error);
      
      // For now, return mock data for development
      return getMockBookById(id);
    }
  },

  /**
   * Search books by query
   */
  async searchBooks(query: string): Promise<BookListItem[]> {
    try {
      const response = await fetch(`${API_URL}/books/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to search books: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching books:', error);
      
      // For now, return mock data for development
      return getMockSearchResults(query);
    }
  },
};

// Mock data for development
const mockBooks: BookListItem[] = [
  {
    bookid: 1,
    title: 'To Kill a Mockingbird',
    authors: ['Harper Lee'],
    averagerating: 4.8,
    coverurl: 'https://covers.openlibrary.org/b/id/8231490-L.jpg',
  },
  {
    bookid: 2,
    title: '1984',
    authors: ['George Orwell'],
    averagerating: 4.7,
    coverurl: 'https://covers.openlibrary.org/b/id/8575761-L.jpg',
  },
  {
    bookid: 3,
    title: 'Pride and Prejudice',
    authors: ['Jane Austen'],
    averagerating: 4.5,
    coverurl: 'https://covers.openlibrary.org/b/id/8479576-L.jpg',
  },
  {
    bookid: 4,
    title: 'The Great Gatsby',
    authors: ['F. Scott Fitzgerald'],
    averagerating: 4.3,
    coverurl: 'https://covers.openlibrary.org/b/id/8417462-L.jpg',
  },
  {
    bookid: 5,
    title: 'The Catcher in the Rye',
    authors: ['J.D. Salinger'],
    averagerating: 4.1,
    coverurl: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
  },
  {
    bookid: 6,
    title: 'Lord of the Flies',
    authors: ['William Golding'],
    averagerating: 4.0,
    coverurl: 'https://covers.openlibrary.org/b/id/8903298-L.jpg',
  },
  {
    bookid: 7,
    title: 'Animal Farm',
    authors: ['George Orwell'],
    averagerating: 4.2,
    coverurl: 'https://covers.openlibrary.org/b/id/8395241-L.jpg',
  },
  {
    bookid: 8,
    title: 'The Hobbit',
    authors: ['J.R.R. Tolkien'],
    averagerating: 4.7,
    coverurl: 'https://covers.openlibrary.org/b/id/8323742-L.jpg',
  },
  {
    bookid: 9,
    title: 'Brave New World',
    authors: ['Aldous Huxley'],
    averagerating: 4.4,
    coverurl: 'https://covers.openlibrary.org/b/id/8231990-L.jpg',
  },
  {
    bookid: 10,
    title: 'The Alchemist',
    authors: ['Paulo Coelho'],
    averagerating: 4.6,
    coverurl: 'https://covers.openlibrary.org/b/id/8578396-L.jpg',
  },
  {
    bookid: 11,
    title: 'Fahrenheit 451',
    authors: ['Ray Bradbury'],
    averagerating: 4.3,
    coverurl: 'https://covers.openlibrary.org/b/id/8406786-L.jpg',
  },
  {
    bookid: 12,
    title: 'The Little Prince',
    authors: ['Antoine de Saint-Exupéry'],
    averagerating: 4.8,
    coverurl: 'https://covers.openlibrary.org/b/id/8393164-L.jpg',
  },
];

function getMockBooks(
  pagination: PaginationParams,
  filters?: BookFilters
): PaginatedResponse<BookListItem> {
  // Apply filters if provided
  let filteredBooks = [...mockBooks];
  
  if (filters) {
    if (filters.title) {
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }
    
    if (filters.author) {
      filteredBooks = filteredBooks.filter(book => 
        book.authors.some(author => 
          author.toLowerCase().includes(filters.author!.toLowerCase())
        )
      );
    }
    
    if (filters.minRating) {
      filteredBooks = filteredBooks.filter(book => 
        (book.averagerating || 0) >= filters.minRating!
      );
    }
    
    if (filters.maxRating) {
      filteredBooks = filteredBooks.filter(book => 
        (book.averagerating || 0) <= filters.maxRating!
      );
    }
  }
  
  // Calculate pagination
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
  
  return {
    items: paginatedBooks,
    total: filteredBooks.length,
    page: pagination.page,
    limit: pagination.limit,
    pages: Math.ceil(filteredBooks.length / pagination.limit),
  };
}

function getMockBookById(id: number): Book {
  const book = mockBooks.find(book => book.bookid === id);
  
  if (!book) {
    throw new Error(`Book with ID ${id} not found`);
  }
  
  return {
    ...book,
    isbn: `978-${Math.floor(Math.random() * 10000000000)}`,
    pagecount: Math.floor(Math.random() * 500) + 100,
    publisheddate: new Date(1900 + Math.floor(Math.random() * 123), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    genres: [
      { genreid: 1, name: 'Fiction' },
      { genreid: 2, name: 'Classic' },
    ],
    authors: book.authors.map((name, index) => ({
      authorid: id * 10 + index,
      name,
      biography: `${name} is a renowned author known for their exceptional storytelling and vivid characters.`,
    })),
  };
}

function getMockSearchResults(query: string): BookListItem[] {
  return mockBooks.filter(book => 
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.authors.some(author => author.toLowerCase().includes(query.toLowerCase()))
  );
}