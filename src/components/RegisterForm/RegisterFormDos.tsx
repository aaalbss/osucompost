"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "./StepIndicator";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";
import { registroAPI } from "@/services/api";
import { FormData, FormErrors } from "@/types/types";
import "./stylesRegisterForm.css";


interface RegisterFormDosProps {
  onRegisterSuccess?: () => void;
}

const RegisterFormDos: React.FC<RegisterFormDosProps> = ({
  onRegisterSuccess,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProprietarioRegistered, setIsProprietarioRegistered] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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
    horario: "Mañana",
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
          setIsProprietarioRegistered(true);
        } catch (error) {
          console.error("Error al registrar propietario:", error);
          alert(`Error: ${error.message}`);
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
        const finalSubmitResponse = await registroAPI.submitFormData(formData);
  
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
    [formData, isSubmitting, validateForm, onRegisterSuccess]
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

  return (
    <>
      <div className="form-container-wrapper">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">{getStepTitle(currentStep)}</h2>
            <p className="form-subtitle">{getStepSubtitle(currentStep)}</p>
          </div>

          <StepIndicator currentStep={currentStep} totalSteps={3} />

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
                  className="form-button button-next ml-auto"
                  disabled={isSubmitting}
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="submit"
                  className="form-button button-submit ml-auto"
                  disabled={isSubmitting}
                >
                  <span>
                    {isSubmitting ? "Procesando..." : "Completar Registro"}
                  </span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Éxito */}
      {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Registro Exitoso</h2>
            <p>Su registro se ha completado correctamente. 
            Será redirigido a la página de inicio de sesión.</p>
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