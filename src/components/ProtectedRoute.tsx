// components/ProtectedRoute.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import LoadingSpinner from '@/components/propietario/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      
      if (!isAuth) {
        router.push('/area-cliente');
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : null;
}