"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rawMaterialController_1 = __importDefault(require("../controllers/rawMaterialController"));
const router = express_1.default.Router();
router.post('/raw-materials', rawMaterialController_1.default.createRawMaterial);
router.get('/raw-materials', rawMaterialController_1.default.getRawMaterials);
router.get('/raw-materials/:id', rawMaterialController_1.default.getRawMaterialById);
router.put('/raw-materials/:id', rawMaterialController_1.default.updateRawMaterial);
router.delete('/raw-materials/:id', rawMaterialController_1.default.deleteRawMaterial);
exports.default = router;
//# sourceMappingURL=rawMaterialRoutes.js.map