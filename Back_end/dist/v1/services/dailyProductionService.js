"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dailyProductionDTO_1 = __importDefault(require("../DTOs/dailyProductionDTO"));
const database_1 = require("../config/database");
const dailyProductionService = {
    createDailyProduction: async (dailyProductionData) => {
        const dailyProduction = await database_1.prisma.dailyProduction.create({
            data: {
                ...dailyProductionData,
                timeProduced: new Date(dailyProductionData.timeProduced),
            }
        });
        return dailyProductionDTO_1.default.getDailyProductionDTO(dailyProduction);
    },
    getDailyProductions: async () => {
        const dailyProductions = await database_1.prisma.dailyProduction.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return dailyProductions.map(dailyProductionDTO_1.default.getDailyProductionDTO);
    },
    getDailyProductionById: async (id) => {
        const dailyProduction = await database_1.prisma.dailyProduction.findUnique({
            where: { id }
        });
        return dailyProduction ? dailyProductionDTO_1.default.getDailyProductionDTO(dailyProduction) : null;
    },
    deleteDailyProduction: async (id) => {
        await database_1.prisma.dailyProduction.delete({ where: { id } });
    },
    updateDailyProduction: async (id, dailyProductionData) => {
        const updateData = { ...dailyProductionData };
        if (dailyProductionData.timeProduced) {
            updateData.timeProduced = new Date(dailyProductionData.timeProduced);
        }
        const updatedDailyProduction = await database_1.prisma.dailyProduction.update({
            where: { id },
            data: updateData
        });
        return dailyProductionDTO_1.default.getDailyProductionDTO(updatedDailyProduction);
    }
};
exports.default = dailyProductionService;
//# sourceMappingURL=dailyProductionService.js.map