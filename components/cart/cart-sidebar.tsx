"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Trash2, Plus, Minus, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import OrderConfirmationModal from "@/components/order/order-confirmation-modal"
import { createClient } from "@/lib/supabase/client"
import AuthModal from "@/components/auth/auth-modal"
import { toast } from "sonner"

export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, getTotal, getItemCount, clearCart } = useCart()
  const [open, setOpen] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setShowAuthModal(true)
      setOpen(false)
      return
    }

    setShowOrderModal(true)
    setOpen(false)
  }

  const orderItems = items.map((item) => ({
    productType: item.productType,
    productId: item.productId,
    productCode: item.productCode,
    productTitle: item.productTitle,
    productImage: item.productImage,
    price: item.price,
    quantity: item.quantity,
    customization: item.customization,
  }))

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {getItemCount() > 0 && (
              <Badge
                className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center bg-destructive text-destructive-foreground text-xs font-bold"
              >
                {getItemCount() > 99 ? "99+" : getItemCount()}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-2xl font-serif">Shopping Cart</SheetTitle>
            <SheetDescription>
              {items.length === 0 ? "Your cart is empty" : `${getItemCount()} item(s) in your cart`}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 flex flex-col h-[calc(100vh-120px)]">
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.productImage || "/placeholder.svg"}
                          alt={item.productTitle}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2">{item.productTitle}</h4>
                        {item.productCode && (
                          <p className="text-xs text-muted-foreground">Code: {item.productCode}</p>
                        )}
                        <p className="text-sm font-semibold text-accent-peach-deep mt-1">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 ml-auto text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-accent-peach-deep">₱{getTotal().toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full bg-accent-peach-deep hover:bg-accent-peach-deep/90"
                    size="lg"
                  >
                    Place Order
                  </Button>
                  <Button variant="outline" onClick={clearCart} className="w-full" size="sm">
                    Clear Cart
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <OrderConfirmationModal
        open={showOrderModal}
        onOpenChange={setShowOrderModal}
        items={orderItems}
        isQuickOrder={false}
      />

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} defaultTab="login" />
    </>
  )
}

