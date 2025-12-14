import { createClient } from "@/lib/supabase/server"

export async function checkAdminAccess() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { isAdmin: false, user: null }
  }

  // Check admin status using the is_admin function (bypasses RLS recursion)
  const { data, error } = await supabase.rpc("is_admin", { user_id: user.id })

  if (error) {
    console.error("Error checking admin status:", error)
    // Fallback: try direct query with RLS
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    return { isAdmin: profile?.is_admin || false, user }
  }

  return { isAdmin: data || false, user }
}

export async function requireAdmin() {
  const { isAdmin, user } = await checkAdminAccess()
  
  if (!user || !isAdmin) {
    throw new Error("Unauthorized: Admin access required")
  }
  
  return user
}

