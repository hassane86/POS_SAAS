import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Store,
  Eye,
  Download,
} from "lucide-react";
import { Store as StoreType } from "@/types/database";
import StoreForm from "./StoreForm";
import { getStores, createStore, updateStore, deleteStore } from "@/api/stores";
import { useAuth } from "@/lib/auth";
import { getCompanyByUserId } from "@/api/company";

const StoreList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyAndStores = async () => {
      if (user) {
        try {
          const company = await getCompanyByUserId(user.id);
          setCompanyId(company.id);
          loadStores(company.id);
        } catch (error) {
          console.error("Error fetching company:", error);
        }
      }
    };

    fetchCompanyAndStores();
  }, [user]);

  const loadStores = async (companyId: string) => {
    try {
      const data = await getStores(companyId);
      setStores(data);
    } catch (error) {
      console.error("Error loading stores:", error);
    }
  };

  const handleAddStore = async (storeData: Partial<StoreType>) => {
    if (!companyId) return;

    setIsLoading(true);
    try {
      const newStore = await createStore({
        ...storeData,
        company_id: companyId,
      });
      setStores([...stores, newStore]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding store:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStore = async (storeData: Partial<StoreType>) => {
    if (!selectedStore) return;

    setIsLoading(true);
    try {
      const updatedStore = await updateStore(selectedStore.id, storeData);
      setStores(
        stores.map((s) => (s.id === updatedStore.id ? updatedStore : s)),
      );
      setIsEditDialogOpen(false);
      setSelectedStore(null);
    } catch (error) {
      console.error("Error updating store:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStore = async () => {
    if (!selectedStore) return;

    setIsLoading(true);
    try {
      await deleteStore(selectedStore.id);
      setStores(stores.filter((s) => s.id !== selectedStore.id));
      setIsDeleteDialogOpen(false);
      setSelectedStore(null);
    } catch (error) {
      console.error("Error deleting store:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (store.city &&
        store.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (store.state &&
        store.state.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Stores</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Store className="mr-2 h-4 w-4" /> Add Store
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search stores..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Main Store</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>
                    {store.city && store.state
                      ? `${store.city}, ${store.state}`
                      : store.city || store.state || "-"}
                  </TableCell>
                  <TableCell>
                    {store.phone || store.email ? (
                      <div>
                        {store.phone && <div>{store.phone}</div>}
                        {store.email && (
                          <div className="text-sm text-muted-foreground">
                            {store.email}
                          </div>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${store.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {store.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {store.is_main ? (
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 border-blue-200"
                      >
                        Main Store
                      </Badge>
                    ) : (
                      "-"
                    )}
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
                          onClick={() => {
                            setSelectedStore(store);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Store</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/stores/${store.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedStore(store);
                            setIsDeleteDialogOpen(true);
                          }}
                          disabled={store.is_main}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete Store</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  {searchTerm
                    ? "No stores found matching your search."
                    : "No stores found. Add your first store!"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Store Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Store</DialogTitle>
          </DialogHeader>
          <StoreForm
            onSubmit={handleAddStore}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Store Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
          </DialogHeader>
          {selectedStore && (
            <StoreForm
              store={selectedStore}
              onSubmit={handleEditStore}
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete store "{selectedStore?.name}"? This
            action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteStore}
              disabled={isLoading || (selectedStore?.is_main ?? false)}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreList;
