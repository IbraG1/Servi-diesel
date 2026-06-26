import { Fuel } from 'lucide-react';
import ServiceLayout from './ServiceLayout';

export default function InyeccionTemplate() {
  return (
    <ServiceLayout
      title="Sistema de Inyección"
      subtitle="Combustión limpia y eficiente"
      icon={Fuel}
      description="Evaluamos, reparamos y calibramos inyectores y bombas de alta presión (Common Rail) para asegurar que el combustible se pulverice de manera perfecta en cada ciclo."
      bullets={[
        "Comprobación en banco de pruebas especializado.",
        "Reparación de fugas en la rampa de inyección.",
        "Eliminación de vibraciones en ralentí.",
        "Optimización del consumo de combustible."
      ]}
    />
  );
}