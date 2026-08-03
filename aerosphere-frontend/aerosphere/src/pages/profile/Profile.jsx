import { Box, Grid, Paper, Avatar, Typography, Stack, TextField, Button, Divider, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const theme = useTheme();
  const { user } = useAuth();
  const { control, handleSubmit } = useForm({ defaultValues: { name: user?.name, email: user?.email, phone: '+1 555 010 2938' } });

  const onSubmit = () => toast.success('Profile updated');

  return (
    <Box>
      <PageHeader title="Profile" subtitle="Manage your personal information and account" breadcrumbs={[{ label: 'Dashboard' }, { label: 'Profile' }]} />
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, textAlign: 'center', ...theme.custom.glass }}>
            <Avatar sx={{ width: 88, height: 88, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: 32, fontWeight: 700 }}>
              {user?.avatarInitial}
            </Avatar>
            <Typography variant="h6">{user?.name}</Typography>
            <Chip label={user?.role} size="small" sx={{ mt: 1 }} />
            <Divider sx={{ my: 2.5 }} />
            <Stack spacing={1} textAlign="left">
              <Typography variant="caption" color="text.secondary">Employee ID</Typography>
              <Typography variant="body2">{user?.id}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>Email</Typography>
              <Typography variant="body2">{user?.email}</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, ...theme.custom.glass }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Personal details</Typography>
            <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)}>
              <Controller name="name" control={control} render={({ field }) => <TextField {...field} label="Full name" fullWidth />} />
              <Controller name="email" control={control} render={({ field }) => <TextField {...field} label="Email" fullWidth />} />
              <Controller name="phone" control={control} render={({ field }) => <TextField {...field} label="Phone" fullWidth />} />
              <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>Save changes</Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
