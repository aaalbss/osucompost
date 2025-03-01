// /app/api/puntos-recogida/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://82.165.142.177:8083/api';

// Obtener puntos de recogida (todos o filtrados por DNI)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.search; // Incluye los parámetros de consulta (como ?dni=XXX)
    
    const targetUrl = `${API_BASE_URL}/puntos-recogida${searchParams}`;
    
    console.log(`Proxy: Redirigiendo GET a ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Error en la API externa: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en proxy GET puntos de recogida:', error);
    return NextResponse.json(
      { error: `Error en el proxy: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}

// Crear un nuevo punto de recogida
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const targetUrl = `${API_BASE_URL}/puntos-recogida`;
    
    console.log(`Proxy: Redirigiendo POST a ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Error en la API externa: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en proxy POST punto de recogida:', error);
    return NextResponse.json(
      { error: `Error en el proxy: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}