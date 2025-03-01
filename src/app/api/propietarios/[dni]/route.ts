// /app/api/propietarios/[dni]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://82.165.142.177:8083/api';

// Obtener propietario por DNI
export async function GET(
  request: NextRequest,
  { params }: { params: { dni: string } }
) {
  try {
    const dni = params.dni;
    const targetUrl = `${API_BASE_URL}/propietarios/${dni}`;
    
    console.log(`Proxy: Redirigiendo GET a ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Propietario no encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: `Error en la API externa: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en proxy GET propietario:', error);
    return NextResponse.json(
      { error: `Error en el proxy: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}

// Eliminar propietario por DNI
export async function DELETE(
  request: NextRequest,
  { params }: { params: { dni: string } }
) {
  try {
    const dni = params.dni;
    const targetUrl = `${API_BASE_URL}/propietarios/${dni}`;
    
    console.log(`Proxy: Redirigiendo DELETE a ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
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
      // Si no hay datos JSON, devolvemos una respuesta exitosa
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error en proxy DELETE propietario:', error);
    return NextResponse.json(
      { error: `Error en el proxy: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 }
    );
  }
}