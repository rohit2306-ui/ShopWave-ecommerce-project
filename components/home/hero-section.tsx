"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">New Collection 2026</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Discover Premium Products at{" "}
              <span className="text-primary">Unbeatable Prices</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Shop the latest trends in electronics, fashion, and more. Enjoy free shipping,
              secure payments, and hassle-free returns on all orders.
            </p>
            
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 px-8"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/shop?featured=true">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-border hover:bg-secondary font-semibold h-12 px-8"
                >
                  View Featured
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 lg:justify-start">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">10K+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Customers</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">4.9</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square">
              {/* Decorative elements */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent" />
              <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-4 -left-4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
              
              {/* Product Grid */}
              <div className="relative grid grid-cols-2 gap-4 p-8">
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl bg-secondary/50 p-4 backdrop-blur">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-6xl">📱</span>
                    </div>
                  </div>
                  <div className="aspect-[4/3] rounded-2xl bg-secondary/50 p-4 backdrop-blur">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-5xl">👟</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-[4/3] rounded-2xl bg-secondary/50 p-4 backdrop-blur">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-5xl">👔</span>
                    </div>
                  </div>
                  <div className="aspect-square rounded-2xl bg-secondary/50 p-4 backdrop-blur">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-6xl">🎧</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
