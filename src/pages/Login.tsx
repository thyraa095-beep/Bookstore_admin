import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update =
    <K extends keyof LoginForm>(key: K, value: LoginForm[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') {
        setError('Access denied: only admin accounts can use this dashboard.');
        return;
      }
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white text-2xl font-bold">
              B
            </span>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Book Store administration panel</p>
          </div>

          {error && <Alert>{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required className={inputClass} placeholder="admin@bookstore.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required className={inputClass} placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition">
              {loading ? 'Logging in...' : 'Login to dashboard'}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-500">
            Default admin: <code className="font-mono">admin@bookstore.com</code> / <code className="font-mono">admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
