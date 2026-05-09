"use client"

import { Heart, Star, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { useState } from "react"
import { useStore, Product } from "@/lib/store"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore()
  const [isHovered, setIsHovered] = useState(false)
  const wishlisted = isInWishlist(product.id)

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (wishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <GlassCard 
      className="group overflow-hidden"
      hover={false}
    >
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <Link href={`/product/${product.id}`}>
          <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted cursor-pointer">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ 
                backgroundImage: `url(${product.image})`,
                backgroundColor: '#f4f4f5'
              }}
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.badge && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground backdrop-blur-sm">
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500/90 text-white backdrop-blur-sm">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-3 right-3 h-8 w-8 rounded-full transition-all duration-300 shadow-sm ${
                wishlisted 
                  ? 'bg-red-50 text-red-500 hover:bg-red-100 opacity-100' 
                  : 'bg-white text-muted-foreground hover:bg-white hover:text-foreground'
              } ${isHovered || wishlisted ? 'opacity-100' : 'opacity-0'}`}
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
            </Button>

            {/* Quick Actions */}
            <div className={`absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Button
                className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-md"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </Link>

        {/* Content */}
        <Link href={`/product/${product.id}`}>
          <div className="p-4 space-y-2 cursor-pointer">
            <p className="text-xs text-primary font-medium">{product.vendor}</p>
            <h3 className="font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews.toLocaleString()})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            {product.stock !== undefined && product.stock <= 10 && (
              <p className="text-xs text-red-500 font-medium">Only {product.stock} left in stock!</p>
            )}
          </div>
        </Link>
      </div>
    </GlassCard>
  )
}
