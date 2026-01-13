
import { Product, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Smartphones' },
  { id: '2', name: 'Laptops' },
  { id: '3', name: 'Accesorios' },
  { id: '4', name: 'Smartwatches' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max',
    sku: 'IPH-15-PM',
    description: 'El iPhone más potente hasta la fecha. Con chip A17 Pro, sistema de cámaras Pro con teleobjetivo de 5x y acabado en titanio de grado aeroespacial. La pantalla Super Retina XDR de 6.7 pulgadas con ProMotion te ofrece una fluidez inigualable.',
    categoryId: '1',
    purchasePrice: 4200,
    salePrice: 5500,
    stock: 10,
    minStock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1695048133227-2c13d76b9213?auto=format&fit=crop&q=80&w=400'
    ]
  },
  {
    id: 'p2',
    name: 'MacBook Air M2',
    sku: 'MAC-AIR-M2',
    description: 'Increíblemente delgada y rápida. La MacBook Air con chip M2 es una supercomputadora portátil para trabajar, jugar y crear. Hasta 18 horas de batería y una espectacular pantalla Liquid Retina de 13.6 pulgadas.',
    categoryId: '2',
    purchasePrice: 3800,
    salePrice: 4800,
    stock: 5,
    minStock: 1,
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ec696e5237?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ec696e5237?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400'
    ]
  },
  {
    id: 'p3',
    name: 'AirPods Pro 2',
    sku: 'AIRP-PRO2',
    description: 'Cancelación Activa de Ruido hasta dos veces superior. Audio Adaptativo para filtrar ruidos externos y centrarte en lo que importa. Audio Espacial personalizado para una inmersión total. Estuche de carga MagSafe con USB-C.',
    categoryId: '3',
    purchasePrice: 650,
    salePrice: 950,
    stock: 25,
    minStock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1588423770574-f199ba44d7f1?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1588423770574-f199ba44d7f1?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&q=80&w=400'
    ]
  }
];

export const CURRENCY = 'S/';
