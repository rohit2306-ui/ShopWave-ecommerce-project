"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./auth-context"
import type { Product } from "@/types/product"

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  loading: boolean
  addToCart: (product: Product) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    const cartRef = collection(db, "carts", user.uid, "items")
    const q = query(cartRef)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cartItems: CartItem[] = []
        snapshot.forEach((doc) => {
          cartItems.push({ id: doc.id, ...doc.data() } as CartItem)
        })
        setItems(cartItems)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching cart:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const addToCart = async (product: Product) => {
    if (!user) return

    const existingItem = items.find((item) => item.id === product.id)
    const itemRef = doc(db, "carts", user.uid, "items", product.id)

    if (existingItem) {
      await updateDoc(itemRef, { quantity: existingItem.quantity + 1 })
    } else {
      await setDoc(itemRef, { ...product, quantity: 1 })
    }
  }

  const removeFromCart = async (productId: string) => {
    if (!user) return
    const itemRef = doc(db, "carts", user.uid, "items", productId)
    await deleteDoc(itemRef)
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return
    const itemRef = doc(db, "carts", user.uid, "items", productId)

    if (quantity <= 0) {
      await deleteDoc(itemRef)
    } else {
      await updateDoc(itemRef, { quantity })
    }
  }

  const clearCart = async () => {
    if (!user) return
    const promises = items.map((item) =>
      deleteDoc(doc(db, "carts", user.uid, "items", item.id))
    )
    await Promise.all(promises)
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
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
