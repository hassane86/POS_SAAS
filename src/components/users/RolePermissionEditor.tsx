import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Users,
  Eye,
  EyeOff,
  Edit,
  Trash,
  Plus,
  Save,
  X,
} from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault?: boolean;
}

interface RolePermissionEditorProps {
  roles?: Role[];
  permissions?: Permission[];
  onSaveRole?: (role: Role) => void;
  onDeleteRole?: (roleId: string) => void;
  onUpdatePermissions?: (roleId: string, permissions: string[]) => void;
}

const RolePermissionEditor: React.FC<RolePermissionEditorProps> = ({
  roles = [
    {
      id: "admin",
      name: "Administrator",
      description: "Full access to all system features",
      permissions: ["all"],
      isDefault: true,
    },
    {
      id: "manager",
      name: "Store Manager",
      description: "Can manage store operations and staff",
      permissions: [
        "sales.view",
        "sales.create",
        "inventory.view",
        "inventory.manage",
        "users.view",
      ],
    },
    {
      id: "cashier",
      name: "Cashier",
      description: "Can process sales and view products",
      permissions: ["sales.view", "sales.create", "inventory.view"],
    },
  ],
  permissions = [
    {
      id: "all",
      name: "All Permissions",
      description: "Full system access",
      module: "system",
    },
    {
      id: "sales.view",
      name: "View Sales",
      description: "Can view sales data",
      module: "sales",
    },
    {
      id: "sales.create",
      name: "Create Sales",
      description: "Can create new sales",
      module: "sales",
    },
    {
      id: "sales.void",
      name: "Void Sales",
      description: "Can void/cancel sales",
      module: "sales",
    },
    {
      id: "inventory.view",
      name: "View Inventory",
      description: "Can view products and stock",
      module: "inventory",
    },
    {
      id: "inventory.manage",
      name: "Manage Inventory",
      description: "Can add/edit products and stock",
      module: "inventory",
    },
    {
      id: "users.view",
      name: "View Users",
      description: "Can view user accounts",
      module: "users",
    },
    {
      id: "users.manage",
      name: "Manage Users",
      description: "Can add/edit user accounts",
      module: "users",
    },
    {
      id: "reports.view",
      name: "View Reports",
      description: "Can view system reports",
      module: "reports",
    },
    {
      id: "settings.view",
      name: "View Settings",
      description: "Can view system settings",
      module: "settings",
    },
    {
      id: "settings.manage",
      name: "Manage Settings",
      description: "Can modify system settings",
      module: "settings",
    },
  ],
  onSaveRole = () => {},
  onDeleteRole = () => {},
  onUpdatePermissions = () => {},
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    roles[0]?.id || "",
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newRole, setNewRole] = useState<boolean>(false);
  const [editedRole, setEditedRole] = useState<Role>({
    id: "",
    name: "",
    description: "",
    permissions: [],
  });

  const selectedRole = roles.find((role) => role.id === selectedRoleId);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    setEditMode(false);
    setNewRole(false);
  };

  const handleEditRole = () => {
    if (selectedRole) {
      setEditedRole({ ...selectedRole });
      setEditMode(true);
      setNewRole(false);
    }
  };

  const handleNewRole = () => {
    setEditedRole({
      id: `role-${Date.now()}`,
      name: "",
      description: "",
      permissions: [],
    });
    setEditMode(true);
    setNewRole(true);
  };

  const handleSaveRole = () => {
    onSaveRole(editedRole);
    setEditMode(false);
    if (newRole) {
      setSelectedRoleId(editedRole.id);
      setNewRole(false);
    }
  };

  const handleDeleteRole = () => {
    if (selectedRole && !selectedRole.isDefault) {
      onDeleteRole(selectedRole.id);
      setSelectedRoleId(roles[0]?.id || "");
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (permissionId === "all" && checked) {
      // If "All Permissions" is checked, include all permission IDs
      setEditedRole({
        ...editedRole,
        permissions: permissions.map((p) => p.id),
      });
    } else if (permissionId === "all" && !checked) {
      // If "All Permissions" is unchecked, remove all permissions
      setEditedRole({
        ...editedRole,
        permissions: [],
      });
    } else {
      // For individual permissions
      const updatedPermissions = checked
        ? [...editedRole.permissions, permissionId]
        : editedRole.permissions.filter((id) => id !== permissionId);

      // Check if all permissions are selected to also select "all"
      const allPermissionsSelected = permissions.every(
        (p) => p.id === "all" || updatedPermissions.includes(p.id),
      );

      setEditedRole({
        ...editedRole,
        permissions: allPermissionsSelected
          ? [
              "all",
              ...permissions.filter((p) => p.id !== "all").map((p) => p.id),
            ]
          : updatedPermissions.filter((id) => id !== "all"),
      });
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    if (!selectedRole || editMode) return;

    const hasPermission = selectedRole.permissions.includes(permissionId);
    const updatedPermissions = hasPermission
      ? selectedRole.permissions.filter((id) => id !== permissionId)
      : [...selectedRole.permissions, permissionId];

    onUpdatePermissions(selectedRole.id, updatedPermissions);
  };

  // Group permissions by module
  const permissionsByModule = permissions.reduce<Record<string, Permission[]>>(
    (acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    },
    {},
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="p-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Roles List */}
            <div className="w-full md:w-1/3 border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Available Roles</h3>
                <Button size="sm" onClick={handleNewRole}>
                  <Plus className="h-4 w-4 mr-1" /> New Role
                </Button>
              </div>

              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${selectedRoleId === role.id ? "bg-primary/10 border border-primary/30" : "bg-gray-50 hover:bg-gray-100 border border-transparent"}`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{role.name}</div>
                      {role.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {role.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Details */}
            <div className="w-full md:w-2/3 border rounded-md p-4">
              {selectedRole && !editMode ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-primary" />
                        {selectedRole.name}
                      </h2>
                      <p className="text-gray-500">
                        {selectedRole.description}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditRole}
                        disabled={selectedRole.isDefault}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteRole}
                        disabled={selectedRole.isDefault}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-md font-semibold mb-3">
                      Assigned Permissions
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(permissionsByModule).map(
                        ([module, modulePermissions]) => (
                          <div key={module} className="border rounded-md p-3">
                            <h4 className="font-medium capitalize mb-2">
                              {module}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {modulePermissions.map((permission) => {
                                const isGranted =
                                  selectedRole.permissions.includes("all") ||
                                  selectedRole.permissions.includes(
                                    permission.id,
                                  );
                                return (
                                  <div
                                    key={permission.id}
                                    className={`flex items-center justify-between p-2 rounded ${isGranted ? "bg-green-50" : "bg-gray-50"}`}
                                    onClick={() =>
                                      handleTogglePermission(permission.id)
                                    }
                                  >
                                    <div>
                                      <div className="font-medium">
                                        {permission.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {permission.description}
                                      </div>
                                    </div>
                                    <Switch checked={isGranted} />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : editMode ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                      {newRole ? "Create New Role" : "Edit Role"}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditMode(false)}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="roleName">Role Name</Label>
                      <Input
                        id="roleName"
                        value={editedRole.name}
                        onChange={(e) =>
                          setEditedRole({ ...editedRole, name: e.target.value })
                        }
                        placeholder="Enter role name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="roleDescription">Description</Label>
                      <Input
                        id="roleDescription"
                        value={editedRole.description}
                        onChange={(e) =>
                          setEditedRole({
                            ...editedRole,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter role description"
                      />
                    </div>

                    <div className="mt-6">
                      <h3 className="text-md font-semibold mb-3">
                        Assign Permissions
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(permissionsByModule).map(
                          ([module, modulePermissions]) => (
                            <div key={module} className="border rounded-md p-3">
                              <h4 className="font-medium capitalize mb-2">
                                {module}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {modulePermissions.map((permission) => {
                                  const isChecked =
                                    editedRole.permissions.includes("all") ||
                                    editedRole.permissions.includes(
                                      permission.id,
                                    );
                                  return (
                                    <div
                                      key={permission.id}
                                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                                    >
                                      <Checkbox
                                        id={permission.id}
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                          handlePermissionChange(
                                            permission.id,
                                            checked === true,
                                          )
                                        }
                                      />
                                      <div className="grid gap-1.5">
                                        <Label
                                          htmlFor={permission.id}
                                          className="font-medium cursor-pointer"
                                        >
                                          {permission.name}
                                        </Label>
                                        <p className="text-xs text-gray-500">
                                          {permission.description}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button onClick={handleSaveRole}>
                        <Save className="h-4 w-4 mr-1" /> Save Role
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Select a role to view or edit its permissions
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>System Permissions</CardTitle>
              <CardDescription>
                Overview of all available permissions in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(permissionsByModule).map(
                  ([module, modulePermissions]) => (
                    <div key={module} className="border rounded-md p-4">
                      <h3 className="text-lg font-semibold capitalize mb-3">
                        {module}
                      </h3>
                      <div className="grid gap-3">
                        {modulePermissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                          >
                            <div>
                              <div className="font-medium">
                                {permission.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {permission.description}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Permission ID: {permission.id}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {module}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RolePermissionEditor;
