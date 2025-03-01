import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company } from "@/types/database";

interface CompanyFormProps {
  company?: Partial<Company>;
  onSubmit: (data: Partial<Company>) => Promise<Company | null>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  company = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Company>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo_url: "",
    subscription_tier: "free",
    subscription_status: "active",
    ...company,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await onSubmit(formData);

    // If this is a new company, create an admin user for it
    if (!company.id && result?.id) {
      try {
        // Get the Admin role ID
        const { data: roleData } = await supabase
          .from("roles")
          .select("id")
          .eq("name", "Admin")
          .single();

        if (roleData) {
          // Generate login and password
          const email =
            formData.email ||
            `admin@${formData.name.toLowerCase().replace(/\s+/g, "")}.com`;
          const login = `admin_${formData.name.toLowerCase().replace(/\s+/g, "")}_${Math.floor(Math.random() * 1000)}`;
          const password = "admin123"; // Default password

          // Store credentials to display to the user
          const credentials = { login, password };
          console.log("New company admin credentials:", credentials);

          // Create admin user for the company
          await supabase.from("users").insert({
            name: "Company Admin",
            email: email,
            login: login,
            password: password,
            role_id: roleData.id,
            status: "active",
            company_id: result.id,
          });

          // Show credentials to admin
          alert(
            `Company created successfully!\n\nAdmin user credentials:\nLogin: ${credentials.login}\nPassword: ${credentials.password}\n\nPlease save these credentials.`,
          );
        }
      } catch (error) {
        console.error("Error creating admin user for company:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Company Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo_url">Logo URL</Label>
        <Input
          id="logo_url"
          name="logo_url"
          value={formData.logo_url || ""}
          onChange={handleChange}
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subscription_tier">Subscription Tier</Label>
          <Select
            value={formData.subscription_tier || "free"}
            onValueChange={(value) =>
              handleSelectChange("subscription_tier", value)
            }
          >
            <SelectTrigger id="subscription_tier">
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subscription_status">Subscription Status</Label>
          <Select
            value={formData.subscription_status || "active"}
            onValueChange={(value) =>
              handleSelectChange("subscription_status", value)
            }
          >
            <SelectTrigger id="subscription_status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {company.id ? "Updating..." : "Creating..."}
            </>
          ) : company.id ? (
            "Update Company"
          ) : (
            "Create Company"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
