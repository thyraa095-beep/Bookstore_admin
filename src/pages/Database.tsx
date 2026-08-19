import React, { useRef, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function Database() {
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ---- Backup: download the whole database as a JSON file ----
  const handleBackup = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await api.backupDatabase(token);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `bookstore-backup-${date}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      const counts = Object.entries(data.tables || {}).map(
        ([t, rows]) => `${t}: ${Array.isArray(rows) ? rows.length : 0}`
      );
      setSuccess(`Backup downloaded (${counts.join(', ')}).`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ---- Import: restore from an uploaded backup file ----
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      await api.importDatabase(payload, token);
      setSuccess(`Database imported from "${file.name}". All tables were restored.`);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON file. Please choose a Book Store backup file.');
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const cardClass =
    'bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center';

  return (
    <div>
      {error && <Alert>{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Backup */}
        <div className={cardClass}>
          <div className="text-5xl mb-4">💾</div>
          <h2 className="text-xl font-bold text-slate-900">Backup database</h2>
          <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
            Download all data (users, products, services and contact messages)
            as a JSON file you can keep safe or restore later.
          </p>
          <button
            onClick={handleBackup}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            {loading ? 'Working...' : '⬇ Download backup (.json)'}
          </button>
        </div>

        {/* Import */}
        <div className={cardClass}>
          <div className="text-5xl mb-4">📥</div>
          <h2 className="text-xl font-bold text-slate-900">Import database</h2>
          <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
            Restore a previous backup file. This <strong>replaces all current
            data</strong> in users, products, services and contacts.
          </p>
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            {loading ? 'Working...' : '⬆ Choose backup file'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
        <strong>⚠️ Caution:</strong> importing a backup deletes everything currently
        in the database and replaces it with the file contents. Make sure you have
        downloaded a backup before importing.
      </div>
    </div>
  );
}
