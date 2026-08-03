import { Box, Stack, Typography, Breadcrumbs, Link as MLink } from '@mui/material';
import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle, breadcrumbs = [], actions }) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 1 }} separator="›">
          {breadcrumbs.map((b, i) => (
            <MLink key={i} underline="hover" color="text.secondary" variant="caption" href={b.href || '#'}>
              {b.label}
            </MLink>
          ))}
        </Breadcrumbs>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Typography variant="h4">{title}</Typography>
          {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
        </motion.div>
        {actions && <Stack direction="row" spacing={1.5}>{actions}</Stack>}
      </Stack>
    </Box>
  );
}
