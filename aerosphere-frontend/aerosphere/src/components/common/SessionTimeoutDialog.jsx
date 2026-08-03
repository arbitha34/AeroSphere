import { Button, Typography, Stack } from '@mui/material';
import { FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ReusableDialog from './ReusableDialog';
import { useAuth } from '../../contexts/AuthContext';

export default function SessionTimeoutDialog() {
  const { sessionWarning, extendSession, logout } = useAuth();
  const navigate = useNavigate();

  if (!sessionWarning) return null;

  return (
    <ReusableDialog
      open={sessionWarning}
      onClose={extendSession}
      title="Your session is about to expire"
      actions={
        <>
          <Button onClick={() => { logout('You were signed out'); navigate('/login'); }} color="inherit">
            Sign out now
          </Button>
          <Button onClick={extendSession} variant="contained">Stay signed in</Button>
        </>
      }
    >
      <Stack alignItems="center" spacing={2} sx={{ py: 2 }}>
        <FiClock size={36} />
        <Typography variant="body2" textAlign="center" color="text.secondary">
          For your security, AeroSphere automatically signs out idle sessions.
          You'll be signed out in less than a minute unless you choose to stay.
        </Typography>
      </Stack>
    </ReusableDialog>
  );
}
