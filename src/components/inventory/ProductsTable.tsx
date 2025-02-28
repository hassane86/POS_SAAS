import React, { useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  ArrowUpDown,
  Package,
  Warehouse,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: {
    [location: string]: number;
  };
  status: "in-stock" | "low-stock" | "out-of-stock";
}

interface ProductsTableProps {
  products?: Product[];
  locations?: string[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onAdd?: () => void;
}

const ProductsTable = ({
  products = [],
  locations = ["Main Store", "Warehouse A", "Warehouse B"],
  onEdit = () => {},
  onDelete = () => {},
  onAdd = () => {},
}: ProductsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Default products if none provided
  const defaultProducts: Product[] = [
    {
      id: "P001",
      name: "Smartphone X",
      sku: "SM-X-001",
      category: "Electronics",
      price: 799.99,
      stock: {
        "Main Store": 15,
        "Warehouse A": 25,
        "Warehouse B": 10,
      },
      status: "in-stock",
    },
    {
      id: "P002",
      name: "Laptop Pro",
      sku: "LP-002",
      category: "Electronics",
      price: 1299.99,
      stock: {
        "Main Store": 8,
        "Warehouse A": 12,
        "Warehouse B": 5,
      },
      status: "in-stock",
    },
    {
      id: "P003",
      name: "Wireless Headphones",
      sku: "WH-003",
      category: "Audio",
      price: 149.99,
      stock: {
        "Main Store": 3,
        "Warehouse A": 7,
        "Warehouse B": 0,
      },
      status: "low-stock",
    },
    {
      id: "P004",
      name: "Smart Watch",
      sku: "SW-004",
      category: "Wearables",
      price: 249.99,
      stock: {
        "Main Store": 0,
        "Warehouse A": 0,
        "Warehouse B": 0,
      },
      status: "out-of-stock",
    },
    {
      id: "P005",
      name: "Bluetooth Speaker",
      sku: "BS-005",
      category: "Audio",
      price: 89.99,
      stock: {
        "Main Store": 12,
        "Warehouse A": 18,
        "Warehouse B": 15,
      },
      status: "in-stock",
    },
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  // Filter products based on search term and filters
  const filteredProducts = displayProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" || product.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categories = Array.from(
    new Set(displayProducts.map((product) => product.category)),
  );

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete);
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "in-stock":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            In Stock
          </Badge>
        );
      case "low-stock":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Low Stock
          </Badge>
        );
      case "out-of-stock":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Out of Stock
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableCaption>
            A list of your products and inventory levels.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Product
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end">
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              {locations.map((location) => (
                <TableHead key={location} className="text-center">
                  <div className="flex flex-col items-center">
                    <Warehouse className="h-4 w-4 mb-1" />
                    {location}
                  </div>
                </TableHead>
              ))}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3">
                        <Package className="h-5 w-5 text-gray-500" />
                      </div>
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  {locations.map((location) => (
                    <TableCell key={location} className="text-center">
                      {product.stock[location] || 0}
                    </TableCell>
                  ))}
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(product.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7 + locations.length}
                  className="text-center py-6"
                >
                  No products found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {filteredProducts.length} of {displayProducts.length} products
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTable;
