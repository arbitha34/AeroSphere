import { useState } from 'react';
import {
  Box, Grid, Stack, Typography, Chip, LinearProgress, Divider, Avatar,
  Button, TextField, MenuItem,
} from '@mui/material';
import { FiActivity as FiAircraft, FiTool, FiDroplet, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import ReusableTable from '../../components/common/ReusableTable';
import ReusableDialog from '../../components/common/ReusableDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { getAircraft, getMaintenanceRecords, createAircraft, updateAircraft, deleteAircraft } from '../../services/aircraftService';
import { formatDate } from '../../utils/formatters';

const statusColorMap = { 'In Service': 'success', Maintenance: 'warning', Grounded: 'error' };
const STATUS_OPTIONS = ['In Service', 'Maintenance', 'Grounded'];

const emptyForm = {
  tailNumber: '', model: '', manufacturer: '', capacity: 180, status: 'In Service',
  fuelLevel: 100, totalFlightHours: 0, assignedCrew: 6, location: '',
};

export default function AircraftList() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // aircraft being edited, or null for create
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: aircraft = [], isLoading, isError, error, refetch } = useQuery({ queryKey: ['aircraft'], queryFn: getAircraft });
  const { data: maintenanceRecords = [] } = useQuery({
    queryKey: ['maintenance'], queryFn: getMaintenanceRecords, enabled: !isLoading && !isError,
  });

  const createMutation = useMutation({
    mutationFn: createAircraft,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aircraft'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateAircraft(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aircraft'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteAircraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft'] });
      setSelected(null);
      setDeleteTarget(null);
    },
  });

  const { control, handleSubmit, reset } = useForm({ defaultValues: emptyForm });

  const openCreate = () => { setEditing(null); reset(emptyForm); setFormOpen(true); };
  const openEdit = (a) => { setEditing(a); reset(a); setFormOpen(true); setSelected(null); };

  const onSubmit = async (values) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload: values });
        toast.success(`${values.tailNumber} updated`);
      } else {
        await createMutation.mutateAsync(values);
        toast.success(`${values.tailNumber} added to the fleet`);
      }
      setFormOpen(false);
    } catch (err) {
      toast.error(err.message || 'Could not save this aircraft');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.tailNumber} removed from the fleet`);
    } catch (err) {
      toast.error(err.message || 'Could not delete this aircraft');
    }
  };

  const columns = [
    { field: 'tailNumber', headerName: 'Tail Number' },
    { field: 'model', headerName: 'Model' },
    { field: 'capacity', headerName: 'Capacity' },
    { field: 'status', headerName: 'Status', render: (r) => <Chip size="small" label={r.status} color={statusColorMap[r.status]} /> },
    { field: 'fuelLevel', headerName: 'Fuel', render: (r) => (
      <Box sx={{ width: 100 }}>
        <LinearProgress variant="determinate" value={r.fuelLevel} sx={{ borderRadius: 2, height: 6 }} />
        <Typography variant="caption" color="text.secondary">{r.fuelLevel}%</Typography>
      </Box>
    ) },
    { field: 'location', headerName: 'Location' },
  ];

  const maintenanceFor = (tail) => maintenanceRecords.filter((m) => m.aircraft === tail);

  return (
    <Box>
      <PageHeader
        title="Aircraft Management"
        subtitle="Fleet status, specifications, and maintenance history"
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Aircraft' }]}
        actions={<Button variant="contained" startIcon={<FiPlus />} onClick={openCreate}>Add aircraft</Button>}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={4}>
              <StatCard icon={<FiAircraft />} label="Fleet size" value={aircraft.length} accent="primary" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard icon={<FiTool />} label="In maintenance" value={aircraft.filter((a) => a.status === 'Maintenance').length} accent="warning" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                icon={<FiDroplet />}
                label="Avg. fuel level"
                value={aircraft.length ? Math.round(aircraft.reduce((s, a) => s + a.fuelLevel, 0) / aircraft.length) : 0}
                suffix="%"
                accent="info"
              />
            </Grid>
          </Grid>

          <ReusableTable
            title="Fleet"
            columns={columns}
            rows={aircraft}
            onRowClick={setSelected}
            searchKeys={['tailNumber', 'model', 'status', 'location']}
          />
        </>
      )}

      <ReusableDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.tailNumber}
        maxWidth="sm"
        actions={selected && (
          <>
            <Button startIcon={<FiTrash2 />} color="error" onClick={() => setDeleteTarget(selected)}>Delete</Button>
            <Button startIcon={<FiEdit2 />} variant="contained" onClick={() => openEdit(selected)}>Edit</Button>
          </>
        )}
      >
        {selected && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main' }}><FiAircraft /></Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selected.model}</Typography>
                <Typography variant="caption" color="text.secondary">{selected.manufacturer} · {selected.capacity} seats</Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip size="small" label={`Status: ${selected.status}`} color={statusColorMap[selected.status]} />
              <Chip size="small" label={`${(selected.totalFlightHours || 0).toLocaleString()} flight hrs`} />
              <Chip size="small" label={`Crew: ${selected.assignedCrew}`} />
              <Chip size="small" label={`Location: ${selected.location}`} />
            </Stack>
            <Box>
              <Typography variant="caption" color="text.secondary">Fuel level</Typography>
              <LinearProgress variant="determinate" value={selected.fuelLevel} sx={{ borderRadius: 2, height: 8, mt: 0.5 }} />
            </Box>
            <Stack direction="row" justifyContent="space-between">
              <Box><Typography variant="caption" color="text.secondary">Last maintenance</Typography><Typography>{formatDate(selected.lastMaintenance)}</Typography></Box>
              <Box textAlign="right"><Typography variant="caption" color="text.secondary">Next due</Typography><Typography>{formatDate(selected.nextMaintenanceDue)}</Typography></Box>
            </Stack>
            <Divider />
            <Typography variant="subtitle2">Maintenance history</Typography>
            <Stack spacing={1}>
              {maintenanceFor(selected.tailNumber).length === 0 && (
                <Typography variant="body2" color="text.secondary">No maintenance records for this aircraft.</Typography>
              )}
              {maintenanceFor(selected.tailNumber).map((m) => (
                <Stack key={m.id} direction="row" justifyContent="space-between" sx={{ p: 1, borderRadius: 2, bgcolor: 'action.hover' }}>
                  <Typography variant="body2">{m.type}</Typography>
                  <Chip size="small" label={m.status} />
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}
      </ReusableDialog>

      <ReusableDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.tailNumber}` : 'Add aircraft'}
        actions={
          <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        }
      >
        <Stack spacing={2} component="form" sx={{ pt: 1 }}>
          <Stack direction="row" spacing={2}>
            <Controller name="tailNumber" control={control} rules={{ required: true }} render={({ field }) => (
              <TextField {...field} label="Tail number" fullWidth />
            )} />
            <Controller name="model" control={control} rules={{ required: true }} render={({ field }) => (
              <TextField {...field} label="Model" fullWidth />
            )} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Controller name="manufacturer" control={control} render={({ field }) => (
              <TextField {...field} label="Manufacturer" fullWidth />
            )} />
            <Controller name="capacity" control={control} render={({ field }) => (
              <TextField {...field} type="number" label="Capacity" fullWidth />
            )} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Controller name="status" control={control} render={({ field }) => (
              <TextField {...field} select label="Status" fullWidth>
                {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            )} />
            <Controller name="fuelLevel" control={control} render={({ field }) => (
              <TextField {...field} type="number" label="Fuel level (%)" fullWidth />
            )} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Controller name="assignedCrew" control={control} render={({ field }) => (
              <TextField {...field} type="number" label="Assigned crew" fullWidth />
            )} />
            <Controller name="location" control={control} render={({ field }) => (
              <TextField {...field} label="Location (airport code)" fullWidth />
            )} />
          </Stack>
        </Stack>
      </ReusableDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        title={`Delete ${deleteTarget?.tailNumber}?`}
        description="This permanently removes the aircraft from the fleet. This cannot be undone."
      />
    </Box>
  );
}
