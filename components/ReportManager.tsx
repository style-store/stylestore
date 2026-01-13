
import React, { useMemo } from 'react';
import { Sale, Product, Category } from '../types';
import { CURRENCY } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Line, Area
} from 'recharts';
import { TrendingUp, Award, AlertCircle, ShoppingCart } from 'lucide-react';

interface ReportManagerProps {
  sales: Sale[];
  products: Product[];
  categories: Category[];
}

const ReportManager: React.FC<ReportManagerProps> = ({ sales, products, categories }) => {
  const activeSales = useMemo(() => sales.filter(s => s.status === 'COMPLETA'), [sales]);
  
  // Margin analysis per product
  const productMargins = useMemo(() => {
    const data: Record<string, { name: string, totalSale: number, totalCost: number, qty: number }> = {};
    activeSales.forEach(sale => {
      sale.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (!prod) return;
        if (!data[prod.id]) {
          data[prod.id] = { name: prod.name, totalSale: 0, totalCost: 0, qty: 0 };
        }
        data[prod.id].totalSale += item.subtotal;
        data[prod.id].totalCost += prod.purchasePrice * item.quantity;
        data[prod.id].qty += item.quantity;
      });
    });

    return Object.values(data).map(d => ({
      ...d,
      profit: d.totalSale - d.totalCost,
      margin: d.totalSale > 0 ? ((d.totalSale - d.totalCost) / d.totalSale) * 100 : 0
    })).sort((a, b) => b.profit - a.profit);
  }, [activeSales, products]);

  // Top 5 products by profit
  const topProfitProducts = productMargins.slice(0, 5);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Reportes Avanzados</h2>
        <p className="text-slate-500">Análisis detallado de márgenes y rendimiento de productos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Margin Analysis Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Top 5 Productos por Rentabilidad
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProfitProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} width={120} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   formatter={(v: any) => [`${CURRENCY} ${v.toLocaleString()}`, 'Ganancia']}
                />
                <Bar dataKey="profit" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marginal Analysis Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            Análisis de Margen de Ganancia (%)
          </h4>
          <div className="space-y-4">
            {topProfitProducts.map(p => (
               <div key={p.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
                    <span>{p.name}</span>
                    <span>{p.margin.toFixed(1)}% margen</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" style={{width: `${Math.min(p.margin, 100)}%`}}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 italic">
                    <span>Costo: {CURRENCY} {p.totalCost.toLocaleString()}</span>
                    <span>Venta: {CURRENCY} {p.totalSale.toLocaleString()}</span>
                  </div>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Product Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h4 className="text-lg font-semibold">Ranking General de Desempeño</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead className="bg-slate-50 border-b">
               <tr>
                 <th className="p-4 text-xs font-bold uppercase text-slate-400">Producto</th>
                 <th className="p-4 text-xs font-bold uppercase text-slate-400 text-center">Cant. Vendida</th>
                 <th className="p-4 text-xs font-bold uppercase text-slate-400 text-right">Ingresos</th>
                 <th className="p-4 text-xs font-bold uppercase text-slate-400 text-right">Ganancia</th>
                 <th className="p-4 text-xs font-bold uppercase text-slate-400 text-center">ROI / Margen</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {productMargins.map(p => (
                 <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                   <td className="p-4 font-medium text-slate-900 text-sm">{p.name}</td>
                   <td className="p-4 text-center font-bold text-slate-600">{p.qty}</td>
                   <td className="p-4 text-right text-slate-900">{CURRENCY} {p.totalSale.toLocaleString()}</td>
                   <td className="p-4 text-right font-bold text-emerald-600">{CURRENCY} {p.profit.toLocaleString()}</td>
                   <td className="p-4 text-center">
                     <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.margin > 25 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {p.margin.toFixed(1)}%
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportManager;
