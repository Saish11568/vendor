"use client"

import { motion } from "framer-motion"
import { MoreHorizontal, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"

const statusStyles: Record<string, { bg: string; text: string }> = {
  delivered: { bg: "bg-success/10", text: "text-success" },
  processing: { bg: "bg-info/10", text: "text-info" },
  shipped: { bg: "bg-primary/10", text: "text-primary" },
  pending: { bg: "bg-warning/10", text: "text-warning" },
}

export function RecentOrders({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/orders").then(res => res.json()).then(data => setOrders(data.slice(0, 5)))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="pro-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
          <p className="text-sm text-muted-foreground mt-1">Latest customer orders</p>
        </div>
        <button
          onClick={() => onTabChange?.("orders")}
          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Order ID
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                Product
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="border-b border-border hover:bg-secondary/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-foreground">{order.id}</span>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{order.customer?.name || order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                    {order.items ? order.items[0]?.name : order.product}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-semibold text-foreground">{order.total ? `₹${order.total.toFixed(2)}` : order.amount}</span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={cn(
                      "inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                      statusStyles[order.status]?.bg,
                      statusStyles[order.status]?.text
                    )}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
