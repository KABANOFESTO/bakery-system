"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Package } from "lucide-react";

interface DailySales {
    id: string;
    item: string;
    openingStock: number;
    quantitySold: number;
    pricePerUnit: number;
    totalPrice: number;
    createdAt: string;
}

const DailySalesPage = () => {
    const [sales, setSales] = useState<DailySales[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<DailySales | null>(null);
    const [formData, setFormData] = useState({
        item: '',
        openingStock: 0,
        quantitySold: 0,
        pricePerUnit: 0,
    });

    const fetchSales = async () => {
        try {
            const response = await fetch('/api/v1/daily-sales');
            if (response.ok) {
                const data = await response.json();
                setSales(data);
            }
        } catch (error) {
            toast.error('Failed to fetch daily sales');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const totalPrice = formData.quantitySold * formData.pricePerUnit;
        const dataToSend = { ...formData, totalPrice };

        try {
            const url = editingItem
                ? `/api/v1/daily-sales/${editingItem.id}`
                : '/api/v1/daily-sales';
            const method = editingItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                toast.success(editingItem ? 'Sales record updated' : 'Sales record created');
                setShowModal(false);
                setEditingItem(null);
                setFormData({ item: '', openingStock: 0, quantitySold: 0, pricePerUnit: 0 });
                fetchSales();
            } else {
                toast.error('Operation failed');
            }
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sales record?')) return;
        try {
            const response = await fetch(`/api/v1/daily-sales/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast.success('Sales record deleted');
                fetchSales();
            } else {
                toast.error('Delete failed');
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const openEditModal = (item: DailySales) => {
        setEditingItem(item);
        setFormData({
            item: item.item,
            openingStock: item.openingStock,
            quantitySold: item.quantitySold,
            pricePerUnit: item.pricePerUnit,
        });
        setShowModal(true);
    };

    if (loading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Daily Sales Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Sales Record
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opening Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity Sold</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price per Unit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sales.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4">{item.item}</td>
                                <td className="px-6 py-4">{item.openingStock}</td>
                                <td className="px-6 py-4">{item.quantitySold}</td>
                                <td className="px-6 py-4">${item.pricePerUnit.toFixed(2)}</td>
                                <td className="px-6 py-4">${item.totalPrice.toFixed(2)}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingItem ? 'Edit Sales Record' : 'Add Sales Record'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Item</label>
                                    <input
                                        type="text"
                                        value={formData.item}
                                        onChange={(e) => setFormData({...formData, item: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Opening Stock</label>
                                    <input
                                        type="number"
                                        value={formData.openingStock}
                                        onChange={(e) => setFormData({...formData, openingStock: Number(e.target.value)})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quantity Sold</label>
                                    <input
                                        type="number"
                                        value={formData.quantitySold}
                                        onChange={(e) => setFormData({...formData, quantitySold: Number(e.target.value)})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price per Unit</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.pricePerUnit}
                                        onChange={(e) => setFormData({...formData, pricePerUnit: Number(e.target.value)})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Total Price (Auto-calculated)</label>
                                    <input
                                        type="number"
                                        value={(formData.quantitySold * formData.pricePerUnit).toFixed(2)}
                                        className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingItem(null);
                                        setFormData({ item: '', openingStock: 0, quantitySold: 0, pricePerUnit: 0 });
                                    }}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailySalesPage;
