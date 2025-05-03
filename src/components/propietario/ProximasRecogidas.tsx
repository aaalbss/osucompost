'use client';
import React, { useEffect, useState } from 'react';
import { ExtendedRecogida } from '@/types/extendedTypes';
import { CalendarDays, Clock, MapPin, AlertTriangle, ChevronDown, Check, Repeat, Home } from 'lucide-react';
import './dashboard-styles.css';

// Define tipo para el contenedor
interface Contenedor {
  id: number;
  capacidad: number;
  frecuencia: string;
  tipoResiduo: {
    id: number;
    descripcion: string;
  };
  puntoRecogida: {
    id: number;
    localidad: string;
    cp: number;
    provincia: string;
    direccion: string;
    horario: string;
    tipo: string;
    propietario: {
      dni: string;
      nombre: string;
      telefono: number;
      email: string;
    }
  }
}

// Define tipo para punto de recogida
interface PuntoRecogida {
  id: number;
  localidad: string;
  cp: number;
  provincia: string;
  direccion: string;
  horario: string;
  tipo: string;
  propietario: {
    dni: string;
    nombre: string;
    telefono: number;
    email: string;
  }
}

// Define props interface
interface ProximasRecogidasProps {
  recogidas: ExtendedRecogida[];
  frecuenciaSeleccionada?: string | null; // La frecuencia seleccionada por el usuario desde el dropdown
  contenedorUsuarioId?: number | string; // El ID del contenedor del usuario (puede venir como string o número)
}

