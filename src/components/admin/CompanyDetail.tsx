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
  Building2,
  Users,
  Package,
  Key,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CompanyForm from "./CompanyForm";
import { getCompanyById, updateCompany } from "@/api/company";
import { getUsers } from "@/api/users";
import { supabase } from "@/lib/supabase";
import { Company, User } from "@/types/database";

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadCompanyData(id);
    }
  }, [id]);

  const loadCompanyData = async (companyId: string) => {
    setIsLoading(true);
    try {
      const companyData = await getCompanyById(companyId);
      setCompany(companyData);

      // Load company users
      const usersData = await getUsers(companyId);
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading company data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCompany = async (companyData: Partial<Company>) => {
    if (!company) return;

    setIsUpdating(true);
    try {
      const updatedCompany = await updateCompany(company.id, companyData);
      setCompany(updatedCompany);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating company:", error);
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

  if (!company) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Company Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The company you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/admin/companies")}>
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/companies")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Company Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">{company.name}</CardTitle>
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
                  {company.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{company.email}</span>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Address
                </h3>
                {company.address ? (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                    <div>{company.address}</div>
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
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Plan</div>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={`${company.subscription_tier === "premium" ? "border-purple-500 text-purple-700" : company.subscription_tier === "gold" ? "border-amber-500 text-amber-700" : ""}`}
                  >
                    {company.subscription_tier.charAt(0).toUpperCase() +
                      company.subscription_tier.slice(1)}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="mt-1">
                  <Badge
                    variant="secondary"
                    className={`${company.subscription_status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                  >
                    {company.subscription_status.charAt(0).toUpperCase() +
                      company.subscription_status.slice(1)}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="text-lg font-medium">
                  {new Date(company.created_at).toLocaleDateString()}
                </div>
              </div>
              {company.subscription_end_date && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Expires On
                    </div>
                    <div className="text-lg font-medium">
                      {new Date(
                        company.subscription_end_date,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Company Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">
                          Name
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Email
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Role
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Status
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-t hover:bg-muted/50"
                        >
                          <td className="py-3 px-4 font-medium">{user.name}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 border-blue-200"
                            >
                              {user.roles?.name || "User"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="secondary"
                              className={`${user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No users found for this company
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      if (company) {
                        const login = `admin_${company.name.toLowerCase().replace(/\s+/g, "")}_${Math.floor(Math.random() * 1000)}`;
                        const password = "admin123";
                        alert(
                          `Default admin credentials:\nLogin: ${login}\nPassword: ${password}\n\nPlease save these credentials.`,
                        );
                      }
                    }}
                  >
                    <Key className="mr-2 h-4 w-4" /> View Default Credentials
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Company Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Store information coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Company Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Product information coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          <CompanyForm
            company={company}
            onSubmit={handleUpdateCompany}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDetail;
