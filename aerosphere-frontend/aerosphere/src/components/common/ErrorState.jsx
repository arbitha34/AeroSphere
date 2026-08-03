import { Stack, Typography, Button } from '@mui/material';
import { FiWifiOff, FiRefreshCw } from 'react-icons/fi';

export default function ErrorState({ message, onRetry }) {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ py: 8, color: 'text.secondary' }}>
      <FiWifiOff size={36} />
      <Typography variant="subtitle1" color="text.primary">Couldn't load this data</Typography>
      <Typography variant="body2" sx={{ maxWidth: 380, textAlign: 'center' }}>
        {message || 'Something went wrong talking to the AeroSphere backend.'}
      </Typography>
      {onRetry && (
        <Button size="small" startIcon={<FiRefreshCw />} onClick={onRetry} variant="outlined">
          Try again
        </Button>
      )}
    </Stack>
  );
}
