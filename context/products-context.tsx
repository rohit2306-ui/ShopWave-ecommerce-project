"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product, APIProduct } from "@/types/product"

interface ProductsContextType {
  products: Product[]
  loading: boolean
  error: string | null
  categories: string[]
  refetch: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const API_URL = "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json"

function transformProduct(apiProduct: APIProduct): Product {
  // Generate random discount (10-40%)
  const discount = Math.floor(Math.random() * 31) + 10
  // Randomly mark some products as featured
  const isFeatured = Math.random() > 0.7

  return {
    id: apiProduct.id,
    title: apiProduct.name,
    price: apiProduct.priceCents / 100,
    image: apiProduct.image,
    rating: apiProduct.rating.stars,
    ratingCount: apiProduct.rating.count,
    category: apiProduct.category,
    subCategory: apiProduct.subCategory,
    description: apiProduct.description,
    keywords: apiProduct.keywords,
    discount,
    isFeatured,
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_URL)
      
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      
      const data: APIProduct[] = await response.json()
      const transformedProducts = data.map(transformProduct)
      setProducts(transformedProducts)
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map((p) => p.category))]
      setCategories(uniqueCategories)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to fetch products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        categories,
        refetch: fetchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
