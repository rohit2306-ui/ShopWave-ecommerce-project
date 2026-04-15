"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CartPage() {
  const { user } = useAuth()
  const { items, loading, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart()
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity)
    } catch {
      toast.error("Failed to update quantity")
    }
  }

  const handleRemoveItem = async (productId: string) => {
    setRemovingId(productId)
    try {
      await removeFromCart(productId)
      toast.success("Item removed from cart")
    } catch {
      toast.error("Failed to remove item")
    } finally {
      setRemovingId(null)
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart()
      toast.success("Cart cleared")
    } catch {
      toast.error("Failed to clear cart")
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sign in to view your cart</h1>
          <p className="mt-2 text-muted-foreground">
            Your cart items will be saved when you sign in
          </p>
          <Link href="/login">
            <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-48 animate-pulse rounded bg-secondary mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                <div className="h-24 w-24 animate-pulse rounded-lg bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-1/4 animate-pulse rounded bg-secondary" />
                  <div className="h-6 w-20 animate-pulse rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Your Cart is Empty</h1>
          <p className="mt-2 text-muted-foreground">
            Looks like you haven&apos;t added any items yet
          </p>
          <Link href="/shop">
            <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCart}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`flex gap-4 rounded-xl border border-border bg-card p-4 transition-opacity ${
                      removingId === item.id ? "opacity-50" : ""
                    }`}
                  >
                    {/* Image */}
                    <Link href={`/product/${item.id}`} className="shrink-0">
                      <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-secondary">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link href={`/product/${item.id}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">{item.category}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center rounded-lg border border-border">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="font-semibold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="self-start text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {totalPrice >= 50 ? "Free" : "$9.99"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">${(totalPrice * 0.08).toFixed(2)}</span>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">
                      ${(totalPrice + (totalPrice >= 50 ? 0 : 9.99) + totalPrice * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="mt-6 w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                onClick={() => toast.success("Checkout functionality coming soon!")}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                {totalPrice < 50 && `Add $${(50 - totalPrice).toFixed(2)} more for free shipping`}
                {totalPrice >= 50 && "You qualify for free shipping!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
