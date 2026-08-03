import { useEffect, useRef, useState } from 'react';
import { Stack, Typography, Button, TextField, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { verifyOtp, requestOtp } from '../../services/authService';

export default function OtpVerification() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('aerosphere-reset-email') || 'your registered email';
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const refs = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await verifyOtp(digits.join(''), email);
      navigate('/reset-password');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Verify your identity</Typography>
        <Typography variant="body2" color="text.secondary">
          Enter the 6-digit code sent to {email}
        </Typography>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction="row" spacing={1.2} justifyContent="center">
        {digits.map((d, i) => (
          <TextField
            key={i}
            inputRef={(el) => (refs.current[i] = el)}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: 22, width: 24 } }}
          />
        ))}
      </Stack>

      <Button variant="contained" size="large" onClick={onSubmit} disabled={loading || digits.some((d) => !d)}>
        {loading ? <CircularProgress size={22} color="inherit" /> : 'Verify code'}
      </Button>

      <Typography variant="body2" textAlign="center" color="text.secondary">
        {seconds > 0 ? (
          `Resend code in ${seconds}s`
        ) : (
          <Button size="small" onClick={() => { requestOtp(email); setSeconds(60); }}>Resend code</Button>
        )}
      </Typography>
    </Stack>
  );
}
