import { supabase } from "@/lib/supabase";
import { User } from "@/types/database";
import { useAuth } from "@/lib/auth";

export async function getUsers(companyId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*, roles(name)")
    .eq("company_id", companyId);

  if (error) throw error;
  return data as (User & { roles: { name: string } })[];
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*, roles(name)")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as User & { roles: { name: string } };
}

export async function createUser(user: Partial<User>) {
  const { data, error } = await supabase
    .from("users")
    .insert(user)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function deleteUser(userId: string) {
  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) throw error;
  return true;
}
