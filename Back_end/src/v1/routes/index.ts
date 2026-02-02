import express from 'express';
import coffeeRoutes from './coffeeRoutes';
import dailyProductionRoutes from './dailyProductionRoutes';
import dailySalesRoutes from './dailySalesRoutes';
import messageRoutes from './messageRoutes';
import paymentRoutes from './paymentRoutes';
import rawMaterialRoutes from './rawMaterialRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import userRoutes from './userRoutes';

const router = express.Router();

router.use('/coffee', coffeeRoutes);
router.use('/daily-production', dailyProductionRoutes);
router.use('/daily-sales', dailySalesRoutes);
router.use('/messages', messageRoutes);
router.use('/payments', paymentRoutes);
router.use('/raw-materials', rawMaterialRoutes);

router.use('/subscriptions', subscriptionRoutes);
router.use('/users', userRoutes);

export default router;
