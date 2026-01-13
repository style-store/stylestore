
import React, { useState, useMemo } from 'react';
import { Product, Sale, SaleItem, CustomerData } from '../types';
import { ShoppingBag, ShoppingCart, Search, Plus, Minus, Trash2, User, Receipt, CheckCircle2, QrCode, X } from 'lucide-react';
import { CURRENCY } from '../constants';
import InvoiceModal from './InvoiceModal';

interface SalesPointProps {
  products: Product[];
  onSaleComplete: (sale: Sale) => void;
}

const SalesPoint: React.FC<SalesPointProps> = ({ products, onSaleComplete }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customer, setCustomer] = useState<CustomerData | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('EFECTIVO');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Sin stock disponible');
      return;
    }
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert('Stock máximo alcanzado');
        return;
      }
      setCart(cart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price } : i));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, quantity: 1, price: product.salePrice, subtotal: product.salePrice }]);
    }
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    const item = cart.find(i => i.productId === productId);
    const prod = products.find(p => p.id === productId);
    if (!item || !prod) return;
    
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      setCart(cart.filter(i => i.productId !== productId));
    } else if (newQty > prod.stock) {
      alert('Stock insuficiente');
    } else {
      setCart(cart.map(i => i.productId === productId ? { ...i, quantity: newQty, subtotal: newQty * i.price } : i));
    }
  };

  const total = cart.reduce((acc, i) => acc + i.subtotal, 0);

  const handleProcessSale = () => {
    if (cart.length === 0) return;
    
    // Calculate profit
    let totalProfit = 0;
    cart.forEach(item => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        totalProfit += (item.price - p.purchasePrice) * item.quantity;
      }
    });

    const newSale: Sale = {
      id: crypto.randomUUID(),
      orderNumber: `VENTA-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: [...cart],
      total,
      totalProfit,
      customer,
      paymentMethod,
      status: 'COMPLETA',
      sellerName: 'Admin TecnoPeru'
    };

    onSaleComplete(newSale);
    setCompletedSale(newSale);
    setIsSuccess(true);
    setCart([]);
    setCustomer(undefined);
    
    // Auto hide success message after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Product Selection */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Escribe el nombre o SKU del producto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-lg shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className={`
                bg-white p-4 rounded-2xl border text-left transition-all relative overflow-hidden group
                ${product.stock <= 0 ? 'opacity-60 grayscale' : 'hover:border-indigo-500 hover:shadow-md active:scale-95'}
              `}
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{product.name}</h4>
                  <p className="text-xs text-slate-500">{product.sku}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-indigo-600">{CURRENCY} {product.salePrice}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stock <= product.minStock ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                  STOCK: {product.stock}
                </span>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-indigo-600 text-white p-1 rounded-full"><Plus className="w-4 h-4" /></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              Carrito de Compra
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-full border">{cart.length} items</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-3"><ShoppingCart className="w-8 h-8" /></div>
                <p className="text-sm font-medium">Empieza agregando productos al carrito para realizar una venta.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.productId} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold text-slate-900 truncate">{item.name}</h5>
                    <p className="text-xs text-slate-500">{CURRENCY} {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCartQuantity(item.productId, -1)} className="p-1 hover:bg-slate-200 rounded-lg"><Minus className="w-4 h-4" /></button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.productId, 1)} className="p-1 hover:bg-slate-200 rounded-lg"><Plus className="w-4 h-4" /></button>
                    <button onClick={() => setCart(cart.filter(i => i.productId !== item.productId))} className="p-1 hover:bg-rose-100 text-rose-500 rounded-lg ml-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t space-y-4">
            {/* Customer Toggle */}
            <div className="space-y-2">
               <button 
                onClick={() => setCustomer(customer ? undefined : { type: 'DNI', number: '', name: '' })}
                className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest"
               >
                 <User className="w-4 h-4" />
                 {customer ? 'Quitar Cliente' : 'Añadir Datos de Factura'}
               </button>
               {customer && (
                 <div className="space-y-2 animate-in slide-in-from-top duration-200">
                   <div className="flex gap-2">
                     <select 
                      value={customer.type}
                      onChange={e => setCustomer({...customer, type: e.target.value as any})}
                      className="p-2 border rounded-xl text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     >
                       <option value="DNI">DNI</option>
                       <option value="RUC">RUC</option>
                     </select>
                     <input 
                       type="text"
                       placeholder={customer.type === 'DNI' ? '8 dígitos' : '11 dígitos'}
                       value={customer.number}
                       onChange={e => setCustomer({...customer, number: e.target.value})}
                       className="flex-1 p-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     />
                   </div>
                   <input 
                     type="text"
                     placeholder="Nombre o Razón Social"
                     value={customer.name}
                     onChange={e => setCustomer({...customer, name: e.target.value})}
                     className="w-full p-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   />
                 </div>
               )}
            </div>

            {/* Payment Method */}
            <div className="grid grid-cols-3 gap-2">
              {(['EFECTIVO', 'YAPE', 'PLIN'] as const).map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`
                    flex items-center justify-center gap-2 p-2 rounded-xl border text-[10px] font-bold transition-all
                    ${paymentMethod === method ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}
                  `}
                >
                  {method === 'YAPE' || method === 'PLIN' ? <QrCode className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                  {method}
                </button>
              ))}
            </div>

            {/* Totals */}
            <div className="flex items-center justify-between py-2 border-t border-slate-200">
              <span className="text-slate-500 font-bold">TOTAL</span>
              <span className="text-2xl font-black text-indigo-600">{CURRENCY} {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
            </div>

            <button
              onClick={handleProcessSale}
              disabled={cart.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all disabled:grayscale disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              REGISTRAR VENTA
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {isSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-8 duration-500">
          <div className="bg-white/20 p-2 rounded-full"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <h4 className="font-bold">¡Venta Exitosa!</h4>
            <p className="text-sm opacity-90">El stock ha sido actualizado correctamente.</p>
          </div>
          <div className="flex gap-2 ml-4">
            <button 
              onClick={() => { setShowInvoiceModal(true); setIsSuccess(false); }}
              className="bg-white text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors"
            >
              VER COMPROBANTE
            </button>
            <button onClick={() => setIsSuccess(false)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}

      {/* Modal Factura */}
      {showInvoiceModal && completedSale && (
        <InvoiceModal 
          sale={completedSale} 
          onClose={() => setShowInvoiceModal(false)} 
        />
      )}
    </div>
  );
};

const DollarSign = ({ className }: { className: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;

export default SalesPoint;
