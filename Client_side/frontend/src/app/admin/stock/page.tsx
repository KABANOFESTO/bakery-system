"use client";
import React, { useState, useEffect } from "react";
import { useCoffeesQuery, useUpdateCoffeeMutation } from "../../../lib/redux/slices/CoffeeSlice";
import { toast } from "sonner";
import { Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface Coffee {
    id: string;
    title: string;
    stockQuantity: number;
    lowStockThreshold: number;
    price: number;
    image: string;
}

const StockManagementPage = () => {
    const { data: coffees, isLoading, refetch } = useCoffeesQuery({});
    const [updateCoffee] = useUpdateCoffeeMutation();
    const [selectedCoffee, setSelectedCoffee] = useState<Coffee | null>(null);
    const [stockChange, setStockChange] = useState<number>(0);
    const [changeType, setChangeType] = useState<'add' | 'remove'>('add');

    const handleStockUpdate = async () => {
        if (!selectedCoffee) return;

        const newStock = changeType === 'add'
            ? selectedCoffee.stockQuantity + stockChange
            : selectedCoffee.stockQuantity - stockChange;

        if (newStock < 0) {
            toast.error("Cannot reduce stock below 0");
            return;
        }

        try {
            await updateCoffee({
                id: selectedCoffee.id,
                data: { stockQuantity: newStock }
            });
            toast.success(`Stock updated successfully!`);
            setSelectedCoffee(null);
            setStockChange(0);
            refetch();
        } catch (error) {
            toast.error("Failed to update stock");
        }
    };

    const getStockStatus = (coffee: Coffee) => {
        if (coffee.stockQuantity === 0) return { status: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
        if (coffee.stockQuantity <= coffee.lowStockThreshold) return { status: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        return { status: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
    };

    const lowStockItems = coffees?.filter((coffee: Coffee) => coffee.stockQuantity <= coffee.lowStockThreshold) || [];
    const totalItems = coffees?.length || 0;
    const outOfStockItems = coffees?.filter((coffee: Coffee) => coffee.stockQuantity === 0) || [];

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading stock data...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Stock Management</h1>
                <p className="text-gray-600">Monitor and manage your bakery inventory</p>
            </div>

            {/* Stock Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Items</p>
                            <p className="text-2xl font-bold">{totalItems}</p>
                        </div>
                        <Package className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Low Stock Items</p>
                            <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-600">{outOfStockItems.length}</p>
                        </div>
                        <TrendingDown className="h-8 w-8 text-red-500" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">In Stock</p>
                            <p className="text-2xl font-bold text-green-600">{totalItems - outOfStockItems.length - lowStockItems.length}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                </div>
            </div>

            {/* Stock Table */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Inventory Items</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low Stock Threshold</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {coffees?.map((coffee: Coffee) => {
                                const stockStatus = getStockStatus(coffee);
                                return (
                                    <tr key={coffee.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={coffee.image} alt={coffee.title} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{coffee.title}</div>
                                                    <div className="text-sm text-gray-500">RWF {coffee.price.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{coffee.stockQuantity}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                                                {stockStatus.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {coffee.lowStockThreshold}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedCoffee(coffee)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Update Stock
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stock Update Modal */}
            {selectedCoffee && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Update Stock for {selectedCoffee.title}</h3>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600">Current Stock: {selectedCoffee.stockQuantity}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Change Type</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="add"
                                            checked={changeType === 'add'}
                                            onChange={(e) => setChangeType(e.target.value as 'add')}
                                            className="mr-2"
                                        />
                                        Add Stock
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="remove"
                                            checked={changeType === 'remove'}
                                            onChange={(e) => setChangeType(e.target.value as 'remove')}
                                            className="mr-2"
                                        />
                                        Remove Stock
                                    </label>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={stockChange}
                                    onChange={(e) => setStockChange(parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                    New Stock Level: {changeType === 'add'
                                        ? selectedCoffee.stockQuantity + stockChange
                                        : selectedCoffee.stockQuantity - stockChange}
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setSelectedCoffee(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStockUpdate}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                                >
                                    Update Stock
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockManagementPage;
