import React, { useEffect, useState } from 'react';
import api, { Service } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

interface ServiceForm {
  title: string;
  description: string;
  price: string;
  duration: string;
  image_url: string;
  is_active: boolean;
}

const emptyForm: ServiceForm = {
  title: '',
  description: '',
  price: '',
  duration: '',
  image_url: '',
  is_active: true,
};

export default function Services() {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);

  const load = () => {
    setLoading(true);
    api
      .listServices(token)
      .then((data) => setServices(data.items || []))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const set =
    <K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      title: s.title,
      description: s.description || '',
      price: String(s.price),
      duration: s.duration || '',
      image_url: s.image_url || '',
      is_active: s.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description || null,
      price: Number(form.price),
      duration: form.duration || null,
      image_url: form.image_url || null,
    };
    try {
      if (editing) {
        await api.updateService(editing.id, { ...payload, is_active: form.is_active }, token);
        setSuccess('Service updated successfully.');
      } else {
        await api.createService(payload, token);
        setSuccess('Service created successfully.');
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.deleteService(confirmDelete.id, token);
      setSuccess(`"${confirmDelete.title}" deleted.`);
      setConfirmDelete(null);
      load();
    } catch (err) {
      setError((err as Error).message);
      setConfirmDelete(null);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

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

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{services.length} service(s) — admins see inactive items too.</p>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg transition"
        >
          + Add service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 text-slate-500">
          No services yet. Click "Add service" to create one.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-900">{s.title}</div>
                    <div className="text-xs text-slate-400">ID #{s.id}</div>
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-900">${Number(s.price).toFixed(2)}</td>
                  <td className="px-5 py-3 text-slate-600">{s.duration || '—'}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        s.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(s)} className="text-indigo-600 hover:text-indigo-500 font-medium mr-4">
                      Edit
                    </button>
                    <button onClick={() => setConfirmDelete(s)} className="text-red-600 hover:text-red-500 font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit modal */}
      {showForm && (
        <Modal title={editing ? `Edit service #${editing.id}` : 'Add service'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (USD) *</label>
                <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} required min="0.01" step="0.01" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                <input type="text" value={form.duration} onChange={(e) => set('duration', e.target.value)} className={inputClass} placeholder="e.g. 7 days" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
              <input type="url" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} className={inputClass} placeholder="https://..." />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set('is_active', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              Active (visible on customer site)
            </label>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition"
              >
                {saving ? 'Saving...' : editing ? 'Save changes' : 'Create service'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <Modal title="Delete service" onClose={() => setConfirmDelete(null)}>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <strong>"{confirmDelete.title}"</strong>? This cannot be undone.
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-lg transition">
              Yes, delete
            </button>
            <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg transition">
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

