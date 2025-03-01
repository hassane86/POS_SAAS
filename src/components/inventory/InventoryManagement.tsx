import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsTable from "./ProductsTable";
import CategoryManager from "./CategoryManager";
import SupplierManager from "./SupplierManager";
import WarehouseManager from "./WarehouseManager";
import { Package, Folder, Users, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getProducts, getCategories } from "@/api/products";
import { getSuppliers } from "@/api/suppliers";
import { getStores } from "@/api/stores";

interface InventoryManagementProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({
  activeTab = "products",
  onTabChange = () => {},
}) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.company_id) {
      loadInventoryData();
    }
  }, [user]);

  const loadInventoryData = async () => {
    if (!user?.company_id) return;

    setIsLoading(true);
    try {
      // Load products with inventory data
      const productsData = await getProducts(user.company_id);
      setProducts(productsData);

      // Load categories
      const categoriesData = await getCategories(user.company_id);
      setCategories(categoriesData);

      // Load suppliers
      const suppliersData = await getSuppliers(user.company_id);
      setSuppliers(suppliersData);

      // Load stores/warehouses
      const storesData = await getStores(user.company_id);
      setStores(storesData);
    } catch (error) {
      console.error("Error loading inventory data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    onTabChange(value);
  };

  return (
    <div className="w-full h-full bg-gray-100 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Inventory Management
            </h1>
            <p className="text-muted-foreground">
              Manage your products, categories, suppliers, and warehouses.
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Suppliers</span>
            </TabsTrigger>
            <TabsTrigger value="warehouses" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Warehouses</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <div className="mt-6">
            <TabsContent value="products" className="m-0">
              <ProductsTable
                products={products}
                categories={categories}
                isLoading={isLoading}
                onProductsChange={loadInventoryData}
              />
            </TabsContent>

            <TabsContent value="categories" className="m-0">
              <CategoryManager
                categories={categories}
                isLoading={isLoading}
                onCategoriesChange={loadInventoryData}
              />
            </TabsContent>

            <TabsContent value="suppliers" className="m-0">
              <SupplierManager
                suppliers={suppliers}
                isLoading={isLoading}
                onSuppliersChange={loadInventoryData}
              />
            </TabsContent>

            <TabsContent value="warehouses" className="m-0">
              <WarehouseManager
                stores={stores}
                isLoading={isLoading}
                onStoresChange={loadInventoryData}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default InventoryManagement;
