import { Activity } from 'lucide-react';
import ServiceLayout from './ServiceLayout';

export default function VibracionTemplate() {
  return (
    <ServiceLayout
      title="Análisis de Vibración"
      subtitle="Detección temprana de anomalías"
      icon={Activity}
      description="Utilizamos herramientas de análisis para aislar frecuencias mecánicas anormales, detectando el origen exacto de vibraciones molestas en su vehículo."
      bullets={[
        "Revisión de soportes hidráulicos de motor.",
        "Detección de desbalances en volante bimasa.",
        "Inspección de holguras en el tren motriz.",
        "Prevención de roturas por estrés mecánico."
      ]}
    />
  );
}