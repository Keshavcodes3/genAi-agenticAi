const DEFAULT_API_URL = 'https://storybook-ai-bgyd.onrender.com';

export const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '');

export const apiPath = (segment) => `${API_URL}/api/v1${segment}`;
