'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Lock,
  Plus,
  Trash2,
  Car,
  Wrench,
  BarChart3,
  Loader2,
  LogOut,
  Camera,
} from 'lucide-react';
import {
  getAllVehicles,
  getAllServices,
  getStats,
  createVehicle,
  createService,
  deleteService,
  loginStaff,
} from '@/lib/api';
import { getStaffToken, setStaffToken, clearStaffToken, getStaffInfo, setStaffInfo } from '@/lib/auth-storage';
import type { Vehicle, ServiceRecord, ServiceStats } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/api';
import PhotoManager from '@/components/PhotoManager';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [staffRole, setStaffRole] = useState<string>('');
  const [staffName, setStaffName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'dashboard' | 'vehicles' | 'services' | 'add'>('dashboard');
  const [photoServiceId, setPhotoServiceId] = useState<number | null>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [stats, setStats] = useState<ServiceStats | null>(null);

  const [vehicleForm, setVehicleForm] = useState({
    patente: '',
    marca: 'Kia',
    modelo: '',
    anio: new Date().getFullYear(),
    clienteNombre: '',
    clienteTelefono: '',
    color: '',
    consentimientoDatos: true,
  });

  const [serviceForm, setServiceForm] = useState({
    vehicleId: 0,
    fecha: new Date().toISOString().split('T')[0],
    tipoServicio: '',
    descripcion: '',
    notasTecnico: '',
    kilometraje: 0,
    estado: 'completado' as const,
    repuestos: '',
    tecnico: '',
    costo: 0,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [v, s, st] = await Promise.all([
        getAllVehicles(),
        getAllServices(),
        getStats(),
      ]);
      setVehicles(v);
      setServices(s);
      setStats(st);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
      setAuthenticated(false);
      clearStaffToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const info = getStaffInfo();
    if (info) {
      setStaffRole(info.role);
      setStaffName(info.nombre);
    }
    if (getStaffToken()) {
      loadData();
    }
  }, [loadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginStaff({ username, password });
      setStaffToken(res.accessToken);
      setStaffInfo(res.role, res.nombre || username);
      setStaffRole(res.role);
      setStaffName(res.nombre || username);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearStaffToken();
    setAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createVehicle(vehicleForm);
      await loadData();
      setVehicleForm({
        patente: '',
        marca: 'Kia',
        modelo: '',
        anio: new Date().getFullYear(),
        clienteNombre: '',
        clienteTelefono: '',
        color: '',
        consentimientoDatos: true,
      });
      setTab('vehicles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear vehículo');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createService({
        ...serviceForm,
        repuestos: serviceForm.repuestos
          ? serviceForm.repuestos.split(',').map((r) => r.trim())
          : undefined,
      });
      await loadData();
      setServiceForm({
        vehicleId: 0,
        fecha: new Date().toISOString().split('T')[0],
        tipoServicio: '',
        descripcion: '',
        notasTecnico: '',
        kilometraje: 0,
        estado: 'completado',
        repuestos: '',
        tecnico: '',
        costo: 0,
      });
      setTab('services');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('¿Eliminar este registro de servicio?')) return;
    try {
      await deleteService(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="card-glass p-8 w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-diesel-blue/10 border border-diesel-blue/30 mb-4">
              <Lock size={28} className="text-diesel-blue-light" />
            </div>
            <h1 className="font-display text-2xl uppercase tracking-wide text-white">
              Acceso Staff
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Admin o Mecánico — ISO 27001 / Ley 20.663
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              className="input-field"
              required
              autoComplete="username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="input-field"
              required
              autoComplete="current-password"
            />
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Ingresar'}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Demo: admin / Admin2024! · mecanico1 / Mecanico2024!
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'vehicles' as const, label: 'Vehículos', icon: Car },
    { id: 'services' as const, label: 'Servicios', icon: Wrench },
    { id: 'add' as const, label: 'Agregar', icon: Plus },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {photoServiceId && (
        <PhotoManager
          serviceId={photoServiceId}
          onClose={() => setPhotoServiceId(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-white">
            Panel Staff
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {staffName} · Rol: {staffRole}
          </p>
        </div>
        <button onClick={handleLogout} className="btn-outline text-sm self-start">
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-4 underline">
            Cerrar
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-diesel-blue text-white shadow-blue-glow'
                : 'bg-diesel-card text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {loading && tab !== 'add' && (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="text-diesel-blue-light animate-spin" />
        </div>
      )}

      {!loading && tab === 'dashboard' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in">
          {[
            { label: 'Total Servicios', value: stats.total, color: 'text-diesel-blue-light' },
            { label: 'Completados', value: stats.completados, color: 'text-green-400' },
            { label: 'En Proceso', value: stats.enProceso, color: 'text-yellow-400' },
          ].map((item) => (
            <div key={item.label} className="card-glass p-6 text-center">
              <p className={`font-display text-4xl ${item.color}`}>{item.value}</p>
              <p className="text-gray-400 text-sm mt-2">{item.label}</p>
            </div>
          ))}
          <div className="sm:col-span-3 card-glass p-6">
            <p className="text-gray-400 text-sm mb-2">Vehículos registrados</p>
            <p className="font-display text-2xl text-white">{vehicles.length}</p>
          </div>
        </div>
      )}

      {!loading && tab === 'vehicles' && (
        <div className="space-y-3 animate-fade-in">
          {vehicles.map((v) => (
            <div key={v.id} className="card-glass p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <span className="font-display text-xl text-white tracking-wider">
                  {v.patente}
                </span>
                <span className="text-gray-400 text-sm ml-3">
                  {v.marca} {v.modelo} {v.anio}
                </span>
                <p className="text-gray-500 text-sm mt-1">{v.clienteNombre}</p>
              </div>
              <span className="text-diesel-blue-light text-sm">
                {v.servicios?.length || 0} servicios
              </span>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === 'services' && (
        <div className="space-y-3 animate-fade-in">
          {services.map((s) => {
            const vehicle = vehicles.find((v) => v.id === s.vehicleId);
            return (
              <div key={s.id} className="card-glass p-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-white">{s.tipoServicio}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-diesel-blue/10 text-diesel-blue-light">
                        {vehicle?.patente || `#${s.vehicleId}`}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{formatDate(s.fecha)}</p>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{s.descripcion}</p>
                    {s.costo && (
                      <p className="text-diesel-blue-light text-sm mt-1">
                        {formatCurrency(Number(s.costo))}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 self-start">
                    <button
                      onClick={() => setPhotoServiceId(s.id)}
                      className="p-2 text-diesel-blue-light hover:bg-diesel-blue/10 rounded-lg transition-colors"
                      title="Gestionar fotografías"
                    >
                      <Camera size={16} />
                    </button>
                    {staffRole === 'admin' && (
                      <button
                        onClick={() => handleDeleteService(s.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label="Eliminar servicio"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'add' && (
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
          <form onSubmit={handleCreateVehicle} className="card-glass p-6 space-y-4">
            <h3 className="font-display text-lg uppercase text-white flex items-center gap-2">
              <Car size={20} className="text-diesel-blue-light" />
              Nuevo Vehículo
            </h3>
            {(
              [
                ['patente', 'Patente'],
                ['marca', 'Marca'],
                ['modelo', 'Modelo'],
                ['clienteNombre', 'Nombre cliente'],
                ['clienteTelefono', 'Teléfono cliente'],
                ['color', 'Color'],
              ] as const
            ).map(([field, label]) => (
              <input
                key={field}
                type="text"
                placeholder={label}
                value={vehicleForm[field]}
                onChange={(e) =>
                  setVehicleForm({ ...vehicleForm, [field]: e.target.value })
                }
                className="input-field"
                required={['patente', 'marca', 'modelo', 'clienteNombre'].includes(field)}
              />
            ))}
            <input
              type="number"
              placeholder="Año"
              value={vehicleForm.anio}
              onChange={(e) =>
                setVehicleForm({ ...vehicleForm, anio: parseInt(e.target.value) })
              }
              className="input-field"
              required
            />
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={vehicleForm.consentimientoDatos}
                onChange={(e) =>
                  setVehicleForm({
                    ...vehicleForm,
                    consentimientoDatos: e.target.checked,
                  })
                }
                className="rounded"
              />
              Consentimiento datos personales (Ley 19.628)
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Registrar Vehículo'}
            </button>
          </form>

          <form onSubmit={handleCreateService} className="card-glass p-6 space-y-4">
            <h3 className="font-display text-lg uppercase text-white flex items-center gap-2">
              <Wrench size={20} className="text-diesel-blue-light" />
              Nuevo Servicio
            </h3>
            <select
              value={serviceForm.vehicleId}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, vehicleId: parseInt(e.target.value) })
              }
              className="input-field"
              required
            >
              <option value={0}>Seleccionar vehículo</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.patente} — {v.marca} {v.modelo}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={serviceForm.fecha}
              onChange={(e) => setServiceForm({ ...serviceForm, fecha: e.target.value })}
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Tipo de servicio"
              value={serviceForm.tipoServicio}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, tipoServicio: e.target.value })
              }
              className="input-field"
              required
            />
            <textarea
              placeholder="Descripción"
              value={serviceForm.descripcion}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, descripcion: e.target.value })
              }
              className="input-field min-h-[80px] resize-y"
              required
            />
            <textarea
              placeholder="Notas del técnico (privadas)"
              value={serviceForm.notasTecnico}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, notasTecnico: e.target.value })
              }
              className="input-field min-h-[60px] resize-y"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Kilometraje"
                value={serviceForm.kilometraje || ''}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    kilometraje: parseInt(e.target.value) || 0,
                  })
                }
                className="input-field"
              />
              <input
                type="number"
                placeholder="Costo (CLP)"
                value={serviceForm.costo || ''}
                onChange={(e) =>
                  setServiceForm({
                    ...serviceForm,
                    costo: parseInt(e.target.value) || 0,
                  })
                }
                className="input-field"
              />
            </div>
            <input
              type="text"
              placeholder="Técnico"
              value={serviceForm.tecnico}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, tecnico: e.target.value })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Repuestos (separados por coma)"
              value={serviceForm.repuestos}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, repuestos: e.target.value })
              }
              className="input-field"
            />
            <select
              value={serviceForm.estado}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  estado: e.target.value as 'completado' | 'en_proceso' | 'pendiente',
                })
              }
              className="input-field"
            >
              <option value="completado">Completado</option>
              <option value="en_proceso">En Proceso</option>
              <option value="pendiente">Pendiente</option>
            </select>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Registrar Servicio'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
