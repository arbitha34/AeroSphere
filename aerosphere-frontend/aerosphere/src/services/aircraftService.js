import { api } from './api';

// GET /api/aircraft
export async function getAircraft() {
  const { data } = await api.get('/aircraft');
  return data;
}

// GET /api/aircraft/:tailNumber/maintenance
export async function getMaintenanceForAircraft(tailNumber) {
  const { data } = await api.get(`/aircraft/${tailNumber}/maintenance`);
  return data;
}

// GET /api/maintenance
export async function getMaintenanceRecords() {
  const { data } = await api.get('/maintenance');
  return data;
}

// POST /api/aircraft
export async function createAircraft(payload) {
  const { data } = await api.post('/aircraft', payload);
  return data;
}

// PUT /api/aircraft/:id
export async function updateAircraft(id, payload) {
  const { data } = await api.put(`/aircraft/${id}`, payload);
  return data;
}

// DELETE /api/aircraft/:id
export async function deleteAircraft(id) {
  await api.delete(`/aircraft/${id}`);
  return id;
}
