'use client';

import React, { useState, useMemo } from 'react';
import {
    Package,
    AlertTriangle,
    Search,
    Download,
    History,
    Box,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar,
    User,
    FileText,
    X,
    ChevronDown,
    ChevronUp,
    Loader2
} from 'lucide-react';

import {
    useGetAllStockItemsQuery,
    useCreateStockItemMutation,
    useUpdateStockItemMutation,
    useDeleteStockItemMutation,
    useStockInMutation,
    useStockOutMutation,
    useGetStockMovementsQuery,
    useGetLowStockItemsQuery,
    useGetStockStatisticsQuery,
} from '@/lib/redux/slices/StockSlice';

// Types
interface StockItem {
    id: string;
    name: string;
    category: 'Ingredients' | 'Products' | 'Packaging';
    currentStock: number;
    unit: string;
    minStock: number;
    maxStock: number;
    lastRestocked: string | null;
    supplier: string;
    costPerUnit: number;
    reorderPoint: number;
}

interface StockMovement {
    id: string;
    itemId: string;
    itemName: string;
    type: 'IN' | 'OUT';
    quantity: number;
    previousStock: number;
    newStock: number;
    date: string;
    reference: string;
    userEmail?: string;
    reason: string;
    notes?: string;
    supplier?: string;
    batchNumber?: string;
    expiryDate?: string;
}

interface StockInFormData {
    itemId: string;
    quantity: number;
    supplier: string;
    batchNumber: string;
    expiryDate: string;
    purchasePrice: number;
    notes: string;
    reference?: string;
}

interface StockOutFormData {
    itemId: string;
    quantity: number;
    reason: string;
    reference: string;
    notes: string;
}

const StockManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMovementType, setFilterMovementType] = useState<string>('All');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showStockInModal, setShowStockInModal] = useState(false);
    const [showStockOutModal, setShowStockOutModal] = useState(false);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    // RTK Query Hooks
    const { data: stockItems = [], isLoading: loadingItems } = useGetAllStockItemsQuery({});
    const { data: lowStockItems = [], isLoading: loadingLowStock } = useGetLowStockItemsQuery({});
    const { data: statistics, isLoading: loadingStats } = useGetStockStatisticsQuery({});

    // Build filters for movements query
    const movementFilters = useMemo(() => {
        const filters: any = {};
        if (filterMovementType !== 'All') filters.type = filterMovementType;
        if (dateFrom) filters.dateFrom = dateFrom;
        if (dateTo) filters.dateTo = dateTo;
        if (searchTerm) filters.search = searchTerm;
        return filters;
    }, [filterMovementType, dateFrom, dateTo, searchTerm]);

    const { data: stockMovements = [], isLoading: loadingMovements } = useGetStockMovementsQuery(movementFilters);

    // Mutations
    const [stockIn, { isLoading: isStockingIn }] = useStockInMutation();
    const [stockOut, { isLoading: isStockingOut }] = useStockOutMutation();

    // Form States
    const [stockInForm, setStockInForm] = useState<StockInFormData>({
        itemId: '',
        quantity: 0,
        supplier: '',
        batchNumber: '',
        expiryDate: '',
        purchasePrice: 0,
        notes: '',
        reference: ''
    });

    const [stockOutForm, setStockOutForm] = useState<StockOutFormData>({
        itemId: '',
        quantity: 0,
        reason: 'Sale',
        reference: '',
        notes: ''
    });

    // Handle Stock IN
    const handleStockIn = async () => {
        if (!stockInForm.itemId || stockInForm.quantity <= 0) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            await stockIn({
                itemId: stockInForm.itemId,
                quantity: stockInForm.quantity,
                supplier: stockInForm.supplier,
                batchNumber: stockInForm.batchNumber,
                expiryDate: stockInForm.expiryDate,
                purchasePrice: stockInForm.purchasePrice,
                notes: stockInForm.notes,
                reference: stockInForm.reference
            }).unwrap();

            // Reset form and close modal
            setStockInForm({
                itemId: '',
                quantity: 0,
                supplier: '',
                batchNumber: '',
                expiryDate: '',
                purchasePrice: 0,
                notes: '',
                reference: ''
            });
            setShowStockInModal(false);
            alert('Stock received successfully!');
        } catch (error: any) {
            alert(error?.data?.message || 'Failed to receive stock');
        }
    };

    // Handle Stock OUT
    const handleStockOut = async () => {
        if (!stockOutForm.itemId || stockOutForm.quantity <= 0 || !stockOutForm.reference) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            await stockOut({
                itemId: stockOutForm.itemId,
                quantity: stockOutForm.quantity,
                reason: stockOutForm.reason,
                reference: stockOutForm.reference,
                notes: stockOutForm.notes
            }).unwrap();

            // Reset form and close modal
            setStockOutForm({
                itemId: '',
                quantity: 0,
                reason: 'Sale',
                reference: '',
                notes: ''
            });
            setShowStockOutModal(false);
            alert('Stock issued successfully!');
        } catch (error: any) {
            alert(error?.data?.message || 'Failed to issue stock');
        }
    };

    const toggleRowExpand = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const exportToCSV = () => {
        const headers = ['Date', 'Item', 'Type', 'Quantity', 'Previous Stock', 'New Stock', 'Reference', 'User', 'Reason'];
        const csvData = stockMovements.map((m: StockMovement) => [
            m.date,
            m.itemName,
            m.type,
            m.quantity,
            m.previousStock,
            m.newStock,
            m.reference,
            m.userEmail || 'N/A',
            m.reason
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map((row: any) => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stock-movements-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    // Loading state
    if (loadingItems || loadingStats) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading stock data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Package className="w-8 h-8 text-orange-600" />
                                Stock Management & History
                            </h1>
                            <p className="text-gray-600 mt-1">Complete inventory tracking with full transaction history</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowStockInModal(true)}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg"
                            >
                                <ArrowDownCircle className="w-5 h-5" />
                                Stock IN
                            </button>
                            <button
                                onClick={() => setShowStockOutModal(true)}
                                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg"
                            >
                                <ArrowUpCircle className="w-5 h-5" />
                                Stock OUT
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Items</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {statistics?.totalItems || stockItems.length}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Active products</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Box className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Stock IN Today</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">
                                    {statistics?.stockInToday || 0}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Items received</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <ArrowDownCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Stock OUT Today</p>
                                <p className="text-3xl font-bold text-red-600 mt-1">
                                    {statistics?.stockOutToday || 0}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Items dispatched</p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-lg">
                                <ArrowUpCircle className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Low Stock Alerts</p>
                                <p className="text-3xl font-bold text-orange-600 mt-1">
                                    {statistics?.lowStockItems || lowStockItems.length}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Need reorder</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <AlertTriangle className="w-8 h-8 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert Banner */}
                {lowStockItems.length > 0 && (
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-lg">
                        <div className="flex items-start">
                            <AlertTriangle className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-orange-800 font-semibold">⚠️ Low Stock Alert!</h3>
                                <p className="text-orange-700 text-sm mt-1">
                                    {lowStockItems.length} item(s) are running low:
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {lowStockItems.map((item: StockItem) => (
                                        <span key={item.id} className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-xs font-medium">
                                            {item.name} ({item.currentStock} {item.unit})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content - Stock Movements History */}
                <div className="bg-white rounded-xl shadow-md">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <History className="w-6 h-6 text-orange-600" />
                            Complete Stock Movement History
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">Track all incoming and outgoing inventory transactions</p>
                    </div>

                    {/* Filters Section */}
                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by item, reference, or user..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Movement Type Filter */}
                            <select
                                value={filterMovementType}
                                onChange={(e) => setFilterMovementType(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="All">All Movements</option>
                                <option value="IN">Stock IN Only</option>
                                <option value="OUT">Stock OUT Only</option>
                            </select>

                            {/* Date From */}
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                placeholder="From Date"
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />

                            {/* Date To */}
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                placeholder="To Date"
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{stockMovements.length}</span> movements
                            </p>
                            <button
                                onClick={exportToCSV}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Movements Table */}
                    <div className="overflow-x-auto">
                        {loadingMovements ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Loading movements...</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Date & Time
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock Change</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reference</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                User
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stockMovements.map((movement: StockMovement) => (
                                        <React.Fragment key={movement.id}>
                                            <tr className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900">{formatDate(movement.date)}</span>
                                                        <span className="text-xs text-gray-500">{formatTime(movement.date)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{movement.itemName}</div>
                                                    <div className="text-xs text-gray-500">{movement.reason}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${movement.type === 'IN'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {movement.type === 'IN' ? (
                                                            <><ArrowDownCircle className="w-3 h-3" /> Stock IN</>
                                                        ) : (
                                                            <><ArrowUpCircle className="w-3 h-3" /> Stock OUT</>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-bold text-lg ${movement.type === 'IN' ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-gray-500">{movement.previousStock}</span>
                                                        <span className="text-gray-400">→</span>
                                                        <span className="font-semibold text-gray-900">{movement.newStock}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-900 font-mono">{movement.reference}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                                            <User className="w-4 h-4 text-orange-600" />
                                                        </div>
                                                        <span className="text-sm text-gray-900">{movement.userEmail || 'System'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleRowExpand(movement.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        {expandedRows.has(movement.id) ? (
                                                            <ChevronUp className="w-5 h-5" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Expanded Row Details */}
                                            {expandedRows.has(movement.id) && (
                                                <tr className="bg-blue-50">
                                                    <td colSpan={8} className="px-6 py-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Additional Details</h4>
                                                                {movement.supplier && (
                                                                    <p className="text-sm text-gray-600 mb-1">
                                                                        <span className="font-medium">Supplier:</span> {movement.supplier}
                                                                    </p>
                                                                )}
                                                                {movement.batchNumber && (
                                                                    <p className="text-sm text-gray-600 mb-1">
                                                                        <span className="font-medium">Batch #:</span> {movement.batchNumber}
                                                                    </p>
                                                                )}
                                                                {movement.expiryDate && (
                                                                    <p className="text-sm text-gray-600">
                                                                        <span className="font-medium">Expiry:</span> {formatDate(movement.expiryDate)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {movement.notes && (
                                                                <div className="md:col-span-2">
                                                                    <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Notes</h4>
                                                                    <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                                                                        {movement.notes}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {!loadingMovements && stockMovements.length === 0 && (
                        <div className="text-center py-12">
                            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No movements found</h3>
                            <p className="text-gray-600">Try adjusting your search filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stock IN Modal */}
            {showStockInModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <ArrowDownCircle className="w-6 h-6 text-green-600" />
                                    Stock IN - Receive Inventory
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">Record incoming stock from suppliers or production</p>
                            </div>
                            <button
                                onClick={() => setShowStockInModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {/* Item Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Select Item *
                                    </label>
                                    <select
                                        value={stockInForm.itemId}
                                        onChange={(e) => setStockInForm({ ...stockInForm, itemId: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Choose an item...</option>
                                        {stockItems.map((item: StockItem) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} ({item.category}) - Current: {item.currentStock} {item.unit}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        value={stockInForm.quantity || ''}
                                        onChange={(e) => setStockInForm({ ...stockInForm, quantity: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Enter quantity"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                {/* Supplier */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Supplier *
                                    </label>
                                    <input
                                        type="text"
                                        value={stockInForm.supplier}
                                        onChange={(e) => setStockInForm({ ...stockInForm, supplier: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Supplier name"
                                        required
                                    />
                                </div>

                                {/* Reference */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Reference Number
                                    </label>
                                    <input
                                        type="text"
                                        value={stockInForm.reference}
                                        onChange={(e) => setStockInForm({ ...stockInForm, reference: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="e.g., PO-2025-001"
                                    />
                                </div>

                                {/* Batch Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Batch Number
                                    </label>
                                    <input
                                        type="text"
                                        value={stockInForm.batchNumber}
                                        onChange={(e) => setStockInForm({ ...stockInForm, batchNumber: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="e.g., BATCH-2025-001"
                                    />
                                </div>

                                {/* Expiry Date */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="date"
                                        value={stockInForm.expiryDate}
                                        onChange={(e) => setStockInForm({ ...stockInForm, expiryDate: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Purchase Price */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Purchase Price per Unit
                                    </label>
                                    <input
                                        type="number"
                                        value={stockInForm.purchasePrice || ''}
                                        onChange={(e) => setStockInForm({ ...stockInForm, purchasePrice: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        value={stockInForm.notes}
                                        onChange={(e) => setStockInForm({ ...stockInForm, notes: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Additional notes..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => setShowStockInModal(false)}
                                    disabled={isStockingIn}
                                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStockIn}
                                    disabled={isStockingIn}
                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isStockingIn ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowDownCircle className="w-5 h-5" />
                                            Receive Stock
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stock OUT Modal */}
            {showStockOutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <ArrowUpCircle className="w-6 h-6 text-red-600" />
                                    Stock OUT - Issue Inventory
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">Record outgoing stock for sales, production, or wastage</p>
                            </div>
                            <button
                                onClick={() => setShowStockOutModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {/* Item Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Select Item *
                                    </label>
                                    <select
                                        value={stockOutForm.itemId}
                                        onChange={(e) => setStockOutForm({ ...stockOutForm, itemId: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Choose an item...</option>
                                        {stockItems.map((item: StockItem) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} - Available: {item.currentStock} {item.unit}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        value={stockOutForm.quantity || ''}
                                        onChange={(e) => setStockOutForm({ ...stockOutForm, quantity: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Enter quantity"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                {/* Reason */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Reason *
                                    </label>
                                    <select
                                        value={stockOutForm.reason}
                                        onChange={(e) => setStockOutForm({ ...stockOutForm, reason: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="Sale">Sale</option>
                                        <option value="Production Use">Production Use</option>
                                        <option value="Wastage">Wastage</option>
                                        <option value="Damaged">Damaged</option>
                                        <option value="Expired">Expired</option>
                                        <option value="Return">Return</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Reference */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Reference Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={stockOutForm.reference}
                                        onChange={(e) => setStockOutForm({ ...stockOutForm, reference: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="e.g., SALE-2025-001, PROD-2025-001"
                                        required
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        value={stockOutForm.notes}
                                        onChange={(e) => setStockOutForm({ ...stockOutForm, notes: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Additional notes..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => setShowStockOutModal(false)}
                                    disabled={isStockingOut}
                                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStockOut}
                                    disabled={isStockingOut}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isStockingOut ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowUpCircle className="w-5 h-5" />
                                            Issue Stock
                                        </>
                                    )}
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