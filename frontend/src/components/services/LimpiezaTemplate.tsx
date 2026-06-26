import { Droplets } from 'lucide-react';
import ServiceLayout from './ServiceLayout';

export default function LimpiezaTemplate() {
  return (
    <ServiceLayout
      title="Limpieza DPF / EGR"
      subtitle="Restauración de potencia y flujo"
      icon={Droplets}
      description="Nuestro proceso de limpieza química y regeneración recupera el flujo de gases del filtro de partículas y la válvula EGR, mejorando la respuesta del acelerador y bajando el consumo."
      bullets={[
        "Lavado químico profesional del DPF.",
        "Descarbonización profunda de la válvula EGR.",
        "Reducción drástica de emisiones de humo.",
        "Prevención del reemplazo del sistema de escape."
      ]}
    />
  );
}