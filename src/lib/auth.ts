import { cookies } from 'next/headers';

// Función para iniciar sesión
export function login(dni: string, email: string) {
  cookies().set('userDni', dni, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 horas
  });
  
  cookies().set('userEmail', email, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 horas
  });
}

// Función para cerrar sesión
export function logout() {
  cookies().delete('userDni');
  cookies().delete('userEmail');
}

// Función para obtener datos de usuario
export function getUserData() {
  const dni = cookies().get('userDni')?.value;
  const email = cookies().get('userEmail')?.value;
  
  return { dni, email };
}