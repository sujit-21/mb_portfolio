// Centralized API configuration from Vite environment variables
const rawApiUrl = import.meta.env.VITE_API_BASE_URL || '/api';

// Remove trailing slash if present for clean endpoint concatenation
export const API_BASE = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

export const APP_CONFIG = {
  title: import.meta.env.VITE_APP_TITLE || 'Manish — Video Editor Portfolio',
  name: import.meta.env.VITE_CREATIVE_NAME || 'Manish',
  email: import.meta.env.VITE_DEFAULT_EMAIL || 'manish.edit@portfolio.dev',
};
