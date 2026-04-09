import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import OtpVerify from './pages/OtpVerify';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SearchProfessionals from './pages/SearchProfessionals';
import ProfessionalProfile from './pages/ProfessionalProfile';

import ClientDashboard from './pages/ClientDashboard';
import RequestStatus from './pages/RequestStatus';

import ProfessionalDashboard from './pages/ProfessionalDashboard';
import ManageProfile from './pages/ManageProfile';
import ManageRequests from './pages/ManageRequests';

import AdminDashboard from './pages/AdminDashboard';
import SupportPanel from './pages/SupportPanel';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<OtpVerify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/professionals" element={<SearchProfessionals />} />
          <Route path="/professionals/:id" element={<ProfessionalProfile />} />

          {/* Client */}
          <Route path="/client/dashboard" element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/client/requests" element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <RequestStatus />
            </ProtectedRoute>
          } />

          {/* Professional */}
          <Route path="/professional/dashboard" element={
            <ProtectedRoute allowedRoles={['PROFESSIONAL']}>
              <ProfessionalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/professional/profile" element={
            <ProtectedRoute allowedRoles={['PROFESSIONAL']}>
              <ManageProfile />
            </ProtectedRoute>
          } />
          <Route path="/professional/requests" element={
            <ProtectedRoute allowedRoles={['PROFESSIONAL']}>
              <ManageRequests />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Support */}
          <Route path="/support" element={
            <ProtectedRoute allowedRoles={['SUPPORT', 'ADMIN']}>
              <SupportPanel />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
