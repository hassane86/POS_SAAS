import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  FileText,
  Download,
  Trash2,
  Calendar,
} from "lucide-react";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";

interface Transaction {
  id: string;
  date: string;
  customer: string;
  amount: number;
  paymentMethod: string;
  items: number;
  status: "completed" | "pending" | "failed" | "refunded";
  store: string;
}

interface TransactionsTableProps {
  transactions?: Transaction[];
  title?: string;
  onViewDetails?: (id: string) => void;
  onPrintReceipt?: (id: string) => void;
  onExportData?: (ids: string[]) => void;
  onDeleteTransaction?: (id: string) => void;
}

const TransactionsTable = ({
  transactions = [
    {
      id: "TX-1234",
      date: "2023-06-15 14:30",
      customer: "John Smith",
      amount: 156.99,
      paymentMethod: "Card",
      items: 3,
      status: "completed",
      store: "Main Store",
    },
    {
      id: "TX-1235",
      date: "2023-06-15 15:45",
      customer: "Sarah Johnson",
      amount: 89.5,
      paymentMethod: "Cash",
      items: 2,
      status: "completed",
      store: "Main Store",
    },
    {
      id: "TX-1236",
      date: "2023-06-15 16:20",
      customer: "Michael Brown",
      amount: 210.75,
      paymentMethod: "Transfer",
      items: 5,
      status: "pending",
      store: "Downtown Branch",
    },
    {
      id: "TX-1237",
      date: "2023-06-15 17:05",
      customer: "Emily Davis",
      amount: 45.25,
      paymentMethod: "Card",
      items: 1,
      status: "failed",
      store: "Main Store",
    },
    {
      id: "TX-1238",
      date: "2023-06-15 17:30",
      customer: "Robert Wilson",
      amount: 132.0,
      paymentMethod: "Cash",
      items: 4,
      status: "completed",
      store: "Downtown Branch",
    },
    {
      id: "TX-1239",
      date: "2023-06-16 09:15",
      customer: "Jennifer Lee",
      amount: 78.5,
      paymentMethod: "Card",
      items: 2,
      status: "completed",
      store: "Main Store",
    },
    {
      id: "TX-1240",
      date: "2023-06-16 10:30",
      customer: "David Miller",
      amount: 245.0,
      paymentMethod: "Transfer",
      items: 6,
      status: "completed",
      store: "Downtown Branch",
    },
    {
      id: "TX-1241",
      date: "2023-06-16 11:45",
      customer: "Lisa Anderson",
      amount: 67.25,
      paymentMethod: "Cash",
      items: 3,
      status: "refunded",
      store: "Main Store",
    },
  ],
  title = "Transaction History",
  onViewDetails = (id) => console.log(`View details for transaction ${id}`),
  onPrintReceipt = (id) => console.log(`Print receipt for transaction ${id}`),
  onExportData = (ids) =>
    console.log(`Export data for transactions ${ids.join(", ")}`),
  onDeleteTransaction = (id) => console.log(`Delete transaction ${id}`),
}: TransactionsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");

  // Derive unique stores and payment methods from transactions
  const stores = [...new Set(transactions.map((t) => t.store))];
  const paymentMethods = [...new Set(transactions.map((t) => t.paymentMethod))];

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Failed
          </Badge>
        );
      case "refunded":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Refunded
          </Badge>
        );
      default:
        return null;
    }
  };

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    const matchesStore =
      storeFilter === "all" || transaction.store === storeFilter;
    const matchesPaymentMethod =
      paymentMethodFilter === "all" ||
      transaction.paymentMethod === paymentMethodFilter;

    return (
      matchesSearch && matchesStatus && matchesStore && matchesPaymentMethod
    );
  });

  return (
    <Card className="w-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExportData(filteredTransactions.map((t) => t.id))}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0 mb-6">
          <div className="flex-1 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <div className="w-full md:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-40">
              <Select value={storeFilter} onValueChange={setStoreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store} value={store}>
                      {store}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-40">
              <Select
                value={paymentMethodFilter}
                onValueChange={setPaymentMethodFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-auto">
              <DatePickerWithRange className="w-full" />
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.id}
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell>{transaction.items}</TableCell>
                    <TableCell>{transaction.store}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onViewDetails(transaction.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onPrintReceipt(transaction.id)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Print Receipt</span>
                          </DropdownMenuItem>
                          {transaction.status !== "failed" && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                onDeleteTransaction(transaction.id)
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete Transaction</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
