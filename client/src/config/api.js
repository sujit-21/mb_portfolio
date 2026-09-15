// Centralized API configuration
const rawApiUrl = import.meta.env.VITE_API_BASE_URL || '/api';

// Remove trailing slash if present for clean endpoint concatenation
export const API_BASE = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
