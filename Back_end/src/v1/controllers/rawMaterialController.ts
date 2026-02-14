import { Request, Response } from 'express';
import rawMaterialService from '../services/rawMaterialService';
import { apiResponse } from '../utils/apiResponse';

const rawMaterialController = {
    createRawMaterial: async (req: Request, res: Response): Promise<void> => {
        try {
            const rawMaterialData = req.body;
            const rawMaterial = await rawMaterialService.createRawMaterial(rawMaterialData);
            apiResponse.success(res, rawMaterial, 201);
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error creating raw material', 400);
        }
    },

    getRawMaterials: async (req: Request, res: Response): Promise<void> => {
        try {
            const rawMaterials = await rawMaterialService.getRawMaterials();
            apiResponse.success(res, rawMaterials);
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error retrieving raw materials', 400);
        }
    },

    getRawMaterialById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const rawMaterial = await rawMaterialService.getRawMaterialById(id);
            if (rawMaterial) {
                apiResponse.success(res, rawMaterial);
            } else {
                apiResponse.error(res, 'Raw material not found', 404);
            }
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error retrieving raw material', 400);
        }
    },

    deleteRawMaterial: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await rawMaterialService.deleteRawMaterial(id);
            apiResponse.success(res, { message: 'Raw material deleted successfully' });
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error deleting raw material', 400);
        }
    },

    updateRawMaterial: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const rawMaterialData = req.body;
            const updatedRawMaterial = await rawMaterialService.updateRawMaterial(id, rawMaterialData);
            apiResponse.success(res, updatedRawMaterial);
        } catch (error: any) {
            apiResponse.error(res, error.message || 'Error updating raw material', 400);
        }
    }
};

export default rawMaterialController;

