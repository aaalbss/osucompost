// /app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://82.165.142.177:8083/api';

// Función auxiliar para reenviar peticiones a la API externa
async function forwardRequest(request: NextRequest, path: string = '') {
  try {
    const url = new URL(request.url);
    const searchParams = url.search; // Incluye los parámetros de consulta
    
    // Añadir más logs de depuración
    console.log('URL original de la solicitud:', url.toString());
    console.log('Path extraído:', path);
    console.log('Parámetros de consulta:', searchParams);
    // Construir la URL completa para la API externa
    const targetUrl = `${API_BASE_URL}${path}${searchParams}`;
    
    const method = request.method;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    };
    
    // Añadir body para métodos POST, PUT
    if (method !== 'GET' && method !== 'HEAD' && method !== 'DELETE') {
      const body = await request.json();
      options.body = JSON.stringify(body);
    }
    
    console.log(`Proxy: Redirigiendo ${method} a ${targetUrl}`);
    
    const response = await fetch(targetUrl, options);
    
    if (!response.ok) {
      console.error(`Error en proxy ${method}: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Error en la API externa: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Para DELETE, es posible que no haya contenido de respuesta
    if (response.headers.get('content-length') === '0') {
      return new NextResponse(null, { status: 204 });
    }
    
    try {
      const data = await response.json();
      return NextResponse.json(data);
    } catch (e) {
      // Si no hay datos JSON, devolvemos una respuesta vacía con el estado correcto
      return new NextResponse(null, { status: response.status });
    }
  } catch (error) {
    console.error(`Error en proxy ${request.method}:`, error);
    return NextResponse.json(
      { error: `Error en el proxy: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}

// Manejadores para cada método HTTP
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/proxy', '');
  return forwardRequest(request, path);
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/proxy', '');
  return forwardRequest(request, path);
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/proxy', '');
  return forwardRequest(request, path);
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/proxy', '');
  return forwardRequest(request, path);
}