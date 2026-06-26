import { Cpu } from 'lucide-react';
import ServiceLayout from './ServiceLayout';

export default function DiagnosticoTemplate() {
  return (
    <ServiceLayout
      title="Diagnóstico Electrónico"
      subtitle="Precisión a nivel concesionario"
      icon={Cpu}
      description="Utilizamos escáneres y software original para identificar con exactitud fallas en los sistemas electrónicos de su vehículo KIA o Hyundai. Evite gastos innecesarios cambiando piezas a ciegas; nuestro equipo localiza la raíz del problema en minutos."
      bullets={[
        "Lectura y borrado de códigos de falla (DTC).",
        "Análisis de datos en tiempo real de sensores.",
        "Diagnóstico profundo de redes de comunicación CAN Bus.",
        "Calibración y adaptación post-reparación."
      ]}
    />
  );
}