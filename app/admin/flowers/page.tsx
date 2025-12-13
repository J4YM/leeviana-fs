import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import FlowerProductsManager from "@/components/admin/flower-products-manager"

export default async function AdminFlowersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/admin/login")
  }

  const { data: flowers } = await supabase
    .from("flower_products")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Flower Products</h2>
              <p className="text-muted-foreground">Manage your featured flower collection</p>
            </div>
            <FlowerProductsManager initialFlowers={flowers || []} />
          </div>
        </main>
      </div>
    </div>
  )
}
