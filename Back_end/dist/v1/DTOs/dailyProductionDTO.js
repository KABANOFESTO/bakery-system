"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DailyProductionDTO = {
    createDailyProductionDTO: (dailyProduction) => ({
        item: dailyProduction.item,
        quantityProduced: dailyProduction.quantityProduced,
        timeProduced: dailyProduction.timeProduced,
        remark: dailyProduction.remark,
        userId: dailyProduction.userId,
    }),
    getDailyProductionDTO: (dailyProduction) => ({
        id: dailyProduction.id,
        item: dailyProduction.item,
        quantityProduced: dailyProduction.quantityProduced,
        timeProduced: dailyProduction.timeProduced,
        remark: dailyProduction.remark,
        createdAt: dailyProduction.createdAt,
    }),
};
exports.default = DailyProductionDTO;
//# sourceMappingURL=dailyProductionDTO.js.map