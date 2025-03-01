import { supabase } from "@/lib/supabase";

export async function signIn(login: string, password: string) {
  // First try to find the user by login
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*, roles(name)")
    .eq("login", login)
    .single();

  if (userError || !userData) {
    // If not found by login, try with email
    return await supabase.auth.signInWithPassword({ email: login, password });
  }

  // If found by login, verify password and sign in
  if (userData.password === password) {
    // Add role information to the user object
    const userWithRole = {
      ...userData,
      role: userData.roles?.name === "Admin" ? "admin" : "user",
    };

    console.log("User role:", userWithRole.role);

    // If password matches, create a successful response
    return {
      data: { session: { user: userWithRole }, user: userWithRole },
      error: null,
    };
  }

  // Password doesn't match
  return {
    data: { session: null, user: null },
    error: new Error("Invalid login credentials"),
  };
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get additional user data from the database
  const { data, error } = await supabase
    .from("users")
    .select("*, roles(name, permissions)")
    .eq("auth_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
    return null;
  }

  return data;
}

export async function getUserStores(userId: string) {
  const { data, error } = await supabase
    .from("user_stores")
    .select("*, stores(*)")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user stores:", error);
    return [];
  }

  return data;
}
