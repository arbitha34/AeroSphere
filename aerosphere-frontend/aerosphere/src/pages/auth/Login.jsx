import { useState } from 'react';
import {
  TextField, Button, Stack, Typography, InputAdornment, IconButton, MenuItem,
  Checkbox, FormControlLabel, Link as MLink, Alert, CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/constants';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: '', password: '', role: 'Admin', rememberMe: true },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Unable to sign in. Please try again.');
    }
  };

  return (
    <Stack spacing={2.5} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={0.5}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Access your airport operations workspace
        </Typography>
      </Stack>

      {serverError && <Alert severity="error">{serverError}</Alert>}

      <Controller
        name="email"
        control={control}
        rules={{ required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' } }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Work email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{ startAdornment: <InputAdornment position="start"><FiMail /></InputAdornment> }}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{ required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } }}
        render={({ field }) => (
          <TextField
            {...field}
            type={showPassword ? 'text' : 'password'}
            label="Password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: <InputAdornment position="start"><FiLock /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Sign in as">
            {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>
        )}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Remember me" />
          )}
        />
        <MLink component={Link} to="/forgot-password" variant="body2" underline="hover">
          Forgot password?
        </MLink>
      </Stack>

      <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
        {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
      </Button>

      <Typography variant="caption" color="text.secondary" textAlign="center">
        Demo access — any email / password (6+ chars) signs you in with mock data.
      </Typography>
    </Stack>
  );
}
