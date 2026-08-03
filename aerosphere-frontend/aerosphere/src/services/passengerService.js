import { api } from './api';

// GET /api/passengers
export async function getPassengers() {
  const { data } = await api.get('/passengers');
  return data;
}

// POST /api/passengers
export async function createPassenger(payload) {
  const { data } = await api.post('/passengers', payload);
  return data;
}

// PUT /api/passengers/:id
export async function updatePassenger(id, payload) {
  const { data } = await api.put(`/passengers/${id}`, payload);
  return data;
}

// PATCH /api/passengers/:id/checkin
export async function checkInPassenger(id) {
  const { data } = await api.patch(`/passengers/${id}/checkin`);
  return data;
}

// DELETE /api/passengers/:id
export async function deletePassenger(id) {
  await api.delete(`/passengers/${id}`);
  return id;
}