const ProximasRecogidas: React.FC<ProximasRecogidasProps> = ({ 
  recogidas, 
  frecuenciaSeleccionada,
  contenedorUsuarioId
}) => {
  const [ahora] = useState<Date>(new Date());
  const [cargando, setCargando] = useState<boolean>(true);
  const [contenedores, setContenedores] = useState<Contenedor[]>([]);
  const [contenedoresPropietario, setContenedoresPropietario] = useState<Contenedor[]>([]);
  const [puntosRecogida, setPuntosRecogida] = useState<PuntoRecogida[]>([]);
  const [puntoSeleccionadoId, setPuntoSeleccionadoId] = useState<number | null>(null);
  const [mostrarDropdown, setMostrarDropdown] = useState<boolean>(false);
  const [recogidasPorContenedor, setRecogidasPorContenedor] = useState<{[key: number]: ExtendedRecogida[]}>({});
  const [error, setError] = useState<string | null>(null);
  const [dniPropietarioSesion, setDniPropietarioSesion] = useState<string | null>(null);
  const [recogidasDB, setRecogidasDB] = useState<ExtendedRecogida[]>([]);

  // Convertir el ID del contenedor a número para comparaciones
  const contenedorIdNumerico = contenedorUsuarioId ? Number(contenedorUsuarioId) : undefined;

  // Obtener el DNI del propietario con sesión iniciada
  useEffect(() => {
    try {
      const userDni = localStorage.getItem('userDni');
      if (userDni) {
        setDniPropietarioSesion(userDni);
      }
    } catch (error) {
      // Error silencioso
    }
  }, []);

  // Obtener las recogidas de la base de datos
  useEffect(() => {
    const obtenerRecogidas = async () => {
      try {
        setCargando(true);
        
        // Evitar caché añadiendo un timestamp a la URL
        const timestamp = new Date().getTime();
        const respuesta = await fetch(`/api/recogidas?t=${timestamp}`);
        
        // Obtener solo la fecha (sin hora) del día actual para comparar
        const fechaActual = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        
        if (respuesta.ok) {
          const datos = await respuesta.json();
          
          // Filtrar recogidas de hoy y futuras que no han sido completadas
          const recogidasPendientes = datos.filter((recogida: ExtendedRecogida) => {
            // Si ya fue recogida (tiene fecha real), no la mostramos
            if (recogida.fechaRecogidaReal) {
              return false;
            }
            
            // Convertir fecha estimada a objeto Date para comparar solo la fecha (sin hora)
            const fechaEstimada = new Date(recogida.fechaRecogidaEstimada);
            const soloFechaEstimada = new Date(
              fechaEstimada.getFullYear(), 
              fechaEstimada.getMonth(), 
              fechaEstimada.getDate()
            );
            
            // Incluir solo si es de hoy o del futuro
            return soloFechaEstimada >= fechaActual;
          });
          
          // Ordenar por fecha de recogida estimada (más cercanas primero)
          const recogidasOrdenadas = recogidasPendientes.sort(
            (a: ExtendedRecogida, b: ExtendedRecogida) => 
              new Date(a.fechaRecogidaEstimada).getTime() - new Date(b.fechaRecogidaEstimada).getTime()
          );
          
          setRecogidasDB(recogidasOrdenadas);
        } else {
          setError('Error al obtener las recogidas');
        }
      } catch (error) {
        setError('Error de conexión al obtener recogidas');
      }
    };

    obtenerRecogidas();
  }, []);

  // Obtener los contenedores desde la API
  useEffect(() => {
    if (!dniPropietarioSesion && !contenedorIdNumerico) {
      // Si no tenemos DNI ni contenedor, esperar a que se cargue el DNI
      return;
    }
    
    const obtenerContenedores = async () => {
      try {
        // Evitar caché añadiendo un timestamp a la URL
        const timestamp = new Date().getTime();
        const respuesta = await fetch(`/api/contenedores?t=${timestamp}`);
        
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setContenedores(datos);
          
          // Determinar el DNI a utilizar
          const dniAUtilizar = dniPropietarioSesion || (() => {
            // Si no tenemos DNI de sesión pero sí ID de contenedor, buscar el propietario
            if (contenedorIdNumerico) {
              const contenedorSeleccionado = datos.find(
                (cont: Contenedor) => cont.id === contenedorIdNumerico
              );
              return contenedorSeleccionado?.puntoRecogida?.propietario?.dni || null;
            }
            return null;
          })();
          
          // Filtrar los contenedores del propietario
          if (dniAUtilizar) {
            const contenedoresFiltrados = datos.filter(
              (cont: Contenedor) => cont.puntoRecogida?.propietario?.dni === dniAUtilizar
            );
            setContenedoresPropietario(contenedoresFiltrados);
            
            // Extraer puntos de recogida únicos
            const puntosUnicos: PuntoRecogida[] = [];
            const puntosIds = new Set();
            
            contenedoresFiltrados.forEach((cont: Contenedor) => {
              if (cont.puntoRecogida && cont.puntoRecogida.id && !puntosIds.has(cont.puntoRecogida.id)) {
                puntosIds.add(cont.puntoRecogida.id);
                puntosUnicos.push(cont.puntoRecogida);
              }
            });
            
            setPuntosRecogida(puntosUnicos);
            
            // Si solo hay un punto de recogida, seleccionarlo automáticamente
            if (puntosUnicos.length === 1) {
              setPuntoSeleccionadoId(puntosUnicos[0].id);
            }
          } else {
            setError('No se pudo identificar al propietario');
          }
        } else {
          setError('Error al obtener los contenedores');
        }
      } catch (error) {
        setError('Error de conexión');
      } finally {
        setCargando(false);
      }
    };

    obtenerContenedores();
  }, [contenedorIdNumerico, dniPropietarioSesion]);

  // Procesar las recogidas y agruparlas por punto de recogida y contenedor
  useEffect(() => {
    if (cargando || contenedoresPropietario.length === 0 || recogidasDB.length === 0) {
      if (!cargando) {
        setCargando(false);
      }
      return;
    }
    
    // Filtrar contenedores por punto de recogida si hay uno seleccionado
    let contenedoresAMostrar = contenedoresPropietario;
    if (puntoSeleccionadoId) {
      contenedoresAMostrar = contenedoresPropietario.filter(
        cont => cont.puntoRecogida && cont.puntoRecogida.id === puntoSeleccionadoId
      );
    }
    
    // Objeto para almacenar recogidas por cada contenedor
    const recogidasPorCont: {[key: number]: ExtendedRecogida[]} = {};
    
    // Procesar cada contenedor
    contenedoresAMostrar.forEach(contenedor => {
      // Filtrar recogidas para este contenedor
      const recogidasContenedor = recogidasDB.filter(recogida => {
        // Comprobar si la recogida tiene contenedor y es el actual
        if (recogida.contenedor && recogida.contenedor.id === contenedor.id) {
          return true;
        }
        
        // Comprobar alternativo: si la recogida tiene propietarioDni y coincide con el del punto
        if (recogida.propietarioDni && 
            contenedor.puntoRecogida && 
            contenedor.puntoRecogida.propietario && 
            recogida.propietarioDni === contenedor.puntoRecogida.propietario.dni) {
          return true;
        }
        
        return false;
      });
      
      if (recogidasContenedor.length > 0) {
        // Ordenar por fecha estimada (más cercanas primero)
        const recogidasOrdenadas = recogidasContenedor.sort(
          (a, b) => new Date(a.fechaRecogidaEstimada).getTime() - new Date(b.fechaRecogidaEstimada).getTime()
        );
        
        // Mostramos más recogidas (hasta 10) para asegurar que aparecen las nuevas
        recogidasPorCont[contenedor.id] = recogidasOrdenadas.slice(0, 10);
      }
    });
    
    setRecogidasPorContenedor(recogidasPorCont);
    setCargando(false);
  }, [recogidasDB, contenedoresPropietario, puntoSeleccionadoId, cargando]);

  // Formatear información de fecha
  const obtenerInfoFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    const dia = fecha.getDate();
    const mes = fecha.toLocaleString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();
    const diaSemana = fecha.toLocaleString('es-ES', { weekday: 'short' }).replace('.', '').toUpperCase();
    return { dia, mes, diaSemana };
  };

  // Obtener texto para el horario
  const obtenerHora = (recogida: ExtendedRecogida) => {
    const horario = recogida.horarioSeleccionado || recogida.contenedor?.puntoRecogida?.horario;
    
    if (horario === 'M') {
      return '10:00'; // Horario de mañana
    } else if (horario === 'T') {
      return '16:00'; // Horario de tarde
    } else if (horario === 'N') {
      return '22:00'; // Horario de noche
    } else {
      // Si no hay horario específico, usar la hora de la fecha estimada
      const fecha = new Date(recogida.fechaRecogidaEstimada);
      return fecha.toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Obtener texto para el horario en formato legible
  const obtenerTextoHorario = (horario: string | undefined) => {
    if (horario === 'M') return 'Mañana';
    if (horario === 'T') return 'Tarde';
    if (horario === 'N') return 'Noche';
    return 'No definido';
  };

  // Manejar la selección de un punto de recogida
  const seleccionarPunto = (id: number) => {
    setPuntoSeleccionadoId(id);
    setMostrarDropdown(false);
  };

  // Obtener el nombre del punto seleccionado
  const obtenerNombrePuntoSeleccionado = () => {
    if (!puntoSeleccionadoId) return "Todos los puntos";
    
    const puntoSeleccionado = puntosRecogida.find(p => p.id === puntoSeleccionadoId);
    if (!puntoSeleccionado) return "Punto no encontrado";
    
    return `${puntoSeleccionado.direccion}, ${puntoSeleccionado.localidad}`;
  };
  
  // Obtener color para frecuencia
  const obtenerColorFrecuencia = (frecuencia: string) => {
    switch (frecuencia) {
      case 'Diaria': return '#10b981'; // verde
      case '3 por semana': return '#0ea5e9'; // azul claro
      case '1 por semana': return '#6366f1'; // azul índigo
      case 'Quincenal': return '#8b5cf6'; // morado
      case 'Ocasional': return '#ec4899'; // rosa
      default: return '#64748b'; // gris oscuro
    }
  };

  // Verificar si hay algún contenedor con recogidas
  const hayRecogidas = Object.keys(recogidasPorContenedor).length > 0;
  
  // Contar los puntos de recogida únicos
  const numerosPuntosRecogida = puntosRecogida.length;

  return (
    <div className="overflow-hidden bg-white rounded-md shadow-sm dashboard-card animate-fadeIn" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-center justify-between p-4 bg-green-50">
        <div className="flex items-center gap-2">
          <CalendarDays size={24} className="text-green-600" />
          <h2 className="text-xl font-medium text-green-800">Próximas Recogidas</h2>
          {!cargando && (
            <div className="flex items-center gap-2 ml-2">
              <span className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                {numerosPuntosRecogida} punto{numerosPuntosRecogida !== 1 ? 's' : ''} de recogida
              </span>
              <span className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                {contenedoresPropietario.length} contenedor{contenedoresPropietario.length !== 1 ? 'es' : ''}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Selector de punto de recogida (solo si hay más de uno) */}
          {puntosRecogida.length > 1 && (
            <div className="relative">
              <button 
                onClick={() => setMostrarDropdown(!mostrarDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-green-700 bg-white border border-green-200 rounded-md shadow-sm hover:bg-green-50"
              >
                <Home size={16} />
                <span className="max-w-[150px] truncate">{obtenerNombrePuntoSeleccionado()}</span>
                <ChevronDown size={16} />
              </button>
              
              {mostrarDropdown && (
                <div className="absolute right-0 z-10 mt-1 overflow-hidden bg-white rounded-md shadow-lg w-60">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setPuntoSeleccionadoId(null);
                        setMostrarDropdown(false);
                      }}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-green-50"
                    >
                      <span>Todos los puntos</span>
                      {puntoSeleccionadoId === null && <Check size={16} className="text-green-600" />}
                    </button>
                    
                    {puntosRecogida.map(punto => (
                      <button
                        key={punto.id}
                        onClick={() => seleccionarPunto(punto.id)}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-green-50"
                      >
                        <span className="truncate">
                          {punto.direccion}, {punto.localidad}
                        </span>
                        {puntoSeleccionadoId === punto.id && <Check size={16} className="text-green-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-3">
        {cargando ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 mr-3 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
            <p className="text-green-600">Cargando recogidas...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangle size={48} className="mb-4 text-amber-500" />
            <p className="text-amber-700">{error}</p>
          </div>
        ) : !hayRecogidas ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Clock size={48} className="mb-4 text-green-300" />
            <p className="text-green-600">No hay recogidas programadas próximamente.</p>
            {contenedoresPropietario.length === 0 && dniPropietarioSesion && (
              <p className="mt-2 text-sm text-gray-500">No se encontraron contenedores asociados a su cuenta.</p>
            )}
            {contenedoresPropietario.length > 0 && (
              <p className="mt-2 text-sm text-gray-500">No se encontraron recogidas programadas.</p>
            )}
          </div>
        ) : (
          <div>
            {Object.entries(recogidasPorContenedor).map(([contenedorId, recogidasDeContenedor]) => {
              const contenedor = contenedoresPropietario.find(c => c.id === Number(contenedorId));
              if (!contenedor) return null;
              
              // Información del contenedor
              const tipoResiduo = contenedor.tipoResiduo?.descripcion || 'No especificado';
              const capacidad = contenedor.capacidad || 'N/A';
              const frecuencia = contenedor.frecuencia || 'No especificada';
              const colorFrecuencia = obtenerColorFrecuencia(frecuencia);
              const esOrganico = tipoResiduo.toLowerCase().includes('organico');
              const direccion = contenedor.puntoRecogida?.direccion || 'Dirección no disponible';
              const localidad = contenedor.puntoRecogida?.localidad || 'Localidad no disponible';
              
              return (
                <div key={`contenedor-${contenedorId}`} className="mb-6 last:mb-0">
                  {/* Barra superior del contenedor con información clave */}
                  <div className="flex items-center justify-between px-4 py-3 mb-4 rounded-md shadow-sm bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-3 h-3 mr-2 rounded-full" style={{backgroundColor: esOrganico ? '#10b981' : '#3b82f6'}}></div>
                      <span className="mr-2 font-medium">{tipoResiduo}</span>
                      <span className="text-sm text-gray-600">{capacidad} litros</span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      ID Contenedor: {contenedorId}
                    </div>
                  </div>
                  
                  {/* Destacar frecuencia y ubicación */}
                  <div className="flex flex-col items-start justify-between gap-2 px-2 mb-4 md:flex-row md:items-center">
                    {/* Frecuencia destacada */}
                    <div 
                      className="flex items-center px-3 py-2 text-white rounded-md" 
                      style={{backgroundColor: colorFrecuencia}}
                    >
                      <Repeat size={16} className="mr-2" />
                      <span className="font-medium">{frecuencia}</span>
                    </div>
                    
                    {/* Ubicación destacada */}
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-gray-700" />
                      <span className="font-medium">{direccion}, {localidad}</span>
                    </div>
                  </div>
                  
                  {/* Listado de recogidas para este contenedor */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                    {recogidasDeContenedor.map((recogida, index) => {
                      const { dia, mes, diaSemana } = obtenerInfoFecha(recogida.fechaRecogidaEstimada);
                      const textoHorario = obtenerTextoHorario(recogida.horarioSeleccionado || recogida.contenedor?.puntoRecogida?.horario);
                      
                      return (
                        <div 
                          key={`recogida-${recogida.id}-${index}`} 
                          className="overflow-hidden bg-white border rounded-md shadow-sm animate-fadeIn"
                          style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                        >
                          {/* Cabecera con fecha */}
                          <div 
                            className="p-3 text-center text-white" 
                            style={{ backgroundColor: colorFrecuencia }}
                          >
                            <div className="text-xs font-medium">{mes}</div>
                            <div className="text-2xl font-bold leading-none">{dia}</div>
                            <div className="text-xs">{diaSemana}</div>
                          </div>
                          
                          {/* Horario */}
                          <div className="p-2 text-sm text-center bg-gray-50">
                            <div className="flex items-center justify-center">
                              <Clock size={14} className="mr-1" />
                              <span>{textoHorario}</span>
                            </div>
                          </div>
                          
                          {/* Contenido si hay incidencias */}
                          {recogida.incidencias && (
                            <div className="p-2 border-t">
                              <div className="flex items-start gap-2 p-1.5 rounded bg-amber-50 text-xs">
                                <AlertTriangle size={12} className="text-amber-500 mt-0.5" />
                                <span className="text-amber-800">
                                  {recogida.incidencias}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Mostrar ID para depuración */}
                          <div className="p-2 text-xs text-center text-gray-400 border-t">
                            <span>ID Recogida: {recogida.id || 'N/A'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Línea separadora entre contenedores */}
                  {Object.keys(recogidasPorContenedor).length > 1 && (
                    <div className="my-6 border-b"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProximasRecogidas;