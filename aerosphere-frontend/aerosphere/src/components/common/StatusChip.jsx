import { Chip } from '@mui/material';
import { statusColor } from '../../data/generateMockData';

const FALLBACK = {
  success: 'success', warning: 'warning', error: 'error', info: 'info',
  primary: 'primary', default: 'default',
};

export default function StatusChip({ status, size = 'small' }) {
  const color = FALLBACK[statusColor[status]] || 'default';
  return <Chip label={status} color={color} size={size} variant={color === 'default' ? 'outlined' : 'filled'} />;
}
