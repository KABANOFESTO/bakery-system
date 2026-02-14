"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useSession } from "next-auth/react";
import {
    useRawMaterialsQuery,
    useCreateRawMaterialMutation,
    useDeleteRawMaterialMutation,
    useUpdateRawMaterialMutation,
} from "@/lib/redux/slices/RawMaterialSlice";

interface RawMaterial {
    id?: string;
    itemName: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    date: string;
    purchasedBy: string;
}

interface RawMaterialUpdateData {
    id: string;
    data: Omit<RawMaterial, "id">;
}

const RawMaterialManagement: React.FC = () => {
    const { data: sessionData } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentRawMaterial, setCurrentRawMaterial] = useState<RawMaterial>({
        itemName: "",
        quantity: 0,
        pricePerUnit: 0,
        totalPrice: 0,
        date: "",
        purchasedBy: "",
    });

    const { data: rawMaterials = [], isLoading, refetch, isError, error } = useRawMaterialsQuery({});
    const [createRawMaterial] = useCreateRawMaterialMutation();
    const [updateRawMaterial] = useUpdateRawMaterialMutation();
    const [deleteRawMaterial] = useDeleteRawMaterialMutation();

    const filteredRawMaterials = rawMaterials?.filter((rawMaterial: RawMaterial) =>
        rawMaterial.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rawMaterial.purchasedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentRawMaterial((prev) => ({
            ...prev,
            [name]: name === "quantity" || name === "pricePerUnit" || name === "totalPrice" ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (modalMode === "create") {
                await createRawMaterial({
                    ...currentRawMaterial,
                    userId: sessionData?.user?.id,
                }).unwrap();
            } else if (currentRawMaterial.id) {
                const updateData: RawMaterialUpdateData = {
                    id: currentRawMaterial.id,
                    data: { ...currentRawMaterial },
                };
                await updateRawMaterial(updateData).unwrap();
            }

            setIsModalOpen(false);
            resetForm();
            refetch();
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'message' in error) {
                const err = error as { message?: string; data?: { message?: string } };
                alert(`Error saving raw material: ${err.data?.message || err.message}`);
            } else {
                alert('An unknown error occurred while saving raw material.');
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this raw material?")) {
            try {
                await deleteRawMaterial(id).unwrap();
                refetch();
            } catch (error: unknown) {
                if (error && typeof error === 'object' && 'data' in error) {
                    const err = error as FetchBaseQueryError & { data?: { message?: string } };
                    alert(`Error deleting raw material: ${err.data?.message || 'An error occurred'}`);
                } else {
                    alert('An unknown error occurred while deleting raw material.');
                }
            }
        }
    };

    const handleEdit = (rawMaterial: RawMaterial) => {
        setCurrentRawMaterial(rawMaterial);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentRawMaterial({
            itemName: "",
            quantity: 0,
            pricePerUnit: 0,
            totalPrice: 0,
            date: "",
            purchasedBy: "",
        });
    };

    useEffect(() => {
        if (isError) {
            if ("data" in error) {
                const errorMessage = (error.data as { message?: string })?.message || "Unknown error";
                alert(`Error fetching raw materials: ${errorMessage}`);
            } else {
                alert("Unknown error occurred");
            }
        }
    }, [isError, error]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Raw Material Management</h1>

            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search raw materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-4 py-2 rounded w-1/2"
                />
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        setModalMode("create");
                        setIsModalOpen(true);
                        resetForm();
                    }}
                >
                    Add Raw Material
                </button>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredRawMaterials.map((rawMaterial: RawMaterial) => (
                        <div key={rawMaterial.id} className="border rounded p-4 shadow">
                            <h2 className="text-xl font-semibold mb-1">{rawMaterial.itemName}</h2>
                            <p className="text-gray-600 mb-2">Quantity: {rawMaterial.quantity}</p>
                            <p className="text-gray-600 mb-2">Price per Unit: RWF {rawMaterial.pricePerUnit.toFixed(2)}</p>
                            <p className="text-gray-600 mb-2">Total Price: RWF {rawMaterial.totalPrice.toFixed(2)}</p>
                            <p className="text-gray-600 mb-2">Date: {new Date(rawMaterial.date).toLocaleDateString()}</p>
                            <p className="text-gray-600 mb-4">Purchased By: {rawMaterial.purchasedBy}</p>
                            <div className="flex gap-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(rawMaterial)}>
                                    Edit
                                </button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(rawMaterial.id!)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {modalMode === "create" ? "Add New Raw Material" : "Edit Raw Material"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="itemName"
                                placeholder="Item Name"
                                value={currentRawMaterial.itemName}
                                onChange={handleInputChange}
                                className="border w-full mb-2 px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={currentRawMaterial.quantity}
                                onChange={handleInputChange}
                                className="border w-full mb-2 px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="pricePerUnit"
                                placeholder="Price per Unit"
                                value={currentRawMaterial.pricePerUnit}
                                onChange={handleInputChange}
                                className="border w-full mb-2 px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="totalPrice"
                                placeholder="Total Price"
                                value={currentRawMaterial.totalPrice}
                                onChange={handleInputChange}
                                className="border w-full mb-2 px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="date"
                                name="date"
                                placeholder="Date"
                                value={currentRawMaterial.date}
                                onChange={handleInputChange}
                                className="border w-full mb-2 px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                name="purchasedBy"
                                placeholder="Purchased By"
                                value={currentRawMaterial.purchasedBy}
                                onChange={handleInputChange}
                                className="border w-full mb-4 px-3 py-2 rounded"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                                    {modalMode === "create" ? "Add" : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RawMaterialManagement;
