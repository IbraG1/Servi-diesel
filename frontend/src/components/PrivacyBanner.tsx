'use client';

import { useEffect, useState } from 'react';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { getPrivacyNotice } from '@/lib/api';
import type { PrivacyNotice } from '@/lib/types';

export default function PrivacyBanner() {
  const [notice, setNotice] = useState<PrivacyNotice | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    getPrivacyNotice().then(setNotice).catch(() => {});
  }, []);

  if (!notice) return null;

  return (
    <div className="card-glass p-4 border-diesel-blue/20 mb-6">
      <div className="flex items-start gap-3">
        <Shield className="text-diesel-blue-light shrink-0 mt-0.5" size={20} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-300">
              <span className="text-diesel-blue-light font-medium">Protección de datos — </span>
              El historial técnico es público. Los datos personales están protegidos según{' '}
              <span className="text-white">Ley 19.628</span> y estándares ISO 27001 / NIST.
            </p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-diesel-blue-light hover:text-white shrink-0 p-1"
              aria-label={expanded ? 'Ocultar aviso' : 'Ver aviso completo'}
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {expanded && (
            <div className="mt-4 space-y-3 text-xs text-gray-400 animate-fade-in">
              <p><strong className="text-gray-300">Finalidad:</strong> {notice.finalidad}</p>
              <p><strong className="text-gray-300">Datos públicos:</strong> {notice.datosPublicos}</p>
              <div>
                <strong className="text-gray-300">Sus derechos:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {notice.derechosTitular.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <p className="text-gray-500">
                Contacto: {notice.contacto} · Actualizado: {notice.ultimaActualizacion}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
