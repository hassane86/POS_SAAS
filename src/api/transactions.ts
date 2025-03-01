import { supabase } from "@/lib/supabase";
import { Transaction, TransactionItem } from "@/types/database";

export async function getTransactions(companyId: string, filters = {}) {
  let query = supabase
    .from("transactions")
    .select("*, users(name), stores(name), customers(name)")
    .eq("company_id", companyId)
    .order("transaction_date", { ascending: false });

  // Apply filters if provided
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query = query.eq(key, value);
    }
  });

  const { data, error } = await query;

  if (error) throw error;
  return data as (Transaction & {
    users: { name: string };
    stores: { name: string };
    customers?: { name: string };
  })[];
}

export async function getTransactionById(transactionId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, users(name), stores(name), customers(name)")
    .eq("id", transactionId)
    .single();

  if (error) throw error;
  return data as Transaction & {
    users: { name: string };
    stores: { name: string };
    customers?: { name: string };
  };
}

export async function getTransactionItems(transactionId: string) {
  const { data, error } = await supabase
    .from("transaction_items")
    .select("*, products(name, sku)")
    .eq("transaction_id", transactionId);

  if (error) throw error;
  return data as (TransactionItem & {
    products: { name: string; sku: string };
  })[];
}

export async function createTransaction(
  transaction: Partial<Transaction>,
  items: Partial<TransactionItem>[],
) {
  // Start a transaction
  const { data: transactionData, error: transactionError } = await supabase
    .from("transactions")
    .insert(transaction)
    .select()
    .single();

  if (transactionError) throw transactionError;

  // Add transaction ID to each item
  const itemsWithTransactionId = items.map((item) => ({
    ...item,
    transaction_id: transactionData.id,
  }));

  // Insert all items
  const { data: itemsData, error: itemsError } = await supabase
    .from("transaction_items")
    .insert(itemsWithTransactionId)
    .select();

  if (itemsError) throw itemsError;

  // Update inventory for each product
  for (const item of items) {
    if (item.product_id && item.quantity) {
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory")
        .select("*")
        .eq("product_id", item.product_id)
        .eq("store_id", transaction.store_id)
        .single();

      if (!inventoryError && inventoryData) {
        const newQuantity = inventoryData.quantity - (item.quantity || 0);
        await supabase
          .from("inventory")
          .update({ quantity: newQuantity })
          .eq("id", inventoryData.id);
      }
    }
  }

  return { transaction: transactionData, items: itemsData };
}

export async function updateTransactionStatus(
  transactionId: string,
  status: string,
) {
  const { data, error } = await supabase
    .from("transactions")
    .update({ status })
    .eq("id", transactionId)
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}
