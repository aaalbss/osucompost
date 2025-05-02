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

// Función auxiliar para calcular la próxima fecha de recogida según la frecuencia
const calcularProximasRecogidas = (frecuencia: string, horario: string): Date[] => {
  // Para frecuencia "Ocasional", no generamos fechas automáticamente
  if (frecuencia === 'Ocasional') {
    console.log('Frecuencia Ocasional: No se generan fechas automáticas');
    return []; // Devolver array vacío para no registrar recogidas automáticas
  }
  
  const fechas: Date[] = [];
  const hoy = new Date();
  
  // Establecer la hora según el horario seleccionado
  let hora = 8; // Valor por defecto (8:00 AM) para horario de mañana
  
  switch(horario) {
    case 'manana':
      hora = 8; // 8:00 AM
      break;
    case 'tarde':
      hora = 16; // 4:00 PM
      break;
    case 'noche':
      hora = 22; // 10:00 PM
      break;
  }
  
  // Clonar la fecha actual para no modificar la original
  let fechaBase = new Date(hoy);
  // Normalizar a inicio del día
  fechaBase.setHours(0, 0, 0, 0);
  
  // Determinar la primera fecha de recogida (solo una fecha)
  
  if (frecuencia === 'Diaria') {
    // Para frecuencia diaria, empezamos desde mañana
    fechaBase.setDate(fechaBase.getDate() + 1);
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setHours(hora, 0, 0, 0);
    fechas.push(nuevaFecha);
  } 
  else if (frecuencia === '3 por semana') {
    // Buscar el próximo lunes, miércoles o viernes
    const diasSemana = [1, 3, 5]; // 0=domingo, 1=lunes, etc.
    let diaActual = new Date(fechaBase);
    diaActual.setDate(diaActual.getDate() + 1); // Comenzar desde mañana
    
    // Buscar la próxima fecha que caiga en lunes, miércoles o viernes
    while (fechas.length < 1) {
      if (diasSemana.includes(diaActual.getDay())) {
        const nuevaFecha = new Date(diaActual);
        nuevaFecha.setHours(hora, 0, 0, 0);
        fechas.push(nuevaFecha);
      }
      diaActual.setDate(diaActual.getDate() + 1);
    }
  }
  else if (frecuencia === '1 por semana') {
    // Una vez por semana (lunes)
    const hoyDiaSemana = fechaBase.getDay(); // 0=domingo, 1=lunes, etc.
    const diasHastaLunes = hoyDiaSemana === 1 ? 7 : ((8 - hoyDiaSemana) % 7 || 7); // Días hasta el próximo lunes
    
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setDate(fechaBase.getDate() + diasHastaLunes);
    nuevaFecha.setHours(hora, 0, 0, 0);
    fechas.push(nuevaFecha);
  }
  else if (frecuencia === 'Quincenal') {
    // Encontrar el próximo viernes
    const hoyDiaSemana = fechaBase.getDay();
    const diasHastaViernes = hoyDiaSemana <= 5 ? 5 - hoyDiaSemana : 5 + (7 - hoyDiaSemana);
    
    // Primera fecha: próximo viernes
    let fechaSiguiente = new Date(fechaBase);
    fechaSiguiente.setDate(fechaBase.getDate() + diasHastaViernes);
    fechaSiguiente.setHours(hora, 0, 0, 0);
    fechas.push(new Date(fechaSiguiente));
  }
  else {
    // Caso por defecto (no debería ocurrir con las validaciones)
    console.warn(`Frecuencia no reconocida: ${frecuencia}. Usando Diaria como valor por defecto.`);
    
    // Para frecuencia diaria, empezamos desde mañana
    fechaBase.setDate(fechaBase.getDate() + 1);
    
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setHours(hora, 0, 0, 0);
    fechas.push(nuevaFecha);
  }
  
  // Log para depuración
  console.log(`Fecha generada para frecuencia ${frecuencia}:`, 
    fechas.map(f => `${f.toISOString()} (${f.toLocaleDateString()})`));
    
  return fechas;
};

