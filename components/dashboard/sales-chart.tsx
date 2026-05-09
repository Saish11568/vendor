"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const fallbackData = [
  { month: "Jan", revenue: 4000, orders: 240 },
  { month: "Feb", revenue: 3000, orders: 198 },
  { month: "Mar", revenue: 5000, orders: 300 },
  { month: "Apr", revenue: 4500, orders: 278 },
  { month: "May", revenue: 6000, orders: 389 },
  { month: "Jun", revenue: 5500, orders: 349 },
  { month: "Jul", revenue: 7000, orders: 430 },
  { month: "Aug", revenue: 6500, orders: 398 },
  { month: "Sep", revenue: 8000, orders: 480 },
  { month: "Oct", revenue: 7500, orders: 456 },
  { month: "Nov", revenue: 9000, orders: 520 },
  { month: "Dec", revenue: 8500, orders: 498 },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="pro-card rounded-lg p-3 min-w-[150px]">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs">
            <span className="text-muted-foreground capitalize">{entry.dataKey}</span>
            <span className="font-medium text-foreground">
              {entry.dataKey === "revenue" ? `₹${entry.value.toLocaleString()}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function SalesChart() {
  const [chartData, setChartData] = useState(fallbackData)

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then((orders: any[]) => {
        if (!orders || orders.length === 0) return

        // Build month-wise aggregation from real order data
        const monthMap: Record<string, { revenue: number; orders: number }> = {}
        months.forEach(m => { monthMap[m] = { revenue: 0, orders: 0 } })

        orders.forEach(order => {
          if (!order.date) return
          const dateObj = new Date(order.date)
          const monthIndex = dateObj.getMonth()
          const monthName = months[monthIndex]
          if (monthMap[monthName]) {
            monthMap[monthName].revenue += order.total || 0
            monthMap[monthName].orders += 1
          }
        })

        // Check if we have any real data
        const hasRealData = Object.values(monthMap).some(v => v.revenue > 0)

        if (hasRealData) {
          // Merge: use real data for months that have it, keep fallback for months without
          const merged = months.map((m, i) => ({
            month: m,
            revenue: monthMap[m].revenue > 0 ? monthMap[m].revenue : fallbackData[i].revenue,
            orders: monthMap[m].orders > 0 ? monthMap[m].orders : fallbackData[i].orders,
          }))
          setChartData(merged)
        }
      })
      .catch(() => {
        // Keep fallback data on error
      })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="pro-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Sales Overview</h3>
          <p className="text-sm text-muted-foreground mt-1">Monthly revenue and orders</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-info" />
            <span className="text-xs text-muted-foreground">Orders</span>
          </div>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.45 0.15 250)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="oklch(0.45 0.15 250)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.55 0.18 160)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="oklch(0.55 0.18 160)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 260)" />
            <XAxis
              dataKey="month"
              stroke="oklch(0.45 0.01 260)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="oklch(0.45 0.01 260)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="oklch(0.45 0.15 250)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="oklch(0.55 0.18 160)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOrders)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
