import { AI_REQUEST_TIMEOUT_MS, createServiceClient } from '../../../config/apiClient.js';

const API = createServiceClient('/editor', { timeout: AI_REQUEST_TIMEOUT_MS });

export const syncStoryContent = async (storyId, fullStoryContent, title, type) => {
  try {
    const response = await API.put('/sync', { storyId, fullStoryContent, title, type });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to sync story';
  }
};

export const processAiAction = async (data) => {
  try {
    const response = await API.post('/ai-action', data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to process AI action';
  }
};
