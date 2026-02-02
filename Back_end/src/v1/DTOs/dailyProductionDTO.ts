export interface DailyProduction {
    id?: string;
    item: string;
    quantityProduced: number;
    timeProduced: Date;
    remark?: string | null;
    createdAt?: Date;
}

const DailyProductionDTO = {
    createDailyProductionDTO: (dailyProduction: any) => ({
        item: dailyProduction.item,
        quantityProduced: dailyProduction.quantityProduced,
        timeProduced: new Date(dailyProduction.timeProduced),
        remark: dailyProduction.remark,
    }),
    getDailyProductionDTO: (dailyProduction: DailyProduction) => ({
        id: dailyProduction.id,
        item: dailyProduction.item,
        quantityProduced: dailyProduction.quantityProduced,
        timeProduced: dailyProduction.timeProduced?.toISOString(),
        remark: dailyProduction.remark,
        createdAt: dailyProduction.createdAt?.toISOString(),
    }),
};

export default DailyProductionDTO;
