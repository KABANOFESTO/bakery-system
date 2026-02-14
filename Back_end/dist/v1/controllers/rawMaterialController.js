"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rawMaterialService_1 = __importDefault(require("../services/rawMaterialService"));
const apiResponse_1 = require("../utils/apiResponse");
const rawMaterialController = {
    createRawMaterial: async (req, res) => {
        try {
            const rawMaterialData = req.body;
            const rawMaterial = await rawMaterialService_1.default.createRawMaterial(rawMaterialData);
            apiResponse_1.apiResponse.success(res, rawMaterial, 201);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error creating raw material', 400);
        }
    },
    getRawMaterials: async (req, res) => {
        try {
            const rawMaterials = await rawMaterialService_1.default.getRawMaterials();
            apiResponse_1.apiResponse.success(res, rawMaterials);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error retrieving raw materials', 400);
        }
    },
    getRawMaterialById: async (req, res) => {
        try {
            const { id } = req.params;
            const rawMaterial = await rawMaterialService_1.default.getRawMaterialById(id);
            if (rawMaterial) {
                apiResponse_1.apiResponse.success(res, rawMaterial);
            }
            else {
                apiResponse_1.apiResponse.error(res, 'Raw material not found', 404);
            }
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error retrieving raw material', 400);
        }
    },
    deleteRawMaterial: async (req, res) => {
        try {
            const { id } = req.params;
            await rawMaterialService_1.default.deleteRawMaterial(id);
            apiResponse_1.apiResponse.success(res, { message: 'Raw material deleted successfully' });
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error deleting raw material', 400);
        }
    },
    updateRawMaterial: async (req, res) => {
        try {
            const { id } = req.params;
            const rawMaterialData = req.body;
            const updatedRawMaterial = await rawMaterialService_1.default.updateRawMaterial(id, rawMaterialData);
            apiResponse_1.apiResponse.success(res, updatedRawMaterial);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message || 'Error updating raw material', 400);
        }
    }
};
exports.default = rawMaterialController;
//# sourceMappingURL=rawMaterialController.js.map