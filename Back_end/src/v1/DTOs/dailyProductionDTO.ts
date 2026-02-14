export interface DailyProduction {
    id?: string;
    item: string;
    quantityProduced: number;
    timeProduced: Date | string;
    remark?: string | null;
    userId?: string | null;
    createdAt?: Date;
    updatedAt?: Date | null;
}

const DailyProductionDTO = {
    createDailyProductionDTO: (dailyProduction: DailyProduction) => ({
        item: dailyProduction.item,
        quantityProduced: dailyProduction.quantityProduced,
        timeProduced: dailyProduction.timeProduced,
        remark: dailyProduction.remark,
        userId: dailyProduction.userId,
    }),
    getDailyProductionDTO: (dailyProduction: DailyProduction) => ({
        id: dailyProduction.id,
        item: dailyProduction.item,
        quantityProduced: dailyProduction.quantityProduced,
        timeProduced: dailyProduction.timeProduced,
        remark: dailyProduction.remark,
        createdAt: dailyProduction.createdAt,
    }),
};

export default DailyProductionDTO;

