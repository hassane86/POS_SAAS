import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Printer,
  Mail,
  AlertCircle,
  ArrowLeft,
  Download,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PaymentDetails {
  method: string;
  reference?: string;
  amount: number;
  status: "completed" | "pending" | "failed";
}

interface TransactionDetailProps {
  transaction?: {
    id: string;
    date: string;
    customer: {
      name: string;
      email: string;
      phone?: string;
    };
    items: LineItem[];
    subtotal: number;
    tax: number;
    total: number;
    payment: PaymentDetails;
    status: "completed" | "pending" | "failed";
    store: string;
    cashier: string;
  };
  onBack?: () => void;
  onPrint?: () => void;
  onEmail?: () => void;
  onVoid?: () => void;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({
  transaction = {
    id: "TX-1234",
    date: "2023-06-15 14:30:45",
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
    },
    items: [
      {
        id: "PROD-001",
        name: "Wireless Headphones",
        quantity: 1,
        unitPrice: 89.99,
        total: 89.99,
      },
      {
        id: "PROD-002",
        name: "Phone Charger",
        quantity: 2,
        unitPrice: 19.99,
        total: 39.98,
      },
      {
        id: "PROD-003",
        name: "Screen Protector",
        quantity: 1,
        unitPrice: 15.99,
        total: 15.99,
      },
    ],
    subtotal: 145.96,
    tax: 11.03,
    total: 156.99,
    payment: {
      method: "Card",
      reference: "**** **** **** 4242",
      amount: 156.99,
      status: "completed",
    },
    status: "completed",
    store: "Main Street Store",
    cashier: "Sarah Johnson",
  },
  onBack = () => console.log("Back clicked"),
  onPrint = () => console.log("Print clicked"),
  onEmail = () => console.log("Email clicked"),
  onVoid = () => console.log("Void clicked"),
}) => {
  const [confirmVoid, setConfirmVoid] = useState(false);

  const getStatusBadge = (status: "completed" | "pending" | "failed") => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleVoidConfirm = () => {
    onVoid();
    setConfirmVoid(false);
  };

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm border overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Transaction Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={onEmail}>
            <Mail className="h-4 w-4 mr-2" /> Email
          </Button>
          {transaction.status !== "failed" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmVoid(true)}
            >
              <AlertCircle className="h-4 w-4 mr-2" /> Void
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transaction Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ID:</span>
                <span className="text-sm font-medium">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="text-sm font-medium">{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span>{getStatusBadge(transaction.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Store:</span>
                <span className="text-sm font-medium">{transaction.store}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cashier:</span>
                <span className="text-sm font-medium">
                  {transaction.cashier}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customer Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="text-sm font-medium">
                  {transaction.customer.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm font-medium">
                  {transaction.customer.email}
                </span>
              </div>
              {transaction.customer.phone && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="text-sm font-medium">
                    {transaction.customer.phone}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Payment Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Method:</span>
                <span className="text-sm font-medium">
                  {transaction.payment.method}
                </span>
              </div>
              {transaction.payment.reference && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Reference:
                  </span>
                  <span className="text-sm font-medium">
                    {transaction.payment.reference}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="text-sm font-medium">
                  ${transaction.payment.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span>{getStatusBadge(transaction.payment.status)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList>
          <TabsTrigger value="items">Line Items</TabsTrigger>
          <TabsTrigger value="receipt">Receipt View</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-4">
          <Card className="bg-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaction.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.unitPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end p-4 space-x-8">
              <div className="text-right space-y-1">
                <div className="text-sm text-muted-foreground">
                  Subtotal: ${transaction.subtotal.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tax: ${transaction.tax.toFixed(2)}
                </div>
                <div className="text-base font-bold">
                  Total: ${transaction.total.toFixed(2)}
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="receipt" className="mt-4">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="max-w-md mx-auto border p-6 rounded-md">
                <div className="text-center mb-6">
                  <h2 className="font-bold text-xl mb-1">
                    {transaction.store}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    123 Main Street, Anytown, USA
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tel: (555) 123-4567
                  </p>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-sm mb-1">
                  <span>Receipt #:</span>
                  <span>{transaction.id}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Date:</span>
                  <span>{transaction.date}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Cashier:</span>
                  <span>{transaction.cashier}</span>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 mb-4">
                  {transaction.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantity} x ${item.unitPrice.toFixed(2)}
                        </div>
                      </div>
                      <div>${item.total.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${transaction.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${transaction.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base mt-2">
                    <span>Total:</span>
                    <span>${transaction.total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>{transaction.payment.method}</span>
                  </div>
                  {transaction.payment.reference && (
                    <div className="flex justify-between">
                      <span>Reference:</span>
                      <span>{transaction.payment.reference}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span>${transaction.payment.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm">Thank you for your purchase!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please keep this receipt for your records
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" size="sm" onClick={onPrint}>
                <Printer className="h-4 w-4 mr-2" /> Print Receipt
              </Button>
              <Button variant="outline" size="sm" onClick={onEmail}>
                <Mail className="h-4 w-4 mr-2" /> Email Receipt
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Void Confirmation Dialog */}
      <Dialog open={confirmVoid} onOpenChange={setConfirmVoid}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Void Transaction</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to void transaction {transaction.id}? This
              action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleVoidConfirm}>
              Void Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionDetail;
