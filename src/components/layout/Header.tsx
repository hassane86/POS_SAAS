import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Settings,
  LogOut,
  User,
  Store,
  ChevronDown,
  Search,
  HelpCircle,
  Menu,
} from "lucide-react";

interface Store {
  id: string;
  name: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  time: string;
}

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  stores?: Store[];
  currentStore?: string;
  onStoreChange?: (storeId: string) => void;
  notifications?: Notification[];
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userName = "John Doe",
  userAvatar = "",
  stores = [
    { id: "store1", name: "Main Store" },
    { id: "store2", name: "Downtown Branch" },
    { id: "store3", name: "Mall Kiosk" },
  ],
  currentStore = "store1",
  onStoreChange = () => {},
  notifications = [
    {
      id: "n1",
      title: "Low Stock Alert",
      description: "5 products are running low on stock",
      read: false,
      time: "5 min ago",
    },
    {
      id: "n2",
      title: "New Order",
      description: "Order #1234 has been placed",
      read: false,
      time: "10 min ago",
    },
    {
      id: "n3",
      title: "Payment Received",
      description: "Payment for order #1230 received",
      read: true,
      time: "1 hour ago",
    },
  ],
  onMenuToggle = () => {},
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(
    notifications.filter((n) => !n.read).length,
  );

  const currentStoreName =
    stores.find((store) => store.id === currentStore)?.name || "Select Store";

  const handleNotificationClick = (id: string) => {
    // Mark notification as read logic would go here
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <header className="w-full h-18 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-2">
          <Store className="h-5 w-5 text-primary" />
          <Select defaultValue={currentStore} onValueChange={onStoreChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select store">
                {currentStoreName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h3 className="font-medium">Notifications</h3>
              <Button variant="ghost" size="sm" className="text-xs">
                Mark all as read
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {notification.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 pl-2 pr-1"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:inline-block">
                {userName}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
