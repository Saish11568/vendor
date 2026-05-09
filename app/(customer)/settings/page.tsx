"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { 
  Settings, 
  Bell, 
  Lock, 
  Eye, 
  EyeOff,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Shield,
  LogOut
} from "lucide-react"

export default function SettingsPage() {
  const { showToast, logout, user } = useStore()
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newArrivals: false,
    priceDrops: true,
    newsletter: false
  })
  const [preferences, setPreferences] = useState({
    language: "en",
    currency: "USD",
    theme: "light"
  })

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
    showToast(`${ ${`, "info")
  }

  const handleUpdatePassword = () => {
    if (!currentPassword) { showToast("Enter current password", "error"); return }
    if (newPassword.length < 6) { showToast("Password must be at least 6 characters", "error"); return }
    if (newPassword !== confirmPassword) { showToast("Passwords don't match", "error"); return }
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    showToast("Password updated successfully!", "success")
  }

  const handleSignOutAll = () => {
    logout()
    showToast("Signed out from all devices", "success")
  }

  const handleEnable2FA = () => {
    showToast("Two-factor authentication setup coming soon!", "info")
  }

  return (
    <PageLayout activeItem="Settings">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account preferences</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Notifications */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">Choose what you want to be notified about</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: "orderUpdates", label: "Order Updates", desc: "Get notified about your order status", icon: Smartphone },
              { key: "promotions", label: "Promotions", desc: "Receive promotional offers and discounts", icon: Mail },
              { key: "newArrivals", label: "New Arrivals", desc: "Be the first to know about new products", icon: Bell },
              { key: "priceDrops", label: "Price Drops", desc: "Get alerts when items in your wishlist go on sale", icon: Bell },
              { key: "newsletter", label: "Newsletter", desc: "Weekly newsletter with curated content", icon: Mail },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                  className={`relative w-11 h-6 rounded-full transition-colors ?{
                    notifications[item.key as keyof typeof notifications] ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ?{
                      notifications[item.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Security</h3>
              <p className="text-sm text-muted-foreground">Keep your account secure</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Current Password</label>
              <div className="relative mt-1">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">New Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                className="mt-1"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <Input
                type="password"
                placeholder="Confirm new password"
                className="mt-1"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleUpdatePassword}>Update Password</Button>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleEnable2FA}>Enable</Button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Preferences</h3>
              <p className="text-sm text-muted-foreground">Customize your experience</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Language</p>
                  <p className="text-sm text-muted-foreground">Select your preferred language</p>
                </div>
              </div>
              <select 
                value={preferences.language}
                onChange={(e) => { setPreferences({ ...preferences, language: e.target.value }); showToast("Language updated", "success") }}
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-medium">?</span>
                <div>
                  <p className="font-medium text-foreground">Currency</p>
                  <p className="text-sm text-muted-foreground">Select your preferred currency</p>
                </div>
              </div>
              <select 
                value={preferences.currency}
                onChange={(e) => { setPreferences({ ...preferences, currency: e.target.value }); showToast("Currency updated", "success") }}
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
              >
                <option value="USD">USD (?)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {preferences.theme === "light" ? (
                  <Sun className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-foreground">Theme</p>
                  <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
                </div>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
                <button
                  onClick={() => { setPreferences({ ...preferences, theme: "light" }); showToast("Light theme applied", "success") }}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ?{
                    preferences.theme === "light" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => { setPreferences({ ...preferences, theme: "dark" }); showToast("Dark theme applied", "success") }}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ?{
                    preferences.theme === "dark" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card rounded-xl border border-red-200 p-6">
          <h3 className="font-semibold text-red-600 mb-4">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Sign Out of All Devices</p>
              <p className="text-sm text-muted-foreground">This will sign you out from all devices</p>
            </div>
            <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={handleSignOutAll}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out All
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
