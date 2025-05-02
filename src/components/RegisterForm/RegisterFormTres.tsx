"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "./StepIndicator";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";
import { registroAPI, propietarioAPI } from "@/services/api";
import { FormData, FormErrors, Recogida } from "@/types/types";
import "./stylesRegisterForm.css";

interface RegisterFormTresProps {
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
  
  // Determinar la primera fecha de recogida según la frecuencia
  if (frecuencia === 'Diaria') {
    // Para frecuencia diaria, empezamos desde mañana
    fechaBase.setDate(fechaBase.getDate() + 1);
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setHours(hora, 0, 0, 0);
    fechas.push(nuevaFecha);
  } 
  else if (frecuencia === '3 por semana') {
    // Lunes, miércoles, viernes
    const diasSemana = [1, 3, 5]; // 0=domingo, 1=lunes, etc.
    let diaActual = new Date(fechaBase);
    diaActual.setDate(diaActual.getDate() + 1); // Comenzar desde mañana
    
    // Buscar la próxima fecha que caiga en lunes, miércoles o viernes
    let encontrado = false;
    while (!encontrado) {
      if (diasSemana.includes(diaActual.getDay())) {
        const nuevaFecha = new Date(diaActual);
        nuevaFecha.setHours(hora, 0, 0, 0);
        fechas.push(nuevaFecha);
        encontrado = true;
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
    
    // Próximo viernes
    const fechaSiguiente = new Date(fechaBase);
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

const RegisterFormTres: React.FC<RegisterFormTresProps> = ({
  onRegisterSuccess,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recogidas, setRecogidas] = useState<Recogida[]>([]);
  // Flag para controlar si el botón de submit ha sido presionado explícitamente
  const [submitButtonPressed, setSubmitButtonPressed] = useState(false);

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
    fuente: "Domesticos",
    cantidad: "Cubo 16 L",
    frecuencia: "Diaria", 
    horario: "manana",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para obtener los datos del propietario
  const fetchPropietarioData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Obtener datos del usuario de localStorage (de la sesión iniciada)
      const userDni = localStorage.getItem('userDni');
      const userEmail = localStorage.getItem('userEmail');
      
      if (!userDni || !userEmail) {
        console.warn("No se encontraron datos de sesión del usuario en localStorage");
        setIsLoading(false);
        return;
      }
      
      try {
        // Obtener los datos completos del propietario usando el DNI
        const propietario = await propietarioAPI.verificarDNI(userDni);
        
        if (propietario) {
          console.log("Datos del propietario obtenidos correctamente");
          
          // Actualizar el formulario con los datos del propietario
          setFormData(prevData => ({
            ...prevData,
            nombre: propietario.nombre || "",
            dni: propietario.dni || userDni,
            telefono: propietario.telefono?.toString() || "",
            email: propietario.email || userEmail,
          }));
        } else {
          console.warn("No se encontraron datos del propietario con el DNI:", userDni);
          
          // Si no se encuentran datos completos, al menos usar lo que hay en localStorage
          setFormData(prevData => ({
            ...prevData,
            dni: userDni,
            email: userEmail,
          }));
        }
      } catch (fetchError) {
        console.warn("Error al obtener datos completos del propietario:", fetchError);
        
        // Si hay un error al obtener datos completos, usar lo básico de localStorage
        setFormData(prevData => ({
          ...prevData,
          dni: userDni,
          email: userEmail,
        }));
      }
    } catch (error) {
      console.error("Error general al cargar los datos del propietario:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar los datos del propietario al montar el componente
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPropietarioData();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [fetchPropietarioData]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      // Log específico para el campo de frecuencia
      if (name === 'frecuencia') {
        console.log(`Cambiando frecuencia a: ${value}`);
      }

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
        }
        if (!formData.telefono.trim()) {
          newErrors.telefono = "El teléfono es obligatorio";
          isValid = false;
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
        }
        if (!formData.provincia.trim()) {
          newErrors.provincia = "La provincia es obligatoria";
          isValid = false;
        }
      } else if (step === 3) {
        // Validación para el paso 3
        if (!formData.frecuencia) {
          // Usamos la notación de índice para evitar el error de TypeScript
          newErrors['frecuencia' as keyof FormErrors] = "La frecuencia es obligatoria";
          isValid = false;
        }
        // Puedes agregar más validaciones si es necesario
      }

      setErrors(newErrors);
      return isValid;
    },
    [formData]
  );

  const validateForm = useCallback((): boolean => {
    const stepsToValidate = [1, 2, 3]; // Validar todos los pasos, incluido el 3

    for (const step of stepsToValidate) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return false;
      }
    }

    return true;
  }, [validateStep]);

  const nextStep = useCallback(async () => {
    if (validateStep(currentStep)) {
      console.log(`Avanzando al paso ${currentStep + 1}`);
      
      if (currentStep === 2) {
        // Verificar si frecuencia tiene un valor
        if (!formData.frecuencia) {
          console.log("Estableciendo frecuencia por defecto");
          setFormData(prev => ({
            ...prev,
            frecuencia: "Diaria" // Valor por defecto
          }));
        }
      }

      // Simplemente avanzar al siguiente paso
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  }, [currentStep, formData, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // Función para programar las recogidas
  const programarRecogidas = useCallback(async (propietarioDni: string, contenedor: any) => {
    try {
      console.log("Programando recogidas para el propietario:", propietarioDni);
      
      // Obtener la próxima fecha de recogida según la frecuencia seleccionada
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

  // Ahora separamos el manejo del envío del formulario en dos partes:
  // 1. handleButtonSubmit: se activa cuando se hace clic en el botón
  const handleButtonSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Botón de envío presionado explícitamente");
    setSubmitButtonPressed(true);
  }, []);

  // 2. Efecto que procesa el envío solo si el botón ha sido presionado
  useEffect(() => {
    // Solo procesamos si el botón ha sido presionado explícitamente
    if (!submitButtonPressed || isSubmitting) return;

    const submitForm = async () => {
      console.log("Procesando envío explícito del formulario");
      setIsSubmitting(true);

      try {
        if (!validateForm()) {
          console.log("Validación del formulario fallida");
          setSubmitButtonPressed(false);
          setIsSubmitting(false);
          return;
        }

        // Crear una copia de los datos del formulario para asegurar que las modificaciones no afecten al estado original
        const formDataToSubmit = { ...formData };

        // Verificar que tenemos un valor de frecuencia antes de enviar
        if (!formDataToSubmit.frecuencia) {
          console.warn("La frecuencia está vacía, usando valor por defecto");
          formDataToSubmit.frecuencia = "Diaria";
        }
        
        console.log("Enviando formulario con frecuencia:", formDataToSubmit.frecuencia);
        
        // Enviar datos a la API
        const resultado = await registroAPI.submitFormData(formDataToSubmit);
        console.log("Registro completado exitosamente:", resultado);
        
        const dniNormalizado = formDataToSubmit.dni.trim().toUpperCase();
        
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
              if (formDataToSubmit.frecuencia !== 'Ocasional') {
                await programarRecogidas(dniNormalizado, contenedor);
              } else {
                console.log("Frecuencia Ocasional: No se programan recogidas automáticas");
              }
            } else {
              console.warn("No se encontraron contenedores para el punto de recogida");
              
              // Crear un objeto contenedor con los datos disponibles para poder programar recogidas
              const contenedorSimulado = {
                id: Math.floor(Math.random() * 1000) + 100, // ID simulado
                capacidad: parseInt(formDataToSubmit.cantidad.match(/\d+/)[0]) || 16,
                puntoRecogida: puntoRecogida
              };
              
              // Intentar programar recogidas con el contenedor simulado (si no es Ocasional)
              if (formDataToSubmit.frecuencia !== 'Ocasional') {
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
  
        // Abrir modal de éxito
        setIsSuccessModalOpen(true);

        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      } catch (error: unknown) {
        console.error("Error completo en el proceso de registro:", error);
  
        let errorMessage = "Error desconocido";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
  
        alert(`Registro fallido: ${errorMessage}`);
      } finally {
        setSubmitButtonPressed(false);
        setIsSubmitting(false);
      }
    };

    submitForm();
  }, [submitButtonPressed, isSubmitting, formData, validateForm, onRegisterSuccess, programarRecogidas]);

  const handleModalClose = () => {
    setIsSuccessModalOpen(false);
    // Redirigir a la página de inicio de sesión
    router.push('/propietario');
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

  return (
    <>
      <div className="form-container-wrapper">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">{getStepTitle(currentStep)}</h2>
            <p className="form-subtitle">{getStepSubtitle(currentStep)}</p>
          </div>

          <StepIndicator currentStep={currentStep} totalSteps={3} />

          {isLoading ? (
            <div className="loading-indicator">
              <p>Cargando datos del propietario...</p>
            </div>
          ) : (
            // Cambiamos el elemento form a div para evitar comportamientos de submit automáticos
            <div className="form-form">
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
                {currentStep === 3 && (
                  <FormStep3 
                    formData={formData} 
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

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto form-button button-next"
                    disabled={isSubmitting}
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    type="button" // Cambiado de 'submit' a 'button'
                    className="ml-auto form-button button-submit"
                    disabled={isSubmitting}
                    onClick={handleButtonSubmit}
                  >
                    <span>
                      {isSubmitting ? "Procesando..." : "Completar Registro"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Éxito - Versión simple */}
      {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Registro Exitoso</h2>
            <p>Nuevo contenedor registrado con éxito.</p>
            <button onClick={handleModalClose} className="modal-button">
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterFormTres;