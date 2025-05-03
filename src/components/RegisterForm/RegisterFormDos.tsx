"use client";

import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "./StepIndicator";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";
import { registroAPI } from "@/services/api";
import { FormData, FormErrors, Recogida } from "@/types/types";
import "./stylesRegisterForm.css";

interface RegisterFormDosProps {
  onRegisterSuccess?: () => void;
}

// Constantes para mapeo de valores
const HORARIO_MAPPING: Record<string, string> = {
  'manana': 'M',  // mañana -> M
  'tarde': 'T',   // tarde -> T 
  'noche': 'N'    // noche -> N
};

// Mapeo de tipos de residuos a IDs
const RESIDUO_ID_MAP: Record<string, number> = {
  'Organico': 1,
  'Vidrio': 2,
  'Papel': 3,
  'Plastico': 4,
  'Aceite': 5,
  'Poda': 6,
  'Otros': 7
};

// Mapeo de fuentes (corregido para el error de tipo)
const FUENTE_MAP: Record<string, string> = {
  'Domestico': 'Domesticos',
  'Supermercado': 'Supermercados',
  'Fruteria': 'Fruterias',
  'Comedor': 'Comedores',
  'HORECA': 'SectorHORECA',
  'Poda': 'RestosPoda',
  'Agricola': 'RestosAgricolas'
};

// Función para calcular las próximas fechas según la frecuencia
const calcularFechasFuturas = (fechaInicio: Date, frecuencia: string, cantidad = 5): string[] => {
  const fechas = [];
  let fechaActual = new Date(fechaInicio);
  
  // Convertir frecuencia a un formato estandarizado
  const frecuenciaLower = frecuencia.toLowerCase();
  
  // Primera fecha es la actual
  fechas.push(new Date(fechaActual));
  
  // Determinar el intervalo basado en la frecuencia
  let diasIntervalo = 1; // Por defecto, diaria
  
  if (frecuenciaLower === 'diaria' || frecuenciaLower.includes('dia')) {
    diasIntervalo = 1;
  } else if (frecuenciaLower === 'semanal' || frecuenciaLower.includes('semana')) {
    diasIntervalo = 7;
    
    // Manejar casos como "3 por semana" o "2 por semana"
    if (frecuenciaLower.includes('por semana')) {
      const vecesXSemana = parseInt(frecuencia.match(/(\d+)/)?.[0] || '1');
      if (vecesXSemana > 0) {
        // Calcular el intervalo según el número de veces por semana
        diasIntervalo = Math.floor(7 / vecesXSemana);
      }
    }
  } else if (frecuenciaLower === 'quincenal' || frecuenciaLower.includes('quince')) {
    diasIntervalo = 15;
  } else if (frecuenciaLower === 'mensual' || frecuenciaLower.includes('mes')) {
    // Para mensual, añadimos un mes en cada iteración
    for (let i = 1; i < cantidad; i++) {
      let nuevaFecha = new Date(fechaActual);
      nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
      fechas.push(nuevaFecha);
      fechaActual = nuevaFecha;
    }
    
    // Convertir a formato YYYY-MM-DD y retornar para frecuencia mensual
    return fechas.map(fecha => fecha.toISOString().split('T')[0]);
  }
  
  // Para todas las frecuencias excepto mensual, calculamos las fechas con el intervalo determinado
  if (frecuenciaLower !== 'mensual' && !frecuenciaLower.includes('mes')) {
    for (let i = 1; i < cantidad; i++) {
      let nuevaFecha = new Date(fechaActual);
      nuevaFecha.setDate(nuevaFecha.getDate() + diasIntervalo);
      fechas.push(nuevaFecha);
      fechaActual = nuevaFecha;
    }
  }
  
  // Convertir a formato YYYY-MM-DD
  return fechas.map(fecha => fecha.toISOString().split('T')[0]);
};

