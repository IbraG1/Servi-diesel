'use client';

import { useEffect, useState } from 'react';
import { Lock, Loader2, Phone, User } from 'lucide-react';
import { loginClient } from '@/lib/api';
import { setClientToken } from '@/lib/auth-storage';
import { formatPatente } from '@/lib/api';

interface ClientLoginFormProps {
  patente: string;
  onSuccess: () => void;
}

export default function ClientLoginForm({ patente, onSuccess }: ClientLoginFormProps) {
  const [tipo, setTipo] = useState<'telefono' | 'nombre'>('telefono');
  const [identificador, setIdentificador] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginClient({
        patente: formatPatente(patente),
        identificador: identificador.trim(),
        tipo,
      });
      setClientToken(res.accessToken);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-glass p-6 border-diesel-blue/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-diesel-blue/20 flex items-center justify-center">
          <Lock size={20} className="text-diesel-blue-light" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Acceso a datos personales</h3>
          <p className="text-xs text-gray-400">
            Verifique su identidad para ver costos, notas técnicas y fotografías (Ley 19.628)
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(['telefono', 'nombre'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTipo(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tipo === t
                ? 'bg-diesel-blue text-white'
                : 'bg-diesel-navy text-gray-400 hover:text-white'
            }`}
          >
            {t === 'telefono' ? <Phone size={16} /> : <User size={16} />}
            {t === 'telefono' ? 'Teléfono' : 'Nombre'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type={tipo === 'telefono' ? 'tel' : 'text'}
          value={identificador}
          onChange={(e) => setIdentificador(e.target.value)}
          placeholder={
            tipo === 'telefono'
              ? 'Ej: +56912345678 o 912345678'
              : 'Ej: Carlos Mendoza'
          }
          className="input-field"
          required
          minLength={2}
        />

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            'Verificar identidad'
          )}
        </button>
      </form>
    </div>
  );
}
