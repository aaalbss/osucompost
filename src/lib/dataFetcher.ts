'use client';

import { Propietario, PuntoRecogida, Facturacion, Precio } from '@/types/types';
import { ExtendedRecogida } from '@/types/extendedTypes';
import { propietarioAPI, puntosRecogidaAPI, facturacionAPI } from '@/services/api';

// Interfaz que refleja la estructura real de la respuesta de la API
interface RecogidaResponse {
  id: number;
  fechaSolicitud: string;
  fechaRecogidaEstimada: string;
  fechaRecogidaReal: string | null;
  incidencias: string | null;
  contenedor: {
    id: number;
    capacidad: number;
    tipoResiduo: {
      id: number;
      descripcion: string;
    };
    puntoRecogida: PuntoRecogida;
  } | number; // Puede ser un objeto o un ID como número
}

interface PropietarioData {
  propietario: Propietario;
  puntosRecogida: PuntoRecogida[];
  facturaciones: Facturacion[];
  recogidas: ExtendedRecogida[];
  fechaAlta: string;
}

// Interfaz para el contenedor de la API
interface ContenedorData {
  id: number;
  capacidad: number;
  tipoResiduo: {
    id: number;
    descripcion: string;
  };
  puntoRecogida: PuntoRecogida;
}

// Función auxiliar para hacer fetch con verificación de respuesta
const fetchWithTimeout = async (url: string, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Error al obtener datos de ${url}: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`Error al obtener ${url}:`, error);
    throw error;
  }
};

// Versión simplificada para cargar datos básicos primero
export const fetchPropietarioBasicData = async (userDni: string | undefined): Promise<Propietario> => {
  if (!userDni) {
    throw new Error('DNI no válido');
  }
  
  try {
    console.log('Obteniendo datos básicos del propietario para DNI:', userDni);
    const propietario = await propietarioAPI.obtenerPropietario(userDni);
    
    if (!propietario || !propietario.dni) {
      throw new Error('No se pudo obtener información válida del propietario');
    }
    
    return propietario;
  } catch (error) {
    console.error('Error al cargar datos básicos del propietario:', error);
    throw error;
  }
};

