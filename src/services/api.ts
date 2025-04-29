'use client';

import { Propietario, PuntoRecogida, Facturacion, FormData, TipoResiduo } from '@/types/types';

// Añadir interfaces para Contenedor y Precio
interface Contenedor {
  id: number;
  capacidad: number;
  tipoResiduo: TipoResiduo;
  puntoRecogida: PuntoRecogida;
  frecuencia: string; // Añadido para asegurar que frecuencia es parte del modelo
}

interface Precio {
  id: number;
  fechaInicio: string;
  fechaFin: string | null;
  valor: number;
  tipoResiduo: TipoResiduo;
}

// Usar la variable de entorno para la URL base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || '/api';
console.log('API Base URL:', API_BASE_URL); // Depuración

// Función auxiliar para hacer fetch con timeout y manejo de errores
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 10000) => {
  console.log('=== INICIO fetchWithTimeout ===');
  console.log('URL solicitada:', url);
  console.log('Opciones:', JSON.stringify(options));
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('Timeout alcanzado, abortando...');
    controller.abort();
  }, timeoutMs);
  
  try {
    const signal = controller.signal;
    console.log('Iniciando fetch...');
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    
    console.log('Respuesta recibida. Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Error desconocido');
      console.error(`Error HTTP ${response.status}: ${errorText}`);
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }
    
    const jsonData = await response.json();
    console.log('Datos JSON recibidos:', jsonData);
    return jsonData;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error en fetchWithTimeout:', error);
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error(`La solicitud a ${url} ha excedido el tiempo de espera`);
      throw new Error(`La solicitud ha excedido el tiempo de espera. Por favor, inténtelo de nuevo.`);
    }
    
    throw error;
  } finally {
    console.log('=== FIN fetchWithTimeout ===');
  }
};

