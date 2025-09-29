import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333/api',
  withCredentials: true
});

// Given a stored path like '/api/uploads/filename.png', return an absolute URL
export function getUploadUrl(path?: string | null) {
  if (!path) return null;
  // If path already looks absolute, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Normalize base: remove any trailing '/api' so we can safely append the path
  const rawBase = api.defaults.baseURL || '';
  const serverRoot = rawBase.replace(/\/api\/?$/, '');
  // Ensure path starts with '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${serverRoot}${normalizedPath}`;
}

export default api;
