import { supabase } from "@/lib/supabase";
import { Supplier, ProductSupplier } from "@/types/database";

export async function getSuppliers(companyId: string) {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("company_id", companyId)
    .order("name");

  if (error) throw error;
  return data as Supplier[];
}

export async function getSupplierById(supplierId: string) {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", supplierId)
    .single();

  if (error) throw error;
  return data as Supplier;
}

export async function createSupplier(supplier: Partial<Supplier>) {
  const { data, error } = await supabase
    .from("suppliers")
    .insert(supplier)
    .select()
    .single();

  if (error) throw error;
  return data as Supplier;
}

export async function updateSupplier(
  supplierId: string,
  updates: Partial<Supplier>,
) {
  const { data, error } = await supabase
    .from("suppliers")
    .update(updates)
    .eq("id", supplierId)
    .select()
    .single();

  if (error) throw error;
  return data as Supplier;
}

export async function deleteSupplier(supplierId: string) {
  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("id", supplierId);

  if (error) throw error;
  return true;
}

export async function getProductSuppliers(productId: string) {
  const { data, error } = await supabase
    .from("product_suppliers")
    .select("*, suppliers(name)")
    .eq("product_id", productId);

  if (error) throw error;
  return data as (ProductSupplier & { suppliers: { name: string } })[];
}

export async function addProductSupplier(
  productSupplier: Partial<ProductSupplier>,
) {
  const { data, error } = await supabase
    .from("product_suppliers")
    .insert(productSupplier)
    .select()
    .single();

  if (error) throw error;
  return data as ProductSupplier;
}

export async function updateProductSupplier(
  id: string,
  updates: Partial<ProductSupplier>,
) {
  const { data, error } = await supabase
    .from("product_suppliers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ProductSupplier;
}

export async function removeProductSupplier(id: string) {
  const { error } = await supabase
    .from("product_suppliers")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
