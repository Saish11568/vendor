"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { 
  Package, 
  Search,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Box,
  ArrowRight
} from "lucide-react"

const trackingSteps = [
  { status: "Order Placed", desc: "Your order has been confirmed", icon: Box, time: "May 5, 2026 - 10:30 AM", completed: true },
  { status: "Processing", desc: "We're preparing your order", icon: Clock, time: "May 5, 2026 - 2:15 PM", completed: true },
  { status: "Shipped", desc: "Your order is on the way", icon: Truck, time: "May 6, 2026 - 8:00 AM", completed: true },
  { status: "Out for Delivery", desc: "Your package is nearby", icon: MapPin, time: "May 8, 2026 - 9:45 AM", completed: true },
  { status: "Delivered", desc: "Package delivered successfully", icon: CheckCircle2, time: "Expected: May 8, 2026", completed: false },
]

export default function TrackOrderPage() {
  const { orders, showToast } = useStore()
  const [orderId, setOrderId] = useState("")
  const [trackedOrder, setTrackedOrder] = useState<typeof orders[0] | null>(null)
  const [showTracking, setShowTracking] = useState(false)

  const handleTrack = () => {
    if (!orderId.trim()) {
      showToast("Please enter an order ID", "error")
      return
    }

    const found = orders.find(o => o.id.toLowerCase() === orderId.trim().toLowerCase())
    if (found) {
      setTrackedOrder(found)
      setShowTracking(true)
    } else {
      showToast("Order not found. Please check the order ID.", "error")
      setShowTracking(false)
    }
  }

  const getStepStatus = (status: string) => {
    if (!trackedOrder) return false
    const statusOrder = ["Processing", "Shipped", "Out for Delivery", "Delivered"]
    const currentIdx = statusOrder.indexOf(trackedOrder.status)
    const stepIdx = statusOrder.indexOf(status)
    
    if (status === "Order Placed") return true
    return stepIdx <= currentIdx
  }

  const handleQuickTrack = (order: typeof orders[0]) => {
    setOrderId(order.id)
    setTrackedOrder(order)
    setShowTracking(true)
  }

  return (
    <PageLayout activeItem="Track Order">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Track Your Order</h1>
          <p className="text-sm text-muted-foreground">Enter your order ID to track your package</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter Order ID (e.g., ORD-2024-8847)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            />
          </div>
          <Button className="gap-2" onClick={handleTrack}>
            <Package className="h-4 w-4" />
            Track Order
          </Button>
        </div>
      </div>

      {/* Tracking Result */}
      {showTracking && trackedOrder && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="text-lg font-bold text-foreground">{trackedOrder.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium text-foreground">{trackedOrder.date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${`}>
                {trackedOrder.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-bold text-foreground">${</p>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="relative pl-8">
            {trackingSteps.map((step, index) => {
              const isCompleted = getStepStatus(step.status)
              const isCurrent = trackedOrder.status === step.status
              return (
                <div key={step.status} className="relative pb-8 last:pb-0">
                  {/* Line */}
                  {index < trackingSteps.length - 1 && (
                    <div className={`absolute left-[-20px] top-8 w-0.5 h-full ${`} />
                  )}
                  {/* Dot */}
                  <div className={`absolute left-[-28px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ?{
                    isCurrent ? "border-primary bg-primary" : isCompleted ? "border-primary bg-primary" : "border-border bg-background"
                  }`}>
                    {isCompleted && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  {/* Content */}
                  <div className={`${`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-medium ${`}>
                          {step.status}
                          {isCurrent && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">Current</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{step.time}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Items */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="font-medium text-foreground mb-3">Order Items</h4>
            {trackedOrder.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${)` }} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-foreground">${</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Recent Orders</h3>
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="gap-1">View All <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <button
                key={order.id}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors text-left"
                onClick={() => handleQuickTrack(order)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${)` }} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${`}>
                    {order.status}
                  </span>
                  <p className="text-sm font-medium text-foreground mt-1">${</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-6">No orders found. <Link href="/" className="text-primary">Start shopping!</Link></p>
        )}
      </div>
    </PageLayout>
  )
}
