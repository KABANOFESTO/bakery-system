export interface StockItem {
  id?: string;
  name: string;
  category: 'Ingredients' | 'Products' | 'Packaging';
  currentStock: number;
  unit: string;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  lastRestocked?: Date | null;
  supplier: string;
  costPerUnit: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StockMovement {
  id?: string;
  itemId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  previousStock: number;
  newStock: number;
  date?: Date;
  reference: string;
  userId?: string;
  reason: string;
  notes?: string;
  supplier?: string;
  batchNumber?: string;
  expiryDate?: Date;
  purchasePrice?: number;
  createdAt?: Date;
}

export interface CreateStockItemDTO {
  name: string;
  category: 'Ingredients' | 'Products' | 'Packaging';
  currentStock?: number; // Optional, defaults to 0 if not provided
  unit: string;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  supplier: string;
  costPerUnit: number;
}

export interface GetStockItemDTO {
  id: string;
  name: string;
  category: 'Ingredients' | 'Products' | 'Packaging';
  currentStock: number;
  unit: string;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  lastRestocked: string | null;
  supplier: string;
  costPerUnit: number;
}

export interface CreateStockInDTO {
  itemId: string;
  quantity: number;
  supplier: string;
  batchNumber?: string;
  expiryDate?: string;
  purchasePrice?: number;
  notes?: string;
  reference?: string;
}

export interface CreateStockOutDTO {
  itemId: string;
  quantity: number;
  reason: string;
  reference: string;
  notes?: string;
}

export interface GetStockMovementDTO {
  id: string;
  itemId: string;
  itemName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  previousStock: number;
  newStock: number;
  date: string;
  time: string;
  reference: string;
  user: string;
  reason: string;
  notes?: string;
  supplier?: string;
  batchNumber?: string;
  expiryDate?: string;
}

const stockDTO = {
  createStockItemDTO: (item: StockItem): CreateStockItemDTO => ({
    name: item.name,
    category: item.category,
    currentStock: item.currentStock,
    unit: item.unit,
    minStock: item.minStock,
    maxStock: item.maxStock,
    reorderPoint: item.reorderPoint,
    supplier: item.supplier,
    costPerUnit: item.costPerUnit,
  }),

  getStockItemDTO: (item: any): GetStockItemDTO => ({
    id: item.id,
    name: item.name,
    category: item.category,
    currentStock: item.currentStock,
    unit: item.unit,
    minStock: item.minStock,
    maxStock: item.maxStock,
    reorderPoint: item.reorderPoint,
    lastRestocked: item.lastRestocked ? item.lastRestocked.toISOString().split('T')[0] : null,
    supplier: item.supplier,
    costPerUnit: item.costPerUnit,
  }),

  getStockMovementDTO: (movement: any, itemName: string, userName?: string): GetStockMovementDTO => {
    const date = new Date(movement.date || movement.createdAt);
    return {
      id: movement.id,
      itemId: movement.itemId,
      itemName: itemName,
      type: movement.type,
      quantity: movement.quantity,
      previousStock: movement.previousStock,
      newStock: movement.newStock,
      date: date.toISOString().split('T')[0],
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      reference: movement.reference,
      user: userName || 'System User',
      reason: movement.reason,
      notes: movement.notes || undefined,
      supplier: movement.supplier || undefined,
      batchNumber: movement.batchNumber || undefined,
      expiryDate: movement.expiryDate ? new Date(movement.expiryDate).toISOString().split('T')[0] : undefined,
    };
  },
};

export default stockDTO;

