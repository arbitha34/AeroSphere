import { api } from './api';

// GET /api/flights
export async function getFlights() {
  const { data } = await api.get('/flights');
  return data;
}

// GET /api/flights/:id  (accepts id or flight number)
export async function getFlightById(id) {
  const { data } = await api.get(`/flights/${id}`);
  return data;
}

// POST /api/flights
export async function createFlight(payload) {
  const { data } = await api.post('/flights', payload);
  return data;
}

// PUT /api/flights/:id
export async function updateFlight(id, payload) {
  const { data } = await api.put(`/flights/${id}`, payload);
  return data;
}

// PATCH /api/flights/:id/status
export async function updateFlightStatus(id, status) {
  const { data } = await api.patch(`/flights/${id}/status`, { status });
  return data;
}

// DELETE /api/flights/:id
export async function deleteFlight(id) {
  await api.delete(`/flights/${id}`);
  return id;
}
