export interface APIProduct {
  id: string
  image: string
  name: string
  rating: {
    stars: number
    count: number
  }
  priceCents: number
  category: string
  subCategory: string
  keywords: string[]
  description: string
}

export interface Product {
  id: string
  title: string
  price: number
  image: string
  rating: number
  ratingCount: number
  category: string
  subCategory: string
  description: string
  keywords: string[]
  discount: number
  isFeatured: boolean
}
