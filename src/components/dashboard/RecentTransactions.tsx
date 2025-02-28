import React from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, FileText, AlertCircle } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  customer: string;
  amount: number;
  items: number;
  status: "completed" | "pending" | "failed";
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  title?: string;
}

const RecentTransactions = ({
  transactions = [
    {
      id: "TX-1234",
      date: "2023-06-15 14:30",
      customer: "John Smith",
      amount: 156.99,
      items: 3,
      status: "completed",
    },
    {
      id: "TX-1235",
      date: "2023-06-15 15:45",
      customer: "Sarah Johnson",
      amount: 89.5,
      items: 2,
      status: "completed",
    },
    {
      id: "TX-1236",
      date: "2023-06-15 16:20",
      customer: "Michael Brown",
      amount: 210.75,
      items: 5,
      status: "pending",
    },
    {
      id: "TX-1237",
      date: "2023-06-15 17:05",
      customer: "Emily Davis",
      amount: 45.25,
      items: 1,
      status: "failed",
    },
    {
      id: "TX-1238",
      date: "2023-06-15 17:30",
      customer: "Robert Wilson",
      amount: 132.0,
      items: 4,
      status: "completed",
    },
  ],
  title = "Recent Transactions",
}: RecentTransactionsProps) => {
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
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <Table>
        <TableCaption>A list of your recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.customer}</TableCell>
              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
              <TableCell>{transaction.items}</TableCell>
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
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Print Receipt</span>
                    </DropdownMenuItem>
                    {transaction.status !== "failed" && (
                      <DropdownMenuItem className="text-red-600">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>Void Transaction</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentTransactions;
