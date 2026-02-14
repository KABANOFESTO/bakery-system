"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockController = void 0;
const stockService_1 = require("../services/stockService");
const apiResponse_1 = require("../utils/apiResponse");
exports.stockController = {
    // Get all stock items
    getAllStockItems: async (_req, res) => {
        try {
            const items = await stockService_1.stockService.getAllStockItems();
            apiResponse_1.apiResponse.success(res, items);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 400);
        }
    },
    // Get stock item by ID
    getStockItemById: async (req, res) => {
        const itemId = req.params.id;
        try {
            const item = await stockService_1.stockService.getStockItemById(itemId);
            if (!item) {
                apiResponse_1.apiResponse.error(res, 'Stock item not found', 404);
                return;
            }
            apiResponse_1.apiResponse.success(res, item);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 400);
        }
    },
    // Create new stock item
    createStockItem: async (req, res) => {
        const itemData = req.body;
        try {
            const item = await stockService_1.stockService.createStockItem(itemData);
            apiResponse_1.apiResponse.success(res, item, 201);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 400);
        }
    },
    // Update stock item
    updateStockItem: async (req, res) => {
        const itemId = req.params.id;
        const itemData = req.body;
        try {
            const item = await stockService_1.stockService.updateStockItem(itemId, itemData);
            apiResponse_1.apiResponse.success(res, item);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 400);
        }
    },
    // Delete stock item
    deleteStockItem: async (req, res) => {
        const itemId = req.params.id;
        try {
            await stockService_1.stockService.deleteStockItem(itemId);
            apiResponse_1.apiResponse.success(res, { message: 'Stock item deleted successfully' });
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 400);
        }
    },
    // Stock IN
    stockIn: async (req, res) => {
        const stockInData = req.body;
        const userId = req.user?.id; // Get user ID from auth middleware if available
        try {
            const result = await stockService_1.stockService.stockIn(stockInData, userId);
            apiResponse_1.apiResponse.success(res, result, 201);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 400);
        }
    },
    // Stock OUT
    stockOut: async (req, res) => {
        const stockOutData = req.body;
        const userId = req.user?.id; // Get user ID from auth middleware if available
        try {
            const result = await stockService_1.stockService.stockOut(stockOutData, userId);
            apiResponse_1.apiResponse.success(res, result, 201);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 400);
        }
    },
    // Get all stock movements
    getStockMovements: async (req, res) => {
        try {
            const filters = {
                itemId: req.query.itemId,
                type: req.query.type,
                dateFrom: req.query.dateFrom,
                dateTo: req.query.dateTo,
                search: req.query.search,
            };
            const movements = await stockService_1.stockService.getStockMovements(filters);
            apiResponse_1.apiResponse.success(res, movements);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 400);
        }
    },
    // Get stock movement by ID
    getStockMovementById: async (req, res) => {
        const movementId = req.params.id;
        try {
            const movement = await stockService_1.stockService.getStockMovementById(movementId);
            if (!movement) {
                apiResponse_1.apiResponse.error(res, 'Stock movement not found', 404);
                return;
            }
            apiResponse_1.apiResponse.success(res, movement);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 400);
        }
    },
    // Get low stock items
    getLowStockItems: async (_req, res) => {
        try {
            const items = await stockService_1.stockService.getLowStockItems();
            apiResponse_1.apiResponse.success(res, items);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 400);
        }
    },
    // Get stock statistics
    getStockStatistics: async (_req, res) => {
        try {
            const statistics = await stockService_1.stockService.getStockStatistics();
            apiResponse_1.apiResponse.success(res, statistics);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 400);
        }
    },
};
//# sourceMappingURL=stockController.js.map