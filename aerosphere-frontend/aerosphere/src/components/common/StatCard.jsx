import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

export default function StatCard({ icon, label, value, suffix = '', trend, accent = 'primary', delay = 0 }) {
  const theme = useTheme();
  const accentColor = theme.palette[accent]?.main || theme.palette.primary.main;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -4 }}
      style={{ height: '100%' }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          height: '100%',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          ...theme.custom.glass,
        }}
      >
        <Box
          sx={{
            position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor}33, transparent 70%)`,
          }}
        />
        <Stack spacing={1.5} sx={{ position: 'relative' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box
              sx={{
                width: 42, height: 42, borderRadius: 2.5, display: 'grid', placeItems: 'center',
                background: `${accentColor}1F`, color: accentColor, fontSize: 20,
              }}
            >
              {icon}
            </Box>
            {trend != null && (
              <Typography variant="caption" sx={{ color: trend >= 0 ? 'success.main' : 'error.main', fontWeight: 700 }}>
                {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
              </Typography>
            )}
          </Stack>
          <AnimatedCounter value={value} suffix={suffix} variant="h4" />
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Stack>
      </Paper>
    </motion.div>
  );
}
