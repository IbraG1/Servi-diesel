import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Vehicle } from '../entities/vehicle.entity';
import { ServiceRecord } from '../entities/service-record.entity';
import { StaffUser } from '../entities/staff-user.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { ServicePhoto } from '../entities/service-photo.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'sqlite'as const,
    database: process.env.DATABASE_PATH || './servidiesel.db',
    entities: [Vehicle, ServiceRecord, StaffUser, AuditLog, ServicePhoto],
    synchronize: true,
  });

  await dataSource.initialize();
  const vehicleRepo = dataSource.getRepository(Vehicle);
  const serviceRepo = dataSource.getRepository(ServiceRecord);
  const staffRepo = dataSource.getRepository(StaffUser);

  await serviceRepo.clear();
  await vehicleRepo.clear();
  await staffRepo.clear();

  const adminHash = await bcrypt.hash('Admin2024!', 12);
  const mechHash = await bcrypt.hash('Mecanico2024!', 12);

  await staffRepo.save([
    staffRepo.create({
      username: 'admin',
      passwordHash: adminHash,
      nombre: 'Administrador ServiDiesel',
      role: 'admin',
    }),
    staffRepo.create({
      username: 'mecanico1',
      passwordHash: mechHash,
      nombre: 'Juan Pérez',
      role: 'mechanic',
    }),
  ]);

  const vehicles = [
    {
      patente: 'KJBB12',
      marca: 'Kia',
      modelo: 'Sportage',
      anio: 2021,
      clienteNombre: 'Carlos Mendoza',
      clienteTelefono: '+56912345678',
      color: 'Gris',
      consentimientoDatos: true,
      consentimientoFecha: new Date(),
    },
    {
      patente: 'HYCD45',
      marca: 'Hyundai',
      modelo: 'Tucson',
      anio: 2020,
      clienteNombre: 'María González',
      clienteTelefono: '+56987654321',
      color: 'Blanco',
      consentimientoDatos: true,
      consentimientoFecha: new Date(),
    },
    {
      patente: 'KJFG78',
      marca: 'Kia',
      modelo: 'Sorento',
      anio: 2019,
      clienteNombre: 'Roberto Silva',
      clienteTelefono: '+56911223344',
      color: 'Negro',
      consentimientoDatos: true,
      consentimientoFecha: new Date(),
    },
  ];

  for (const v of vehicles) {
    const vehicle = await vehicleRepo.save(vehicleRepo.create(v));

    const services: Partial<ServiceRecord>[] =
      vehicle.patente === 'KJBB12'
        ? [
            {
              vehicleId: vehicle.id,
              fecha: '2024-03-15',
              tipoServicio: 'Diagnóstico Electrónico',
              descripcion:
                'Escaneo completo de sistemas electrónicos. Detección de código P0299 (presión turbo baja).',
              notasTecnico:
                'Turbo con desgaste en paletas. Se recomienda limpieza y revisión de intercooler.',
              kilometraje: 85400,
              estado: 'completado' as const,
              repuestos: ['Sensor MAP', 'Filtro de aire'],
              tecnico: 'Juan Pérez',
              costo: 85000,
            },
            {
              vehicleId: vehicle.id,
              fecha: '2024-06-22',
              tipoServicio: 'Reparación Turbo',
              descripcion:
                'Reparación completa de turbocompresor. Cambio de kit de reparación y balanceo.',
              notasTecnico:
                'Turbo reconstruido con kit original. Prueba de presión satisfactoria.',
              kilometraje: 87200,
              estado: 'completado' as const,
              repuestos: [
                'Kit reparación turbo',
                'Aceite sintético 5W30',
                'Filtro aceite',
              ],
              tecnico: 'Juan Pérez',
              costo: 450000,
            },
            {
              vehicleId: vehicle.id,
              fecha: '2025-01-10',
              tipoServicio: 'Mantenimiento Preventivo',
              descripcion:
                'Cambio de aceite, filtros y revisión general de sistemas diesel.',
              kilometraje: 92100,
              estado: 'completado' as const,
              repuestos: ['Aceite 5W30', 'Filtro aceite', 'Filtro combustible'],
              tecnico: 'Pedro Rojas',
              costo: 120000,
            },
          ]
        : vehicle.patente === 'HYCD45'
          ? [
              {
                vehicleId: vehicle.id,
                fecha: '2024-08-05',
                tipoServicio: 'Limpieza DPF/EGR',
                descripcion:
                  'Limpieza profunda de filtro de partículas y válvula EGR.',
                notasTecnico:
                  'DPF con 78% de saturación. Limpieza ultrasónica exitosa.',
                kilometraje: 112000,
                estado: 'completado' as const,
                repuestos: ['Líquido limpiador DPF'],
                tecnico: 'Juan Pérez',
                costo: 280000,
              },
              {
                vehicleId: vehicle.id,
                fecha: '2025-02-18',
                tipoServicio: 'Diagnóstico Vibración Motor',
                descripcion:
                  'Análisis de vibración en ralentí. Inspección de soportes y inyectores.',
                notasTecnico:
                  'Soporte motor lado derecho desgastado. Inyectores dentro de tolerancia.',
                kilometraje: 118500,
                estado: 'en_proceso' as const,
                repuestos: ['Soporte motor'],
                tecnico: 'Pedro Rojas',
                costo: 95000,
              },
            ]
          : [
              {
                vehicleId: vehicle.id,
                fecha: '2024-11-20',
                tipoServicio: 'Diagnóstico Combustible',
                descripcion:
                  'Análisis de calidad de combustible diesel. Inspección de sistema de inyección.',
                notasTecnico:
                  'Combustible con contaminación por agua. Limpieza de tanque recomendada.',
                kilometraje: 145000,
                estado: 'completado' as const,
                repuestos: ['Filtro combustible', 'Filtro separador agua'],
                tecnico: 'Juan Pérez',
                costo: 175000,
              },
            ];

    for (const s of services) {
      await serviceRepo.save(serviceRepo.create(s));
    }
  }

  console.log('✓ Datos de ejemplo cargados correctamente');
  console.log('');
  console.log('  Patentes de prueba: KJBB12, HYCD45, KJFG78');
  console.log('');
  console.log('  Login cliente (ejemplo KJBB12):');
  console.log('    Teléfono: +56912345678  o  Nombre: Carlos Mendoza');
  console.log('');
  console.log('  Login staff:');
  console.log('    admin / Admin2024!');
  console.log('    mecanico1 / Mecanico2024!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Error al cargar datos:', err);
  process.exit(1);
});
