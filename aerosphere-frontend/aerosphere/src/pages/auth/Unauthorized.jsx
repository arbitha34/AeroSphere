import { Stack, Typography, Button } from '@mui/material';
import { FiShieldOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <Stack spacing={2} alignItems="center" textAlign="center">
      <FiShieldOff size={40} />
      <Typography variant="h5" sx={{ fontWeight: 700 }}>Access restricted</Typography>
      <Typography variant="body2" color="text.secondary">
        Your role doesn't have permission to view this area of AeroSphere. Contact your administrator if you believe this is a mistake.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
    </Stack>
  );
}
