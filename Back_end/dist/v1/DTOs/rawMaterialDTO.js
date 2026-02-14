"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RawMaterialDTO = {
    createRawMaterialDTO: (rawMaterial) => ({
        itemName: rawMaterial.itemName,
        quantity: rawMaterial.quantity,
        pricePerUnit: rawMaterial.pricePerUnit,
        totalPrice: rawMaterial.totalPrice,
        date: rawMaterial.date,
        purchasedBy: rawMaterial.purchasedBy,
        userId: rawMaterial.userId,
    }),
    getRawMaterialDTO: (rawMaterial) => ({
        id: rawMaterial.id,
        itemName: rawMaterial.itemName,
        quantity: rawMaterial.quantity,
        pricePerUnit: rawMaterial.pricePerUnit,
        totalPrice: rawMaterial.totalPrice,
        date: rawMaterial.date,
        purchasedBy: rawMaterial.purchasedBy,
        createdAt: rawMaterial.createdAt,
    }),
};
exports.default = RawMaterialDTO;
//# sourceMappingURL=rawMaterialDTO.js.map