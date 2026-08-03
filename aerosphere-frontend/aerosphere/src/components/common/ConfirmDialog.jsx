import { Button, Typography, Stack } from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';
import ReusableDialog from './ReusableDialog';

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Delete', loading }) {
  return (
    <ReusableDialog
      open={open}
      onClose={onClose}
      title={title || 'Are you sure?'}
      maxWidth="xs"
      actions={
        <>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
            {loading ? 'Deleting…' : confirmLabel}
          </Button>
        </>
      }
    >
      <Stack alignItems="center" spacing={2} sx={{ py: 1 }}>
        <FiAlertTriangle size={32} color="var(--mui-palette-error-main)" />
        <Typography variant="body2" textAlign="center" color="text.secondary">
          {description || 'This action cannot be undone.'}
        </Typography>
      </Stack>
    </ReusableDialog>
  );
}
