import { Request, Response } from 'express';
import dailySalesService from '../services/dailySalesService';

const dailySalesController = {
    createDailySales: async (req: Request, res: Response): Promise<void> => {
        try {
            const dailySalesData = req.body;
            const dailySales = await dailySalesService.createDailySales(dailySalesData);
            res.status(201).json(dailySales);
        } catch (error) {
            res.status(500).json({ message: 'Error creating daily sales', error });
        }
    },

    getDailySales: async (req: Request, res: Response): Promise<void> => {
        try {
            const dailySales = await dailySalesService.getDailySales();
            res.status(200).json(dailySales);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving daily sales', error });
        }
    },

    getDailySalesById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const dailySales = await dailySalesService.getDailySalesById(id);
            if (dailySales) {
                res.status(200).json(dailySales);
            } else {
                res.status(404).json({ message: 'Daily sales not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving daily sales', error });
        }
    },

    updateDailySales: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const dailySalesData = req.body;
            const updatedDailySales = await dailySalesService.updateDailySales(id, dailySalesData);
            res.status(200).json(updatedDailySales);
        } catch (error) {
            res.status(500).json({ message: 'Error updating daily sales', error });
        }
    },

    deleteDailySales: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await dailySalesService.deleteDailySales(id);
            res.status(200).json({ message: 'Daily sales deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting daily sales', error });
        }
    },
};

export default dailySalesController;
