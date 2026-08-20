import React, { ReactNode, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/products', label: 'Products', icon: '📚' },
  { to: '/services', label: 'Services', icon: '🛠️' },
  { to: '/users', label: 'Users', icon: '👥' },
  { to: '/contacts', label: 'Messages', icon: '📩' },
  { to: '/database', label: 'Database', icon: '💾' },
];

const itemClass = ({ isActive }: { isActive: boolean }): string =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-600 text-white'
      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
  }`;

export default function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-slate-900 flex-col">
        <div className="flex items-center gap-2 px-6 h-16 border-b border-slate-800">
          <span className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">B</span>
          <span className="text-white font-bold text-lg">Book<span className="text-indigo-400">Store</span></span>
          <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={itemClass}>
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 pb-6">
          <div className="rounded-xl bg-slate-800 p-4">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.full_name?.charAt(0).toUpperCase() || 'A'}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-white truncate">{user?.full_name}</div>
                <div className="text-xs text-slate-400 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full text-sm bg-slate-700 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden bg-slate-900 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">B</span>
            <span className="text-white font-bold">Book<span className="text-indigo-400">Store</span> Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-200 p-2" aria-label="Menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {sidebarOpen && (
          <nav className="px-4 pb-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={itemClass}
                onClick={() => setSidebarOpen(false)}
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600 hover:text-white transition"
            >
              <span>🚪</span> Logout
            </button>
          </nav>
        )}
      </div>

      {/* Main content */}
      <main className="lg:ml-64">
        <div className="px-4 sm:px-6 lg:px-10 py-8">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <Link
              to="https://thyraa095-beep.github.io/Bookstore_user/"
              target="_blank"
              className="hidden sm:inline-flex text-sm text-slate-600 hover:text-indigo-600 font-medium transition"
            >
              View customer site →
            </Link>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
