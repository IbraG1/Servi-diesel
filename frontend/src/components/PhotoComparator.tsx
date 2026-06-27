'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  X,
} from 'lucide-react';
import type { ServicePhoto, PhotoComparison } from '@/lib/types';
import {
  fetchPhotoBlob,
  getPhotoComparison,
  verifyPhotoIntegrity,
} from '@/lib/api';
import { getClientToken } from '@/lib/auth-storage';

interface PhotoComparatorProps {
  serviceId: number;
  onClose: () => void;
}

/**
 * Vista comparativa lado a lado con slider draggable.
 * Muestra las fotos de "antes" y "después" del servicio para que
 * el cliente y el mecánico puedan verificar visualmente el trabajo.
 */
export default function PhotoComparator({
  serviceId,
  onClose,
}: PhotoComparatorProps) {
  const [data, setData] = useState<PhotoComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indexAntes, setIndexAntes] = useState(0);
  const [indexDespues, setIndexDespues] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [verifyResult, setVerifyResult] = useState<{
    id: number;
    integra: boolean;
  } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const asClient = !!getClientToken();

  useEffect(() => {
    setLoading(true);
    getPhotoComparison(serviceId, asClient)
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : 'Error al cargar comparación'),
      )
      .finally(() => setLoading(false));
  }, [serviceId, asClient]);

  // Slider draggable — soporta mouse y touch
  useEffect(() => {
    const move = (clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(pct);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (dragging.current) move(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (dragging.current && e.touches[0]) move(e.touches[0].clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const handleVerify = async (photoId: number) => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const result = await verifyPhotoIntegrity(photoId, asClient);
      setVerifyResult({ id: photoId, integra: result.integra });
    } catch {
      setVerifyResult({ id: photoId, integra: false });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="card-glass w-full max-w-5xl max-h-[95vh] overflow-y-auto p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg uppercase text-white flex items-center gap-2">
            Comparativa visual del servicio #{serviceId}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={22} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-diesel-blue-light" />
          </div>
        ) : error ? (
          <p className="text-red-400 text-center py-8">{error}</p>
        ) : !data || !data.puedeComparar ? (
          <div className="text-center py-10">
            <ImageIcon size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">
              Para usar el comparador se necesitan fotos tanto del{' '}
              <span className="text-diesel-blue-light font-medium">antes</span>{' '}
              como del{' '}
              <span className="text-diesel-blue-light font-medium">después</span>{' '}
              del servicio.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Actual: {data?.totalAntes ?? 0} antes · {data?.totalDespues ?? 0}{' '}
              después
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-gray-400 text-center">
              Arrastra la barra central para comparar el estado del vehículo
              antes y después del servicio.
            </p>

            <div
              ref={containerRef}
              className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-diesel-navy border border-white/10 select-none"
              onMouseDown={(e) => {
                dragging.current = true;
                const rect = e.currentTarget.getBoundingClientRect();
                setSliderPos(
                  Math.max(
                    0,
                    Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
                  ),
                );
              }}
              onTouchStart={(e) => {
                dragging.current = true;
                if (!e.touches[0]) return;
                const rect = e.currentTarget.getBoundingClientRect();
                setSliderPos(
                  Math.max(
                    0,
                    Math.min(
                      100,
                      ((e.touches[0].clientX - rect.left) / rect.width) * 100,
                    ),
                  ),
                );
              }}
            >
              {/* Imagen "después" (capa inferior completa) */}
              <ComparatorImage
                photo={data.despues[indexDespues]}
                label="Después"
                position="bottom-right"
                asClient={asClient}
              />

              {/* Imagen "antes" recortada con clip-path */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <ComparatorImage
                  photo={data.antes[indexAntes]}
                  label="Antes"
                  position="top-left"
                  asClient={asClient}
                />
              </div>

              {/* Línea y mango del slider */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.5)] cursor-ew-resize"
                style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <ChevronLeft
                    size={14}
                    className="text-diesel-navy absolute left-1"
                  />
                  <ChevronRight
                    size={14}
                    className="text-diesel-navy absolute right-1"
                  />
                </div>
              </div>
            </div>

            {/* Selectores de foto */}
            <div className="grid grid-cols-2 gap-4">
              <PhotoPicker
                label="Antes"
                photos={data.antes}
                index={indexAntes}
                onSelect={setIndexAntes}
                asClient={asClient}
              />
              <PhotoPicker
                label="Después"
                photos={data.despues}
                index={indexDespues}
                onSelect={setIndexDespues}
                asClient={asClient}
              />
            </div>

            {/* Verificador de integridad */}
            <div className="border-t border-white/5 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-gray-400">
                  Verificar integridad de la foto (hash SHA-256)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerify(data.antes[indexAntes].id)}
                    disabled={verifying}
                    className="btn-outline text-xs px-3 py-2"
                  >
                    Verificar ANTES
                  </button>
                  <button
                    onClick={() => handleVerify(data.despues[indexDespues].id)}
                    disabled={verifying}
                    className="btn-outline text-xs px-3 py-2"
                  >
                    Verificar DESPUÉS
                  </button>
                </div>
              </div>
              {verifying && (
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                  <Loader2 size={12} className="animate-spin" />
                  Calculando hash…
                </div>
              )}
              {verifyResult && (
                <div
                  className={`mt-3 flex items-center gap-2 text-sm p-3 rounded-lg ${
                    verifyResult.integra
                      ? 'bg-green-500/10 text-green-300 border border-green-500/30'
                      : 'bg-red-500/10 text-red-300 border border-red-500/30'
                  }`}
                >
                  {verifyResult.integra ? (
                    <ShieldCheck size={18} />
                  ) : (
                    <ShieldAlert size={18} />
                  )}
                  {verifyResult.integra
                    ? 'Integridad verificada. La foto no fue modificada desde que se subió.'
                    : '¡Atención! El hash no coincide. La foto pudo haber sido alterada.'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ComparatorImage({
  photo,
  label,
  position,
  asClient,
}: {
  photo: ServicePhoto;
  label: string;
  position: 'top-left' | 'bottom-right';
  asClient: boolean;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const labelClass =
    position === 'top-left' ? 'top-3 left-3' : 'bottom-3 right-3';

  useEffect(() => {
    fetchPhotoBlob(photo, asClient)
      .then(setSrc)
      .catch(() => setSrc(null));
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo.id]);

  return (
    <>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${label} - ${photo.originalName}`}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-gray-500" />
        </div>
      )}
      <div
        className={`absolute ${labelClass} px-3 py-1 rounded-full bg-black/70 text-white text-xs font-semibold uppercase tracking-wide backdrop-blur-sm`}
      >
        {label}
      </div>
      {photo.hashCorto && (
        <div
          className={`absolute ${
            position === 'top-left' ? 'bottom-3 left-3' : 'top-3 right-3'
          } px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-gray-300`}
          title={`Hash SHA-256: ${photo.hashSha256 ?? ''}`}
        >
          #{photo.hashCorto}
        </div>
      )}
    </>
  );
}

function PhotoPicker({
  label,
  photos,
  index,
  onSelect,
  asClient,
}: {
  label: string;
  photos: ServicePhoto[];
  index: number;
  onSelect: (i: number) => void;
  asClient: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
        {label} ({photos.length})
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {photos.map((p, i) => (
          <PickerThumb
            key={p.id}
            photo={p}
            active={i === index}
            onClick={() => onSelect(i)}
            asClient={asClient}
          />
        ))}
      </div>
    </div>
  );
}

function PickerThumb({
  photo,
  active,
  onClick,
  asClient,
}: {
  photo: ServicePhoto;
  active: boolean;
  onClick: () => void;
  asClient: boolean;
}) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    fetchPhotoBlob(photo, asClient)
      .then(setSrc)
      .catch(() => setSrc(null));
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo.id]);

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
        active
          ? 'border-diesel-blue-light scale-105'
          : 'border-white/10 hover:border-white/30'
      }`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-diesel-navy flex items-center justify-center">
          <ImageIcon size={16} className="text-gray-600" />
        </div>
      )}
    </button>
  );
}