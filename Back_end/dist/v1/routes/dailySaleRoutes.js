"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dailySaleController_1 = __importDefault(require("../controllers/dailySaleController"));
const router = express_1.default.Router();
router.post('/daily-sales', dailySaleController_1.default.createDailySale);
router.get('/daily-sales', dailySaleController_1.default.getDailySales);
router.get('/daily-sales/:id', dailySaleController_1.default.getDailySaleById);
router.put('/daily-sales/:id', dailySaleController_1.default.updateDailySale);
router.delete('/daily-sales/:id', dailySaleController_1.default.deleteDailySale);
exports.default = router;
//# sourceMappingURL=dailySaleRoutes.js.map