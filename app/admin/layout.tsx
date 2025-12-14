import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Admin Dashboard - Leevienna FS",
  description: "Content management system for Leevienna FS",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/admin/login")
  }
  
  // Check admin status - try RPC function first, then fallback to direct query
  let isAdmin = false
  
  try {
    const { data: rpcResult } = await supabase.rpc("is_admin", { user_id: user.id })
    isAdmin = rpcResult || false
  } catch (error) {
    // RPC function might not exist yet, use fallback
    console.log("RPC function not available, using fallback")
  }
  
  // Fallback: direct query (may cause recursion if policies not fixed yet)
  if (!isAdmin) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
    
    isAdmin = profile?.is_admin || false
  }
  
  if (!isAdmin) {
    redirect("/")
  }
  
  return <>{children}</>
}
