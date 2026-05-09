"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  ShoppingBag, 
  Package, 
  Heart, 
  User, 
  Settings, 
  HelpCircle,
  Gift,
  CreditCard,
  Star,
  ShoppingCart
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: ShoppingCart, label: "Cart", href: "/cart" },
  { icon: ShoppingBag, label: "My Orders", href: "/orders" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: Package, label: "Track Order", href: "/track-order" },
  { icon: Star, label: "Rewards", href: "/rewards" },
  { icon: Gift, label: "Deals & Offers", href: "/deals" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help Center", href: "/help" },
]

interface SidebarProps {
  activeItem?: string
}

export function Sidebar({ activeItem }: SidebarProps) {
  const pathname = usePathname()
  const { user, getCartCount, wishlist, orders } = useStore()

  const getBadge = (label: string): string | number | undefined => {
    switch (label) {
      case "Cart": return getCartCount() > 0 ? getCartCount() : undefined
      case "My Orders": return orders.filter(o => o.status !== "Delivered" && o.status !== "Returned").length || undefined
      case "Wishlist": return wishlist.length > 0 ? wishlist.length : undefined
      case "Rewards": return "New"
      default: return undefined
    }
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-border bg-card">
      {/* User Info */}
      <div className="p-6 border-b border-border">
        {user.isLoggedIn ? (
          <>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.memberTier} Member</p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reward Points</span>
                <span className="font-bold text-primary">{user.rewardPoints.toLocaleString()} pts</span>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">Sign in for a better experience</p>
            <Link href="/login">
              <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Sign In
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeItem ? item.label === activeItem : pathname === item.href
          const badge = getBadge(item.label)
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {badge !== undefined && (
                <span className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded-full",
                  typeof badge === "number" 
                    ? "bg-primary/20 text-primary" 
                    : "bg-primary text-primary-foreground"
                )}>
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
