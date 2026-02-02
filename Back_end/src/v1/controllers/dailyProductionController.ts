import { Request, Response } from 'express';
import dailyProductionService from '../services/dailyProductionService';

const dailyProductionController = {
    createDailyProduction: async (req: Request, res: Response): Promise<void> => {
        try {
            const dailyProductionData = req.body;
            const dailyProduction = await dailyProductionService.createDailyProduction(dailyProductionData);
            res.status(201).json(dailyProduction);
        } catch (error) {
            res.status(500).json({ message: 'Error creating daily production', error });
        }
    },

    getDailyProductions: async (req: Request, res: Response): Promise<void> => {
        try {
            const dailyProductions = await dailyProductionService.getDailyProductions();
            res.status(200).json(dailyProductions);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving daily productions', error });
        }
    },

    getDailyProductionById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const dailyProduction = await dailyProductionService.getDailyProductionById(id);
            if (dailyProduction) {
                res.status(200).json(dailyProduction);
            } else {
                res.status(404).json({ message: 'Daily production not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving daily production', error });
        }
    },

    updateDailyProduction: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const dailyProductionData = req.body;
            const updatedDailyProduction = await dailyProductionService.updateDailyProduction(id, dailyProductionData);
            res.status(200).json(updatedDailyProduction);
        } catch (error) {
            res.status(500).json({ message: 'Error updating daily production', error });
        }
    },

    deleteDailyProduction: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await dailyProductionService.deleteDailyProduction(id);
            res.status(200).json({ message: 'Daily production deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting daily production', error });
        }
    },
};

export default dailyProductionController;
