import { Vehicle } from '../entities/vehicle.entity';
import { ServiceRecord } from '../entities/service-record.entity';
import { ServicePhoto } from '../entities/service-photo.entity';

/** Vista pública — sin datos personales del cliente (Ley 19.628) */
export function toPublicVehicle(vehicle: Vehicle) {
  return {
    id: vehicle.id,
    patente: vehicle.patente,
    marca: vehicle.marca,
    modelo: vehicle.modelo,
    anio: vehicle.anio,
    color: vehicle.color,
    servicios: (vehicle.servicios || []).map(toPublicService),
    privacyLevel: 'public' as const,
  };
}

/** Vista pública de servicio — sin notas internas, costos ni fotos */
export function toPublicService(record: ServiceRecord) {
  return {
    id: record.id,
    vehicleId: record.vehicleId,
    fecha: record.fecha,
    tipoServicio: record.tipoServicio,
    descripcion: record.descripcion,
    kilometraje: record.kilometraje,
    estado: record.estado,
    repuestos: record.repuestos,
    createdAt: record.createdAt,
    privacyLevel: 'public' as const,
  };
}

/** Vista cliente autenticado — datos completos excepto fotos (requieren endpoint aparte) */
export function toClientVehicle(vehicle: Vehicle) {
  return {
    id: vehicle.id,
    patente: vehicle.patente,
    marca: vehicle.marca,
    modelo: vehicle.modelo,
    anio: vehicle.anio,
    color: vehicle.color,
    clienteNombre: vehicle.clienteNombre,
    clienteTelefono: vehicle.clienteTelefono,
    servicios: (vehicle.servicios || []).map(toClientService),
    privacyLevel: 'client' as const,
  };
}

export function toClientService(record: ServiceRecord) {
  return {
    id: record.id,
    vehicleId: record.vehicleId,
    fecha: record.fecha,
    tipoServicio: record.tipoServicio,
    descripcion: record.descripcion,
    notasTecnico: record.notasTecnico,
    kilometraje: record.kilometraje,
    estado: record.estado,
    repuestos: record.repuestos,
    tecnico: record.tecnico,
    costo: record.costo,
    fotoCount: record.fotos?.length ?? 0,
    createdAt: record.createdAt,
    privacyLevel: 'client' as const,
  };
}

export function toStaffVehicle(vehicle: Vehicle) {
  return {
    ...vehicle,
    servicios: vehicle.servicios,
    privacyLevel: 'staff' as const,
  };
}

export function toPhotoMeta(photo: ServicePhoto) {
  return {
    id: photo.id,
    serviceRecordId: photo.serviceRecordId,
    phase: photo.phase,
    originalName: photo.originalName,
    mimeType: photo.mimeType,
    fileSize: photo.fileSize,
    descripcion: photo.descripcion,
    uploadedBy: photo.uploadedBy?.nombre,
    createdAt: photo.createdAt,
    url: `/api/photos/${photo.id}/file`,
  };
}
