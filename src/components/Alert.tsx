import React, { ReactNode } from 'react';

interface AlertProps {
  type?: 'error' | 'success';
  children: ReactNode;
}

export default function Alert({ type = 'error', children }: AlertProps) {
  const styles =
    type === 'success'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
      : 'bg-red-50 text-red-800 border-red-300';
  return (
    <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${styles}`} role="alert">
      {children}
    </div>
  );
}
