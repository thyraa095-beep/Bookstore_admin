import React, { useEffect, useState } from 'react';
import api, { User } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export default function Users() {
  const { token, user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [role, setRole] = useState('user');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .listUsers(token)
      .then((data) => setUsers(data.items || []))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const openEdit = (u: User) => {
    setEditingUser(u);
    setRole(u.role);
    setIsActive(u.is_active);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    setError('');
    setSaving(true);
    try {
      await api.updateUser(editingUser.id, { role, is_active: isActive }, token);
      setSuccess(`User "${editingUser.email}" updated.`);
      setEditingUser(null);
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {success && (
        <div className="mb-4 flex items-center justify-between">
          <Alert type="success">{success}</Alert>
          <button onClick={() => setSuccess('')} className="text-slate-400 hover:text-slate-600 text-sm ml-2">✕</button>
        </div>
      )}
      {error && <Alert>{error}</Alert>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      {u.full_name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <div>
                      <div className="font-medium text-slate-900">
                        {u.full_name}
                        {me && u.id === me.id && <span className="ml-2 text-xs text-indigo-500 font-semibold">(you)</span>}
                      </div>
                      <div className="text-xs text-slate-400">{u.email} · @{u.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {u.is_active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(u)} className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit user modal */}
      {editingUser && (
        <Modal title={`Edit user: ${editingUser.email}`} onClose={() => setEditingUser(null)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              Account active (can log in)
            </label>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

