import { useState } from 'react';
import {
  AppBar, Toolbar, InputBase, IconButton, Badge, Menu, MenuItem, Avatar, Stack,
  Typography, Box, ListItemIcon, ListItemText, Divider,
} from '@mui/material';
import { FiSearch, FiBell, FiSun, FiMoon, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const NOTIFICATIONS = [
  { id: 1, text: 'Gate B12 reassigned for flight SB204', time: '2m ago' },
  { id: 2, text: 'Aircraft N481ZG scheduled for maintenance', time: '18m ago' },
  { id: 3, text: 'Flight MW117 delayed by 40 minutes', time: '1h ago' },
];

export default function Navbar() {
  const { mode, toggleMode } = useThemeMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Box
          sx={{
            display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, maxWidth: 460,
            bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
            borderRadius: 3, px: 1.5, py: 0.75,
          }}
        >
          <FiSearch color="var(--mui-palette-text-secondary)" />
          <InputBase placeholder="Search flights, passengers, gates, aircraft…" fullWidth sx={{ fontSize: 14 }} />
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto' }}>
          <IconButton onClick={toggleMode}>{mode === 'dark' ? <FiSun /> : <FiMoon />}</IconButton>

          <IconButton onClick={(e) => setNotifAnchor(e.currentTarget)}>
            <Badge badgeContent={NOTIFICATIONS.length} color="error">
              <FiBell />
            </Badge>
          </IconButton>
          <Menu anchorEl={notifAnchor} open={!!notifAnchor} onClose={() => setNotifAnchor(null)}
            PaperProps={{ sx: { width: 320, borderRadius: 3, mt: 1 } }}>
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>Notifications</Typography>
            <Divider />
            {NOTIFICATIONS.map((n) => (
              <MenuItem key={n.id} onClick={() => setNotifAnchor(null)} sx={{ whiteSpace: 'normal', py: 1.2 }}>
                <Box>
                  <Typography variant="body2">{n.text}</Typography>
                  <Typography variant="caption" color="text.secondary">{n.time}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>

          <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 13, fontWeight: 700 }}>
              {user?.avatarInitial || 'A'}
            </Avatar>
          </IconButton>
          <Menu anchorEl={profileAnchor} open={!!profileAnchor} onClose={() => setProfileAnchor(null)}
            PaperProps={{ sx: { width: 220, borderRadius: 3, mt: 1 } }}>
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.role}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setProfileAnchor(null); navigate('/profile'); }}>
              <ListItemIcon><FiUser /></ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { setProfileAnchor(null); navigate('/settings'); }}>
              <ListItemIcon><FiSettings /></ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { setProfileAnchor(null); logout(); navigate('/login'); }}>
              <ListItemIcon><FiLogOut /></ListItemIcon>
              <ListItemText>Sign out</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
