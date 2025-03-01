import { supabase } from "@/lib/supabase";

// Get warehouses assigned to a store
export async function getStoreWarehouses(storeId: string) {
  const { data, error } = await supabase
    .from("store_warehouses")
    .select("*, warehouse:warehouse_id(id, name, address, city, state)")
    .eq("store_id", storeId);

  if (error) throw error;
  return data;
}

// Assign a warehouse to a store
export async function assignWarehouseToStore(
  storeId: string,
  warehouseId: string,
) {
  const { data, error } = await supabase
    .from("store_warehouses")
    .insert({
      store_id: storeId,
      warehouse_id: warehouseId,
      created_at: new Date().toISOString(),
    })
    .select();

  if (error) throw error;
  return data[0];
}

// Remove a warehouse assignment
export async function removeWarehouseAssignment(assignmentId: string) {
  const { error } = await supabase
    .from("store_warehouses")
    .delete()
    .eq("id", assignmentId);

  if (error) throw error;
  return true;
}
