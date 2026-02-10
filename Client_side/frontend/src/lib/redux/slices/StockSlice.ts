import { apiSlice } from "./ApiSlice";

const stockApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Stock Items Endpoints
        getAllStockItems: builder.query({
            query: () => ({ url: "/stock/items" }),
        }),

        getStockItemById: builder.query({
            query: (id) => ({ url: `/stock/items/${id}` }),
        }),

        createStockItem: builder.mutation({
            query: (data) => ({
                url: "/stock/items",
                method: "POST",
                body: data
            }),
        }),

        updateStockItem: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/stock/items/${id}`,
                method: "PUT",
                body: data
            }),
        }),

        deleteStockItem: builder.mutation({
            query: (id) => ({
                url: `/stock/items/${id}`,
                method: "DELETE"
            }),
        }),

        // Stock Movement Endpoints
        stockIn: builder.mutation({
            query: (data) => ({
                url: "/stock/in",
                method: "POST",
                body: data
            }),
        }),

        stockOut: builder.mutation({
            query: (data) => ({
                url: "/stock/out",
                method: "POST",
                body: data
            }),
        }),

        getStockMovements: builder.query({
            query: (filters) => {
                const params = new URLSearchParams();
                if (filters?.itemId) params.append('itemId', filters.itemId);
                if (filters?.type) params.append('type', filters.type);
                if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
                if (filters?.dateTo) params.append('dateTo', filters.dateTo);
                if (filters?.search) params.append('search', filters.search);

                return {
                    url: `/stock/movements${params.toString() ? `?${params.toString()}` : ''}`
                };
            },
        }),

        getStockMovementById: builder.query({
            query: (id) => ({ url: `/stock/movements/${id}` }),
        }),

        // Stock Statistics & Reports
        getLowStockItems: builder.query({
            query: () => ({ url: "/stock/low-stock" }),
        }),

        getStockStatistics: builder.query({
            query: () => ({ url: "/stock/statistics" }),
        }),
    }),
});

export const {
    // Stock Items
    useGetAllStockItemsQuery,
    useGetStockItemByIdQuery,
    useCreateStockItemMutation,
    useUpdateStockItemMutation,
    useDeleteStockItemMutation,

    // Stock Movements
    useStockInMutation,
    useStockOutMutation,
    useGetStockMovementsQuery,
    useGetStockMovementByIdQuery,

    // Statistics & Reports
    useGetLowStockItemsQuery,
    useGetStockStatisticsQuery,
} = stockApi;