"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function WishlistPage() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { items, loading, removeFromWishlist } = useWishlist()

  const handleAddToCart = async (product: (typeof items)[0]) => {
    try {
      await addToCart(product)
      toast.success("Added to cart")
    } catch {
      toast.error("Failed to add to cart")
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId)
      toast.success("Removed from wishlist")
    } catch {
      toast.error("Failed to remove from wishlist")
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sign in to view your wishlist</h1>
          <p className="mt-2 text-muted-foreground">
            Your wishlist items will be saved when you sign in
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-48 animate-pulse rounded bg-secondary mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="aspect-square animate-pulse bg-secondary" />
                <div className="p-4 space-y-2">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
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
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Your Wishlist is Empty</h1>
          <p className="mt-2 text-muted-foreground">
            Save items you love to your wishlist
          </p>
          <Link href="/shop">
            <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              Explore Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} item{items.length !== 1 ? "s" : ""} in your wishlist
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card"
              >
                {/* Image */}
                <Link href={`/product/${item.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-secondary/50">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Badges */}
                    <div className="absolute left-3 top-3 flex flex-col gap-2">
                      {item.discount > 0 && (
                        <span className="rounded-full bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground">
                          -{item.discount}%
                        </span>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemoveFromWishlist(item.id)
                      }}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur text-destructive hover:bg-background transition-all"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                  <Link href={`/product/${item.id}`}>
                    <h3 className="mt-1 line-clamp-2 font-semibold text-foreground hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-foreground">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.discount > 0 && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${(item.price / (1 - item.discount / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      size="sm"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
