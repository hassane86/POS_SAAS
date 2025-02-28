import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Banknote,
  Receipt,
  FileCheck,
  CheckCircle2,
  X,
} from "lucide-react";

export interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface CheckoutPanelProps {
  total?: number;
  onPaymentComplete?: (method: string, reference?: string) => void;
  onCancel?: () => void;
  isOpen?: boolean;
}

const CheckoutPanel: React.FC<CheckoutPanelProps> = ({
  total = 1250.75,
  onPaymentComplete = () => {},
  onCancel = () => {},
  isOpen = true,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("cash");
  const [reference, setReference] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const paymentMethods: PaymentMethod[] = [
    { id: "cash", name: "Cash", icon: <Banknote className="h-5 w-5" /> },
    { id: "card", name: "Card", icon: <CreditCard className="h-5 w-5" /> },
    { id: "transfer", name: "Transfer", icon: <Receipt className="h-5 w-5" /> },
    { id: "check", name: "Check", icon: <FileCheck className="h-5 w-5" /> },
  ];

  const handlePayment = () => {
    // In a real app, this would process the payment
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onPaymentComplete(selectedMethod, reference);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <Card className="w-full h-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Payment</CardTitle>
      </CardHeader>
      <CardContent>
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <p className="text-lg font-medium">Payment Successful!</p>
            <p className="text-gray-500 text-center">
              Receipt will be generated automatically
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-3xl font-bold">${total.toFixed(2)}</p>
            </div>

            <Tabs defaultValue="method" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="method">Payment Method</TabsTrigger>
                <TabsTrigger value="details">Payment Details</TabsTrigger>
              </TabsList>

              <TabsContent value="method" className="space-y-4 pt-4">
                <RadioGroup
                  value={selectedMethod}
                  onValueChange={setSelectedMethod}
                  className="space-y-2"
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer transition-colors ${selectedMethod === method.id ? "border-primary bg-primary/5" : "border-gray-200"}`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label
                        htmlFor={method.id}
                        className="flex items-center cursor-pointer"
                      >
                        <span className="mr-2">{method.icon}</span>
                        {method.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 pt-4">
                {selectedMethod === "card" && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="**** **** **** ****"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="***" />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === "transfer" && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="transferRef">Transfer Reference</Label>
                      <Input
                        id="transferRef"
                        placeholder="Enter reference number"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === "check" && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="checkNumber">Check Number</Label>
                      <Input
                        id="checkNumber"
                        placeholder="Enter check number"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === "cash" && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cashAmount">Cash Amount</Label>
                      <Input
                        id="cashAmount"
                        placeholder="Enter amount"
                        defaultValue={total.toFixed(2)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="change">Change</Label>
                      <Input id="change" placeholder="0.00" disabled />
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex space-x-3 mt-6">
              <Button variant="outline" className="w-1/2" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button className="w-1/2" onClick={handlePayment}>
                Complete Payment
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckoutPanel;
