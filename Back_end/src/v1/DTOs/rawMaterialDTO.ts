export interface RawMaterial {
    id?: string;
    itemName: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    date: Date | string;
    purchasedBy: string;
    userId?: string | null;
    createdAt?: Date;
    updatedAt?: Date | null;
}

const RawMaterialDTO = {
    createRawMaterialDTO: (rawMaterial: RawMaterial) => ({
        itemName: rawMaterial.itemName,
        quantity: rawMaterial.quantity,
        pricePerUnit: rawMaterial.pricePerUnit,
        totalPrice: rawMaterial.totalPrice,
        date: rawMaterial.date,
        purchasedBy: rawMaterial.purchasedBy,
        userId: rawMaterial.userId,
    }),
    getRawMaterialDTO: (rawMaterial: RawMaterial) => ({
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

export default RawMaterialDTO;

