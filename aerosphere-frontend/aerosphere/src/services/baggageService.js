import { api } from './api';

// GET /api/baggage
export async function getBaggage() {
  const { data } = await api.get('/baggage');
  return data;
}

// GET /api/baggage/track/:tag
export async function trackBaggage(tag) {
  const { data } = await api.get(`/baggage/track/${tag}`);
  return data;
}

// POST /api/baggage
export async function createBaggage(payload) {
  const { data } = await api.post('/baggage', payload);
  return data;
}

// PUT /api/baggage/:id
export async function updateBaggage(id, payload) {
  const { data } = await api.put(`/baggage/${id}`, payload);
  return data;
}

// DELETE /api/baggage/:id
export async function deleteBaggage(id) {
  await api.delete(`/baggage/${id}`);
  return id;
}
