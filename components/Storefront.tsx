
import React, { useState, useMemo } from 'react';
import { Product, Category, Sale, SaleItem, CustomerData } from '../types';
import { ShoppingCart, Search, User, Menu, Bell, Heart, Star, ShoppingBag, X, Zap, ArrowRight, CheckCircle2, QrCode, Plus, Minus, Share2, ShieldCheck, Truck, Facebook, Instagram, Twitter } from 'lucide-react';
import { CURRENCY } from '../constants';
import InvoiceModal from './InvoiceModal';

interface StorefrontProps {
  products: Product[];
  categories: Category[];
  onAdminLogin: () => void;
  onSaleComplete: (sale: Sale) => void;
}

const Storefront: React.FC<StorefrontProps> = ({ products, categories, onAdminLogin, onSaleComplete }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment'>('cart');
  const [customer, setCustomer] = useState<CustomerData>({ type: 'DNI', number: '', name: '' });
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'YAPE' | 'PLIN'>('YAPE');
  const [isSuccess, setIsSuccess] = useState(false);
  const [addedToCartSuccess, setAddedToCartSuccess] = useState<string | null>(null);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  
  // Detail Modal State
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory ? p.categoryId === selectedCategory : true;
    return matchesSearch && matchesCat;
  });

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return alert('Sin stock disponible');
      setCart(cart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price } : i));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, quantity: 1, price: product.salePrice, subtotal: product.salePrice }]);
    }
    
    // Show "Added to cart" success message
    setAddedToCartSuccess(product.name);
    setTimeout(() => setAddedToCartSuccess(null), 3000);
  };

  const totals = useMemo(() => {
    const totalQty = cart.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = cart.reduce((acc, i) => acc + i.subtotal, 0);
    const standardShipping = 15;
    
    const shippingCost = totalQty >= 3 ? 0 : standardShipping;
    
    return { subtotal, shippingCost, total: subtotal + shippingCost, hasPromo: totalQty >= 3 };
  }, [cart]);

  const handleCheckout = () => {
    if (!customer.name || !customer.number) return alert('Por favor, completa tus datos');
    
    const newSale: Sale = {
      id: crypto.randomUUID(),
      orderNumber: `TS-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: totals.total,
      totalProfit: totals.total - cart.reduce((acc, i) => {
        const p = products.find(prod => prod.id === i.productId);
        return acc + (p?.purchasePrice || 0) * i.quantity;
      }, 0),
      customer,
      paymentMethod,
      status: 'COMPLETA',
      sellerName: 'TechStyleStore Virtual'
    };

    onSaleComplete(newSale);
    setCompletedSale(newSale);
    setIsSuccess(true);
    setCart([]);
    setShowCart(false);
    setCheckoutStep('cart');
    
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Promotion Banner */}
      <div className="bg-indigo-600 text-white text-center py-2 text-xs font-bold flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 animate-pulse">
          <Zap className="w-4 h-4 fill-white" />
          <span>¡OFERTA TechStyleStore! A partir del 3er producto se realiza el envío gratis</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelectedCategory(null); setViewingProduct(null); }}>
            <div className="bg-indigo-600 p-2 rounded-xl">
              <ShoppingBag className="text-white w-6 h-6" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 hidden md:block">TechStyle<span className="text-indigo-600">Store</span></span>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Busca tecnología, laptops, audífonos..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onAdminLogin} className="p-2 text-slate-600 hover:bg-slate-50 rounded-full flex items-center gap-1">
              <User className="w-6 h-6" />
              <span className="text-xs font-bold hidden md:block">Ingresar</span>
            </button>
            <button 
              onClick={() => setShowCart(true)}
              className="p-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-full relative transition-all"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-4 overflow-x-auto no-scrollbar bg-white">
          <button 
            onClick={() => { setSelectedCategory(null); setViewingProduct(null); }}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold transition-all ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Todos los productos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setViewingProduct(null); }}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all group cursor-pointer relative"
              onClick={() => { setViewingProduct(product); setActiveImageIdx(0); }}
            >
              <div className="aspect-square relative overflow-hidden bg-slate-50">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {product.stock <= product.minStock && product.stock > 0 && (
                  <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-wider">Stock Bajo</div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center font-black text-slate-400 uppercase">Sin Stock</div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 h-10 leading-tight group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-1 text-[10px] text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  <span className="text-slate-400 font-medium ml-1">4.8 (100+)</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-indigo-600 text-xl font-black">{CURRENCY} {product.salePrice.toFixed(2)}</span>
                  <div 
                    onClick={(e) => addToCart(product, e)}
                    className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-indigo-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Slogan */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <ShoppingBag className="text-white w-6 h-6" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white">TechStyle<span className="text-indigo-500">Store</span></span>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              Llevando la tecnología de vanguardia directamente a tu puerta. Importaciones certificadas, envíos seguros y el mejor servicio post-venta del Perú.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-indigo-600 transition-colors text-white"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-indigo-600 transition-colors text-white"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-indigo-600 transition-colors text-white"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">Catálogo</h4>
            <ul className="space-y-3 text-sm font-medium">
              {categories.slice(0, 4).map(c => (
                <li key={c.id}>
                  <button onClick={() => setSelectedCategory(c.id)} className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-indigo-500" />
                    {c.name}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => setSelectedCategory(null)} className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 text-indigo-500" />
                  Ver Todo
                </button>
              </li>
            </ul>
          </div>

          {/* Service */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">Servicio al Cliente</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Seguimiento de Pedido</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Políticas de Devolución</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Trabaja con Nosotros</a></li>
            </ul>
          </div>

          {/* Payment & Trust */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">Confianza y Pagos</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800 p-2 rounded-lg flex items-center justify-center border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer">
                <QrCode className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="bg-slate-800 p-2 rounded-lg flex items-center justify-center border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">Envío Garantizado</p>
              <p className="text-xs opacity-70">A partir de tu 3er producto el envío es 100% gratis a nivel nacional.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-center md:text-left">
            © 2026 TechStyleStore. Copyright derechos reservados 2026.
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest opacity-40">
            <a href="#" className="hover:opacity-100 transition-opacity">Términos</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Privacidad</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Libro de Reclamaciones</a>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewingProduct(null)} />
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in slide-in-from-bottom duration-300 flex flex-col md:flex-row h-full md:h-auto max-h-[95vh]">
            <button 
              onClick={() => setViewingProduct(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors md:hidden"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Gallery Section */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col gap-4">
               <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 relative group">
                  <img 
                    src={viewingProduct.images?.[activeImageIdx] || viewingProduct.imageUrl} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={viewingProduct.name} 
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all"><Heart className="w-5 h-5" /></button>
                    <button className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all"><Share2 className="w-5 h-5" /></button>
                  </div>
               </div>
               <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                 {(viewingProduct.images || [viewingProduct.imageUrl]).map((img, idx) => (
                   <button 
                     key={idx} 
                     onClick={() => setActiveImageIdx(idx)}
                     className={`w-20 h-20 rounded-2xl overflow-hidden border-4 transition-all flex-shrink-0 ${activeImageIdx === idx ? 'border-indigo-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                   >
                     <img src={img} className="w-full h-full object-cover" alt="" />
                   </button>
                 ))}
               </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 p-6 md:p-10 md:pl-0 flex flex-col overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Tecnología Certificada</span>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">En Stock</span>
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">{viewingProduct.name}</h2>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  <span className="text-slate-900 font-black text-sm ml-1">4.9</span>
                </div>
                <span className="text-slate-400 text-sm">|</span>
                <span className="text-slate-500 text-sm font-medium">4.1K+ ventas registradas</span>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
                <div className="flex items-baseline gap-3 mb-1">
                   <span className="text-4xl font-black text-indigo-600">{CURRENCY} {viewingProduct.salePrice.toFixed(2)}</span>
                   <span className="text-slate-300 text-sm line-through font-bold">{CURRENCY} {(viewingProduct.salePrice * 1.45).toFixed(2)}</span>
                   <span className="bg-[#fb7701] text-white text-xs font-black px-2 py-0.5 rounded-lg">-45%</span>
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest italic">Mejor precio garantizado en TechStyleStore</p>
              </div>

              <div className="space-y-6 mb-10">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Descripción</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{viewingProduct.description || 'No hay descripción detallada disponible para este producto en este momento.'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="bg-indigo-600 p-2 rounded-xl text-white"><Truck className="w-5 h-5" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-900">Envío Gratis</p>
                        <p className="text-[9px] text-slate-400">Desde 3 productos</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="bg-emerald-600 p-2 rounded-xl text-white"><ShieldCheck className="w-5 h-5" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-900">Garantía Oficial</p>
                        <p className="text-[9px] text-slate-400">12 Meses TechStyle</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="mt-auto flex gap-4 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => addToCart(viewingProduct)}
                  className="flex-1 bg-[#fb7701] text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-[#fb7701]/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-tighter"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Añadir al Carrito
                </button>
                <button 
                  onClick={() => setViewingProduct(null)}
                  className="hidden md:flex items-center justify-center px-8 py-5 bg-slate-900 text-white rounded-3xl font-black hover:bg-slate-800 transition-all uppercase tracking-tighter"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowCart(false)} />
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in slide-in-from-bottom duration-300 flex flex-col max-h-[92vh]">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-indigo-400" />
                  Mi Pedido
                </h3>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">TechStyleStore Experience</p>
              </div>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-7 h-7" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="font-bold text-lg">Tu carrito está vacío</p>
                  <button onClick={() => setShowCart(false)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm">Comprar ahora</button>
                </div>
              ) : (
                <>
                  {/* Progress bar */}
                  <div className="flex items-center justify-between mb-8 px-4">
                    {(['cart', 'details', 'payment'] as const).map((step, idx) => (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${checkoutStep === step ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                          {idx + 1}
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${checkoutStep === step ? 'text-indigo-600' : 'text-slate-400'}`}>
                          {step === 'cart' ? 'Orden' : step === 'details' ? 'Datos' : 'Pago'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {checkoutStep === 'cart' && (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.productId} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                          <img src={products.find(p => p.id === item.productId)?.imageUrl} className="w-20 h-20 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 truncate">{item.name}</h4>
                            <p className="text-lg font-black text-indigo-600 mt-1">{CURRENCY} {item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-4 mt-2">
                               <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1">
                                 <button onClick={() => {
                                   const newQty = item.quantity - 1;
                                   if (newQty <= 0) setCart(cart.filter(i => i.productId !== item.productId));
                                   else setCart(cart.map(i => i.productId === item.productId ? {...i, quantity: newQty, subtotal: newQty * i.price} : i));
                                 }} className="w-8 h-8 hover:bg-slate-100 rounded-lg flex items-center justify-center"><Minus className="w-4 h-4 text-slate-400"/></button>
                                 <span className="text-sm font-black w-10 text-center">{item.quantity}</span>
                                 <button onClick={() => {
                                   const p = products.find(prod => prod.id === item.productId);
                                   if (p && item.quantity < p.stock) setCart(cart.map(i => i.productId === item.productId ? {...i, quantity: i.quantity + 1, subtotal: (i.quantity+1)*i.price} : i));
                                 }} className="w-8 h-8 hover:bg-slate-100 rounded-lg flex items-center justify-center"><Plus className="w-4 h-4 text-slate-400"/></button>
                               </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {!totals.hasPromo && (
                        <div className="bg-amber-50 p-4 rounded-2xl flex items-center gap-4 border border-amber-100">
                          <Zap className="w-8 h-8 text-amber-500 fill-amber-500" />
                          <div>
                            <p className="font-black text-sm uppercase text-amber-700">¡Casi ahí!</p>
                            <p className="text-[10px] text-amber-600 leading-tight">Agrega {3 - cart.reduce((acc, i) => acc + i.quantity, 0)} productos más para obtener ENVÍO GRATIS.</p>
                          </div>
                        </div>
                      )}
                      {totals.hasPromo && (
                        <div className="bg-emerald-600 p-4 rounded-2xl flex items-center gap-4 text-white shadow-xl">
                          <CheckCircle2 className="w-8 h-8 fill-white" />
                          <div>
                            <p className="font-black text-sm uppercase">¡ENVÍO GRATIS APLICADO!</p>
                            <p className="text-[10px] opacity-90 leading-tight">A partir del 3er producto el envío no tiene costo.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {checkoutStep === 'details' && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Completo</label>
                        <input value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none text-sm transition-all" placeholder="Ej: Juan Perez" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo Doc.</label>
                          <select value={customer.type} onChange={e => setCustomer({...customer, type: e.target.value as any})} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-sm outline-none transition-all">
                            <option value="DNI">DNI</option>
                            <option value="RUC">RUC</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nro Doc.</label>
                          <input value={customer.number} onChange={e => setCustomer({...customer, number: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-sm outline-none transition-all" placeholder="XXXXXXXX" />
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutStep === 'payment' && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      <div className="grid grid-cols-3 gap-3">
                        {(['YAPE', 'PLIN', 'EFECTIVO'] as const).map(m => (
                          <button
                            key={m}
                            onClick={() => setPaymentMethod(m)}
                            className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === m ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                          >
                            {m === 'YAPE' || m === 'PLIN' ? <QrCode className="w-8 h-8" /> : <DollarSign className="w-8 h-8" />}
                            <span className="text-xs font-black uppercase tracking-tighter">{m}</span>
                          </button>
                        ))}
                      </div>

                      {(paymentMethod === 'YAPE' || paymentMethod === 'PLIN') && (
                        <div className="bg-slate-50 p-8 rounded-[40px] flex flex-col items-center text-center space-y-6 border border-slate-200">
                          <div className="px-6 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Escanea el QR para pagar</div>
                          <div className="bg-white p-6 rounded-3xl shadow-2xl">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TechStylePay|934031164|${totals.total.toFixed(2)}`} 
                              alt="QR de Pago"
                              className="w-40 h-40"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">Número de contacto: <span className="text-indigo-600 text-lg">934031164</span></p>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Adjunta tu captura por WhatsApp</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t bg-slate-50 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Productos</span>
                    <span>{CURRENCY} {totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Envío</span>
                    <span className={totals.shippingCost === 0 ? "text-emerald-600 line-through" : ""}>{CURRENCY} {totals.shippingCost.toFixed(2)}</span>
                  </div>
                  {totals.shippingCost === 0 && (
                    <div className="flex justify-between text-xs font-black text-emerald-600 uppercase tracking-widest">
                      <span>Dscto. Envío Gratis</span>
                      <span>-{CURRENCY} 15.00</span>
                    </div>
                  )}
                  <div className="flex justify-between text-3xl font-black text-slate-900 border-t pt-4 mt-2">
                    <span>TOTAL</span>
                    <span className="text-indigo-600">{CURRENCY} {totals.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  {checkoutStep !== 'cart' && (
                    <button 
                      onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'details' : 'cart')}
                      className="px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all"
                    >
                      Atrás
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (checkoutStep === 'cart') setCheckoutStep('details');
                      else if (checkoutStep === 'details') {
                        if (!customer.name || !customer.number) return alert('Completa tus datos');
                        setCheckoutStep('payment');
                      }
                      else handleCheckout();
                    }}
                    className="flex-1 bg-indigo-600 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {checkoutStep === 'payment' ? 'CONFIRMAR PEDIDO' : 'CONTINUAR'}
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* "Added to Cart" Notification */}
      {addedToCartSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-300">
           <div className="bg-emerald-500 p-1.5 rounded-full"><CheckCircle2 className="w-5 h-5" /></div>
           <p className="text-sm font-bold">¡<span className="text-indigo-400">{addedToCartSuccess}</span> añadido al carrito!</p>
           <button 
            onClick={() => { setShowCart(true); setAddedToCartSuccess(null); }}
            className="text-indigo-400 hover:text-indigo-300 font-black text-xs uppercase ml-2"
           >
            Ver Carrito
           </button>
        </div>
      )}

      {/* Success Modal (After Checkout) */}
      {isSuccess && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-8 py-5 rounded-[30px] shadow-2xl flex items-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-500 min-w-[320px]">
          <div className="bg-indigo-500 p-3 rounded-full text-white shadow-lg"><CheckCircle2 className="w-8 h-8" /></div>
          <div>
            <h4 className="font-black text-lg">¡Pedido Procesado!</h4>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">TechStyleStore agradece tu compra</p>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {completedSale && (
        <InvoiceModal sale={completedSale} onClose={() => setCompletedSale(null)} />
      )}
    </div>
  );
};

// Local icons
const DollarSign = ({ className }: { className: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;

export default Storefront;
