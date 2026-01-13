
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { Sale, Product, InventoryMovement, Category } from '../types';
import { CURRENCY } from '../constants';

interface DashboardProps {
  sales: Sale[];
  products: Product[];
  movements: InventoryMovement[];
  categories: Category[];
}

const Dashboard: React.FC<DashboardProps> = ({ sales, products, movements, categories }) => {
  const activeSales = useMemo(() => sales.filter(s => s.status === 'COMPLETA'), [sales]);
  
  const stats = useMemo(() => {
    const totalSales = activeSales.reduce((acc, s) => acc + s.total, 0);
    const totalProfit = activeSales.reduce((acc, s) => acc + s.totalProfit, 0);
    const lowStock = products.filter(p => p.stock <= p.minStock).length;
    return {
      totalSales,
      totalProfit,
      saleCount: activeSales.length,
      lowStock
    };
  }, [activeSales, products]);

  // Aggregate daily sales for chart
  const salesChartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const daySales = activeSales.filter(s => s.date.split('T')[0] === date);
      return {
        date: date.substring(5),
        ventas: daySales.reduce((acc, s) => acc + s.total, 0),
        ganancia: daySales.reduce((acc, s) => acc + s.totalProfit, 0),
      };
    });
  }, [activeSales]);

  const salesByCategory = useMemo(() => {
    const data: Record<string, number> = {};
    activeSales.forEach(sale => {
      sale.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const catName = categories.find(c => c.id === prod?.categoryId)?.name || 'Otros';
        data[catName] = (data[catName] || 0) + item.subtotal;
      });
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [activeSales, products, categories]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Bienvenido de nuevo 👋</h2>
        <p className="text-slate-500">Aquí está el resumen de tu negocio el día de hoy.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Ventas Totales</p>
            <h3 className="text-xl font-bold">{CURRENCY} {stats.totalSales.toLocaleString('es-PE')}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Utilidad Bruta</p>
            <h3 className="text-xl font-bold">{CURRENCY} {stats.totalProfit.toLocaleString('es-PE')}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Nro. de Ventas</p>
            <h3 className="text-xl font-bold">{stats.saleCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-rose-50 p-3 rounded-xl text-rose-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Stock Bajo</p>
            <h3 className="text-xl font-bold">{stats.lowStock} <span className="text-xs font-normal text-slate-400">items</span></h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold mb-6">Tendencia de Ventas (7 días)</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`${CURRENCY} ${value}`, '']}
                />
                <Area type="monotone" dataKey="ventas" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="ganancia" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold mb-6">Ventas por Categoría</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${CURRENCY} ${value}`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {salesByCategory.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                    <span className="text-slate-600">{entry.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{CURRENCY} {entry.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
