// User types
export interface User {
  userid: number;
  email: string;
  displayname: string;
  role?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Book types
export interface Book {
  bookid: number;
  title: string;
  isbn: string;
  pagecount: number;
  publisheddate: string;
  description: string;
  coverurl?: string;
  averagerating?: number;
  authors: Author[];
  genres: Genre[];
}

export interface BookListItem {
  bookid: number;
  title: string;
  coverurl?: string;
  averagerating?: number;
  authors: string[];
}

// Author types
export interface Author {
  authorid: number;
  name: string;
  biography?: string;
}

// Genre types
export interface Genre {
  genreid: number;
  name: string;
}

// Reading list types
export interface ReadingListItem {
  bookid: number;
  userid: number;
  status: string;
  progresspages: number;
  userrating?: number;
  note?: string;
  addedat: string;
  book: BookListItem;
}

export interface AddToReadingListRequest {
  bookid: number;
  status: string;
  progresspages?: number;
  userrating?: number;
  note?: string;
}

export interface UpdateReadingListRequest {
  status?: string;
  progresspages?: number;
  userrating?: number;
  note?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Filter types
export interface BookFilters {
  title?: string;
  author?: string;
  genre?: string;
  minRating?: number;
  maxRating?: number;
}