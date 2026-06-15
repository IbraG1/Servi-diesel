'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Loader2, LogOut, ShieldCheck } from 'lucide-react';
import { searchByPatentePublic, getMyHistory } from '@/lib/api';
import { getClientToken, clearClientToken } from '@/lib/auth-storage';
import type { Vehicle } from '@/lib/types';
import VehicleInfo from '@/components/VehicleInfo';
import ServiceCard from '@/components/ServiceCard';
import PrivacyBanner from '@/components/PrivacyBanner';
import ClientLoginForm from '@/components/ClientLoginForm';

function HistorialContent() {
  const searchParams = useSearchParams();
  const patente = searchParams.get('patente') || '';
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async (privateView: boolean) => {
    if (!patente) return;

    setLoading(true);
    setError('');

    try {
      if (privateView && getClientToken()) {
        const data = await getMyHistory(patente);
        setVehicle(data);
        setIsPrivate(true);
      } else {
        const data = await searchByPatentePublic(patente);
        setVehicle(data);
        setIsPrivate(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al consultar');
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  }, [patente]);

  useEffect(() => {
    if (!patente) {
      setLoading(false);
      setError('Ingresa una patente para consultar el historial.');
      return;
    }
    loadHistory(!!getClientToken());
  }, [patente, loadHistory]);

  const handleLoginSuccess = () => loadHistory(true);

  const handleLogout = () => {
    clearClientToken();
    loadHistory(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 size={40} className="text-diesel-blue-light animate-spin mb-4" />
        <p className="text-gray-400">Consultando historial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center animate-fade-in">
        <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          No se encontró historial
        </h2>
        <p className="text-gray-400 mb-8">{error}</p>
        <Link href="/" className="btn-primary">
          <ArrowLeft size={18} />
          Volver a buscar
        </Link>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm"
      >
        <ArrowLeft size={16} />
        Nueva búsqueda
      </Link>

      <PrivacyBanner />

      {isPrivate ? (
        <div className="flex items-center justify-between mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <ShieldCheck size={16} />
            Sesión verificada — vista completa con datos personales
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="mb-8">
          <ClientLoginForm patente={patente} onSuccess={handleLoginSuccess} />
        </div>
      )}

      <VehicleInfo vehicle={vehicle} isPrivate={isPrivate} />

      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl uppercase tracking-wide text-white">
            Servicios Realizados
          </h3>
          <span className="text-sm text-gray-500">
            {vehicle.servicios.length} registro
            {vehicle.servicios.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          {vehicle.servicios.map((record, i) => (
            <ServiceCard
              key={record.id}
              record={record}
              index={i}
              isPrivate={isPrivate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HistorialPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 size={40} className="text-diesel-blue-light animate-spin" />
        </div>
      }
    >
      <HistorialContent />
    </Suspense>
  );
}