const RegisterFormDos: React.FC<RegisterFormDosProps> = ({
  onRegisterSuccess,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProprietarioRegistered, setIsProprietarioRegistered] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [recogidas, setRecogidas] = useState<Recogida[]>([]);
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

  // Función para programar las recogidas
  const programarRecogidas = useCallback(async (propietarioDni: string, contenedor: any) => {
    try {
      console.log("Programando recogidas para el propietario:", propietarioDni);
      
      // Obtener las próximas fechas de recogida según la frecuencia seleccionada
      const fechasRecogida = calcularProximasRecogidas(formData.frecuencia, formData.horario);
      
      // Si no hay fechas para programar (Ocasional), simplemente terminar
      if (fechasRecogida.length === 0) {
        console.log(`No se programan recogidas automáticas para frecuencia "${formData.frecuencia}"`);
        return [];
      }
      
      // Preparar los datos de recogida con el formato exacto
      const nuevasRecogidas = fechasRecogida.map((fecha) => ({
        fechaSolicitud: new Date().toISOString(),
        fechaRecogidaEstimada: fecha.toISOString(),
        fechaRecogidaReal: null,
        incidencias: null,
        contenedor: {
          id: contenedor.id,
          capacidad: contenedor.capacidad || parseInt(formData.cantidad.match(/\d+/)[0]) || 16,
          frecuencia: formData.frecuencia,
          tipoResiduo: {
            id: formData.tipoResiduo === "Organico" ? 1 : 2,
            descripcion: formData.tipoResiduo
          },
          puntoRecogida: {
            id: contenedor.puntoRecogida?.id,
            localidad: formData.localidad,
            cp: parseInt(formData.cp),
            provincia: formData.provincia,
            direccion: formData.domicilio,
            horario: formData.horario === "manana" ? "M" : 
                    formData.horario === "tarde" ? "T" : "N",
            tipo: formData.fuente,
            propietario: {
              dni: propietarioDni,
              nombre: formData.nombre,
              telefono: parseInt(formData.telefono.replace(/\D/g, '')),
              email: formData.email
            }
          }
        }
      }));
      
      console.log("Nuevas recogidas a programar:", nuevasRecogidas);
      
      // Enviar las solicitudes de recogida
      const recogidasRegistradas = [];
      
      for (const recogida of nuevasRecogidas) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || '/api'}/recogidas`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(recogida),
          });
          
          if (!response.ok) {
            throw new Error(`Error al programar recogida: ${response.statusText}`);
          }
          
          const recogidaRegistrada = await response.json();
          recogidasRegistradas.push(recogidaRegistrada);
        } catch (error) {
          console.error("Error al registrar una recogida:", error);
          // Continuamos con las demás recogidas a pesar del error
        }
      }
      
      console.log("Recogidas programadas correctamente:", recogidasRegistradas);
      setRecogidas(recogidasRegistradas);
      
      return recogidasRegistradas;
    } catch (error) {
      console.error("Error al programar las recogidas:", error);
      throw new Error(`Error al programar las recogidas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }, [formData]);

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
        
        // Registramos al propietario y sus datos SOLO en este punto final
        const registroResponse = await registroAPI.submitFormData(datosNormalizados);
        console.log("Respuesta del registro:", registroResponse);
        
        const dniNormalizado = datosNormalizados.dni;
        
        try {
          // Obtener los puntos de recogida del propietario
          const puntosResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || '/api'}/puntos-recogida?dni=${dniNormalizado}`);
          if (!puntosResponse.ok) {
            throw new Error(`Error al obtener puntos de recogida: ${puntosResponse.statusText}`);
          }
          const puntosRecogida = await puntosResponse.json();
          
          if (puntosRecogida && puntosRecogida.length > 0) {
            // Obtener el punto de recogida más reciente
            const puntoRecogida = puntosRecogida[puntosRecogida.length - 1];
            
            // Obtener los contenedores de este punto de recogida
            const contenedoresResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || '/api'}/contenedores?puntoRecogidaId=${puntoRecogida.id}`);
            if (!contenedoresResponse.ok) {
              throw new Error(`Error al obtener contenedores: ${contenedoresResponse.statusText}`);
            }
            const contenedores = await contenedoresResponse.json();
            
            if (contenedores && contenedores.length > 0) {
              // Obtener el contenedor más reciente
              const contenedor = contenedores[contenedores.length - 1];
              
              // Asegurarnos que el contenedor tenga la estructura completa
              if (!contenedor.puntoRecogida) {
                contenedor.puntoRecogida = puntoRecogida;
              }
              
              // Programar las próximas recogidas (si no es Ocasional)
              if (formData.frecuencia !== 'Ocasional') {
                await programarRecogidas(dniNormalizado, contenedor);
              } else {
                console.log("Frecuencia Ocasional: No se programan recogidas automáticas");
              }
            } else {
              console.warn("No se encontraron contenedores para el punto de recogida");
              
              // Crear un objeto contenedor con los datos disponibles para poder programar recogidas
              const contenedorSimulado = {
                id: Math.floor(Math.random() * 1000) + 100, // ID simulado
                capacidad: parseInt(formData.cantidad.match(/\d+/)[0]) || 16,
                puntoRecogida: puntoRecogida
              };
              
              // Intentar programar recogidas con el contenedor simulado (si no es Ocasional)
              if (formData.frecuencia !== 'Ocasional') {
                await programarRecogidas(dniNormalizado, contenedorSimulado);
              } else {
                console.log("Frecuencia Ocasional: No se programan recogidas automáticas");
              }
            }
          } else {
            console.warn("No se encontraron puntos de recogida para el usuario");
          }
        } catch (fetchError) {
          console.error("Error al obtener datos para programar recogidas:", fetchError);
          // Continuamos para mostrar el mensaje de éxito aunque no se hayan programado recogidas
        }
        
        console.log("Registro completado exitosamente");
        
        // Abrir modal de éxito
        setIsSuccessModalOpen(true);

        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      } catch (error: any) {
        console.error("Error completo en el proceso de registro:", error);
  
        const errorMessage = error.message || "Error desconocido";
  
        alert(`Registro fallido: ${errorMessage}`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting, validateForm, onRegisterSuccess, programarRecogidas]
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

  // Función para formatear la fecha en formato legible
  const formatearFecha = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    
    try {
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      // Formato alternativo por si falla el método toLocaleDateString
      const options = { timeZone: 'Europe/Madrid' };
      return fecha.toLocaleString('es-ES', options);
    }
  };
  
  // Traducir el horario a texto descriptivo
  const traducirHorario = (codigo: string): string => {
    switch(codigo) {
      case 'M':
        return 'Mañana (9:00 a 13:00)';
      case 'T':
        return 'Tarde (17:00 a 20:00)';
      case 'N':
        return 'Noche (a partir de las 23:00)';
      default:
        return codigo;
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
            
            {recogidas.length > 0 ? (
              <div className="recogidas-programadas">
                <h3>Se ha programado su próxima recogida:</h3>
                <ul className="recogidas-lista">
                  {recogidas.map((recogida, index) => (
                    <li key={index}>
                      <span className="recogida-fecha">
                        {formatearFecha(recogida.fechaRecogidaEstimada)}
                      </span>
                      {recogida.contenedor && (
                        <span className="recogida-detalles">
                          {' - '}
                          {recogida.contenedor.tipoResiduo?.descripcion || formData.tipoResiduo}
                          {' - '}
                          {traducirHorario(recogida.contenedor.puntoRecogida?.horario || 
                                         (formData.horario === "manana" ? "M" : 
                                          formData.horario === "tarde" ? "T" : "N"))}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>{formData.frecuencia === 'Ocasional' 
                  ? 'El servicio ocasional no genera recogidas programadas automáticamente.' 
                  : 'Se ha programado su próxima recogida según la frecuencia seleccionada.'}</p>
            )}
            
            <p>Será redirigido a la página de inicio de sesión.</p>
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