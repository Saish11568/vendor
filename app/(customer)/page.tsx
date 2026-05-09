"use client"

import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { ProductCard } from "@/components/product-card"
import { CategoryCard } from "@/components/category-card"
import { FlashDeal } from "@/components/flash-deal"
import { GlassCard } from "@/components/glass-card"
import { GlobalToast } from "@/components/global-toast"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Smartphone, 
  Laptop, 
  Shirt, 
  Watch, 
  Headphones, 
  Camera,
  Home as HomeIcon,
  Dumbbell,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  Store,
  ArrowRight,
  ShoppingCart,
  Heart,
  LogIn
} from "lucide-react"

const categories = [
  { name: "Electronics", icon: Smartphone, count: 12450, gradient: "bg-gradient-to-br from-blue-500 to-blue-600" },
  { name: "Laptops", icon: Laptop, count: 3240, gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600" },
  { name: "Fashion", icon: Shirt, count: 28900, gradient: "bg-gradient-to-br from-pink-500 to-pink-600" },
  { name: "Watches", icon: Watch, count: 5670, gradient: "bg-gradient-to-br from-amber-500 to-amber-600" },
  { name: "Audio", icon: Headphones, count: 4320, gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600" },
  { name: "Cameras", icon: Camera, count: 2180, gradient: "bg-gradient-to-br from-red-500 to-red-600" },
  { name: "Home & Living", icon: HomeIcon, count: 15800, gradient: "bg-gradient-to-br from-cyan-500 to-cyan-600" },
  { name: "Sports", icon: Dumbbell, count: 8920, gradient: "bg-gradient-to-br from-orange-500 to-orange-600" },
]

const flashDeals = [
  {
    id: 9,
    name: "Bose QuietComfort Ultra Earbuds",
    price: 299.00,
    originalPrice: 349.00,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
    sold: 234,
    total: 300
  },
  {
    id: 18,
    name: "Nintendo Switch OLED Edition",
    price: 349.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    sold: 142,
    total: 200
  },
  {
    id: 11,
    name: "Adidas Ultraboost Light Running Shoes",
    price: 179.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    sold: 456,
    total: 500
  },
]

const vendors = [
  { name: "Apple Store", logo: "A", products: 1240, rating: 4.9 },
  { name: "Samsung", logo: "S", products: 892, rating: 4.7 },
  { name: "Sony Official", logo: "S", products: 567, rating: 4.8 },
  { name: "Nike Store", logo: "N", products: 2340, rating: 4.6 },
]

export default function HomePage() {
  const { user, getAllProducts, vendorProducts } = useStore()
  const router = useRouter()
  const allProducts = getAllProducts()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex relative">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-6 space-y-8 max-w-full overflow-x-hidden">
          {/* Welcome Section */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-blue-700 shadow-lg">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
            <div className="relative p-6 lg:p-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-white/90 mb-2">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {user.isLoggedIn ? `Welcome back, ${!` : 'Welcome to NexaShop!'}
                  </span>
                </div>
                <h1 className="text-2xl lg:text-4xl font-bold text-white mb-3 text-balance">
                  Discover Amazing Products from Top Vendors
                </h1>
                <p className="text-white/80 mb-6">
                  Explore our curated collection of premium products with exclusive deals just for you.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/search?q=">
                    <Button className="gap-2 bg-white text-primary hover:bg-white/90 rounded-lg font-semibold">
                      Explore Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/deals">
                    <Button variant="outline" className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 rounded-lg">
                      View Deals
                    </Button>
                  </Link>
                  {!user.isLoggedIn && (
                    <Link href="/login">
                      <Button variant="outline" className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 rounded-lg">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Shop by Category</h2>
              </div>
              <Link href="/search?q=">
                <Button variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {categories.map((category) => (
                <CategoryCard key={category.name} {...category} />
              ))}
            </div>
          </section>

          {/* Flash Deals Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10">
                  <Clock className="h-5 w-5 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Flash Deals</h2>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-500">
                  Limited Time
                </span>
              </div>
              <Link href="/deals">
                <Button variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashDeals.map((deal) => (
                <FlashDeal key={deal.id} deal={deal} />
              ))}
            </div>
          </section>

          {/* Recommended Products */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Recommended for You</h2>
              </div>
              <Link href="/search?q=">
                <Button variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allProducts.slice(8, 16).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Featured Vendors */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Featured Vendors</h2>
              </div>
              <Link href="/search?q=">
                <Button variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {vendors.map((vendor) => (
                <Link key={vendor.name} href={`/search?q=${`}>
                  <GlassCard className="p-4 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {vendor.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{vendor.name}</h3>
                        <p className="text-sm text-muted-foreground">{vendor.products.toLocaleString()} products</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <span className="text-sm font-medium">{vendor.rating}</span>
                          <span className="text-xs">★</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </section>

          {/* Trending Products */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Trending Now</h2>
              </div>
              <Link href="/search?q=">
                <Button variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allProducts.slice(16, 24).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* New Arrivals */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground">New Arrivals</h2>
              </div>
              <Link href="/search?q=">
                <Button variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border pt-8 pb-6 mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-foreground mb-4">Shop</h4>
                <div className="space-y-2">
                  {["Electronics", "Fashion", "Home & Living", "Sports"].map(l => (
                    <Link key={l} href={`/search?q=${`} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Account</h4>
                <div className="space-y-2">
                  {[{l:"My Orders",h:"/orders"},{l:"Wishlist",h:"/wishlist"},{l:"Rewards",h:"/rewards"},{l:"Settings",h:"/settings"}].map(i => (
                    <Link key={i.l} href={i.h} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{i.l}</Link>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Support</h4>
                <div className="space-y-2">
                  {[{l:"Help Center",h:"/help"},{l:"Track Order",h:"/track-order"},{l:"Returns",h:"/help"},{l:"Contact Us",h:"/help"}].map(i => (
                    <Link key={i.l} href={i.h} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{i.l}</Link>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">About</h4>
                <div className="space-y-2">
                  {["About Us", "Careers", "Press", "Blog"].map(l => (
                    <span key={l} className="block text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">{l}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">N</div>
                <span className="text-sm font-semibold text-foreground">NexaShop</span>
              </div>
              <p className="text-xs text-muted-foreground">© 2026 NexaShop. All rights reserved.</p>
            </div>
          </footer>
        </main>
      </div>
      <GlobalToast />
    </div>
  )
}
