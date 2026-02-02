"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Package } from "lucide-react";

interface DailyProduction {
    id: string;
    item: string;
    quantityProduced: number;
    timeProduced: string;
    remark?: string;
    createdAt: string;
}

const DailyProductionPage = () => {
    const [productions, setProductions] = useState<DailyProduction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<DailyProduction | null>(null);
    const [formData, setFormData] = useState({
        item: '',
        quantityProduced: 0,
        timeProduced: '',
        remark: '',
    });

    const fetchProductions = async () => {
        try {
            const response = await fetch('/api/v1/daily-production');
            if (response.ok) {
                const data = await response.json();
                setProductions(data);
            }
        } catch (error) {
            toast.error('Failed to fetch daily productions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingItem
                ? `/api/v1/daily-production/${editingItem.id}`
                : '/api/v1/daily-production';
            const method = editingItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(editingItem ? 'Production updated' : 'Production created');
                setShowModal(false);
                setEditingItem(null);
                setFormData({ item: '', quantityProduced: 0, timeProduced: '', remark: '' });
                fetchProductions();
            } else {
                toast.error('Operation failed');
            }
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this production record?')) return;
        try {
            const response = await fetch(`/api/v1/daily-production/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast.success('Production deleted');
                fetchProductions();
            } else {
                toast.error('Delete failed');
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const openEditModal = (item: DailyProduction) => {
        setEditingItem(item);
        setFormData({
            item: item.item,
            quantityProduced: item.quantityProduced,
            timeProduced: item.timeProduced,
            remark: item.remark || '',
        });
        setShowModal(true);
    };

    if (loading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Daily Production Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Production
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity Produced</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Produced</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remark</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {productions.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4">{item.item}</td>
                                <td className="px-6 py-4">{item.quantityProduced}</td>
                                <td className="px-6 py-4">{new Date(item.timeProduced).toLocaleString()}</td>
                                <td className="px-6 py-4">{item.remark}</td>
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
                            {editingItem ? 'Edit Production' : 'Add Production'}
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
                                    <label className="block text-sm font-medium mb-1">Quantity Produced</label>
                                    <input
                                        type="number"
                                        value={formData.quantityProduced}
                                        onChange={(e) => setFormData({...formData, quantityProduced: Number(e.target.value)})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Time Produced</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.timeProduced}
                                        onChange={(e) => setFormData({...formData, timeProduced: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Remark</label>
                                    <textarea
                                        value={formData.remark}
                                        onChange={(e) => setFormData({...formData, remark: e.target.value})}
                                        className="w-full border rounded-lg px-3 py-2"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingItem(null);
                                        setFormData({ item: '', quantityProduced: 0, timeProduced: '', remark: '' });
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

export default DailyProductionPage;
