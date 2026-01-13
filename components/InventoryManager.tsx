
import React, { useState } from 'react';
import { Product, InventoryMovement, MovementType } from '../types';
import { CURRENCY } from '../constants';
import { ArrowDownLeft, ArrowUpRight, History, Package, Search } from 'lucide-react';

interface InventoryManagerProps {
  products: Product[];
  movements: InventoryMovement[];
  onStockUpdate: (productId: string, quantity: number, type: MovementType, note?: string) => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ products, movements, onStockUpdate }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [movementType, setMovementType] = useState<MovementType.IN | MovementType.OUT>(MovementType.IN);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0) return;
    onStockUpdate(selectedProductId, quantity, movementType, note);
    setQuantity(1);
    setNote('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stock Update Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Movimiento de Stock
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Producto</label>
              <select 
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option value="">Seleccionar producto...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setMovementType(MovementType.IN)}
                className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border text-sm font-semibold transition-all ${movementType === MovementType.IN ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                <ArrowDownLeft className="w-4 h-4" /> Ingreso
              </button>
              <button 
                type="button"
                onClick={() => setMovementType(MovementType.OUT)}
                className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border text-sm font-semibold transition-all ${movementType === MovementType.OUT ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                <ArrowUpRight className="w-4 h-4" /> Salida
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Cantidad</label>
              <input 
                type="number" 
                min="1"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Nota / Motivo</label>
              <textarea 
                rows={2}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Ej: Importación Temu #123"
                className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={!selectedProductId}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Registrar Movimiento
            </button>
          </form>
        </div>

        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-600 mt-1">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900">Consejo de Stock</h4>
            <p className="text-sm text-amber-700 mt-1 leading-relaxed">
              Mantén el stock de seguridad para productos importados, ya que el reabastecimiento desde Temu puede tardar entre 7 y 15 días.
            </p>
          </div>
        </div>
      </div>

      {/* History Panel */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b flex items-center justify-between bg-slate-50">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Historial de Movimientos
          </h3>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white border-b border-slate-200 z-10">
              <tr>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Fecha</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Producto</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400 text-center">Tipo</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400 text-right">Cant.</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400 italic">No hay movimientos registrados</td>
                </tr>
              ) : (
                movements.map(m => {
                  const p = products.find(prod => prod.id === m.productId);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(m.date).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 font-medium text-slate-800 text-sm">{p?.name || 'Producto Eliminado'}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          m.type === MovementType.IN ? 'bg-emerald-100 text-emerald-700' :
                          m.type === MovementType.OUT ? 'bg-rose-100 text-rose-700' :
                          m.type === MovementType.SALE ? 'bg-indigo-100 text-indigo-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {m.type}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900 text-sm">{m.quantity}</td>
                      <td className="p-4 text-xs text-slate-500 max-w-[200px] truncate">{m.note || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
