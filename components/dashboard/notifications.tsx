"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Package, ShoppingCart, Star, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const initialNotifications = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-006 from Alex Turner",
    time: "5 min ago",
    icon: ShoppingCart,
    color: "text-success",
    bgColor: "bg-success/10",
    unread: true,
  },
  {
    id: 2,
    type: "stock",
    title: "Low Stock Alert",
    message: "Wireless Mouse - Only 5 left",
    time: "1 hour ago",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    unread: true,
  },
  {
    id: 3,
    type: "review",
    title: "New Review",
    message: "5-star review on Smart Watch Pro",
    time: "2 hours ago",
    icon: Star,
    color: "text-primary",
    bgColor: "bg-primary/10",
    unread: true,
  },
  {
    id: 4,
    type: "shipment",
    title: "Shipment Delivered",
    message: "Order #ORD-003 has been delivered",
    time: "3 hours ago",
    icon: Package,
    color: "text-info",
    bgColor: "bg-info/10",
    unread: true,
  },
]

export function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter(n => n.unread).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const markOneRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="pro-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 relative">
            <Bell className="w-5 h-5 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Stay updated with alerts</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Mark all read
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {notifications.map((notification, index) => {
          const Icon = notification.icon
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.01 }}
              onClick={() => markOneRead(notification.id)}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg hover:bg-secondary transition-all cursor-pointer",
                !notification.unread && "opacity-60"
              )}
            >
              <div className={cn("p-2 rounded-lg flex-shrink-0", notification.bgColor)}>
                <Icon className={cn("w-4 h-4", notification.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{notification.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{notification.message}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{notification.time}</p>
              </div>
              {notification.unread && (
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
