import axios from 'axios';

// Live REST client for the AeroSphere backend (Spring Boot).
// Base URL comes from VITE_API_BASE_URL (see .env / .env.example).
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({ baseURL, timeout: 10000 });

function getStoredAuth() {
  const local = localStorage.getItem('aerosphere-user');
  const session = sessionStorage.getItem('aerosphere-user');
  if (local) return { store: localStorage, data: JSON.parse(local) };
  if (session) return { store: sessionStorage, data: JSON.parse(session) };
  return null;
}

api.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth?.data?.token) config.headers.Authorization = `Bearer ${auth.data.token}`;
  return config;
});

// On a 401 (expired access token), silently exchange the refresh token for a new
// access token and retry the original request once, instead of bouncing the user
// straight to the login screen every hour.
let refreshInFlight = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const auth = getStoredAuth();

    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    if (status === 401 && auth?.data?.refreshToken && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        refreshInFlight =
          refreshInFlight ||
          axios.post(`${baseURL}/auth/refresh`, { refreshToken: auth.data.refreshToken });
        const { data } = await refreshInFlight;
        refreshInFlight = null;

        const updated = { ...auth.data, token: data.token, refreshToken: data.refreshToken };
        auth.store.setItem('aerosphere-user', JSON.stringify(updated));

        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        refreshInFlight = null;
        // Refresh token is also expired/invalid — clear the session so ProtectedRoute
        // sends the user back to /login instead of looping on 401s.
        auth.store.removeItem('aerosphere-user');
        window.location.href = '/login';
        return Promise.reject(normalizeError(refreshError));
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

// Normalizes backend error responses ({ status, error, message, path, timestamp })
// into a plain Error with a human-readable message, so callers can just do
// `catch (err) { setError(err.message) }` regardless of which endpoint failed.
function normalizeError(error) {
  const backendMessage = error?.response?.data?.message;
  const normalized = new Error(
    backendMessage ||
      (error?.code === 'ECONNABORTED'
        ? 'The request timed out — is the backend running?'
        : error?.message === 'Network Error'
        ? 'Could not reach the AeroSphere backend. Is it running on the configured VITE_API_BASE_URL?'
        : error.message)
  );
  normalized.status = error?.response?.status;
  return normalized;
}

// Kept for any component still using the old mock-latency helper during migration.
export const mockDelay = (data, ms = 450) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));
