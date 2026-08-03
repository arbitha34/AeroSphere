import { useState } from 'react';
import {
  Box, Grid, Tabs, Tab, Chip, Button, Stack, TextField, MenuItem,
} from '@mui/material';
import { FiMapPin, FiCheckCircle, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
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
import { getGates, getRunways, createGate, updateGate, deleteGate } from '../../services/gateService';

const gateStatusColor = { Available: 'success', Occupied: 'primary', Maintenance: 'warning', Reserved: 'secondary' };
const runwayStatusColor = { Active: 'success', Closed: 'error', Maintenance: 'warning' };
const GATE_STATUS_OPTIONS = ['Available', 'Occupied', 'Maintenance', 'Reserved'];

const emptyForm = { gateNumber: '', terminal: 'Terminal 1', status: 'Available', assignedFlight: '', capacity: 200 };

export default function GateManagement() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    data: gates = [], isLoading: gatesLoading, isError: gatesError, error: gatesErr, refetch: refetchGates,
  } = useQuery({ queryKey: ['gates'], queryFn: getGates });

  const {
    data: runways = [], isLoading: runwaysLoading, isError: runwaysError, error: runwaysErr, refetch: refetchRunways,
  } = useQuery({ queryKey: ['runways'], queryFn: getRunways });

  const createMutation = useMutation({
    mutationFn: createGate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gates'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateGate(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gates'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteGate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gates'] });
      setDeleteTarget(null);
    },
  });

  const { control, handleSubmit, reset } = useForm({ defaultValues: emptyForm });

  const openCreate = () => { setEditing(null); reset(emptyForm); setFormOpen(true); };
  const openEdit = (g) => { setEditing(g); reset(g); setFormOpen(true); };

  const onSubmit = async (values) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload: values });
        toast.success(`Gate ${values.gateNumber} updated`);
      } else {
        await createMutation.mutateAsync(values);
        toast.success(`Gate ${values.gateNumber} added`);
      }
      setFormOpen(false);
    } catch (err) {
      toast.error(err.message || 'Could not save this gate');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Gate ${deleteTarget.gateNumber} removed`);
    } catch (err) {
      toast.error(err.message || 'Could not delete this gate');
    }
  };

  const gateColumns = [
    { field: 'gateNumber', headerName: 'Gate' },
    { field: 'terminal', headerName: 'Terminal' },
    { field: 'status', headerName: 'Status', render: (r) => <Chip size="small" label={r.status} color={gateStatusColor[r.status]} /> },
    { field: 'assignedFlight', headerName: 'Assigned Flight', render: (r) => r.assignedFlight || '—' },
    { field: 'capacity', headerName: 'Capacity' },
    { field: 'actions', headerName: '', sortable: false, render: (r) => (
      <Stack direction="row" spacing={0.5} onClick={(e) => e.stopPropagation()}>
        <Button size="small" onClick={() => openEdit(r)}><FiEdit2 /></Button>
        <Button size="small" color="error" onClick={() => setDeleteTarget(r)}><FiTrash2 /></Button>
      </Stack>
    ) },
  ];

  const runwayColumns = [
    { field: 'designation', headerName: 'Runway' },
    { field: 'lengthMeters', headerName: 'Length (m)' },
    { field: 'surface', headerName: 'Surface' },
    { field: 'status', headerName: 'Status', render: (r) => <Chip size="small" label={r.status} color={runwayStatusColor[r.status]} /> },
    { field: 'trafficToday', headerName: 'Movements today' },
  ];

  const isLoading = gatesLoading || runwaysLoading;
  const isError = gatesError || runwaysError;

  return (
    <Box>
      <PageHeader
        title="Gate & Runway Management"
        subtitle="Terminal gate assignments and runway operational status"
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Gates & Runways' }]}
        actions={tab === 0 && <Button variant="contained" startIcon={<FiPlus />} onClick={openCreate}>Add gate</Button>}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={gatesErr?.message || runwaysErr?.message} onRetry={() => { refetchGates(); refetchRunways(); }} />
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={4}>
              <StatCard icon={<FiMapPin />} label="Total gates" value={gates.length} accent="primary" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard icon={<FiCheckCircle />} label="Gates available" value={gates.filter((g) => g.status === 'Available').length} accent="success" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard icon={<FiMapPin />} label="Active runways" value={runways.filter((r) => r.status === 'Active').length} accent="info" />
            </Grid>
          </Grid>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Gates" />
            <Tab label="Runways" />
          </Tabs>

          {tab === 0 ? (
            <ReusableTable title="Gates" columns={gateColumns} rows={gates} searchKeys={['gateNumber', 'terminal', 'status', 'assignedFlight']} />
          ) : (
            <ReusableTable title="Runways" columns={runwayColumns} rows={runways} searchKeys={['designation', 'surface', 'status']} />
          )}
        </>
      )}

      <ReusableDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit gate ${editing.gateNumber}` : 'Add gate'}
        actions={
          <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        }
      >
        <Stack spacing={2} component="form" sx={{ pt: 1 }}>
          <Stack direction="row" spacing={2}>
            <Controller name="gateNumber" control={control} rules={{ required: true }} render={({ field }) => (
              <TextField {...field} label="Gate number" fullWidth />
            )} />
            <Controller name="terminal" control={control} render={({ field }) => (
              <TextField {...field} select label="Terminal" fullWidth>
                {['Terminal 1', 'Terminal 2', 'Terminal 3', 'Terminal 4'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            )} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Controller name="status" control={control} render={({ field }) => (
              <TextField {...field} select label="Status" fullWidth>
                {GATE_STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            )} />
            <Controller name="capacity" control={control} render={({ field }) => (
              <TextField {...field} type="number" label="Capacity" fullWidth />
            )} />
          </Stack>
          <Controller name="assignedFlight" control={control} render={({ field }) => (
            <TextField {...field} label="Assigned flight (optional)" fullWidth />
          )} />
        </Stack>
      </ReusableDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        title={`Delete gate ${deleteTarget?.gateNumber}?`}
        description="This permanently removes the gate. This cannot be undone."
      />
    </Box>
  );
}
