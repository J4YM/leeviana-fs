"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

export interface CartItem {
  id: string
  productType: "flower" | "keychain" | "customization"
  productId?: string
  productCode?: string
  productTitle: string
  productImage: string
  price: number
  quantity: number
  customization?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, "id">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("leeviana-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to load cart from localStorage", e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("leeviana-cart", JSON.stringify(items))
    } else {
      localStorage.removeItem("leeviana-cart")
    }
  }, [items])

  // Sync cart with user account when logged in
  useEffect(() => {
    const syncCart = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && items.length > 0) {
        // In the future, we could sync with a server-side cart
        // For now, we'll just keep it in localStorage
      }
    }

    syncCart()
  }, [items])

  const addToCart = (item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      // Check if item already exists (same product, same customization)
      const existingIndex = prev.findIndex(
        (i) =>
          i.productType === item.productType &&
          i.productId === item.productId &&
          i.productCode === item.productCode &&
          i.customization === item.customization
      )

      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...prev]
        updated[existingIndex].quantity += item.quantity
        return updated
      } else {
        // Add new item
        return [...prev, { ...item, id: `${Date.now()}-${Math.random()}` }]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("leeviana-cart")
  }

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

