import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, ShoppingCart, Tag, ArrowUpDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  tags: string[];
}

interface ProductGridProps {
  products?: Product[];
  categories?: string[];
  onAddToCart?: (product: Product) => void;
  onSearch?: (query: string) => void;
  onFilter?: (category: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
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
    {
      id: "7",
      name: "Stainless Steel Water Bottle",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
      category: "Kitchen",
      inStock: true,
      tags: ["eco-friendly", "hydration"],
    },
    {
      id: "8",
      name: "Wireless Mouse",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3",
      category: "Electronics",
      inStock: true,
      tags: ["computer", "wireless", "office"],
    },
    {
      id: "9",
      name: "Ceramic Mug Set",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
      category: "Kitchen",
      inStock: true,
      tags: ["ceramic", "drinkware", "set"],
    },
    {
      id: "10",
      name: "Portable Charger",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
      category: "Electronics",
      inStock: false,
      tags: ["power", "portable", "travel"],
    },
    {
      id: "11",
      name: "Yoga Mat",
      price: 32.5,
      image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2",
      category: "Fitness",
      inStock: true,
      tags: ["exercise", "fitness", "yoga"],
    },
    {
      id: "12",
      name: "Scented Candle",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59",
      category: "Home Decor",
      inStock: true,
      tags: ["candle", "scented", "decor"],
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
  onAddToCart = (product) => console.log("Added to cart:", product),
  onSearch = (query) => console.log("Search query:", query),
  onFilter = (category) => console.log("Filter by category:", category),
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Filter products based on search, category, and in-stock status
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesStock = !showInStockOnly || product.inStock;

      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "price-low") {
        return a.price - b.price;
      } else if (sortBy === "price-high") {
        return b.price - a.price;
      }
      return 0;
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onFilter(value);
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 border-b sticky top-0 z-10">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products by name or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <div className="flex gap-2">
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center mt-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={showInStockOnly}
              onCheckedChange={(checked) =>
                setShowInStockOnly(checked === true)
              }
            />
            <label htmlFor="in-stock" className="text-sm cursor-pointer">
              Show in-stock items only
            </label>
          </div>

          <div className="ml-auto flex items-center">
            <span className="text-sm text-gray-500">
              {filteredProducts.length} products found
            </span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-auto p-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden flex flex-col h-full bg-white"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge
                        variant="destructive"
                        className="text-sm font-medium"
                      >
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      ${product.price.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-gray-100"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <Button
                    className="w-full"
                    disabled={!product.inStock}
                    onClick={() => onAddToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">
              No products found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
