import { Shield, Award, Users, HeartHandshake } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Honestidad Siempre',
    subtitle: 'Transparencia en cada diagnóstico',
  },
  {
    icon: Award,
    title: 'Trabajo de Calidad',
    subtitle: 'Estándares de excelencia técnica',
  },
  {
    icon: Users,
    title: 'Relaciones que Perduran',
    subtitle: 'Confianza construida en el tiempo',
  },
  {
    icon: HeartHandshake,
    title: 'Compromiso con Ustedes',
    subtitle: 'Su vehículo es nuestra prioridad',
  },
];

export default function ValueProps() {
  return (
    <section className="py-16">
      <div className="section-divider mb-12" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((value, i) => (
            <div
              key={value.title}
              className="text-center group animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-diesel-blue/40 mb-4 group-hover:border-diesel-blue-light group-hover:shadow-blue-glow transition-all duration-300">
                <value.icon
                  size={28}
                  className="text-diesel-blue-light group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="font-display text-sm md:text-base uppercase tracking-wide text-white mb-1">
                {value.title}
              </h3>
              <p className="text-xs text-gray-500 hidden sm:block">{value.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
