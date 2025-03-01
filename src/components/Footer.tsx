import { useState } from "react";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <footer className="bg-[#2f4f27] text-white py-12">
      <div className="container mx-auto px-6 flex flex-col items-center">
        {/* Sección principal con logo, información y enlaces */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10 w-full max-w-6xl text-center md:text-left">
          {/* Logo y eslogan */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold tracking-wider mb-3">OSUCOMPOST</h3>
            <p className="text-gray-200 max-w-xs">Gestión sostenible de biorresiduos para un futuro más sostenible</p>
          </div>
          
          {/* Enlaces agrupados en 3 columnas */}
          <div className="col-span-1">
            <h4 className="font-bold text-lg mb-4">Enlaces rápidos</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-green-300 transition duration-300">
                Inicio
              </a></li>
              <li><a href="#products" className="hover:text-green-300 transition duration-300">
                Productos
              </a></li>
              <li><a href="#contact" className="hover:text-green-300 transition duration-300">
                Contacto
              </a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-bold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start">
                <span className="mr-2">📍</span>
                <span>Osuna, Sevilla</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <span className="mr-2">📧</span>
                <a href="mailto:osucompost@gmail.com" className="hover:text-green-300 transition duration-300">
                  osucompost@gmail.com
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <span className="mr-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.754.966-.925 1.164-.17.199-.343.223-.643.074-.3-.15-1.268-.468-2.414-1.49-.893-.799-1.484-1.781-1.66-2.079-.176-.3-.019-.461.13-.61.136-.13.301-.34.452-.51.15-.17.2-.29.3-.49.099-.2.05-.37-.025-.52-.075-.149-.672-1.62-.922-2.21-.24-.584-.486-.51-.672-.51-.172-.01-.371-.01-.571-.01-.2 0-.522.074-.796.372-.273.3-1.045 1.02-1.045 2.48 0 1.462 1.07 2.88 1.22 3.08.149.2 2.09 3.2 5.14 4.487.719.31 1.282.5 1.722.645.724.227 1.38.195 1.9.118.58-.085 1.786-.733 2.037-1.439.251-.707.251-1.32.175-1.447-.074-.13-.273-.21-.573-.36m-5.543 7.548c-1.901 0-3.77-.506-5.4-1.46l-.387-.23-4.003 1.05 1.067-3.9-.25-.396A10.962 10.962 0 011.001 12c0-6.065 4.935-11 11-11s11 4.935 11 11-4.935 11-11 11m0-22C4.486 0 0 4.486 0 10c0 1.75.45 3.467 1.31 4.98L0 22l7.2-1.9A10.954 10.954 0 0011.955 22c6.515 0 11.8-5.3 11.8-11.8 0-6.5-5.285-11.8-11.8-11.8"/>
                  </svg>
                </span>
                <a href="https://wa.me/34616863736" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition duration-300">
                  +34 616 86 37 36
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright y redes sociales */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-green-700 w-full max-w-6xl text-center md:text-left">
          <p className="text-sm text-gray-300 mb-4 md:mb-0">
            © {new Date().getFullYear()} OSUCOMPOST. Todos los derechos reservados.
          </p>
          
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/osucompost" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.272.644 1.772 1.153.509.5.902 1.104 1.153 1.772.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.903 4.903 0 01-1.153 1.772c-.5.509-1.104.902-1.772 1.153-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.903 4.903 0 01-1.772-1.153 4.903 4.903 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.903 4.903 0 011.153-1.772A4.903 4.903 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
            </a>
            <a href="https://wa.me/34616863736" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300">
              <span className="sr-only">WhatsApp</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.754.966-.925 1.164-.17.199-.343.223-.643.074-.3-.15-1.268-.468-2.414-1.49-.893-.799-1.484-1.781-1.66-2.079-.176-.3-.019-.461.13-.61.136-.13.301-.34.452-.51.15-.17.2-.29.3-.49.099-.2.05-.37-.025-.52-.075-.149-.672-1.62-.922-2.21-.24-.584-.486-.51-.672-.51-.172-.01-.371-.01-.571-.01-.2 0-.522.074-.796.372-.273.3-1.045 1.02-1.045 2.48 0 1.462 1.07 2.88 1.22 3.08.149.2 2.09 3.2 5.14 4.487.719.31 1.282.5 1.722.645.724.227 1.38.195 1.9.118.58-.085 1.786-.733 2.037-1.439.251-.707.251-1.32.175-1.447-.074-.13-.273-.21-.573-.36m-5.543 7.548c-1.901 0-3.77-.506-5.4-1.46l-.387-.23-4.003 1.05 1.067-3.9-.25-.396A10.962 10.962 0 011.001 12c0-6.065 4.935-11 11-11s11 4.935 11 11-4.935 11-11 11m0-22C4.486 0 0 4.486 0 10c0 1.75.45 3.467 1.31 4.98L0 22l7.2-1.9A10.954 10.954 0 0011.955 22c6.515 0 11.8-5.3 11.8-11.8 0-6.5-5.285-11.8-11.8-11.8"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Modal de política de privacidad */}
      <PrivacyPolicyModal isOpen={isModalOpen} closeModal={closeModal} />
    </footer>
  );
};

export default Footer;