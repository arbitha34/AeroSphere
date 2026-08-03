import { Box, Stack, Typography, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2,
        backgroundImage: theme.custom.gradientRadar,
      }}
    >
      <Stack alignItems="center" spacing={3} sx={{ width: '100%', maxWidth: 440 }}>
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box sx={{ position: 'relative', width: 34, height: 34 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, transparent 0%, #22D3EE 100%)',
                  maskImage: 'radial-gradient(circle, transparent 55%, black 58%)',
                  WebkitMaskImage: 'radial-gradient(circle, transparent 55%, black 58%)',
                }}
              />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>AeroSphere</Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 0.5, letterSpacing: '0.08em' }}>
            ENTERPRISE AIRPORT OPERATIONS PLATFORM
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{ width: '100%' }}
        >
          <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 5, ...theme.custom.glass }}>
            <Outlet />
          </Paper>
        </motion.div>
      </Stack>
    </Box>
  );
}
