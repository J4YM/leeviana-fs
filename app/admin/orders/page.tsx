"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Eye, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface Order {
  id: string
  order_number: string
  user_id: string
  total: number
  status: string
  pickup_location: string
  quick_order_flag: boolean
  payment_method: string
  notes: string | null
  created_at: string
  updated_at: string
  customer?: {
    full_name: string | null
    email: string
    phone: string | null
  }
  items?: Array<{
    id: string
    product_title: string
    product_code: string | null
    quantity: number
    price_at_order: number
    customization: string | null
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/admin/login")
        return
      }
      
      // Check if user is admin
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()
      
      if (!profile?.is_admin) {
        toast.error("Unauthorized: Admin access required")
        router.push("/")
        return
      }
      
      setUser(user)
      loadOrders()
    }
    getUser()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) throw error

      // Fetch customer info and items for each order
      const ordersWithDetails = await Promise.all(
        (data || []).map(async (order) => {
          // Get customer profile
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("full_name, phone")
            .eq("id", order.user_id)
            .single()

          // Get user email from user_profiles (synced from auth.users)
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("email")
            .eq("id", order.user_id)
            .single()
          
          const userEmail = profileData?.email || "N/A"

          // Get order items
          const { data: items } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", order.id)

          return {
            ...order,
            customer: {
              full_name: profile?.full_name || null,
              email: profileData?.email || userEmail,
              phone: profile?.phone || null,
            },
            items: items || [],
          }
        })
      )

      setOrders(ordersWithDetails)
    } catch (error: any) {
      toast.error(error.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId)

      if (error) throw error

      toast.success("Order status updated")
      loadOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "confirmed":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "processing":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      case "ready":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "completed":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Orders Management</h2>
                <p className="text-muted-foreground">View and manage customer orders</p>
              </div>
              <Button onClick={loadOrders} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <Card className="border-accent-peach/20">
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>{orders.length} total orders</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">No orders yet</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Pickup</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.order_number}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer?.full_name || "N/A"}</div>
                              <div className="text-sm text-muted-foreground">{order.customer?.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>₱{order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </TableCell>
                          <TableCell>{order.pickup_location}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Select
                                value={order.status}
                                onValueChange={(value) => updateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-32 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="ready">Ready</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order {selectedOrder.order_number}</DialogTitle>
              <DialogDescription>
                Created {formatDistanceToNow(new Date(selectedOrder.created_at), { addSuffix: true })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Name:</span>{" "}
                    <span className="font-medium">{selectedOrder.customer?.full_name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Email:</span>{" "}
                    <span className="font-medium">{selectedOrder.customer?.email}</span>
                  </div>
                  {selectedOrder.customer?.phone && (
                    <div>
                      <span className="text-sm text-muted-foreground">Phone:</span>{" "}
                      <span className="font-medium">{selectedOrder.customer.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{item.product_title}</div>
                          {item.product_code && (
                            <div className="text-sm text-muted-foreground">Code: {item.product_code}</div>
                          )}
                          {item.customization && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Customization: {item.customization}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">Qty: {item.quantity}</div>
                          <div className="text-sm text-muted-foreground">
                            ₱{(item.price_at_order * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">₱{selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pickup Location:</span>
                    <span className="font-medium">{selectedOrder.pickup_location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-medium">{selectedOrder.payment_method}</span>
                  </div>
                  {selectedOrder.notes && (
                    <div>
                      <span className="text-muted-foreground">Notes:</span>
                      <div className="mt-1">{selectedOrder.notes}</div>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-accent-peach-deep">₱{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

