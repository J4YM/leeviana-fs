"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { ShoppingCart, Zap, Sparkles } from "lucide-react"
import OrderConfirmationModal from "@/components/order/order-confirmation-modal"
import AuthModal from "@/components/auth/auth-modal"

interface ProductActionsProps {
  productType: "flower" | "keychain" | "customization"
  productId?: string
  productCode?: string
  productTitle: string
  productImage: string
  price: string | number
  description?: string
}

export default function ProductActions({
  productType,
  productId,
  productCode,
  productTitle,
  productImage,
  price,
  description,
}: ProductActionsProps) {
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "signup">("login")
  const { addToCart } = useCart()

  // Parse price to number
  const priceNum = typeof price === "string" ? parseFloat(price.replace(/[^0-9.]/g, "")) || 0 : price

  const handleBuyNow = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setAuthDefaultTab("login")
      setShowAuthModal(true)
      return
    }

    setShowOrderModal(true)
  }

  const handleAddToCart = () => {
    addToCart({
      productType,
      productId,
      productCode,
      productTitle,
      productImage,
      price: priceNum,
      quantity: 1,
    })
    toast.success("Added to cart!")
  }

  const handleQuickCustomize = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setAuthDefaultTab("login")
      setShowAuthModal(true)
      return
    }

    // For now, same as Buy Now - could be enhanced with a customization modal
    setShowOrderModal(true)
  }

  const orderItems = [
    {
      productType,
      productId,
      productCode,
      productTitle,
      productImage,
      price: priceNum,
      quantity: 1,
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-2 mt-3">
        <Button
          onClick={handleBuyNow}
          className="w-full bg-accent-peach-deep hover:bg-accent-peach-deep/90 text-white"
          size="sm"
        >
          <Zap className="mr-2 h-4 w-4" />
          Buy Now
        </Button>
        <Button
          onClick={handleAddToCart}
          variant="outline"
          className="w-full border-accent-peach/50 hover:bg-accent-peach/10"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button
          onClick={handleQuickCustomize}
          variant="ghost"
          className="w-full text-accent-peach hover:bg-accent-peach/10"
          size="sm"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Customize & Order
        </Button>
      </div>

      <OrderConfirmationModal
        open={showOrderModal}
        onOpenChange={setShowOrderModal}
        items={orderItems}
        isQuickOrder={true}
      />

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} defaultTab={authDefaultTab} />
    </>
  )
}

