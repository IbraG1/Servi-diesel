import { Car, User, Calendar, Hash, Lock } from 'lucide-react';
import type { Vehicle } from '@/lib/types';

interface VehicleInfoProps {
  vehicle: Vehicle;
  isPrivate?: boolean;
}

export default function VehicleInfo({ vehicle, isPrivate = false }: VehicleInfoProps) {
  const totalServicios = vehicle.servicios.length;
  const ultimoServicio = vehicle.servicios[0];
  const isPublic = vehicle.privacyLevel === 'public' || !isPrivate;

  return (
    <div className="card-glass p-6 md:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-diesel-blue/20 border border-diesel-blue/30 shrink-0">
          <Car size={36} className="text-diesel-blue-light" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="font-display text-3xl md:text-4xl tracking-wider text-white uppercase">
              {vehicle.patente}
            </h2>
            <span className="px-3 py-1 bg-diesel-blue/10 text-diesel-blue-light text-sm rounded-full border border-diesel-blue/20">
              {vehicle.marca} {vehicle.modelo} {vehicle.anio}
            </span>
            {isPublic && (
              <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs rounded-full border border-yellow-500/20 flex items-center gap-1">
                <Lock size={10} />
                Vista pública
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
            {isPrivate && vehicle.clienteNombre && (
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-diesel-blue-light" />
                {vehicle.clienteNombre}
              </span>
            )}
            {vehicle.color && (
              <span className="flex items-center gap-1.5">
                <Hash size={14} className="text-diesel-blue-light" />
                Color: {vehicle.color}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-diesel-blue-light" />
              {totalServicios} servicio{totalServicios !== 1 ? 's' : ''} registrado{totalServicios !== 1 ? 's' : ''}
            </span>
          </div>

          {isPublic && (
            <p className="text-xs text-gray-500 mt-3">
              Los datos personales del titular están ocultos. Inicie sesión para ver información completa.
            </p>
          )}
        </div>

        {ultimoServicio && (
          <div className="md:text-right shrink-0">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Último servicio
            </p>
            <p className="text-white font-semibold">{ultimoServicio.tipoServicio}</p>
            <p className="text-sm text-diesel-blue-light">
              {new Date(ultimoServicio.fecha).toLocaleDateString('es-CL')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
