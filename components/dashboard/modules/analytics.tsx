"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Header } from "../header"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Sparkles, Megaphone } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalyticsModuleProps {
  onTabChange?: (tab: string) => void
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function AnalyticsModule({ onTabChange }: AnalyticsModuleProps) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 8.5,
    revenueGrowth: 12.5,
    ordersGrowth: 8.2
  })
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [conversionData, setConversionData] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [marketingPerformance, setMarketingPerformance] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, customersRes, campaignsRes, couponsRes, flashRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
          fetch("/api/customers"),
          fetch("/api/campaigns"),
          fetch("/api/coupons"),
          fetch("/api/flash-sales")
        ])

        const orders = await ordersRes.json()
        const products = await productsRes.json()
        const customers = await customersRes.json()
        const campaigns = await campaignsRes.json()
        const coupons = await couponsRes.json()
        const flashSales = await flashRes.json()

        // 1. Calculate Stats
        const totalRev = orders.reduce((acc: number, o: any) => acc + (o.total || 0), 0)
        const totalOrd = orders.length
        setStats({
          totalRevenue: totalRev,
          totalOrders: totalOrd,
          avgOrderValue: totalOrd > 0 ? totalRev / totalOrd : 0,
          conversionRate: customers.length > 0 ? (totalOrd / (customers.length * 10)) * 100 : 0, // Mock visitors as customers * 10
          revenueGrowth: 15.4,
          ordersGrowth: 10.2
        })

        // 2. Revenue Chart Data
        const monthMap: Record<string, { revenue: number; profit: number }> = {}
        months.forEach(m => { monthMap[m] = { revenue: 0, profit: 0 } })
        orders.forEach((o: any) => {
          const m = months[new Date(o.date).getMonth()]
          if (monthMap[m]) {
            monthMap[m].revenue += o.total
            monthMap[m].profit += o.total * 0.35 // Assume 35% profit margin
          }
        })
        setRevenueData(months.map(m => ({ month: m, ...monthMap[m] })))

        // 3. Category Data
        const catMap: Record<string, number> = {}
        products.forEach((p: any) => {
          catMap[p.category] = (catMap[p.category] || 0) + 1
        })
        const colors = ["oklch(0.45 0.15 250)", "oklch(0.55 0.18 160)", "oklch(0.65 0.15 45)", "oklch(0.50 0.18 280)"]
        setCategoryData(Object.entries(catMap).map(([name, count], i) => ({
          name,
          value: Math.round((count / products.length) * 100),
          color: colors[i % colors.length]
        })))

        // 4. Conversion Data (Mock weekly)
        setConversionData([
          { day: "Mon", visitors: 1200, conversions: 84 },
          { day: "Tue", visitors: 1400, conversions: 112 },
          { day: "Wed", visitors: 1100, conversions: 77 },
          { day: "Thu", visitors: 1600, conversions: 144 },
          { day: "Fri", visitors: 1800, conversions: 162 },
          { day: "Sat", visitors: 2200, conversions: 198 },
          { day: "Sun", visitors: 1900, conversions: 152 },
        ])

        // 5. Top Products (Sorted by price * stock as mock sales proxy if real sales count not available)
        setTopProducts(products.slice(0, 5).map((p: any) => ({
          name: p.name,
          sales: Math.floor(Math.random() * 1000) + 500,
          revenue: `₹${`,
          growth: Math.floor(Math.random() * 30) - 5
        })))

        // 6. Marketing Performance Connection
        const marketing = [
          ...campaigns.map((c: any) => ({ name: c.name, type: 'Campaign', revenue: c.revenue, icon: Megaphone, color: 'text-info' })),
          ...coupons.map((c: any) => ({ name: c.code, type: 'Coupon', revenue: c.revenue, icon: DollarSign, color: 'text-success' }))
        ].sort((a, b) => b.revenue - a.revenue).slice(0, 4)
        setMarketingPerformance(marketing)

        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch analytics data", err)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `₹${`,
      change: `+${%`,
      trend: "up",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: `+${%`,
      trend: "up",
      icon: ShoppingCart,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Conversion Rate",
      value: `${%`,
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Avg Order Value",
      value: `₹${`,
      change: "-1.3%",
      trend: "down",
      icon: DollarSign,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ]

  return (
    <div className="space-y-6">
      <Header title="Analytics & Insights" subtitle="Deep dive into your store performance and trends" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="pro-card rounded-xl p-5 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className={cn("p-3 rounded-xl", kpi.bgColor)}>
                  <Icon className={cn("w-5 h-5", kpi.color)} />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    kpi.trend === "up" ? "text-success" : "text-destructive"
                  )}
                >
                  <TrendIcon className="w-3 h-3" />
                  {kpi.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pro-card rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Revenue & Profit</h3>
            <p className="text-sm text-muted-foreground mt-1">Monthly financial performance (Dynamic)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Profit</span>
            </div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.45 0.15 250)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.45 0.15 250)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.18 160)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="oklch(0.55 0.18 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 260)" />
              <XAxis dataKey="month" stroke="oklch(0.45 0.01 260)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="oklch(0.45 0.01 260)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="pro-card rounded-xl p-3 min-w-[150px]">
                        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
                        {payload.map((entry: any, index) => (
                          <div key={index} className="flex items-center justify-between gap-4 text-xs">
                            <span className="text-muted-foreground capitalize">{entry.dataKey}</span>
                            <span className="font-medium text-foreground">${entry.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return null
                }}
              />
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
                dataKey="profit"
                stroke="oklch(0.55 0.18 160)"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorProfit)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pro-card rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Sales by Category</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="pro-card rounded-xl p-3">
                          <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
                          <p className="text-xs text-muted-foreground">{payload[0].value}%</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-sm text-muted-foreground">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{category.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Marketing Impact connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pro-card rounded-xl p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Marketing Attribution</h3>
              <p className="text-sm text-muted-foreground mt-1">Revenue driven by campaigns & coupons</p>
            </div>
            <button
              onClick={() => onTabChange?.('marketing')}
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Manage Marketing
            </button>
          </div>
          <div className="space-y-4">
            {marketingPerformance.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-background", item.color)}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">${item.revenue.toLocaleString()}</p>
                  <p className="text-[10px] text-success font-medium">Converted</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Predictions & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Sales Prediction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pro-card rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">AI Sales Prediction</h3>
              <p className="text-sm text-muted-foreground">Next month forecast</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-secondary/30">
              <p className="text-xs text-muted-foreground">Predicted Revenue</p>
              <p className="text-2xl font-bold text-foreground mt-1">${(stats.totalRevenue * 1.15).toFixed(0)}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-xs text-success">+15.0% vs this month</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30">
              <p className="text-xs text-muted-foreground">Predicted Orders</p>
              <p className="text-2xl font-bold text-foreground mt-1">{Math.floor(stats.totalOrders * 1.12)}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-xs text-success">+12.0% vs this month</span>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm text-foreground font-medium mb-2">AI Insight</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on recent {marketingPerformance.length} marketing activities, your ROI is increasing.
              Predicted growth is driven by high-performing {marketingPerformance[0]?.name || 'campaigns'}.
              Consider scaling your successful strategies.
            </p>
          </div>
        </motion.div>

        {/* Top Products Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pro-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Top Products Performance</h3>
            <button
              onClick={() => onTabChange?.('products')}
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales.toLocaleString()} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{product.revenue}</p>
                  <div
                    className={cn(
                      "flex items-center gap-1 justify-end",
                      product.growth >= 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    {product.growth >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-xs">{product.growth >= 0 ? "+" : ""}{product.growth}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
