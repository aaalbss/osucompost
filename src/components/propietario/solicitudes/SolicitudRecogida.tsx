'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  Check, 
  AlertCircle, 
  X, 
  User, 
  Trash2, 
  Clock, 
  Calendar,
  Package
} from 'lucide-react';

// URL de la API
const API_URL = '/api';

// Interfaces para tipos de datos
interface Contenedor {
  id: number;
  capacidad: number;
  tipoResiduo?: {
    id: number;
    descripcion: string;
  };
  puntoRecogida?: {
    id?: number;
    localidad?: string;
    cp?: number;
    provincia?: string;
    direccion?: string;
    horario?: string;
    tipo?: string;
    propietario?: {
      dni: string;
      nombre?: string;
      telefono?: number;
      email?: string;
    };
  };
}

interface Propietario {
  dni: string;
  nombre: string;
  telefono: number;
  email: string;
  tipoResiduo?: string; // Valor del mapeo de tipo de residuo
  tipoContenedor?: string; // Valor del mapeo de tipo de contenedor
  horario?: string; // Valor del mapeo de horario
}

interface PuntoRecogida {
  id: number;
  localidad: string;
  cp: number;
  provincia: string;
  direccion: string;
  horario: string;
  tipo: string;
  propietario: Propietario;
}

interface ErrorResponse extends Error {
  message: string;
}

// Mapeo de etiquetas para mejor legibilidad
const LABELS = {
  tipoResiduo: {
    'domesticos': 'Domésticos',
    'supermercados': 'Supermercados', 
    'fruterias': 'Fruterías',
    'comedores': 'Comedores',
    'horeca': 'Sector HORECA',
    'poda': 'Restos de poda',
    'agricolas': 'Restos agrícolas'
  },
  tipoContenedor: {
    'cubo16': 'Cubo 16 L',
    'cubo160': 'Cubo 160 L',
    'contenedor800': 'Contenedor 800 L',
    'contenedor1200': 'Contenedor 1200 L'
  },
  horario: {
    'manana': 'Mañana (9:00 a 13:00)',
    'tarde': 'Tarde (17:00 a 20:00)',
    'noche': 'Noche (a partir de las 23:00)'
  }
};

// Mapeo inverso de horarios API a fronted
const HORARIO_MAPPING: Record<string, string> = {
  'M': 'manana',  // M -> mañana
  'T': 'tarde',   // T -> tarde
  'N': 'noche'    // N -> noche
};

// Mapeo inverso de tipos de residuo API a frontend
const TIPO_RESIDUO_MAPPING: Record<string, string> = {
  'Organico': 'domesticos',
  'Supermercado': 'supermercados',
  'Fruteria': 'fruterias',
  'Comedor': 'comedores',
  'HORECA': 'horeca',
  'Poda': 'poda',
  'Agricola': 'agricolas'
};

// Mapeo de tipos de contenedor a capacidades
const CAPACIDAD_MAP: Record<string, number> = {
  'cubo16': 16,
  'cubo160': 160,
  'contenedor800': 800,
  'contenedor1200': 1200
};

// Mapeo inverso de capacidad a tipo de contenedor
const CAPACIDAD_TO_TIPO: Record<number, string> = {
  16: 'cubo16',
  160: 'cubo160',
  800: 'contenedor800',
  1200: 'contenedor1200'
};

// Mapeo de tipos de residuos a IDs
const RESIDUO_ID_MAP: Record<string, number> = {
  'domesticos': 1,
  'supermercados': 2,
  'fruterias': 3,
  'comedores': 4,
  'horeca': 5,
  'poda': 6,
  'agricolas': 7
};

// Mapeo inverso de ID a tipo de residuo
const RESIDUO_ID_TO_TIPO: Record<number, string> = {
  1: 'domesticos',
  2: 'supermercados',
  3: 'fruterias',
  4: 'comedores',
  5: 'horeca',
  6: 'poda',
  7: 'agricolas'
};

// Componente de Modal de Confirmación
const ConfirmationModal: React.FC<{
  originalValue: string;
  newValue: string;
  labelKey: keyof typeof LABELS;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ originalValue, newValue, labelKey, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Confirmar Cambio</h2>
          <button 
            onClick={onCancel} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="mb-4 text-gray-600">
          Está cambiando su selección de {labelKey} de{' '}
          <span className="font-semibold">{LABELS[labelKey][originalValue as keyof typeof LABELS[typeof labelKey]]}</span>{' '}
          a{' '}
          <span className="font-semibold">{LABELS[labelKey][newValue as keyof typeof LABELS[typeof labelKey]]}</span>.
        </p>
        
        <p className="mb-4 text-sm text-gray-500">
          Este cambio afectará solo a esta solicitud de recogida puntual.
          ¿Está seguro de que desea continuar?
        </p>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Confirmar Cambio
          </button>
        </div>
      </div>
    </div>
  );
};

