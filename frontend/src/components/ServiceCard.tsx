import {
  Calendar,
  Gauge,
  User,
  Package,
  DollarSign,
  FileText,
  Lock,
} from 'lucide-react';
import type { ServiceRecord } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/api';
import ServicePhotos from './ServicePhotos';

const statusConfig = {
  completado: {
    label: 'Completado',
    className: 'bg-green-500/10 text-green-400 border-green-500/30',
  },
  en_proceso: {
    label: 'En Proceso',
    className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  },
  pendiente: {
    label: 'Pendiente',
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  },
};

interface ServiceCardProps {
  record: ServiceRecord;
  index: number;
  isPrivate?: boolean;
}

export default function ServiceCard({ record, index, isPrivate = false }: ServiceCardProps) {
  const status = statusConfig[record.estado];
  const isPublic = record.privacyLevel === 'public' || !isPrivate;

  return (
    <article
      className="card-glass p-6 hover:border-diesel-blue/30 transition-all duration-300 hover:shadow-blue-glow animate-slide-up relative overflow-hidden group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-diesel-blue/0 group-hover:bg-diesel-blue-light transition-colors duration-300" />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-diesel-blue/20 text-diesel-blue-light font-display text-lg shrink-0">
            {index + 1}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white uppercase tracking-wide">
              {record.tipoServicio}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
              <Calendar size={14} />
              <span>{formatDate(record.fecha)}</span>
            </div>
          </div>
        </div>
        <span
          className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-medium border ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        {record.descripcion}
      </p>

      {isPrivate && record.notasTecnico && (
        <div className="bg-diesel-navy/60 rounded-lg p-4 mb-4 border border-white/5">
          <div className="flex items-center gap-2 text-diesel-blue-light text-xs uppercase tracking-wide mb-2">
            <FileText size={14} />
            Notas del técnico
          </div>
          <p className="text-sm text-gray-400">{record.notasTecnico}</p>
        </div>
      )}

      {isPublic && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-diesel-navy/40 rounded-lg px-3 py-2">
          <Lock size={12} />
          Notas técnicas, costos y fotografías protegidos — requiere verificación de identidad
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        {record.kilometraje && (
          <span className="flex items-center gap-1.5">
            <Gauge size={14} className="text-diesel-blue-light" />
            {record.kilometraje.toLocaleString('es-CL')} km
          </span>
        )}
        {isPrivate && record.tecnico && (
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-diesel-blue-light" />
            {record.tecnico}
          </span>
        )}
        {isPrivate && record.costo && (
          <span className="flex items-center gap-1.5">
            <DollarSign size={14} className="text-diesel-blue-light" />
            {formatCurrency(record.costo)}
          </span>
        )}
      </div>

      {record.repuestos && record.repuestos.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide mb-2">
            <Package size={14} />
            Repuestos utilizados
          </div>
          <div className="flex flex-wrap gap-2">
            {record.repuestos.map((part) => (
              <span
                key={part}
                className="px-2.5 py-1 bg-diesel-blue/10 text-diesel-blue-light text-xs rounded-md border border-diesel-blue/20"
              >
                {part}
              </span>
            ))}
          </div>
        </div>
      )}

      <ServicePhotos serviceId={record.id} isPrivate={isPrivate} />
    </article>
  );
}
