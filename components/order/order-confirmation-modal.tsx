"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, MessageCircle, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import UserInfoForm from "@/components/order/user-info-form"

interface OrderItem {
  productType: "flower" | "keychain" | "customization"
  productId?: string
  productCode?: string
  productTitle: string
  productImage: string
  price: number
  quantity: number
  customization?: string
}

interface OrderConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: OrderItem[]
  isQuickOrder?: boolean
}

export default function OrderConfirmationModal({
  open,
  onOpenChange,
  items,
  isQuickOrder = false,
}: OrderConfirmationModalProps) {
  const [pickupLocation, setPickupLocation] = useState<string>("")
  const [customizations, setCustomizations] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [showUserInfoForm, setShowUserInfoForm] = useState(false)
  const [userInfoComplete, setUserInfoComplete] = useState(false)
  const { clearCart } = useCart()
  const router = useRouter()
  const supabase = createClient()

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Check user profile on mount
  useEffect(() => {
    const checkUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .single()
        
        setUserProfile(profile)
        
        // Show form if no full name
        if (!profile?.full_name) {
          setShowUserInfoForm(true)
        } else {
          setUserInfoComplete(true)
        }
      }
    }
    
    if (open) {
      checkUserProfile()
    }
  }, [open])

  const handleUserInfoComplete = (data: { fullName: string; phone: string }) => {
    setUserInfoComplete(true)
    setShowUserInfoForm(false)
    // Update local profile state
    setUserProfile({ full_name: data.fullName, phone: data.phone })
  }

  const handleConfirm = async () => {
    if (!pickupLocation) {
      toast.error("Please select a pickup location")
      return
    }

    if (!userInfoComplete) {
      toast.error("Please complete your contact information first")
      return
    }

    setLoading(true)

    try {
      if (!user) {
        toast.error("Please sign in to place an order")
        onOpenChange(false)
        return
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total: total,
          pickup_location: pickupLocation,
          quick_order_flag: isQuickOrder,
          payment_method: "cash_on_pickup",
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item) => {
        // Validate product_id is a valid UUID or null
        let productId = null
        if (item.productId) {
          // Check if it's a valid UUID format
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          if (uuidRegex.test(item.productId)) {
            productId = item.productId
          }
          // If not a UUID (e.g., it's a display_order number), set to null
        }
        
        return {
          order_id: order.id,
          product_type: item.productType,
          product_id: productId,
          product_code: item.productCode || null,
          product_title: item.productTitle,
          product_image: item.productImage,
          quantity: item.quantity,
          price_at_order: item.price,
          customization: customizations[item.productTitle] || item.customization || null,
        }
      })

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Get or create a single general chat room for this user (one per user, not per order)
      let chatRoom = null
      const { data: existingRoom } = await supabase
        .from("chat_rooms")
        .select("id")
        .eq("customer_id", user.id)
        .eq("room_type", "general")
        .single()

      if (existingRoom) {
        chatRoom = existingRoom
      } else {
        // Create new general room
        const { data: newRoom, error: roomError } = await supabase
          .from("chat_rooms")
          .insert({
            customer_id: user.id,
            room_type: "general",
          })
          .select()
          .single()

        if (roomError) {
          console.error("Chat room error:", roomError)
        } else {
          chatRoom = newRoom
        }
      }

      // Send automatic message with order ID
      if (chatRoom) {
        const orderMessage = `Hello! I've placed an order: ${order.order_number}. Please confirm my order.`
        
        const { error: messageError } = await supabase
          .from("chat_messages")
          .insert({
            room_id: chatRoom.id,
            sender_id: user.id,
            message: orderMessage,
          })

        if (messageError) {
          console.error("Error sending automatic message:", messageError)
        }
      }

      // Clear cart if not quick order
      if (!isQuickOrder) {
        clearCart()
      }

      toast.success(`Order ${order.order_number} created!`, {
        description: "Please message us to confirm your order.",
        duration: 5000,
      })
      onOpenChange(false)

      // Open chat widget (will be handled by chat component)
      if (typeof window !== "undefined" && chatRoom) {
        window.dispatchEvent(new CustomEvent("open-chat", { detail: { roomId: chatRoom.id } }))
      }

      // Refresh page to update UI
      router.refresh()
    } catch (error: any) {
      console.error("Order creation error:", error)
      toast.error(error.message || "Failed to create order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Confirm Your Order</DialogTitle>
          <DialogDescription>Review your items and add any customization notes</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* User Info Form (if needed) */}
          {showUserInfoForm && !userInfoComplete && (
            <div className="space-y-4">
              <UserInfoForm user={user} onComplete={handleUserInfoComplete} />
            </div>
          )}

          {/* Notification about messaging */}
          {userInfoComplete && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Important: Confirm Your Order
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                    After placing your order, please message us to officially confirm it. You can contact us via:
                  </p>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>In-website chat (will open automatically after order)</li>
                    <li>
                      <a
                        href="https://www.facebook.com/profile.php?id=61574523253260"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1"
                      >
                        Leevienna FS Facebook Page <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          {userInfoComplete && (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Order Items</h3>
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.productImage || "/placeholder.svg"}
                    alt={item.productTitle}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{item.productTitle}</h4>
                  {item.productCode && (
                    <p className="text-sm text-muted-foreground">Code: {item.productCode}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  <p className="text-sm font-semibold text-accent-peach-deep">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                  </div>
                ))}
              </div>

              {/* Customization Notes */}
              <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customization Notes</h3>
            {items.map((item, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`customization-${index}`}>{item.productTitle}</Label>
                <Textarea
                  id={`customization-${index}`}
                  placeholder="Add any customization requests (e.g., names, colors, special instructions)..."
                  value={customizations[item.productTitle] || item.customization || ""}
                  onChange={(e) =>
                    setCustomizations((prev) => ({
                      ...prev,
                      [item.productTitle]: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>
            ))}
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
            <Label htmlFor="pickup-location">Pickup Location *</Label>
            <Select value={pickupLocation} onValueChange={setPickupLocation} required>
              <SelectTrigger id="pickup-location">
                <SelectValue placeholder="Select pickup location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Catacte">Catacte</SelectItem>
                <SelectItem value="Plaridel">Plaridel</SelectItem>
                <SelectItem value="Baliuag">Baliuag</SelectItem>
              </SelectContent>
            </Select>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-accent-peach-deep">₱{total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Payment: Cash on Pickup</p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-accent-peach-deep hover:bg-accent-peach-deep/90"
              disabled={loading || !pickupLocation}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Order...
                </>
              ) : (
                "Confirm Order"
              )}
            </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

