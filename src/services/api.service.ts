import axios from 'axios';
import API_ENDPOINTS from '../config/api.config';
import { SubmitQueryRequest, QueryResponse } from '../types/api';

// Create axios instance with common configuration
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const ApiService = {
  // Submit a new query
  submitQuery: async (query: string): Promise<QueryResponse> => {
    const request: SubmitQueryRequest = { query_text: query };
    const response = await apiClient.post<QueryResponse>(API_ENDPOINTS.SUBMIT_QUERY, request);
    return response.data;
  },

  // Get query status and results
  getQuery: async (queryId: string): Promise<QueryResponse> => {
    const response = await apiClient.get<QueryResponse>(`${API_ENDPOINTS.GET_QUERY}?query_id=${queryId}`);
    return response.data;
  },

  // Check API health
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HEALTH_CHECK);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
};

export default ApiService; 