"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
module.exports = {
    createStockItemSchema: joi_1.default.object({
        name: joi_1.default.string().required(),
        category: joi_1.default.string().valid('Ingredients', 'Products', 'Packaging').required(),
        currentStock: joi_1.default.number().min(0).required(),
        unit: joi_1.default.string().required(),
        minStock: joi_1.default.number().min(0).required(),
        maxStock: joi_1.default.number().min(0).required(),
        reorderPoint: joi_1.default.number().min(0).required(),
        supplier: joi_1.default.string().required(),
        costPerUnit: joi_1.default.number().min(0).required(),
    }),
    updateStockItemSchema: joi_1.default.object({
        name: joi_1.default.string(),
        category: joi_1.default.string().valid('Ingredients', 'Products', 'Packaging'),
        currentStock: joi_1.default.number().min(0),
        unit: joi_1.default.string(),
        minStock: joi_1.default.number().min(0),
        maxStock: joi_1.default.number().min(0),
        reorderPoint: joi_1.default.number().min(0),
        supplier: joi_1.default.string(),
        costPerUnit: joi_1.default.number().min(0),
    }),
    stockInSchema: joi_1.default.object({
        itemId: joi_1.default.string().required(),
        quantity: joi_1.default.number().min(0.01).required(),
        supplier: joi_1.default.string().required(),
        batchNumber: joi_1.default.string().allow('', null),
        expiryDate: joi_1.default.string().isoDate().allow('', null),
        purchasePrice: joi_1.default.number().min(0).allow(null),
        notes: joi_1.default.string().allow('', null),
        reference: joi_1.default.string().allow('', null),
    }),
    stockOutSchema: joi_1.default.object({
        itemId: joi_1.default.string().required(),
        quantity: joi_1.default.number().min(0.01).required(),
        reason: joi_1.default.string().required(),
        reference: joi_1.default.string().required(),
        notes: joi_1.default.string().allow('', null),
    }),
};
//# sourceMappingURL=stockValidation.js.map