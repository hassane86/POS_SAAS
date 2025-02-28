import React from "react";
import TransactionsTable from "./TransactionsTable";
import TransactionDetail from "./TransactionDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Filter } from "lucide-react";

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

interface TransactionHistoryProps {
  transactions?: Transaction[];
  onExportData?: (ids: string[]) => void;
  onFilterChange?: (filters: any) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
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
  onExportData = (ids) =>
    console.log(`Export data for transactions ${ids.join(", ")}`),
  onFilterChange = (filters) => console.log("Filter changed:", filters),
}) => {
  const [selectedTransactionId, setSelectedTransactionId] = React.useState<
    string | null
  >(null);

  // Find the selected transaction details
  const selectedTransaction = selectedTransactionId
    ? transactions.find((t) => t.id === selectedTransactionId)
    : null;

  // Mock transaction detail data
  const transactionDetail = selectedTransaction
    ? {
        id: selectedTransaction.id,
        date: selectedTransaction.date,
        customer: {
          name: selectedTransaction.customer,
          email: `${selectedTransaction.customer.toLowerCase().replace(" ", ".")}@example.com`,
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
        subtotal: selectedTransaction.amount * 0.92, // Approximation for demo
        tax: selectedTransaction.amount * 0.08, // Approximation for demo
        total: selectedTransaction.amount,
        payment: {
          method: selectedTransaction.paymentMethod,
          reference:
            selectedTransaction.paymentMethod === "Card"
              ? "**** **** **** 4242"
              : undefined,
          amount: selectedTransaction.amount,
          status: selectedTransaction.status as
            | "completed"
            | "pending"
            | "failed",
        },
        status: selectedTransaction.status as
          | "completed"
          | "pending"
          | "failed",
        store: selectedTransaction.store,
        cashier: "Sarah Johnson",
      }
    : null;

  const handleViewDetails = (id: string) => {
    setSelectedTransactionId(id);
  };

  const handleBackToList = () => {
    setSelectedTransactionId(null);
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      {selectedTransactionId && transactionDetail ? (
        <TransactionDetail
          transaction={transactionDetail}
          onBack={handleBackToList}
        />
      ) : (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Transaction History
              </h1>
              <p className="text-muted-foreground">
                View and manage all your sales transactions.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportData(transactions.map((t) => t.id))}
              >
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>

          <TransactionsTable
            transactions={transactions}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
