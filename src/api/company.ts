import { supabase } from "@/lib/supabase";
import { Company } from "@/types/database";

export async function getCompanyById(companyId: string) {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single();

  if (error) throw error;
  return data as Company;
}

export async function updateCompany(
  companyId: string,
  updates: Partial<Company>,
) {
  const { data, error } = await supabase
    .from("companies")
    .update(updates)
    .eq("id", companyId)
    .select()
    .single();

  if (error) throw error;
  return data as Company;
}

export async function getCompanyByUserId(userId: string) {
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", userId)
    .single();

  if (userError) throw userError;

  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", userData.company_id)
    .single();

  if (companyError) throw companyError;
  return companyData as Company;
}

export async function updateSubscription(
  companyId: string,
  tier: string,
  status: string,
  endDate: string,
) {
  const { data, error } = await supabase
    .from("companies")
    .update({
      subscription_tier: tier,
      subscription_status: status,
      subscription_end_date: endDate,
    })
    .eq("id", companyId)
    .select()
    .single();

  if (error) throw error;
  return data as Company;
}
