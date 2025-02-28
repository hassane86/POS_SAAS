import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductGrid from "./ProductGrid";
import CartSidebar from "./CartSidebar";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  tags: string[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface SalesInterfaceProps {
  products?: Product[];
  categories?: string[];
  initialCartItems?: CartItem[];
}

const SalesInterface: React.FC<SalesInterfaceProps> = ({
  products = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      category: "Electronics",
      inStock: true,
      tags: ["wireless", "audio", "premium"],
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      category: "Electronics",
      inStock: true,
      tags: ["wearable", "smart", "fitness"],
    },
    {
      id: "3",
      name: "Coffee Maker",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1570286424717-86d8a0082d0b",
      category: "Home Appliances",
      inStock: true,
      tags: ["kitchen", "appliance"],
    },
    {
      id: "4",
      name: "Desk Lamp",
      price: 45.5,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
      category: "Home Decor",
      inStock: false,
      tags: ["lighting", "desk", "office"],
    },
    {
      id: "5",
      name: "Bluetooth Speaker",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
      category: "Electronics",
      inStock: true,
      tags: ["audio", "wireless", "portable"],
    },
    {
      id: "6",
      name: "Leather Wallet",
      price: 35.0,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
      category: "Accessories",
      inStock: true,
      tags: ["leather", "fashion"],
    },
  ],
  categories = [
    "All",
    "Electronics",
    "Home Appliances",
    "Home Decor",
    "Accessories",
    "Kitchen",
    "Fitness",
  ],
  initialCartItems = [],
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Add product to cart
  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      // If item already exists in cart, increase quantity
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      // Add new item to cart
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]);
    }
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  // Remove item from cart
  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Handle checkout
  const handleCheckout = (items: CartItem[], total: number) => {
    console.log("Checkout initiated with total:", total, "items:", items);
    // In a real app, this would navigate to checkout or process payment
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Product Grid - Takes 2/3 of the space on larger screens */}
        <div className="flex-1 overflow-hidden">
          <ProductGrid
            products={products}
            categories={categories}
            onAddToCart={handleAddToCart}
            onSearch={handleSearch}
            onFilter={handleCategoryFilter}
          />
        </div>

        {/* Cart Sidebar - Takes 1/3 of the space on larger screens */}
        <div className="w-full md:w-1/3 lg:w-1/3 xl:w-1/4 overflow-hidden border-l border-gray-200">
          <CartSidebar
            items={cartItems}
            onCheckout={handleCheckout}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesInterface;
