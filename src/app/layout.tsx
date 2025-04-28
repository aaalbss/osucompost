import './globals.css';
import ClientHeader from '@/components/ClientHeader';

export const metadata = {
  title: 'OSUCOMPOST',
  description: 'Descripción del sitio web',
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