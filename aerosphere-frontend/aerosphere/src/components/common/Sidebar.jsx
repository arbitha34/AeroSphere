import { Box, Stack, Typography, Tooltip, IconButton, Avatar, Divider } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiGrid, FiSend, FiActivity as FiAircraft, FiUsers, FiPackage, FiMapPin,
  FiUser, FiSettings, FiChevronsLeft, FiChevronsRight,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/flights', label: 'Flight Management', icon: FiSend },
  { to: '/aircraft', label: 'Aircraft', icon: FiAircraft },
  { to: '/passengers', label: 'Passengers', icon: FiUsers },
  { to: '/baggage', label: 'Baggage Tracking', icon: FiPackage },
  { to: '/gates', label: 'Gates & Runways', icon: FiMapPin },
];

const NAV_BOTTOM = [
  { to: '/profile', label: 'Profile', icon: FiUser },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth();
  const location = useLocation();

  const renderItem = ({ to, label, icon: Icon }) => {
    const active = location.pathname.startsWith(to);
    return (
      <Tooltip key={to} title={collapsed ? label : ''} placement="right">
        <Box
          component={NavLink}
          to={to}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, px: collapsed ? 1.5 : 2, py: 1.2,
            borderRadius: 2.5, textDecoration: 'none', color: active ? 'primary.main' : 'text.secondary',
            bgcolor: active ? (t) => (t.palette.mode === 'dark' ? 'rgba(34,211,238,0.10)' : 'rgba(8,145,178,0.08)') : 'transparent',
            fontWeight: active ? 700 : 500, transition: 'all .2s ease', justifyContent: collapsed ? 'center' : 'flex-start',
            '&:hover': { bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)') },
          }}
        >
          <Icon size={19} />
          {!collapsed && <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>{label}</Typography>}
        </Box>
      </Tooltip>
    );
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 84 : 264 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      style={{ height: '100%' }}
    >
      <Stack
        sx={{
          height: '100%', px: 1.5, py: 2.5, borderRight: '1px solid',
          borderColor: 'divider', bgcolor: 'background.paper', overflow: 'hidden',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent={collapsed ? 'center' : 'space-between'} sx={{ px: 1, mb: 3 }}>
          {!collapsed && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <RadarMark />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>AeroSphere</Typography>
            </Stack>
          )}
          {collapsed && <RadarMark />}
          {!collapsed && (
            <IconButton size="small" onClick={onToggle}><FiChevronsLeft /></IconButton>
          )}
        </Stack>
        {collapsed && (
          <IconButton size="small" onClick={onToggle} sx={{ alignSelf: 'center', mb: 2 }}><FiChevronsRight /></IconButton>
        )}

        <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
          {NAV_ITEMS.map(renderItem)}
        </Stack>

        <Divider sx={{ my: 1.5 }} />
        <Stack spacing={0.5}>
          {NAV_BOTTOM.map(renderItem)}
        </Stack>

        <Divider sx={{ my: 1.5 }} />
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: collapsed ? 0 : 1, justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}>
            {user?.avatarInitial || 'A'}
          </Avatar>
          {!collapsed && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap>{user?.role}</Typography>
            </Box>
          )}
        </Stack>
      </Stack>
    </motion.div>
  );
}

function RadarMark() {
  return (
    <Box sx={{ position: 'relative', width: 30, height: 30, flexShrink: 0 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
        style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'conic-gradient(from 0deg, transparent 0%, #22D3EE 100%)',
          maskImage: 'radial-gradient(circle, transparent 55%, black 58%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 55%, black 58%)',
        }}
      />
      <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: '0 0 8px currentColor' }} />
      </Box>
    </Box>
  );
}
