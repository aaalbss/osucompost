// This is a server component (no 'use client' directive)
import OperariosPageClient from './OperariosPageClient';

export const metadata = {
  title: 'OSUCOMPOST- Zonde de operarios',
  description: 'Área de operarios',
}

export default function OperariosPage() {
  return <OperariosPageClient />;
}