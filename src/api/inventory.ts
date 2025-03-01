import { supabase } from "@/lib/supabase";
import { Inventory, InventoryTransaction } from "@/types/database";

// Get inventory for a specific store
export async function getStoreInventory(storeId: string) {
  const { data, error } = await supabase
    .from("inventory")
    .select("*, products(name, sku, image_url, barcode)")
    .eq("store_id", storeId);

  if (error) throw error;
  return data;
}

// Get inventory for a specific product across all stores
export async function getProductInventory(productId: string) {
  const { data, error } = await supabase
    .from("inventory")
    .select("*, stores(name)")
    .eq("product_id", productId);

  if (error) throw error;
  return data;
}

// Add stock to inventory
export async function addStock(
  productId: string,
  storeId: string,
  quantity: number,
  userId: string,
  notes: string = "",
  supplierId?: string,
  unitCost?: number,
) {
  // First check if inventory record exists
  const { data: existingInventory, error: checkError } = await supabase
    .from("inventory")
    .select("*")
    .eq("product_id", productId)
    .eq("store_id", storeId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 is the error code for no rows returned
    throw checkError;
  }

  // Start a transaction
  const transaction = {
    product_id: productId,
    store_id: storeId,
    user_id: userId,
    quantity,
    type: "stock_in",
    notes,
    supplier_id: supplierId,
    unit_cost: unitCost,
    transaction_date: new Date().toISOString(),
  };

  const { data: transactionData, error: transactionError } = await supabase
    .from("inventory_transactions")
    .insert(transaction)
    .select()
    .single();

  if (transactionError) throw transactionError;

  // Update or create inventory record
  if (existingInventory) {
    // Update existing inventory
    const newQuantity = existingInventory.quantity + quantity;
    const { data, error } = await supabase
      .from("inventory")
      .update({ quantity: newQuantity })
      .eq("id", existingInventory.id)
      .select()
      .single();

    if (error) throw error;
    return { inventory: data, transaction: transactionData };
  } else {
    // Create new inventory record
    const { data, error } = await supabase
      .from("inventory")
      .insert({
        product_id: productId,
        store_id: storeId,
        quantity,
      })
      .select()
      .single();

    if (error) throw error;
    return { inventory: data, transaction: transactionData };
  }
}

// Remove stock from inventory
export async function removeStock(
  productId: string,
  storeId: string,
  quantity: number,
  userId: string,
  notes: string = "",
  reason: string = "adjustment",
) {
  // First check if inventory record exists and has enough stock
  const { data: existingInventory, error: checkError } = await supabase
    .from("inventory")
    .select("*")
    .eq("product_id", productId)
    .eq("store_id", storeId)
    .single();

  if (checkError) throw checkError;
  if (!existingInventory) throw new Error("Inventory record not found");
  if (existingInventory.quantity < quantity)
    throw new Error("Not enough stock available");

  // Start a transaction
  const transaction = {
    product_id: productId,
    store_id: storeId,
    user_id: userId,
    quantity: -quantity, // Negative for stock out
    type: "stock_out",
    notes,
    reason,
    transaction_date: new Date().toISOString(),
  };

  const { data: transactionData, error: transactionError } = await supabase
    .from("inventory_transactions")
    .insert(transaction)
    .select()
    .single();

  if (transactionError) throw transactionError;

  // Update inventory record
  const newQuantity = existingInventory.quantity - quantity;
  const { data, error } = await supabase
    .from("inventory")
    .update({ quantity: newQuantity })
    .eq("id", existingInventory.id)
    .select()
    .single();

  if (error) throw error;
  return { inventory: data, transaction: transactionData };
}

