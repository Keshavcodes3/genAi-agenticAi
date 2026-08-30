import { createServiceClient, setStoredToken } from '../../../config/apiClient.js';

const API = createServiceClient('/settings');

export const updateProfile = async (data) => {
  const response = await API.post('/update', data);
  return response.data;
};

export const logout = async () => {
  const response = await API.post('/logout');
  setStoredToken(null);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await API.post('/deleteAccount');
  setStoredToken(null);
  return response.data;
};
