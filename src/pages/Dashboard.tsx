import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { DashboardStats } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getStats(token)
      .then(setStats)
      .catch((err) => setError((err as Error).message));
  }, [token]);

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  if (!stats) return <Spinner />;

  const cards = [
    { title: 'Total users', value: stats.total_users, icon: '👥', color: 'indigo' as const },
    { title: 'Total products', value: stats.total_products, icon: '📚', color: 'emerald' as const },
    { title: 'Total services', value: stats.total_services, icon: '🛠️', color: 'amber' as const },
    { title: 'Contact messages', value: stats.total_contacts, icon: '📩', color: 'rose' as const },
  ];

  const quickLinks = [
    { to: '/products', label: 'Manage products', desc: 'Add, edit or remove books', icon: '📚' },
    { to: '/services', label: 'Manage services', desc: 'Add, edit or remove services', icon: '🛠️' },
    { to: '/users', label: 'Manage users', desc: 'Change roles or disable accounts', icon: '👥' },
    { to: '/contacts', label: 'View messages', desc: 'Read customer inquiries', icon: '📩' },
    { to: '/database', label: 'Backup / Import', desc: 'Download or restore the database', icon: '💾' },
  ];

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <StatCard key={c.title} {...c} />
        ))}
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Inventory summary</h2>
        <p className="text-sm text-slate-500 mb-6">
          Only active items are visible on the public customer site.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
            <div className="text-3xl font-extrabold text-indigo-600">{stats.active_products}</div>
            <div className="text-sm text-slate-500 mt-1">Active products</div>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
            <div className="text-3xl font-extrabold text-emerald-600">{stats.active_services}</div>
            <div className="text-sm text-slate-500 mt-1">Active services</div>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
            <div className="text-3xl font-extrabold text-slate-700">{stats.total_users}</div>
            <div className="text-sm text-slate-500 mt-1">Registered users</div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 gap-6">
        {quickLinks.map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-indigo-300 transition"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{q.icon}</span>
              <div>
                <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                  {q.label} →
                </div>
                <div className="text-sm text-slate-500 mt-1">{q.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
