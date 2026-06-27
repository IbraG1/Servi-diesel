'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Loader2,
  Trash2,
  X,
  ShieldCheck,
  ShieldAlert,
  Hash,
} from 'lucide-react';
import type { ServicePhoto } from '@/lib/types';
import {
  uploadServicePhoto,
  deletePhoto,
  getServicePhotos,
  fetchPhotoBlob,
  verifyPhotoIntegrity,
} from '@/lib/api';

interface PhotoManagerProps {
  serviceId: number;
  onClose: () => void;
}

export default function PhotoManager({ serviceId, onClose }: PhotoManagerProps) {
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [phase, setPhase] = useState<'antes' | 'despues'>('antes');
  const [descripcion, setDescripcion] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const loadPhotos = () => {
    setLoading(true);
    getServicePhotos(serviceId)
      .then(setPhotos)
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadServicePhoto(serviceId, file, phase, descripcion || undefined);
      setDescripcion('');
      if (fileRef.current) fileRef.current.value = '';
      loadPhotos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al subir foto');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta fotografía?')) return;
    try {
      await deletePhoto(id);
      loadPhotos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="card-glass w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg uppercase text-white flex items-center gap-2">
            <Camera size={20} className="text-diesel-blue-light" />
            Fotografías — Servicio #{serviceId}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4 mb-6 p-4 bg-diesel-navy/60 rounded-lg border border-white/5">
          <p className="text-xs text-gray-400">
            Solo personal autorizado puede subir fotos (antes/después del servicio).
            Acceso auditado según Ley 19.628 e ISO 27001.
          </p>

          <div className="flex gap-2">
            {(['antes', 'despues'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPhase(p)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize ${
                  phase === p
                    ? 'bg-diesel-blue text-white'
                    : 'bg-diesel-dark text-gray-400'
                }`}
              >
                {p === 'antes' ? 'Antes' : 'Después'}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción opcional"
            className="input-field text-sm"
          />

          <label className="btn-primary w-full cursor-pointer">
            {uploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Upload size={18} />
                Subir fotografía ({phase})
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={28} className="animate-spin text-diesel-blue-light" />
          </div>
        ) : photos.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">
            No hay fotografías para este servicio
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <StaffPhotoThumb
                key={photo.id}
                photo={photo}
                onDelete={() => handleDelete(photo.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StaffPhotoThumb({
  photo,
  onDelete,
}: {
  photo: ServicePhoto;
  onDelete: () => void;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [integra, setIntegra] = useState<boolean | null>(null);

  useEffect(() => {
    fetchPhotoBlob(photo, false)
      .then(setSrc)
      .catch(() => {});
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo.id]);

  const handleVerify = async () => {
    setVerifying(true);
    setIntegra(null);
    try {
      const r = await verifyPhotoIntegrity(photo.id, false);
      setIntegra(r.integra);
    } catch {
      setIntegra(false);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-white/10 aspect-square bg-diesel-navy">
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={photo.originalName} className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-black/80 p-1.5 space-y-1">
        <div className="flex items-center justify-between gap-1">
          <p className="text-[10px] text-gray-300 capitalize">{photo.phase}</p>
          {photo.hashCorto && (
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60"
              title={`Hash SHA-256: ${photo.hashSha256 ?? ''}`}
            >
              <Hash size={8} className="text-diesel-blue-light" />
              <span className="text-[9px] font-mono text-gray-200">
                {photo.hashCorto}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleVerify}
          disabled={verifying}
          className="w-full text-[9px] py-1 rounded bg-diesel-blue/30 hover:bg-diesel-blue/50 text-white flex items-center justify-center gap-1"
        >
          {verifying ? (
            <Loader2 size={9} className="animate-spin" />
          ) : integra === true ? (
            <ShieldCheck size={9} className="text-green-400" />
          ) : integra === false ? (
            <ShieldAlert size={9} className="text-red-400" />
          ) : (
            <ShieldCheck size={9} />
          )}
          {verifying
            ? 'Verificando…'
            : integra === true
              ? 'Íntegra'
              : integra === false
                ? 'Alterada'
                : 'Verificar hash'}
        </button>
      </div>
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Eliminar foto"
      >
        <Trash2 size={14} className="text-white" />
      </button>
    </div>
  );
}
