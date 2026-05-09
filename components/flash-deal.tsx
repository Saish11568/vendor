"use client"

import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Clock, Zap, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { useStore, allProducts } from "@/lib/store"
import Link from "next/link"

interface FlashDealProps {
  deal: {
    id: number
    name: string
    price: number
    originalPrice: number
    image: string
    endTime: Date
    sold: number
    total: number
  }
}

export function FlashDeal({ deal }: FlashDealProps) {
  const { addToCart } = useStore()
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const end = deal.endTime.getTime()
      const diff = end - now

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [deal.endTime])

  const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)
  const soldPercent = (deal.sold / deal.total) * 100

  const handleAddToCart = () => {
    const product = allProducts.find(p => p.id === deal.id)
    if (product) {
      addToCart(product)
    } else {
      addToCart({
        id: deal.id,
        name: deal.name,
        price: deal.price,
        originalPrice: deal.originalPrice,
        image: deal.image,
        rating: 4.7,
        reviews: 500,
        vendor: "NexaShop",
        inStock: true,
      })
    }
  }

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image */}
        <Link href={`/product/${deal.id}`} className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-300"
            style={{ 
              backgroundImage: `url(${deal.image})`,
              backgroundColor: '#f4f4f5'
            }}
          />
          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-md bg-red-500 text-white flex items-center gap-1">
            <Zap className="h-3 w-3" />
            -{discount}%
          </span>
        </Link>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <Link href={`/product/${deal.id}`}>
            <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors cursor-pointer">{deal.name}</h3>
          </Link>
          
          {/* Timer */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div className="flex items-center gap-1 font-mono text-sm">
              <span className="px-2 py-1 rounded bg-primary/10 text-primary font-bold">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-muted-foreground">:</span>
              <span className="px-2 py-1 rounded bg-primary/10 text-primary font-bold">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-muted-foreground">:</span>
              <span className="px-2 py-1 rounded bg-primary/10 text-primary font-bold">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">${deal.price.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground line-through">${deal.originalPrice.toFixed(2)}</span>
          </div>

          {/* Progress + Add to Cart */}
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${soldPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{deal.sold} sold of {deal.total}</p>
            </div>
            <Button size="sm" className="gap-1 flex-shrink-0" onClick={handleAddToCart}>
              <ShoppingCart className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
