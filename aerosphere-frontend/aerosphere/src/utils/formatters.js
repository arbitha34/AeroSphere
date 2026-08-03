import dayjs from 'dayjs';

export const formatDateTime = (value) => (value ? dayjs(value).format('DD MMM YYYY, HH:mm') : '—');
export const formatDate = (value) => (value ? dayjs(value).format('DD MMM YYYY') : '—');
export const formatTime = (value) => (value ? dayjs(value).format('HH:mm') : '—');
export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
