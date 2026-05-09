"use client"

import { PageLayout } from "@/components/page-layout"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Share2,
  Check,
  Package,
  Zap,
} from "lucide-react"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = Number(params.id)
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, getAllProducts } = useStore()
  
  const allProducts = getAllProducts()
  const product = allProducts.find(p => p.id === productId)

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description")
  const wishlisted = product ? isInWishlist(product.id) : false

  if (!product) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/"><Button>Back to Shop</Button></Link>
        </div>
      </PageLayout>
    )
  }

  const images = product.images || [product.image]
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.vendor === product.vendor))
    .slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, quantity, Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity, Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined)
    router.push("/cart")
  }

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        {product.category && (
          <>
            <Link href={`/search?q=${encodeURIComponent(product.category)}`} className="hover:text-foreground transition-colors">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{ backgroundImage: `url(${images[selectedImage]})` }}
            />
            {discount && (
              <span className="absolute top-4 left-4 px-3 py-1.5 text-sm font-bold rounded-full bg-red-500 text-white">
                -{discount}% OFF
              </span>
            )}
            {product.badge && (
              <span className="absolute top-4 right-4 px-3 py-1.5 text-sm font-medium rounded-full bg-primary text-primary-foreground">
                {product.badge}
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-primary" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedImage(i)}
                >
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-primary font-medium mb-1">{product.vendor}</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                  />
                ))}
              </div>
              <span className="font-medium text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {discount && (
                <span className="px-2 py-1 text-sm font-bold rounded-lg bg-green-100 text-green-700">
                  Save ${(product.originalPrice! - product.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.inStock !== false ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">In Stock</span>
                {product.stock && product.stock <= 10 && (
                  <span className="text-xs text-red-500 font-medium ml-2">Only {product.stock} left!</span>
                )}
              </>
            ) : (
              <span className="text-sm text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Variants */}
          {product.variants && product.variants.map((variant) => (
            <div key={variant.label}>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {variant.label}: <span className="text-primary">{selectedVariants[variant.label] || "Select"}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => (
                  <button
                    key={option}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedVariants[variant.label] === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedVariants({ ...selectedVariants, [variant.label]: option })}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-lg font-semibold text-foreground">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1 gap-2 h-12 text-base font-semibold"
              onClick={handleAddToCart}
              disabled={product.inStock === false}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 h-12 text-base font-semibold"
              onClick={handleBuyNow}
              disabled={product.inStock === false}
            >
              <Zap className="h-5 w-5" />
              Buy Now
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`h-12 w-12 ${wishlisted ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
              onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
            >
              <Heart className={`h-5 w-5 ${wishlisted ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Free Shipping", desc: "Orders over ₹100" },
              { icon: Shield, label: "Secure Payment", desc: "SSL Encrypted" },
              { icon: RotateCcw, label: "Easy Returns", desc: "30 Day Policy" },
            ].map((badge) => (
              <div key={badge.label} className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50 border border-border">
                <badge.icon className="h-5 w-5 text-primary mb-1" />
                <span className="text-xs font-medium text-foreground">{badge.label}</span>
                <span className="text-[10px] text-muted-foreground">{badge.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex gap-1 border-b border-border mb-6">
          {(["description", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        )}

        {activeTab === "specs" && product.specs && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {Object.entries(product.specs).map(([key, value], i) => (
              <div key={key} className={`flex items-center px-6 py-3 ${i % 2 === 0 ? 'bg-muted/30' : ''}`}>
                <span className="w-40 font-medium text-foreground text-sm">{key}</span>
                <span className="text-sm text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{product.rating}</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{product.reviews.toLocaleString()} reviews</p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map(star => {
                  const percentage = star === 5 ? 65 : star === 4 ? 22 : star === 3 ? 8 : star === 2 ? 3 : 2
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-6">{star}★</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">Review submission coming soon! Verified purchase reviews will appear here.</p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  )
}
