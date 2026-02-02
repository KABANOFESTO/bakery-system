export interface RawMaterial {
    id?: string;
    itemName: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    date: Date;
    purchasedBy: string;
    createdAt?: Date;
}

const RawMaterialDTO = {
    createRawMaterialDTO: (rawMaterial: any) => ({
        itemName: rawMaterial.itemName,
        quantity: rawMaterial.quantity,
        pricePerUnit: rawMaterial.pricePerUnit,
        totalPrice: rawMaterial.totalPrice,
        date: new Date(rawMaterial.date),
        purchasedBy: rawMaterial.purchasedBy,
    }),
    getRawMaterialDTO: (rawMaterial: RawMaterial) => ({
        id: rawMaterial.id,
        itemName: rawMaterial.itemName,
        quantity: rawMaterial.quantity,
        pricePerUnit: rawMaterial.pricePerUnit,
        totalPrice: rawMaterial.totalPrice,
        date: rawMaterial.date?.toISOString(),
        purchasedBy: rawMaterial.purchasedBy,
        createdAt: rawMaterial.createdAt?.toISOString(),
    }),
};

export default RawMaterialDTO;