// Función principal modificada para evitar problemas de carga
export const fetchPropietarioData = async (userDni: string | undefined): Promise<PropietarioData> => {
  if (!userDni) {
    throw new Error('DNI no válido');
  }
  
  console.log('Iniciando fetchPropietarioData para DNI:', userDni);
  const datosBasicos: PropietarioData = {
    propietario: { dni: userDni, nombre: '', apellidos: '', email: '', telefono: '' },
    puntosRecogida: [],
    facturaciones: [],
    recogidas: [],
    fechaAlta: ''
  };

  try {
    // Paso 1: Obtener datos del propietario (primero y por separado)
    console.log('Paso 1: Obteniendo datos del propietario');
    const propData = await propietarioAPI.obtenerPropietario(userDni);
    datosBasicos.propietario = propData;
    
    if (!propData || !propData.dni) {
      throw new Error('No se pudo obtener información válida del propietario');
    }

    // Paso 2: Obtener puntos de recogida por separado
    console.log('Paso 2: Obteniendo puntos de recogida');
    try {
      const allPuntosData = await puntosRecogidaAPI.obtenerTodos();
      const dniFiltrado = userDni.trim().toUpperCase();
      
      // Filtrar puntos de recogida por DNI
      const puntosFiltrados = allPuntosData.filter((punto) => 
        punto.propietario?.dni?.trim().toUpperCase() === dniFiltrado
      );
      
      datosBasicos.puntosRecogida = puntosFiltrados;
    } catch (error) {
      console.error('Error al obtener puntos de recogida:', error);
      // Continuamos con el resto de datos aunque esta parte falle
    }

    // Paso 3: Obtener facturaciones
    console.log('Paso 3: Obteniendo facturaciones');
    try {
      const allFactData = await facturacionAPI.obtenerTodas();
      const dniFiltrado = userDni.trim().toUpperCase();
      
      // Filtrar facturaciones por DNI
      const facturasFiltradas = allFactData.filter((factura) => 
        factura.propietario?.dni?.trim().toUpperCase() === dniFiltrado
      );
      
      datosBasicos.facturaciones = facturasFiltradas;
    } catch (error) {
      console.error('Error al obtener facturaciones:', error);
      // Continuamos aunque esta parte falle
    }

    // Paso 4: Obtener datos adicionales en paralelo
    console.log('Paso 4: Obteniendo datos adicionales');
    try {
      const [preciosData, contenedoresData, recogidasDataResponse] = await Promise.all([
        fetchWithTimeout('/api/precios'),
        fetchWithTimeout('/api/contenedores'),
        fetchWithTimeout('/api/recogidas')
      ]);

      // Procesar las recogidas si tenemos los datos necesarios
      if (recogidasDataResponse && contenedoresData && datosBasicos.puntosRecogida.length > 0) {
        console.log('Procesando datos de recogidas');
        
        const extendedRecogidas: ExtendedRecogida[] = [];
        const recogidasData = recogidasDataResponse as RecogidaResponse[];
        const dniFiltrado = userDni.trim().toUpperCase();
        
        for (const recogida of recogidasData) {
          try {
            // Verificar si la recogida tiene un contenedor anidado
            if (recogida.contenedor && typeof recogida.contenedor !== 'number') {
              extendedRecogidas.push({
                id: recogida.id,
                fechaSolicitud: recogida.fechaSolicitud,
                fechaRecogidaEstimada: recogida.fechaRecogidaEstimada,
                fechaRecogidaReal: recogida.fechaRecogidaReal,
                incidencias: recogida.incidencias,
                contenedor: {
                  id: recogida.contenedor.id,
                  capacidad: recogida.contenedor.capacidad,
                  tipoResiduo: recogida.contenedor.tipoResiduo,
                  puntoRecogida: recogida.contenedor.puntoRecogida
                }
              });
            } else if (typeof recogida.contenedor === 'number') {
              // Si en cambio tiene un idContenedor como número
              const contenedor = (contenedoresData as ContenedorData[]).find((c: ContenedorData) => c.id === recogida.contenedor);
              
              if (contenedor) {
                extendedRecogidas.push({
                  id: recogida.id,
                  fechaSolicitud: recogida.fechaSolicitud,
                  fechaRecogidaEstimada: recogida.fechaRecogidaEstimada,
                  fechaRecogidaReal: recogida.fechaRecogidaReal,
                  incidencias: recogida.incidencias,
                  contenedor: {
                    id: contenedor.id,
                    capacidad: contenedor.capacidad,
                    tipoResiduo: contenedor.tipoResiduo,
                    puntoRecogida: contenedor.puntoRecogida
                  }
                });
              }
            }
          } catch (recogidaError) {
            console.error('Error procesando recogida:', recogidaError);
            // Continuamos con la siguiente recogida
          }
        }
        
        // Filtrar recogidas por los puntos de recogida del propietario o por DNI
        const recogidasFiltradas = extendedRecogidas.filter(recogida => {
          try {
            // Verificar que tenemos los datos necesarios
            if (!recogida.contenedor || !recogida.contenedor.puntoRecogida) {
              return false;
            }
            
            const puntoRecogidaId = recogida.contenedor.puntoRecogida.id;
            const propietarioDni = recogida.contenedor.puntoRecogida.propietario?.dni?.trim().toUpperCase();
            
            // Verificar coincidencia por punto de recogida o por DNI
            const coincidePorPunto = datosBasicos.puntosRecogida.some(punto => punto.id === puntoRecogidaId);
            const coincidePorDni = propietarioDni === dniFiltrado;
            
            return coincidePorPunto || coincidePorDni;
          } catch (error) {
            console.error('Error filtrando recogida:', error);
            return false;
          }
        });
        
        datosBasicos.recogidas = recogidasFiltradas;
        
        // Calcular fecha de alta si tenemos los datos necesarios
        if (preciosData) {
          try {
            // Obtener contenedores del propietario
            const contenedoresDelPropietario = (contenedoresData as ContenedorData[]).filter((contenedor: ContenedorData) => 
              datosBasicos.puntosRecogida.some(punto => punto.id === contenedor.puntoRecogida?.id)
            );

            // Obtener todos los tipos de residuos únicos del propietario
            const tiposResiduosPropietario = contenedoresDelPropietario.map(cont => cont.tipoResiduo.id);

            // Encontrar la fecha más reciente para los tipos de residuos del propietario
            let fechaRegistro: Date | null = null;
            
            // Para cada tipo de residuo del propietario
            for (const tipoResiduo of tiposResiduosPropietario) {
              // Filtrar precios por tipo de residuo y ordenar por fecha de más reciente a más antigua
              const preciosDelTipo = (preciosData as Precio[])
                .filter((precio: Precio) => precio.tipoResiduo && precio.tipoResiduo.id === tipoResiduo)
                .sort((a: Precio, b: Precio) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());
              
              // Si encontramos precios para este tipo de residuo
              if (preciosDelTipo.length > 0) {
                const fechaInicio = new Date(preciosDelTipo[0].fechaInicio);
                
                // Si aún no tenemos fecha de registro o esta fecha es más reciente
                if (!fechaRegistro || fechaInicio > fechaRegistro) {
                  fechaRegistro = fechaInicio;
                }
              }
            }

            if (fechaRegistro) {
              datosBasicos.fechaAlta = fechaRegistro.toISOString();
            }
          } catch (error) {
            console.error('Error calculando fecha de alta:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error al obtener datos adicionales:', error);
      // Continuamos con los datos básicos aunque esta parte falle
    }

    console.log('Datos del propietario cargados exitosamente');
    return datosBasicos;
  } catch (error) {
    console.error('Error global al cargar los datos:', error);
    throw error;
  }
};