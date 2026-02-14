"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rawMaterialDTO_1 = __importDefault(require("../DTOs/rawMaterialDTO"));
const database_1 = require("../config/database");
const rawMaterialService = {
    createRawMaterial: async (rawMaterialData) => {
        const rawMaterial = await database_1.prisma.rawMaterial.create({
            data: {
                ...rawMaterialData,
                date: new Date(rawMaterialData.date),
            }
        });
        return rawMaterialDTO_1.default.getRawMaterialDTO(rawMaterial);
    },
    getRawMaterials: async () => {
        const rawMaterials = await database_1.prisma.rawMaterial.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return rawMaterials.map(rawMaterialDTO_1.default.getRawMaterialDTO);
    },
    getRawMaterialById: async (id) => {
        const rawMaterial = await database_1.prisma.rawMaterial.findUnique({
            where: { id }
        });
        return rawMaterial ? rawMaterialDTO_1.default.getRawMaterialDTO(rawMaterial) : null;
    },
    deleteRawMaterial: async (id) => {
        await database_1.prisma.rawMaterial.delete({ where: { id } });
    },
    updateRawMaterial: async (id, rawMaterialData) => {
        const updateData = { ...rawMaterialData };
        if (rawMaterialData.date) {
            updateData.date = new Date(rawMaterialData.date);
        }
        const updatedRawMaterial = await database_1.prisma.rawMaterial.update({
            where: { id },
            data: updateData
        });
        return rawMaterialDTO_1.default.getRawMaterialDTO(updatedRawMaterial);
    }
};
exports.default = rawMaterialService;
//# sourceMappingURL=rawMaterialService.js.map