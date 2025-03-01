import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, HelpCircle, Menu, User } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  stores?: Array<{ id: string; name: string }>;
  currentStore?: string;
  onStoreChange?: (storeId: string) => void;
  notifications?: Array<{
    id: string;
    title: string;
    description: string;
    read: boolean;
    time: string;
  }>;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userName = "User",
  userAvatar = "",
  stores = [],
  currentStore = "",
  onStoreChange = () => {},
  notifications = [],
  onMenuToggle = () => {},
}) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(
    notifications.filter((n) => !n.read).length,
  );

  const handleNotificationClick = (id: string) => {
    // Mark notification as read
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const currentStoreName =
    stores.find((store) => store.id === currentStore)?.name || "Select Store";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="hidden md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-between">
                {currentStoreName}
                <span className="sr-only">Select store</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px]">
              <DropdownMenuLabel>Switch Store</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {stores.map((store) => (
                <DropdownMenuItem
                  key={store.id}
                  onClick={() => onStoreChange(store.id)}
                >
                  {store.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {user?.role === "admin" &&
          user?.company_id === "00000000-0000-0000-0000-000000000000" && (
            <Button variant="outline" onClick={() => navigate("/admin")}>
              Admin Panel
            </Button>
          )}

        {user && (
          <div className="bg-gray-100 px-3 py-1 rounded-md text-sm flex items-center">
            <span className="font-medium mr-1">Company:</span>{" "}
            {user.company_name || "Loading..."}
          </div>
        )}

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
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
