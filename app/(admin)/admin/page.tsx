"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  CircleDollarSign,
  Command,
  Compass,
  Eye,
  Gauge,
  Globe2,
  Layers3,
  LockKeyhole,
  Megaphone,
  PackageSearch,
  Radar,
  Search,
  ShieldAlert,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  WalletCards,
  Zap,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "overview", label: "Overview", icon: Command },
  { id: "vendors", label: "Vendors", icon: Store },
  { id: "customers", label: "Customers", icon: Users },
  { id: "ai", label: "AI Monitor", icon: Brain },
  { id: "finance", label: "Finance", icon: WalletCards },
]

const flowData = [
  { time: "08:00", revenue: 38, orders: 260, users: 1.8 },
  { time: "10:00", revenue: 51, orders: 410, users: 2.4 },
  { time: "12:00", revenue: 72, orders: 640, users: 3.1 },
  { time: "14:00", revenue: 96, orders: 880, users: 3.8 },
  { time: "16:00", revenue: 118, orders: 1120, users: 4.6 },
  { time: "18:00", revenue: 142, orders: 1360, users: 5.2 },
  { time: "20:00", revenue: 163, orders: 1540, users: 5.8 },
]

const vendorHeat = [
  { name: "Apple Store", score: 97, sales: 88, trust: 99, risk: "Low" },
  { name: "Urban Threads", score: 89, sales: 76, trust: 94, risk: "Low" },
  { name: "Nova Gadgets", score: 72, sales: 61, trust: 81, risk: "Watch" },
  { name: "QuickKart Deals", score: 38, sales: 29, trust: 42, risk: "High" },
]

const customerSegments = [
  { name: "Loyalists", value: 38, color: "#38bdf8" },
  { name: "Deal Seekers", value: 27, color: "#a78bfa" },
  { name: "New Buyers", value: 21, color: "#34d399" },
  { name: "At Risk", value: 14, color: "#fb7185" },
]

const aiSignals = [
  { title: "Fraud ring pattern", detail: "12 accounts share device and payout fingerprints", severity: "Critical", icon: ShieldAlert },
  { title: "Vendor surge detected", detail: "Urban Threads is trending 31% above baseline", severity: "Opportunity", icon: TrendingUp },
  { title: "Inventory pressure", detail: "Top electronics SKUs may stock out in 36 hours", severity: "Warning", icon: PackageSearch },
  { title: "Conversion insight", detail: "Free-return badge could lift Home category by 8.4%", severity: "Insight", icon: Sparkles },
]

const financeStreams = [
  { stream: "GMV", value: 71, fill: "#38bdf8" },
  { stream: "Commission", value: 18, fill: "#a78bfa" },
  { stream: "Ads", value: 7, fill: "#34d399" },
  { stream: "Services", value: 4, fill: "#fbbf24" },
]

function AdminTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="admin-panel rounded-lg p-3 text-xs">
      <p className="mb-2 font-semibold text-slate-950">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey || entry.name} className="flex items-center justify-between gap-6 text-slate-600">
          <span className="capitalize">{entry.name || entry.dataKey}</span>
          <span className="font-semibold text-slate-950">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function FloatingDock({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/85 p-2 shadow-2xl shadow-sky-200/50 backdrop-blur-2xl"
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const selected = active === item.id
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "group relative flex h-12 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition",
              selected ? "bg-sky-500 text-white" : "text-slate-500 hover:bg-sky-50 hover:text-slate-950"
            )}
            aria-label={item.label}
          >
            <Icon className="h-5 w-5" />
            <span className={cn("hidden sm:inline", !selected && "sr-only")}>{item.label}</span>
            {selected && <motion.span layoutId="dock-glow" className="absolute inset-0 -z-10 rounded-xl shadow-[0_0_34px_rgba(56,189,248,0.28)]" />}
          </button>
        )
      })}
    </motion.nav>
  )
}

function MetricOrb({ label, value, icon: Icon, className }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      className={cn("admin-panel absolute rounded-2xl p-4", className)}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-sky-400/15 p-2 text-sky-200">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-950">{value}</p>
        </div>
      </div>
    </motion.div>
  )
}

