"use client"

import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Tag,
  ArrowRight,
  ShoppingBag,
  ChevronRight,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react"
import { useState } from "react"

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, getCartCount, clearCart, user } = useStore()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponError, setCouponError] = useState("")

  const subtotal = getCartTotal()
  const shipping = subtotal > 100 ? 0 : 9.99
  const taxRate = 0.08
  const tax = subtotal * taxRate
  const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount) : 0
  const total = subtotal + shipping + tax - couponDiscount

  const validCoupons: Record<string, { discount: number; minOrder: number }> = {
    "SAVE20": { discount: 0.20, minOrder: 100 },
    "SAVE10": { discount: 0.10, minOrder: 50 },
    "FREESHIP": { discount: 0, minOrder: 0 },
    "FIRST50": { discount: 0.25, minOrder: 200 },
    "TECH10": { discount: 0.10, minOrder: 50 },
  }

  const applyCoupon = () => {
    const coupon = validCoupons[couponCode.toUpperCase()]
    if (!coupon) {
      setCouponError("Invalid coupon code")
      setAppliedCoupon(null)
      return
    }
    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order ₹${coupon.minOrder} required`)
      setAppliedCoupon(null)
      return
    }
    setCouponError("")
    setAppliedCoupon({ code: couponCode.toUpperCase(), discount: coupon.discount })
  }

  const handleCheckout = () => {
    if (!user.isLoggedIn) {
      router.push("/login?redirect=/checkout")
    } else {
      router.push("/checkout")
    }
  }

  if (cart.length === 0) {
    return (
      <PageLayout activeItem="Home">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Looks like you haven't added anything to your cart yet. Explore our products and find something you love!
          </p>
          <Link href="/">
            <Button className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout activeItem="Home">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <ShoppingCart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground">{getCartCount()} items in your cart</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const discount = item.product.originalPrice
              ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
              : null

            return (
              <div key={item.product.id} className="bg-card rounded-xl border border-border p-4 sm:p-6">
                <div className="flex gap-4">
                  <Link href={`/product/${item.product.id}`}>
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-muted bg-cover bg-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundImage: `url(${item.product.image})` }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-primary font-medium">{item.product.vendor}</p>
                        <Link href={`/product/${item.product.id}`}>
                          <h3 className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
                            {item.product.name}
                          </h3>
                        </Link>
                        {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-foreground">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          ₹{item.product.price.toLocaleString()}
                        </p>
                        {discount && (
                          <p className="text-xs text-green-600 font-medium">You save {discount}%</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
            <h3 className="font-semibold text-foreground text-lg mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({getCartCount()} items)</span>
                <span className="text-foreground font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? "text-green-600" : "text-foreground"}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="text-foreground font-medium">₹{tax.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Coupon ({appliedCoupon.code})</span>
                  <span className="text-green-600 font-medium">-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError("") }}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={applyCoupon}>Apply</Button>
              </div>
              {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
              {appliedCoupon && <p className="text-xs text-green-600 mt-1">Coupon applied successfully!</p>}
            </div>

            {shipping > 0 && (
              <p className="text-xs text-muted-foreground mb-4">
                Add ₹{(100 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}

            <Button
              className="w-full gap-2 h-12 text-base font-semibold"
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>

            {/* Trust Badges */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { icon: Shield, label: "Secure" },
                { icon: Truck, label: "Fast Ship" },
                { icon: RotateCcw, label: "Easy Return" },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                  <badge.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
