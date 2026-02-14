"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dailySaleService_1 = __importDefault(require("../services/dailySaleService"));
const apiResponse_1 = require("../utils/apiResponse");
const dailySaleController = {
    createDailySale: async (req, res) => {
        try {
            const dailySaleData = req.body;
            const dailySale = await dailySaleService_1.default.createDailySale(dailySaleData);
            apiResponse_1.apiResponse.success(res, dailySale, 201);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error creating daily sale', 400);
        }
    },
    getDailySales: async (req, res) => {
        try {
            const dailySales = await dailySaleService_1.default.getDailySales();
            apiResponse_1.apiResponse.success(res, dailySales);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error retrieving daily sales', 400);
        }
    },
    getDailySaleById: async (req, res) => {
        try {
            const { id } = req.params;
            const dailySale = await dailySaleService_1.default.getDailySaleById(id);
            if (dailySale) {
                apiResponse_1.apiResponse.success(res, dailySale);
            }
            else {
                apiResponse_1.apiResponse.error(res, 'Daily sale not found', 404);
            }
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error retrieving daily sale', 400);
        }
    },
    deleteDailySale: async (req, res) => {
        try {
            const { id } = req.params;
            await dailySaleService_1.default.deleteDailySale(id);
            apiResponse_1.apiResponse.success(res, { message: 'Daily sale deleted successfully' });
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error deleting daily sale', 400);
        }
    },
    updateDailySale: async (req, res) => {
        try {
            const { id } = req.params;
            const dailySaleData = req.body;
            const updatedDailySale = await dailySaleService_1.default.updateDailySale(id, dailySaleData);
            apiResponse_1.apiResponse.success(res, updatedDailySale);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error updating daily sale', 400);
        }
    }
};
exports.default = dailySaleController;
//# sourceMappingURL=dailySaleController.js.map