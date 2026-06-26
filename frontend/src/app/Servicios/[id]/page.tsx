// src/app/servicios/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';

import DiagnosticoTemplate from '@/components/services/DiagnosticoTemplate';
import ProgramacionTemplate from '@/components/services/ProgramacionTemplate';
import LimpiezaTemplate from '@/components/services/LimpiezaTemplate';
import InyeccionTemplate from '@/components/services/InyeccionTemplate';
import VibracionTemplate from '@/components/services/VibracionTemplate';
import MantenimientoTemplate from '@/components/services/MantenimientoTemplate';

interface PageProps {
  params: {
    id: string;
  };
}

const templatesMap: Record<string, React.ComponentType> = {
  'diagnostico-electronico': DiagnosticoTemplate,
  'programacion': ProgramacionTemplate,
  'limpieza-dpf': LimpiezaTemplate,
  'sistema-inyeccion': InyeccionTemplate,
  'analisis-vibracion': VibracionTemplate,
  'mantenimiento-preventivo': MantenimientoTemplate,
};

export default function ServicioPage({ params }: PageProps) {
  const SelectedTemplate = templatesMap[params.id];

  if (!SelectedTemplate) {
    notFound(); // Muestra la página 404 si el servicio no existe
  }

  return <SelectedTemplate />;
}