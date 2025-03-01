import React from "react";
import StoreList from "./StoreList";

const StoreManagement: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Store Management
            </h1>
            <p className="text-muted-foreground">
              Manage your stores and locations across your business.
            </p>
          </div>
        </div>

        <StoreList />
      </div>
    </div>
  );
};

export default StoreManagement;
