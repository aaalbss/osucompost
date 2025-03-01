// /app/api/precios/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://82.165.142.177:8083/api';

// Obtener precios (todos o filtrados por tipoResiduoId)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.search; // Incluye los parámetros de consulta
    
    const targetUrl = `${API_BASE_URL}/precios${searchParams}`;
    
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
    console.error('Error en proxy GET precios:', error);
    return NextResponse.json(
      { error: `Error en el proxy: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}

// Crear un nuevo precio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const targetUrl = `${API_BASE_URL}/precios`;
    
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
    console.error('Error en proxy POST precio:', error);
    return NextResponse.json(
      { error: `Error en el proxy: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}