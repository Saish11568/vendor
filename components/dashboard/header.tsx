"use client"

import { useState } from "react"
import { Bell, Search, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New order received: #ORD-005", time: "2m ago", unread: true },
    { id: 2, text: "Stock running low on Wireless Mouse", time: "1h ago", unread: true }
  ])

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between pb-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery) {
                alert(`Searching global catalog for: ${`)
              }
            }}
            placeholder="Search anything..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg glass-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        <div className="relative">
          <button 
            className="relative p-2.5 rounded-lg glass-button hover:bg-secondary/50 transition-colors"
            onClick={() => {
              setShowNotifications(!showNotifications)
              setNotifications(notifications.map(n => ({...n, unread: false})))
            }}
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />}
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-lg z-50 py-2">
              <div className="px-4 py-2 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {notifications.length > 0 && (
                  <button onClick={() => setNotifications([])} className="text-xs text-primary hover:text-primary/80">Clear All</button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} className="px-4 py-3 hover:bg-secondary/50 cursor-pointer border-b border-border last:border-0 transition-colors">
                    <p className="text-sm text-foreground">{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                )) : (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <Button className="gap-2 rounded-lg" onClick={() => alert("Quick Add Product trigger!")}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
        </Button>
      </div>
    </motion.header>
  )
}
