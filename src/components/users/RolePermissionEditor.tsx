import React, { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { getRoles, createRole, updateRole, deleteRole } from "@/api/roles";
import { getPermissions, updateRolePermissions } from "@/api/permissions";

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
  company_id: string;
  permissions: string[];
  is_default?: boolean;
}

interface RolePermissionEditorProps {
  roles?: Role[];
  permissions?: Permission[];
  onSaveRole?: (role: Role) => void;
  onDeleteRole?: (roleId: string) => void;
  onUpdatePermissions?: (roleId: string, permissions: string[]) => void;
}

const RolePermissionEditor: React.FC<RolePermissionEditorProps> = ({
  roles: propRoles,
  permissions: propPermissions,
  onSaveRole = () => {},
  onDeleteRole = () => {},
  onUpdatePermissions = () => {},
}) => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newRole, setNewRole] = useState<boolean>(false);
  const [editedRole, setEditedRole] = useState<Role>({
    id: "",
    name: "",
    description: "",
    company_id: "",
    permissions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.company_id) {
      loadRolesAndPermissions();
    }
  }, [user]);

  const loadRolesAndPermissions = async () => {
    setIsLoading(true);
    try {
      if (!user?.company_id) return;

      // Load roles
      const rolesData = await getRoles(user.company_id);
      setRoles(rolesData);

      // Load permissions
      const permissionsData = await getPermissions();
      setPermissions(permissionsData);

      // Select the first role by default
      if (rolesData.length > 0) {
        setSelectedRoleId(rolesData[0].id);
        await loadRolePermissions(rolesData[0].id);
      }
    } catch (error) {
      console.error("Error loading roles and permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRolePermissions = async (roleId: string) => {
    try {
      const { data } = await supabase
        .from("role_permissions")
        .select("permission_id")
        .eq("role_id", roleId);

      if (data) {
        const permissionIds = data.map((item) => item.permission_id);
        setEditedRole((prev) => ({ ...prev, permissions: permissionIds }));
      } else {
        setEditedRole((prev) => ({ ...prev, permissions: [] }));
      }
    } catch (error) {
      console.error("Error loading role permissions:", error);
      setEditedRole((prev) => ({ ...prev, permissions: [] }));
    }
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    setEditMode(false);
    setNewRole(false);

    const selectedRole = roles.find((role) => role.id === roleId);
    if (selectedRole) {
      loadRolePermissions(roleId);
    }
  };

  const handleEditRole = () => {
    const selectedRole = roles.find((role) => role.id === selectedRoleId);
    if (selectedRole) {
      setEditedRole({
        id: selectedRole.id,
        name: selectedRole.name,
        description: selectedRole.description || "",
        company_id: selectedRole.company_id,
        permissions: selectedRole.permissions || [],
      });
      setEditMode(true);
      setNewRole(false);
    }
  };

  const handleNewRole = () => {
    if (!user?.company_id) return;

    setEditedRole({
      id: `role-${Date.now()}`,
      name: "",
      description: "",
      company_id: user.company_id,
      permissions: [],
    });
    setEditMode(true);
    setNewRole(true);
  };

  const handleSaveRole = async () => {
    setIsSaving(true);
    try {
      if (newRole) {
        // Create new role
        const newRoleData = await createRole({
          name: editedRole.name,
          description: editedRole.description,
          company_id: editedRole.company_id,
          is_default: false,
        });

        // Update permissions for the new role
        if (editedRole.permissions.length > 0) {
          await updateRolePermissions(newRoleData.id, editedRole.permissions);
        }

        setRoles([
          ...roles,
          { ...newRoleData, permissions: editedRole.permissions },
        ]);
        setSelectedRoleId(newRoleData.id);
      } else {
        // Update existing role
        const updatedRole = await updateRole(editedRole.id, {
          name: editedRole.name,
          description: editedRole.description,
        });

        // Update permissions
        await updateRolePermissions(editedRole.id, editedRole.permissions);

        setRoles(
          roles.map((r) =>
            r.id === updatedRole.id
              ? { ...updatedRole, permissions: editedRole.permissions }
              : r,
          ),
        );
      }

      setEditMode(false);
      setNewRole(false);
    } catch (error) {
      console.error("Error saving role:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = async () => {
    const selectedRole = roles.find((role) => role.id === selectedRoleId);
    if (!selectedRole || selectedRole.is_default) return;

    setIsSaving(true);
    try {
      await deleteRole(selectedRole.id);

      const updatedRoles = roles.filter((r) => r.id !== selectedRole.id);
      setRoles(updatedRoles);

      if (updatedRoles.length > 0) {
        setSelectedRoleId(updatedRoles[0].id);
        await loadRolePermissions(updatedRoles[0].id);
      } else {
        setSelectedRoleId("");
        setEditedRole({
          id: "",
          name: "",
          description: "",
          company_id: user?.company_id || "",
          permissions: [],
        });
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setIsSaving(false);
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

  const handleTogglePermission = async (permissionId: string) => {
    if (!selectedRoleId || editMode) return;

    const selectedRole = roles.find((role) => role.id === selectedRoleId);
    if (!selectedRole) return;

    const hasPermission = editedRole.permissions.includes(permissionId);
    const updatedPermissions = hasPermission
      ? editedRole.permissions.filter((id) => id !== permissionId)
      : [...editedRole.permissions, permissionId];

    setEditedRole({
      ...editedRole,
      permissions: updatedPermissions,
    });

    try {
      await updateRolePermissions(selectedRoleId, updatedPermissions);

      // Update the roles array with the new permissions
      setRoles(
        roles.map((r) =>
          r.id === selectedRoleId
            ? { ...r, permissions: updatedPermissions }
            : r,
        ),
      );
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
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

  const selectedRole = roles.find((role) => role.id === selectedRoleId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm border p-4">
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
                      {role.is_default && (
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
                        disabled={selectedRole.is_default}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteRole}
                        disabled={selectedRole.is_default}
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
                                  editedRole.permissions.includes("all") ||
                                  editedRole.permissions.includes(
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
                      <Button
                        onClick={handleSaveRole}
                        disabled={isSaving || !editedRole.name}
                      >
                        {isSaving ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-1" /> Save Role
                          </>
                        )}
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
