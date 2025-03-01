import { supabase } from "@/lib/supabase";
import { Customer } from "@/types/database";

export async function getCustomers(companyId: string) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("company_id", companyId)
    .order("name");

  if (error) throw error;
  return data as Customer[];
}

export async function getCustomerById(customerId: string) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function createCustomer(customer: Partial<Customer>) {
  const { data, error } = await supabase
    .from("customers")
    .insert(customer)
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function updateCustomer(
  customerId: string,
  updates: Partial<Customer>,
) {
  const { data, error } = await supabase
    .from("customers")
    .update(updates)
    .eq("id", customerId)
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

export async function deleteCustomer(customerId: string) {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId);

  if (error) throw error;
  return true;
}

export async function getCustomerTransactions(customerId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("customer_id", customerId)
    .order("transaction_date", { ascending: false });

  if (error) throw error;
  return data;
}
