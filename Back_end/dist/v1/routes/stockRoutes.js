"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stockController_1 = require("../controllers/stockController");
const router = express_1.default.Router();
// Stock Items Routes
router.get('/stock/items', stockController_1.stockController.getAllStockItems);
router.get('/stock/items/:id', stockController_1.stockController.getStockItemById);
router.post('/stock/items', stockController_1.stockController.createStockItem);
router.put('/stock/items/:id', stockController_1.stockController.updateStockItem);
router.delete('/stock/items/:id', stockController_1.stockController.deleteStockItem);
// Stock Movements Routes
router.post('/stock/in', stockController_1.stockController.stockIn);
router.post('/stock/out', stockController_1.stockController.stockOut);
router.get('/stock/movements', stockController_1.stockController.getStockMovements);
router.get('/stock/movements/:id', stockController_1.stockController.getStockMovementById);
// Stock Statistics & Reports
router.get('/stock/low-stock', stockController_1.stockController.getLowStockItems);
router.get('/stock/statistics', stockController_1.stockController.getStockStatistics);
exports.default = router;
//# sourceMappingURL=stockRoutes.js.map