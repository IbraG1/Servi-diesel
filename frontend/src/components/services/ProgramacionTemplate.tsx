import { Terminal } from 'lucide-react';
import ServiceLayout from './ServiceLayout';

export default function ProgramacionTemplate() {
  return (
    <ServiceLayout
      title="Programación Avanzada"
      subtitle="EGR, DPF e IMMO OFF"
      icon={Terminal}
      description="Brindamos soluciones definitivas a problemas recurrentes modificando los parámetros del software de la Unidad de Control del Motor (ECU). Nuestro servicio garantiza un funcionamiento estable."
      bullets={[
        "Anulación de inmovilizador (IMMO OFF).",
        "Ajuste y cierre electrónico de válvulas EGR.",
        "Soluciones por software para Filtros DPF.",
        "Actualizaciones de firmware para la ECU."
      ]}
    />
  );
}