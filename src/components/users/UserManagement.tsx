import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersTable from "./UsersTable";
import RolePermissionEditor from "./RolePermissionEditor";
import { Users, Shield } from "lucide-react";

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage users, roles, and permissions for your organization.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Roles & Permissions</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="users" className="m-0">
              <UsersTable />
            </TabsContent>

            <TabsContent value="roles" className="m-0">
              <RolePermissionEditor />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UserManagement;
