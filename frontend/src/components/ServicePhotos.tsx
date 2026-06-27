'use client';

import { useEffect, useState } from 'react';
import {
  Camera,
  Loader2,
  X,
  ImageIcon,
  SplitSquareHorizontal,
  Hash,
} from 'lucide-react';
import type { ServicePhoto } from '@/lib/types';
import {
  fetchPhotoBlob,
  getServicePhotos,
  getPhotoComparison,
} from '@/lib/api';
import { getClientToken } from '@/lib/auth-storage';
import PhotoComparator from './PhotoComparator';

interface ServicePhotosProps {
  serviceId: number;
  isPrivate: boolean;
}

function ProtectedImage({
  photo,
  asClient,
  onClose,
}: {
  photo: ServicePhoto;
  asClient: boolean;
  onClose: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPhotoBlob(photo, asClient)
      .then(setSrc)
      .catch(() => setError(true));
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo.id]);

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
        <div className="text-center text-gray-400">
          <p>No se pudo cargar la imagen</p>
          <button onClick={onClose} className="btn-outline mt-4">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <X size={28} />
      </button>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={photo.originalName}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <Loader2 size={40} className="text-diesel-blue-light animate-spin" />
      )}
    </div>
  );
}

export default function ServicePhotos({
  serviceId,
  isPrivate,
}: ServicePhotosProps) {
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<ServicePhoto | null>(null);
  const [showComparator, setShowComparator] = useState(false);
  const [canCompare, setCanCompare] = useState(false);

  useEffect(() => {
    if (!isPrivate) return;
    setLoading(true);
    const asClient = !!getClientToken();
    getServicePhotos(serviceId, asClient)
      .then(setPhotos)
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  }, [serviceId, isPrivate]);

  // Detectar si hay suficientes fotos para comparar
  useEffect(() => {
    if (!expanded) return;
    const asClient = !!getClientToken();
    getPhotoComparison(serviceId, asClient)
      .then((d) => setCanCompare(d.puedeComparar))
      .catch(() => setCanCompare(false));
  }, [serviceId, expanded]);

  if (!isPrivate) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
        <Loader2 size={14} className="animate-spin" />
        Cargando fotografías...
      </div>
    );
  }

  if (photos.length === 0) return null;

  const antes = photos.filter((p) => p.phase === 'antes');
  const despues = photos.filter((p) => p.phase === 'despues');

  return (
    <>
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-diesel-blue-light hover:text-white transition-colors"
          >
            <Camera size={16} />
            {photos.length} fotografía{photos.length !== 1 ? 's' : ''} del
            servicio
          </button>
          {canCompare && (
            <button
              onClick={() => setShowComparator(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-diesel-blue/20 border border-diesel-blue/40 text-diesel-blue-light hover:bg-diesel-blue/30 transition-colors"
            >
              <SplitSquareHorizontal size={14} />
              Comparar antes / después
            </button>
          )}
        </div>

        {expanded && (
          <div className="mt-3 space-y-4 animate-fade-in">
            {[
              { label: 'Antes del servicio', items: antes },
              { label: 'Después del servicio', items: despues },
            ]
              .filter((g) => g.items.length > 0)
              .map((group) => (
                <div key={group.label}>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {group.items.map((photo) => (
                      <PhotoThumb
                        key={photo.id}
                        photo={photo}
                        onClick={() => setLightbox(photo)}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {lightbox && (
        <ProtectedImage
          photo={lightbox}
          asClient={!!getClientToken()}
          onClose={() => setLightbox(null)}
        />
      )}

      {showComparator && (
        <PhotoComparator
          serviceId={serviceId}
          onClose={() => setShowComparator(false)}
        />
      )}
    </>
  );
}

function PhotoThumb({
  photo,
  onClick,
}: {
  photo: ServicePhoto;
  onClick: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const asClient = !!getClientToken();
    fetchPhotoBlob(photo, asClient)
      .then(setSrc)
      .catch(() => {});
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo.id]);

  return (
    <button
      onClick={onClick}
      className="aspect-square rounded-lg overflow-hidden bg-diesel-navy border border-white/10 hover:border-diesel-blue-light transition-colors relative group"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={photo.originalName} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageIcon size={20} className="text-gray-600" />
        </div>
      )}
      {photo.hashCorto && (
        <div
          className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm flex items-center gap-1"
          title={`Hash SHA-256: ${photo.hashSha256 ?? ''}`}
        >
          <Hash size={8} className="text-diesel-blue-light" />
          <span className="text-[9px] font-mono text-gray-200">
            {photo.hashCorto}
          </span>
        </div>
      )}
    </button>
  );
}