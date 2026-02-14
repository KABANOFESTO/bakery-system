import express from "express";
import dailySaleController from "../controllers/dailySaleController";

const router = express.Router();

router.post('/daily-sales', dailySaleController.createDailySale);
router.get('/daily-sales', dailySaleController.getDailySales);
router.get('/daily-sales/:id', dailySaleController.getDailySaleById);
router.put('/daily-sales/:id', dailySaleController.updateDailySale);
router.delete('/daily-sales/:id', dailySaleController.deleteDailySale);

export default router;

