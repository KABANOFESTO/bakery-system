import { prisma } from '../config/database';
import DailySalesDTO from '../DTOs/dailySalesDTO';

const dailySalesService = {
    createDailySales: async (dailySalesData: any) => {
        const dailySales = await prisma.dailySales.create({
            data: DailySalesDTO.createDailySalesDTO(dailySalesData),
        });
        return DailySalesDTO.getDailySalesDTO(dailySales);
    },

    getDailySales: async () => {
        const dailySales = await prisma.dailySales.findMany();
        return dailySales.map(DailySalesDTO.getDailySalesDTO);
    },

    getDailySalesById: async (id: string) => {
        const dailySales = await prisma.dailySales.findUnique({
            where: { id },
        });
        return dailySales ? DailySalesDTO.getDailySalesDTO(dailySales) : null;
    },

    updateDailySales: async (id: string, dailySalesData: any) => {
        const dailySales = await prisma.dailySales.update({
            where: { id },
            data: dailySalesData,
        });
        return DailySalesDTO.getDailySalesDTO(dailySales);
    },

    deleteDailySales: async (id: string) => {
        await prisma.dailySales.delete({
            where: { id },
        });
    },
};

export default dailySalesService;
