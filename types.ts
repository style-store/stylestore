
export enum MovementType {
  IN = 'INGRESO',
  OUT = 'SALIDA',
  SALE = 'VENTA',
  ANNULMENT = 'ANULACION'
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  categoryId: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  imageUrl?: string;
  images?: string[];
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  date: string;
  note?: string;
  referenceId?: string;
}

export interface CustomerData {
  type: 'DNI' | 'RUC';
  number: string;
  name: string;
  address?: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  orderNumber: string;
  date: string;
  items: SaleItem[];
  total: number;
  totalProfit: number;
  customer?: CustomerData;
  paymentMethod: 'EFECTIVO' | 'YAPE' | 'PLIN';
  status: 'COMPLETA' | 'ANULADA';
  sellerName: string;
}
