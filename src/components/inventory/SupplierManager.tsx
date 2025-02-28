import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
  Phone,
  Mail,
  MapPin,
  Globe,
  User,
} from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  status: "active" | "inactive";
  productsCount: number;
  lastOrderDate?: string;
}

interface SupplierManagerProps {
  suppliers?: Supplier[];
}

const SupplierManager = ({ suppliers = [] }: SupplierManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Default suppliers if none provided
  const defaultSuppliers: Supplier[] = [
    {
      id: "SUP-001",
      name: "Global Electronics Inc.",
      contactPerson: "John Smith",
      email: "john@globalelectronics.com",
      phone: "+1 (555) 123-4567",
      address: "123 Tech Blvd, San Francisco, CA 94107",
      website: "www.globalelectronics.com",
      status: "active",
      productsCount: 42,
      lastOrderDate: "2023-05-15",
    },
    {
      id: "SUP-002",
      name: "Premium Office Supplies",
      contactPerson: "Sarah Johnson",
      email: "sarah@premiumoffice.com",
      phone: "+1 (555) 987-6543",
      address: "456 Market St, Chicago, IL 60601",
      website: "www.premiumoffice.com",
      status: "active",
      productsCount: 28,
      lastOrderDate: "2023-06-02",
    },
    {
      id: "SUP-003",
      name: "Wholesale Furniture Co.",
      contactPerson: "Michael Brown",
      email: "michael@wholesalefurniture.com",
      phone: "+1 (555) 456-7890",
      address: "789 Oak Ave, Atlanta, GA 30301",
      website: "www.wholesalefurniture.com",
      status: "inactive",
      productsCount: 15,
      lastOrderDate: "2023-04-10",
    },
    {
      id: "SUP-004",
      name: "Tech Accessories Ltd.",
      contactPerson: "Emily Davis",
      email: "emily@techaccessories.com",
      phone: "+1 (555) 234-5678",
      address: "321 Pine St, Seattle, WA 98101",
      website: "www.techaccessories.com",
      status: "active",
      productsCount: 36,
      lastOrderDate: "2023-06-10",
    },
    {
      id: "SUP-005",
      name: "Food & Beverage Distributors",
      contactPerson: "Robert Wilson",
      email: "robert@fbdistributors.com",
      phone: "+1 (555) 876-5432",
      address: "567 Maple Rd, Dallas, TX 75201",
      website: "www.fbdistributors.com",
      status: "active",
      productsCount: 53,
      lastOrderDate: "2023-06-15",
    },
  ];

  const displaySuppliers = suppliers.length > 0 ? suppliers : defaultSuppliers;

  // Filter suppliers based on search query and active tab
  const filteredSuppliers = displaySuppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && supplier.status === "active";
    if (activeTab === "inactive")
      return matchesSearch && supplier.status === "inactive";
    return matchesSearch;
  });

  const handleAddSupplier = () => {
    // In a real app, this would add the supplier to the database
    setIsAddDialogOpen(false);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsAddDialogOpen(true);
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, this would delete the supplier from the database
    setIsDeleteAlertOpen(false);
    setSelectedSupplier(null);
  };

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Supplier Management
          </h1>
          <p className="text-gray-500">
            Manage your product suppliers and their details
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Supplier</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedSupplier ? "Edit Supplier" : "Add New Supplier"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details to {selectedSupplier ? "update" : "add"} a
                supplier.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Supplier Name
                  </label>
                  <Input
                    id="name"
                    defaultValue={selectedSupplier?.name || ""}
                    placeholder="Enter supplier name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactPerson"
                    className="text-sm font-medium"
                  >
                    Contact Person
                  </label>
                  <Input
                    id="contactPerson"
                    defaultValue={selectedSupplier?.contactPerson || ""}
                    placeholder="Enter contact name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={selectedSupplier?.email || ""}
                    placeholder="Enter email address"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </label>
                  <Input
                    id="phone"
                    defaultValue={selectedSupplier?.phone || ""}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="website" className="text-sm font-medium">
                    Website
                  </label>
                  <Input
                    id="website"
                    defaultValue={selectedSupplier?.website || ""}
                    placeholder="Enter website URL"
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <Input
                    id="address"
                    defaultValue={selectedSupplier?.address || ""}
                    placeholder="Enter full address"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <select
                    id="status"
                    defaultValue={selectedSupplier?.status || "active"}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm mt-1"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddSupplier}>
                {selectedSupplier ? "Update Supplier" : "Add Supplier"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs
          defaultValue="all"
          className="w-[400px]"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableCaption>A list of your suppliers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {supplier.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {supplier.contactPerson}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {supplier.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        supplier.status === "active" ? "default" : "secondary"
                      }
                      className={`${supplier.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {supplier.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{supplier.productsCount}</TableCell>
                  <TableCell>
                    {supplier.lastOrderDate || "No orders yet"}
                  </TableCell>
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
                          onClick={() => handleEditSupplier(supplier)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteSupplier(supplier)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the supplier "
              {selectedSupplier?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SupplierManager;
