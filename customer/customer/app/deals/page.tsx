"use client"

import { useState, useEffect } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { useStore, allProducts } from "@/lib/store"
import Link from "next/link"
import { 
  Gift, 
  Clock, 
  Percent, 
  Tag,
  Copy,
  Check,
  Star,
  ShoppingCart,
  Zap,
} from "lucide-react"

const coupons = [
  { code: "SAVE20", discount: "20% Off", description: "On orders above $100", validUntil: "May 31, 2026", minOrder: 100 },
  { code: "FREESHIP", discount: "Free Shipping", description: "On all orders", validUntil: "Jun 15, 2026", minOrder: 0 },
  { code: "FIRST50", discount: "$50 Off", description: "First order only", validUntil: "Dec 31, 2026", minOrder: 200 },
  { code: "TECH10", discount: "10% Off", description: "Electronics only", validUntil: "Jun 30, 2026", minOrder: 50 },
]

const flashDeals = [
  {
    id: 9,
    name: "Bose QuietComfort Ultra Earbuds",
    price: 299.00,
    originalPrice: 349.00,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
    endTime: 8 * 60 * 60,
    sold: 234,
    total: 300,
    rating: 4.7
  },
  {
    id: 11,
    name: "Adidas Ultraboost Light Running Shoes",
    price: 179.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
    endTime: 5 * 60 * 60,
    sold: 456,
    total: 500,
    rating: 4.6
  },
  {
    id: 10,
    name: "LG OLED C3 65\" 4K Smart TV",
    price: 1499.99,
    originalPrice: 1799.99,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    endTime: 12 * 60 * 60,
    sold: 189,
    total: 250,
    rating: 4.8
  },
]

const categoryDeals = [
  { category: "Electronics", discount: "Up to 40% Off", items: 1234, color: "bg-blue-500" },
  { category: "Fashion", discount: "Up to 60% Off", items: 2345, color: "bg-pink-500" },
  { category: "Home & Living", discount: "Up to 50% Off", items: 876, color: "bg-green-500" },
  { category: "Sports", discount: "Up to 35% Off", items: 543, color: "bg-orange-500" },
]

function CountdownTimer({ seconds: initialSeconds }: { seconds: number }) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-bold">{String(hours).padStart(2, '0')}</span>
      <span className="text-muted-foreground">:</span>
      <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-bold">{String(mins).padStart(2, '0')}</span>
      <span className="text-muted-foreground">:</span>
      <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-bold">{String(secs).padStart(2, '0')}</span>
    </div>
  )
}

export default function DealsPage() {
  const { addToCart, showToast } = useStore()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    showToast(`Coupon "${code}" copied to clipboard!`, "success")
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleAddToCart = (dealId: number) => {
    const product = allProducts.find(p => p.id === dealId)
    if (product) {
      addToCart(product)
    }
  }

  return (
    <PageLayout activeItem="Deals & Offers">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-orange-500/10">
          <Gift className="h-6 w-6 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Deals & Offers</h1>
          <p className="text-sm text-muted-foreground">Exclusive discounts and limited-time offers</p>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 lg:p-8 text-white mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-medium text-white/90">Limited Time Offer</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Summer Sale - Up to 70% Off</h2>
            <p className="text-white/80">Shop the biggest sale of the season on thousands of products</p>
          </div>
          <Link href="/search?q=">
            <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold px-6">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Coupon Codes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Available Coupons
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map((coupon) => (
            <div key={coupon.code} className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b border-dashed border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-primary">{coupon.discount}</span>
                  <Percent className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{coupon.description}</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <code className="px-3 py-1 bg-muted rounded text-sm font-mono font-bold">{coupon.code}</code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyCode(coupon.code)}
                    className="gap-1"
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Valid until {coupon.validUntil}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Deals */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-red-500" />
            Flash Deals
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
              Limited Stock
            </span>
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {flashDeals.map((deal) => {
            const soldPercent = (deal.sold / deal.total) * 100
            const discount = Math.round((1 - deal.price / deal.originalPrice) * 100)
            return (
              <div key={deal.id} className="bg-card rounded-xl border border-border overflow-hidden group">
                <Link href={`/product/${deal.id}`}>
                  <div className="relative aspect-square bg-muted">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url(${deal.image})` }}
                    />
                    <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white">
                      -{discount}%
                    </span>
                    <div className="absolute bottom-3 left-3">
                      <CountdownTimer seconds={deal.endTime} />
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{deal.rating}</span>
                  </div>
                  <Link href={`/product/${deal.id}`}>
                    <h4 className="font-medium text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">{deal.name}</h4>
                  </Link>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-red-600">${deal.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>{deal.sold} sold</span>
                      <span>{deal.total - deal.sold} left</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${soldPercent}%` }}
                      />
                    </div>
                  </div>
                  <Button className="w-full gap-2" onClick={() => handleAddToCart(deal.id)}>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category Deals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Shop by Category Deals</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryDeals.map((deal) => (
            <Link 
              key={deal.category}
              href={`/search?q=${encodeURIComponent(deal.category)}`}
              className="bg-card rounded-xl border border-border p-4 text-left hover:border-primary/50 transition-colors group block"
            >
              <div className={`w-12 h-12 rounded-xl ${deal.color} flex items-center justify-center mb-3`}>
                <Tag className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{deal.category}</h4>
              <p className="text-lg font-bold text-primary">{deal.discount}</p>
              <p className="text-xs text-muted-foreground">{deal.items.toLocaleString()} items</p>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
