import './globals.css';
import ClientHeader from '@/components/ClientHeader';

export const metadata = {
  title: 'OSUCOMPOST',
  description: 'OSUCOMPOST es una empresa innovadora en Osuna dedicada a la gestión sostenible de residuos orgánicos mediante el proceso de vermicompostaje. Nuestro sistema de recogida puerta a puerta y procesamiento de residuos nos permite crear fertilizantes de alta calidad para la agricultura ecológica, recompensando el compromiso ambiental de nuestra comunidad. Nos esforzamos diariamente para promover prácticas responsables de reciclaje y compostaje, contribuyendo a un futuro más sostenible.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        {/* Header condicional */}
        <ClientHeader />

        {/* Main content */}
        <main className="flex-grow">{children}</main>

        
      </body>
    </html>
  );
}