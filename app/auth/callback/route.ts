import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get user and create profile if it doesn't exist
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: existingProfile } = await supabase
          .from("user_profiles")
          .select("id, is_admin")
          .eq("id", user.id)
          .single()

        if (!existingProfile) {
          // Check if this is the admin email
          const isAdminEmail = user.email === "leeviennafs@gmail.com"
          await supabase.from("user_profiles").insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
            phone: user.user_metadata?.phone || null,
            email: user.email || null,
            is_admin: isAdminEmail,
          })
        } else {
          // Update email if it's missing
          await supabase
            .from("user_profiles")
            .update({ email: user.email })
            .eq("id", user.id)
            .is("email", null)
          
          // If admin email, ensure is_admin is true
          if (user.email === "leeviennafs@gmail.com" && !existingProfile.is_admin) {
            await supabase
              .from("user_profiles")
              .update({ is_admin: true })
              .eq("id", user.id)
          }
        }
        
        // Check if admin and redirect to admin dashboard
        const isAdminEmail = user.email === "leeviennafs@gmail.com"
        let isAdmin = isAdminEmail
        
        if (!isAdmin && existingProfile) {
          isAdmin = existingProfile.is_admin || false
        }
        
        if (isAdmin) {
          return NextResponse.redirect(new URL("/admin/dashboard", requestUrl.origin))
        }
      }
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}

