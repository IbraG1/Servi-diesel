'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, User, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { loginClient } from '@/lib/api';
import { setClientToken } from '@/lib/auth-storage';
import { formatPatente } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [patente, setPatente] = useState('');
  const [tipo, setTipo] = useState<'telefono' | 'nombre'>('telefono');
  const [identificador, setIdentificador] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formatted = formatPatente(patente);
      const res = await loginClient({
        patente: formatted,
        identificador: identificador.trim(),
        tipo,
      });
      setClientToken(res.accessToken);
      router.push(`/historial?patente=${formatted}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm"
      >
        <ArrowLeft size={16} />
        Volver al inicio
      </Link>

      <div className="card-glass p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-diesel-blue/10 border border-diesel-blue/30 mb-4">
            <Lock size={28} className="text-diesel-blue-light" />
          </div>
          <h1 className="font-display text-2xl uppercase tracking-wide text-white">
            Acceso Cliente
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Verifique su identidad para acceder a datos personales protegidos (Ley 19.628)
          </p>
        </div>

        <div className="flex gap-2 mb-6">
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
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
              Patente del vehículo
            </label>
            <input
              type="text"
              value={patente}
              onChange={(e) => setPatente(formatPatente(e.target.value))}
              placeholder="Ej: KJBB12"
              className="input-field uppercase tracking-widest"
              required
              minLength={4}
              maxLength={8}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
              {tipo === 'telefono' ? 'Número de teléfono' : 'Nombre completo'}
            </label>
            <input
              type={tipo === 'telefono' ? 'tel' : 'text'}
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              placeholder={
                tipo === 'telefono' ? '+56912345678' : 'Carlos Mendoza'
              }
              className="input-field"
              required
              minLength={2}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
          Al ingresar, usted accede a datos personales tratados conforme a la Ley N° 19.628
          y estándares ISO/IEC 27001. Consulte el aviso de privacidad en el historial.
        </p>
      </div>
    </div>
  );
}
