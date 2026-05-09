"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Filter,
  MessageSquare,
  Star,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  X,
  Users,
  UserPlus,
  UserCheck,
  Send,
  ExternalLink,
} from "lucide-react"
import { Header } from "../header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusConfig = {
  active: { label: "Active", bg: "bg-success/10", text: "text-success" },
  inactive: { label: "Inactive", bg: "bg-muted", text: "text-muted-foreground" },
  vip: { label: "VIP", bg: "bg-primary/10", text: "text-primary" },
}

export function CustomersModule() {
  const [customers, setCustomers] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<"customers" | "reviews" | "messages">("customers")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [replies, setReplies] = useState<Record<number, string[]>>({})
  const [messages, setMessages] = useState([
    { id: 1, customer: "Sarah Johnson", avatar: "SJ", subject: "Order delivery query", text: "Hi, when will my order #ORD-2024-001 be delivered?", time: "2 hours ago", unread: true },
    { id: 2, customer: "Mike Williams", avatar: "MW", subject: "Product return request", text: "I want to return the Smart Watch Pro. It has a scratch on the screen.", time: "5 hours ago", unread: true },
    { id: 3, customer: "Emily Davis", avatar: "ED", subject: "Bulk order inquiry", text: "Do you offer discounts on bulk orders for the Mechanical Keyboard RGB?", time: "1 day ago", unread: false },
  ])
  const [msgReplyingTo, setMsgReplyingTo] = useState<number | null>(null)
  const [msgReplyText, setMsgReplyText] = useState("")
  const [msgReplies, setMsgReplies] = useState<Record<number, string[]>>({})
  const [showOrdersModal, setShowOrdersModal] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/customers").then((res) => res.json()),
      fetch("/api/reviews").then((res) => res.json())
    ]).then(([customersData, reviewsData]) => {
      if (Array.isArray(customersData)) setCustomers(customersData)
      else setCustomers([])
      
      if (Array.isArray(reviewsData)) setReviews(reviewsData)
      else setReviews([])
      
      setLoading(false)
    })
  }, [])

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || (c.status || "") === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleReviewReply = (reviewId: number) => {
    if (!replyText.trim()) return
    setReplies(prev => ({ ...prev, [reviewId]: [...(prev[reviewId] || []), replyText] }))
    setReplyText("")
    setReplyingTo(null)
  }

  const handleMsgReply = (msgId: number) => {
    if (!msgReplyText.trim()) return
    setMsgReplies(prev => ({ ...prev, [msgId]: [...(prev[msgId] || []), msgReplyText] }))
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, unread: false } : m))
    setMsgReplyText("")
    setMsgReplyingTo(null)
  }

  return (
    <div className="space-y-6">
      <Header title="Customer Management" subtitle="Manage your customers, reviews and support tickets" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: customers.length.toString(), icon: Users, color: "text-primary" },
          { label: "New This Month", value: "0", icon: UserPlus, color: "text-success" },
          { label: "Active Customers", value: customers.filter(c => c.status === "active").length.toString(), icon: UserCheck, color: "text-info" },
          { label: "Avg Rating", value: (customers.reduce((acc, c) => acc + c.rating, 0) / (customers.length || 1)).toFixed(1), icon: Star, color: "text-warning" },
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
      <div className="flex items-center gap-2 border-b border-border pb-2">
        {[
          { id: "customers", label: "Customers" },
          { id: "reviews", label: "Reviews & Ratings" },
          { id: "messages", label: "Messages" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "customers" && (
          <motion.div
            key="customers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Search & Filter */}
            <div className="pro-card rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, location..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-border bg-background hover:bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
            </div>

            {/* Customer List */}
            <div className="pro-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                        Contact
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                        Status
                      </th>
                      <th className="text-right py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr><td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">No customers match your search.</td></tr>
                    ) : filteredCustomers.map((customer, index) => (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-sm font-medium text-primary-foreground">
                              {customer.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{customer.name}</p>
                              <p className="text-xs text-muted-foreground">{customer.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden lg:table-cell">
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                          <p className="text-xs text-muted-foreground">{customer.phone}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-medium text-foreground">{customer.orders}</p>
                          <p className="text-xs text-muted-foreground">{customer.lastOrder}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-semibold text-foreground">{customer.spent}</p>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <span
                            className={cn(
                              "inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                              statusConfig[customer.status as keyof typeof statusConfig].bg,
                              statusConfig[customer.status as keyof typeof statusConfig].text
                            )}
                          >
                            {statusConfig[customer.status as keyof typeof statusConfig].label}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedCustomer(customer)}
                              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                            >
                              <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "reviews" && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="pro-card rounded-xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-sm font-medium text-primary-foreground">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{review.customer}</p>
                      <p className="text-xs text-muted-foreground">{review.product}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < review.rating ? "text-warning fill-warning" : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{review.comment}</p>

                {/* Show existing replies */}
                {replies[review.id]?.map((r, i) => (
                  <div key={i} className="mt-3 ml-6 p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-xs font-medium text-primary mb-1">Your Reply</p>
                    <p className="text-sm text-foreground">{r}</p>
                  </div>
                ))}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                  <Button variant="outline" size="sm" className="rounded-lg" onClick={() => { setReplyingTo(replyingTo === review.id ? null : review.id); setReplyText("") }}>
                    {replyingTo === review.id ? "Cancel" : "Reply"}
                  </Button>
                </div>

                {replyingTo === review.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleReviewReply(review.id)}
                      placeholder="Write your reply..."
                      className="flex-1 px-4 py-2 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      autoFocus
                    />
                    <Button size="sm" className="rounded-xl gap-1" onClick={() => handleReviewReply(review.id)}>
                      <Send className="w-3 h-3" /> Send
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "messages" && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {messages.length === 0 ? (
              <div className="pro-card rounded-xl p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Messages Yet</h3>
                <p className="text-sm text-muted-foreground">Customer messages will appear here</p>
              </div>
            ) : messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn("pro-card rounded-xl p-5", msg.unread && "border-l-4 border-l-primary")}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-sm font-medium text-primary-foreground">
                      {msg.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{msg.customer}</p>
                        {msg.unread && <span className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-xs font-medium text-primary">{msg.subject}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{msg.text}</p>

                {/* Show replies */}
                {msgReplies[msg.id]?.map((r, i) => (
                  <div key={i} className="mt-3 ml-6 p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-xs font-medium text-primary mb-1">You</p>
                    <p className="text-sm text-foreground">{r}</p>
                  </div>
                ))}

                <div className="flex justify-end mt-3 pt-3 border-t border-border">
                  <Button variant="outline" size="sm" className="rounded-lg" onClick={() => { setMsgReplyingTo(msgReplyingTo === msg.id ? null : msg.id); setMsgReplyText("") }}>
                    {msgReplyingTo === msg.id ? "Cancel" : "Reply"}
                  </Button>
                </div>

                {msgReplyingTo === msg.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={msgReplyText}
                      onChange={(e) => setMsgReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleMsgReply(msg.id)}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      autoFocus
                    />
                    <Button size="sm" className="rounded-xl gap-1" onClick={() => handleMsgReply(msg.id)}>
                      <Send className="w-3 h-3" /> Send
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCustomer(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="pro-card rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Customer Details</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-3">
                  {selectedCustomer.avatar}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{selectedCustomer.name}</h3>
                <span
                  className={cn(
                    "inline-flex px-2.5 py-1 rounded-full text-xs font-medium mt-2",
                    statusConfig[selectedCustomer.status as keyof typeof statusConfig].bg,
                    statusConfig[selectedCustomer.status as keyof typeof statusConfig].text
                  )}
                >
                  {statusConfig[selectedCustomer.status as keyof typeof statusConfig].label}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{selectedCustomer.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="text-center p-3 rounded-xl bg-secondary/30">
                  <p className="text-lg font-bold text-foreground">{selectedCustomer.orders}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-secondary/30">
                  <p className="text-lg font-bold text-foreground">{selectedCustomer.spent}</p>
                  <p className="text-xs text-muted-foreground">Spent</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-secondary/30">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="text-lg font-bold text-foreground">{selectedCustomer.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 rounded-xl"
                  onClick={() => window.open(`mailto:${selectedCustomer.email}?subject=Hello from VendorHub&body=Hi ${selectedCustomer.name},`, '_blank')}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
                <Button className="flex-1 gap-2 rounded-xl" onClick={() => setShowOrdersModal(!showOrdersModal)}>
                  <ShoppingBag className="w-4 h-4" />
                  {showOrdersModal ? "Back" : "View Orders"}
                </Button>
              </div>

              {showOrdersModal && (
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Order History</h4>
                  {[
                    { id: "ORD-2024-001", date: "Jan 15, 2024", total: 457, status: "delivered" },
                    { id: "ORD-2024-005", date: "Jan 10, 2024", total: 289, status: "shipped" },
                    { id: "ORD-2024-009", date: "Dec 28, 2023", total: 134, status: "delivered" },
                  ].map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">₹{order.total.toFixed(2)}</p>
                        <span className={cn(
                          "text-xs font-medium",
                          order.status === "delivered" ? "text-success" : "text-primary"
                        )}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