function MarketplaceCore() {
  const nodes = [
    ["Vendors", "top-[16%] left-[13%]", "bg-sky-400"],
    ["Orders", "top-[26%] right-[12%]", "bg-violet-400"],
    ["Customers", "bottom-[18%] left-[18%]", "bg-emerald-400"],
    ["Risk", "bottom-[22%] right-[18%]", "bg-rose-400"],
    ["Payouts", "top-[50%] left-[7%]", "bg-amber-300"],
    ["Inventory", "top-[48%] right-[6%]", "bg-cyan-300"],
  ]

  return (
    <section className="admin-panel relative min-h-[520px] overflow-hidden rounded-3xl p-5 sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.24),transparent_38%)]" />
      <div className="absolute inset-10 rounded-full border border-sky-300/10" />
      <div className="absolute inset-20 rounded-full border border-violet-300/10" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-sky-300/25"
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">AI Marketplace Control Center</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold text-slate-950 sm:text-5xl">Live operating picture for the entire marketplace</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
            Revenue, trust, fulfillment, customer behavior, and risk signals are fused into one visual command surface.
          </p>
        </div>
        <div className="hidden rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-emerald-100 sm:block">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Activity className="h-4 w-4" />
            Live Sync
          </div>
          <p className="mt-1 text-xs text-emerald-100/70">8,421 events/min</p>
        </div>
      </div>

      <div className="absolute left-1/2 top-[55%] z-10 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-sky-200/70 bg-white/80 shadow-[0_0_90px_rgba(14,165,233,0.26)] backdrop-blur-xl">
        <div className="text-center">
          <Radar className="mx-auto h-8 w-8 text-sky-200" />
          <p className="mt-2 text-xs text-slate-500">Marketplace Pulse</p>
          <p className="text-2xl font-bold text-slate-950">94.8</p>
        </div>
      </div>

      {nodes.map(([label, position, color]) => (
        <motion.div
          key={label}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: label.length / 10 }}
          className={cn("absolute z-10 rounded-2xl border border-slate-200/70 bg-white/75 px-4 py-3 shadow-lg shadow-slate-200/60 backdrop-blur-xl", position)}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <span className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]", color)} />
            {label}
          </div>
        </motion.div>
      ))}

      <MetricOrb label="Today Revenue" value="₹84.2L" icon={CircleDollarSign} className="bottom-5 left-5 hidden sm:block" />
      <MetricOrb label="Open Risk" value="17 cases" icon={ShieldAlert} className="bottom-5 right-5 hidden sm:block" />
      <MetricOrb label="Active Users" value="58.4K" icon={Users} className="left-1/2 top-5 hidden -translate-x-1/2 sm:block" />
    </section>
  )
}

