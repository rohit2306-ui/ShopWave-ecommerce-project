import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { CartProvider } from "@/context/cart-context"
import { WishlistProvider } from "@/context/wishlist-context"
import { ProductsProvider } from "@/context/products-context"
import { ToastProvider } from "@/components/toast-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "ShopWave - Premium Online Shopping",
  description:
    "Discover the latest trends in electronics, clothing, shoes, and more. Shop with confidence at ShopWave.",
  keywords: ["ecommerce", "online shopping", "electronics", "clothing", "shoes"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <ToastProvider />
              </WishlistProvider>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
