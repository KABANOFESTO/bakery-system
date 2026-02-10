import express from 'express';
import { stockController } from '../controllers/stockController';

const router = express.Router();

// Stock Items Routes
router.get('/stock/items', stockController.getAllStockItems);
router.get('/stock/items/:id', stockController.getStockItemById);
router.post('/stock/items', stockController.createStockItem);
router.put('/stock/items/:id', stockController.updateStockItem);
router.delete('/stock/items/:id', stockController.deleteStockItem);

// Stock Movements Routes
router.post('/stock/in', stockController.stockIn);
router.post('/stock/out', stockController.stockOut);
router.get('/stock/movements', stockController.getStockMovements);
router.get('/stock/movements/:id', stockController.getStockMovementById);

// Stock Statistics & Reports
router.get('/stock/low-stock', stockController.getLowStockItems);
router.get('/stock/statistics', stockController.getStockStatistics);

export default router;

