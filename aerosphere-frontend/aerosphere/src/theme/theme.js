import { createTheme, alpha } from '@mui/material/styles';

// ── Design tokens ────────────────────────────────────────────────
// Void Navy   #0A0E1A  – dark background
// Runway Slate#131B2E  – dark surface
// Signal Cyan #22D3EE  – primary (radar / beacon accent)
// Altitude Violet #7C6CF0 – secondary
// Beacon Amber#F5A524  – warning / in-air status
// Cloud White #F6F8FC  – light background
// Steel Grey  #8A93A6  – muted text

const fontDisplay = '"Space Grotesk", "Inter", sans-serif';
const fontBody = '"Inter", "Segoe UI", sans-serif';
const fontMono = '"JetBrains Mono", monospace';

const baseTypography = {
  fontFamily: fontBody,
  h1: { fontFamily: fontDisplay, fontWeight: 700, letterSpacing: '-0.02em' },
  h2: { fontFamily: fontDisplay, fontWeight: 700, letterSpacing: '-0.02em' },
  h3: { fontFamily: fontDisplay, fontWeight: 600, letterSpacing: '-0.01em' },
  h4: { fontFamily: fontDisplay, fontWeight: 600, letterSpacing: '-0.01em' },
  h5: { fontFamily: fontDisplay, fontWeight: 600 },
  h6: { fontFamily: fontDisplay, fontWeight: 600 },
  button: { fontFamily: fontBody, fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
  overline: { fontFamily: fontMono, letterSpacing: '0.12em', fontWeight: 600 },
  caption: { fontFamily: fontBody },
};

const shape = { borderRadius: 14 };

export const getAeroSphereTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  const palette = isDark
    ? {
        mode: 'dark',
        primary: { main: '#22D3EE', contrastText: '#04141A' },
        secondary: { main: '#7C6CF0', contrastText: '#0A0E1A' },
        warning: { main: '#F5A524' },
        success: { main: '#2ED67A' },
        error: { main: '#F5484C' },
        info: { main: '#4EA1FF' },
        background: { default: '#0A0E1A', paper: '#101728' },
        text: { primary: '#EAF0FB', secondary: '#8A93A6' },
        divider: alpha('#FFFFFF', 0.08),
      }
    : {
        mode: 'light',
        primary: { main: '#0891B2', contrastText: '#FFFFFF' },
        secondary: { main: '#6357D6', contrastText: '#FFFFFF' },
        warning: { main: '#C57A0B' },
        success: { main: '#1E9E5A' },
        error: { main: '#D93B3F' },
        info: { main: '#2A6FD6' },
        background: { default: '#F6F8FC', paper: '#FFFFFF' },
        text: { primary: '#131B2E', secondary: '#5C6579' },
        divider: alpha('#131B2E', 0.08),
      };

  return createTheme({
    palette,
    shape,
    typography: baseTypography,
    custom: {
      fontMono,
      glass: isDark
        ? {
            background: alpha('#141C30', 0.55),
            border: `1px solid ${alpha('#FFFFFF', 0.08)}`,
            backdropFilter: 'blur(18px)',
          }
        : {
            background: alpha('#FFFFFF', 0.72),
            border: `1px solid ${alpha('#131B2E', 0.06)}`,
            backdropFilter: 'blur(18px)',
          },
      gradientRadar: isDark
        ? 'radial-gradient(circle at 20% 20%, rgba(34,211,238,0.16), transparent 45%), radial-gradient(circle at 80% 0%, rgba(124,108,240,0.14), transparent 40%)'
        : 'radial-gradient(circle at 20% 20%, rgba(8,145,178,0.10), transparent 45%), radial-gradient(circle at 80% 0%, rgba(99,87,214,0.08), transparent 40%)',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isDark
              ? 'radial-gradient(circle at 15% 10%, rgba(34,211,238,0.07), transparent 40%), radial-gradient(circle at 85% 0%, rgba(124,108,240,0.08), transparent 35%)'
              : 'radial-gradient(circle at 15% 10%, rgba(8,145,178,0.05), transparent 40%), radial-gradient(circle at 85% 0%, rgba(99,87,214,0.05), transparent 35%)',
            backgroundAttachment: 'fixed',
          },
          '::-webkit-scrollbar': { width: 8, height: 8 },
          '::-webkit-scrollbar-thumb': {
            background: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(19,27,46,0.18)',
            borderRadius: 8,
          },
          '::-webkit-scrollbar-track': { background: 'transparent' },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            border: `1px solid ${palette.divider}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 10, paddingInline: 18 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 600 },
        },
      },
    },
  });
};
