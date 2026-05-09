"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Star,
} from "lucide-react"

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { getAllProducts } = useStore()
  const allProducts = getAllProducts()

  const [sortBy, setSortBy] = useState("relevance")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const categories = useMemo(() => {
    const cats = new Set(allProducts.map(p => p.category).filter(Boolean))
    return Array.from(cats) as string[]
  }, [])

  const filteredProducts = useMemo(() => {
    let results = allProducts

    // Search filter
    if (query) {
      const q = query.toLowerCase()
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter(p => p.category && selectedCategories.includes(p.category))
    }

    // Price filter
    results = results.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Rating filter
    if (minRating > 0) {
      results = results.filter(p => p.rating >= minRating)
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        results = [...results].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        results = [...results].sort((a, b) => b.price - a.price)
        break
      case "rating":
        results = [...results].sort((a, b) => b.rating - a.rating)
        break
      case "popular":
        results = [...results].sort((a, b) => b.reviews - a.reviews)
        break
    }

    return results
  }, [query, sortBy, priceRange, selectedCategories, minRating])

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 5000])
    setMinRating(0)
    setSortBy("relevance")
  }

  const hasActiveFilters = selectedCategories.length > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 5000

  return (
    <PageLayout>
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {query ? `Results for "${"` : "All Products"}
          </h1>
          <p className="text-sm text-muted-foreground">{filteredProducts.length} products found</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters - Desktop Sidebar */}
        <aside className={`${ lg:block w-full lg:w-64 flex-shrink-0`}>
          <div className="bg-card rounded-xl border border-border p-6 sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-red-500">
                  Clear All
                </Button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded border-border text-primary"
                    />
                    <span className="text-sm text-muted-foreground">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Price Range</h4>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background"
                  placeholder="Min"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-border bg-background"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Minimum Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-sm transition-colors ?{
                      minRating === rating ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                    }`}
                    onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                  >
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${`} />
                      ))}
                    </div>
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>

            <Button variant="ghost" className="w-full lg:hidden" onClick={() => setShowFilters(false)}>
              Apply Filters
            </Button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <Button
              variant="outline"
              className="lg:hidden gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters {hasActiveFilters && `(${)`}
            </Button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map(cat => (
                <span key={cat} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  {cat}
                  <button onClick={() => toggleCategory(cat)}><X className="h-3 w-3" /></button>
                </span>
              ))}
              {minRating > 0 && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  {minRating}+ Stars
                  <button onClick={() => setMinRating(0)}><X className="h-3 w-3" /></button>
                </span>
              )}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">No Products Found</h2>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <PageLayout>
        <div className="flex items-center justify-center py-20">
          <span className="h-8 w-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </PageLayout>
    }>
      <SearchContent />
    </Suspense>
  )
}
