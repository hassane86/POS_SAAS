import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeftRight,
  ArrowDown,
  ArrowUp,
  Search,
  Package,
  Truck,
  Building2,
  Calendar,
  FileText,
  Filter,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  addStock,
  removeStock,
  transferStock,
  getInventoryTransactions,
  getStockTransfers,
} from "@/api/inventory";
import { getProducts } from "@/api/products";
import { getStores } from "@/api/stores";
import { getSuppliers } from "@/api/suppliers";

const InventoryOperations: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("stock-in");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [selectedDestinationStore, setSelectedDestinationStore] =
    useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitCost, setUnitCost] = useState<number | undefined>();
  const [notes, setNotes] = useState<string>("");
  const [reason, setReason] = useState<string>("adjustment");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [transactionType, setTransactionType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (user?.company_id) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "history") {
      loadTransactions();
    } else if (activeTab === "transfers") {
      loadTransfers();
    }
  }, [activeTab, transactionType, dateRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (!user?.company_id) return;

      // Load products
      const productsData = await getProducts(user.company_id);
      setProducts(productsData);

      // Load stores
      const storesData = await getStores(user.company_id);
      setStores(storesData);
      if (storesData.length > 0) {
        setSelectedStore(storesData[0].id);
      }

      // Load suppliers
      const suppliersData = await getSuppliers(user.company_id);
      setSuppliers(suppliersData);

      // Load initial transactions
      if (activeTab === "history") {
        loadTransactions();
      } else if (activeTab === "transfers") {
        loadTransfers();
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setErrorMessage("Failed to load data. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const filters: any = {};

      if (transactionType !== "all") {
        filters.type = transactionType;
      }

      if (dateRange.start) {
        filters.startDate = dateRange.start;
      }

      if (dateRange.end) {
        filters.endDate = dateRange.end;
      }

      const transactionsData = await getInventoryTransactions(filters);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const loadTransfers = async () => {
    try {
      const filters: any = {};

      if (dateRange.start) {
        filters.startDate = dateRange.start;
      }

      if (dateRange.end) {
        filters.endDate = dateRange.end;
      }

      const transfersData = await getStockTransfers(filters);
      setTransfers(transfersData);
    } catch (error) {
      console.error("Error loading transfers:", error);
    }
  };

  const handleStockIn = async () => {
    if (
      !selectedProduct ||
      !selectedStore ||
      !quantity ||
      quantity <= 0 ||
      !user?.id
    ) {
      setErrorMessage("Please fill in all required fields with valid values.");
      setShowErrorDialog(true);
      return;
    }

    setIsSaving(true);
    try {
      await addStock(
        selectedProduct,
        selectedStore,
        quantity,
        user.id,
        notes,
        selectedSupplier || undefined,
        unitCost,
      );

      setSuccessMessage("Stock added successfully!");
      setShowSuccessDialog(true);
      resetForm();
    } catch (error) {
      console.error("Error adding stock:", error);
      setErrorMessage("Failed to add stock. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStockOut = async () => {
    if (
      !selectedProduct ||
      !selectedStore ||
      !quantity ||
      quantity <= 0 ||
      !user?.id
    ) {
      setErrorMessage("Please fill in all required fields with valid values.");
      setShowErrorDialog(true);
      return;
    }

    setIsSaving(true);
    try {
      await removeStock(
        selectedProduct,
        selectedStore,
        quantity,
        user.id,
        notes,
        reason,
      );

      setSuccessMessage("Stock removed successfully!");
      setShowSuccessDialog(true);
      resetForm();
    } catch (error: any) {
      console.error("Error removing stock:", error);
      setErrorMessage(
        error.message || "Failed to remove stock. Please try again.",
      );
      setShowErrorDialog(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTransfer = async () => {
    if (
      !selectedProduct ||
      !selectedStore ||
      !selectedDestinationStore ||
      !quantity ||
      quantity <= 0 ||
      !user?.id ||
      selectedStore === selectedDestinationStore
    ) {
      setErrorMessage(
        selectedStore === selectedDestinationStore
          ? "Source and destination stores cannot be the same."
          : "Please fill in all required fields with valid values.",
      );
      setShowErrorDialog(true);
      return;
    }

    setIsSaving(true);
    try {
      await transferStock(
        selectedProduct,
        selectedStore,
        selectedDestinationStore,
        quantity,
        user.id,
        notes,
      );

      setSuccessMessage("Stock transferred successfully!");
      setShowSuccessDialog(true);
      resetForm();
    } catch (error: any) {
      console.error("Error transferring stock:", error);
      setErrorMessage(
        error.message || "Failed to transfer stock. Please try again.",
      );
      setShowErrorDialog(true);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedProduct("");
    setQuantity(1);
    setUnitCost(undefined);
    setNotes("");
    setReason("adjustment");
    setSelectedSupplier("");
    setSelectedDestinationStore("");
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "stock_in":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Stock In
          </Badge>
        );
      case "stock_out":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Stock Out
          </Badge>
        );
      case "transfer_in":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Transfer In
          </Badge>
        );
      case "transfer_out":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            Transfer Out
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {type}
          </Badge>
        );
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      (transaction.products?.name &&
        transaction.products.name.toLowerCase().includes(searchLower)) ||
      (transaction.products?.sku &&
        transaction.products.sku.toLowerCase().includes(searchLower)) ||
      (transaction.stores?.name &&
        transaction.stores.name.toLowerCase().includes(searchLower)) ||
      (transaction.type && transaction.type.toLowerCase().includes(searchLower))
    );
  });

  const filteredTransfers = transfers.filter((transfer) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      (transfer.source?.name &&
        transfer.source.name.toLowerCase().includes(searchLower)) ||
      (transfer.destination?.name &&
        transfer.destination.name.toLowerCase().includes(searchLower)) ||
      (transfer.status && transfer.status.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="stock-in" className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            <span>Stock In</span>
          </TabsTrigger>
          <TabsTrigger value="stock-out" className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4" />
            <span>Stock Out</span>
          </TabsTrigger>
          <TabsTrigger value="transfer" className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            <span>Transfer</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>

        {/* Stock In Form */}
        <TabsContent value="stock-in">
          <Card>
            <CardHeader>
              <CardTitle>Add Stock</CardTitle>
              <CardDescription>Add new stock to your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">Product *</Label>
                    <Select
                      value={selectedProduct}
                      onValueChange={setSelectedProduct}
                    >
                      <SelectTrigger id="product">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}{" "}
                            {product.sku ? `(${product.sku})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store">Store/Warehouse *</Label>
                    <Select
                      value={selectedStore}
                      onValueChange={setSelectedStore}
                    >
                      <SelectTrigger id="store">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unitCost">Unit Cost</Label>
                    <Input
                      id="unitCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={unitCost || ""}
                      onChange={(e) =>
                        setUnitCost(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select
                      value={selectedSupplier}
                      onValueChange={setSelectedSupplier}
                    >
                      <SelectTrigger id="supplier">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any additional information"
                  />
                </div>

                <Button
                  onClick={handleStockIn}
                  disabled={
                    isSaving ||
                    !selectedProduct ||
                    !selectedStore ||
                    !quantity ||
                    quantity <= 0
                  }
                  className="w-full md:w-auto md:self-end"
                >
                  {isSaving ? "Processing..." : "Add Stock"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Out Form */}
        <TabsContent value="stock-out">
          <Card>
            <CardHeader>
              <CardTitle>Remove Stock</CardTitle>
              <CardDescription>
                Remove stock from your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-out">Product *</Label>
                    <Select
                      value={selectedProduct}
                      onValueChange={setSelectedProduct}
                    >
                      <SelectTrigger id="product-out">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}{" "}
                            {product.sku ? `(${product.sku})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store-out">Store/Warehouse *</Label>
                    <Select
                      value={selectedStore}
                      onValueChange={setSelectedStore}
                    >
                      <SelectTrigger id="store-out">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity-out">Quantity *</Label>
                    <Input
                      id="quantity-out"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Select value={reason} onValueChange={setReason}>
                      <SelectTrigger id="reason">
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adjustment">
                          Inventory Adjustment
                        </SelectItem>
                        <SelectItem value="damage">Damaged/Expired</SelectItem>
                        <SelectItem value="loss">Lost/Stolen</SelectItem>
                        <SelectItem value="return">
                          Return to Supplier
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes-out">Notes</Label>
                  <Textarea
                    id="notes-out"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any additional information"
                  />
                </div>

                <Button
                  onClick={handleStockOut}
                  disabled={
                    isSaving ||
                    !selectedProduct ||
                    !selectedStore ||
                    !quantity ||
                    quantity <= 0
                  }
                  className="w-full md:w-auto md:self-end"
                  variant="destructive"
                >
                  {isSaving ? "Processing..." : "Remove Stock"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transfer Form */}
        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Stock</CardTitle>
              <CardDescription>Move stock between locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="product-transfer">Product *</Label>
                  <Select
                    value={selectedProduct}
                    onValueChange={setSelectedProduct}
                  >
                    <SelectTrigger id="product-transfer">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} {product.sku ? `(${product.sku})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-store">Source Location *</Label>
                    <Select
                      value={selectedStore}
                      onValueChange={setSelectedStore}
                    >
                      <SelectTrigger id="source-store">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination-store">
                      Destination Location *
                    </Label>
                    <Select
                      value={selectedDestinationStore}
                      onValueChange={setSelectedDestinationStore}
                    >
                      <SelectTrigger id="destination-store">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores
                          .filter((store) => store.id !== selectedStore)
                          .map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              {store.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity-transfer">Quantity *</Label>
                  <Input
                    id="quantity-transfer"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes-transfer">Notes</Label>
                  <Textarea
                    id="notes-transfer"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any additional information"
                  />
                </div>

                <Button
                  onClick={handleTransfer}
                  disabled={
                    isSaving ||
                    !selectedProduct ||
                    !selectedStore ||
                    !selectedDestinationStore ||
                    selectedStore === selectedDestinationStore ||
                    !quantity ||
                    quantity <= 0
                  }
                  className="w-full md:w-auto md:self-end"
                >
                  {isSaving ? "Processing..." : "Transfer Stock"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all inventory transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative flex-1 w-full md:max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select
                    value={transactionType}
                    onValueChange={setTransactionType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="stock_in">Stock In</SelectItem>
                      <SelectItem value="stock_out">Stock Out</SelectItem>
                      <SelectItem value="transfer_in">Transfer In</SelectItem>
                      <SelectItem value="transfer_out">Transfer Out</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, start: e.target.value })
                      }
                      className="w-[140px]"
                    />
                    <span>to</span>
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, end: e.target.value })
                      }
                      className="w-[140px]"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(
                              transaction.transaction_date,
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {transaction.products?.name || "Unknown Product"}
                            </div>
                            {transaction.products?.sku && (
                              <div className="text-xs text-gray-500">
                                SKU: {transaction.products.sku}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {transaction.stores?.name || "Unknown Location"}
                          </TableCell>
                          <TableCell>
                            {getTransactionTypeLabel(transaction.type)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-medium ${transaction.quantity > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {transaction.quantity > 0 ? "+" : ""}
                              {transaction.quantity}
                            </span>
                          </TableCell>
                          <TableCell>
                            {transaction.users?.name || "Unknown User"}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate">
                              {transaction.notes || "-"}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">Success</DialogTitle>
          </DialogHeader>
          <div className="py-4">{successMessage}</div>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Error</DialogTitle>
          </DialogHeader>
          <div className="py-4">{errorMessage}</div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => setShowErrorDialog(false)}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryOperations;
