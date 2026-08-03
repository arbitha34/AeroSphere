import { Grid, Paper, Typography, Stack, Box, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { FiSend, FiUsers, FiPackage, FiAlertTriangle, FiCloud, FiWind } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import StatusChip from '../components/common/StatusChip';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
// DASHBOARD_SERIES stays local — there's no analytics/reports endpoint on the backend yet
// (see handoff notes: Reports/Analytics module is one of the ones still to be built).
import { DASHBOARD_SERIES } from '../data/generateMockData';
import { getFlights } from '../services/flightService';
import { getPassengers } from '../services/passengerService';
import { getBaggage } from '../services/baggageService';
import { getGates } from '../services/gateService';
import { useAuth } from '../contexts/AuthContext';
import { formatTime } from '../utils/formatters';

const PIE_COLORS = ['#22D3EE', '#7C6CF0', '#F5A524', '#2ED67A', '#4EA1FF'];

export default function Dashboard() {
  const theme = useTheme();
  const { user } = useAuth();

  const { data: flights = [], isLoading: flightsLoading, isError: flightsError, error: flightsErr, refetch: refetchFlights } =
    useQuery({ queryKey: ['flights'], queryFn: getFlights });
  const { data: passengers = [] } = useQuery({ queryKey: ['passengers'], queryFn: getPassengers, enabled: !flightsLoading && !flightsError });
  const { data: baggage = [] } = useQuery({ queryKey: ['baggage'], queryFn: getBaggage, enabled: !flightsLoading && !flightsError });
  const { data: gates = [] } = useQuery({ queryKey: ['gates'], queryFn: getGates, enabled: !flightsLoading && !flightsError });

  if (flightsLoading) return <LoadingState rows={8} />;
  if (flightsError) return <ErrorState message={flightsErr?.message} onRetry={refetchFlights} />;

  const activeFlights = flights.filter((f) => ['Boarding', 'Departed', 'On Time'].includes(f.status)).length;
  const delayed = flights.filter((f) => f.status === 'Delayed').length;
  const gatesOccupied = gates.filter((g) => g.status === 'Occupied').length;
  const upcoming = [...flights].sort((a, b) => new Date(a.scheduledDeparture) - new Date(b.scheduledDeparture)).slice(0, 6);

  return (
    <Box>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Operator'}`}
        subtitle="Live overview of terminal operations across AeroSphere"
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<FiSend />} label="Active flights today" value={activeFlights} accent="primary" trend={4.2} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<FiUsers />} label="Passengers processed" value={passengers.length * 4} accent="secondary" trend={2.1} delay={0.05} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<FiPackage />} label="Baggage in transit" value={baggage.length} accent="success" trend={1.4} delay={0.1} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<FiAlertTriangle />} label="Delayed flights" value={delayed} accent="warning" trend={-3.5} delay={0.15} />
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', ...theme.custom.glass }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Flight performance — this week</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={DASHBOARD_SERIES.flightsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke={theme.palette.text.secondary} />
                <YAxis tick={{ fontSize: 12 }} stroke={theme.palette.text.secondary} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', background: theme.palette.background.paper }} />
                <Legend />
                <Bar dataKey="onTime" name="On time" stackId="a" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} />
                <Bar dataKey="delayed" name="Delayed" stackId="a" fill={theme.palette.warning.main} />
                <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill={theme.palette.error.main} radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', ...theme.custom.glass }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Revenue mix</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={DASHBOARD_SERIES.revenueByCategory} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3}>
                  {DASHBOARD_SERIES.revenueByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, ...theme.custom.glass }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Next departures</Typography>
              <Chip size="small" label={`${gatesOccupied} gates occupied`} variant="outlined" />
            </Stack>
            <Stack spacing={1.5}>
              {upcoming.map((f) => (
                <Stack key={f.id} direction="row" alignItems="center" spacing={2} sx={{
                  p: 1.5, borderRadius: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                }}>
                  <Box sx={{ fontFamily: theme.custom.fontMono, fontWeight: 700, width: 64 }}>{f.flightNumber}</Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{f.originCity} → {f.destinationCity}</Typography>
                    <Typography variant="caption" color="text.secondary">Gate {f.gate} · {formatTime(f.scheduledDeparture)}</Typography>
                  </Box>
                  <StatusChip status={f.status} />
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', ...theme.custom.glass }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Terminal weather</Typography>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <FiCloud size={26} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>24°C</Typography>
                  <Typography variant="caption" color="text.secondary">Partly cloudy</Typography>
                </Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <FiWind size={20} />
                <Typography variant="body2" color="text.secondary">Wind 18 km/h NW · Visibility 10 km</Typography>
              </Stack>
              <Box sx={{ pt: 1 }}>
                <Typography variant="caption" color="text.secondary">Runway conditions</Typography>
                <ResponsiveContainer width="100%" height={90}>
                  <LineChart data={DASHBOARD_SERIES.passengerVolume.slice(0, 6)}>
                    <Line type="monotone" dataKey="passengers" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
