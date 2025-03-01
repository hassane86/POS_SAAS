import { supabase } from "@/lib/supabase";
import { Product, Inventory, Category } from "@/types/database";

export async function getProducts(companyId: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("company_id", companyId)
    .order("name");

  if (error) throw error;
  return data as (Product & { categories: { name: string } })[];
}

export async function getProductById(productId: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", productId)
    .single();

  if (error) throw error;
  return data as Product & { categories: { name: string } };
}

export async function getProductInventory(productId: string) {
  const { data, error } = await supabase
    .from("inventory")
    .select("*, stores(name)")
    .eq("product_id", productId);

  if (error) throw error;
  return data as (Inventory & { stores: { name: string } })[];
}

export async function createProduct(product: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(
  productId: string,
  updates: Partial<Product>,
) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(productId: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw error;
  return true;
}

export async function updateInventory(inventoryId: string, quantity: number) {
  const { data, error } = await supabase
    .from("inventory")
    .update({ quantity })
    .eq("id", inventoryId)
    .select()
    .single();

  if (error) throw error;
  return data as Inventory;
}

export async function getCategories(companyId: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("company_id", companyId)
    .order("name");

  if (error) throw error;
  return data as Category[];
}

export async function createCategory(category: Partial<Category>) {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function updateCategory(
  categoryId: string,
  updates: Partial<Category>,
) {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", categoryId)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(categoryId: string) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) throw error;
  return true;
}
