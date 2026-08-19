import React from 'react';

export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
    </div>
  );
}
