import { Router } from 'express';
import dailySalesController from '../controllers/dailySalesController';

const router = Router();

router.post('/', dailySalesController.createDailySales);
router.get('/', dailySalesController.getDailySales);
router.get('/:id', dailySalesController.getDailySalesById);
router.put('/:id', dailySalesController.updateDailySales);
router.delete('/:id', dailySalesController.deleteDailySales);

export default router;
