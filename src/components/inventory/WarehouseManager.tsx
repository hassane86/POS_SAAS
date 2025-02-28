import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowLeftRight,
  Search,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  manager: string;
  isMain: boolean;
  productCount: number;
  status: "active" | "inactive";
}

interface StockTransfer {
  id: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  date: string;
  items: number;
  status: "pending" | "completed" | "cancelled";
}

interface WarehouseManagerProps {
  warehouses?: Warehouse[];
  transfers?: StockTransfer[];
}

const WarehouseManager = ({
  warehouses = [
    {
      id: "WH-001",
      name: "Main Warehouse",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      phone: "(212) 555-1234",
      email: "main@example.com",
      manager: "John Smith",
      isMain: true,
      productCount: 1250,
      status: "active",
    },
    {
      id: "WH-002",
      name: "East Coast Distribution",
      address: "456 Commerce Ave",
      city: "Boston",
      state: "MA",
      zipCode: "02108",
      phone: "(617) 555-5678",
      email: "eastcoast@example.com",
      manager: "Sarah Johnson",
      isMain: false,
      productCount: 875,
      status: "active",
    },
    {
      id: "WH-003",
      name: "West Coast Storage",
      address: "789 Pacific Blvd",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      phone: "(213) 555-9012",
      email: "westcoast@example.com",
      manager: "Michael Brown",
      isMain: false,
      productCount: 920,
      status: "active",
    },
    {
      id: "WH-004",
      name: "Midwest Facility",
      address: "321 Central Road",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      phone: "(312) 555-3456",
      email: "midwest@example.com",
      manager: "Emily Davis",
      isMain: false,
      productCount: 540,
      status: "inactive",
    },
  ],
  transfers = [
    {
      id: "TR-001",
      sourceWarehouse: "Main Warehouse",
      destinationWarehouse: "East Coast Distribution",
      date: "2023-06-10",
      items: 45,
      status: "completed",
    },
    {
      id: "TR-002",
      sourceWarehouse: "Main Warehouse",
      destinationWarehouse: "West Coast Storage",
      date: "2023-06-12",
      items: 32,
      status: "completed",
    },
    {
      id: "TR-003",
      sourceWarehouse: "East Coast Distribution",
      destinationWarehouse: "Midwest Facility",
      date: "2023-06-15",
      items: 18,
      status: "pending",
    },
    {
      id: "TR-004",
      sourceWarehouse: "West Coast Storage",
      destinationWarehouse: "Main Warehouse",
      date: "2023-06-18",
      items: 27,
      status: "pending",
    },
  ],
}: WarehouseManagerProps) => {
  const [activeTab, setActiveTab] = useState("warehouses");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewWarehouseDialogOpen, setIsNewWarehouseDialogOpen] =
    useState(false);
  const [isNewTransferDialogOpen, setIsNewTransferDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getStatusBadge = (
    status: "active" | "inactive" | "pending" | "completed" | "cancelled",
  ) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.state.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredTransfers = transfers.filter(
    (transfer) =>
      transfer.sourceWarehouse
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transfer.destinationWarehouse
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsNewWarehouseDialogOpen(true);
  };

  const handleDeleteWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Warehouse Management</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search warehouses or transfers..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {activeTab === "warehouses" ? (
            <Dialog
              open={isNewWarehouseDialogOpen}
              onOpenChange={setIsNewWarehouseDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Warehouse
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedWarehouse ? "Edit Warehouse" : "Add New Warehouse"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="col-span-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Warehouse Name
                    </label>
                    <Input
                      id="name"
                      defaultValue={selectedWarehouse?.name || ""}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      Address
                    </label>
                    <Input
                      id="address"
                      defaultValue={selectedWarehouse?.address || ""}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="text-sm font-medium">
                      City
                    </label>
                    <Input
                      id="city"
                      defaultValue={selectedWarehouse?.city || ""}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="text-sm font-medium">
                      State
                    </label>
                    <Input
                      id="state"
                      defaultValue={selectedWarehouse?.state || ""}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="text-sm font-medium">
                      Zip Code
                    </label>
                    <Input
                      id="zipCode"
                      defaultValue={selectedWarehouse?.zipCode || ""}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      defaultValue={selectedWarehouse?.phone || ""}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={selectedWarehouse?.email || ""}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="manager" className="text-sm font-medium">
                      Manager
                    </label>
                    <Input
                      id="manager"
                      defaultValue={selectedWarehouse?.manager || ""}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isMain"
                      defaultChecked={selectedWarehouse?.isMain || false}
                    />
                    <label htmlFor="isMain" className="text-sm font-medium">
                      Set as Main Warehouse
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsNewWarehouseDialogOpen(false);
                      setSelectedWarehouse(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // In a real app, this would save the warehouse data
                      setIsNewWarehouseDialogOpen(false);
                      setSelectedWarehouse(null);
                    }}
                  >
                    {selectedWarehouse ? "Update" : "Add"} Warehouse
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog
              open={isNewTransferDialogOpen}
              onOpenChange={setIsNewTransferDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <ArrowLeftRight className="mr-2 h-4 w-4" /> New Transfer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Stock Transfer</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <label htmlFor="source" className="text-sm font-medium">
                      Source Warehouse
                    </label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select source warehouse">
                          Select source warehouse
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses
                          .filter((w) => w.status === "active")
                          .map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="destination"
                      className="text-sm font-medium"
                    >
                      Destination Warehouse
                    </label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select destination warehouse">
                          Select destination warehouse
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses
                          .filter((w) => w.status === "active")
                          .map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="date" className="text-sm font-medium">
                      Transfer Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="products" className="text-sm font-medium">
                      Products to Transfer
                    </label>
                    <div className="mt-1 p-4 border rounded-md">
                      <p className="text-sm text-gray-500 text-center">
                        Select products from inventory to transfer
                      </p>
                      <Button variant="outline" className="w-full mt-2">
                        <Plus className="mr-2 h-4 w-4" /> Add Products
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsNewTransferDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewTransferDialogOpen(false)}>
                    Create Transfer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <Tabs
            defaultValue="warehouses"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="warehouses">
                <Building2 className="mr-2 h-4 w-4" /> Warehouses
              </TabsTrigger>
              <TabsTrigger value="transfers">
                <ArrowLeftRight className="mr-2 h-4 w-4" /> Stock Transfers
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {activeTab === "warehouses" ? (
            <Table>
              <TableCaption>List of all warehouses in the system</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.length > 0 ? (
                  filteredWarehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">
                        {warehouse.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {warehouse.name}
                          {warehouse.isMain && (
                            <Badge variant="outline" className="ml-2">
                              Main
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                            {warehouse.city}, {warehouse.state}
                          </span>
                          <span className="text-xs text-gray-500">
                            {warehouse.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1 text-gray-500" />
                            {warehouse.manager}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Phone className="h-3 w-3 mr-1" />
                            {warehouse.phone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{warehouse.productCount}</TableCell>
                      <TableCell>{getStatusBadge(warehouse.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditWarehouse(warehouse)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Warehouse</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteWarehouse(warehouse)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete Warehouse</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No warehouses found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableCaption>
                List of all stock transfers between warehouses
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.length > 0 ? (
                  filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-medium">
                        {transfer.id}
                      </TableCell>
                      <TableCell>{transfer.sourceWarehouse}</TableCell>
                      <TableCell>{transfer.destinationWarehouse}</TableCell>
                      <TableCell>{transfer.date}</TableCell>
                      <TableCell>{transfer.items}</TableCell>
                      <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            {transfer.status === "pending" && (
                              <>
                                <DropdownMenuItem>
                                  <ArrowLeftRight className="mr-2 h-4 w-4" />
                                  <span>Complete Transfer</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Cancel Transfer</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No transfers found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the warehouse "
              {selectedWarehouse?.name}" and all its data. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedWarehouse(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // In a real app, this would delete the warehouse
                setIsDeleteDialogOpen(false);
                setSelectedWarehouse(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WarehouseManager;
