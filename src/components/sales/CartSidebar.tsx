import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import CheckoutPanel from "./CheckoutPanel";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartSidebarProps {
  items?: CartItem[];
  onCheckout?: (items: CartItem[], total: number) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
  isOpen?: boolean;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  items = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 129.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 249.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    },
    {
      id: "3",
      name: "Bluetooth Speaker",
      price: 79.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
    },
  ],
  onCheckout = () => {},
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  isOpen = true,
}) => {
  const [showCheckout, setShowCheckout] = useState<boolean>(false);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  // Count total items
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      onUpdateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
    onCheckout(items, total);
  };

  const handlePaymentComplete = () => {
    setShowCheckout(false);
    // In a real app, this would clear the cart or redirect to receipt
  };

  if (!isOpen) return null;

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-gray-200 shadow-lg">
      {showCheckout ? (
        <CheckoutPanel
          total={total}
          onPaymentComplete={handlePaymentComplete}
          onCancel={() => setShowCheckout(false)}
        />
      ) : (
        <>
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">Shopping Cart</CardTitle>
              <Badge variant="secondary" className="px-3 py-1">
                <ShoppingCart className="h-4 w-4 mr-1" />
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Badge>
            </div>
          </CardHeader>

          <div className="flex-1 overflow-hidden">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Add items from the product grid to get started
                </p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 py-3"
                    >
                      {item.image && (
                        <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
