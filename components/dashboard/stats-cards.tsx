"use client"

import { motion } from "framer-motion"
import { DollarSign, ShoppingBag, Clock, TrendingUp, TrendingDown, Package } from "lucide-react"

import { useState, useEffect } from "react"
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function StatsCards() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/orders").then(res => res.json()).then(setOrders)
  }, [])

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === "pending").length
  const productsSold = orders.reduce((acc, o) => acc + (o.items?.length || 1), 0)

  const dynamicStats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toFixed(2)}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBag,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      change: "-3.1%",
      trend: "down",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Products Sold",
      value: productsSold.toString(),
      change: "+18.7%",
      trend: "up",
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {dynamicStats.map((stat) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
        
        return (
          <motion.div
            key={stat.title}
            variants={item}
            whileHover={{ scale: 1.02, translateY: -2 }}
            className="pro-card rounded-xl p-5 cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stat.trend === "up" ? "text-success" : "text-destructive"
              }`}>
                <TrendIcon className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
