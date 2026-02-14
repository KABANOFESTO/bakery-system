"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useSession } from "next-auth/react";
import {
    useDailyProductionsQuery,
    useCreateDailyProductionMutation,
    useDeleteDailyProductionMutation,
    useUpdateDailyProductionMutation,
} from "@/lib/redux/slices/DailyProductionSlice";

interface DailyProduction {
    id?: string;
    item: string;
    quantityProduced: number;
    timeProduced: string;
    remark?: string;
}

interface DailyProductionUpdateData {
    id: string;
    data: Omit<DailyProduction, "id">;
}

const DailyProductionManagement: React.FC = () => {
    const { data: sessionData } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentDailyProduction, setCurrentDailyProduction] = useState<DailyProduction>({
        item: "",
        quantityProduced: 0,
        timeProduced: "",
        remark: "",
    });

    const { data: dailyProductions = [], isLoading, refetch, isError, error } = useDailyProductionsQuery({});
    const [createDailyProduction] = useCreateDailyProductionMutation();
    const [updateDailyProduction] = useUpdateDailyProductionMutation();
    const [deleteDailyProduction] = useDeleteDailyProductionMutation();

    const filteredDailyProductions = dailyProductions?.filter((dailyProduction: DailyProduction) =>
        dailyProduction.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dailyProduction.remark && dailyProduction.remark.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentDailyProduction((prev) => ({
            ...prev,
            [name]: name === "quantityProduced" ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (modalMode === "create") {
                await createDailyProduction({
                    ...currentDailyProduction,
                    userId: sessionData?.user?.id,
                }).unwrap();
            } else if (currentDailyProduction.id) {
                const updateData: DailyProductionUpdateData = {
                    id: currentDailyProduction.id,
                    data: { ...currentDailyProduction },
                };
                await updateDailyProduction(updateData).unwrap();
            }

            setIsModalOpen(false);
            resetForm();
            refetch();
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'message' in error) {
                const err = error as { message?: string; data?: { message?: string } };
                alert(`Error saving daily production: ${err.data?.message || err.message}`);
            } else {
                alert('An unknown error occurred while saving daily production.');
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this daily production?")) {
            try {
                await deleteDailyProduction(id).unwrap();
                refetch();
            } catch (error: unknown) {
                if (error && typeof error === 'object' && 'data' in error) {
                    const err = error as FetchBaseQueryError & { data?: { message?: string } };
                    alert(`Error deleting daily production: ${err.data?.message || 'An error occurred'}`);
                } else {
                    alert('An unknown error occurred while deleting daily production.');
                }
            }
        }
    };

    const handleEdit = (dailyProduction: DailyProduction) => {
        setCurrentDailyProduction(dailyProduction);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentDailyProduction({
            item: "",
            quantityProduced: 0,
            timeProduced: "",
            remark: "",
        });
    };

    useEffect(() => {
        if (isError) {
            if ("data" in error) {
                const errorMessage = (error.data as { message?: string })?.message || "Unknown error";
                alert(`Error fetching daily productions: ${errorMessage}`);
            } else {
                alert("Unknown error occurred");
            }
        }
    }, [isError, error]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Daily Production Management</h1>

            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search daily productions..."
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
                    Add Daily Production
                </button>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredDailyProductions.map((dailyProduction: DailyProduction) => (
                        <div key={dailyProduction.id} className="border rounded p-4 shadow">
                            <h2 className="text-xl font-semibold mb-1">{dailyProduction.item}</h2>
                            <p className="text-gray-600 mb-2">Quantity Produced: {dailyProduction.quantityProduced}</p>
                            <p className="text-gray-600 mb-2">Time Produced: {new Date(dailyProduction.timeProduced).toLocaleString()}</p>
                            <p className="text-gray-600 mb-4">Remark: {dailyProduction.remark || "N/A"}</p>
                            <div className="flex gap-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleEdit(dailyProduction)}>
                                    Edit
                                </button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(dailyProduction.id!)}>
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
                            {modalMode === "create" ? "Add New Daily Production" : "Edit Daily Production"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="item"
                                placeholder="Item"
                                value={currentDailyProduction.item}
                                onChange={handleInputChange}
                                className="border w-full mb-2 px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="quantityProduced"
                                placeholder="Quantity Produced"
                                value={currentDailyProduction.quantityProduced}
                                onChange={handleInputChange}
                                className="border w-full mb-2 px-3 py-2 rounded"
                                required
                            />
                            <input
                                type="datetime-local"
                                name="timeProduced"
                                placeholder="Time Produced"
                                value={currentDailyProduction.timeProduced}
                                onChange={handleInputChange}
                                className="border w-full mb-2 px-3 py-2 rounded"
                                required
                            />
                            <textarea
                                name="remark"
                                placeholder="Remark"
                                value={currentDailyProduction.remark}
                                onChange={handleInputChange}
                                className="border w-full mb-4 px-3 py-2 rounded"
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

export default DailyProductionManagement;
