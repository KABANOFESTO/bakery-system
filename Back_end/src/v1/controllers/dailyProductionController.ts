import { Request, Response } from 'express';
import dailyProductionService from '../services/dailyProductionService';
import { apiResponse } from '../utils/apiResponse';

const dailyProductionController = {
    createDailyProduction: async (req: Request, res: Response): Promise<void> => {
        try {
            const dailyProductionData = req.body;
            const dailyProduction = await dailyProductionService.createDailyProduction(dailyProductionData);
            apiResponse.success(res, dailyProduction, 201);
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error creating daily production', 400);
        }
    },

    getDailyProductions: async (req: Request, res: Response): Promise<void> => {
        try {
            const dailyProductions = await dailyProductionService.getDailyProductions();
            apiResponse.success(res, dailyProductions);
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error retrieving daily productions', 400);
        }
    },

    getDailyProductionById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const dailyProduction = await dailyProductionService.getDailyProductionById(id);
            if (dailyProduction) {
                apiResponse.success(res, dailyProduction);
            } else {
                apiResponse.error(res, 'Daily production not found', 404);
            }
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error retrieving daily production', 400);
        }
    },

    deleteDailyProduction: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await dailyProductionService.deleteDailyProduction(id);
            apiResponse.success(res, { message: 'Daily production deleted successfully' });
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error deleting daily production', 400);
        }
    },

    updateDailyProduction: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const dailyProductionData = req.body;
            const updatedDailyProduction = await dailyProductionService.updateDailyProduction(id, dailyProductionData);
            apiResponse.success(res, updatedDailyProduction);
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error updating daily production', 400);
        }
    }
};

export default dailyProductionController;

