import { Request, Response } from 'express';
import dailySaleService from '../services/dailySaleService';
import { apiResponse } from '../utils/apiResponse';

const dailySaleController = {
    createDailySale: async (req: Request, res: Response): Promise<void> => {
        try {
            const dailySaleData = req.body;
            const dailySale = await dailySaleService.createDailySale(dailySaleData);
            apiResponse.success(res, dailySale, 201);
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error creating daily sale', 400);
        }
    },

    getDailySales: async (req: Request, res: Response): Promise<void> => {
        try {
            const dailySales = await dailySaleService.getDailySales();
            apiResponse.success(res, dailySales);
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error retrieving daily sales', 400);
        }
    },

    getDailySaleById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const dailySale = await dailySaleService.getDailySaleById(id);
            if (dailySale) {
                apiResponse.success(res, dailySale);
            } else {
                apiResponse.error(res, 'Daily sale not found', 404);
            }
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error retrieving daily sale', 400);
        }
    },

    deleteDailySale: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await dailySaleService.deleteDailySale(id);
            apiResponse.success(res, { message: 'Daily sale deleted successfully' });
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error deleting daily sale', 400);
        }
    },

    updateDailySale: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const dailySaleData = req.body;
            const updatedDailySale = await dailySaleService.updateDailySale(id, dailySaleData);
            apiResponse.success(res, updatedDailySale);
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error updating daily sale', 400);
        }
    }
};

export default dailySaleController;

