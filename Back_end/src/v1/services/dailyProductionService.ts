import { prisma } from '../config/database';
import DailyProductionDTO from '../DTOs/dailyProductionDTO';

const dailyProductionService = {
    createDailyProduction: async (dailyProductionData: any) => {
        const dailyProduction = await prisma.dailyProduction.create({
            data: DailyProductionDTO.createDailyProductionDTO(dailyProductionData),
        });
        return DailyProductionDTO.getDailyProductionDTO(dailyProduction);
    },

    getDailyProductions: async () => {
        const dailyProductions = await prisma.dailyProduction.findMany();
        return dailyProductions.map(DailyProductionDTO.getDailyProductionDTO);
    },

    getDailyProductionById: async (id: string) => {
        const dailyProduction = await prisma.dailyProduction.findUnique({
            where: { id },
        });
        return dailyProduction ? DailyProductionDTO.getDailyProductionDTO(dailyProduction) : null;
    },

    updateDailyProduction: async (id: string, dailyProductionData: any) => {
        const dailyProduction = await prisma.dailyProduction.update({
            where: { id },
            data: dailyProductionData,
        });
        return DailyProductionDTO.getDailyProductionDTO(dailyProduction);
    },

    deleteDailyProduction: async (id: string) => {
        await prisma.dailyProduction.delete({
            where: { id },
        });
    },
};

export default dailyProductionService;
