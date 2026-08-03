import { Stack, Typography } from '@mui/material';
import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title = 'Nothing here yet', description = 'Try adjusting your filters or search terms.' }) {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ py: 8, color: 'text.secondary' }}>
      <FiInbox size={40} />
      <Typography variant="subtitle1" color="text.primary">{title}</Typography>
      <Typography variant="body2" sx={{ maxWidth: 320, textAlign: 'center' }}>{description}</Typography>
    </Stack>
  );
}
