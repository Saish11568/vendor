"use client"

import { useState, useCallback, useMemo, useEffect, ReactNode } from "react"
import {
  StoreContext,
  StoreState,
  CartItem,
  Product,
  User,
  Order,
  Notification,
  ToastMessage,
  defaultUser,
  defaultNotifications,
  allProducts,
  vendorToProduct,
} from "@/lib/store"

// LocalStorage helpers
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const data = localStorage.getItem(`nexashop_${key}`)
    return data ? JSON.parse(data) : fallback
  } catch { return fallback }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`nexashop_${key}`, JSON.stringify(value))
  } catch { /* storage full or unavailable */ }
}

const defaultOrders: Order[] = [
  {
    id: "ORD-2024-8847",
    date: "May 5, 2026",
    status: "Out for Delivery",
    statusColor: "bg-amber-100 text-amber-700",
    total: 1799.99,
    items: [{ name: "Apple MacBook Pro 14\" M3 Pro Chip", price: 1799.99, quantity: 1, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop" }]
  },
  {
    id: "ORD-2024-8832",
    date: "May 3, 2026",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-700",
    total: 298.00,
    items: [{ name: "Sony WH-1000XM5 Wireless Headphones", price: 298.00, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" }]
  },
  {
    id: "ORD-2024-8819",
    date: "Apr 28, 2026",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-700",
    total: 1199.99,
    items: [{ name: "Samsung Galaxy S24 Ultra 256GB", price: 1199.99, quantity: 1, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop" }]
  },
  {
    id: "ORD-2024-8801",
    date: "Apr 25, 2026",
    status: "Returned",
    statusColor: "bg-blue-100 text-blue-700",
    total: 149.99,
    items: [{ name: "Nike Air Max 90 Premium Sneakers", price: 149.99, quantity: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" }]
  },
  {
    id: "ORD-2024-8788",
    date: "Apr 20, 2026",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-700",
    total: 678.00,
    items: [
      { name: "Apple Watch Series 9 GPS 45mm", price: 429.00, quantity: 1, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&h=100&fit=crop" },
      { name: "Apple AirPods Pro 2nd Gen", price: 249.00, quantity: 1, image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop" }
    ]
  },
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [user, setUser] = useState<User>(defaultUser)
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [orders, setOrders] = useState<Order[]>(defaultOrders)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [vendorProducts, setVendorProducts] = useState<Product[]>([])

  // Fetch vendor products from API
  const fetchVendorProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products")
      if (res.ok) {
        const data = await res.json()
        const converted = data.map(vendorToProduct)
        setVendorProducts(converted)
      }
    } catch (err) {
      console.error("Failed to fetch vendor products:", err)
    }
  }, [])

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        const data = await res.json()
        if (data && data.length > 0) {
          // Merge API notifications with local state, avoiding duplicates
          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id))
            const newNotifs = data.filter((n: Notification) => !existingIds.has(n.id))
            if (newNotifs.length > 0) {
              return [...newNotifs, ...prev]
            }
            return prev
          })
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    }
  }, [])

  // Get all products (static + vendor)
  const getAllProducts = useCallback((): Product[] => {
    // Merge static products with vendor products, vendor products appear first as "New Arrivals"
    // We sort vendor products by ID (timestamp) descending so newest ones appear first
    const sortedVendorProducts = [...vendorProducts].sort((a, b) => b.id - a.id)
    
    const vendorIds = new Set(vendorProducts.map(p => p.id))
    // Filter out any static products with conflicting IDs
    const staticFiltered = allProducts.filter(p => !vendorIds.has(p.id))
    
    // Ensure all products have required fields to prevent crashes
    const sanitizeProduct = (p: Product) => ({
      ...p,
      vendor: p.vendor || "Nexa Vendor",
      rating: p.rating || 0,
      reviews: p.reviews || 0,
      image: p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
    })

    return [...sortedVendorProducts.map(sanitizeProduct), ...staticFiltered.map(sanitizeProduct)]
  }, [vendorProducts])

  // Refresh vendor products (can be called manually)
  const refreshVendorProducts = useCallback(() => {
    fetchVendorProducts()
  }, [fetchVendorProducts])

  // Hydrate from localStorage
  useEffect(() => {
    setCart(loadFromStorage<CartItem[]>("cart", []))
    setWishlist(loadFromStorage<Product[]>("wishlist", []))
    setUser(loadFromStorage<User>("user", defaultUser))
    setOrders(loadFromStorage<Order[]>("orders", defaultOrders))
    setHydrated(true)
  }, [])

  // Fetch vendor products and notifications on mount and poll every 30 seconds
  useEffect(() => {
    fetchVendorProducts()
    fetchNotifications()
    const interval = setInterval(() => {
      fetchVendorProducts()
      fetchNotifications()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchVendorProducts, fetchNotifications])

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return
    saveToStorage("cart", cart)
  }, [cart, hydrated])
  useEffect(() => {
    if (!hydrated) return
    saveToStorage("wishlist", wishlist)
  }, [wishlist, hydrated])
  useEffect(() => {
    if (!hydrated) return
    saveToStorage("user", user)
  }, [user, hydrated])
  useEffect(() => {
    if (!hydrated) return
    saveToStorage("orders", orders)
  }, [orders, hydrated])

  // Toast system
  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  // Cart actions
  const addToCart = useCallback((product: Product, quantity = 1, variants?: Record<string, string>) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity, selectedVariants: variants }]
    })
    showToast(`${product.name} added to cart!`, "success")
  }, [showToast])

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => {
      const item = prev.find(i => i.product.id === productId)
      if (item) showToast(`${item.product.name} removed from cart`, "info")
      return prev.filter(item => item.product.id !== productId)
    })
  }, [showToast])

  const updateCartQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ))
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }, [cart])

  const getCartCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  // Wishlist actions
  const addToWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) return prev
      showToast(`${product.name} added to wishlist!`, "success")
      return [...prev, product]
    })
  }, [showToast])

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlist(prev => {
      const item = prev.find(p => p.id === productId)
      if (item) showToast(`${item.name} removed from wishlist`, "info")
      return prev.filter(p => p.id !== productId)
    })
  }, [showToast])

  const isInWishlist = useCallback((productId: number) => {
    return wishlist.some(p => p.id === productId)
  }, [wishlist])

  // Auth actions
  const login = useCallback((email: string, _password: string) => {
    // Simulated login – accept any credentials for demo
    // Extract a name from the email (e.g. "alex@test.com" -> "Alex")
    const name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    
    setUser(prev => ({ ...prev, email, name: formattedName || "User", isLoggedIn: true }))
    showToast(`Welcome back, ${formattedName || "User"}! You've logged in successfully.`, "success")
    return true
  }, [showToast])

  const signup = useCallback((name: string, email: string, _password: string) => {
    setUser({ ...defaultUser, name, email, isLoggedIn: true })
    showToast("Account created successfully! Welcome.", "success")
    return true
  }, [showToast])

  const logout = useCallback(() => {
    setUser(prev => ({ ...prev, isLoggedIn: false }))
    showToast("You've been logged out.", "info")
  }, [showToast])

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }))
    showToast("Profile updated successfully!", "success")
  }, [showToast])

  // Notifications
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications])

  // Search – searches across ALL products (static + vendor)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    const all = getAllProducts()
    return all.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.vendor.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
  }, [searchQuery, getAllProducts])

  // Orders
  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev])
    showToast(`Order ${order.id} placed successfully!`, "success")
  }, [showToast])

  const value: StoreState = useMemo(() => ({
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, getCartCount,
    wishlist, addToWishlist, removeFromWishlist, isInWishlist,
    user, login, signup, logout, updateProfile,
    notifications, addNotification, markNotificationRead, unreadCount,
    vendorProducts, getAllProducts, refreshVendorProducts,
    searchQuery, setSearchQuery, searchResults,
    orders, addOrder,
    toasts, showToast,
    isMobileMenuOpen, setMobileMenuOpen,
  }), [
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, getCartCount,
    wishlist, addToWishlist, removeFromWishlist, isInWishlist,
    user, login, signup, logout, updateProfile,
    notifications, addNotification, markNotificationRead, unreadCount,
    vendorProducts, getAllProducts, refreshVendorProducts,
    searchQuery, setSearchQuery, searchResults,
    orders, addOrder,
    toasts, showToast,
    isMobileMenuOpen, setMobileMenuOpen,
  ])

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}
