import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import OtpVerification from '../pages/auth/OtpVerification';
import ResetPassword from '../pages/auth/ResetPassword';
import Unauthorized from '../pages/auth/Unauthorized';
import NotFound from '../pages/NotFound';

import Dashboard from '../pages/Dashboard';
import FlightList from '../pages/flights/FlightList';
import AircraftList from '../pages/aircraft/AircraftList';
import PassengerList from '../pages/passengers/PassengerList';
import BaggageTracking from '../pages/baggage/BaggageTracking';
import GateManagement from '../pages/gates/GateManagement';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flights" element={<FlightList />} />
          <Route path="/aircraft" element={<AircraftList />} />
          <Route path="/passengers" element={<PassengerList />} />
          <Route path="/baggage" element={<BaggageTracking />} />
          <Route path="/gates" element={<GateManagement />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
