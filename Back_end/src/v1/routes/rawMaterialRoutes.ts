import { Router } from 'express';
import rawMaterialController from '../controllers/rawMaterialController';

const router = Router();

router.post('/', rawMaterialController.createRawMaterial);
router.get('/', rawMaterialController.getRawMaterials);
router.get('/:id', rawMaterialController.getRawMaterialById);
router.put('/:id', rawMaterialController.updateRawMaterial);
router.delete('/:id', rawMaterialController.deleteRawMaterial);

export default router;
