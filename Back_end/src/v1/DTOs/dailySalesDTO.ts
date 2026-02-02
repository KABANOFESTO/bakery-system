export interface DailySales {
    id?: string;
    item: string;
    openingStock: number;
    quantitySold: number;
    pricePerUnit: number;
    totalPrice: number;
    createdAt?: Date;
}

const DailySalesDTO = {
    createDailySalesDTO: (dailySales: DailySales) => ({
        item: dailySales.item,
        openingStock: dailySales.openingStock,
        quantitySold: dailySales.quantitySold,
        pricePerUnit: dailySales.pricePerUnit,
        totalPrice: dailySales.totalPrice,
    }),
    getDailySalesDTO: (dailySales: DailySales) => ({
        id: dailySales.id,
        item: dailySales.item,
        openingStock: dailySales.openingStock,
        quantitySold: dailySales.quantitySold,
        pricePerUnit: dailySales.pricePerUnit,
        totalPrice: dailySales.totalPrice,
        createdAt: dailySales.createdAt?.toISOString(),
    }),
};

export default DailySalesDTO;