interface SolicitudRecogidaProps {
  propietarioDni?: string;
  onSuccess?: () => void;  // Nueva prop para manejar éxito
  onClose?: () => void;    // Nueva prop para manejar cierre
}

const SolicitudRecogida: React.FC<SolicitudRecogidaProps> = ({ propietarioDni, onClose }) => {
  const router = useRouter();
  const [tipoResiduo, setTipoResiduo] = useState('');
  const [tipoContenedor, setTipoContenedor] = useState('');
  const [horario, setHorario] = useState('');
  const [fechaRecogida, setFechaRecogida] = useState(new Date());
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [contenedores, setContenedores] = useState<Contenedor[]>([]);
  const [contenedoresUsuario, setContenedoresUsuario] = useState<Contenedor[]>([]);
  const [selectedContainerId, setSelectedContainerId] = useState<number | null>(null);
  const [isNewContainer, setIsNewContainer] = useState(false);
  
  // Estado para almacenar datos completos del propietario
  const [propietarioData, setPropietarioData] = useState<Propietario | null>(null);
  const [puntosRecogida, setPuntosRecogida] = useState<PuntoRecogida[]>([]);
  
  // Estados para el modal de confirmación
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [campoConfirmacion, setCampoConfirmacion] = useState<keyof typeof LABELS | null>(null);
  const [valorOriginal, setValorOriginal] = useState('');
  const [valorNuevo, setValorNuevo] = useState('');

  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = 3; // Ahora tenemos 5 pasos en lugar de 4
  
  // Valores originales del propietario
  const [valoresOriginales, setValoresOriginales] = useState({
    tipoResiduo: '',
    tipoContenedor: '',
    horario: ''
  });
  
  // Estado para el DNI
  const [dni, setDni] = useState<string>('');
  const [dniUsuario, setDniUsuario] = useState<string | null>(null);
  const [dniError, setDniError] = useState<string>('');
  
  const handleNextStep = () => {
    if (activeStep === 1) {
      // Verificar DNI antes de avanzar al siguiente paso
      if (!verificarDNI()) {
        return; // Si el DNI no es válido, detener aquí y no avanzar
      }
      
      // Cargar los contenedores del usuario
      cargarContenedoresUsuario(dni);
    }
    
    if (activeStep === 2) {
      // Verificar que se ha seleccionado un contenedor o la opción de crear uno nuevo
      if (!selectedContainerId && !isNewContainer) {
        setError('Por favor, seleccione un contenedor existente o cree uno nuevo');
        return;
      }
      
      // Si se seleccionó un contenedor existente, configurar valores según ese contenedor
      if (selectedContainerId && !isNewContainer) {
        const contenedor = contenedoresUsuario.find(c => c.id === selectedContainerId);
        if (contenedor) {
          // Establecer valores basados en el contenedor seleccionado
          if (contenedor.tipoResiduo?.id) {
            const residuoTipo = RESIDUO_ID_TO_TIPO[contenedor.tipoResiduo.id];
            setTipoResiduo(residuoTipo || '');
          }
          
          if (contenedor.capacidad) {
            const tipoContenedorValue = CAPACIDAD_TO_TIPO[contenedor.capacidad];
            setTipoContenedor(tipoContenedorValue || '');
          }
          
          if (contenedor.puntoRecogida?.horario) {
            const horarioValue = HORARIO_MAPPING[contenedor.puntoRecogida.horario];
            setHorario(horarioValue || '');
          }
        }
      }
      
      // Si se seleccionó crear nuevo contenedor, los valores se ingresarán en los siguientes pasos
    }
    
    if (activeStep < totalSteps) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose(); // Si hay un manejador de cierre proporcionado, úsalo
    } else {
      // Si no hay un manejador, redirigir a la zona de usuario
      router.push('/propietario');
    }
  };

  // Cargar contenedores disponibles al iniciar
  useEffect(() => {
    const cargarContenedores = async () => {
      try {
        const response = await fetch(`${API_URL}/contenedores`);
        if (response.ok) {
          const data = await response.json();
          setContenedores(Array.isArray(data) ? data : [data]);
        }
      } catch (err) {
        console.error('Error al cargar contenedores:', err);
      }
    };
    
    cargarContenedores();
  }, []);
  
  // Cargar puntos de recogida al iniciar
  useEffect(() => {
    const cargarPuntosRecogida = async () => {
      try {
        const response = await fetch(`${API_URL}/puntos-recogida`);
        if (response.ok) {
          const data = await response.json();
          setPuntosRecogida(Array.isArray(data) ? data : [data]);
        }
      } catch (err) {
        console.error('Error al cargar puntos de recogida:', err);
      }
    };
    
    cargarPuntosRecogida();
  }, []);
  
  useEffect(() => {
    // Si se proporciona el DNI como prop, úsalo
    if (propietarioDni) {
      setDniUsuario(propietarioDni);
      setDni(propietarioDni);
      
      // Cargar valores originales del propietario
      const cargarValoresOriginales = async () => {
        try {
          if (!puntosRecogida.length || !contenedores.length) {
            console.log('Esperando a que los datos estén disponibles...');
            return;
          }
          // Buscar el punto de recogida asociado al propietario con este DNI
          const puntoRecogidaDelPropietario = puntosRecogida.find(
            punto => punto && punto.propietario && punto.propietario.dni === propietarioDni
          );
          
          if (puntoRecogidaDelPropietario) {
            // Si encuentra el punto de recogida, extraer info del propietario
            const propietario = puntoRecogidaDelPropietario.propietario;
            
            // Buscar contenedor del propietario para obtener tipo y capacidad
            const contenedorDelPropietario = contenedores.find(
              c => c && c.puntoRecogida && c.puntoRecogida.propietario && c.puntoRecogida.propietario.dni === propietarioDni
            );

            if (contenedorDelPropietario) {
              // Convertir horario de API a formato frontend
              const horarioFrontend = puntoRecogidaDelPropietario.horario
              ? HORARIO_MAPPING[puntoRecogidaDelPropietario.horario] || ''
              : '';

              // Convertir tipo residuo de API a formato frontend
              const tipoResiduoFrontend = contenedorDelPropietario.tipoResiduo?.descripcion 
                ? TIPO_RESIDUO_MAPPING[contenedorDelPropietario.tipoResiduo.descripcion] || ''
                : '';
              
              // Convertir capacidad a tipo contenedor
             const tipoContenedorFrontend = 
              contenedorDelPropietario.capacidad !== undefined
                ? CAPACIDAD_TO_TIPO[contenedorDelPropietario.capacidad] || ''
                : '';

              // Guardar datos originales
              setValoresOriginales({
                tipoResiduo: tipoResiduoFrontend,
                tipoContenedor: tipoContenedorFrontend,
                horario: horarioFrontend
              });
              
              // Establecer valores iniciales en el formulario
              setTipoResiduo(tipoResiduoFrontend);
              setTipoContenedor(tipoContenedorFrontend);
              setHorario(horarioFrontend);
              
              // Guardar datos completos del propietario para actualizaciones
              setPropietarioData({
                ...propietario,
                tipoResiduo: tipoResiduoFrontend,
                tipoContenedor: tipoContenedorFrontend,
                horario: horarioFrontend
              });
              
              // Cargar los contenedores del usuario
              cargarContenedoresUsuario(propietarioDni);
            }
          }
        } catch (err) {
          console.error('Error al cargar valores originales:', err);
        }
      };
      
      if (puntosRecogida.length > 0 && contenedores.length > 0) {
        cargarValoresOriginales();
      }
    } else {
      // De lo contrario, intenta obtenerlo del sessionStorage
      // AÑADIR TRY-CATCH AQUÍ
      try {
        const userDni = sessionStorage.getItem('userDni');
        if (userDni) {
          setDniUsuario(userDni);
          setDni(userDni);
        }
      } catch (error) {
        console.error('Error al acceder a sessionStorage:', error);
      }
    }
  }, [propietarioDni, puntosRecogida, contenedores]);
  
  // Función para cargar los contenedores del usuario según su DNI
  const cargarContenedoresUsuario = async (dniPropietario: string) => {
    try {
      setCargando(true);
      setError('');
      
      // Filtrar los contenedores asociados al DNI del usuario
      const contenedoresFiltrados = contenedores.filter(c => 
        c.puntoRecogida?.propietario?.dni === dniPropietario
      );
      
      setContenedoresUsuario(contenedoresFiltrados);
      setCargando(false);
      
      // Si no hay contenedores, mostrar un mensaje
      if (contenedoresFiltrados.length === 0) {
        console.log('No se encontraron contenedores asociados a este DNI');
      }
    } catch (err) {
      console.error('Error al cargar contenedores del usuario:', err);
      setError('Error al cargar los contenedores asociados a su cuenta');
      setCargando(false);
    }
  };
  
  // Función para manejar cambios con confirmación
  const handleCambioConConfirmacion = (
    campo: keyof typeof LABELS, 
    nuevoValor: string
  ) => {
    // Si el valor es el mismo que ya está seleccionado, no hacer nada
    if ((campo === 'tipoResiduo' && tipoResiduo === nuevoValor) ||
        (campo === 'tipoContenedor' && tipoContenedor === nuevoValor) ||
        (campo === 'horario' && horario === nuevoValor)) {
      return;
    }
    
    // Mostrar modal de confirmación
    setMostrarModalConfirmacion(true);
    setCampoConfirmacion(campo);
    
    // Guardar el valor original correspondiente al campo
    if (campo === 'tipoResiduo') {
      setValorOriginal(tipoResiduo || valoresOriginales.tipoResiduo);
    } else if (campo === 'tipoContenedor') {
      setValorOriginal(tipoContenedor || valoresOriginales.tipoContenedor);
    } else if (campo === 'horario') {
      setValorOriginal(horario || valoresOriginales.horario);
    }
    
    setValorNuevo(nuevoValor);
  };
  
  // Función para validar el formato del DNI español
  const validarDNI = (dni: string): boolean => {
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    return dniRegex.test(dni);
  };
  
  // Función para validar si el DNI ingresado coincide con el de la sesión
  const verificarDNI = (): boolean => {
    if (!dni) {
      setDniError('Por favor, introduzca su DNI');
      return false;
    }
    
    if (!validarDNI(dni)) {
      setDniError('El formato del DNI no es válido (debe ser 8 números y 1 letra mayúscula)');
      return false;
    }
    
    if (dniUsuario && dni !== dniUsuario) {
      setDniError('El DNI no coincide con el usuario que ha iniciado sesión');
      return false;
    }
    
    setDniError('');
    return true;
  };
  
  // Función para manejar selección de contenedor
  const handleSeleccionContenedor = (contenedorId: number) => {
    setSelectedContainerId(contenedorId);
    setIsNewContainer(false);
    
    // Actualizar estados según el contenedor seleccionado
    const contenedor = contenedoresUsuario.find(c => c.id === contenedorId);
    if (contenedor) {
      // Se actualizarán los valores en handleNextStep
    }
  };
  
  // Función para manejar la opción de crear un nuevo contenedor
  const handleNuevoContenedor = () => {
    setSelectedContainerId(null);
    setIsNewContainer(true);
    
    // Resetear valores a vacío si se elige crear nuevo contenedor
    setTipoResiduo('');
    setTipoContenedor('');
    setHorario('');

    router.push('/propietario/nueva-recogida')
  };
  
  // Función de confirmación del modal
  const confirmarCambio = () => {
    if (!campoConfirmacion) return;
    
    // Aplicar el cambio según el campo
    switch (campoConfirmacion) {
      case 'tipoResiduo':
        setTipoResiduo(valorNuevo);
        break;
      case 'tipoContenedor':
        setTipoContenedor(valorNuevo);
        break;
      case 'horario':
        setHorario(valorNuevo);
        break;
    }
    
    // Actualizar también en propietarioData si existe
    if (propietarioData) {
      const propietarioActualizado = { ...propietarioData };
      switch (campoConfirmacion) {
        case 'tipoResiduo':
          propietarioActualizado.tipoResiduo = valorNuevo;
          break;
        case 'tipoContenedor':
          propietarioActualizado.tipoContenedor = valorNuevo;
          break;
        case 'horario':
          propietarioActualizado.horario = valorNuevo;
          break;
      }
      setPropietarioData(propietarioActualizado);
    }
    
    // Cerrar el modal
    setMostrarModalConfirmacion(false);
  };
  
  // Cancelar cambio en el modal
  const cancelarCambio = () => {
    setMostrarModalConfirmacion(false);
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  // Generar días para el calendario
  const generarDiasCalendario = () => {
    const year = fechaRecogida.getFullYear();
    const month = fechaRecogida.getMonth();
    
    // Primer día del mes
    const primerDia = new Date(year, month, 1);
    
    // Último día del mes
    const ultimoDia = new Date(year, month + 1, 0);
    
    const dias: Date[] = [];
    
    // Rellenar días del mes anterior para alinear el calendario
    const diasPrevios = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1;
    for (let i = 0; i < diasPrevios; i++) {
      const dia = new Date(year, month, -diasPrevios + i + 1);
      dias.push(dia);
    }
    
    // Días del mes actual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(year, month, dia));
    }
    
    // Rellenar días del mes siguiente para completar la cuadrícula
    const diasSiguientes = 42 - dias.length;
    for (let i = 1; i <= diasSiguientes; i++) {
      const dia = new Date(year, month + 1, i);
      dias.push(dia);
    }
    
    return dias;
  };
  // Modificar la función seleccionarFecha
  const seleccionarFecha = (fecha: Date) => {
    const hoy = new Date();
    // Eliminar la hora, minutos, segundos y milisegundos para comparación correcta
    hoy.setHours(0, 0, 0, 0);
    fecha.setHours(0, 0, 0, 0);

    const esDomingo = fecha.getDay() === 0;
    const esSabado = fecha.getDay() === 6;
    const esHoy = fecha.getTime() === hoy.getTime();
    const esAnteriorAHoy = fecha < hoy;

    if (!esDomingo && !esSabado && !esHoy && !esAnteriorAHoy) {
      setFechaRecogida(fecha);
      setMostrarCalendario(false);
    }
  };
  const getTipoResiduoDescripcion = (tipoId: number | undefined): string => {
    if (!tipoId) return 'No especificado';
    const tipoKey = RESIDUO_ID_TO_TIPO[tipoId];
    // Comprobación para asegurar que la clave existe en LABELS.tipoResiduo
    return tipoKey && tipoKey in LABELS.tipoResiduo 
      ? LABELS.tipoResiduo[tipoKey as keyof typeof LABELS.tipoResiduo] 
      : 'No especificado';
  };
  
  // Para getCapacidadDescripcion
  const getCapacidadDescripcion = (capacidad: number | undefined): string => {
    if (!capacidad) return 'No especificado';
    const capacidadKey = CAPACIDAD_TO_TIPO[capacidad];
    // Comprobación para asegurar que la clave existe en LABELS.tipoContenedor
    return capacidadKey && capacidadKey in LABELS.tipoContenedor
      ? LABELS.tipoContenedor[capacidadKey as keyof typeof LABELS.tipoContenedor]
      : `${capacidad} L`;
  };
  
  // Para getHorarioDescripcion
  const getHorarioDescripcion = (horario: string | undefined): string => {
    if (!horario) return 'No especificado';
    const horarioKey = HORARIO_MAPPING[horario];
    // Comprobación para asegurar que la clave existe en LABELS.horario
    return horarioKey && horarioKey in LABELS.horario
      ? LABELS.horario[horarioKey as keyof typeof LABELS.horario]
      : horario;
  };
  
  
  const handleSubmit = async () => {
    // Verificar el DNI primero
    if (!verificarDNI()) {
      return;
    }
    
    if (!tipoResiduo || !tipoContenedor || !horario || !fechaRecogida) {
      setError('Por favor, complete todos los campos del formulario');
      return;
    }
    
    setCargando(true);
    setError('');
    setExito(false);
    
    try {
      // Obtener la capacidad correcta según el tipo de contenedor seleccionado
      const selectedCapacity = CAPACIDAD_MAP[tipoContenedor];
      console.log('Tipo contenedor seleccionado:', tipoContenedor);
      console.log('Capacidad seleccionada (L):', selectedCapacity);
      
      // Buscar contenedores del propietario
      const contenedoresPropietario = contenedores.filter(c => 
        c.puntoRecogida?.propietario?.dni === dni
      );
      
      if (contenedoresPropietario.length === 0 && !isNewContainer) {
        setError('No se encontró ningún contenedor para su cuenta. Contacte con administración.');
        setCargando(false);
        return;
      }
      
      // Obtener el punto de recogida asociado al propietario
      const puntoRecogidaDelPropietario = puntosRecogida.find(p => 
        p && p.propietario && p.propietario.dni === dni
      );
  
      if (!puntoRecogidaDelPropietario) {
        setError('No se encontró el punto de recogida asociado a su cuenta. Contacte con administración.');
        setCargando(false);
        return;
      }
      
      // Convertir horario frontend a API
      const horarioApi = horario === 'manana' ? 'M' : horario === 'tarde' ? 'T' : 'N';
      
      // Variable para almacenar el punto de recogida a usar
      let puntoRecogidaRespuesta = puntoRecogidaDelPropietario;
  
      // Comprobar si el horario ha cambiado
      const horarioActualDelPunto = puntoRecogidaDelPropietario.horario;
  
      if (horarioApi !== horarioActualDelPunto) {
        // Si el horario ha cambiado, crear un nuevo punto de recogida
        const nuevoPuntoRecogida = {
          ...puntoRecogidaDelPropietario,
          id: 0, // El backend generará un nuevo ID
          horario: horarioApi,
          esPuntual: true, // Flag para indicar que es un punto de recogida temporal
          propietario: {
            dni: dni // Añadir el DNI del propietario
          }
        };
        
        // Crear nuevo punto de recogida
        const respuestaPuntoRecogida = await fetch(`${API_URL}/puntos-recogida`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(nuevoPuntoRecogida)
        });
        
        if (!respuestaPuntoRecogida.ok) {
          const errorText = await respuestaPuntoRecogida.text();
          console.error('Error al crear punto de recogida temporal:', errorText);
          throw new Error(`Error al crear el punto de recogida temporal: ${respuestaPuntoRecogida.status}`);
        }
        
        puntoRecogidaRespuesta = await respuestaPuntoRecogida.json();
        console.log('Punto de recogida temporal creado:', JSON.stringify(puntoRecogidaRespuesta));
      } else {
        console.log('Usando punto de recogida existente');
      }
      
      // Determinar si usar un contenedor existente o crear uno nuevo
      let contenedorSeleccionado: Contenedor | null = null;
      
      if (isNewContainer) {
        // Crear un nuevo contenedor temporal solo para esta recogida puntual
        const nuevoContenedor = {
          capacidad: selectedCapacity,
          tipoResiduo: {
            id: RESIDUO_ID_MAP[tipoResiduo]
          },
          puntoRecogida: {
            id: puntoRecogidaRespuesta.id,
            propietario: {
              dni: dni
            }
          }
        };
        
        console.log('Creando contenedor temporal para recogida puntual:', JSON.stringify(nuevoContenedor));
        
        const respuestaContenedor = await fetch(`${API_URL}/contenedores`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(nuevoContenedor)
        });
        
        if (!respuestaContenedor.ok) {
          const errorText = await respuestaContenedor.text();
          console.error('Error al crear contenedor temporal:', errorText);
          throw new Error(`Error al crear el contenedor temporal: ${respuestaContenedor.status}`);
        }
        
        // Obtener la respuesta del contenedor creado
        contenedorSeleccionado = await respuestaContenedor.json();
        console.log('Contenedor temporal creado según API:', JSON.stringify(contenedorSeleccionado));
      } else {
        // Usar el contenedor existente seleccionado
        contenedorSeleccionado = contenedoresUsuario.find(c => c.id === selectedContainerId) || null;
        
        if (!contenedorSeleccionado) {
          setError('No se pudo encontrar el contenedor seleccionado');
          setCargando(false);
          return;
        }
      }
      
      // Preparar la fecha para la recogida
      const fecha = new Date(fechaRecogida);
      if (horario === 'manana') {
        fecha.setHours(10, 0, 0, 0);
      } else if (horario === 'tarde') {
        fecha.setHours(18, 0, 0, 0);
      } else {
        fecha.setHours(23, 0, 0, 0);
      }

      // Asegurarse de que contenedorSeleccionado no es nulo
      if (!contenedorSeleccionado) {
        setError('Error: No se ha podido obtener información del contenedor');
        setCargando(false);
        return;
      }

      // Crear la recogida con el contenedor seleccionado o nuevo
      const nuevaRecogida = {
        fechaSolicitud: new Date().toISOString(),
        fechaRecogidaEstimada: fecha.toISOString(),
        fechaRecogidaReal: null,
        incidencias: null,
        contenedor: {
          id: contenedorSeleccionado.id,
          capacidad: contenedorSeleccionado.capacidad,
          tipoResiduo: contenedorSeleccionado.tipoResiduo
        },
        propietario: {
          dni: dni,
          nombre: propietarioData?.nombre,
          telefono: propietarioData?.telefono,
          email: propietarioData?.email
        },
        puntoRecogidaId: puntoRecogidaRespuesta.id,
        horarioSeleccionado: horarioApi,
        esPuntual: true
      };
      
      console.log('Enviando recogida:', JSON.stringify(nuevaRecogida));
      
      // Añadir un pequeño retardo para asegurar que la transacción anterior se completó
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Enviar la recogida
      const response = await fetch(`${API_URL}/recogidas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaRecogida)
      });
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Error en respuesta de API:', response.status, errorBody);
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }
      
      const recogidaCreada = await response.json();
      console.log('Recogida creada correctamente:', JSON.stringify(recogidaCreada));
      
      setExito(true);
      setDni('');
      
      setTimeout(() => {
        if (exito) {
          setMostrarFormulario(false);
        }
      }, 3000);
    } catch (err) {
      const error = err as ErrorResponse;
      console.error('Error completo:', error);
      setError(error.message || 'No se pudo procesar la solicitud de recogida. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setCargando(false);
    }
  }
    return (
      <div className="relative w-full max-w-lg mx-auto my-4 overflow-visible bg-white rounded-lg shadow-md">
        {/* Modal de confirmación condicional (se mantiene igual) */}
        {mostrarModalConfirmacion && campoConfirmacion && (
          <ConfirmationModal
            originalValue={valorOriginal}
            newValue={valorNuevo}
            labelKey={campoConfirmacion}
            onConfirm={confirmarCambio}
            onCancel={cancelarCambio}
          />
        )}
  
        {/* Header con barra de progreso */}
        <div className="p-4 border-b border-green-100 bg-green-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-green-800">Solicitud de Recogida Puntual</h2>
            <button 
              onClick={handleClose}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {/* Barra de progreso */}
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div 
                key={step} 
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  activeStep >= step 
                    ? 'bg-green-500' 
                    : 'bg-gray-200'
                }`} 
              />
            ))}
          </div>
        </div>
        
        {/* Contenido con pasos */}
        <div className="p-6">
          {/* Paso 1: DNI */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center mb-4 space-x-3">
                <User className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">Identifícate</h3>
              </div>
              
              <div className="space-y-2">
                <label className="block font-medium text-gray-700">DNI:</label>
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Introduzca su DNI (ej: 12345678A)"
                  maxLength={9}
                />
                {dniError && (
                  <p className="text-sm text-red-600">{dniError}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Paso 2: Selección de contenedor */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center mb-4 space-x-3">
                <Package className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">Selección de Contenedor</h3>
              </div>
              
              {cargando ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-8 h-8 mr-2 text-green-500 animate-spin" />
                  <span>Cargando contenedores...</span>
                </div>
              ) : contenedoresUsuario.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Seleccione uno de sus contenedores existentes o cree uno nuevo para esta recogida:
                  </p>
                  
                  {/* Lista de contenedores existentes */}
                  <div className="pr-2 space-y-2 overflow-y-auto max-h-60">
                    {contenedoresUsuario.map(contenedor => (
                      <label 
                        key={contenedor.id}
                        className={`
                          flex items-start p-3 border rounded-lg cursor-pointer
                          transition-all duration-200
                          ${selectedContainerId === contenedor.id && !isNewContainer
                            ? 'bg-green-50 border-green-500' 
                            : 'bg-white border-gray-200 hover:border-green-300'}
                        `}
                      >
                        <input
                          type="radio"
                          name="contenedor"
                          checked={selectedContainerId === contenedor.id && !isNewContainer}
                          onChange={() => handleSeleccionContenedor(contenedor.id)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">Ubicación:
                              {contenedor.puntoRecogida?.direccion}</span>
                            <span className="text-sm text-gray-600">{getCapacidadDescripcion(contenedor.capacidad)}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            <p>Tipo: {getTipoResiduoDescripcion(contenedor.tipoResiduo?.id)}</p>
                            {contenedor.puntoRecogida?.horario && (
                              <p>Horario: {getHorarioDescripcion(contenedor.puntoRecogida.horario)}</p>
                            )}
                            
                              <p className="truncate">ID del contenedor: {contenedor.id}</p>
                           
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  {/* Opción para crear un nuevo contenedor */}
                  <label 
                    className={`
                      flex items-center p-3 mt-4 border-2 border-dashed rounded-lg cursor-pointer
                      ${isNewContainer 
                        ? 'bg-green-50 border-green-500 text-green-800' 
                        : 'border-gray-300 hover:border-green-300 text-gray-700'}
                    `}
                  >
                    <input
                      type="radio"
                      name="contenedor"
                      checked={isNewContainer}
                      onChange={handleNuevoContenedor}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-medium">Crear un nuevo contenedor</span>
                      <p className="mt-1 text-sm">
                        Configurará las características en los siguientes pasos
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="p-4 text-center border border-yellow-200 rounded-lg bg-yellow-50">
                  <p className="text-yellow-800">
                    No se encontraron contenedores asociados a su cuenta. Se creará un nuevo contenedor.
                  </p>
                  <button
                    onClick={handleNuevoContenedor}
                    className="px-4 py-2 mt-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Continuar con nuevo contenedor
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Paso 3: Tipo de Residuos (solo se muestra si se eligió crear nuevo contenedor) */}
          {activeStep === 3 && isNewContainer && (
            <div className="space-y-4">
              <div className="flex items-center mb-4 space-x-3">
                <Trash2 className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">Tipo de Residuos</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'domesticos', label: 'Domésticos' },
                  { id: 'supermercados', label: 'Supermercados' },
                  { id: 'fruterias', label: 'Fruterías' },
                  { id: 'comedores', label: 'Comedores' },
                  { id: 'horeca', label: 'Sector HORECA' },
                  { id: 'poda', label: 'Restos de poda' },
                  { id: 'agricolas', label: 'Restos agrícolas' }
                ].map(option => (
                  <label 
                    key={option.id} 
                    className={`
                      flex items-center justify-between p-3 border rounded-lg cursor-pointer
                      transition-all duration-200
                      ${tipoResiduo === option.id 
                        ? 'bg-green-50 border-green-500 text-green-800' 
                        : 'bg-white border-gray-200 hover:border-green-300'}
                    `}
                  >
                    <span>{option.label}</span>
                    <input 
                      type="radio" 
                      name="tipoResiduo" 
                      value={option.id}
                      checked={tipoResiduo === option.id}
                      onChange={() => handleCambioConConfirmacion('tipoResiduo', option.id)}
                      className="hidden"
                    />
                    {tipoResiduo === option.id && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}
          
        
  
          {/* Paso 5: Horario y Fecha */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center mb-4 space-x-3">
                <Clock className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">Fecha y Horario</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Horario de Preferencia:</label>
                  <div className="space-y-2">
                    {[
                      { id: 'manana', label: 'Mañana (9:00 a 13:00)' },
                      { id: 'tarde', label: 'Tarde (17:00 a 20:00)' },
                      { id: 'noche', label: 'Noche (a partir de las 23:00)' }
                    ].map(option => (
                      <label 
                        key={option.id} 
                        className={`
                          flex items-center justify-between p-3 border rounded-lg cursor-pointer
                          transition-all duration-200
                          ${horario === option.id 
                            ? 'bg-green-50 border-green-500 text-green-800' 
                            : 'bg-white border-gray-200 hover:border-green-300'}
                        `}
                      >
                        <span>{option.label}</span>
                        <input 
                          type="radio" 
                          name="horario" 
                          value={option.id}
                          checked={horario === option.id}
                          onChange={() => handleCambioConConfirmacion('horario', option.id)}
                          className="hidden"
                        />
                        {horario === option.id && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block mb-2 font-medium text-gray-700">Fecha de Solicitud de Recogida:</label>
                  <button
                    type="button"
                    onClick={() => setMostrarCalendario(!mostrarCalendario)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
                    disabled={cargando}
                  >
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {fechaRecogida ? formatDate(fechaRecogida) : 'Seleccione una fecha'}
                    </div>
                  </button>
                  
                  {mostrarCalendario && (
                    <div className="absolute z-10 w-full p-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {/* Navegación de mes */}
                      <div className="flex items-center justify-between mb-4">
                        <button 
                          onClick={() => {
                            const nuevoMes = new Date(fechaRecogida);
                            nuevoMes.setMonth(nuevoMes.getMonth() - 1);
                            setFechaRecogida(nuevoMes);
                          }}
                          className="text-gray-600 hover:text-green-600"
                        >
                          {'<'}
                        </button>
                        <h3 className="text-lg font-semibold">
                          {fechaRecogida.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button 
                          onClick={() => {
                            const nuevoMes = new Date(fechaRecogida);
                            nuevoMes.setMonth(nuevoMes.getMonth() + 1);
                            setFechaRecogida(nuevoMes);
                          }}
                          className="text-gray-600 hover:text-green-600"
                        >
                          {'>'}
                        </button>
                      </div>
  
                      {/* Días de la semana */}
                      <div className="grid grid-cols-7 mb-2 text-xs font-medium text-center text-gray-500">
                        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(dia => (
                          <div key={dia}>{dia}</div>
                        ))}
                      </div>
  
                      {/* Días del mes */}
                      <div className="grid grid-cols-7 gap-1">
                        {generarDiasCalendario().map((dia, index) => {
                          const hoy = new Date();
                          const esDelMesActual = dia.getMonth() === fechaRecogida.getMonth();
                          const esDomingo = dia.getDay() === 0;
                          const esSabado = dia.getDay() === 6;
                          const esHoy = dia.getDate() === hoy.getDate() && 
                                      dia.getMonth() === hoy.getMonth() && 
                                      dia.getFullYear() === hoy.getFullYear();
                          
                          const deshabilitado = esDomingo || esSabado || esHoy;
                          
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                if (!deshabilitado && esDelMesActual) {
                                  seleccionarFecha(dia);
                                }
                              }}
                              disabled={deshabilitado || !esDelMesActual}
                              className={`
                                p-2 text-sm rounded-md 
                                ${!esDelMesActual ? 'text-gray-300' : ''}
                                ${deshabilitado ? 'text-gray-300 cursor-not-allowed' : ''}
                                ${dia.getDate() === fechaRecogida.getDate() && 
                                  dia.getMonth() === fechaRecogida.getMonth() ? 
                                  'bg-green-100 text-green-800 font-bold' : 'hover:bg-gray-100'} 
                                ${!deshabilitado && esDelMesActual 
                                  ? 'text-gray-700 cursor-pointer' 
                                  : ''}
                              `}
                            >
                              {dia.getDate()}
                            </button>
                          );
                        })}
                      </div>
  
                      <div className="mt-2 text-xs text-center text-gray-500">
                        No se permiten el día actual, sábados y domingos
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Navegación de pasos */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          {/* Botón Anterior */}
          {activeStep > 1 && (
            <button 
              onClick={handlePreviousStep}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Anterior
            </button>
          )}
  
          {/* Botón Siguiente/Enviar */}
          {activeStep < totalSteps ? (
            <button 
              onClick={handleNextStep}
              disabled={
                (activeStep === 1 && !dni) ||
                (activeStep === 2 && !selectedContainerId && !isNewContainer) ||
                (activeStep === 3 && isNewContainer && !tipoResiduo) ||
                (activeStep === 4 && isNewContainer && !tipoContenedor)
              }
              className="px-4 py-2 ml-auto text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Siguiente
            </button>
          ) : (
            <button 
              className="w-full px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!horario || !fechaRecogida || cargando}
            >
              {cargando ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando solicitud...
                </span>
              ) : 'Enviar Solicitud de Recogida'}
            </button>
          )}
        </div>
  
        {/* Mensajes de error y éxito */}
        {error && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center p-4 border-t border-red-200 bg-red-50">
            <AlertCircle className="flex-shrink-0 w-5 h-5 mr-2 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
  
        {exito && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center p-4 border-t border-green-200 bg-green-50">
            <Check className="flex-shrink-0 w-5 h-5 mr-2 text-green-500" />
            <p className="text-green-700">Su solicitud de recogida ha sido registrada correctamente</p>
          </div>
        )}
      </div>
    );
  };

  export default SolicitudRecogida;