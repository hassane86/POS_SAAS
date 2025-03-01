import { supabase } from "@/lib/supabase";
import { Store, StockTransfer, StockTransferItem } from "@/types/database";

export async function getStores(companyId: string) {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("company_id", companyId)
    .order("name");

  if (error) throw error;
  return data as Store[];
}

export async function getStoreById(storeId: string) {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("id", storeId)
    .single();

  if (error) throw error;
  return data as Store;
}

export async function createStore(store: Partial<Store>) {
  const { data, error } = await supabase
    .from("stores")
    .insert(store)
    .select()
    .single();

  if (error) throw error;
  return data as Store;
}

export async function updateStore(storeId: string, updates: Partial<Store>) {
  const { data, error } = await supabase
    .from("stores")
    .update(updates)
    .eq("id", storeId)
    .select()
    .single();

  if (error) throw error;
  return data as Store;
}

export async function deleteStore(storeId: string) {
  const { error } = await supabase.from("stores").delete().eq("id", storeId);

  if (error) throw error;
  return true;
}

export async function getStockTransfers(companyId: string) {
  const { data, error } = await supabase
    .from("stock_transfers")
    .select(
      "*, source:source_store_id(name), destination:destination_store_id(name), users(name)",
    )
    .eq("company_id", companyId)
    .order("transfer_date", { ascending: false });

  if (error) throw error;
  return data as (StockTransfer & {
    source: { name: string };
    destination: { name: string };
    users: { name: string };
  })[];
}

export async function getStockTransferById(transferId: string) {
  const { data, error } = await supabase
    .from("stock_transfers")
    .select(
      "*, source:source_store_id(name), destination:destination_store_id(name), users(name)",
    )
    .eq("id", transferId)
    .single();

  if (error) throw error;
  return data as StockTransfer & {
    source: { name: string };
    destination: { name: string };
    users: { name: string };
  };
}

export async function getStockTransferItems(transferId: string) {
  const { data, error } = await supabase
    .from("stock_transfer_items")
    .select("*, products(name, sku)")
    .eq("transfer_id", transferId);

  if (error) throw error;
  return data as (StockTransferItem & {
    products: { name: string; sku: string };
  })[];
}

export async function createStockTransfer(
  transfer: Partial<StockTransfer>,
  items: Partial<StockTransferItem>[],
) {
  // Start a transaction
  const { data: transferData, error: transferError } = await supabase
    .from("stock_transfers")
    .insert(transfer)
    .select()
    .single();

  if (transferError) throw transferError;

  // Add transfer ID to each item
  const itemsWithTransferId = items.map((item) => ({
    ...item,
    transfer_id: transferData.id,
  }));

  // Insert all items
  const { data: itemsData, error: itemsError } = await supabase
    .from("stock_transfer_items")
    .insert(itemsWithTransferId)
    .select();

  if (itemsError) throw itemsError;

  return { transfer: transferData, items: itemsData };
}

export async function completeStockTransfer(transferId: string) {
  // Get the transfer details
  const { data: transfer, error: transferError } = await supabase
    .from("stock_transfers")
    .select("*")
    .eq("id", transferId)
    .single();

  if (transferError) throw transferError;

  // Get the transfer items
  const { data: items, error: itemsError } = await supabase
    .from("stock_transfer_items")
    .select("*")
    .eq("transfer_id", transferId);

  if (itemsError) throw itemsError;

  // Update inventory for each product
  for (const item of items) {
    // Decrease inventory in source store
    const { data: sourceInventory, error: sourceError } = await supabase
      .from("inventory")
      .select("*")
      .eq("product_id", item.product_id)
      .eq("store_id", transfer.source_store_id)
      .single();

    if (!sourceError && sourceInventory) {
      const newSourceQuantity = sourceInventory.quantity - item.quantity;
      await supabase
        .from("inventory")
        .update({ quantity: newSourceQuantity })
        .eq("id", sourceInventory.id);
    }

    // Increase inventory in destination store
    const { data: destInventory, error: destError } = await supabase
      .from("inventory")
      .select("*")
      .eq("product_id", item.product_id)
      .eq("store_id", transfer.destination_store_id)
      .single();

    if (!destError && destInventory) {
      const newDestQuantity = destInventory.quantity + item.quantity;
      await supabase
        .from("inventory")
        .update({ quantity: newDestQuantity })
        .eq("id", destInventory.id);
    } else {
      // Create inventory record if it doesn't exist
      await supabase.from("inventory").insert({
        product_id: item.product_id,
        store_id: transfer.destination_store_id,
        quantity: item.quantity,
      });
    }
  }

  // Update transfer status
  const { data, error } = await supabase
    .from("stock_transfers")
    .update({ status: "completed" })
    .eq("id", transferId)
    .select()
    .single();

  if (error) throw error;
  return data as StockTransfer;
}
