"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dailyProductionController_1 = __importDefault(require("../controllers/dailyProductionController"));
const router = express_1.default.Router();
router.post('/daily-productions', dailyProductionController_1.default.createDailyProduction);
router.get('/daily-productions', dailyProductionController_1.default.getDailyProductions);
router.get('/daily-productions/:id', dailyProductionController_1.default.getDailyProductionById);
router.put('/daily-productions/:id', dailyProductionController_1.default.updateDailyProduction);
router.delete('/daily-productions/:id', dailyProductionController_1.default.deleteDailyProduction);
exports.default = router;
//# sourceMappingURL=dailyProductionRoutes.js.map