// Archivo: /app/api/propietarios/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://82.165.142.177:8083/api/propietarios', {
      headers: {
        'Content-Type': 'application/json',
      },
      // Importante: La cache debe estar desactivada o configurada según necesidades
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al conectar con la API externa:', error);
    return NextResponse.json(
      { error: 'Error al conectar con la API externa' },
      { status: 500 }
    );
  }
}

// Si necesitas otros métodos HTTP (POST, PUT, DELETE), puedes añadirlos así:
export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetch('http://82.165.142.177:8083/api/propietarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error al conectar con la API externa:', error);
    return NextResponse.json(
      { error: 'Error al conectar con la API externa' },
      { status: 500 }
    );
  }
}