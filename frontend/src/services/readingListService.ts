import api from './api';
import { API_ENDPOINTS } from '../config';
import { 
  AddToReadingListRequest, 
  ReadingListItem, 
  UpdateReadingListRequest 
} from '../types';

export const readingListService = {
  /**
   * Get user's reading list
   */
  getReadingList: async (): Promise<ReadingListItem[]> => {
    const response = await api.get<ReadingListItem[]>(API_ENDPOINTS.READING_LIST);
    return response.data;
  },

  /**
   * Add book to reading list
   */
  addToReadingList: async (data: AddToReadingListRequest): Promise<ReadingListItem> => {
    const response = await api.post<ReadingListItem>(API_ENDPOINTS.READING_LIST, data);
    return response.data;
  },

  /**
   * Update reading list item
   */
  updateReadingListItem: async (
    bookId: number,
    data: UpdateReadingListRequest
  ): Promise<ReadingListItem> => {
    const response = await api.patch<ReadingListItem>(
      API_ENDPOINTS.READING_LIST_ITEM(bookId),
      data
    );
    return response.data;
  },

  /**
   * Remove book from reading list
   */
  removeFromReadingList: async (bookId: number): Promise<void> => {
    await api.delete(API_ENDPOINTS.READING_LIST_ITEM(bookId));
  },
};
