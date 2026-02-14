import express from "express";
import dailyProductionController from "../controllers/dailyProductionController";

const router = express.Router();

router.post('/daily-productions', dailyProductionController.createDailyProduction);
router.get('/daily-productions', dailyProductionController.getDailyProductions);
router.get('/daily-productions/:id', dailyProductionController.getDailyProductionById);
router.put('/daily-productions/:id', dailyProductionController.updateDailyProduction);
router.delete('/daily-productions/:id', dailyProductionController.deleteDailyProduction);

export default router;

