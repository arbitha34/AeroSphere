import { Box, Skeleton, Stack } from '@mui/material';

export default function LoadingState({ rows = 6 }) {
  return (
    <Box sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ p: 2.5 }}>
        <Skeleton variant="text" width={180} height={32} />
      </Box>
      <Stack spacing={1.5} sx={{ px: 2.5, pb: 2.5 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={44} sx={{ borderRadius: 2 }} />
        ))}
      </Stack>
    </Box>
  );
}
