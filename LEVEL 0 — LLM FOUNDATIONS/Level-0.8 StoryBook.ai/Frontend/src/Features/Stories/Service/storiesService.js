import { createServiceClient } from '../../../config/apiClient.js';

const API = createServiceClient('/story');

const storiesService = {
  getAllContent: async () => {
    try {
      const response = await API.get('/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getTotalStats: async () => {
    try {
      const response = await API.get('/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getRecentWorks: async (limit = 10) => {
    try {
      const response = await API.get('/recent', { params: { limit } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createContent: async (contentData) => {
    try {
      const response = await API.post('/create', contentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  followUpStory: async (storyId, followUpMessage) => {
    try {
      const response = await API.post(`/follow-up/${storyId}`, { followUpMessage });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteContent: async (type, id) => {
    try {
      const response = await API.delete(`/delete/${type}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default storiesService;
