import { useState, useEffect, useCallback } from 'react';
import ApiService from '../services/api.service';
import { QueryResponse } from '../types/api';

interface QueryState {
  loading: boolean;
  queryResponse: QueryResponse | null;
  error: string | null;
  polling: boolean;
}

export const useQuery = () => {
  const [state, setState] = useState<QueryState>({
    loading: false,
    queryResponse: null,
    error: null,
    polling: false
  });

  // Function to submit a new query
  const submitQuery = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await ApiService.submitQuery(query);
      setState(prev => ({
        ...prev,
        queryResponse: response,
        loading: false,
        polling: !response.is_complete
      }));
      
      return response.query_id;
    } catch (error) {
      let errorMessage = 'An error occurred while submitting the query';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        polling: false
      }));
      
      return null;
    }
  }, []);

  // Function to get query status
  const getQueryStatus = useCallback(async (queryId: string) => {
    try {
      const response = await ApiService.getQuery(queryId);
      setState(prev => ({
        ...prev,
        queryResponse: response,
        polling: !response.is_complete
      }));
      
      return response;
    } catch (error) {
      let errorMessage = 'An error occurred while getting the query status';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        polling: false
      }));
      
      return null;
    }
  }, []);

  // Set up polling for query status if needed
  useEffect(() => {
    if (!state.polling || !state.queryResponse) return;
    
    const intervalId = setInterval(async () => {
      const queryId = state.queryResponse?.query_id;
      if (queryId) {
        await getQueryStatus(queryId);
      }
    }, 2000); // Poll every 2 seconds
    
    return () => clearInterval(intervalId);
  }, [state.polling, state.queryResponse, getQueryStatus]);

  return {
    ...state,
    submitQuery,
    getQueryStatus
  };
};

export default useQuery; 