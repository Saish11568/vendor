"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star,
  Share2,
  Bell,
  Grid,
  List,
  ShoppingBag
} from "lucide-react"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart, showToast } = useStore()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0)

  const handleAddAllToCart = () => {
    const inStockItems = wishlist.filter(item => item.inStock !== false)
    if (inStockItems.length === 0) {
      showToast("No in-stock items to add", "info")
      return
    }
    inStockItems.forEach(item => addToCart(item))
    showToast(`${inStockItems.length} items added to cart!`, "success")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "My NexaShop Wishlist", url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showToast("Wishlist link copied!", "success")
    }
  }

  if (wishlist.length === 0) {
    return (
      <PageLayout activeItem="Wishlist">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-red-300" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Save items you love to your wishlist. They'll be here whenever you're ready to shop!
          </p>
          <Link href="/">
            <Button className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout activeItem="Wishlist">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-sm text-muted-foreground">{wishlist.length} items saved</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-primary/10 text-primary" : ""}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-primary/10 text-primary" : ""}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            Share List
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-xl font-bold text-foreground">₹{totalValue.toLocaleString()}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-sm text-muted-foreground">Items</p>
              <p className="text-xl font-bold text-foreground">{wishlist.length}</p>
            </div>
          </div>
          <Button className="gap-2" onClick={handleAddAllToCart}>
            <ShoppingCart className="h-4 w-4" />
            Add All to Cart
          </Button>
        </div>
      </div>

      {/* Wishlist Items */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-card rounded-xl border border-border overflow-hidden group">
              <Link href={`/product/${item.id}`}>
                <div className="relative aspect-square bg-muted">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  {item.inStock === false && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <span className="px-3 py-1 bg-muted text-muted-foreground text-sm font-medium rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="absolute top-3 right-3 flex flex-col gap-2" style={{ position: 'relative', top: '-2.5rem', float: 'right', marginRight: '0.75rem' }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 bg-white shadow-sm hover:bg-red-50 hover:text-red-500"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 -mt-6">
                <p className="text-xs text-muted-foreground mb-1">{item.vendor}</p>
                <Link href={`/product/${item.id}`}>
                  <h3 className="font-medium text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors cursor-pointer">{item.name}</h3>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({item.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-foreground">₹{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through ml-2">₹{item.originalPrice}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    disabled={item.inStock === false}
                    className="gap-1"
                    onClick={() => addToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-card rounded-xl border border-border p-4 flex gap-4">
              <Link href={`/product/${item.id}`}>
                <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  <div 
                    className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.vendor}</p>
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">{item.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{item.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({item.reviews.toLocaleString()})</span>
                      {item.inStock === false && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Out of Stock</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">₹{item.price}</p>
                    {item.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">₹{item.originalPrice}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end mt-3 gap-2">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromWishlist(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" disabled={item.inStock === false} className="gap-1" onClick={() => addToCart(item)}>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
