import { createServiceClient, setStoredToken } from '../../../config/apiClient.js';

const API = createServiceClient('/auth');

const authService = {
  login: async (credentials) => {
    try {
      const response = await API.post('/login', credentials);
      if (response.data?.token) {
        setStoredToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await API.post('/register', userData);
      if (response.data?.token) {
        setStoredToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMe: async () => {
    try {
      const response = await API.get('/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    setStoredToken(null);
  },
};

export default authService;
