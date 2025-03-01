
'use client';
import { useState } from 'react';

interface Propietario {
  dni: string;
  nombre?: string;
  apellidos?: string;
  // añade otros campos según la estructura de tu API
}

export default function BuscarPropietario() {
  const [dni, setDni] = useState('');
  const [propietario, setPropietario] = useState<Propietario | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const buscarPropietario = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPropietario(null);

    try {
      const response = await fetch(`http://localhost:8080/api/v1/get/propietarios/${dni}`);
      if (!response.ok) {
        throw new Error('Propietario no encontrado');
      }
      const data = await response.json();
      setPropietario(data);
    } catch (error) {
      setError('Error al buscar el propietario');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Buscar Propietario</h2>
      
      <form onSubmit={buscarPropietario} className="mb-4">
        <input
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Introduce DNI"
          className="border p-2 mr-2"
          required
        />
        <button 
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {propietario && (
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">Información del Propietario</h3>
          <p>DNI: {propietario.dni}</p>
          {propietario.nombre && <p>Nombre: {propietario.nombre}</p>}
          {propietario.apellidos && <p>Apellidos: {propietario.apellidos}</p>}
          {/* Añade más campos según la estructura de tu API */}
        </div>
      )}
    </div>
  );
}