"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { 
  ShoppingBag, 
  Package,
  ChevronRight,
  Star,
  RefreshCw,
  Download,
  Filter
} from "lucide-react"

const filterOptions = ["All Orders", "Processing", "Shipped", "Out for Delivery", "Delivered", "Returned"]

export default function OrdersPage() {
  const { orders, addToCart, showToast, getAllProducts } = useStore()
  const [activeFilter, setActiveFilter] = useState("All Orders")
  const allProducts = getAllProducts()

  const filteredOrders = activeFilter === "All Orders" 
    ? orders 
    : orders.filter(o => o.status === activeFilter)

  const handleBuyAgain = (orderItems: { name: string; price: number; image: string }[]) => {
    orderItems.forEach(item => {
      const product = allProducts.find(p => p.name === item.name)
      if (product) {
        addToCart(product)
      }
    })
    showToast("Items added to cart!", "success")
  }

  const handleDownloadHistory = () => {
    const csvContent = [
      "Order ID,Date,Status,Total",
      ...orders.map(o => `${,${,${,?${`)
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "nexashop_orders.csv"
    a.click()
    URL.revokeObjectURL(url)
    showToast("Order history downloaded!", "success")
  }

  return (
    <PageLayout activeItem="My Orders">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
            <p className="text-sm text-muted-foreground">{orders.length} orders placed</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleDownloadHistory}>
          <Download className="h-4 w-4" />
          Download History
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        {filterOptions.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className="flex-shrink-0"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Order Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/30 border-b border-border">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="font-medium text-foreground">{order.id}</p>
                </div>
                <div className="hidden sm:block h-8 w-px bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground">Order Date</p>
                  <p className="font-medium text-foreground">{order.date}</p>
                </div>
                <div className="hidden sm:block h-8 w-px bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-medium text-foreground">${</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${`}>
                {order.status}
              </span>
            </div>

            {/* Order Items */}
            <div className="p-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-3 border-b border-border last:border-0 last:pb-0 first:pt-0">
                  <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${)` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-foreground">${</p>
                </div>
              ))}
            </div>

            {/* Order Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-muted/30 border-t border-border">
              <div className="flex items-center gap-2">
                {order.status === "Delivered" && (
                  <>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Star className="h-4 w-4" />
                      Write Review
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleBuyAgain(order.items)}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Buy Again
                    </Button>
                  </>
                )}
                {(order.status === "Out for Delivery" || order.status === "Shipped" || order.status === "Processing") && (
                  <Link href="/track-order">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Package className="h-4 w-4" />
                      Track Package
                    </Button>
                  </Link>
                )}
              </div>
              <Link href={`/track-order`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">No orders found</p>
            <p className="text-muted-foreground mb-4">
              {activeFilter === "All Orders" ? "You haven't placed any orders yet." : "No orders match the selected filter."}
            </p>
            {activeFilter === "All Orders" && (
              <Link href="/"><Button>Start Shopping</Button></Link>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
