import express from "express";
import rawMaterialController from "../controllers/rawMaterialController";

const router = express.Router();

router.post('/raw-materials', rawMaterialController.createRawMaterial);
router.get('/raw-materials', rawMaterialController.getRawMaterials);
router.get('/raw-materials/:id', rawMaterialController.getRawMaterialById);
router.put('/raw-materials/:id', rawMaterialController.updateRawMaterial);
router.delete('/raw-materials/:id', rawMaterialController.deleteRawMaterial);

export default router;

