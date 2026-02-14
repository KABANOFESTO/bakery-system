"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stockDTO = {
    createStockItemDTO: (item) => ({
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
    getStockItemDTO: (item) => ({
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
    getStockMovementDTO: (movement, itemName, userName) => {
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
exports.default = stockDTO;
//# sourceMappingURL=stockDTO.js.map