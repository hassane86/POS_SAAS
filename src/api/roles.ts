import { supabase } from "@/lib/supabase";
import { Role } from "@/types/database";

// Get all roles for a company
export async function getRoles(companyId: string) {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("company_id", companyId)
    .order("name");

  if (error) throw error;
  return data as Role[];
}

// Get a specific role by ID
export async function getRoleById(roleId: string) {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("id", roleId)
    .single();

  if (error) throw error;
  return data as Role;
}

// Get a role with its permissions
export async function getRoleWithPermissions(roleId: string) {
  // Get the role
  const { data: role, error: roleError } = await supabase
    .from("roles")
    .select("*")
    .eq("id", roleId)
    .single();

  if (roleError) throw roleError;

  // Get the role's permissions
  const { data: rolePermissions, error: permissionsError } = await supabase
    .from("role_permissions")
    .select("*, permissions(*)")
    .eq("role_id", roleId);

  if (permissionsError) throw permissionsError;

  // Format the permissions
  const permissions = rolePermissions.map((rp) => rp.permissions);

  return {
    ...role,
    permissions,
  };
}

// Create a new role
export async function createRole(role: Partial<Role>) {
  const { data, error } = await supabase
    .from("roles")
    .insert(role)
    .select()
    .single();

  if (error) throw error;
  return data as Role;
}

// Update a role
export async function updateRole(roleId: string, updates: Partial<Role>) {
  const { data, error } = await supabase
    .from("roles")
    .update(updates)
    .eq("id", roleId)
    .select()
    .single();

  if (error) throw error;
  return data as Role;
}

// Delete a role
export async function deleteRole(roleId: string) {
  // First delete all role_permissions entries
  const { error: permissionsError } = await supabase
    .from("role_permissions")
    .delete()
    .eq("role_id", roleId);

  if (permissionsError) throw permissionsError;

  // Then delete the role
  const { error } = await supabase.from("roles").delete().eq("id", roleId);

  if (error) throw error;
  return true;
}
