import axios from 'axios';
import { API_URL } from './api.js';

const TOKEN_KEY = 'storybook_token';

/** Story/editor AI can take 30–90s on cold Render + Gemini; avoid hanging forever. */
export const AI_REQUEST_TIMEOUT_MS = 120_000;

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const attachAuthInterceptor = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
};

export const createServiceClient = (path, { timeout } = {}) =>
  attachAuthInterceptor(
    axios.create({
      baseURL: `${API_URL}/api/v1${path}`,
      withCredentials: true,
      ...(timeout != null && { timeout }),
    })
  );
