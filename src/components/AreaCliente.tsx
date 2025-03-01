import React from "react";
import { Propietario, } from "../types/types";

interface AreaClienteProps {
    propietario: Propietario;
    viviendas: Vivienda[];
    error?: string;
}

const AreaCliente: React.FC<AreaClienteProps> = ({ propietario, viviendas, error }) => {
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Área de Cliente</h1>
            <h2>Información del Propietario</h2>
            <p>Nombre: {propietario.nombre}</p>
            <p>DNI: {propietario.dni}</p>
            <p>Teléfono: {propietario.telefono}</p>
            <p>Email: {propietario.email}</p>

            <h2>Viviendas</h2>
            {viviendas.length > 0 ? (
                <ul>
                    {viviendas.map((vivienda) => (
                        <li key={vivienda.id_vivienda}>
                            Dirección: {vivienda.direccion}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay viviendas asociadas.</p>
            )}
        </div>
    );
};

export default AreaCliente;