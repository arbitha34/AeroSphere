import { useState } from 'react';
import {
  Box, Grid, Chip, Stack, Typography, Avatar, Divider, Button, TextField, MenuItem,
} from '@mui/material';
import { FiUsers, FiUserCheck, FiHeart, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
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
import {
  getPassengers, checkInPassenger, createPassenger, updatePassenger, deletePassenger,
} from '../../services/passengerService';

const checkinColor = { 'Checked In': 'success', Boarded: 'primary', 'Not Checked In': 'default' };
const MEAL_OPTIONS = ['Standard', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free'];
const VISA_OPTIONS = ['Not Required', 'Valid', 'Pending', 'Expired'];

const emptyForm = {
  name: '', passportNumber: '', nationality: '', visaStatus: 'Not Required',
  flightNumber: '', seat: '', meal: 'Standard', specialAssistance: '',
};

export default function PassengerList() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: passengers = [], isLoading, isError, error, refetch } = useQuery({ queryKey: ['passengers'], queryFn: getPassengers });

  const checkInMutation = useMutation({
    mutationFn: checkInPassenger,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['passengers'] });
      setSelected((s) => (s && s.id === id ? { ...s, checkInStatus: 'Checked In' } : s));
    },
  });
  const createMutation = useMutation({
    mutationFn: createPassenger,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['passengers'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updatePassenger(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['passengers'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deletePassenger,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passengers'] });
      setSelected(null);
      setDeleteTarget(null);
    },
  });

  const { control, handleSubmit, reset } = useForm({ defaultValues: emptyForm });

  const openCreate = () => { setEditing(null); reset(emptyForm); setFormOpen(true); };
  const openEdit = (p) => { setEditing(p); reset(p); setFormOpen(true); setSelected(null); };

  const columns = [
    { field: 'name', headerName: 'Passenger' },
    { field: 'flightNumber', headerName: 'Flight' },
    { field: 'seat', headerName: 'Seat' },
    { field: 'nationality', headerName: 'Nationality' },
    { field: 'checkInStatus', headerName: 'Check-in', render: (r) => <Chip size="small" label={r.checkInStatus} color={checkinColor[r.checkInStatus]} /> },
    { field: 'baggageCount', headerName: 'Bags' },
  ];

  const handleCheckIn = async () => {
    try {
      await checkInMutation.mutateAsync(selected.id);
      toast.success(`${selected.name} checked in`);
    } catch (err) {
      toast.error(err.message || 'Could not check in this passenger');
    }
  };

  const onSubmit = async (values) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload: values });
        toast.success(`${values.name} updated`);
      } else {
        await createMutation.mutateAsync(values);
        toast.success(`${values.name} added`);
      }
      setFormOpen(false);
    } catch (err) {
      toast.error(err.message || 'Could not save this passenger');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.name} removed`);
    } catch (err) {
      toast.error(err.message || 'Could not delete this passenger');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Passenger Management"
        subtitle="Check-in status, boarding, seating, and special assistance"
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Passengers' }]}
        actions={<Button variant="contained" startIcon={<FiPlus />} onClick={openCreate}>Add passenger</Button>}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={refetch} />
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={4}>
              <StatCard icon={<FiUsers />} label="Total passengers" value={passengers.length} accent="primary" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard icon={<FiUserCheck />} label="Checked in" value={passengers.filter((p) => p.checkInStatus !== 'Not Checked In').length} accent="success" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard icon={<FiHeart />} label="Special assistance" value={passengers.filter((p) => p.specialAssistance).length} accent="secondary" />
            </Grid>
          </Grid>

          <ReusableTable
            title="Passengers"
            columns={columns}
            rows={passengers}
            onRowClick={setSelected}
            searchKeys={['name', 'flightNumber', 'nationality', 'passportNumber']}
          />
        </>
      )}

      <ReusableDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        actions={selected && (
          <>
            <Button startIcon={<FiTrash2 />} color="error" onClick={() => setDeleteTarget(selected)}>Delete</Button>
            <Button startIcon={<FiEdit2 />} onClick={() => openEdit(selected)}>Edit</Button>
            {selected.checkInStatus === 'Not Checked In' && (
              <Button variant="contained" onClick={handleCheckIn} disabled={checkInMutation.isPending}>
                {checkInMutation.isPending ? 'Checking in…' : 'Check in'}
              </Button>
            )}
          </>
        )}
      >
        {selected && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'secondary.main' }}>{selected.name.charAt(0)}</Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selected.name}</Typography>
                <Typography variant="caption" color="text.secondary">{selected.passportNumber} · {selected.nationality}</Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip size="small" label={`Flight ${selected.flightNumber}`} />
              <Chip size="small" label={`Seat ${selected.seat}`} />
              <Chip size="small" label={`Meal: ${selected.meal}`} />
              <Chip size="small" label={`Visa: ${selected.visaStatus}`} />
              <Chip size="small" label={`${selected.baggageCount} bag(s)`} />
              {selected.specialAssistance && <Chip size="small" color="secondary" label={selected.specialAssistance} />}
            </Stack>
          </Stack>
        )}
      </ReusableDialog>

      <ReusableDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${editing.name}` : 'Add passenger'}
        actions={
          <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        }
      >
        <Stack spacing={2} component="form" sx={{ pt: 1 }}>
          <Controller name="name" control={control} rules={{ required: true }} render={({ field }) => (
            <TextField {...field} label="Full name" fullWidth />
          )} />
          <Stack direction="row" spacing={2}>
            <Controller name="passportNumber" control={control} render={({ field }) => (
              <TextField {...field} label="Passport number" fullWidth />
            )} />
            <Controller name="nationality" control={control} render={({ field }) => (
              <TextField {...field} label="Nationality" fullWidth />
            )} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Controller name="flightNumber" control={control} render={({ field }) => (
              <TextField {...field} label="Flight number" fullWidth />
            )} />
            <Controller name="seat" control={control} render={({ field }) => (
              <TextField {...field} label="Seat" fullWidth />
            )} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Controller name="visaStatus" control={control} render={({ field }) => (
              <TextField {...field} select label="Visa status" fullWidth>
                {VISA_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            )} />
            <Controller name="meal" control={control} render={({ field }) => (
              <TextField {...field} select label="Meal" fullWidth>
                {MEAL_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            )} />
          </Stack>
          <Controller name="specialAssistance" control={control} render={({ field }) => (
            <TextField {...field} label="Special assistance (optional)" fullWidth />
          )} />
        </Stack>
      </ReusableDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        title={`Delete ${deleteTarget?.name}?`}
        description="This permanently removes the passenger record. This cannot be undone."
      />
    </Box>
  );
}
