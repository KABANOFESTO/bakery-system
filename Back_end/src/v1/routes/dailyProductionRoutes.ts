import { Router } from 'express';
import dailyProductionController from '../controllers/dailyProductionController';

const router = Router();

router.post('/', dailyProductionController.createDailyProduction);
router.get('/', dailyProductionController.getDailyProductions);
router.get('/:id', dailyProductionController.getDailyProductionById);
router.put('/:id', dailyProductionController.updateDailyProduction);
router.delete('/:id', dailyProductionController.deleteDailyProduction);

export default router;
