import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Package,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StoreForm from "./StoreForm";
import { getStoreById, updateStore } from "@/api/stores";
import { Store } from "@/types/database";
import StoreInventoryManager from "@/components/inventory/StoreInventoryManager";
import StoreWarehouseAssignment from "@/components/stores/StoreWarehouseAssignment";

const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadStoreData(id);
    }
  }, [id]);

  const loadStoreData = async (storeId: string) => {
    setIsLoading(true);
    try {
      const storeData = await getStoreById(storeId);
      setStore(storeData);
    } catch (error) {
      console.error("Error loading store data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStore = async (storeData: Partial<Store>) => {
    if (!store) return;

    setIsUpdating(true);
    try {
      const updatedStore = await updateStore(store.id, storeData);
      setStore(updatedStore);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating store:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Store Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The store you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/stores")}>Back to Stores</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/stores")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Store Details</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">
                {store.name}
                {store.is_main && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                    Main Store
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    {store.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{store.email}</span>
                      </div>
                    )}
                    {store.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{store.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Address
                  </h3>
                  {store.address ||
                  store.city ||
                  store.state ||
                  store.zip_code ? (
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        {store.address && <div>{store.address}</div>}
                        {(store.city || store.state || store.zip_code) && (
                          <div>
                            {store.city && `${store.city}, `}
                            {store.state && `${store.state} `}
                            {store.zip_code && store.zip_code}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      No address provided
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Store Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="mt-1">
                    <Badge
                      variant="secondary"
                      className={`${store.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {store.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div className="text-lg font-medium">
                    {new Date(store.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Store Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <StoreInventoryManager storeId={id} />
                  <StoreWarehouseAssignment storeId={id} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Store Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Staff management coming soon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Store Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Transaction history coming soon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Store Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
          </DialogHeader>
          <StoreForm
            store={store}
            onSubmit={handleUpdateStore}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreDetail;