function IntelligenceStrip() {
  const cards = [
    { label: "Platform Health", value: "99.98%", detail: "All regions operational", icon: Gauge, tone: "text-emerald-200" },
    { label: "Order Flow", value: "1,540/hr", detail: "Peak traffic window", icon: Zap, tone: "text-sky-200" },
    { label: "Vendor Activity", value: "214 live", detail: "31 onboarding", icon: Store, tone: "text-violet-200" },
    { label: "Risk Pressure", value: "Medium", detail: "3 escalations", icon: AlertTriangle, tone: "text-amber-200" },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <motion.div key={card.label} whileHover={{ y: -5 }} className="admin-panel rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <Icon className={cn("h-5 w-5", card.tone)} />
              <span className="rounded-full bg-sky-50 px-2 py-1 text-xs text-slate-500">real-time</span>
            </div>
            <p className="mt-5 text-sm text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{card.value}</p>
            <p className="mt-2 text-xs text-slate-500">{card.detail}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

function OverviewPanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <div className="admin-panel rounded-3xl p-6 xl:col-span-3">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">Live Revenue & Order Flow</h3>
            <p className="text-sm text-slate-500">Animated performance stream across the marketplace day</p>
          </div>
          <BarChart3 className="h-5 w-5 text-sky-200" />
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={flowData}>
              <defs>
                <linearGradient id="flowRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.48} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ffffff14" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<AdminTip />} />
              <Area dataKey="revenue" stroke="#38bdf8" fill="url(#flowRevenue)" strokeWidth={3} />
              <Line dataKey="orders" stroke="#a78bfa" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-panel rounded-3xl p-6 xl:col-span-2">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-violet-400/10 p-3">
            <Sparkles className="h-5 w-5 text-violet-200" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">AI Insights</h3>
            <p className="text-sm text-slate-500">Prioritized operating recommendations</p>
          </div>
        </div>
        <div className="space-y-3">
          {aiSignals.slice(1).map((signal) => {
            const Icon = signal.icon
            return (
              <div key={signal.title} className="admin-panel-soft rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 text-sky-200" />
                  <div>
                    <p className="font-semibold text-slate-950">{signal.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{signal.detail}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function VendorsPanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <div className="admin-panel rounded-3xl p-6 xl:col-span-3">
        <h3 className="text-xl font-semibold text-slate-950">Vendor Health Matrix</h3>
        <p className="mt-1 text-sm text-slate-500">Trust, sales velocity, and operational risk shown as a live ranking layer</p>
        <div className="mt-6 space-y-4">
          {vendorHeat.map((vendor) => (
            <motion.div key={vendor.name} whileHover={{ x: 6 }} className="admin-panel-soft rounded-2xl p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{vendor.name}</p>
                  <p className="text-sm text-slate-500">Trust {vendor.trust}% · Sales velocity {vendor.sales}%</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", vendor.risk === "High" ? "bg-rose-400/15 text-rose-100" : vendor.risk === "Watch" ? "bg-amber-400/15 text-amber-100" : "bg-emerald-400/15 text-emerald-100")}>{vendor.risk}</span>
                  <span className="text-2xl font-bold text-slate-950">{vendor.score}</span>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-300" style={{ width: `${vendor.score}%` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="admin-panel rounded-3xl p-6 xl:col-span-2">
        <h3 className="text-xl font-semibold text-slate-950">Live Sales Monitoring</h3>
        <div className="mt-6 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vendorHeat}>
              <CartesianGrid stroke="#ffffff14" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<AdminTip />} />
              <Bar dataKey="sales" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              <Bar dataKey="trust" fill="#34d399" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function CustomersPanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <div className="admin-panel rounded-3xl p-6 xl:col-span-2">
        <h3 className="text-xl font-semibold text-slate-950">Customer Intelligence</h3>
        <p className="mt-1 text-sm text-slate-500">Segment distribution and engagement quality</p>
        <div className="mt-6 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={customerSegments} dataKey="value" innerRadius={70} outerRadius={112} paddingAngle={4}>
                {customerSegments.map((item) => <Cell key={item.name} fill={item.color} />)}
              </Pie>
              <Tooltip content={<AdminTip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {customerSegments.map((segment) => (
            <div key={segment.name} className="flex items-center gap-2 text-xs text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
              {segment.name} {segment.value}%
            </div>
          ))}
        </div>
      </div>

      <div className="admin-panel rounded-3xl p-6 xl:col-span-3">
        <h3 className="text-xl font-semibold text-slate-950">Purchase Behavior Timeline</h3>
        <p className="mt-1 text-sm text-slate-500">Returning customer lift and engagement movement</p>
        <div className="mt-6 h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={flowData}>
              <CartesianGrid stroke="#ffffff14" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<AdminTip />} />
              <Line dataKey="users" stroke="#34d399" strokeWidth={3} dot={false} />
              <Line dataKey="orders" stroke="#38bdf8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function AiPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {aiSignals.map((signal, index) => {
        const Icon = signal.icon
        return (
          <motion.div
            key={signal.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="admin-panel rounded-3xl p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-sky-400/10 p-3">
                  <Icon className="h-6 w-6 text-sky-200" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-950">{signal.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{signal.detail}</p>
                </div>
              </div>
              <span className="rounded-full border border-slate-200 bg-white/75 px-3 py-1 text-xs font-semibold text-slate-600">{signal.severity}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function FinancePanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <div className="admin-panel rounded-3xl p-6 xl:col-span-3">
        <h3 className="text-xl font-semibold text-slate-950">Financial Center</h3>
        <p className="mt-1 text-sm text-slate-500">Revenue streams, commissions, payouts, and profit visualization</p>
        <div className="mt-6 h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={flowData}>
              <defs>
                <linearGradient id="profitFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ffffff14" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<AdminTip />} />
              <Area dataKey="revenue" stroke="#34d399" fill="url(#profitFlow)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="admin-panel rounded-3xl p-6 xl:col-span-2">
        <h3 className="text-xl font-semibold text-slate-950">Revenue Streams</h3>
        <div className="mt-6 space-y-4">
          {financeStreams.map((stream) => (
            <div key={stream.stream}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">{stream.stream}</span>
                <span className="font-semibold text-slate-950">{stream.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full" style={{ width: `${stream.value}%`, backgroundColor: stream.fill }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const panels: Record<string, React.ComponentType> = {
  overview: OverviewPanel,
  vendors: VendorsPanel,
  customers: CustomersPanel,
  ai: AiPanel,
  finance: FinancePanel,
}

export default function AdminDashboard() {
  const [active, setActive] = useState("overview")
  const ActivePanel = panels[active] || OverviewPanel
  const activeLabel = useMemo(() => navItems.find((item) => item.id === active)?.label || "Overview", [active])

  return (
    <div className="admin-shell min-h-screen overflow-hidden pb-28">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-sky-300/35 blur-3xl" />
        <div className="absolute right-[8%] top-[18%] h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute bottom-[5%] left-[35%] h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl" />
      </div>

      <FloatingDock active={active} onChange={setActive} />

      <header className="relative z-10 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/15 shadow-[0_0_36px_rgba(56,189,248,0.22)]">
              <Compass className="h-6 w-6 text-sky-100" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200">NexaCommand</p>
              <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">AI Marketplace Control Center</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input className="admin-input h-11 w-full rounded-2xl pl-10 pr-4 text-sm outline-none sm:w-80" placeholder="Ask about vendors, orders, fraud, revenue..." />
            </div>
            <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-sky-200 bg-white/80 px-4 text-sm font-semibold text-slate-800 shadow-lg shadow-sky-100/70 transition hover:bg-sky-50">
              <Eye className="h-4 w-4" />
              Live Mode
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <MarketplaceCore />
        <IntelligenceStrip />

        <section className="admin-panel rounded-3xl p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{activeLabel}</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">Adaptive Intelligence Workspace</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-600">
              <Layers3 className="h-4 w-4 text-sky-200" />
              Priority grid optimized by AI
            </div>
          </div>
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.98, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <ActivePanel />
          </motion.div>
        </section>
      </main>
    </div>
  )
}
