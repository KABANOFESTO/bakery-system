import { Request, Response } from 'express';
import rawMaterialService from '../services/rawMaterialService';

const rawMaterialController = {
    createRawMaterial: async (req: Request, res: Response): Promise<void> => {
        try {
            const rawMaterialData = req.body;
            const rawMaterial = await rawMaterialService.createRawMaterial(rawMaterialData);
            res.status(201).json(rawMaterial);
        } catch (error) {
            res.status(500).json({ message: 'Error creating raw material', error });
        }
    },

    getRawMaterials: async (req: Request, res: Response): Promise<void> => {
        try {
            const rawMaterials = await rawMaterialService.getRawMaterials();
            res.status(200).json(rawMaterials);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving raw materials', error });
        }
    },

    getRawMaterialById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const rawMaterial = await rawMaterialService.getRawMaterialById(id);
            if (rawMaterial) {
                res.status(200).json(rawMaterial);
            } else {
                res.status(404).json({ message: 'Raw material not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving raw material', error });
        }
    },

    updateRawMaterial: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const rawMaterialData = req.body;
            const updatedRawMaterial = await rawMaterialService.updateRawMaterial(id, rawMaterialData);
            res.status(200).json(updatedRawMaterial);
        } catch (error) {
            res.status(500).json({ message: 'Error updating raw material', error });
        }
    },

    deleteRawMaterial: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await rawMaterialService.deleteRawMaterial(id);
            res.status(200).json({ message: 'Raw material deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting raw material', error });
        }
    },
};

export default rawMaterialController;
