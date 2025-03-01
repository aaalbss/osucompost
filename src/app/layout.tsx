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
      <body className="min-h-screen flex flex-col">
        {/* Header condicional */}
        <ClientHeader />

        {/* Main content */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <footer className="bg-[#2f4f27] text-white text-center p-4">
          © 2025 OSUCOMPOST
        </footer>
      </body>
    </html>
  );
}