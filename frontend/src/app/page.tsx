import SearchBar from '@/components/SearchBar';
import ValueProps from '@/components/ValueProps';
import {
  Cpu,
  Droplets,
  Wind,
  Activity,
  Fuel,
  ShieldCheck,
} from 'lucide-react';

const services = [
  { icon: Cpu, label: 'Diagnóstico Electrónico' },
  { icon: Wind, label: 'Reparación Turbo' },
  { icon: Droplets, label: 'Limpieza DPF/EGR' },
  { icon: Fuel, label: 'Sistema de Inyección' },
  { icon: Activity, label: 'Análisis de Vibración' },
  { icon: ShieldCheck, label: 'Mantenimiento Preventivo' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-diesel-blue/5 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(0,112,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,74,173,0.1) 0%, transparent 40%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-none">
              Historial
            </h1>
            <p className="font-script text-3xl sm:text-4xl md:text-5xl text-diesel-blue-light mt-2 glow-text">
              de servicios
            </p>
            <p className="mt-6 text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
              Consulta el registro completo de mantenciones y reparaciones de
              tu vehículo. Transparencia y confianza en cada detalle.
            </p>
          </div>

          <div id="buscar" className="mt-12 scroll-mt-24">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Services icons bar */}
      <section className="py-12 bg-diesel-navy/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {services.map((service) => (
              <div
                key={service.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <service.icon
                  size={28}
                  className="text-gray-500 group-hover:text-diesel-blue-light transition-colors"
                />
                <span className="text-[10px] sm:text-xs text-gray-500 group-hover:text-gray-300 text-center leading-tight transition-colors">
                  {service.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ValueProps />

      {/* Trust section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="font-display text-3xl md:text-4xl uppercase tracking-wide text-white mb-2">
                Gracias por elegir
              </h2>
              <p className="font-script text-2xl md:text-3xl text-diesel-blue-light mb-6">
                Servi Diesel
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                Cada vehículo que pasa por nuestro taller es tratado con la
                misma dedicación y profesionalismo. Registramos cada servicio
                para que usted tenga{' '}
                <span className="text-diesel-blue-light font-medium">
                  total transparencia
                </span>{' '}
                sobre el mantenimiento de su vehículo.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Nuestro compromiso es entregar un servicio honesto, de calidad y
                con la tecnología de diagnóstico más avanzada para Kia y Hyundai
                diesel.
              </p>
            </div>

            <div className="card-glass p-8 text-center animate-slide-up" style={{ animationDelay: '150ms' }}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-diesel-blue/10 border border-diesel-blue/30 mb-6 animate-pulse-glow">
                <ShieldCheck size={40} className="text-diesel-blue-light" />
              </div>
              <p className="font-display text-xl uppercase tracking-wide text-white mb-2">
                Diagnóstico Preciso
              </p>
              <p className="text-gray-400 text-sm">
                Equipamiento de última generación para un análisis exacto de
                cada sistema de su vehículo diesel.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
