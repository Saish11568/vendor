"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Percent,
  Zap,
  Tag,
  Megaphone,
  Mail,
  Calendar,
  Copy,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  TrendingUp,
} from "lucide-react"
import { Header } from "../header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusConfig = {
  active: { label: "Active", bg: "bg-success/10", text: "text-success" },
  scheduled: { label: "Scheduled", bg: "bg-info/10", text: "text-info" },
  expired: { label: "Expired", bg: "bg-muted", text: "text-muted-foreground" },
  completed: { label: "Completed", bg: "bg-primary/10", text: "text-primary" },
}

interface MarketingModuleProps {
  onTabChange?: (tab: string) => void
}

export function MarketingModule({ onTabChange }: MarketingModuleProps) {
  const [activeTab, setActiveTab] = useState<"coupons" | "flash" | "campaigns">("coupons")
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const [coupons, setCoupons] = useState<any[]>([])
  const [flashSales, setFlashSales] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState<any>({
    code: "",
    discount: "",
    type: "percentage",
    usageLimit: 100,
    expiresAt: "",
    name: "",
    products: 0,
    startDate: "",
    endDate: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [couponsRes, flashRes, campaignsRes] = await Promise.all([
        fetch("/api/coupons"),
        fetch("/api/flash-sales"),
        fetch("/api/campaigns")
      ])
      setCoupons(await couponsRes.json())
      setFlashSales(await flashRes.json())
      setCampaigns(await campaignsRes.json())
    } catch (err) {
      console.error("Marketing fetch failed", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    const endpoint = activeTab === "coupons" ? "/api/coupons" : 
                     activeTab === "flash" ? "/api/flash-sales" : "/api/campaigns"
    
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setShowCreateModal(false)
        fetchData()
        setFormData({ code: "", discount: "", type: "percentage", usageLimit: 100, expiresAt: "", name: "", products: 0, startDate: "", endDate: "" })
      }
    } catch (err) {
      console.error("Creation failed", err)
    }
  }

  const handleDelete = async (id: number) => {
    const endpoint = activeTab === "coupons" ? `/api/coupons?id=${` : 
                     activeTab === "flash" ? `/api/flash-sales?id=${` : `/api/campaigns?id=${`
    
    if (!confirm("Are you sure you want to delete this?")) return

    try {
      const res = await fetch(endpoint, { method: "DELETE" })
      if (res.ok) fetchData()
    } catch (err) {
      console.error("Deletion failed", err)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert(`Copied ${ to clipboard!`)
  }

  const totalReach = campaigns.reduce((acc, c) => acc + (c.sent || 0), 0)

  return (
    <div className="space-y-6">
      <Header title="Marketing Tools" subtitle="Manage coupons, promotions and marketing campaigns" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Coupons", value: coupons.filter(c => c.status === 'active').length, icon: Tag, color: "text-primary" },
          { label: "Flash Sales", value: flashSales.length, icon: Zap, color: "text-warning" },
          { label: "Active Campaigns", value: campaigns.filter(c => c.status === 'active').length, icon: Megaphone, color: "text-info" },
          { label: "Total Reach", value: totalReach >= 1000 ? `${K` : totalReach, icon: Mail, color: "text-success" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pro-card rounded-xl p-4 flex items-center gap-3"
          >
            <div className={cn("p-2 rounded-lg bg-secondary/50", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: "coupons", label: "Coupons", icon: Tag },
            { id: "flash", label: "Flash Sales", icon: Zap },
            { id: "campaigns", label: "Campaigns", icon: Megaphone },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onTabChange?.('analytics')}
            className="text-sm flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            View Analytics
          </button>
          <Button className="gap-2 rounded-xl" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            Create New
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === "coupons" && (
            <motion.div
              key="coupons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="pro-card rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Percent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground">{coupon.code}</span>
                          <button 
                            onClick={() => copyToClipboard(coupon.code)}
                            className="p-1 rounded hover:bg-secondary/50 transition-colors"
                          >
                            <Copy className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">{coupon.discount} off</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        statusConfig[coupon.status as keyof typeof statusConfig]?.bg,
                        statusConfig[coupon.status as keyof typeof statusConfig]?.text
                      )}
                    >
                      {statusConfig[coupon.status as keyof typeof statusConfig]?.label || 'Active'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Usage: {coupon.used}/{coupon.usageLimit}</span>
                      <span>{Math.round((coupon.used / coupon.usageLimit) * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Expires: {coupon.expiresAt}
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleDelete(coupon.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "flash" && (
            <motion.div
              key="flash"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {flashSales.map((sale, index) => (
                <motion.div
                  key={sale.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="pro-card rounded-xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-warning/10">
                        <Zap className="w-6 h-6 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{sale.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {sale.discount} on {sale.products} products
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium",
                          statusConfig[sale.status as keyof typeof statusConfig]?.bg,
                          statusConfig[sale.status as keyof typeof statusConfig]?.text
                        )}
                      >
                        {statusConfig[sale.status as keyof typeof statusConfig]?.label || 'Active'}
                      </span>
                      <button 
                        onClick={() => handleDelete(sale.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {sale.startDate} - {sale.endDate}
                    </div>
                    <div className="flex items-center gap-4">
                      <span>Orders: <strong>{sale.orders || 0}</strong></span>
                      <span>Revenue: <strong>${(sale.revenue || 0).toLocaleString()}</strong></span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "campaigns" && (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="pro-card rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-xl",
                        campaign.type === "email" ? "bg-info/10" : "bg-success/10"
                      )}>
                        <Mail className={cn(
                          "w-6 h-6",
                          campaign.type === "email" ? "text-info" : "text-success"
                        )} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{campaign.type} Campaign</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium",
                          statusConfig[campaign.status as keyof typeof statusConfig]?.bg,
                          statusConfig[campaign.status as keyof typeof statusConfig]?.text
                        )}
                      >
                        {statusConfig[campaign.status as keyof typeof statusConfig]?.label || 'Active'}
                      </span>
                      <button 
                        onClick={() => handleDelete(campaign.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 rounded-xl bg-secondary/30 text-center">
                      <p className="text-lg font-bold text-foreground">{(campaign.sent || 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Sent</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/30 text-center">
                      <p className="text-lg font-bold text-foreground">{(campaign.opened || 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Opened</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/30 text-center">
                      <p className="text-lg font-bold text-foreground">{(campaign.clicked || 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Clicked</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/30 text-center">
                      <p className="text-lg font-bold text-foreground">${(campaign.revenue || 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="pro-card rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  Create {activeTab === 'coupons' ? 'Coupon' : activeTab === 'flash' ? 'Flash Sale' : 'Campaign'}
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                {activeTab === 'coupons' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground">Coupon Code</label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                        placeholder="e.g., SUMMER25"
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono uppercase"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Discount Value</label>
                        <input
                          type="text"
                          value={formData.discount}
                          onChange={(e) => setFormData({...formData, discount: e.target.value})}
                          placeholder="25% or ₹50"
                          className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Expiry Date</label>
                        <input
                          type="date"
                          onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                          className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'flash' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground">Sale Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Weekend Flash Sale"
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Discount</label>
                        <input
                          type="text"
                          value={formData.discount}
                          onChange={(e) => setFormData({...formData, discount: e.target.value})}
                          placeholder="30% off"
                          className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Product Count</label>
                        <input
                          type="number"
                          onChange={(e) => setFormData({...formData, products: Number(e.target.value)})}
                          className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'campaigns' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground">Campaign Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="New Year Sale"
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Campaign Type</label>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 rounded-xl" onClick={handleCreate}>Create</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
