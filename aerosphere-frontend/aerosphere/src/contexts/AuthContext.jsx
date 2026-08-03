import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { loginRequest } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const SESSION_LIMIT_MS = 15 * 60 * 1000; // 15 min idle timeout
const WARNING_BEFORE_MS = 60 * 1000; // warn 60s before logout

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('aerosphere-user') || sessionStorage.getItem('aerosphere-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [sessionWarning, setSessionWarning] = useState(false);
  const idleTimer = useRef(null);
  const warnTimer = useRef(null);

  const login = useCallback(async ({ email, password, role, rememberMe }) => {
    const result = await loginRequest({ email, password, role });
    const store = rememberMe ? localStorage : sessionStorage;
    store.setItem('aerosphere-user', JSON.stringify(result));
    setUser(result);
    return result;
  }, []);

  const logout = useCallback((message = 'Signed out successfully') => {
    localStorage.removeItem('aerosphere-user');
    sessionStorage.removeItem('aerosphere-user');
    setUser(null);
    setSessionWarning(false);
    if (message) toast.info(message);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (!user) return;
    clearTimeout(idleTimer.current);
    clearTimeout(warnTimer.current);
    setSessionWarning(false);
    warnTimer.current = setTimeout(() => setSessionWarning(true), SESSION_LIMIT_MS - WARNING_BEFORE_MS);
    idleTimer.current = setTimeout(() => logout('Session expired due to inactivity'), SESSION_LIMIT_MS);
  }, [user, logout]);

  useEffect(() => {
    if (!user) return undefined;
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));
    resetIdleTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimer.current);
      clearTimeout(warnTimer.current);
    };
  }, [user, resetIdleTimer]);

  const extendSession = useCallback(() => resetIdleTimer(), [resetIdleTimer]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, sessionWarning, extendSession, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
