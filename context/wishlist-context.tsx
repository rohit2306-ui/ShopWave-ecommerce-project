"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./auth-context"
import type { Product } from "@/types/product"

interface WishlistContextType {
  items: Product[]
  loading: boolean
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product) => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    const wishlistRef = collection(db, "wishlists", user.uid, "items")
    const q = query(wishlistRef)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const wishlistItems: Product[] = []
        snapshot.forEach((doc) => {
          wishlistItems.push({ id: doc.id, ...doc.data() } as Product)
        })
        setItems(wishlistItems)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching wishlist:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const addToWishlist = async (product: Product) => {
    if (!user) return
    const itemRef = doc(db, "wishlists", user.uid, "items", product.id)
    await setDoc(itemRef, product)
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user) return
    const itemRef = doc(db, "wishlists", user.uid, "items", productId)
    await deleteDoc(itemRef)
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId)
  }

  const toggleWishlist = async (product: Product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
