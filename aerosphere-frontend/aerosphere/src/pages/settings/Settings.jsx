import { Box, Grid, Paper, Typography, Stack, Switch, FormControlLabel, Divider, Button, MenuItem, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import { useThemeMode } from '../../contexts/ThemeContext';

export default function Settings() {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const [prefs, setPrefs] = useState({ email: true, sms: false, push: true, language: 'English', twoFactor: false });

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <Box>
      <PageHeader title="Settings" subtitle="Theme, notifications, language, and security preferences" breadcrumbs={[{ label: 'Dashboard' }, { label: 'Settings' }]} />
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, ...theme.custom.glass }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Appearance</Typography>
            <FormControlLabel control={<Switch checked={mode === 'dark'} onChange={toggleMode} />} label="Dark mode" />
            <Divider sx={{ my: 2 }} />
            <TextField select fullWidth label="Language" value={prefs.language} onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}>
              {['English', 'Arabic', 'Mandarin', 'Spanish', 'French', 'Japanese'].map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, ...theme.custom.glass }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Notifications</Typography>
            <Stack>
              <FormControlLabel control={<Switch checked={prefs.email} onChange={() => toggle('email')} />} label="Email notifications" />
              <FormControlLabel control={<Switch checked={prefs.sms} onChange={() => toggle('sms')} />} label="SMS alerts" />
              <FormControlLabel control={<Switch checked={prefs.push} onChange={() => toggle('push')} />} label="Push notifications" />
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, ...theme.custom.glass }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Security</Typography>
            <FormControlLabel control={<Switch checked={prefs.twoFactor} onChange={() => toggle('twoFactor')} />} label="Two-factor authentication" />
            <Button sx={{ mt: 2 }} variant="outlined">Change password</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, ...theme.custom.glass }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Preferences</Typography>
            <Button variant="contained" onClick={() => toast.success('Preferences saved')}>Save all preferences</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