// API de Propietarios con manejo mejorado de errores
export const propietarioAPI = {
  verificarDNI: async (dni: string): Promise<Propietario | null> => {
    try {
      // Limpieza apropiada del DNI (sin eliminar números)
      const dniLimpio = dni
        .toString()
        .replace(/[^0-9A-Z]/g, '')  // Mantiene solo números y letras
        .trim()
        .toUpperCase();
      
      const url = `${API_BASE_URL}/propietarios/${dniLimpio}`;
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error(`Error HTTP ${response.status}`);
        }
        
        const propietario = await response.json();
        return propietario;
      } catch {
        // Intentar con fetchWithTimeout como fallback
        try {
          const propietario = await fetchWithTimeout(url);
          return propietario;
        } catch {
          return null;
        }
      }
    } catch {
      return null;
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
      const dniNormalizado = dni.trim().toUpperCase();
      
      // Primero verificamos si existe el propietario
      const propietario = await propietarioAPI.verificarDNI(dniNormalizado);
      
      if (!propietario) {
        console.log('DNI no encontrado en base de datos');
        return null;
      }
      
      // Comprobamos si el email coincide (case insensitive)
      if (propietario.email.toLowerCase() !== email.toLowerCase()) {
        console.log('Email no coincide con el registrado para este DNI');
        return null;
      }
      
      // NUEVO: Si es la primera vez que este usuario inicia sesión en este dispositivo,
      // intentar obtener su fecha de alta para guardarla en localStorage
      if (!localStorage.getItem(`fechaAlta_${dniNormalizado}`)) {
        try {
          console.log('Primera sesión en este dispositivo, obteniendo fecha de alta...');
          // Intentamos obtener la fecha de la base de datos para guardarla localmente
          const fechaAlta = await obtenerFechaAltaUsuario(dniNormalizado);
          if (fechaAlta) {
            console.log(`Guardando fecha de alta en localStorage durante login: ${fechaAlta}`);
          }
        } catch (error) {
          console.error('Error al obtener fecha de alta durante login:', error);
        }
      }
      
      console.log('Autenticación exitosa:', propietario);
      return propietario;
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error(`Error en la autenticación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },
  
  // El resto permanece igual
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
    const dniNormalizado = dni.trim().toUpperCase();
    
    // 1. Verificar si tenemos la fecha guardada en localStorage
    const fechaAltaGuardada = localStorage.getItem(`fechaAlta_${dniNormalizado}`);
    if (fechaAltaGuardada) {
      console.log(`Fecha de alta encontrada en almacenamiento local: ${fechaAltaGuardada}`);
      return fechaAltaGuardada;
    }
    
    // 2. Estrategia de recuperación de fecha de alta
    // Obtener los puntos de recogida del usuario
    const puntosRecogida = await puntosRecogidaAPI.obtenerPorPropietario(dniNormalizado);
    if (puntosRecogida.length === 0) {
      console.log('No se encontraron puntos de recogida para este usuario');
      return null;
    }
    
    // 3. Obtener todos los contenedores de los puntos de recogida del usuario
    const todosLosContenedores = await contenedorAPI.obtenerTodos();
    
    // Filtrar contenedores del usuario
    const idsPuntosRecogida = puntosRecogida.map(punto => punto.id);
    const contenedoresUsuario = todosLosContenedores.filter(
      contenedor => idsPuntosRecogida.includes(contenedor.puntoRecogida.id)
    );
    
    if (contenedoresUsuario.length === 0) {
      console.log('No se encontraron contenedores para los puntos de recogida del usuario');
      return null;
    }
    
    // 4. Identificar tipos de residuo del usuario
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
    
    // 7. Ordenar los precios por fecha de inicio (más antiguo primero)
    const preciosOrdenados = preciosRelevantes.sort((a, b) => 
      new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
    );
    
    // 8. Usar el precio más antiguo como fecha de alta
    const fechaAlta = preciosOrdenados[0]?.fechaInicio || null;
    
    // 9. Guardar la fecha encontrada en localStorage para futuras consultas
    if (fechaAlta) {
      // Agregar un flag para evitar modificaciones
      const fechaAltaAlmacenada = JSON.stringify({
        fecha: fechaAlta,
        inmutable: true
      });
      
      localStorage.setItem(`fechaAlta_${dniNormalizado}`, fechaAltaAlmacenada);
      console.log(`Fecha de alta encontrada y guardada en localStorage: ${fechaAlta}`);
    }
    
    return fechaAlta;
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
      
      // Normalizar y limpiar todos los campos para evitar errores JSON
      const datosNormalizados = {
        ...formData,
        dni: formData.dni.trim().toUpperCase(),
        nombre: formData.nombre.trim(),
        telefono: formData.telefono.replace(/\D/g, ''), // Eliminar caracteres no numéricos
        email: formData.email.trim().toLowerCase(),
        domicilio: formData.domicilio.trim(),
        localidad: formData.localidad.trim(),
        cp: formData.cp.trim(),
        provincia: formData.provincia.trim(),
        tipoResiduo: formData.tipoResiduo,
        fuente: formData.fuente,
        cantidad: formData.cantidad,
        frecuencia: formData.frecuencia || 'Diaria', // Valor por defecto
        horario: formData.horario
      };
      
      const dniNormalizado = datosNormalizados.dni;
      
      // Verificar que la frecuencia esté presente
      if (!datosNormalizados.frecuencia) {
        console.warn('Campo frecuencia vacío, usando valor por defecto');
        datosNormalizados.frecuencia = 'Diaria';
      }
      
      console.log('Frecuencia seleccionada:', datosNormalizados.frecuencia);
      
      // 1. Verificar si ya existe una fecha de alta inmutable
      const fechaAltaExistente = localStorage.getItem(`fechaAlta_${dniNormalizado}`);
      let fechaAlta: string;

      // 2. Determinar la fecha de alta
      if (fechaAltaExistente) {
        try {
          const fechaAltaObj = JSON.parse(fechaAltaExistente);
          
          // Si ya existe una fecha inmutable, usarla
          if (fechaAltaObj.inmutable) {
            fechaAlta = fechaAltaObj.fecha;
            console.log('Fecha de alta ya establecida y bloqueada:', fechaAlta);
          } else {
            // Si no es inmutable, usar la fecha existente o la actual
            fechaAlta = fechaAltaObj.fecha || new Date().toISOString();
          }
        } catch (e) {
          // Si hay error al parsear JSON, usar la fecha actual
          console.error('Error al parsear fecha de alta:', e);
          fechaAlta = new Date().toISOString();
        }
      } else {
        // Si no existe, usar la fecha actual
        fechaAlta = new Date().toISOString();
      }
      
      // 3. Guardar la fecha de alta como inmutable
      localStorage.setItem(`fechaAlta_${dniNormalizado}`, JSON.stringify({
        fecha: fechaAlta,
        inmutable: true
      }));
      
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
          nombre: datosNormalizados.nombre,
          telefono: parseInt(datosNormalizados.telefono) || 0,
          email: datosNormalizados.email,
        };
        
        console.log('Registrando nuevo propietario:', propietarioData);
        
        try {
          // Convertir explícitamente a JSON para evitar problemas con caracteres especiales
          const jsonPropietario = JSON.stringify(propietarioData);
          console.log('JSON a enviar (propietario):', jsonPropietario);
          
          await fetchWithTimeout(`${API_BASE_URL}/propietarios`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: jsonPropietario,
          });
          console.log('Propietario registrado correctamente');
        } catch (error) {
          console.error('Error al registrar propietario:', error);
          throw new Error(`Error al registrar propietario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
      } else {
        console.log('Propietario ya existe, usando datos existentes:', propietarioExistente);
        propietarioData = propietarioExistente;
      }
      
      // Verificar si ya existe un punto de recogida con la misma dirección
      const puntosExistentes = await puntosRecogidaAPI.obtenerPorPropietario(dniNormalizado);
      
      const direccionNormalizada = datosNormalizados.domicilio.toLowerCase();
      const puntoExistente = puntosExistentes.find(punto => 
        punto.direccion.toLowerCase() === direccionNormalizada && 
        punto.localidad.toLowerCase() === datosNormalizados.localidad.toLowerCase()
      );
      
      if (puntoExistente) {
        console.log('Punto de recogida ya existe, saltando creación:', puntoExistente);
        return true;
      }
      
      const tipoResiduoData: TipoResiduo = {
        id: datosNormalizados.tipoResiduo === 'Organico' ? 1 : 2,
        descripcion: datosNormalizados.tipoResiduo
      };
      
      const puntoRecogidaData = {
        localidad: datosNormalizados.localidad,
        cp: parseInt(datosNormalizados.cp) || 0,
        provincia: datosNormalizados.provincia,
        direccion: datosNormalizados.domicilio,
        dni: dniNormalizado,
        horario: datosNormalizados.horario.includes('Mañana') || datosNormalizados.horario.includes('manana') ? 'M' : 
                datosNormalizados.horario.includes('Tarde') || datosNormalizados.horario.includes('tarde') ? 'T' : 
                datosNormalizados.horario.includes('Noche') || datosNormalizados.horario.includes('noche') ? 'N' : 'M', 
        tipo: datosNormalizados.fuente,
        propietario: propietarioData
      };
      
      console.log('Registrando punto de recogida:', puntoRecogidaData);
      
      try {
        // Convertir explícitamente a JSON para evitar problemas con caracteres especiales
        const jsonPuntoRecogida = JSON.stringify(puntoRecogidaData);
        console.log('JSON a enviar (punto recogida):', jsonPuntoRecogida);
        
        const puntoRecogidaResponse = await fetchWithTimeout(`${API_BASE_URL}/puntos-recogida`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonPuntoRecogida,
        });
        
        console.log('Punto de recogida registrado correctamente');
        
        const puntoRecogidaRegistrado = puntoRecogidaResponse;
        
        let capacidad = 16;
        switch(datosNormalizados.cantidad) {
          case 'Cubo 16 L': capacidad = 16; break;
          case 'Cubo 160 L': capacidad = 160; break;
          case 'Contenedor 800 L': capacidad = 800; break;
          case 'Contenedor 1200 L': capacidad = 1200; break;
        }
        
        // Asegurar que el campo frecuencia se envía correctamente
        const contenedorData = {
          id_punto_recogida: puntoRecogidaRegistrado.id,
          capacidad: capacidad,
          id_tipo_residuo: tipoResiduoData.id,
          tipoResiduo: tipoResiduoData,
          puntoRecogida: {
            ...puntoRecogidaRegistrado,
            propietario: propietarioData
          },
          frecuencia: datosNormalizados.frecuencia
        };
        
        console.log('Registrando contenedor con frecuencia:', contenedorData);
        
        // Convertir explícitamente a JSON para evitar problemas con caracteres especiales
        const jsonContenedor = JSON.stringify(contenedorData);
        console.log('JSON a enviar (contenedor):', jsonContenedor);
        
        await fetchWithTimeout(`${API_BASE_URL}/contenedores`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonContenedor,
        });
        
        console.log('Contenedor registrado correctamente');
        
        // Verificar si ya existe una facturación para este propietario y tipo de residuo
        const facturacionesExistentes = await facturacionAPI.obtenerPorPropietario(dniNormalizado);
        const facturacionExistente = facturacionesExistentes.find(facturacion => 
          facturacion.idTipoResiduo === tipoResiduoData.id
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
          
          // Convertir explícitamente a JSON
          const jsonFacturacion = JSON.stringify(facturacionData);
          console.log('JSON a enviar (facturación):', jsonFacturacion);
          
          await fetchWithTimeout(`${API_BASE_URL}/facturaciones`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: jsonFacturacion,
          });
          
          console.log('Facturación registrada correctamente');
        } else {
          console.log('Facturación ya existe, saltando creación:', facturacionExistente);
        }
        
        // Obtener los precios existentes para este tipo de residuo
        const preciosExistentes = await precioAPI.obtenerPorTipoResiduo(tipoResiduoData.id);

        // Crear un nuevo precio con la fecha de alta
        const precioData = {
          tipoResiduo: tipoResiduoData,
          fechaInicio: fechaAlta,
          fechaFin: null,
          // Mantener el mismo valor que el precio existente o usar 0.15 si no hay precios
          valor: preciosExistentes.length > 0 ? preciosExistentes[0].valor : 0.15
        };

        console.log('Registrando precio con fecha de alta:', precioData);
        
        // Convertir explícitamente a JSON
        const jsonPrecio = JSON.stringify(precioData);
        console.log('JSON a enviar (precio):', jsonPrecio);
        
        await fetchWithTimeout(`${API_BASE_URL}/precios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonPrecio,
        });

        console.log('Precio con fecha de alta registrado correctamente');
        
        console.log('Registro completo exitoso');
        
        return true;
      } catch (error) {
        console.error('Error en el proceso de registro:', error);
        throw new Error(`Error en el registro: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error global al enviar el formulario:', error);
      throw new Error(`Error en el registro: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
};