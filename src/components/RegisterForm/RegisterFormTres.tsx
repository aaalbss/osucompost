"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "./StepIndicator";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";
import { registroAPI, propietarioAPI } from "@/services/api";
import { FormData, FormErrors } from "@/types/types";
import "./stylesRegisterForm.css";

interface RegisterFormTresProps {
  onRegisterSuccess?: () => void;
}

const RegisterFormTres: React.FC<RegisterFormTresProps> = ({
  onRegisterSuccess,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    // Usar setTimeout para asegurar que se ejecuta después de que localStorage esté disponible
    // (Esto ayuda a evitar problemas con SSR)
    const timer = setTimeout(() => {
      fetchPropietarioData();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [fetchPropietarioData]);

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

  const nextStep = useCallback(async () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) {
        try {
          console.log("Intentando registrar propietario con datos:", formData);

          const registroResponse = await registroAPI.submitFormData(formData);

          if (!registroResponse) {
            throw new Error("Error al registrar el propietario");
          }

          console.log("Propietario registrado correctamente");
        } catch (error: unknown) {
          console.error("Error al registrar propietario:", error);
          // Manejar el error como tipo desconocido
          let errorMessage = "Error desconocido";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          alert(`Error: ${errorMessage}`);
          return;
        }
      }

      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  }, [currentStep, formData, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (isSubmitting) return;
  
      if (!validateForm()) {
        return;
      }
  
      setIsSubmitting(true);
  
      try {
        await registroAPI.submitFormData(formData);
  
        console.log("Registro completado exitosamente");
  
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
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting, validateForm, onRegisterSuccess]
  );

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
            <form onSubmit={handleSubmit} className="form-form" autoComplete="off">
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
                    type="submit"
                    className="ml-auto form-button button-submit"
                    disabled={isSubmitting}
                  >
                    <span>
                      {isSubmitting ? "Procesando..." : "Completar Registro"}
                    </span>
                  </button>
                )}
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
            <p>Nuevo cotenedor registrado con éxito.</p>
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