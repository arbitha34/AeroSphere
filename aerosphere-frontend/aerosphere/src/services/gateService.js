import { api } from './api';

// GET /api/gates
export async function getGates() {
  const { data } = await api.get('/gates');
  return data;
}

// GET /api/runways
export async function getRunways() {
  const { data } = await api.get('/runways');
  return data;
}

// POST /api/gates
export async function createGate(payload) {
  const { data } = await api.post('/gates', payload);
  return data;
}

// PUT /api/gates/:id
export async function updateGate(id, payload) {
  const { data } = await api.put(`/gates/${id}`, payload);
  return data;
}

// PATCH /api/gates/:id/assign
export async function assignGate(id, flightNumber) {
  const { data } = await api.patch(`/gates/${id}/assign`, { flightNumber });
  return data;
}

// DELETE /api/gates/:id
export async function deleteGate(id) {
  await api.delete(`/gates/${id}`);
  return id;
}
