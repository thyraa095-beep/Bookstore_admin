import React, { useEffect, useState } from 'react';
import api, { Contact } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

export default function Contacts() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<Contact | null>(null);

  const load = () => {
    setLoading(true);
    api
      .listContacts(token)
      .then((data) => setContacts(data.items || []))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.deleteContact(confirmDelete.id, token);
      setSuccess('Message deleted.');
      setConfirmDelete(null);
      load();
    } catch (err) {
      setError((err as Error).message);
      setConfirmDelete(null);
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

      {contacts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 text-slate-500">
          No contact messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900">{c.subject}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    From {c.name} · {c.email} · {new Date(c.created_at).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setConfirmDelete(c)}
                  className="shrink-0 text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap">{c.message}</p>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <Modal title="Delete message" onClose={() => setConfirmDelete(null)}>
          <p className="text-sm text-slate-600">
            Delete the message from <strong>{confirmDelete.name}</strong>?
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
