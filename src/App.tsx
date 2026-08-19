import React, { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Spinner from './components/Spinner';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Services from './pages/Services';
import Users from './pages/Users';
import Contacts from './pages/Contacts';
import Database from './pages/Database';

/** Wraps admin pages: require login + admin role, with the sidebar layout. */
function Protected({ children, title }: { children: ReactNode; title: string }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center max-w-sm">
          <div className="text-4xl mb-3">⛔</div>
          <h1 className="text-xl font-bold text-slate-900">Access denied</h1>
          <p className="text-sm text-slate-500 mt-2">
            This dashboard is only for admin accounts. Your account has the role "{user.role}".
          </p>
        </div>
      </div>
    );
  }
  return <AdminLayout title={title}>{children}</AdminLayout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected title="Dashboard"><Dashboard /></Protected>} />
      <Route path="/products" element={<Protected title="Products"><Products /></Protected>} />
      <Route path="/services" element={<Protected title="Services"><Services /></Protected>} />
      <Route path="/users" element={<Protected title="Users"><Users /></Protected>} />
      <Route path="/contacts" element={<Protected title="Contact messages"><Contacts /></Protected>} />
      <Route path="/database" element={<Protected title="Database backup & import"><Database /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
