"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus } from "lucide-react";
import { toast } from "sonner";

interface StockControl {
  id?: string;
  item: string;
  openingStock: number;
  produced: number;
  sold: number;
  remainingStock: number;
  date?: string;
  createdAt?: string;
}

const products = ["bread", "Chapati", "mandazi", "cake", "sugar", "salt"];

export default function StockControlPage() {
  const [stockControls, setStockControls] = useState<StockControl[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<StockControl | null>(null);
  const [formData, setFormData] = useState({
    item: "",
    openingStock: 0,
    produced: 0,
    sold: 0,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchStockControls();
  }, []);

  const fetchStockControls = async () => {
    try {
      const response = await fetch("/api/stock-control");
      if (response.ok) {
        const data = await response.json();
        setStockControls(data);
      }
    } catch (error) {
      toast.error("Failed to fetch stock controls");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingStock ? `/api/stock-control/${editingStock.id}` : "/api/stock-control";
      const method = editingStock ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          remainingStock: formData.openingStock + formData.produced - formData.sold,
        }),
      });

      if (response.ok) {
        toast.success(editingStock ? "Stock control updated" : "Stock control created");
        fetchStockControls();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error("Failed to save stock control");
      }
    } catch (error) {
      toast.error("Error saving stock control");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stock control?")) return;

    try {
      const response = await fetch(`/api/stock-control/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Stock control deleted");
        fetchStockControls();
      } else {
        toast.error("Failed to delete stock control");
      }
    } catch (error) {
      toast.error("Error deleting stock control");
    }
  };

  const handleEdit = (stock: StockControl) => {
    setEditingStock(stock);
    setFormData({
      item: stock.item,
      openingStock: stock.openingStock,
      produced: stock.produced,
      sold: stock.sold,
      date: stock.date ? new Date(stock.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      item: "",
      openingStock: 0,
      produced: 0,
      sold: 0,
      date: new Date().toISOString().split('T')[0],
    });
    setEditingStock(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stock Control</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Stock Control
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStock ? "Edit" : "Add"} Stock Control</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="item">Product</Label>
                <select
                  id="item"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="openingStock">Opening Stock</Label>
                <Input
                  id="openingStock"
                  type="number"
                  value={formData.openingStock}
                  onChange={(e) => setFormData({ ...formData, openingStock: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="produced">Produced</Label>
                <Input
                  id="produced"
                  type="number"
                  value={formData.produced}
                  onChange={(e) => setFormData({ ...formData, produced: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sold">Sold</Label>
                <Input
                  id="sold"
                  type="number"
                  value={formData.sold}
                  onChange={(e) => setFormData({ ...formData, sold: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingStock ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Opening Stock</TableHead>
                <TableHead>Produced</TableHead>
                <TableHead>Sold</TableHead>
                <TableHead>Remaining Stock</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockControls.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>{stock.item}</TableCell>
                  <TableCell>{stock.openingStock}</TableCell>
                  <TableCell>{stock.produced}</TableCell>
                  <TableCell>{stock.sold}</TableCell>
                  <TableCell>{stock.remainingStock}</TableCell>
                  <TableCell>{stock.date ? new Date(stock.date).toLocaleDateString() : ""}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(stock)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(stock.id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
