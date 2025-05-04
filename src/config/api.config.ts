// This will be replaced with the actual API endpoint provided by AWS Amplify
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  SUBMIT_QUERY: `${API_BASE_URL}/submit_query`,
  GET_QUERY: `${API_BASE_URL}/get_query`,
  HEALTH_CHECK: `${API_BASE_URL}/`
};

export default API_ENDPOINTS; 