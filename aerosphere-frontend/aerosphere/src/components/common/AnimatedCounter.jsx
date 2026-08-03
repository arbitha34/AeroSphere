import { useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';

export default function AnimatedCounter({ value, duration = 1200, prefix = '', suffix = '', variant = 'h3', sx }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef();

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = Number(value) || 0;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3; // ease-out cubic
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return (
    <Typography variant={variant} sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, ...sx }}>
      {prefix}{display.toLocaleString()}{suffix}
    </Typography>
  );
}
