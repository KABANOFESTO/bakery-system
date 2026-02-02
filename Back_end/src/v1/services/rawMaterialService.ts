import { prisma } from '../config/database';
import RawMaterialDTO from '../DTOs/rawMaterialDTO';

const rawMaterialService = {
    createRawMaterial: async (rawMaterialData: any) => {
        const rawMaterial = await prisma.rawMaterial.create({
            data: RawMaterialDTO.createRawMaterialDTO(rawMaterialData),
        });
        return RawMaterialDTO.getRawMaterialDTO(rawMaterial);
    },

    getRawMaterials: async () => {
        const rawMaterials = await prisma.rawMaterial.findMany();
        return rawMaterials.map(RawMaterialDTO.getRawMaterialDTO);
    },

    getRawMaterialById: async (id: string) => {
        const rawMaterial = await prisma.rawMaterial.findUnique({
            where: { id },
        });
        return rawMaterial ? RawMaterialDTO.getRawMaterialDTO(rawMaterial) : null;
    },

    updateRawMaterial: async (id: string, rawMaterialData: any) => {
        const rawMaterial = await prisma.rawMaterial.update({
            where: { id },
            data: rawMaterialData,
        });
        return RawMaterialDTO.getRawMaterialDTO(rawMaterial);
    },

    deleteRawMaterial: async (id: string) => {
        await prisma.rawMaterial.delete({
            where: { id },
        });
    },
};

export default rawMaterialService;