// Transfer stock between stores
export async function transferStock(
  productId: string,
  sourceStoreId: string,
  destinationStoreId: string,
  quantity: number,
  userId: string,
  notes: string = "",
) {
  // Check if source inventory has enough stock
  const { data: sourceInventory, error: sourceError } = await supabase
    .from("inventory")
    .select("*")
    .eq("product_id", productId)
    .eq("store_id", sourceStoreId)
    .single();

  if (sourceError) throw sourceError;
  if (!sourceInventory) throw new Error("Source inventory record not found");
  if (sourceInventory.quantity < quantity)
    throw new Error("Not enough stock available in source location");

  // Check if destination inventory exists
  const { data: destInventory, error: destError } = await supabase
    .from("inventory")
    .select("*")
    .eq("product_id", productId)
    .eq("store_id", destinationStoreId)
    .single();

  // Create a stock transfer record
  const transfer = {
    source_store_id: sourceStoreId,
    destination_store_id: destinationStoreId,
    user_id: userId,
    status: "completed",
    notes,
    transfer_date: new Date().toISOString(),
  };

  const { data: transferData, error: transferError } = await supabase
    .from("stock_transfers")
    .insert(transfer)
    .select()
    .single();

  if (transferError) throw transferError;

  // Create transfer item
  const transferItem = {
    transfer_id: transferData.id,
    product_id: productId,
    quantity,
  };

  const { error: itemError } = await supabase
    .from("stock_transfer_items")
    .insert(transferItem);

  if (itemError) throw itemError;

  // Update source inventory (decrease)
  const newSourceQuantity = sourceInventory.quantity - quantity;
  const { error: sourceUpdateError } = await supabase
    .from("inventory")
    .update({ quantity: newSourceQuantity })
    .eq("id", sourceInventory.id);

  if (sourceUpdateError) throw sourceUpdateError;

  // Update or create destination inventory (increase)
  if (destInventory && !destError) {
    // Update existing destination inventory
    const newDestQuantity = destInventory.quantity + quantity;
    const { error: destUpdateError } = await supabase
      .from("inventory")
      .update({ quantity: newDestQuantity })
      .eq("id", destInventory.id);

    if (destUpdateError) throw destUpdateError;
  } else {
    // Create new destination inventory record
    const { error: createError } = await supabase.from("inventory").insert({
      product_id: productId,
      store_id: destinationStoreId,
      quantity,
    });

    if (createError) throw createError;
  }

  // Create inventory transactions for both source and destination
  const sourceTransaction = {
    product_id: productId,
    store_id: sourceStoreId,
    user_id: userId,
    quantity: -quantity, // Negative for outgoing
    type: "transfer_out",
    notes: `Transfer to ${destinationStoreId}: ${notes}`,
    reference_id: transferData.id,
    transaction_date: new Date().toISOString(),
  };

  const destTransaction = {
    product_id: productId,
    store_id: destinationStoreId,
    user_id: userId,
    quantity, // Positive for incoming
    type: "transfer_in",
    notes: `Transfer from ${sourceStoreId}: ${notes}`,
    reference_id: transferData.id,
    transaction_date: new Date().toISOString(),
  };

  const { error: transError } = await supabase
    .from("inventory_transactions")
    .insert([sourceTransaction, destTransaction]);

  if (transError) throw transError;

  return { transfer: transferData };
}

// Get inventory transactions
export async function getInventoryTransactions(
  filters: {
    storeId?: string;
    productId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  } = {},
) {
  let query = supabase
    .from("inventory_transactions")
    .select(
      "*, products(name, sku), stores(name), users(name), suppliers(name)",
    )
    .order("transaction_date", { ascending: false });

  // Apply filters
  if (filters.storeId) {
    query = query.eq("store_id", filters.storeId);
  }

  if (filters.productId) {
    query = query.eq("product_id", filters.productId);
  }

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  if (filters.startDate) {
    query = query.gte("transaction_date", filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte("transaction_date", filters.endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// Get stock transfers
export async function getStockTransfers(
  filters: {
    sourceStoreId?: string;
    destinationStoreId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  } = {},
) {
  let query = supabase
    .from("stock_transfers")
    .select(
      "*, source:source_store_id(name), destination:destination_store_id(name), users(name)",
    )
    .order("transfer_date", { ascending: false });

  // Apply filters
  if (filters.sourceStoreId) {
    query = query.eq("source_store_id", filters.sourceStoreId);
  }

  if (filters.destinationStoreId) {
    query = query.eq("destination_store_id", filters.destinationStoreId);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.startDate) {
    query = query.gte("transfer_date", filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte("transfer_date", filters.endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// Get stock transfer details with items
export async function getStockTransferDetails(transferId: string) {
  // Get transfer header
  const { data: transfer, error: transferError } = await supabase
    .from("stock_transfers")
    .select(
      "*, source:source_store_id(name), destination:destination_store_id(name), users(name)",
    )
    .eq("id", transferId)
    .single();

  if (transferError) throw transferError;

  // Get transfer items
  const { data: items, error: itemsError } = await supabase
    .from("stock_transfer_items")
    .select("*, products(name, sku, image_url)")
    .eq("transfer_id", transferId);

  if (itemsError) throw itemsError;

  return { transfer, items };
}
