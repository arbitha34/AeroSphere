import { api } from './api';

// POST /api/auth/login
export async function loginRequest({ email, password, role }) {
  if (!email || !password) throw new Error('Email and password are required');
  const { data } = await api.post('/auth/login', { email, password, role });
  return data; // { id, name, email, role, token, avatarInitial }
}

// POST /api/auth/otp/send
export async function requestOtp(email) {
  const { data } = await api.post('/auth/otp/send', { email });
  return data; // { sent, email, expiresInSeconds }
}

// POST /api/auth/otp/verify
export async function verifyOtp(code, email) {
  if (code?.length !== 6) throw new Error('Enter the 6-digit code sent to your device');
  const { data } = await api.post('/auth/otp/verify', { email, code });
  return data; // { verified }
}

// POST /api/auth/password/reset
export async function resetPassword(payload) {
  const { data } = await api.post('/auth/password/reset', payload);
  return data; // { success, message }
}
