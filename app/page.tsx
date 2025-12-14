import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Hero from "@/components/hero"
import ProductsFlowers from "@/components/products-flowers"
import ProductsKeychains from "@/components/products-keychains"
import Locations from "@/components/locations"
import Process from "@/components/process"
import About from "@/components/about"
import SocialEngagement from "@/components/social-engagement"
import Gallery from "@/components/gallery"
import Testimonials from "@/components/testimonials"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default async function Home() {
  const supabase = await createClient()
  
  // Check if user is logged in and is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Check if user is admin (leeviennafs@gmail.com or has is_admin flag)
    let isAdmin = false
    
    // Check if it's the admin email first
    if (user.email === "leeviennafs@gmail.com") {
      isAdmin = true
    } else {
      try {
        // Try RPC function first
        const { data: rpcResult } = await supabase.rpc("is_admin", { user_id: user.id })
        isAdmin = rpcResult || false
      } catch {
        // Fallback to direct check
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single()
        isAdmin = profile?.is_admin || false
      }
    }
    
    // If admin, redirect to admin dashboard
    if (isAdmin) {
      redirect("/admin/dashboard")
    }
  }

  return (
    <>
      <Header />
      <Hero />
      <ProductsFlowers />
      <ProductsKeychains />
      <Locations />
      <Process />
      <About />
      <SocialEngagement />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}
