import { useState } from 'react';
import {
  Box, Grid, Chip, Stack, Typography, Stepper, Step, StepLabel, Divider,
  Button, TextField, MenuItem,
} from '@mui/material';
import { FiPackage, FiAlertCircle, FiCheckCircle, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
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
import { getBaggage, createBaggage, updateBaggage, deleteBaggage } from '../../services/baggageService';

const STAGES = ['Checked In', 'Loaded', 'In Transit', 'Arrived'];
const ALL_STATUSES = ['Checked In', 'Loaded', 'In Transit', 'Arrived', 'Delayed', 'Lost'];
const LOCATIONS = ['Check-in Counter', 'Security Screening', 'Sorting Facility', 'Aircraft Hold', 'Carousel'];
const statusColor = { 'Checked In': 'default', Loaded: 'info', 'In Transit': 'primary', Arrived: 'success', Delayed: 'warning', Lost: 'error' };

const emptyForm = {
  passengerName: '', passengerId: '', flightNumber: '', weightKg: 20,
  status: 'Checked In', lastScanLocation: 'Check-in Counter',
};

export default function BaggageTracking() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: baggage = [], isLoading, isError, error, refetch } = useQuery({ queryKey: ['baggage'], queryFn: getBaggage });

  const createMutation = useMutation({
    mutationFn: createBaggage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['baggage'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateBaggage(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['baggage'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteBaggage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['baggage'] });
      setSelected(null);
      setDeleteTarget(null);
    },
  });

  const { control, handleSubmit, reset } = useForm({ defaultValues: emptyForm });

  const openCreate = () => { setEditing(null); reset(emptyForm); setFormOpen(true); };
  const openEdit = (b) => { setEditing(b); reset(b); setFormOpen(true); setSelected(null); };

  const columns = [
    { field: 'tag', headerName: 'Bag Tag' },
    { field: 'passengerName', headerName: 'Passenger' },
    { field: 'flightNumber', headerName: 'Flight' },
    { field: 'weightKg', headerName: 'Weight (kg)' },
    { field: 'status', headerName: 'Status', render: (r) => <Chip size="small" label={r.status} color={statusColor[r.status]} /> },
    { field: 'lastScanLocation', headerName: 'Last Scan' },
  ];

  const activeStep = selected ? STAGES.indexOf(selected.status) : 0;

  const onSubmit = async (values) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload: values });
        toast.success(`Bag ${editing.tag} updated`);
      } else {
        await createMutation.mutateAsync(values);
        toast.success('Bag added');
      }
      setFormOpen(false);
    } catch (err) {
      toast.error(err.message || 'Could not save this bag');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`Bag ${deleteTarget.tag} removed`);
    } catch (err) {
      toast.error(err.message || 'Could not delete this bag');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Baggage Tracking"
        subtitle="Real-time scan history and status for every checked bag"
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Baggage Tracking' }]}
        actions={<Button variant="contained" startIcon={<FiPlus />} onClick={openCreate}>Add bag</Button>}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={4}>
              <StatCard icon={<FiPackage />} label="Bags tracked today" value={baggage.length} accent="primary" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard icon={<FiAlertCircle />} label="Delayed / lost" value={baggage.filter((b) => ['Delayed', 'Lost'].includes(b.status)).length} accent="error" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard icon={<FiCheckCircle />} label="Arrived safely" value={baggage.filter((b) => b.status === 'Arrived').length} accent="success" />
            </Grid>
          </Grid>

          <ReusableTable
            title="Baggage — all tags"
            columns={columns}
            rows={baggage}
            onRowClick={setSelected}
            searchKeys={['tag', 'passengerName', 'flightNumber', 'status']}
            defaultRowsPerPage={10}
          />
        </>
      )}

      <ReusableDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Bag ${selected?.tag || ''}`}
        maxWidth="sm"
        actions={selected && (
          <>
            <Button startIcon={<FiTrash2 />} color="error" onClick={() => setDeleteTarget(selected)}>Delete</Button>
            <Button startIcon={<FiEdit2 />} variant="contained" onClick={() => openEdit(selected)}>Edit</Button>
          </>
        )}
      >
        {selected && (
          <Stack spacing={3}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip size="small" label={`Passenger: ${selected.passengerName}`} />
              <Chip size="small" label={`Flight ${selected.flightNumber}`} />
              <Chip size="small" label={`${selected.weightKg} kg`} />
            </Stack>
            <Divider />
            {['Delayed', 'Lost'].includes(selected.status) ? (
              <Chip color={statusColor[selected.status]} label={`Status: ${selected.status}`} />
            ) : (
              <Stepper activeStep={activeStep} alternativeLabel>
                {STAGES.map((s) => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
              </Stepper>
            )}
            <Box>
              <Typography variant="caption" color="text.secondary">Last scan location</Typography>
              <Typography variant="body1">{selected.lastScanLocation}</Typography>
            </Box>
          </Stack>
        )}
      </ReusableDialog>

      <ReusableDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit bag ${editing.tag}` : 'Add bag'}
        actions={
          <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        }
      >
        <Stack spacing={2} component="form" sx={{ pt: 1 }}>
          <Stack direction="row" spacing={2}>
            <Controller name="passengerName" control={control} rules={{ required: true }} render={({ field }) => (
              <TextField {...field} label="Passenger name" fullWidth />
            )} />
            <Controller name="flightNumber" control={control} render={({ field }) => (
              <TextField {...field} label="Flight number" fullWidth />
            )} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Controller name="weightKg" control={control} render={({ field }) => (
              <TextField {...field} type="number" label="Weight (kg)" fullWidth />
            )} />
            <Controller name="status" control={control} render={({ field }) => (
              <TextField {...field} select label="Status" fullWidth>
                {ALL_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            )} />
          </Stack>
          <Controller name="lastScanLocation" control={control} render={({ field }) => (
            <TextField {...field} select label="Last scan location" fullWidth>
              {LOCATIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          )} />
        </Stack>
      </ReusableDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        title={`Delete bag ${deleteTarget?.tag}?`}
        description="This permanently removes the baggage record. This cannot be undone."
      />
    </Box>
  );
}
