"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { useProducts } from "@/context/products-context"
import { ProductCard } from "@/components/product-card"
import { ProductSkeleton } from "@/components/product-skeleton"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Product } from "@/types/product"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { products, loading } = useProducts()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isImageLoading, setIsImageLoading] = useState(true)

  useEffect(() => {
    if (!loading && products.length > 0) {
      const found = products.find((p) => p.id === id)
      setProduct(found || null)
    }
  }, [id, products, loading])

  const isWishlisted = product ? isInWishlist(product.id) : false

  const relatedProducts = product
    ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : []

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to cart")
      router.push("/login")
      return
    }

    if (!product) return

    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product)
      }
      toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart`)
    } catch {
      toast.error("Failed to add to cart")
    }
  }

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please sign in to add items to wishlist")
      router.push("/login")
      return
    }

    if (!product) return

    try {
      await toggleWishlist(product)
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
    } catch {
      toast.error("Failed to update wishlist")
    }
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-secondary" />
            <div className="space-y-4">
              <div className="h-6 w-24 animate-pulse rounded bg-secondary" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-secondary" />
              <div className="h-6 w-32 animate-pulse rounded bg-secondary" />
              <div className="h-24 w-full animate-pulse rounded bg-secondary" />
              <div className="h-12 w-full animate-pulse rounded bg-secondary" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Product Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The product you are looking for does not exist.
          </p>
          <Link href="/shop">
            <Button className="mt-4">Back to Shop</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-secondary/50">
              {isImageLoading && (
                <div className="absolute inset-0 animate-pulse bg-secondary" />
              )}
              <Image
                src={product.image}
                alt={product.title}
                fill
                className={`object-cover transition-opacity ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsImageLoading(false)}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.discount > 0 && (
                  <span className="rounded-full bg-destructive px-3 py-1 text-sm font-semibold text-destructive-foreground">
                    -{product.discount}%
                  </span>
                )}
                {product.isFeatured && (
                  <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <div className="mb-2">
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-sm text-primary hover:underline"
              >
                {product.category}
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({product.ratingCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-4xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-xl text-muted-foreground line-through">
                  ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                onClick={handleToggleWishlist}
                variant="outline"
                className={`h-12 border-border ${
                  isWishlisted ? "bg-destructive/10 text-destructive border-destructive/50" : ""
                }`}
              >
                <Heart
                  className={`mr-2 h-5 w-5 ${isWishlisted ? "fill-destructive" : ""}`}
                />
                {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
              </Button>
            </div>

            {/* Features */}
            <div className="mt-8 grid gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">Orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30 day policy</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-8 text-2xl font-bold text-foreground">Related Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
