"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dailyProductionService_1 = __importDefault(require("../services/dailyProductionService"));
const apiResponse_1 = require("../utils/apiResponse");
const dailyProductionController = {
    createDailyProduction: async (req, res) => {
        try {
            const dailyProductionData = req.body;
            const dailyProduction = await dailyProductionService_1.default.createDailyProduction(dailyProductionData);
            apiResponse_1.apiResponse.success(res, dailyProduction, 201);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error creating daily production', 400);
        }
    },
    getDailyProductions: async (req, res) => {
        try {
            const dailyProductions = await dailyProductionService_1.default.getDailyProductions();
            apiResponse_1.apiResponse.success(res, dailyProductions);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error retrieving daily productions', 400);
        }
    },
    getDailyProductionById: async (req, res) => {
        try {
            const { id } = req.params;
            const dailyProduction = await dailyProductionService_1.default.getDailyProductionById(id);
            if (dailyProduction) {
                apiResponse_1.apiResponse.success(res, dailyProduction);
            }
            else {
                apiResponse_1.apiResponse.error(res, 'Daily production not found', 404);
            }
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error retrieving daily production', 400);
        }
    },
    deleteDailyProduction: async (req, res) => {
        try {
            const { id } = req.params;
            await dailyProductionService_1.default.deleteDailyProduction(id);
            apiResponse_1.apiResponse.success(res, { message: 'Daily production deleted successfully' });
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error deleting daily production', 400);
        }
    },
    updateDailyProduction: async (req, res) => {
        try {
            const { id } = req.params;
            const dailyProductionData = req.body;
            const updatedDailyProduction = await dailyProductionService_1.default.updateDailyProduction(id, dailyProductionData);
            apiResponse_1.apiResponse.success(res, updatedDailyProduction);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error updating daily production', 400);
        }
    }
};
exports.default = dailyProductionController;
//# sourceMappingURL=dailyProductionController.js.map