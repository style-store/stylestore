
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  History, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  LogOut,
  ChevronRight,
  Plus,
  UserCircle,
  Store
} from 'lucide-react';
import { Product, Category, Sale, InventoryMovement, MovementType } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './constants';
import Dashboard from './components/Dashboard';
import ProductManager from './components/ProductManager';
import InventoryManager from './components/InventoryManager';
import SalesPoint from './components/SalesPoint';
import SalesHistory from './components/SalesHistory';
import ReportManager from './components/ReportManager';
import Storefront from './components/Storefront';
import FloatingWhatsApp from './components/FloatingWhatsApp';

type View = 'dashboard' | 'products' | 'inventory' | 'sales' | 'history' | 'reports';
type AppMode = 'customer' | 'admin';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('customer');
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // State initialization with Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tf_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('tf_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('tf_sales');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [movements, setMovements] = useState<InventoryMovement[]>(() => {
    const saved = localStorage.getItem('tf_movements');
    return saved ? JSON.parse(saved) : [];
  });

  // Effects for Persistence
  useEffect(() => {
    localStorage.setItem('tf_products', JSON.stringify(products));
    localStorage.setItem('tf_categories', JSON.stringify(categories));
    localStorage.setItem('tf_sales', JSON.stringify(sales));
    localStorage.setItem('tf_movements', JSON.stringify(movements));
  }, [products, categories, sales, movements]);

  const handleUpdateStock = (productId: string, quantity: number, type: MovementType, note?: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: Math.max(0, p.stock + (type === MovementType.IN || type === MovementType.ANNULMENT ? quantity : -quantity)) } : p
    ));
    
    const newMovement: InventoryMovement = {
      id: crypto.randomUUID(),
      productId,
      type,
      quantity,
      date: new Date().toISOString(),
      note
    };
    setMovements(prev => [newMovement, ...prev]);
  };

  const handleSaleComplete = (sale: Sale) => {
    setSales(prev => [sale, ...prev]);
    sale.items.forEach(item => handleUpdateStock(item.productId, item.quantity, MovementType.OUT, `Venta ${sale.orderNumber}`));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Registrar Venta', icon: ShoppingCart },
    { id: 'products', label: 'Catálogo Productos', icon: Package },
    { id: 'inventory', label: 'Control de Stock', icon: Settings },
    { id: 'history', label: 'Detalle de Ventas', icon: History },
    { id: 'reports', label: 'Análisis y Márgenes', icon: BarChart3 },
  ];

  if (mode === 'customer') {
    return (
      <div className="relative min-h-screen">
        <Storefront 
          products={products} 
          categories={categories} 
          onSaleComplete={handleSaleComplete}
          onAdminLogin={() => setMode('admin')} 
        />
        <FloatingWhatsApp phoneNumber="934031164" />
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard sales={sales} products={products} movements={movements} categories={categories} />;
      case 'products': return <ProductManager products={products} categories={categories} setProducts={setProducts} setCategories={setCategories} />;
      case 'inventory': return <InventoryManager products={products} movements={movements} onStockUpdate={handleUpdateStock} />;
      case 'sales': return <SalesPoint products={products} onSaleComplete={handleSaleComplete} />;
      case 'history': return <SalesHistory sales={sales} categories={categories} products={products} onAnnulSale={(saleId) => {
        const sale = sales.find(s => s.id === saleId);
        if (sale && sale.status !== 'ANULADA') {
          setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: 'ANULADA' } : s));
          sale.items.forEach(item => handleUpdateStock(item.productId, item.quantity, MovementType.ANNULMENT, `Extorno por Anulación ${sale.orderNumber}`));
        }
      }} />;
      case 'reports': return <ReportManager sales={sales} products={products} categories={categories} />;
      default: return <Dashboard sales={sales} products={products} movements={movements} categories={categories} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 transition-all duration-300">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Package className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg">TechStyle Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-0 z-40 bg-slate-900 text-white w-72 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col
      `}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-xl">
            <Package className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight leading-none">TechStyleStore</h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Panel de Control</p>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveView(item.id as View);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${activeView === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {activeView === item.id && <ChevronRight className="ml-auto w-4 h-4" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <button 
            onClick={() => setMode('customer')}
            className="flex items-center gap-3 w-full px-4 py-3 text-indigo-100 hover:bg-indigo-600/20 transition-all border border-indigo-500/30 rounded-xl group"
          >
            <Store className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="text-sm font-bold block">Ver Tienda</span>
              <span className="text-[10px] opacity-60">Vista de cliente</span>
            </div>
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
