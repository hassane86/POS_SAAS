import React from "react";
import InventoryOperations from "./InventoryOperations";

const InventoryOperationsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Operations</h1>
      <p className="text-gray-600 mb-6">
        Manage your inventory with stock in, stock out, and transfer operations.
      </p>
      <InventoryOperations />
    </div>
  );
};

export default InventoryOperationsPage;
