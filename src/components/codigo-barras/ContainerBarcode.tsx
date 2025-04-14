import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import axios from 'axios';

interface Contenedor {
  id: number;

  // Añade aquí otras propiedades que tenga tu contenedor
}

interface ContainerBarcodeProps {
  containerId?: string; // ID opcional como prop
  width?: number;
  height?: number;
  format?: string;
  displayValue?: boolean;
  fontSize?: number;
  className?: string;
}

const ContainerBarcode: React.FC<ContainerBarcodeProps> = ({
  containerId,
  width = 2,
  height = 100,
  format = 'CODE128',
  displayValue = true,
  fontSize = 20,
  className = '',
}) => {
  const [contenedores, setContenedores] = useState<Contenedor[]>([]);
  const [selectedContainerId, setSelectedContainerId] = useState<string>(containerId || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Función para cargar la lista de contenedores
  const fetchContenedores = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://82.165.142.177:8083/api/contenedores');
      setContenedores(response.data);
      // Si no hay un ID seleccionado y tenemos contenedores, selecciona el primero
      if (!selectedContainerId && response.data.length > 0) {
        setSelectedContainerId(response.data[0].id);
      }
    } catch (err) {
      setError('Error al cargar los contenedores. Por favor, intenta de nuevo más tarde.');
      console.error('Error fetching contenedores:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar contenedores al montar el componente
  useEffect(() => {
    fetchContenedores();
  }, []);

  // Generar código de barras cuando cambia el ID seleccionado
  useEffect(() => {
    if (selectedContainerId && svgRef.current) {
      try {
        JsBarcode(svgRef.current, selectedContainerId, {
          format,
          width,
          height,
          displayValue,
          fontSize,
          text: `Contenedor: ${selectedContainerId}`,
        });
      } catch (err) {
        console.error('Error generating barcode:', err);
        setError('Error al generar el código de barras. Verifica el ID del contenedor.');
      }
    }
  }, [selectedContainerId, format, width, height, displayValue, fontSize]);

  // Manejar cambio en el selector de contenedores
  const handleContainerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContainerId(event.target.value);
  };

  // Manejar impresión del código de barras
  const handlePrint = () => {
    const svgContent = svgRef.current?.outerHTML;
    if (!svgContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permite las ventanas emergentes para imprimir el código de barras.');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Código de Barras - Contenedor ${selectedContainerId}</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            svg {
              max-width: 100%;
              height: auto;
            }
            @media print {
              @page {
                size: auto;
                margin: 10mm;
              }
            }
          </style>
        </head>
        <body>
          ${svgContent}
          <script>
            window.onload = function() {
              window.print();
              window.setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className={`container-barcode ${className}`}>
      <div className="mb-4 barcode-controls">
        <div className="form-group">
          <label htmlFor="container-select" className="block mb-2 font-bold">
            Selecciona un Contenedor:
          </label>
          <select
            id="container-select"
            value={selectedContainerId}
            onChange={handleContainerChange}
            disabled={loading}
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="">-- Seleccionar Contenedor --</option>
            {contenedores.map((contenedor) => (
              <option key={contenedor.id} value={contenedor.id}>
                {contenedor.id}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handlePrint}
          disabled={!selectedContainerId}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Imprimir Código de Barras
        </button>
      </div>
      
      {loading && <p className="text-gray-600">Cargando contenedores...</p>}
      {error && <p className="text-red-600">{error}</p>}
      
      <div className="mt-4 text-center barcode-container">
        {selectedContainerId ? (
          <svg ref={svgRef} className="mx-auto"></svg>
        ) : (
          <p className="text-gray-600">Selecciona un contenedor para generar su código de barras</p>
        )}
      </div>
    </div>
  );
};

export default ContainerBarcode;