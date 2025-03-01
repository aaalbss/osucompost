'use client';

import { Propietario, PuntoRecogida, Facturacion, FormData, TipoResiduo } from '@/types/types';

// Añadir interfaces para Contenedor y Precio
interface Contenedor {
  id: number;
  capacidad: number;
  tipoResiduo: TipoResiduo;
  puntoRecogida: PuntoRecogida;
}

interface Precio {
  id: number;
  fechaInicio: string;
  fechaFin: string | null;
  valor: number;
  tipoResiduo: TipoResiduo;
}

// Cambiar la URL base para usar el proxy de Next.js
// const API_BASE_URL = 'http://82.165.142.177:8083/api';
const API_BASE_URL = '/api/proxy'; // Este es el cambio principal

// Función auxiliar para hacer fetch con timeout y manejo de errores
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const signal = controller.signal;
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Error desconocido');
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error(`La solicitud a ${url} ha excedido el tiempo de espera`);
      throw new Error(`La solicitud ha excedido el tiempo de espera. Por favor, inténtelo de nuevo.`);
    }
    throw error;
  }
};

// API de Propietarios con manejo mejorado de errores
export const propietarioAPI = {
  verificarDNI: async (dni: string): Promise<Propietario | null> => {
    try {
      console.log(`Verificando DNI: ${dni}`);
      const url = `${API_BASE_URL}/propietarios/${dni}`;
      
      try {
        const propietario = await fetchWithTimeout(url);
        console.log('Propietario verificado:', propietario);
        return propietario;
      } catch (error) {
        // Si es un error 404, devolvemos null en lugar de lanzar error
        if (error instanceof Error && (
          error.message.includes('404') || 
          error.message.includes('No encontrado')
        )) {
          console.log('DNI no encontrado, devolviendo null');
          return null;
        }
        // Para otros errores, los relanzamos
        throw error;
      }
    } catch (error) {
      console.error('Error en verificarDNI:', error);
      // Propagar el error pero asegurando que sea de tipo Error
      throw new Error(`Error en verificarDNI: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  obtenerPropietario: async (dni: string): Promise<Propietario> => {
    try {
      console.log(`Obteniendo propietario con DNI: ${dni}`);
      const url = `${API_BASE_URL}/propietarios/${dni}`;
      const propietario = await fetchWithTimeout(url);
      console.log('Propietario obtenido:', propietario);
      return propietario;
    } catch (error) {
      console.error('Error en obtenerPropietario:', error);
      throw new Error(`No se pudo obtener el propietario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  eliminarPropietario: async (dni: string): Promise<boolean> => {
    try {
      console.log(`Eliminando propietario con DNI: ${dni}`);
      const url = `${API_BASE_URL}/propietarios/${dni}`;
      await fetchWithTimeout(url, { method: 'DELETE' });
      console.log('Propietario eliminado correctamente');
      return true;
    } catch (error) {
      console.error('Error en eliminarPropietario:', error);
      throw new Error(`Error al eliminar el propietario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
};

// API para autenticación de usuarios
export const authAPI = {
  login: async (dni: string, email: string): Promise<Propietario | null> => {
    try {
      console.log(`Intentando login con DNI: ${dni} y email: ${email}`);
      
      // Primero verificamos si existe el propietario
      const propietario = await propietarioAPI.verificarDNI(dni);
      
      if (!propietario) {
        console.log('DNI no encontrado en base de datos');
        return null;
      }
      
      // Comprobamos si el email coincide (case insensitive)
      if (propietario.email.toLowerCase() !== email.toLowerCase()) {
        console.log('Email no coincide con el registrado para este DNI');
        return null;
      }
      
      console.log('Autenticación exitosa:', propietario);
      return propietario;
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error(`Error en la autenticación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },
  
  // También podemos agregar una función para comprobar las credenciales
  verificarCredenciales: async (dni: string, email: string): Promise<boolean> => {
    try {
      const propietario = await authAPI.login(dni, email);
      return propietario !== null;
    } catch (error) {
      console.error('Error al verificar credenciales:', error);
      return false;
    }
  }
};

// API de Puntos de Recogida con timeout y mejor manejo de errores
export const puntosRecogidaAPI = {
  obtenerPorPropietario: async (dni: string): Promise<PuntoRecogida[]> => {
    try {
      console.log(`Obteniendo puntos de recogida para DNI: ${dni}`);
      const url = `${API_BASE_URL}/puntos-recogida?dni=${dni}`;
      const puntos = await fetchWithTimeout(url);
      console.log(`Obtenidos ${puntos.length} puntos de recogida`);
      return puntos;
    } catch (error) {
      console.error('Error en obtenerPorPropietario (puntos recogida):', error);
      throw new Error(`Error al obtener puntos de recogida: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  obtenerTodos: async (): Promise<PuntoRecogida[]> => {
    try {
      console.log('Obteniendo todos los puntos de recogida');
      const url = `${API_BASE_URL}/puntos-recogida`;
      const puntos = await fetchWithTimeout(url);
      console.log(`Obtenidos ${puntos.length} puntos de recogida totales`);
      return puntos;
    } catch (error) {
      console.error('Error en obtenerTodos (puntos recogida):', error);
      return []; // En caso de error, devolver un array vacío para evitar que falle la app
    }
  }
};

// API de Facturaciones con timeout y mejor manejo de errores
export const facturacionAPI = {
  obtenerPorPropietario: async (dni: string): Promise<Facturacion[]> => {
    try {
      console.log(`Obteniendo facturaciones para DNI: ${dni}`);
      const url = `${API_BASE_URL}/facturaciones?dni=${dni}`;
      const facturaciones = await fetchWithTimeout(url);
      console.log(`Obtenidas ${facturaciones.length} facturaciones`);
      return facturaciones;
    } catch (error) {
      console.error('Error en obtenerPorPropietario (facturaciones):', error);
      throw new Error(`Error al obtener facturaciones: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  obtenerTodas: async (): Promise<Facturacion[]> => {
    try {
      console.log('Obteniendo todas las facturaciones');
      const url = `${API_BASE_URL}/facturaciones`;
      const facturaciones = await fetchWithTimeout(url);
      console.log(`Obtenidas ${facturaciones.length} facturaciones totales`);
      return facturaciones;
    } catch (error) {
      console.error('Error en obtenerTodas (facturaciones):', error);
      return []; // En caso de error, devolver un array vacío para evitar que falle la app
    }
  }
};

// NUEVO: API para Contenedores
export const contenedorAPI = {
  obtenerPorPuntoRecogida: async (idPuntoRecogida: number): Promise<Contenedor[]> => {
    try {
      console.log(`Obteniendo contenedores para el punto de recogida: ${idPuntoRecogida}`);
      const url = `${API_BASE_URL}/contenedores?puntoRecogidaId=${idPuntoRecogida}`;
      const contenedores = await fetchWithTimeout(url);
      console.log(`Obtenidos ${contenedores.length} contenedores`);
      return contenedores;
    } catch (error) {
      console.error('Error en obtenerPorPuntoRecogida (contenedores):', error);
      return []; // En caso de error, devolver un array vacío
    }
  },
  
  obtenerTodos: async (): Promise<Contenedor[]> => {
    try {
      console.log('Obteniendo todos los contenedores');
      const url = `${API_BASE_URL}/contenedores`;
      const contenedores = await fetchWithTimeout(url);
      console.log(`Obtenidos ${contenedores.length} contenedores totales`);
      return contenedores;
    } catch (error) {
      console.error('Error en obtenerTodos (contenedores):', error);
      return []; // En caso de error, devolver un array vacío
    }
  }
};

// NUEVO: API para Precios
export const precioAPI = {
  obtenerTodos: async (): Promise<Precio[]> => {
    try {
      console.log('Obteniendo todos los precios');
      const url = `${API_BASE_URL}/precios`;
      const precios = await fetchWithTimeout(url);
      console.log(`Obtenidos ${precios.length} precios totales`);
      return precios;
    } catch (error) {
      console.error('Error en obtenerTodos (precios):', error);
      return []; // En caso de error, devolver un array vacío
    }
  },
  
  obtenerPorTipoResiduo: async (idTipoResiduo: number): Promise<Precio[]> => {
    try {
      console.log(`Obteniendo precios para el tipo de residuo: ${idTipoResiduo}`);
      const url = `${API_BASE_URL}/precios?tipoResiduoId=${idTipoResiduo}`;
      const precios = await fetchWithTimeout(url);
      console.log(`Obtenidos ${precios.length} precios`);
      return precios;
    } catch (error) {
      console.error('Error en obtenerPorTipoResiduo (precios):', error);
      throw new Error(`Error al obtener precios: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
};

// El resto del archivo permanece igual...
export const obtenerFechaAltaUsuario = async (dni: string): Promise<string | null> => {
  try {
    console.log(`Obteniendo fecha de alta para el usuario con DNI: ${dni}`);
    
    // 1. Obtener todos los puntos de recogida del usuario
    const puntosRecogida = await puntosRecogidaAPI.obtenerPorPropietario(dni);
    if (puntosRecogida.length === 0) {
      console.log('No se encontraron puntos de recogida para este usuario');
      return null;
    }
    
    // 2. Obtener todos los contenedores
    const todosLosContenedores = await contenedorAPI.obtenerTodos();
    
    // 3. Filtrar los contenedores que pertenecen a los puntos de recogida del usuario
    const idsPuntosRecogida = puntosRecogida.map(punto => punto.id);
    const contenedoresUsuario = todosLosContenedores.filter(
      contenedor => idsPuntosRecogida.includes(contenedor.puntoRecogida.id)
    );
    
    if (contenedoresUsuario.length === 0) {
      console.log('No se encontraron contenedores para los puntos de recogida del usuario');
      return null;
    }
    
    // 4. Obtener los tipos de residuo únicos de los contenedores del usuario
    const tiposResiduoUsuario = new Set(
      contenedoresUsuario.map(contenedor => contenedor.tipoResiduo.id)
    );
    
    // 5. Obtener todos los precios
    const todosLosPrecios = await precioAPI.obtenerTodos();
    
    // 6. Filtrar precios que coincidan con los tipos de residuo del usuario
    const preciosRelevantes = todosLosPrecios.filter(
      precio => tiposResiduoUsuario.has(precio.tipoResiduo.id)
    );
    
    if (preciosRelevantes.length === 0) {
      console.log('No se encontraron precios para los tipos de residuo del usuario');
      return null;
    }
    
    // 7. Ordenar los precios por fecha de inicio (más reciente primero)
    const preciosOrdenados = preciosRelevantes.sort((a, b) => 
      new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    );
    
    // 8. Encontrar la fecha de registro específica para cada tipo de residuo
    // Esta es la clave: usar un método diferente para determinar la fecha de alta
    
    // Obtener fecha más antigua (primera creación de precio para los tipos de residuo del usuario)
    // Esta sería la fecha de alta del usuario en el sistema para su tipo de residuo
    const fechaMasAntigua = preciosOrdenados.reduce((fechaAntigua, precio) => {
      const fechaPrecio = new Date(precio.fechaInicio);
      const fechaActual = fechaAntigua ? new Date(fechaAntigua) : new Date();
      return fechaPrecio < fechaActual ? precio.fechaInicio : fechaAntigua;
    }, null);
    
    console.log(`Fecha de alta determinada: ${fechaMasAntigua}`);
    return fechaMasAntigua;
  } catch (error) {
    console.error('Error al obtener la fecha de alta del usuario:', error);
    throw new Error(`Error al obtener la fecha de alta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

// API para el Formulario de Registro con mejor manejo de errores
export const registroAPI = {
  submitFormData: async (formData: FormData): Promise<boolean> => {
    try {
      console.log('Iniciando registro de propietario');
      const dniNormalizado = formData.dni.trim().toUpperCase();
      
      // Primero verificar si el propietario ya existe
      let propietarioExistente = null;
      try {
        propietarioExistente = await propietarioAPI.verificarDNI(dniNormalizado);
      } catch (error) {
        console.log('Error al verificar propietario, asumiendo que no existe:', error);
      }
      
      let propietarioData: Propietario;
      
      if (!propietarioExistente) {
        // Solo crear el propietario si no existe
        propietarioData = {
          dni: dniNormalizado,
          nombre: formData.nombre.trim(),
          telefono: parseInt(formData.telefono.replace(/\D/g, '')) || 0,
          email: formData.email.trim().toLowerCase(),
        };
        
        console.log('Registrando nuevo propietario:', propietarioData);
        await fetchWithTimeout(`${API_BASE_URL}/propietarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(propietarioData),
        });
        console.log('Propietario registrado correctamente');
      } else {
        console.log('Propietario ya existe, usando datos existentes:', propietarioExistente);
        propietarioData = propietarioExistente;
      }
      
      // El resto del código permanece igual...
      // Todas las llamadas a ${API_BASE_URL} ahora usarán el nuevo valor (/api/proxy)
      
      // Código existente...
      const puntosExistentes = await puntosRecogidaAPI.obtenerPorPropietario(dniNormalizado);
      
      const direccionNormalizada = formData.domicilio.trim().toLowerCase();
      const puntoExistente = puntosExistentes.find(punto => 
        punto.direccion.toLowerCase() === direccionNormalizada && 
        punto.localidad.toLowerCase() === formData.localidad.trim().toLowerCase()
      );
      
      if (puntoExistente) {
        console.log('Punto de recogida ya existe, saltando creación:', puntoExistente);
        return true; // O puedes devolver un mensaje específico si prefieres
      }
      
      const tipoResiduoData: TipoResiduo = {
        id: formData.tipoResiduo === 'Organico' ? 1 : 2,
        descripcion: formData.tipoResiduo
      };
      
      const puntoRecogidaData = {
        localidad: formData.localidad.trim(),
        cp: parseInt(formData.cp) || 0,
        provincia: formData.provincia.trim(),
        direccion: formData.domicilio.trim(),
        dni: dniNormalizado,
        horario: formData.horario === 'Manana' ? 'M' : 
                formData.horario === 'Tarde' ? 'T' : 'N',
        tipo: formData.fuente,
        propietario: propietarioData
      };
      
      console.log('Registrando punto de recogida:', puntoRecogidaData);
      const puntoRecogidaResponse = await fetchWithTimeout(`${API_BASE_URL}/puntos-recogida`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(puntoRecogidaData),
      });
      
      console.log('Punto de recogida registrado correctamente');
      
      const puntoRecogidaRegistrado = puntoRecogidaResponse;
      
      let capacidad = 16;
      switch(formData.cantidad) {
        case 'Cubo 16 L': capacidad = 16; break;
        case 'Cubo 160 L': capacidad = 160; break;
        case 'Contenedor 800 L': capacidad = 800; break;
        case 'Contenedor 1200 L': capacidad = 1200; break;
      }
      
      const contenedorData = {
        id_punto_recogida: puntoRecogidaRegistrado.id,
        capacidad: capacidad,
        id_tipo_residuo: tipoResiduoData.id,
        tipoResiduo: tipoResiduoData,
        puntoRecogida: {
          ...puntoRecogidaRegistrado,
          propietario: propietarioData
        }
      };
      
      console.log('Registrando contenedor:', contenedorData);
      await fetchWithTimeout(`${API_BASE_URL}/contenedores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contenedorData),
      });
      
      console.log('Contenedor registrado correctamente');
      
      // Verificar si ya existe una facturación para este propietario y tipo de residuo
      const facturacionesExistentes = await facturacionAPI.obtenerPorPropietario(dniNormalizado);
      const facturacionExistente = facturacionesExistentes.find(facturacion => 
        facturacion.id_tipo_residuo === tipoResiduoData.id
      );
      
      if (!facturacionExistente) {
        const facturacionData = {
          dni: dniNormalizado,
          propietario: propietarioData,
          id_tipo_residuo: tipoResiduoData.id,
          tipoResiduo: tipoResiduoData,
          total: 0
        };
        
        console.log('Registrando facturación:', facturacionData);
        await fetchWithTimeout(`${API_BASE_URL}/facturaciones`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(facturacionData),
        });
        
        console.log('Facturación registrada correctamente');
      } else {
        console.log('Facturación ya existe, saltando creación:', facturacionExistente);
      }
      
      // MODIFICACIÓN: Verificar si ya existe un precio para este tipo de residuo antes de crear uno nuevo
      const preciosExistentes = await precioAPI.obtenerPorTipoResiduo(tipoResiduoData.id);
      
      if (preciosExistentes.length === 0) {
        // Solo crear un nuevo precio si no existe ninguno para este tipo de residuo
        const fechaAlta = new Date().toISOString();
        const precioData = {
          tipoResiduo: tipoResiduoData,
          fechaInicio: fechaAlta,
          fechaFin: null,
          valor: formData.tipoResiduo === 'Organico' ? 0.15 : 0.15
        };
        
        console.log('Registrando nuevo precio:', precioData);
        await fetchWithTimeout(`${API_BASE_URL}/precios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(precioData),
        });
        
        console.log('Precio registrado correctamente');
      } else {
        console.log('Ya existe un precio para este tipo de residuo, saltando creación:', preciosExistentes[0]);
      }
      
      console.log('Registro completo exitoso');
      
      return true;
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      throw new Error(`Error en el registro: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
};