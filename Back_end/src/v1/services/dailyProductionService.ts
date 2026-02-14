import DailyProductionDTO from '../DTOs/dailyProductionDTO';
import { prisma as prismaClient } from '../config/database';

const dailyProductionService = {
    createDailyProduction: async (dailyProductionData: any): Promise<ReturnType<typeof DailyProductionDTO.getDailyProductionDTO>> => {
        const dailyProduction = await prismaClient.dailyProduction.create({ 
            data: {
                ...dailyProductionData,
                timeProduced: new Date(dailyProductionData.timeProduced),
            }
        });
        return DailyProductionDTO.getDailyProductionDTO(dailyProduction);
    },

    getDailyProductions: async (): Promise<ReturnType<typeof DailyProductionDTO.getDailyProductionDTO>[]> => {
        const dailyProductions = await prismaClient.dailyProduction.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return dailyProductions.map(DailyProductionDTO.getDailyProductionDTO);
    },

    getDailyProductionById: async (id: string): Promise<ReturnType<typeof DailyProductionDTO.getDailyProductionDTO> | null> => {
        const dailyProduction = await prismaClient.dailyProduction.findUnique({
            where: { id }
        });
        return dailyProduction ? DailyProductionDTO.getDailyProductionDTO(dailyProduction) : null;
    },

    deleteDailyProduction: async (id: string): Promise<void> => {
        await prismaClient.dailyProduction.delete({ where: { id } });
    },

    updateDailyProduction: async (id: string, dailyProductionData: any): Promise<ReturnType<typeof DailyProductionDTO.getDailyProductionDTO>> => {
        const updateData: any = { ...dailyProductionData };
        if (dailyProductionData.timeProduced) {
            updateData.timeProduced = new Date(dailyProductionData.timeProduced);
        }
        const updatedDailyProduction = await prismaClient.dailyProduction.update({
            where: { id },
            data: updateData
        });
        return DailyProductionDTO.getDailyProductionDTO(updatedDailyProduction);
    }
};

export default dailyProductionService;

