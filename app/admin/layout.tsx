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
  
  // Check admin status - check email first, then RPC function, then fallback
  let isAdmin = false
  
  // Check if it's the admin email
  if (user.email === "leeviennafs@gmail.com") {
    isAdmin = true
  } else {
    // Try RPC function first
    try {
      const { data: rpcResult } = await supabase.rpc("is_admin", { user_id: user.id })
      isAdmin = rpcResult || false
    } catch (error) {
      // RPC function might not exist yet, use fallback
      console.log("RPC function not available, using fallback")
    }
    
    // Fallback: direct query
    if (!isAdmin) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()
      
      isAdmin = profile?.is_admin || false
    }
  }
  
  if (!isAdmin) {
    redirect("/")
  }
  
  return <>{children}</>
}
