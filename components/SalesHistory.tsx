
import React, { useState, useMemo } from 'react';
import { Sale, Category, Product } from '../types';
import { CURRENCY } from '../constants';
import { Filter, Search, Calendar, User, Eye, Ban, Download, ChevronRight, X } from 'lucide-react';
import InvoiceModal from './InvoiceModal';

interface SalesHistoryProps {
  sales: Sale[];
  categories: Category[];
  products: Product[];
  onAnnulSale: (id: string) => void;
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales, categories, products, onAnnulSale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODAS' | 'COMPLETA' | 'ANULADA'>('TODAS');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchSearch = sale.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (sale.customer?.name.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchDate = dateFilter ? sale.date.startsWith(dateFilter) : true;
      const matchStatus = statusFilter === 'TODAS' ? true : sale.status === statusFilter;
      return matchSearch && matchDate && matchStatus;
    });
  }, [sales, searchTerm, dateFilter, statusFilter]);

  const handleAnnul = (id: string) => {
    if (confirm('¿Estás seguro de ANULAR esta venta? Los productos regresarán al inventario automáticamente.')) {
      onAnnulSale(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Detalle de Ventas</h2>
          <p className="text-slate-500 text-sm">Consulta el historial completo y gestiona anulaciones.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar por correlativo o cliente..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="TODAS">Todos los Estados</option>
            <option value="COMPLETA">Completas</option>
            <option value="ANULADA">Anuladas</option>
          </select>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Fecha / Hora</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Nro. Orden</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Cliente</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Metodo</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400 text-right">Total</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400 text-center">Estado</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 italic">No se encontraron ventas con los filtros aplicados.</td>
                </tr>
              ) : (
                filteredSales.map(sale => (
                  <tr key={sale.id} className={`hover:bg-slate-50 transition-colors ${sale.status === 'ANULADA' ? 'bg-rose-50/30' : ''}`}>
                    <td className="p-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {new Date(sale.date).toLocaleDateString('es-PE')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(sale.date).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-bold text-indigo-600">{sale.orderNumber}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-700">{sale.customer?.name || 'PUBLICO GENERAL'}</div>
                      <div className="text-[10px] text-slate-400">{sale.customer?.number || '-'}</div>
                    </td>
                    <td className="p-4">
                       <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border">
                        {sale.paymentMethod}
                       </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-bold text-slate-900">{CURRENCY} {sale.total.toLocaleString()}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        sale.status === 'COMPLETA' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedSale(sale)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Ver Comprobante"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {sale.status !== 'ANULADA' && (
                          <button 
                            onClick={() => handleAnnul(sale.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Anular Venta"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSale && (
        <InvoiceModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
      )}
    </div>
  );
};

export default SalesHistory;
