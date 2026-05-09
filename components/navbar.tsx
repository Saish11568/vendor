"use client"

import { Search, ShoppingCart, Heart, Bell, User, Menu, X, LogIn, LogOut, ChevronRight, Package, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"
import { useStore, allProducts } from "@/lib/store"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Navbar() {
  const router = useRouter()
  const {
    getCartCount, searchQuery, setSearchQuery, searchResults,
    user, logout, notifications, unreadCount,
    isMobileMenuOpen, setMobileMenuOpen, wishlist,
    markNotificationRead
  } = useStore()

  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchFocused(false)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSearchSelect = (productId: number) => {
    setIsSearchFocused(false)
    setSearchQuery("")
    router.push(`/product/${productId}`)
  }

  // Get suggestions
  const suggestions = isSearchFocused && searchQuery.trim().length > 0
    ? searchResults.slice(0, 6)
    : isSearchFocused && searchQuery.trim().length === 0
      ? allProducts.slice(0, 4)
      : []

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                N
              </div>
              <span className="hidden sm:block text-xl font-bold text-foreground">NexaShop</span>
            </Link>

            {/* Search Bar */}
            <div ref={searchRef} className={`relative flex-1 max-w-xl transition-all duration-300 hidden sm:block ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products, brands, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 h-10 rounded-lg border-border bg-muted text-foreground placeholder:text-muted-foreground focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    onFocus={() => setIsSearchFocused(true)}
                  />
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                  {searchQuery.trim().length === 0 && (
                    <div className="px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                      Popular Products
                    </div>
                  )}
                  {searchQuery.trim().length > 0 && suggestions.length === 0 && (
                    <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors text-left"
                      onClick={() => handleSearchSelect(product.id)}
                    >
                      <div
                        className="w-10 h-10 rounded-lg bg-muted bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${product.image})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.vendor} · ${product.price}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))}
                  {searchQuery.trim().length > 0 && suggestions.length > 0 && (
                    <button
                      className="w-full px-4 py-3 text-sm text-primary font-medium hover:bg-muted/60 transition-colors text-center border-t border-border"
                      onClick={() => {
                        setIsSearchFocused(false)
                        router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                      }}
                    >
                      View all results for "{searchQuery}"
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Notifications */}
              <div ref={notifRef} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:text-primary hover:bg-primary/10"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                      <span className="text-xs text-muted-foreground">{unreadCount} new</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          className={`w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}
                          onClick={() => markNotificationRead(n.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
                            <div>
                              <p className="text-sm font-medium text-foreground">{n.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary hover:bg-primary/10">
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary hover:bg-primary/10">
                  <ShoppingCart className="h-5 w-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              <div ref={userMenuRef} className="relative hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User className="h-5 w-5" />
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                    {user.isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-semibold text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setShowUserMenu(false)}>
                            <User className="h-4 w-4" /> My Profile
                          </Link>
                          <Link href="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setShowUserMenu(false)}>
                            <Package className="h-4 w-4" /> My Orders
                          </Link>
                          <Link href="/rewards" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setShowUserMenu(false)}>
                            <Sparkles className="h-4 w-4" /> Rewards
                          </Link>
                          <button
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                            onClick={() => { logout(); setShowUserMenu(false) }}
                          >
                            <LogOut className="h-4 w-4" /> Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-1">
                        <Link href="/login" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setShowUserMenu(false)}>
                          <LogIn className="h-4 w-4" /> Sign In
                        </Link>
                        <Link href="/login?tab=signup" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary font-medium hover:bg-muted transition-colors" onClick={() => setShowUserMenu(false)}>
                          <User className="h-4 w-4" /> Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="sm:hidden pb-3">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 rounded-lg border-border bg-muted text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-16 bottom-0 w-72 bg-card border-r border-border overflow-y-auto animate-in slide-in-from-left duration-300">
            {/* User Info */}
            <div className="p-6 border-b border-border">
              {user.isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.memberTier} Member</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/login?tab=signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Create Account</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-1">
              {[
                { label: "Home", href: "/" },
                { label: "My Orders", href: "/orders" },
                { label: "Wishlist", href: "/wishlist" },
                { label: "Cart", href: "/cart" },
                { label: "Track Order", href: "/track-order" },
                { label: "Rewards", href: "/rewards" },
                { label: "Deals & Offers", href: "/deals" },
                { label: "Payments", href: "/payments" },
                { label: "Profile", href: "/profile" },
                { label: "Settings", href: "/settings" },
                { label: "Help Center", href: "/help" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {user.isLoggedIn && (
              <div className="p-4 border-t border-border">
                <button
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                  onClick={() => { logout(); setMobileMenuOpen(false) }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
