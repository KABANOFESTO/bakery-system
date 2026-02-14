"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useSession } from "next-auth/react";
import {
    useDailySalesQuery,
    useCreateDailySaleMutation,
    useDeleteDailySaleMutation,
    useUpdateDailySaleMutation,
} from "@/lib/redux/slices/DailySalesSlice";

interface DailySale {
    id?: string;
    item: string;
    openingStock: number;
    quantitySold: number;
    pricePerUnit: number;
    totalPrice: number;
}

interface DailySaleUpdateData {
    id: string;
    data: Omit<DailySale, "id">;
}

const DailySalesManagement: React.FC = () => {
    const { data: sessionData } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentDailySale, setCurrentDailySale] = useState<DailySale>({
        item: "",
        openingStock: 0,
        quantitySold: 0,
        pricePerUnit: 0,
        totalPrice: 0,
    });

    const { data: dailySales = [], isLoading, refetch, isError, error } = useDailySalesQuery({});
    const [createDailySale] = useCreateDailySaleMutation();
    const [updateDailySale] = useUpdateDailySaleMutation();
    const [deleteDailySale] = useDeleteDailySaleMutation();

    const filteredDailySales = dailySales?.filter((dailySale: DailySale) =>
        dailySale.item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentDailySale((prev) => ({
            ...prev,
            [name]: name === "openingStock" || name === "quantitySold" || name === "pricePerUnit" || name === "totalPrice" ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (modalMode === "create") {
                await createDailySale({
                    ...currentDailySale,
                    userId: sessionData?.user?.id,
                }).unwrap();
            } else if (currentDailySale.id) {
                const updateData: DailySaleUpdateData = {
                    id: currentDailySale.id,
                    data: { ...currentDailySale },
                };
                await updateDailySale(updateData).unwrap();
            }

            setIsModalOpen(false);
            resetForm();
            refetch();
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'message' in error) {
                const err = error as { message?: string; data?: { message?: string } };
                alert(`Error saving daily sale: ${err.data?.message || err.message}`);
            } else {
                alert('An unknown error occurred while saving daily sale.');
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this daily sale?")) {
            try {
                await deleteDailySale(id).unwrap();
                refetch();
            } catch (error: unknown) {
                if (error && typeof error === 'object' && 'data' in error) {
                    const err = error as FetchBaseQueryError & { data?: { message?: string } };
                    alert(`Error deleting daily sale: ${err.data?.message || 'An error occurred'}`);
                } else {
                    alert('An unknown error occurred while deleting daily sale.');
                }
            }
        }
    };

    const handleEdit = (dailySale: DailySale) => {
        setCurrentDailySale(dailySale);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentDailySale({
            item: "",
            openingStock: 0,
            quantitySold: 0,
            pricePerUnit: 0,
            totalPrice: 0,
        });
    };

    useEffect(() => {
        if (isError) {
            if ("data" in error) {
                const errorMessage = (error.data as { message?: string })?.message || "Unknown error";
                alert(`Error fetching daily sales: ${errorMessage}`);
            } else {
                alert("Unknown error occurred");
            }
        }
    }, [isError, error]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Daily Sales Management</h1>

            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search daily sales..."
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
                    Add Daily Sale
                </button>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredDailySales.map((dailySale: DailySale) => (
                        <div key={dailySale.id} className="border rounded p-4 shadow">
                            <h2 className="text-xl font-semibold mb-1">{dailySale.item}</h2>
                            <p className="text-gray-600 mb-2">Opening Stock: {dailySale.openingStock}</p>
                            <p className="text-gray-600 mb-2">Quantity Sold: {dailySale.quantitySold}</p>
                            <p className="text-gray-600 mb-2">Price per Unit: RWF {dailySale.pricePerUnit.toFixed(2)}</p>
                            <p className="text-gray-600 mb-4">Total Price: RWF {dailySale.totalPrice.toFixed(2)}</p>
                            <div className="flex gap-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(dailySale)}>
                                    Edit
                                </button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(dailySale.id!)}>
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
                            {modalMode === "create" ? "Add New Daily Sale" : "Edit Daily Sale"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="item"
                                placeholder="Item"
                                value={currentDailySale.item}
                                onChange={handleInputChange}
                                className="border w-full mb-2 px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="openingStock"
                                placeholder="Opening Stock"
                                value={currentDailySale.openingStock}
                                onChange={handleInputChange}
                                className="border w-full mb-2 px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="quantitySold"
                                placeholder="Quantity Sold"
                                value={currentDailySale.quantitySold}
                                onChange={handleInputChange}
                                className="border w-full mb-2 px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="pricePerUnit"
                                placeholder="Price per Unit"
                                value={currentDailySale.pricePerUnit}
                                onChange={handleInputChange}
                                className="border w-full mb-2 px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="totalPrice"
                                placeholder="Total Price"
                                value={currentDailySale.totalPrice}
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

export default DailySalesManagement;
