import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { getCompanyByUserId, updateCompany } from "@/api/company";
import { Company } from "@/types/database";

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
  });
  const [posSettings, setPosSettings] = useState({
    enableCreditSales: false,
    defaultTaxRate: "0",
    currencySymbol: "$",
    receiptFooter: "",
    lowStockThreshold: "5",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlerts: true,
    newOrderNotifications: true,
    dailySummary: false,
    emailNotifications: true,
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const companyData = await getCompanyByUserId(user.id);
          setCompany(companyData);

          // Initialize form with company data
          setGeneralSettings({
            companyName: companyData.name || "",
            email: companyData.email || "",
            phone: companyData.phone || "",
            address: companyData.address || "",
            logo: companyData.logo_url || "",
          });
        } catch (error) {
          console.error("Error fetching company data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCompanyData();
  }, [user]);

  const handleGeneralSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setGeneralSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handlePosSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPosSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (
    name: string,
    checked: boolean,
    settingsType: string,
  ) => {
    if (settingsType === "pos") {
      setPosSettings((prev) => ({ ...prev, [name]: checked }));
    } else if (settingsType === "notification") {
      setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
    }
  };

  const handleSaveGeneralSettings = async () => {
    if (!company) return;

    setIsSaving(true);
    try {
      const updatedCompany = await updateCompany(company.id, {
        name: generalSettings.companyName,
        email: generalSettings.email,
        phone: generalSettings.phone,
        address: generalSettings.address,
        logo_url: generalSettings.logo,
      });
      setCompany(updatedCompany);
      alert("General settings saved successfully!");
    } catch (error) {
      console.error("Error saving general settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePosSettings = () => {
    // In a real app, this would save to the database
    alert("POS settings saved successfully!");
  };

  const handleSaveNotificationSettings = () => {
    // In a real app, this would save to the database
    alert("Notification settings saved successfully!");
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="pos">POS Settings</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={generalSettings.companyName}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={generalSettings.email}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={generalSettings.phone}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={generalSettings.address}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={generalSettings.logo}
                    onChange={handleGeneralSettingsChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveGeneralSettings}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pos" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>POS Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableCreditSales">
                      Enable Credit Sales
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to purchase on credit
                    </p>
                  </div>
                  <Switch
                    id="enableCreditSales"
                    checked={posSettings.enableCreditSales}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("enableCreditSales", checked, "pos")
                    }
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                    <Input
                      id="defaultTaxRate"
                      name="defaultTaxRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={posSettings.defaultTaxRate}
                      onChange={handlePosSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currencySymbol">Currency Symbol</Label>
                    <Input
                      id="currencySymbol"
                      name="currencySymbol"
                      value={posSettings.currencySymbol}
                      onChange={handlePosSettingsChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiptFooter">Receipt Footer Text</Label>
                  <Input
                    id="receiptFooter"
                    name="receiptFooter"
                    value={posSettings.receiptFooter}
                    onChange={handlePosSettingsChange}
                    placeholder="Thank you for your business!"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    name="lowStockThreshold"
                    type="number"
                    min="0"
                    value={posSettings.lowStockThreshold}
                    onChange={handlePosSettingsChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Products with stock below this number will trigger low stock
                    alerts
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSavePosSettings}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when products are running low
                    </p>
                  </div>
                  <Switch
                    id="lowStockAlerts"
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) =>
                      handleSwitchChange(
                        "lowStockAlerts",
                        checked,
                        "notification",
                      )
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newOrderNotifications">
                      New Order Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new orders
                    </p>
                  </div>
                  <Switch
                    id="newOrderNotifications"
                    checked={notificationSettings.newOrderNotifications}
                    onCheckedChange={(checked) =>
                      handleSwitchChange(
                        "newOrderNotifications",
                        checked,
                        "notification",
                      )
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dailySummary">Daily Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of sales and inventory
                    </p>
                  </div>
                  <Switch
                    id="dailySummary"
                    checked={notificationSettings.dailySummary}
                    onCheckedChange={(checked) =>
                      handleSwitchChange(
                        "dailySummary",
                        checked,
                        "notification",
                      )
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSwitchChange(
                        "emailNotifications",
                        checked,
                        "notification",
                      )
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotificationSettings}>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
