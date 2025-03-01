import React from "react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      {/* Contenedor del modal */}
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl max-h-[80vh] flex flex-col shadow-lg relative z-50">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Política de Privacidad</h2>

        {/* Contenido desplazable */}
        <div className="overflow-y-auto flex-grow pr-2 text-gray-900">
          <p>
            En <strong>OSUCOMPOST</strong>, nos tomamos muy en serio la privacidad de nuestros usuarios. 
            Esta Política de Privacidad explica cómo recopilamos, usamos, protegemos y compartimos la información que obtenemos a través de nuestro sitio web <strong>OSUCOMPOST.es</strong>.
          </p>

          <h3 className="font-semibold mt-4">1. Información que recopilamos</h3>
          <ul className="list-disc list-inside">
            <li><strong>Datos personales:</strong> Nombre, correo electrónico, dirección y otros datos proporcionados voluntariamente.</li>
            <li><strong>Datos automáticos:</strong> Dirección IP, tipo de navegador, sistema operativo y datos de uso del sitio.</li>
            <li><strong>Cookies y tecnologías similares:</strong> Para mejorar la experiencia del usuario y ofrecer contenido personalizado.</li>
          </ul>

          <h3 className="font-semibold mt-4">2. Uso de la información</h3>
          <ul className="list-disc list-inside">
            <li>Mejorar la experiencia de usuario en nuestro sitio.</li>
            <li>Enviar boletines informativos, promociones o comunicaciones si el usuario lo permite.</li>
            <li>Analizar el uso del sitio para optimizar nuestros servicios.</li>
            <li>Cumplir con obligaciones legales y proteger nuestros derechos.</li>
          </ul>

          <h3 className="font-semibold mt-4">3. Compartición de la información</h3>
          <p>No vendemos ni compartimos información personal con terceros, excepto en los siguientes casos:</p>
          <ul className="list-disc list-inside">
            <li>Proveedores de servicios que nos ayudan a operar el sitio web.</li>
            <li>Autoridades legales si es requerido por ley.</li>
            <li>En caso de fusión, adquisición o venta de activos.</li>
          </ul>

          <h3 className="font-semibold mt-4">4. Protección de datos</h3>
          <p>Implementamos medidas de seguridad adecuadas para proteger la información contra accesos no autorizados, pérdidas o alteraciones.</p>

          <h3 className="font-semibold mt-4">5. Derechos del usuario</h3>
          <ul className="list-disc list-inside">
            <li>Acceder, modificar o eliminar sus datos personales.</li>
            <li>Retirar su consentimiento para el uso de sus datos.</li>
            <li>Oponerse al procesamiento de su información personal.</li>
          </ul>
          <p>Para ejercer estos derechos, pueden contactarnos en <strong>osucompost@gmai.com</strong>.</p>

          <h3 className="font-semibold mt-4">6. Uso de cookies</h3>
          <p>Utilizamos cookies para mejorar la experiencia de navegación. Los usuarios pueden configurar su navegador para rechazarlas.</p>

          <h3 className="font-semibold mt-4">7. Cambios en la Política de Privacidad</h3>
          <p>Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Los cambios serán notificados en nuestro sitio web.</p>

          <h3 className="font-semibold mt-4">8. Contacto</h3>
          <p>Para cualquier pregunta sobre esta Política de Privacidad, contáctanos en <strong>osucompost@gmai.com</strong>.</p>
        </div>

        {/* Botón de cierre */}
        <button 
          onClick={closeModal} 
          className="mt-4 bg-[#2f4f27] text-white px-4 py-2 rounded hover:bg-[#1e351a] transition duration-300"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
