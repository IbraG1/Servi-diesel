import { ShieldCheck } from 'lucide-react';
import ServiceLayout from './ServiceLayout';

export default function MantenimientoTemplate() {
  return (
    <ServiceLayout
      title="Mantenimiento Preventivo"
      subtitle="Cuidamos el futuro de su motor"
      icon={ShieldCheck}
      description="Mantenimientos preventivos rigurosos utilizando insumos y filtros que cumplen con la norma del fabricante para asegurar la longevidad de su motor diésel."
      bullets={[
        "Cambios de aceite sintético certificados.",
        "Sustitución programada de filtros.",
        "Revisión de correas de distribución.",
        "Inspección general de frenos y fluidos."
      ]}
    />
  );
}