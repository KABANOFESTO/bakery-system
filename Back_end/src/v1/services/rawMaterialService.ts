import RawMaterialDTO from '../DTOs/rawMaterialDTO';
import { prisma as prismaClient } from '../config/database';

const rawMaterialService = {
    createRawMaterial: async (rawMaterialData: any): Promise<ReturnType<typeof RawMaterialDTO.getRawMaterialDTO>> => {
        const rawMaterial = await prismaClient.rawMaterial.create({ 
            data: {
                ...rawMaterialData,
                date: new Date(rawMaterialData.date),
            }
        });
        return RawMaterialDTO.getRawMaterialDTO(rawMaterial);
    },

    getRawMaterials: async (): Promise<ReturnType<typeof RawMaterialDTO.getRawMaterialDTO>[]> => {
        const rawMaterials = await prismaClient.rawMaterial.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return rawMaterials.map(RawMaterialDTO.getRawMaterialDTO);
    },

    getRawMaterialById: async (id: string): Promise<ReturnType<typeof RawMaterialDTO.getRawMaterialDTO> | null> => {
        const rawMaterial = await prismaClient.rawMaterial.findUnique({
            where: { id }
        });
        return rawMaterial ? RawMaterialDTO.getRawMaterialDTO(rawMaterial) : null;
    },

    deleteRawMaterial: async (id: string): Promise<void> => {
        await prismaClient.rawMaterial.delete({ where: { id } });
    },

    updateRawMaterial: async (id: string, rawMaterialData: any): Promise<ReturnType<typeof RawMaterialDTO.getRawMaterialDTO>> => {
        const updateData: any = { ...rawMaterialData };
        if (rawMaterialData.date) {
            updateData.date = new Date(rawMaterialData.date);
        }
        const updatedRawMaterial = await prismaClient.rawMaterial.update({
            where: { id },
            data: updateData
        });
        return RawMaterialDTO.getRawMaterialDTO(updatedRawMaterial);
    }
};

export default rawMaterialService;

