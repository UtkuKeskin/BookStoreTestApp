import axios from 'axios';
import { Book } from '../types/Book';
import { GenerationParameters } from '../types/GenerationParameters';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5007';

export const bookApi = {
    getBooks: async (params: GenerationParameters): Promise<Book[]> => {
        const response = await axios.get(`${API_BASE_URL}/api/books`, { params });
        return response.data;
    },

    exportCsv: async (params: GenerationParameters): Promise<Blob> => {
        const response = await axios.get(`${API_BASE_URL}/api/books/export`, {
            params,
            responseType: 'blob'
        });
        return response.data;
    }
};