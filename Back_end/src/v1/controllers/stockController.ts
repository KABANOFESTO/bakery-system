import { Request, Response } from 'express';
import { stockService } from '../services/stockService';
import { apiResponse } from '../utils/apiResponse';

export const stockController = {
  // Get all stock items
  getAllStockItems: async (_req: Request, res: Response): Promise<void> => {
    try {
      const items = await stockService.getAllStockItems();
      apiResponse.success(res, items);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  // Get stock item by ID
  getStockItemById: async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    try {
      const item = await stockService.getStockItemById(itemId);
      if (!item) {
        apiResponse.error(res, 'Stock item not found', 404);
        return;
      }
      apiResponse.success(res, item);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  // Create new stock item
  createStockItem: async (req: Request, res: Response): Promise<void> => {
    const itemData = req.body;
    try {
      const item = await stockService.createStockItem(itemData);
      apiResponse.success(res, item, 201);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  // Update stock item
  updateStockItem: async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    const itemData = req.body;
    try {
      const item = await stockService.updateStockItem(itemId, itemData);
      apiResponse.success(res, item);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  // Delete stock item
  deleteStockItem: async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    try {
      await stockService.deleteStockItem(itemId);
      apiResponse.success(res, { message: 'Stock item deleted successfully' });
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  // Stock IN
  stockIn: async (req: Request, res: Response): Promise<void> => {
    const stockInData = req.body;
    const userId = (req as any).user?.id; // Get user ID from auth middleware if available
    try {
      const result = await stockService.stockIn(stockInData, userId);
      apiResponse.success(res, result, 201);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  // Stock OUT
  stockOut: async (req: Request, res: Response): Promise<void> => {
    const stockOutData = req.body;
    const userId = (req as any).user?.id; // Get user ID from auth middleware if available
    try {
      const result = await stockService.stockOut(stockOutData, userId);
      apiResponse.success(res, result, 201);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  // Get all stock movements
  getStockMovements: async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = {
        itemId: req.query.itemId as string | undefined,
        type: req.query.type as 'IN' | 'OUT' | undefined,
        dateFrom: req.query.dateFrom as string | undefined,
        dateTo: req.query.dateTo as string | undefined,
        search: req.query.search as string | undefined,
      };
      const movements = await stockService.getStockMovements(filters);
      apiResponse.success(res, movements);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  // Get stock movement by ID
  getStockMovementById: async (req: Request, res: Response): Promise<void> => {
    const movementId = req.params.id;
    try {
      const movement = await stockService.getStockMovementById(movementId);
      if (!movement) {
        apiResponse.error(res, 'Stock movement not found', 404);
        return;
      }
      apiResponse.success(res, movement);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  // Get low stock items
  getLowStockItems: async (_req: Request, res: Response): Promise<void> => {
    try {
      const items = await stockService.getLowStockItems();
      apiResponse.success(res, items);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  // Get stock statistics
  getStockStatistics: async (_req: Request, res: Response): Promise<void> => {
    try {
      const statistics = await stockService.getStockStatistics();
      apiResponse.success(res, statistics);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },
};

