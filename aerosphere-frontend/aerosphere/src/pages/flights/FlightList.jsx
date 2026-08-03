import { useMemo, useState } from 'react';
import {
  Box, Grid, Button, Stack, Typography, Drawer, TextField, MenuItem,
  Divider, Chip, Avatar,
} from '@mui/material';
import { FiPlus, FiSend, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import ReusableTable from '../../components/common/ReusableTable';
import ReusableDialog from '../../components/common/ReusableDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { getFlights, createFlight, updateFlight, deleteFlight } from '../../services/flightService';
import { FLIGHT_STATUSES, AIRLINES, AIRPORTS } from '../../data/generateMockData'; // static reference lists for dropdowns only
import { formatDateTime } from '../../utils/formatters';

const emptyForm = { airline: AIRLINES[0], origin: AIRPORTS[0].code, destination: AIRPORTS[1].code, scheduledDeparture: '', status: 'Scheduled' };

export default function FlightList() {
  const queryClient = useQueryClient();
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: flights = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['flights'],
    queryFn: getFlights,
  });

  const createMutation = useMutation({
    mutationFn: createFlight,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['flights'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateFlight(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['flights'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      setSelected(null);
      setDeleteTarget(null);
    },
  });

  const { control, handleSubmit, reset } = useForm({ defaultValues: emptyForm });

  const openCreate = () => { setEditing(null); reset(emptyForm); setFormOpen(true); };
  const openEdit = (f) => {
    setEditing(f);
    reset({
      airline: f.airline, origin: f.origin, destination: f.destination,
      scheduledDeparture: f.scheduledDeparture?.slice(0, 16) || '', status: f.status,
    });
    setFormOpen(true);
    setSelected(null);
  };

  const rows = useMemo(
    () => (statusFilter === 'All' ? flights : flights.filter((f) => f.status === statusFilter)),
    [flights, statusFilter]
  );

  const columns = [
    { field: 'flightNumber', headerName: 'Flight' },
    { field: 'airline', headerName: 'Airline' },
    { field: 'originCity', headerName: 'Origin', render: (r) => `${r.origin} · ${r.originCity}` },
    { field: 'destinationCity', headerName: 'Destination', render: (r) => `${r.destination} · ${r.destinationCity}` },
    { field: 'scheduledDeparture', headerName: 'Departure', render: (r) => formatDateTime(r.scheduledDeparture) },
    { field: 'gate', headerName: 'Gate' },
    { field: 'status', headerName: 'Status', render: (r) => <StatusChip status={r.status} /> },
  ];

  const onSubmit = async (values) => {
    try {
      const originAirport = AIRPORTS.find((a) => a.code === values.origin);
      const destinationAirport = AIRPORTS.find((a) => a.code === values.destination);
      const enriched = { ...values, originCity: originAirport?.city, destinationCity: destinationAirport?.city };

      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload: enriched });
        toast.success(`Flight ${editing.flightNumber} updated`);
      } else {
        const payload = { ...enriched, flightNumber: `NF${Math.floor(1000 + Math.random() * 9000)}`, delayMinutes: 0 };
        await createMutation.mutateAsync(payload);
        toast.success(`Flight scheduled: ${values.airline} · ${values.origin} → ${values.destination}`);
      }
      reset(emptyForm);
      setFormOpen(false);
    } catch (err) {
      toast.error(err.message || 'Could not save this flight');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Flight ${deleteTarget.flightNumber} removed`);
    } catch (err) {
      toast.error(err.message || 'Could not delete this flight');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Flight Management"
        subtitle="Schedule, monitor, and manage every flight across the airport"
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Flight Management' }]}
        actions={<Button variant="contained" startIcon={<FiPlus />} onClick={openCreate}>Schedule flight</Button>}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard icon={<FiSend />} label="Total flights today" value={flights.length} accent="primary" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard icon={<FiSend />} label="On time" value={flights.filter((f) => f.status === 'On Time').length} accent="success" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard icon={<FiSend />} label="Delayed" value={flights.filter((f) => f.status === 'Delayed').length} accent="warning" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard icon={<FiSend />} label="Cancelled" value={flights.filter((f) => f.status === 'Cancelled').length} accent="error" />
            </Grid>
          </Grid>

          <ReusableTable
            title="All flights"
            columns={columns}
            rows={rows}
            onRowClick={setSelected}
            onFilterClick={() => setFilterOpen(true)}
            searchKeys={['flightNumber', 'airline', 'origin', 'destination', 'originCity', 'destinationCity', 'status']}
          />
        </>
      )}

      <Drawer anchor="right" open={filterOpen} onClose={() => setFilterOpen(false)}>
        <Box sx={{ width: 300, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Advanced filters</Typography>
          <TextField select fullWidth label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="All">All statuses</MenuItem>
            {FLIGHT_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={() => setFilterOpen(false)}>Apply filters</Button>
        </Box>
      </Drawer>

      <ReusableDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Flight ${selected?.flightNumber || ''}`}
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
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}><FiSend /></Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selected.airline}</Typography>
                <StatusChip status={selected.status} />
              </Box>
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Box><Typography variant="caption" color="text.secondary">Origin</Typography><Typography>{selected.origin} — {selected.originCity}</Typography></Box>
              <Box textAlign="right"><Typography variant="caption" color="text.secondary">Destination</Typography><Typography>{selected.destination} — {selected.destinationCity}</Typography></Box>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Box><Typography variant="caption" color="text.secondary">Departure</Typography><Typography>{formatDateTime(selected.scheduledDeparture)}</Typography></Box>
              <Box textAlign="right"><Typography variant="caption" color="text.secondary">Arrival</Typography><Typography>{formatDateTime(selected.scheduledArrival)}</Typography></Box>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={`Gate ${selected.gate}`} size="small" />
              <Chip label={`Aircraft ${selected.aircraft}`} size="small" />
              <Chip label={`${selected.passengerCount} passengers`} size="small" />
              <Chip label={`${selected.crew} crew`} size="small" />
              {selected.delayMinutes > 0 && <Chip label={`Delayed ${selected.delayMinutes} min`} size="small" color="warning" />}
            </Stack>
          </Stack>
        )}
      </ReusableDialog>

      <ReusableDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit flight ${editing.flightNumber}` : 'Schedule a new flight'}
        actions={
          <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        }
      >
        <Stack spacing={2} component="form" sx={{ pt: 1 }}>
          <Controller name="airline" control={control} render={({ field }) => (
            <TextField {...field} select label="Airline" fullWidth>
              {AIRLINES.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
            </TextField>
          )} />
          <Stack direction="row" spacing={2}>
            <Controller name="origin" control={control} render={({ field }) => (
              <TextField {...field} select label="Origin" fullWidth>
                {AIRPORTS.map((a) => <MenuItem key={a.code} value={a.code}>{a.code} — {a.city}</MenuItem>)}
              </TextField>
            )} />
            <Controller name="destination" control={control} render={({ field }) => (
              <TextField {...field} select label="Destination" fullWidth>
                {AIRPORTS.map((a) => <MenuItem key={a.code} value={a.code}>{a.code} — {a.city}</MenuItem>)}
              </TextField>
            )} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Controller name="scheduledDeparture" control={control} render={({ field }) => (
              <TextField {...field} type="datetime-local" label="Scheduled departure" fullWidth InputLabelProps={{ shrink: true }} />
            )} />
            <Controller name="status" control={control} render={({ field }) => (
              <TextField {...field} select label="Status" fullWidth>
                {FLIGHT_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            )} />
          </Stack>
        </Stack>
      </ReusableDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        title={`Delete flight ${deleteTarget?.flightNumber}?`}
        description="This permanently removes the flight. This cannot be undone."
      />
    </Box>
  );
}
