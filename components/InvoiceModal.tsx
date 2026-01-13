
import React from 'react';
import { Sale } from '../types';
import { CURRENCY } from '../constants';
import { Printer, X, ShoppingBag, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  sale: Sale;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ sale, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300 no-print">
        {/* Header Controls */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div className="flex gap-3">
            <button 
              onClick={handlePrint} 
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <Printer className="w-5 h-5" /> Imprimir Comprobante
            </button>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-600 transition-colors"><X className="w-8 h-8" /></button>
        </div>

        {/* Invoice Body (The part that prints) */}
        <div id="invoice-content" className="p-10 bg-white text-slate-900 overflow-y-auto max-h-[70vh]">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="bg-indigo-600 p-4 rounded-3xl mb-4 shadow-xl">
               <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">TechStyle<span className="text-indigo-600">Store</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Soluciones Tecnológicas de Vanguardia</p>
            <div className="mt-4 space-y-1">
              <p className="text-xs text-slate-500 font-medium italic">RUC: 20934031164</p>
              <p className="text-xs text-slate-400">Lima, Perú • techstyle@support.pe</p>
            </div>
          </div>

          <div className="flex justify-between items-start border-y border-slate-100 py-6 mb-8">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CLIENTE</p>
              <h2 className="text-sm font-black text-slate-800">{sale.customer?.name || 'PÚBLICO GENERAL'}</h2>
              <p className="text-xs text-slate-500 font-bold">{sale.customer ? `${sale.customer.type}: ${sale.customer.number}` : '-'}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{sale.customer?.type === 'RUC' ? 'FACTURA ELECTRÓNICA' : 'BOLETA ELECTRÓNICA'}</p>
              <h2 className="text-sm font-black text-slate-900">{sale.orderNumber}</h2>
              <p className="text-xs text-slate-400 font-medium">{new Date(sale.date).toLocaleString('es-PE')}</p>
            </div>
          </div>

          <table className="w-full text-xs mb-8">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="py-3 text-left font-black uppercase tracking-wider">Descripción</th>
                <th className="py-3 text-center font-black uppercase tracking-wider">Cant.</th>
                <th className="py-3 text-right font-black uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sale.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-bold text-slate-700">{item.name}</td>
                  <td className="py-4 text-center font-medium">{item.quantity}</td>
                  <td className="py-4 text-right font-black">{CURRENCY} {item.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-2 border-t border-slate-100 pt-6">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Op. Gravadas</span>
              <span>{CURRENCY} {(sale.total / 1.18).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>IGV (18%)</span>
              <span>{CURRENCY} {(sale.total - (sale.total / 1.18)).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-slate-900 pt-4 mt-4 border-t-2 border-slate-900">
              <span>PAGO TOTAL</span>
              <span className="text-indigo-600">{CURRENCY} {sale.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-dashed border-slate-200 flex items-center justify-between gap-8">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">PAGO VÍA {sale.paymentMethod}</span>
              </div>
              <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase">
                Representación impresa del comprobante electrónico oficial de TechStyleStore. Consulta validez en SUNAT. ¡Disfruta tu compra!
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner">
               <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=TechStyle|${sale.orderNumber}|${sale.total}`} 
                alt="SUNAT QR" 
                className="w-20 h-20"
               />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Print Only Component */}
      <div className="print-only p-12 bg-white min-h-screen">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-black uppercase tracking-tighter">TechStyleStore</h1>
            <p className="text-sm font-bold text-slate-500">RUC: 20934031164</p>
            <p className="text-sm">Lima, Perú</p>
          </div>
          <div className="flex justify-between border-y-2 border-slate-900 py-6 mb-8">
             <div>
               <p className="text-[10px] font-black uppercase mb-1">Cliente</p>
               <p className="font-black text-lg">{sale.customer?.name || 'PÚBLICO GENERAL'}</p>
               <p className="text-sm font-bold">{sale.customer?.type}: {sale.customer?.number}</p>
             </div>
             <div className="text-right">
               <p className="text-[10px] font-black uppercase mb-1">{sale.customer?.type === 'RUC' ? 'Factura' : 'Boleta'}</p>
               <p className="font-black text-lg text-indigo-600">{sale.orderNumber}</p>
               <p className="text-sm font-bold">{new Date(sale.date).toLocaleDateString('es-PE')}</p>
             </div>
          </div>
          <table className="w-full mb-10">
            <thead className="border-b-2 border-slate-900">
              <tr>
                <th className="text-left py-4 font-black uppercase text-xs">Producto</th>
                <th className="text-center py-4 font-black uppercase text-xs">Cant.</th>
                <th className="text-right py-4 font-black uppercase text-xs">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sale.items.map((i, idx) => (
                <tr key={idx}>
                  <td className="py-4 font-bold">{i.name}</td>
                  <td className="text-center py-4">{i.quantity}</td>
                  <td className="text-right py-4 font-black">{CURRENCY} {i.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end pt-6 border-t-4 border-slate-900">
            <div className="text-right">
              <span className="text-xs font-black uppercase mr-4">Total a Pagar</span>
              <span className="text-3xl font-black">{CURRENCY} {sale.total}</span>
            </div>
          </div>
          <div className="mt-20 text-center border-t border-slate-200 pt-10">
            <p className="text-sm font-black uppercase tracking-widest">¡Gracias por elegir TechStyle!</p>
            <p className="text-[10px] text-slate-400 mt-2 uppercase">Comprobante de venta electrónico • www.techstyle.pe</p>
          </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
