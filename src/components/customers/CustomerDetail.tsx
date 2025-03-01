import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Mail, Phone, MapPin, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomerForm from "./CustomerForm";
import {
  getCustomerById,
  updateCustomer,
  getCustomerTransactions,
} from "@/api/customers";
import { Customer, Transaction } from "@/types/database";

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadCustomerData(id);
    }
  }, [id]);

  const loadCustomerData = async (customerId: string) => {
    setIsLoading(true);
    try {
      const customerData = await getCustomerById(customerId);
      setCustomer(customerData);

      const transactionsData = await getCustomerTransactions(customerId);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error loading customer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCustomer = async (customerData: Partial<Customer>) => {
    if (!customer) return;

    setIsUpdating(true);
    try {
      const updatedCustomer = await updateCustomer(customer.id, customerData);
      setCustomer(updatedCustomer);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating customer:", error);
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

  if (!customer) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Customer Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The customer you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/customers")}>
            Back to Customers
          </Button>
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
            onClick={() => navigate("/customers")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Customer Details
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">
                {customer.name}
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
                    {customer.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Address
                  </h3>
                  {customer.address ||
                  customer.city ||
                  customer.state ||
                  customer.zip_code ? (
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <div>
                        {customer.address && <div>{customer.address}</div>}
                        {(customer.city ||
                          customer.state ||
                          customer.zip_code) && (
                          <div>
                            {customer.city && `${customer.city}, `}
                            {customer.state && `${customer.state} `}
                            {customer.zip_code && customer.zip_code}
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

              {customer.notes && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Notes
                  </h3>
                  <p className="text-sm">{customer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Customer Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Transactions
                  </div>
                  <div className="text-2xl font-bold">
                    {transactions.length}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Spent
                  </div>
                  <div className="text-2xl font-bold">
                    $
                    {transactions
                      .reduce((sum, t) => sum + t.total_amount, 0)
                      .toFixed(2)}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Customer Since
                  </div>
                  <div className="text-lg font-medium">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">
                            Transaction ID
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Date
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Amount
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Status
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="border-t hover:bg-muted/50"
                          >
                            <td className="py-3 px-4">
                              {transaction.transaction_number}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(
                                transaction.transaction_date,
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              ${transaction.total_amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="secondary"
                                className={`${transaction.status === "completed" ? "bg-green-100 text-green-800" : transaction.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                              >
                                {transaction.status.charAt(0).toUpperCase() +
                                  transaction.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigate(`/transactions/${transaction.id}`)
                                }
                              >
                                <FileText className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found for this customer.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Customer Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {customer.notes ? (
                  <div className="p-4 bg-muted/50 rounded-md">
                    <p>{customer.notes}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No notes available for this customer.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm
            customer={customer}
            onSubmit={handleUpdateCustomer}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDetail;
