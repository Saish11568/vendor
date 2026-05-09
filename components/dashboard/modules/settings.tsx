"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Store,
  FileText,
  Bell,
  Shield,
  Camera,
  Save,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
} from "lucide-react"
import { Header } from "../header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "store", label: "Store Profile", icon: Store },
  { id: "tax", label: "GST & Tax", icon: FileText },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
]

export function SettingsModule() {
  const [activeTab, setActiveTab] = useState("store")
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    lowStockAlerts: true,
    reviewNotifications: true,
    promotionalEmails: false,
    smsNotifications: true,
    pushNotifications: true,
  })

  return (
    <div className="space-y-6">
      <Header title="Settings" subtitle="Manage your store preferences and account settings" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 flex-shrink-0"
        >
          <div className="pro-card rounded-xl p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "store" && (
              <motion.div
                key="store"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pro-card rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-6">Store Profile</h3>

                {/* Store Logo */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center text-3xl font-bold text-primary-foreground">
                      VH
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Store Logo</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recommended size: 200x200px
                    </p>
                    <Button variant="outline" size="sm" className="mt-3 rounded-lg">
                      Change Logo
                    </Button>
                  </div>
                </div>

                {/* Store Details */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground">Store Name</label>
                      <input
                        type="text"
                        defaultValue="VendorHub Electronics"
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Store URL</label>
                      <div className="flex mt-1.5">
                        <span className="px-4 py-2.5 rounded-l-xl bg-muted text-sm text-muted-foreground border border-r-0 border-border">
                          marketplace.com/
                        </span>
                        <input
                          type="text"
                          defaultValue="vendorhub-electronics"
                          className="flex-1 px-4 py-2.5 rounded-r-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Store Description</label>
                    <textarea
                      rows={4}
                      defaultValue="Premium electronics and accessories for tech enthusiasts. We offer the best quality products with competitive prices and excellent customer service."
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        Contact Email
                      </label>
                      <input
                        type="email"
                        defaultValue="contact@vendorhub.com"
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      Business Address
                    </label>
                    <input
                      type="text"
                      defaultValue="123 Business Avenue, Suite 100, New York, NY 10001"
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        Country
                      </label>
                      <select className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                        <option value="us">United States</option>
                        <option value="uk">United Kingdom</option>
                        <option value="ca">Canada</option>
                        <option value="au">Australia</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        Timezone
                      </label>
                      <select className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                        <option value="est">Eastern Time (EST)</option>
                        <option value="pst">Pacific Time (PST)</option>
                        <option value="cst">Central Time (CST)</option>
                        <option value="utc">UTC</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8 pt-6 border-t border-border">
                  <Button className="gap-2 rounded-xl">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === "tax" && (
              <motion.div
                key="tax"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pro-card rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-6">GST & Tax Settings</h3>

                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-info/10 border border-info/20">
                    <p className="text-sm text-info">
                      Tax settings are used to calculate applicable taxes on your products. Make sure to keep your tax information up to date.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground">Business Registration Number</label>
                      <input
                        type="text"
                        placeholder="Enter registration number"
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">GST/Tax ID</label>
                      <input
                        type="text"
                        placeholder="Enter GST/Tax ID"
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Tax Rate (%)</label>
                    <input
                      type="number"
                      defaultValue="18"
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                    <div>
                      <p className="font-medium text-foreground">Include Tax in Product Prices</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Tax will be included in the displayed price</p>
                    </div>
                    <button className="relative w-12 h-6 rounded-full bg-primary transition-colors">
                      <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end mt-8 pt-6 border-t border-border">
                  <Button className="gap-2 rounded-xl">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pro-card rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h3>

                <div className="space-y-4">
                  {[
                    { key: "orderNotifications", label: "Order Notifications", desc: "Get notified when you receive new orders" },
                    { key: "lowStockAlerts", label: "Low Stock Alerts", desc: "Receive alerts when products are running low" },
                    { key: "reviewNotifications", label: "Review Notifications", desc: "Get notified about new product reviews" },
                    { key: "promotionalEmails", label: "Promotional Emails", desc: "Receive marketplace updates and promotions" },
                    { key: "smsNotifications", label: "SMS Notifications", desc: "Receive important alerts via SMS" },
                    { key: "pushNotifications", label: "Push Notifications", desc: "Enable browser push notifications" },
                  ].map((setting) => (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/40 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-foreground">{setting.label}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{setting.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            [setting.key]: !prev[setting.key as keyof typeof prev],
                          }))
                        }
                        className={cn(
                          "relative w-12 h-6 rounded-full transition-colors",
                          notificationSettings[setting.key as keyof typeof notificationSettings]
                            ? "bg-primary"
                            : "bg-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                            notificationSettings[setting.key as keyof typeof notificationSettings]
                              ? "right-1"
                              : "left-1"
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-8 pt-6 border-t border-border">
                  <Button className="gap-2 rounded-xl">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pro-card rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-6">Security Settings</h3>

                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="p-5 rounded-xl border border-border">
                    <h4 className="font-medium text-foreground mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Current Password</label>
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">New Password</label>
                          <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Confirm Password</label>
                          <input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          />
                        </div>
                      </div>
                      <Button variant="outline" className="rounded-xl">
                        Update Password
                      </Button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="p-5 rounded-xl border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline" className="rounded-xl">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="p-5 rounded-xl border border-border">
                    <h4 className="font-medium text-foreground mb-4">Active Sessions</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                        <div>
                          <p className="font-medium text-foreground">Chrome on MacOS</p>
                          <p className="text-xs text-muted-foreground">New York, US - Current session</p>
                        </div>
                        <span className="text-xs text-success">Active now</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                        <div>
                          <p className="font-medium text-foreground">Safari on iPhone</p>
                          <p className="text-xs text-muted-foreground">New York, US - 2 hours ago</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive rounded-lg">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
