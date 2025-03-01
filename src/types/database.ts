export interface Company {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  subscription_tier: string;
  subscription_status: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  company_id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  is_main: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  parent_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category_id?: string;
  price: number;
  cost?: number;
  tax_rate?: number;
  image_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  product_id: string;
  store_id: string;
  quantity: number;
  low_stock_threshold?: number;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  company_id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProductSupplier {
  id: string;
  product_id: string;
  supplier_id: string;
  supplier_sku?: string;
  cost?: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  permissions: string[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  auth_id?: string;
  company_id: string;
  role_id?: string;
  name: string;
  email: string;
  login?: string;
  password?: string;
  avatar_url?: string;
  status: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStore {
  id: string;
  user_id: string;
  store_id: string;
  is_primary: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  company_id: string;
  store_id: string;
  user_id: string;
  customer_id?: string;
  transaction_number: string;
  transaction_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  payment_reference?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount: number;
  created_at: string;
}

export interface StockTransfer {
  id: string;
  company_id: string;
  source_store_id: string;
  destination_store_id: string;
  user_id: string;
  transfer_date: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StockTransferItem {
  id: string;
  transfer_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}
