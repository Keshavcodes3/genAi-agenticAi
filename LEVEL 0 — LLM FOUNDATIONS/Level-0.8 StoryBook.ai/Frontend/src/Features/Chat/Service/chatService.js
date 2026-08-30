import { AI_REQUEST_TIMEOUT_MS, createServiceClient } from '../../../config/apiClient.js';

const API = createServiceClient('/muse', { timeout: AI_REQUEST_TIMEOUT_MS });

export const startChat = async () => {
  const response = await API.post('/start');
  return response.data;
};

export const retrieveChat = async () => {
  const response = await API.get('/retrieve');
  return response.data;
};

export const sendMessage = async ({ text, activeMode }) => {
  try {
    const response = await API.post('/send', { text, activeMode });
    return response.data;
  } catch (error) {
    const data = error.response?.data;
    const err = new Error(data?.message || 'Failed to reach the Muse. Please try again.');
    err.status = error.response?.status;
    err.retryAfterSeconds = data?.retryAfterSeconds;
    throw err;
  }
};

export const getMemoryBank = async () => {
  const response = await API.get('/memory');
  return response.data;
};
