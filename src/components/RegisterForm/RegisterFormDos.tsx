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

  // Función para crear la recogida directamente
  const crearRecogidaDirecta = useCallback(async (datosNormalizados: any) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || '/api';
    
    // Obtener la fecha actual
    const fechaHoy = new Date();
    
    // Formato YYYY-MM-DD para la API
    const fechaHoyFormateada = fechaHoy.toISOString().split('T')[0];
    
    // Obtener el horario en formato API
    const horarioApi = HORARIO_MAPPING[formData.horario] || 'M';
    
    // Obtener capacidad según el tipo de contenedor
    let capacidad = 16;
    switch(formData.cantidad) {
      case 'Cubo 16 L': capacidad = 16; break;
      case 'Cubo 160 L': capacidad = 160; break;
      case 'Contenedor 800 L': capacidad = 800; break;
      case 'Contenedor 1200 L': capacidad = 1200; break;
    }
    
    // Convertir la fuente al formato correcto
    const fuenteFormateada = FUENTE_MAP[formData.fuente] || 'Domesticos';
    
    // Objeto para el endpoint estándar /recogidas
    const recogidaEstandar = {
      fechaSolicitud: fechaHoyFormateada,
      fechaRecogidaEstimada: fechaHoyFormateada,
      fechaRecogidaReal: null,
      incidencias: null, // No añadir incidencia aunque sea fin de semana
      estado: "pendiente",
      propietarioDni: datosNormalizados.dni
    };
    
    try {
      console.log('Enviando recogida para cualquier día de la semana:', JSON.stringify(recogidaEstandar, null, 2));
      
      const recogidaResponse = await fetch(`${API_BASE_URL}/recogidas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recogidaEstandar),
      });
      
      if (!recogidaResponse.ok) {
        const errorText = await recogidaResponse.text();
        console.error(`Error al crear recogida: ${recogidaResponse.status} - ${errorText}`);
        return false;
      }
      
      const recogidaCreada = await recogidaResponse.json();
      console.log('Recogida creada exitosamente:', recogidaCreada);
      return true;
    } catch (error) {
      console.error('Error al crear recogida:', error);
      return false;
    }
  }, [formData.horario, formData.cantidad, formData.fuente]);

  // Función para modificar el servicio registroAPI
  const monkeyPatchRegistroAPI = useCallback(() => {
    // Guardar la función original
    const originalSubmitFormData = registroAPI.submitFormData;
    
    // Sobreescribir la función con una versión modificada
    registroAPI.submitFormData = async (formData: FormData): Promise<boolean> => {
      try {
        // Llamar a la implementación original
        const result = await originalSubmitFormData(formData);
        
        // Si el registro fue exitoso, crear inmediatamente una recogida
        if (result) {
          console.log("Registro exitoso, creando recogida...");
          
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
          
          // Intentar crear la recogida directamente
          await crearRecogidaDirecta(datosNormalizados);
        }
        
        return result;
      } catch (error) {
        console.error("Error en submitFormData modificado:", error);
        throw error;
      }
    };
    
    console.log("Servicio registroAPI modificado para crear recogidas automáticamente en cualquier día de la semana");
  }, [crearRecogidaDirecta]);

  // Modificar el servicio registroAPI cuando se monte el componente
  React.useEffect(() => {
    monkeyPatchRegistroAPI();
  }, [monkeyPatchRegistroAPI]);

  // Función para crear manualmente una recogida después del registro
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
      const fechaHoyFormateada = fechaHoy.toISOString().split('T')[0];
      
      // Crear objeto recogida exactamente como el formato de la API
      const recogida = {
        fechaSolicitud: fechaHoyFormateada,
        fechaRecogidaEstimada: fechaHoyFormateada,
        fechaRecogidaReal: null,
        incidencias: null, // Sin incidencias en cualquier día de la semana
        contenedor: {
          id: contenedor.id,
          capacidad: contenedor.capacidad,
          frecuencia: formData.frecuencia,
          tipoResiduo: contenedor.tipoResiduo
        }
      };
      
      console.log("Creando recogida:", JSON.stringify(recogida, null, 2));
      
      // Enviar la solicitud para crear la recogida
      const recogidaResponse = await fetch(`${API_BASE_URL}/recogidas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recogida),
      });
      
      if (!recogidaResponse.ok) {
        throw new Error(`Error creando recogida: ${recogidaResponse.status}`);
      }
      
      const recogidaCreada = await recogidaResponse.json();
      console.log("Recogida creada exitosamente:", recogidaCreada);
      
      return true;
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
        
        // Intentar crear la recogida manualmente después del registro
        const recogidaCreada = await crearRecogidaManual(datosNormalizados);
        
        if (recogidaCreada) {
          console.log("Recogida creada manualmente con éxito");
        } else {
          console.warn("No se pudo crear la recogida manualmente");
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

  // Texto para el modal de éxito
  const getModalText = () => {
    return "Se ha programado una recogida para hoy según el horario seleccionado.";
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