
import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Plus, Search, Edit2, Trash2, Package, Tag, Layers } from 'lucide-react';
import { CURRENCY } from '../constants';

interface ProductManagerProps {
  products: Product[];
  categories: Category[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const ProductManager: React.FC<ProductManagerProps> = ({ products, categories, setProducts, setCategories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', sku: '', categoryId: categories[0]?.id || '', purchasePrice: 0, salePrice: 0, stock: 0, minStock: 1
  });
  const [newCatName, setNewCatName] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...newProduct as Product } : p));
      setEditingProduct(null);
    } else {
      const p: Product = {
        ...newProduct as Product,
        id: crypto.randomUUID(),
        imageUrl: `https://picsum.photos/seed/${newProduct.name}/200/200`
      };
      setProducts(prev => [p, ...prev]);
      setIsAddingProduct(false);
    }
    setNewProduct({ name: '', sku: '', categoryId: categories[0]?.id || '', purchasePrice: 0, salePrice: 0, stock: 0, minStock: 1 });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      setCategories(prev => [...prev, { id: crypto.randomUUID(), name: newCatName.trim() }]);
      setNewCatName('');
      setIsAddingCategory(false);
    }
  };

  const deleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Catálogo</h2>
          <p className="text-slate-500 text-sm">Administra tus productos, precios y categorías.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAddingCategory(true)}
            className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-300 transition-colors"
          >
            <Layers className="w-4 h-4" />
            Nueva Categoría
          </button>
          <button 
            onClick={() => setIsAddingProduct(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar por nombre o SKU..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProducts.map(product => {
          const cat = categories.find(c => c.id === product.categoryId);
          const isLowStock = product.stock <= product.minStock;
          
          return (
            <div key={product.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="flex items-start gap-4">
                <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">{cat?.name || 'S/C'}</span>
                    <span className="text-xs text-slate-400">SKU: {product.sku}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 truncate mt-1">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-bold text-slate-900">{CURRENCY} {product.salePrice.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">Costo: {CURRENCY}{product.purchasePrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Stock Actual</span>
                  <span className={`text-sm font-bold ${isLowStock ? 'text-rose-500' : 'text-slate-900'}`}>
                    {product.stock} unidades
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setEditingProduct(product); setNewProduct(product); }}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Modal */}
      {(isAddingProduct || editingProduct) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold">{editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h3>
              <button onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Nombre del Producto</label>
                  <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: iPhone 15 Pro" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">SKU</label>
                  <input required value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="IPH-15-P" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Categoría</label>
                  <select value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})} className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Precio Compra</label>
                  <input type="number" step="0.01" required value={newProduct.purchasePrice} onChange={e => setNewProduct({...newProduct, purchasePrice: Number(e.target.value)})} className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Precio Venta</label>
                  <input type="number" step="0.01" required value={newProduct.salePrice} onChange={e => setNewProduct({...newProduct, salePrice: Number(e.target.value)})} className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Stock Inicial</label>
                  <input type="number" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Stock Mínimo</label>
                  <input type="number" required value={newProduct.minStock} onChange={e => setNewProduct({...newProduct, minStock: Number(e.target.value)})} className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all mt-4">
                {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isAddingCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Nueva Categoría</h3>
              <button onClick={() => setIsAddingCategory(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Nombre de Categoría</label>
                <input required autoFocus value={newCatName} onChange={e => setNewCatName(e.target.value)} className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Smart Home" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                Añadir Categoría
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const X = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

export default ProductManager;
