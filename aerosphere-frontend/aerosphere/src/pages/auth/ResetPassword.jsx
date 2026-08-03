import { useState } from 'react';
import { TextField, Button, Stack, Typography, Alert, CircularProgress, LinearProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/authService';

function strength(pw) {
  let s = 0;
  if (pw.length >= 8) s += 25;
  if (/[A-Z]/.test(pw)) s += 25;
  if (/[0-9]/.test(pw)) s += 25;
  if (/[^A-Za-z0-9]/.test(pw)) s += 25;
  return s;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
  });
  const password = watch('password') || '';

  const onSubmit = async (values) => {
    if (values.password !== values.confirmPassword) return;
    await resetPassword(values);
    setDone(true);
    setTimeout(() => navigate('/login'), 1200);
  };

  return (
    <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={0.5}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Set a new password</Typography>
        <Typography variant="body2" color="text.secondary">Choose a strong password you haven't used before.</Typography>
      </Stack>

      {done && <Alert severity="success">Password updated — redirecting to sign in…</Alert>}

      <Controller
        name="password"
        control={control}
        rules={{ required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } }}
        render={({ field }) => (
          <TextField {...field} type="password" label="New password" fullWidth error={!!errors.password} helperText={errors.password?.message} />
        )}
      />
      <LinearProgress variant="determinate" value={strength(password)} sx={{ borderRadius: 2, height: 6 }} />

      <Controller
        name="confirmPassword"
        control={control}
        rules={{ required: 'Please confirm your password' }}
        render={({ field }) => (
          <TextField {...field} type="password" label="Confirm new password" fullWidth error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
        )}
      />

      <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
        {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Update password'}
      </Button>
    </Stack>
  );
}
