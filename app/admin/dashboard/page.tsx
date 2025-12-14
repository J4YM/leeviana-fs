import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { checkAdminAccess } from "@/lib/utils/admin-auth"

export default async function AdminDashboard() {
  const { isAdmin, user } = await checkAdminAccess()
  
  if (!user) {
    redirect("/admin/login")
  }
  
  if (!isAdmin) {
    redirect("/")
  }

  const supabase = await createClient()

  // Get counts
  const { count: flowersCount } = await supabase.from("flower_products").select("*", { count: "exact", head: true })

  const { count: customizationCount } = await supabase
    .from("flower_customization")
    .select("*", { count: "exact", head: true })

  const { count: keychainsCount } = await supabase.from("keychain_products").select("*", { count: "exact", head: true })

  const { count: ordersCount } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: pendingOrdersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: chatRoomsCount } = await supabase.from("chat_rooms").select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome back!</h2>
              <p className="text-muted-foreground">Manage your products and content from this dashboard.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
              <Card className="border-accent-peach/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-accent-peach">🌸 Flowers</CardTitle>
                  <CardDescription>Featured flower products</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-foreground">{flowersCount || 0}</p>
                  <p className="text-sm text-muted-foreground mt-2">Total products</p>
                </CardContent>
              </Card>

              <Card className="border-accent-peach/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-accent-peach">🎨 Customization</CardTitle>
                  <CardDescription>Flower customization sets</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-foreground">{customizationCount || 0}</p>
                  <p className="text-sm text-muted-foreground mt-2">Available sets</p>
                </CardContent>
              </Card>

              <Card className="border-accent-peach/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-accent-peach">🔑 Keychains</CardTitle>
                  <CardDescription>Keychain products</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-foreground">{keychainsCount || 0}</p>
                  <p className="text-sm text-muted-foreground mt-2">Total products</p>
                </CardContent>
              </Card>

              <Card className="border-accent-peach/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-accent-peach">📦 Orders</CardTitle>
                  <CardDescription>Total orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-foreground">{ordersCount || 0}</p>
                  <p className="text-sm text-muted-foreground mt-2">{pendingOrdersCount || 0} pending</p>
                </CardContent>
              </Card>

              <Card className="border-accent-peach/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-accent-peach">💬 Chats</CardTitle>
                  <CardDescription>Active conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-foreground">{chatRoomsCount || 0}</p>
                  <p className="text-sm text-muted-foreground mt-2">Total rooms</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-accent-peach/20">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Quick Actions</CardTitle>
                <CardDescription>Common tasks and management options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <a
                    href="/admin/flowers"
                    className="p-4 border rounded-lg hover:bg-accent-peach-light/20 transition-colors"
                  >
                    <h3 className="font-semibold mb-1">Manage Flowers</h3>
                    <p className="text-sm text-muted-foreground">Edit flower products and images</p>
                  </a>
                  <a
                    href="/admin/flower-customization"
                    className="p-4 border rounded-lg hover:bg-accent-peach-light/20 transition-colors"
                  >
                    <h3 className="font-semibold mb-1">Manage Sets</h3>
                    <p className="text-sm text-muted-foreground">Update customization options</p>
                  </a>
                  <a
                    href="/admin/keychains"
                    className="p-4 border rounded-lg hover:bg-accent-peach-light/20 transition-colors"
                  >
                    <h3 className="font-semibold mb-1">Manage Keychains</h3>
                    <p className="text-sm text-muted-foreground">Edit keychain products and pricing</p>
                  </a>
                  <a
                    href="/admin/orders"
                    className="p-4 border rounded-lg hover:bg-accent-peach-light/20 transition-colors"
                  >
                    <h3 className="font-semibold mb-1">Manage Orders</h3>
                    <p className="text-sm text-muted-foreground">View and update customer orders</p>
                  </a>
                  <a
                    href="/admin/chat"
                    className="p-4 border rounded-lg hover:bg-accent-peach-light/20 transition-colors"
                  >
                    <h3 className="font-semibold mb-1">Chat Management</h3>
                    <p className="text-sm text-muted-foreground">Respond to customer inquiries</p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
