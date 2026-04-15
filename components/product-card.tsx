"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error("Please sign in to add items to cart")
      return
    }

    try {
      await addToCart(product)
      toast.success("Added to cart")
    } catch {
      toast.error("Failed to add to cart")
    }
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error("Please sign in to add items to wishlist")
      return
    }

    try {
      await toggleWishlist(product)
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
    } catch {
      toast.error("Failed to update wishlist")
    }
  }

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          {isImageLoading && (
            <div className="absolute inset-0 animate-pulse bg-secondary" />
          )}
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsImageLoading(false)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.discount > 0 && (
              <span className="rounded-full bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground">
                -{product.discount}%
              </span>
            )}
            {product.isFeatured && (
              <span className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                Featured
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-all hover:bg-background"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"
              }`}
            />
          </button>

          {/* Quick Add Button */}
          <div className="absolute bottom-3 left-3 right-3 translate-y-full opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground">{product.category}</p>
          <h3 className="mt-1 line-clamp-2 font-semibold text-foreground group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-foreground">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({product.ratingCount})</span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
