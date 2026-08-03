import { Stack, Typography, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';
import { useTheme } from '@mui/material/styles';

export default function NotFound() {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', backgroundImage: theme.custom.gradientRadar, p: 2 }}>
      <Stack spacing={2} alignItems="center" textAlign="center">
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
        >
          <Typography sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 96, lineHeight: 1, opacity: 0.9 }}>
            404
          </Typography>
        </motion.div>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Flight path not found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
          The page you're looking for has diverted or doesn't exist. Let's get you back on course.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>Return to dashboard</Button>
      </Stack>
    </Box>
  );
}
