'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { formatPatente } from '@/lib/api';

export default function SearchBar() {
  const [patente, setPatente] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = formatPatente(patente);
    if (formatted.length < 4) return;

    setLoading(true);
    router.push(`/historial?patente=${formatted}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={patente}
          onChange={(e) => setPatente(formatPatente(e.target.value))}
          placeholder="Ingresa la patente de tu vehículo"
          className="input-field pl-12 pr-36 py-4 text-lg uppercase tracking-widest"
          maxLength={8}
          required
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          size={20}
        />
        <button
          type="submit"
          disabled={loading || patente.length < 4}
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2.5 px-5 text-sm"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            'Consultar'
          )}
        </button>
      </div>
      <p className="text-center text-xs text-gray-500 mt-3">
        Ejemplo: KJBB12, HYCD45, KJFG78
      </p>
    </form>
  );
}
