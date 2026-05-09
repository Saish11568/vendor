"use client"

import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore, Address } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  CreditCard,
  MapPin,
  Truck,
  Shield,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Lock,
  Package,
} from "lucide-react"
import Link from "next/link"

const shippingOptions = [
  { id: "standard", label: "Standard Shipping", price: 0, time: "5-7 business days" },
  { id: "express", label: "Express Shipping", price: 14.99, time: "2-3 business days" },
  { id: "overnight", label: "Overnight Shipping", price: 29.99, time: "Next business day" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getCartTotal, getCartCount, clearCart, addOrder, user } = useStore()
  const [step, setStep] = useState(1)
  const [selectedShipping, setSelectedShipping] = useState("standard")
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [address, setAddress] = useState<Address>({
    id: 1,
    type: "Home",
    name: user.name,
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: user.phone,
    isDefault: true,
  })
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: user.name,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = getCartTotal()
  const shippingCost = shippingOptions.find(s => s.id === selectedShipping)?.price || 0
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  const validateAddress = () => {
    const e: Record<string, string> = {}
    if (!address.name.trim()) e.name = "Name is required"
    if (!address.address.trim()) e.address = "Address is required"
    if (!address.city.trim()) e.city = "City is required"
    if (!address.state.trim()) e.state = "State is required"
    if (!address.zip.trim()) e.zip = "ZIP code is required"
    if (!address.phone.trim()) e.phone = "Phone is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validatePayment = () => {
    const e: Record<string, string> = {}
    if (!cardDetails.number.replace(/\s/g, '').match(/^\d{13,19}?/)) e.number = "Enter a valid card number"
    if (!cardDetails.expiry.match(/^\d{2}\/\d{2}?/)) e.expiry = "Use MM/YY format"
    if (!cardDetails.cvv.match(/^\d{3,4}?/)) e.cvv = "Enter a valid CVV"
    if (!cardDetails.name.trim()) e.cardName = "Cardholder name is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePlaceOrder = () => {
    if (!validatePayment()) return

    const newOrderId = `ORD-${`
    setOrderId(newOrderId)

    addOrder({
      id: newOrderId,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Processing",
      statusColor: "bg-blue-100 text-blue-700",
      total,
      items: cart.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      address,
      paymentMethod: `•••• ${`,
    })

    clearCart()
    setOrderPlaced(true)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  // Order success state
  if (orderPlaced) {
    return (
      <PageLayout activeItem="Home">
        <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-in zoom-in duration-500">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <p className="text-sm font-medium text-primary mb-6">Order ID: {orderId}</p>

          <div className="bg-card rounded-xl border border-border p-4 w-full mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="font-bold text-foreground">${</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span className="font-medium text-foreground">
                {shippingOptions.find(s => s.id === selectedShipping)?.time}
              </span>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <Link href="/orders" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Package className="h-4 w-4" />
                Track Order
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    )
  }

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      router.push("/cart")
    }
  }, [cart.length, orderPlaced, router])

  if (cart.length === 0 && !orderPlaced) {
    return (
      <PageLayout activeItem="Home">
        <div className="flex items-center justify-center py-20">
          <span className="h-8 w-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout activeItem="Home">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
        <ChevronRight className="h-4 w-4" />
        <span className={step >= 1 ? "text-foreground font-medium" : ""}>Address</span>
        <ChevronRight className="h-4 w-4" />
        <span className={step >= 2 ? "text-foreground font-medium" : ""}>Shipping</span>
        <ChevronRight className="h-4 w-4" />
        <span className={step >= 3 ? "text-foreground font-medium" : ""}>Payment</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Shipping Address</h2>
                  <p className="text-sm text-muted-foreground">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Full Name *</label>
                  <Input
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    placeholder="John Doe"
                    className="mt-1"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Phone Number *</label>
                  <Input
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">Street Address *</label>
                  <Input
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    placeholder="123 Main Street, Apt 4B"
                    className="mt-1"
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">City *</label>
                  <Input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="New York"
                    className="mt-1"
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">State *</label>
                    <Input
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="NY"
                      className="mt-1"
                    />
                    {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">ZIP Code *</label>
                    <Input
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      placeholder="10001"
                      className="mt-1"
                    />
                    {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Link href="/cart">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Cart
                  </Button>
                </Link>
                <Button
                  className="gap-2"
                  onClick={() => { if (validateAddress()) setStep(2) }}
                >
                  Continue to Shipping <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Shipping Method</h2>
                  <p className="text-sm text-muted-foreground">Choose your delivery speed</p>
                </div>
              </div>

              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`w-full p-4 rounded-lg border text-left transition-colors ?{
                      selectedShipping === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedShipping(option.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ?{
                          selectedShipping === option.id ? "border-primary" : "border-muted-foreground/30"
                        }`}>
                          {selectedShipping === option.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.time}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${`}>
                        {option.price === 0 ? 'FREE' : `?${`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" className="gap-2" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button className="gap-2" onClick={() => setStep(3)}>
                  Continue to Payment <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Payment Details</h2>
                  <p className="text-sm text-muted-foreground">Enter your payment information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Card Number *</label>
                  <Input
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="mt-1"
                  />
                  {errors.number && <p className="text-xs text-red-500 mt-1">{errors.number}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Expiry Date *</label>
                    <Input
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="mt-1"
                    />
                    {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">CVV *</label>
                    <Input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      placeholder="123"
                      maxLength={4}
                      className="mt-1"
                    />
                    {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Cardholder Name *</label>
                  <Input
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    placeholder="John Doe"
                    className="mt-1"
                  />
                  {errors.cardName && <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                <Lock className="h-4 w-4 text-green-600" />
                <p className="text-xs text-muted-foreground">
                  Your payment information is encrypted and secure. We never store your full card details.
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" className="gap-2" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button className="gap-2 h-12 px-8 text-base font-semibold" onClick={handlePlaceOrder}>
                  <Shield className="h-4 w-4" /> Place Order · ${
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-card rounded-xl border border-border p-6 h-fit sticky top-24">
          <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <div
                  className="w-12 h-12 rounded-lg bg-muted bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${)` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-foreground">${</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className={shippingCost === 0 ? "text-green-600" : "text-foreground"}>
                {shippingCost === 0 ? "FREE" : `?${`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="text-foreground">${</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">${</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
