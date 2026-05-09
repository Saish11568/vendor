"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Truck,
  RefreshCw,
  FileText,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  X,
  MapPin,
} from "lucide-react"
import { Header } from "../header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusConfig = {
  pending: { label: "Pending", icon: Clock, bg: "bg-warning/10", text: "text-warning" },
  processing: { label: "Processing", icon: RefreshCw, bg: "bg-info/10", text: "text-info" },
  shipped: { label: "Shipped", icon: Truck, bg: "bg-primary/10", text: "text-primary" },
  delivered: { label: "Delivered", icon: CheckCircle, bg: "bg-success/10", text: "text-success" },
  cancelled: { label: "Cancelled", icon: XCircle, bg: "bg-destructive/10", text: "text-destructive" },
}

const paymentConfig = {
  paid: { label: "Paid", bg: "bg-success/10", text: "text-success" },
  pending: { label: "Pending", bg: "bg-warning/10", text: "text-warning" },
  refunded: { label: "Refunded", bg: "bg-muted", text: "text-muted-foreground" },
}

export function OrdersModule() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
  }, [])

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    const matchesPayment = paymentFilter === "all" || o.paymentStatus === paymentFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
        o.id.toLowerCase().includes(searchLower) ||
        o.customer.name.toLowerCase().includes(searchLower) ||
        o.customer.email.toLowerCase().includes(searchLower);
    return matchesStatus && matchesPayment && matchesSearch;
  });

  const handleExport = () => {
    const csvContent = [
      ["Order ID", "Date", "Customer Name", "Customer Email", "Items Count", "Total", "Status", "Payment Status"].join(","),
      ...filteredOrders.map(o => [
        o.id, 
        o.date, 
        `"${"`, 
        o.customer.email, 
        o.items?.length || 0, 
        o.total, 
        o.status, 
        o.paymentStatus
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      <Header title="Order Management" subtitle="Track and manage customer orders" />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "All Orders", value: orders.length.toString(), status: "all", color: "text-foreground" },
          { label: "Pending", value: orders.filter(o => o.status === "pending").length.toString(), status: "pending", color: "text-warning" },
          { label: "Processing", value: orders.filter(o => o.status === "processing").length.toString(), status: "processing", color: "text-info" },
          { label: "Shipped", value: orders.filter(o => o.status === "shipped").length.toString(), status: "shipped", color: "text-primary" },
          { label: "Delivered", value: orders.filter(o => o.status === "delivered").length.toString(), status: "delivered", color: "text-success" },
        ].map((stat) => (
          <motion.button
            key={stat.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setFilterStatus(stat.status)}
            className={cn(
              "pro-card rounded-xl p-4 text-left transition-all",
              filterStatus === stat.status && "ring-2 ring-primary"
            )}
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
          </motion.button>
        ))}
      </div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pro-card rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer name, email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 rounded-xl border border-border bg-background hover:bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
            >
              <option value="all">Payment: All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <Button variant="outline" className="gap-2 rounded-xl" onClick={handleExport}>
            <FileText className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pro-card rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Items
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Payment
                </th>
                <th className="text-right py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-foreground">{order.id}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                          {order.customer.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{order.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-foreground">
                        ${order.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          statusConfig[order.status as keyof typeof statusConfig].bg,
                          statusConfig[order.status as keyof typeof statusConfig].text
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[order.status as keyof typeof statusConfig].label}
                      </span>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <span
                        className={cn(
                          "inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                          paymentConfig[order.paymentStatus as keyof typeof paymentConfig].bg,
                          paymentConfig[order.paymentStatus as keyof typeof paymentConfig].text
                        )}
                      >
                        {paymentConfig[order.paymentStatus as keyof typeof paymentConfig].label}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="pro-card rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedOrder.id}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{selectedOrder.date}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Customer Info */}
              <div className="p-4 rounded-xl bg-secondary/30 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                    {selectedOrder.customer.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">{selectedOrder.address}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                <h3 className="text-sm font-medium text-foreground">Order Items</h3>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-secondary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 mb-6">
                <span className="font-medium text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">${selectedOrder.total.toFixed(2)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex-1 gap-2 rounded-xl">
                  <FileText className="w-4 h-4" />
                  Invoice
                </Button>
                <Button className="flex-1 gap-2 rounded-xl">
                  <Truck className="w-4 h-4" />
                  Update Status
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