const RegisterFormDos: React.FC<RegisterFormDosProps> = ({
  onRegisterSuccess,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    dni: "",
    telefono: "",
    email: "",
    domicilio: "",
    localidad: "",
    cp: "",
    provincia: "",
    tipoResiduo: "Organico",
    fuente: "Domestico",
    cantidad: "Cubo 16 L",
    frecuencia: "Diaria",
    horario: "manana",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fechasRecogida, setFechasRecogida] = useState<string[]>([]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        if (name in prev) {
          return {
            ...prev,
            [name]: value,
          };
        }
        return prev;
      });

      setErrors((prev) => {
        if (name in prev) {
          const newErrors = { ...prev };
          delete newErrors[name as keyof typeof newErrors];
          return newErrors;
        }
        return prev;
      });
    },
    []
  );

  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: FormErrors = {};
      let isValid = true;

      if (step === 1) {
        if (!formData.nombre.trim()) {
          newErrors.nombre = "El nombre es obligatorio";
          isValid = false;
        }
        if (!formData.dni.trim()) {
          newErrors.dni = "El DNI/CIF es obligatorio";
          isValid = false;
        } else {
          // Validación del formato de DNI español: 8 dígitos seguidos de 1 letra mayúscula
          const dniRegex = /^[0-9]{8}[A-Z]$/;
          if (!dniRegex.test(formData.dni)) {
            newErrors.dni = "El DNI debe tener 8 dígitos seguidos de una letra mayúscula";
            isValid = false;
          }
        }
        if (!formData.telefono.trim()) {
          newErrors.telefono = "El teléfono es obligatorio";
          isValid = false;
        } else {
          // Validación del formato de teléfono español: 9 dígitos numéricos
          const telefonoRegex = /^[0-9]{9}$/;
          if (!telefonoRegex.test(formData.telefono)) {
            newErrors.telefono = "El teléfono debe tener exactamente 9 dígitos numéricos";
            isValid = false;
          }
        }
        if (!formData.email.trim()) {
          newErrors.email = "El correo electrónico es obligatorio";
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Correo electrónico inválido";
          isValid = false;
        }
      } else if (step === 2) {
        if (!formData.domicilio.trim()) {
          newErrors.domicilio = "La dirección es obligatoria";
          isValid = false;
        }
        if (!formData.localidad.trim()) {
          newErrors.localidad = "La localidad es obligatoria";
          isValid = false;
        }
        if (!formData.cp.trim()) {
          newErrors.cp = "El código postal es obligatorio";
          isValid = false;
        } else {
          // Validación del formato de código postal español: 5 dígitos numéricos
          const cpRegex = /^[0-9]{5}$/;
          if (!cpRegex.test(formData.cp)) {
            newErrors.cp = "El código postal debe tener exactamente 5 dígitos numéricos";
            isValid = false;
          }
        }
        if (!formData.provincia.trim()) {
          newErrors.provincia = "La provincia es obligatoria";
          isValid = false;
        }
      }

      setErrors(newErrors);
      return isValid;
    },
    [formData]
  );

  const validateForm = useCallback((): boolean => {
    const stepsToValidate = [1, 2]; 

    for (const step of stepsToValidate) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return false;
      }
    }

    return true;
  }, [validateStep]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // Función para crear las recogidas directamente
  const crearRecogidaDirecta = useCallback(async (datosNormalizados: any) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || '/api';
    
    // Obtener la fecha actual
    const fechaHoy = new Date();
    
    // Generar las próximas 5 fechas según la frecuencia
    const fechasRecogida = calcularFechasFuturas(fechaHoy, datosNormalizados.frecuencia, 5);
    setFechasRecogida(fechasRecogida);
    
    // Obtener el horario en formato API
    const horarioApi = HORARIO_MAPPING[formData.horario] || 'M';
    
    try {
      const recogidaExitosa = [];
      
      // Crear una recogida para cada fecha calculada
      for (const fecha of fechasRecogida) {
        const recogidaEstandar = {
          fechaSolicitud: fechasRecogida[0], // La fecha de solicitud siempre es hoy
          fechaRecogidaEstimada: fecha,
          fechaRecogidaReal: null,
          incidencias: null,
          estado: "pendiente",
          propietarioDni: datosNormalizados.dni
        };
        
        console.log(`Enviando recogida para fecha ${fecha}:`, JSON.stringify(recogidaEstandar, null, 2));
        
        const recogidaResponse = await fetch(`${API_BASE_URL}/recogidas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recogidaEstandar),
        });
        
        if (recogidaResponse.ok) {
          const recogidaCreada = await recogidaResponse.json();
          console.log(`Recogida para fecha ${fecha} creada exitosamente:`, recogidaCreada);
          recogidaExitosa.push(fecha);
        } else {
          const errorText = await recogidaResponse.text();
          console.error(`Error al crear recogida para fecha ${fecha}: ${recogidaResponse.status} - ${errorText}`);
        }
      }
      
      return recogidaExitosa.length > 0;
    } catch (error) {
      console.error('Error al crear recogidas:', error);
      return false;
    }
  }, [formData.horario]);

  // Función para modificar el servicio registroAPI
  const monkeyPatchRegistroAPI = useCallback(() => {
    // Guardar la función original
    const originalSubmitFormData = registroAPI.submitFormData;
    
    // Sobreescribir la función con una versión modificada
    registroAPI.submitFormData = async (formData: FormData): Promise<boolean> => {
      try {
        // Llamar a la implementación original
        const result = await originalSubmitFormData(formData);
        
        // Si el registro fue exitoso, crear inmediatamente las recogidas
        if (result) {
          console.log("Registro exitoso, creando recogidas...");
          
          // Normalizar los datos para la recogida
          const datosNormalizados = {
            ...formData,
            dni: formData.dni.trim().toUpperCase(),
            telefono: formData.telefono.trim(),
            cp: formData.cp.trim(),
            nombre: formData.nombre.trim(),
            email: formData.email.trim().toLowerCase(),
            domicilio: formData.domicilio.trim(),
            localidad: formData.localidad.trim(),
            provincia: formData.provincia.trim()
          };
          
          // Intentar crear las recogidas directamente
          await crearRecogidaDirecta(datosNormalizados);
        }
        
        return result;
      } catch (error) {
        console.error("Error en submitFormData modificado:", error);
        throw error;
      }
    };
    
    console.log("Servicio registroAPI modificado para crear recogidas automáticamente en función de la frecuencia seleccionada");
  }, [crearRecogidaDirecta]);

  // Modificar el servicio registroAPI cuando se monte el componente
  React.useEffect(() => {
    monkeyPatchRegistroAPI();
  }, [monkeyPatchRegistroAPI]);

  // Función para crear manualmente las recogidas después del registro
  const crearRecogidaManual = useCallback(async (datosNormalizados: any) => {
    // URL para la API de recogidas
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || '/api';
    
    try {
      // Primero, obtener todos los puntos de recogida
      const puntosResponse = await fetch(`${API_BASE_URL}/puntos-recogida`);
      if (!puntosResponse.ok) {
        throw new Error(`Error obteniendo puntos de recogida: ${puntosResponse.status}`);
      }
      
      const puntos = await puntosResponse.json();
      console.log("Todos los puntos de recogida:", puntos);
      
      // Filtrar los puntos del propietario por DNI
      const puntosPropietario = Array.isArray(puntos) 
        ? puntos.filter(p => p.propietario && p.propietario.dni === datosNormalizados.dni)
        : [];
      
      console.log("Puntos del propietario:", puntosPropietario);
      
      if (puntosPropietario.length === 0) {
        throw new Error("No se encontraron puntos de recogida para el propietario");
      }
      
      // Usar el primer punto de recogida
      const puntoRecogida = puntosPropietario[0];
      
      // Obtener todos los contenedores
      const contenedoresResponse = await fetch(`${API_BASE_URL}/contenedores`);
      if (!contenedoresResponse.ok) {
        throw new Error(`Error obteniendo contenedores: ${contenedoresResponse.status}`);
      }
      
      const contenedores = await contenedoresResponse.json();
      console.log("Todos los contenedores:", contenedores);
      
      // Filtrar los contenedores por punto de recogida
      const contenedoresPunto = Array.isArray(contenedores)
        ? contenedores.filter(c => c.puntoRecogida && c.puntoRecogida.id === puntoRecogida.id)
        : [];
      
      console.log("Contenedores del punto de recogida:", contenedoresPunto);
      
      if (contenedoresPunto.length === 0) {
        throw new Error("No se encontraron contenedores para el punto de recogida");
      }
      
      // Usar el primer contenedor
      const contenedor = contenedoresPunto[0];
      
      // Fecha actual
      const fechaHoy = new Date();
      
      // Generar las próximas 5 fechas según la frecuencia
      const fechasRecogida = calcularFechasFuturas(fechaHoy, datosNormalizados.frecuencia, 5);
      setFechasRecogida(fechasRecogida);
      
      const recogidaExitosa = [];
      
      // Crear una recogida para cada fecha calculada
      for (const fecha of fechasRecogida) {
        // Crear objeto recogida exactamente como el formato de la API
        const recogida = {
          fechaSolicitud: fechasRecogida[0], // La fecha de solicitud siempre es hoy
          fechaRecogidaEstimada: fecha,
          fechaRecogidaReal: null,
          incidencias: null,
          contenedor: {
            id: contenedor.id,
            capacidad: contenedor.capacidad,
            frecuencia: formData.frecuencia,
            tipoResiduo: contenedor.tipoResiduo
          }
        };
        
        console.log(`Creando recogida para fecha ${fecha}:`, JSON.stringify(recogida, null, 2));
        
        // Enviar la solicitud para crear la recogida
        const recogidaResponse = await fetch(`${API_BASE_URL}/recogidas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recogida),
        });
        
        if (recogidaResponse.ok) {
          const recogidaCreada = await recogidaResponse.json();
          console.log(`Recogida para fecha ${fecha} creada exitosamente:`, recogidaCreada);
          recogidaExitosa.push(fecha);
        } else {
          const errorText = await recogidaResponse.text();
          console.error(`Error al crear recogida para fecha ${fecha}: ${recogidaResponse.status} - ${errorText}`);
        }
      }
      
      return recogidaExitosa.length > 0;
    } catch (error) {
      console.error("Error en crearRecogidaManual:", error);
      return false;
    }
  }, [formData.frecuencia]);

  // Separamos explícitamente la función de envío para usarla solo en el botón final
  const submitForm = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (isSubmitting) return;
  
      if (!validateForm()) {
        return;
      }
  
      setIsSubmitting(true);
  
      try {
        // Preparar los datos normalizados para el registro
        const datosNormalizados = {
          ...formData,
          dni: formData.dni.trim().toUpperCase(),
          telefono: formData.telefono.trim(),
          cp: formData.cp.trim(),
          // Eliminar posibles caracteres especiales en campos críticos
          nombre: formData.nombre.trim(),
          email: formData.email.trim().toLowerCase(),
          domicilio: formData.domicilio.trim(),
          localidad: formData.localidad.trim(),
          provincia: formData.provincia.trim()
        };
        
        console.log("Enviando datos del formulario:", datosNormalizados);
        
        // Registramos al propietario y sus datos
        const registroResponse = await registroAPI.submitFormData(datosNormalizados);
        console.log("Respuesta del registro:", registroResponse);
        
        // Esperar un momento para asegurar que los datos se han guardado correctamente
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Intentar crear las recogidas manualmente después del registro
        const recogidaCreada = await crearRecogidaManual(datosNormalizados);
        
        if (recogidaCreada) {
          console.log("Recogidas creadas manualmente con éxito");
        } else {
          console.warn("No se pudieron crear las recogidas manualmente");
        }
  
        console.log("Registro completado exitosamente");
        
        // Abrir modal de éxito
        setIsSuccessModalOpen(true);

        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      } catch (error: unknown) {
        console.error("Error completo en el proceso de registro:", error);
  
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
  
        alert(`Registro fallido: ${errorMessage}`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting, validateForm, onRegisterSuccess, crearRecogidaManual]
  );

  const handleModalClose = () => {
    setIsSuccessModalOpen(false);
    // Redirigir a la página de inicio de sesión
    router.push('/login');
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Datos del Propietario";
      case 2:
        return "Punto de Recogida";
      case 3:
        return "Tipo de Residuos y Frecuencia";
      default:
        return "";
    }
  };

  const getStepSubtitle = (step: number) => {
    switch (step) {
      case 1:
        return "Información personal del titular";
      case 2:
        return "Ubicación para la recogida";
      case 3:
        return "Detalles del servicio de recogida";
      default:
        return "";
    }
  };

  // Manejador del evento keydown para prevenir el envío del formulario con Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Si se presiona Enter en cualquier input excepto textarea, 
    // pero no en un botón tipo 'submit'
    if (e.key === 'Enter' && 
        e.target instanceof HTMLElement && 
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLButtonElement && 
          (e.target as HTMLButtonElement).type === 'submit')) {
      
      e.preventDefault(); // Prevenir el comportamiento predeterminado
      
      // Solo avanzamos al siguiente paso si no estamos en el último
      if (currentStep < 3) {
        nextStep();
      }
    }
  };

  // Texto para el modal de éxito que muestra información sobre frecuencia
  const getModalText = () => {
    if (fechasRecogida.length > 0) {
      // Formatear las fechas para mostrarlas en formato español
      const fechasFormateadas = fechasRecogida.map(fecha => {
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
      }).join(', ');
      
      // Mostrar el tipo de frecuencia de manera legible
      let tipoFrecuencia = formData.frecuencia.toLowerCase();
      if (tipoFrecuencia.includes('por semana')) {
        const vecesXSemana = parseInt(formData.frecuencia.match(/(\d+)/)?.[0] || '1');
        tipoFrecuencia = `${vecesXSemana} veces por semana`;
      }
      
      return `Se han programado 5 recogidas con frecuencia "${tipoFrecuencia}".`;
    }
    return "Se han programado las próximas 5 recogidas de acuerdo con la frecuencia seleccionada.";
  };

  return (
    <>
      <div className="form-container-wrapper">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">{getStepTitle(currentStep)}</h2>
            <p className="form-subtitle">{getStepSubtitle(currentStep)}</p>
          </div>

          <StepIndicator currentStep={currentStep} totalSteps={3} />

          {/* Utilizamos role="presentation" para evitar que el navegador trate esto como un form normal */}
          {currentStep < 3 ? (
            // Para pasos 1 y 2, no usamos un formulario real para evitar envíos accidentales
            <div 
              role="presentation"
              className="form-form" 
              onKeyDown={handleKeyDown}
            >
              <div className="step-content">
                {currentStep === 1 && (
                  <FormStep1
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                  />
                )}
                {currentStep === 2 && (
                  <FormStep2
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                  />
                )}
              </div>

              <div className="form-footer">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="form-button button-prev"
                    disabled={isSubmitting}
                  >
                    ← Anterior
                  </button>
                )}

                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto form-button button-next"
                  disabled={isSubmitting}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          ) : (
            // Solo para el paso 3 usamos un formulario real
            <form 
              ref={formRef}
              onSubmit={submitForm} 
              className="form-form" 
              autoComplete="off"
              onKeyDown={handleKeyDown}
            >
              <div className="step-content">
                <FormStep3 
                  formData={formData} 
                  handleChange={handleChange} 
                />
              </div>

              <div className="form-footer">
                <button
                  type="button"
                  onClick={prevStep}
                  className="form-button button-prev"
                  disabled={isSubmitting}
                >
                  ← Anterior
                </button>

                <button
                  type="submit"
                  className="ml-auto form-button button-submit"
                  disabled={isSubmitting}
                >
                  <span>
                    {isSubmitting ? "Procesando..." : "Completar Registro"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal de Éxito */}
      {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Registro Exitoso</h2>
            <p>Su registro se ha completado correctamente.</p>
            <p>{getModalText()}</p>
            <button onClick={handleModalClose} className="modal-button">
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterFormDos;