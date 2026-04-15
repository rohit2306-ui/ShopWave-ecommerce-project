"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Monitor, Shirt, Footprints, Apple } from "lucide-react"

const categories = [
  {
    name: "Electronics",
    icon: Monitor,
    description: "Latest gadgets and tech",
    color: "from-blue-500/20 to-blue-600/20",
    href: "/shop?category=Electronics",
  },
  {
    name: "Clothing",
    icon: Shirt,
    description: "Trendy fashion for everyone",
    color: "from-pink-500/20 to-pink-600/20",
    href: "/shop?category=Clothing",
  },
  {
    name: "Shoes",
    icon: Footprints,
    description: "Footwear for all occasions",
    color: "from-amber-500/20 to-amber-600/20",
    href: "/shop?category=Footwear",
  },
  {
    name: "Groceries",
    icon: Apple,
    description: "Fresh and organic products",
    color: "from-emerald-500/20 to-emerald-600/20",
    href: "/shop?category=Home%20%26%20Kitchen",
  },
]

export function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our wide range of products across different categories
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={category.href} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
                      <category.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary">
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
