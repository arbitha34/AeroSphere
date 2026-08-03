import { useState } from 'react';
import { TextField, Button, Stack, Typography, Alert, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { requestOtp } from '../../services/authService';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async ({ email }) => {
    const result = await requestOtp(email);
    sessionStorage.setItem('aerosphere-reset-email', result.email);
    setSent(true);
    setTimeout(() => navigate('/otp-verification'), 900);
  };

  return (
    <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={0.5}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Forgot password</Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your work email and we'll send a one-time verification code.
        </Typography>
      </Stack>

      {sent && <Alert severity="success">Code sent — redirecting to verification…</Alert>}

      <Controller
        name="email"
        control={control}
        rules={{ required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' } }}
        render={({ field }) => (
          <TextField {...field} label="Work email" fullWidth error={!!errors.email} helperText={errors.email?.message} />
        )}
      />

      <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
        {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Send verification code'}
      </Button>

      <Typography variant="body2" textAlign="center">
        <Link to="/login" style={{ color: 'inherit' }}>Back to sign in</Link>
      </Typography>
    </Stack>
  );
}
