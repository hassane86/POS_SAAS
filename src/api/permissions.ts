import { supabase } from "@/lib/supabase";

// Get all permissions
export async function getPermissions() {
  const { data, error } = await supabase
    .from("permissions")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
}

// Get permissions for a specific role
export async function getRolePermissions(roleId: string) {
  const { data, error } = await supabase
    .from("role_permissions")
    .select("*, permissions(*)")
    .eq("role_id", roleId);

  if (error) throw error;
  return data;
}

// Add permission to role
export async function addPermissionToRole(
  roleId: string,
  permissionId: string,
) {
  const { data, error } = await supabase
    .from("role_permissions")
    .insert({ role_id: roleId, permission_id: permissionId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Remove permission from role
export async function removePermissionFromRole(
  roleId: string,
  permissionId: string,
) {
  const { error } = await supabase
    .from("role_permissions")
    .delete()
    .eq("role_id", roleId)
    .eq("permission_id", permissionId);

  if (error) throw error;
  return true;
}

// Update multiple permissions for a role (add and remove in batch)
export async function updateRolePermissions(
  roleId: string,
  permissionIds: string[],
) {
  // First get current permissions
  const { data: currentPermissions, error: fetchError } = await supabase
    .from("role_permissions")
    .select("permission_id")
    .eq("role_id", roleId);

  if (fetchError) throw fetchError;

  const currentPermissionIds = currentPermissions.map((p) => p.permission_id);

  // Determine permissions to add and remove
  const toAdd = permissionIds.filter(
    (id) => !currentPermissionIds.includes(id),
  );
  const toRemove = currentPermissionIds.filter(
    (id) => !permissionIds.includes(id),
  );

  // Prepare batch operations
  const operations = [];

  // Add new permissions
  if (toAdd.length > 0) {
    const addData = toAdd.map((permissionId) => ({
      role_id: roleId,
      permission_id: permissionId,
    }));

    operations.push(supabase.from("role_permissions").insert(addData));
  }

  // Remove permissions
  for (const permissionId of toRemove) {
    operations.push(
      supabase
        .from("role_permissions")
        .delete()
        .eq("role_id", roleId)
        .eq("permission_id", permissionId),
    );
  }

  // Execute all operations
  if (operations.length > 0) {
    await Promise.all(operations);
  }

  return true;
}
