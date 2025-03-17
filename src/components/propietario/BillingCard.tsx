'use client';
import { Facturacion } from '@/types/types';
import { Receipt, FileText } from 'lucide-react';
import './dashboard-styles.css';

interface BillingCardProps {
  facturaciones: Facturacion[];
}

const BillingCard = ({ facturaciones }: BillingCardProps) => {
  // Calcular el total facturado
  const totalFacturado = facturaciones.reduce((sum, factura) => sum + factura.total, 0);

  return (
    <div className="dashboard-card card-yellow animate-fadeIn" style={{ animationDelay: '0.4s' }}>
      <div className="card-header">
        <h2 className="card-title">
          <Receipt size={24} />
          Facturaciones
        </h2>
        {facturaciones.length > 0 && (
          <div className="badge badge-yellow">
            Total: {totalFacturado.toFixed(2)}€
          </div>
        )}
      </div>
      <div className="card-body">
        {facturaciones.length > 0 ? (
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="w-4/6">Tipo Residuo</th>
                  <th className="w-2/6 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {facturaciones.map((factura, index) => (
                  <tr 
                    key={index} 
                    className="animate-fadeIn"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${factura.tipoResiduo.descripcion === 'Orgánico' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        {factura.tipoResiduo.descripcion}
                      </div>
                    </td>
                    <td className="text-right">
                      <span className="amount">{factura.total.toFixed(2)}€</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <FileText size={48} className="text-yellow-300 mb-4" />
            <p className="text-yellow-600">No hay facturaciones registradas.</p>
            <p className="text-sm text-gray-500 mt-2">Las facturas aparecerán aquí una vez procesadas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingCard;