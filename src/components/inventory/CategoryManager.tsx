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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Folder,
  FolderPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Search,
  ChevronRight,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  description: string;
  productsCount: number;
  createdAt: string;
  status: "active" | "inactive";
}

interface CategoryFormData {
  name: string;
  parentId: string | null;
  description: string;
}

interface CategoryManagerProps {
  categories?: Category[];
}

const CategoryManager = ({
  categories: propCategories,
}: CategoryManagerProps) => {
  // Default categories if none provided
  const defaultCategories: Category[] = [
    {
      id: "cat-1",
      name: "Electronics",
      parentId: null,
      description: "Electronic devices and accessories",
      productsCount: 45,
      createdAt: "2023-05-10",
      status: "active",
    },
    {
      id: "cat-2",
      name: "Smartphones",
      parentId: "cat-1",
      description: "Mobile phones and accessories",
      productsCount: 28,
      createdAt: "2023-05-12",
      status: "active",
    },
    {
      id: "cat-3",
      name: "Laptops",
      parentId: "cat-1",
      description: "Notebook computers and accessories",
      productsCount: 17,
      createdAt: "2023-05-15",
      status: "active",
    },
    {
      id: "cat-4",
      name: "Clothing",
      parentId: null,
      description: "Apparel and fashion items",
      productsCount: 62,
      createdAt: "2023-05-18",
      status: "active",
    },
    {
      id: "cat-5",
      name: "Men's Wear",
      parentId: "cat-4",
      description: "Clothing for men",
      productsCount: 30,
      createdAt: "2023-05-20",
      status: "active",
    },
    {
      id: "cat-6",
      name: "Women's Wear",
      parentId: "cat-4",
      description: "Clothing for women",
      productsCount: 32,
      createdAt: "2023-05-22",
      status: "active",
    },
    {
      id: "cat-7",
      name: "Accessories",
      parentId: null,
      description: "Various accessories",
      productsCount: 25,
      createdAt: "2023-05-25",
      status: "inactive",
    },
  ];

  const [categories, setCategories] = useState<Category[]>(
    propCategories || defaultCategories,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    parentId: null,
    description: "",
  });

  // Get parent categories (those with null parentId)
  const parentCategories = categories.filter((cat) => cat.parentId === null);

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle parent category selection
  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "none" ? null : e.target.value;
    setFormData({
      ...formData,
      parentId: value,
    });
  };

  // Open add category dialog
  const openAddDialog = () => {
    setFormData({
      name: "",
      parentId: null,
      description: "",
    });
    setIsAddDialogOpen(true);
  };

  // Open edit category dialog
  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      parentId: category.parentId,
      description: category.description,
    });
    setIsEditDialogOpen(true);
  };

  // Add new category
  const addCategory = () => {
    const newCategory: Category = {
      id: `cat-${categories.length + 1}`,
      name: formData.name,
      parentId: formData.parentId,
      description: formData.description,
      productsCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
    };

    setCategories([...categories, newCategory]);
    setIsAddDialogOpen(false);
  };

  // Update existing category
  const updateCategory = () => {
    if (!currentCategory) return;

    const updatedCategories = categories.map((cat) =>
      cat.id === currentCategory.id
        ? {
            ...cat,
            name: formData.name,
            parentId: formData.parentId,
            description: formData.description,
          }
        : cat,
    );

    setCategories(updatedCategories);
    setIsEditDialogOpen(false);
  };

  // Delete category
  const deleteCategory = (categoryId: string) => {
    // In a real app, you would want to confirm deletion and handle child categories
    const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
    setCategories(updatedCategories);
  };

  // Get category path (breadcrumb)
  const getCategoryPath = (category: Category): string => {
    if (!category.parentId) return category.name;

    const parent = categories.find((cat) => cat.id === category.parentId);
    if (!parent) return category.name;

    return `${getCategoryPath(parent)} > ${category.name}`;
  };

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Category Management
          </h2>
          <p className="text-gray-500">
            Organize your products with hierarchical categories
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <FolderPlus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search categories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Folder className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="font-medium">
                        {getCategoryPath(category)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.productsCount}</TableCell>
                  <TableCell>{category.createdAt}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        category.status === "active" ? "default" : "secondary"
                      }
                      className={
                        category.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {category.status === "active" ? "Active" : "Inactive"}
                    </Badge>
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
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Category
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

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="parent" className="text-right font-medium">
                Parent Category
              </label>
              <select
                id="parent"
                name="parent"
                value={formData.parentId || "none"}
                onChange={handleParentChange}
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="none">None (Top Level)</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right font-medium">
                Description
              </label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addCategory}>Add Category</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right font-medium">
                Name
              </label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-parent" className="text-right font-medium">
                Parent Category
              </label>
              <select
                id="edit-parent"
                name="parent"
                value={formData.parentId || "none"}
                onChange={handleParentChange}
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="none">None (Top Level)</option>
                {parentCategories
                  .filter((cat) => cat.id !== currentCategory?.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="edit-description"
                className="text-right font-medium"
              >
                Description
              </label>
              <Input
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={updateCategory}>Update Category</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
