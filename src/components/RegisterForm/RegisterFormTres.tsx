"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
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

// Mapeo de valores para el horario
const HORARIO_MAPPING: Record<string, string> = {
  'manana': 'M',  // mañana -> M
  'tarde': 'T',   // tarde -> T 
  'noche': 'N'    // noche -> N
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

const RegisterFormTres: React.FC<RegisterFormTresProps> = ({
  onRegisterSuccess,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recogidas, setRecogidas] = useState<Recogida[]>([]);
  const [fechasRecogida, setFechasRecogida] = useState<string[]>([]);
  // Flag para controlar si el botón de submit ha sido presionado explícitamente
  const [submitButtonPressed, setSubmitButtonPressed] = useState(false);
  const [recogidaCreada, setRecogidaCreada] = useState(false);
  
  // Referencia para guardar la función original de submitFormData
  const originalSubmitFormDataRef = useRef<typeof registroAPI.submitFormData | null>(null);

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

  // Función para crear recogida directamente
  const crearRecogidaDirecta = useCallback(async (datosNormalizados: any) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || '/api';
    
    // Calcular la fecha para hoy
    const fechaHoy = new Date();
    
    // Generar las próximas 5 fechas según la frecuencia
    const fechasRecogida = calcularFechasFuturas(fechaHoy, datosNormalizados.frecuencia, 5);
    setFechasRecogida(fechasRecogida);
    
    // Obtener el horario en formato API
    const horarioApi = HORARIO_MAPPING[datosNormalizados.horario] || 'M';
    
    try {
      // Primero buscar si ya existe información del propietario
      console.log('Buscando información del propietario:', datosNormalizados.dni);
      const propietarioResponse = await fetch(`${API_BASE_URL}/propietarios/dni/${datosNormalizados.dni}`);
      
      if (!propietarioResponse.ok) {
        console.warn(`No se encontró información del propietario: ${propietarioResponse.status}`);
      } else {
        const propietarioInfo = await propietarioResponse.json();
        console.log('Información del propietario encontrada:', propietarioInfo);
      }
      
      let recogidaExitosa = false;
      const fechasCreadas = [];
      
      // Intentar crear recogidas para cada fecha
      for (const fecha of fechasRecogida) {
        // Intentar diferentes formatos de recogida
        
        // Formato 1: Con propietarioDni
        const recogidaEstandar1 = {
          fechaSolicitud: fechasRecogida[0], // La fecha de solicitud siempre es hoy
          fechaRecogidaEstimada: fecha,
          fechaRecogidaReal: null,
          incidencias: null,
          estado: "pendiente",
          propietarioDni: datosNormalizados.dni
        };
        
        console.log(`Intentando formato 1 de recogida para fecha ${fecha}:`, JSON.stringify(recogidaEstandar1, null, 2));
        
        const recogidaResponse1 = await fetch(`${API_BASE_URL}/recogidas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recogidaEstandar1),
        });
        
        if (recogidaResponse1.ok) {
          const recogidaCreada = await recogidaResponse1.json();
          console.log(`Recogida creada exitosamente con formato 1 para fecha ${fecha}:`, recogidaCreada);
          fechasCreadas.push(fecha);
          continue; // Pasar a la siguiente fecha
        }
        
        console.log(`Formato 1 falló para fecha ${fecha}, intentando formato 2...`);
        
        // Formato 2: Con propietario objeto
        const recogidaEstandar2 = {
          fechaSolicitud: fechasRecogida[0], // La fecha de solicitud siempre es hoy
          fechaRecogidaEstimada: fecha,
          fechaRecogidaReal: null,
          incidencias: null,
          estado: "pendiente",
          propietario: {
            dni: datosNormalizados.dni
          }
        };
        
        console.log(`Intentando formato 2 de recogida para fecha ${fecha}:`, JSON.stringify(recogidaEstandar2, null, 2));
        
        const recogidaResponse2 = await fetch(`${API_BASE_URL}/recogidas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recogidaEstandar2),
        });
        
        if (recogidaResponse2.ok) {
          const recogidaCreada = await recogidaResponse2.json();
          console.log(`Recogida creada exitosamente con formato 2 para fecha ${fecha}:`, recogidaCreada);
          fechasCreadas.push(fecha);
        } else {
          console.log(`Ambos formatos fallaron para fecha ${fecha}`);
        }
      }
      
      return fechasCreadas.length > 0;
    } catch (error) {
      console.error('Error al crear recogida directa:', error);
      return false;
    }
  }, []);

  // Función para crear una recogida manual usando el API
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
            frecuencia: datosNormalizados.frecuencia,
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
  }, []);
  
  // Modificar el servicio registroAPI cuando se monte el componente (monkey patching)
  useEffect(() => {
    console.log("Iniciando modificación del servicio registroAPI...");
    
    // Guardar la función original
    originalSubmitFormDataRef.current = registroAPI.submitFormData;
    console.log("Función original de submitFormData guardada:", !!originalSubmitFormDataRef.current);
    
    // Definir la nueva implementación
    const nuevoSubmitFormData = async (formData: FormData): Promise<boolean> => {
      try {
        console.log("***** USANDO VERSION MODIFICADA DEL SUBMIT FORM DATA *****");
        console.log("Datos del formulario antes de enviar:", formData);
        
        // Llamar a la implementación original
        if (!originalSubmitFormDataRef.current) {
          console.error("No se encontró la implementación original de submitFormData");
          return false;
        }
        
        const result = await originalSubmitFormDataRef.current(formData);
        console.log("Resultado del registro original:", result);
        
        // Si el registro fue exitoso, crear inmediatamente las recogidas
        if (result) {
          console.log("REGISTRO EXITOSO! Ahora creando recogidas automáticamente...");
          
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
            provincia: formData.provincia.trim(),
            horario: formData.horario || 'manana'
          };
          
          // Esperar un momento para que el registro se complete totalmente en la base de datos
          console.log("Esperando 2 segundos para asegurar que el registro se complete...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // URL para la API
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || '/api';
          
          // Primero, obtener los puntos de recogida recién creados
          console.log("Obteniendo puntos de recogida del propietario:", datosNormalizados.dni);
          const puntosResponse = await fetch(`${API_BASE_URL}/puntos-recogida`);
          
          if (!puntosResponse.ok) {
            console.error("Error al obtener puntos de recogida:", puntosResponse.status);
            return result;
          }
          
          const puntos = await puntosResponse.json();
          
          // Filtrar los puntos del propietario
          const puntosPropietario = Array.isArray(puntos) 
            ? puntos.filter(p => p.propietario && p.propietario.dni === datosNormalizados.dni)
            : [];
          
          console.log("Puntos del propietario encontrados:", puntosPropietario.length);
          
          if (puntosPropietario.length === 0) {
            console.error("No se encontraron puntos de recogida para el propietario");
            return result; // Devolver el resultado original aunque no se haya creado la recogida
          }
          
          // Usar el punto de recogida más reciente (probablemente el que acabamos de crear)
          const puntoRecogida = puntosPropietario[puntosPropietario.length - 1];
          console.log("Usando punto de recogida:", puntoRecogida);
          
          // Obtener contenedores asociados
          console.log("Obteniendo contenedores...");
          const contenedoresResponse = await fetch(`${API_BASE_URL}/contenedores`);
          
          if (!contenedoresResponse.ok) {
            console.error("Error al obtener contenedores:", contenedoresResponse.status);
            return result;
          }
          
          const contenedores = await contenedoresResponse.json();
          
          // Filtrar contenedores del punto de recogida
          const contenedoresPunto = Array.isArray(contenedores)
            ? contenedores.filter(c => c.puntoRecogida && c.puntoRecogida.id === puntoRecogida.id)
            : [];
          
          console.log("Contenedores del punto encontrados:", contenedoresPunto.length);
          
          if (contenedoresPunto.length === 0) {
            console.error("No se encontraron contenedores para el punto de recogida");
            
            // Intentar método directo como respaldo
            console.log("Intentando método directo como último recurso...");
            const recogidaResult = await crearRecogidaDirecta(datosNormalizados);
            if (recogidaResult) {
              console.log("¡Recogidas creadas con éxito mediante método directo!");
              setRecogidaCreada(true);
            }
            
            return result;
          }
          
          // Usar el contenedor más reciente (probablemente el que acabamos de crear)
          const contenedor = contenedoresPunto[contenedoresPunto.length - 1];
          console.log("Usando contenedor:", contenedor);
          
          // Obtener fecha actual formateada
          const fechaHoy = new Date();
          
          // Generar las próximas 5 fechas según la frecuencia
          const fechasRecogida = calcularFechasFuturas(fechaHoy, datosNormalizados.frecuencia, 5);
          setFechasRecogida(fechasRecogida);
          
          let recogidaExitosa = false;
          const fechasCreadas = [];
          
          // Crear recogidas para cada fecha calculada
          for (const fecha of fechasRecogida) {
            // Crear objeto recogida con el formato exacto que espera la API
            const recogida = {
              fechaSolicitud: fechasRecogida[0], // La fecha de solicitud siempre es hoy
              fechaRecogidaEstimada: fecha,
              fechaRecogidaReal: null,
              incidencias: null,
              estado: "pendiente",
              contenedor: {
                id: contenedor.id
              }
            };
            
            console.log(`Enviando recogida para fecha ${fecha}:`, JSON.stringify(recogida, null, 2));
            
            // Enviar solicitud para crear la recogida
            const recogidaResponse = await fetch(`${API_BASE_URL}/recogidas`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(recogida),
            });
            
            if (recogidaResponse.ok) {
              const recogidaCreada = await recogidaResponse.json();
              console.log(`¡RECOGIDA CREADA EXITOSAMENTE para fecha ${fecha}!`, recogidaCreada);
              fechasCreadas.push(fecha);
            } else {
              const errorText = await recogidaResponse.text();
              console.error(`Error al crear recogida para fecha ${fecha}:`, recogidaResponse.status, errorText);
            }
          }
          
          if (fechasCreadas.length > 0) {
            console.log(`Se crearon ${fechasCreadas.length} recogidas con éxito:`, fechasCreadas);
            setRecogidaCreada(true);
          }
        }
        
        return result;
      } catch (error) {
        console.error("Error en submitFormData modificado:", error);
        // En caso de error, seguir retornando el resultado del registro original
        return false;
      }
    };
    
    // Sobreescribir la función original con nuestra implementación
    registroAPI.submitFormData = nuevoSubmitFormData;
    console.log("Servicio registroAPI modificado para crear recogidas automáticamente");
    
    // Limpiar la modificación cuando el componente se desmonte
    return () => {
      if (originalSubmitFormDataRef.current) {
        registroAPI.submitFormData = originalSubmitFormDataRef.current;
        console.log("Restaurando el servicio registroAPI original");
      }
    };
  }, [crearRecogidaDirecta]);

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
        
        // Enviar datos a la API (las recogidas se crearán automáticamente gracias al monkey patching)
        const resultado = await registroAPI.submitFormData(formDataToSubmit);
        console.log("Registro completado exitosamente:", resultado);
        
        // Esperar un momento más largo para dar tiempo a que se procesen las recogidas
        console.log("Esperando a que se complete la creación de las recogidas...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Abrir modal de éxito
        setIsSuccessModalOpen(true);
        
        // Con esto asumimos que las recogidas se crearon correctamente para el mensaje del modal
        setRecogidaCreada(true);

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
  }, [submitButtonPressed, isSubmitting, formData, validateForm, onRegisterSuccess]);

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

      {/* Modal de Éxito */}
      {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Registro Exitoso</h2>
            <p>Nuevo contenedor registrado con éxito.</p>
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

export default RegisterFormTres;