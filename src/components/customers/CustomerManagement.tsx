import React from "react";
import CustomerList from "./CustomerList";

const CustomerManagement: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Customer Management
            </h1>
            <p className="text-muted-foreground">
              Manage your customers and their information.
            </p>
          </div>
        </div>

        <CustomerList />
      </div>
    </div>
  );
};

export default CustomerManagement;
