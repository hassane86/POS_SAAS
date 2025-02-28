import React, { useState } from "react";
import UsersTable from "./UsersTable";
import RolePermissionEditor from "./RolePermissionEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Users, Shield } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  createdAt: string;
}

interface UserManagementProps {
  users?: User[];
  roles?: Array<{
    id: string;
    name: string;
    description: string;
    permissions: string[];
    isDefault?: boolean;
  }>;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users = [
    {
      id: "USR001",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "Admin",
      status: "active",
      lastLogin: "2023-06-15 14:30",
      createdAt: "2023-01-10",
    },
    {
      id: "USR002",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      role: "Manager",
      status: "active",
      lastLogin: "2023-06-14 09:45",
      createdAt: "2023-02-15",
    },
    {
      id: "USR003",
      name: "Michael Brown",
      email: "m.brown@example.com",
      role: "Cashier",
      status: "inactive",
      lastLogin: "2023-05-20 16:20",
      createdAt: "2023-03-05",
    },
    {
      id: "USR004",
      name: "Emily Davis",
      email: "emily.d@example.com",
      role: "Inventory Manager",
      status: "active",
      lastLogin: "2023-06-15 11:15",
      createdAt: "2023-03-22",
    },
    {
      id: "USR005",
      name: "Robert Wilson",
      email: "r.wilson@example.com",
      role: "Cashier",
      status: "pending",
      lastLogin: "Never",
      createdAt: "2023-06-10",
    },
  ],
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
}) => {
  const [activeTab, setActiveTab] = useState("users");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>(users);
  const [rolesList, setRolesList] = useState(roles);

  // Form state for new/edit user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "cashier",
    status: "active" as "active" | "inactive" | "pending",
  });

  const handleAddUser = () => {
    setFormData({
      name: "",
      email: "",
      role: "cashier",
      status: "active",
    });
    setIsAddUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(),
      status: user.status,
    });
    setIsEditUserDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsersList(usersList.filter((user) => user.id !== userId));
  };

  const handleStatusChange = (userId: string, status: User["status"]) => {
    setUsersList(
      usersList.map((user) =>
        user.id === userId ? { ...user, status } : user,
      ),
    );
  };

  const handleSaveUser = () => {
    if (isAddUserDialogOpen) {
      // Add new user
      const newUser: User = {
        id: `USR${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        name: formData.name,
        email: formData.email,
        role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1),
        status: formData.status,
        lastLogin: "Never",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsersList([...usersList, newUser]);
      setIsAddUserDialogOpen(false);
    } else if (isEditUserDialogOpen && selectedUser) {
      // Update existing user
      setUsersList(
        usersList.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                name: formData.name,
                email: formData.email,
                role:
                  formData.role.charAt(0).toUpperCase() +
                  formData.role.slice(1),
                status: formData.status,
              }
            : user,
        ),
      );
      setIsEditUserDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleSaveRole = (role: any) => {
    const updatedRoles = rolesList.find((r) => r.id === role.id)
      ? rolesList.map((r) => (r.id === role.id ? role : r))
      : [...rolesList, role];
    setRolesList(updatedRoles);
  };

  const handleDeleteRole = (roleId: string) => {
    setRolesList(rolesList.filter((role) => role.id !== roleId));
  };

  const handleUpdatePermissions = (roleId: string, permissions: string[]) => {
    setRolesList(
      rolesList.map((role) =>
        role.id === roleId ? { ...role, permissions } : role,
      ),
    );
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage users and their permissions in your system.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Roles & Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UsersTable
              users={usersList}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onStatusChange={handleStatusChange}
              onAddUser={handleAddUser}
            />
          </TabsContent>

          <TabsContent value="roles">
            <RolePermissionEditor
              roles={rolesList}
              onSaveRole={handleSaveRole}
              onDeleteRole={handleDeleteRole}
              onUpdatePermissions={handleUpdatePermissions}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesList.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive" | "pending") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesList.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive" | "pending") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
