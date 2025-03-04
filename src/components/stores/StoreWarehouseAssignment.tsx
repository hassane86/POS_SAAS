import React, { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Trash2,
  Building2,
  Plus,
  Link,
  Unlink,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getStores } from "@/api/stores";

interface StoreWarehouseAssignmentProps {
  storeId?: string;
}

const StoreWarehouseAssignment: React.FC<StoreWarehouseAssignmentProps> = ({
  storeId,
}) => {
  const { user } = useAuth();
  const [stores, setStores] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [assignedWarehouses, setAssignedWarehouses] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>(storeId || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.company_id) {
      loadStores();
    }
  }, [user]);

  useEffect(() => {
    if (selectedStore) {
      loadAssignedWarehouses(selectedStore);
    }
  }, [selectedStore]);

  const loadStores = async () => {
    try {
      if (!user?.company_id) return;

      const storesData = await getStores(user.company_id);

      // Separate main stores from warehouses
      const mainStores = storesData.filter((store) => store.is_main);
      const warehousesList = storesData.filter((store) => !store.is_main);

      setStores(mainStores);
      setWarehouses(warehousesList);

      if (!selectedStore && mainStores.length > 0) {
        setSelectedStore(mainStores[0].id);
      }
    } catch (error) {
      console.error("Error loading stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAssignedWarehouses = async (storeId: string) => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call to get assigned warehouses
      // For now, we'll simulate with a mock implementation
      const { data, error } = await supabase
        .from("store_warehouses")
        .select("*, warehouse:warehouse_id(id, name, address, city, state)")
        .eq("store_id", storeId);

      if (error) {
        console.error("Error fetching assigned warehouses:", error);
        setAssignedWarehouses([]);
      } else {
        setAssignedWarehouses(data || []);
      }
    } catch (error) {
      console.error("Error loading assigned warehouses:", error);
      setAssignedWarehouses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignWarehouse = async () => {
    if (!selectedStore || !selectedWarehouse) return;

    setIsSaving(true);
    try {
      // This would be replaced with an actual API call to assign a warehouse
      const { data, error } = await supabase
        .from("store_warehouses")
        .insert({
          store_id: selectedStore,
          warehouse_id: selectedWarehouse,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error("Error assigning warehouse:", error);
      } else {
        // Reload assigned warehouses
        loadAssignedWarehouses(selectedStore);
      }

      setIsAddDialogOpen(false);
      setSelectedWarehouse("");
    } catch (error) {
      console.error("Error assigning warehouse:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveWarehouse = async (assignmentId: string) => {
    if (!selectedStore || !assignmentId) return;

    try {
      // This would be replaced with an actual API call to remove a warehouse assignment
      const { error } = await supabase
        .from("store_warehouses")
        .delete()
        .eq("id", assignmentId);

      if (error) {
        console.error("Error removing warehouse assignment:", error);
      } else {
        // Reload assigned warehouses
        loadAssignedWarehouses(selectedStore);
      }
    } catch (error) {
      console.error("Error removing warehouse assignment:", error);
    }
  };

  const filteredAssignedWarehouses = assignedWarehouses.filter((assignment) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const warehouse = assignment.warehouse;

    return (
      (warehouse?.name && warehouse.name.toLowerCase().includes(searchLower)) ||
      (warehouse?.city && warehouse.city.toLowerCase().includes(searchLower)) ||
      (warehouse?.state && warehouse.state.toLowerCase().includes(searchLower))
    );
  });

  // Filter out warehouses that are already assigned
  const availableWarehouses = warehouses.filter(
    (warehouse) =>
      !assignedWarehouses.some(
        (assignment) => assignment.warehouse_id === warehouse.id,
      ),
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Warehouse Assignments
        </h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          disabled={availableWarehouses.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" /> Assign Warehouse
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search warehouses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-auto">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select store" />
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

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Warehouse</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Assignment Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAssignedWarehouses.length > 0 ? (
              filteredAssignedWarehouses.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {assignment.warehouse?.name || "Unknown Warehouse"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {assignment.warehouse?.city ||
                    assignment.warehouse?.state ? (
                      <span>
                        {[assignment.warehouse.city, assignment.warehouse.state]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(assignment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveWarehouse(assignment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Unlink className="mr-2 h-4 w-4" />
                      Unassign
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  {searchTerm
                    ? "No warehouses found matching your search."
                    : "No warehouses assigned to this store."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Assign Warehouse Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Warehouse to Store</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Store</label>
                <div className="mt-1 p-2 border rounded-md bg-gray-50">
                  {stores.find((store) => store.id === selectedStore)?.name ||
                    "Selected Store"}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Warehouse</label>
                <Select
                  value={selectedWarehouse}
                  onValueChange={setSelectedWarehouse}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWarehouses.length > 0 ? (
                      availableWarehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No available warehouses
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setSelectedWarehouse("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignWarehouse}
              disabled={isSaving || !selectedWarehouse}
            >
              {isSaving ? "Assigning..." : "Assign Warehouse"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreWarehouseAssignment;
