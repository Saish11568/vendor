"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Camera,
  Edit2,
  Check,
  X,
  ShoppingBag,
  Star,
  Heart,
  Award,
  LogIn
} from "lucide-react"

const addresses = [
  {
    id: 1,
    type: "Home",
    name: "John Doe",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    phone: "+1 (555) 123-4567",
    isDefault: true
  },
  {
    id: 2,
    type: "Work",
    name: "John Doe",
    address: "456 Business Ave, Floor 12",
    city: "New York",
    state: "NY",
    zip: "10002",
    phone: "+1 (555) 987-6543",
    isDefault: false
  },
]

export default function ProfilePage() {
  const { user, updateProfile, orders, wishlist, showToast, logout } = useStore()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({ name: user.name, email: user.email, phone: user.phone })
  const [savedAddresses, setSavedAddresses] = useState(addresses)

  if (!user.isLoggedIn) {
    return (
      <PageLayout activeItem="Profile">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to view your profile</h1>
          <p className="text-muted-foreground mb-6">Access your account details, orders, and preferences.</p>
          <Link href="/login?redirect=/profile">
            <Button className="gap-2"><LogIn className="h-4 w-4" /> Sign In</Button>
          </Link>
        </div>
      </PageLayout>
    )
  }

  const handleSave = () => {
    updateProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile({ name: user.name, email: user.email, phone: user.phone })
    setIsEditing(false)
  }

  const setDefaultAddress = (id: number) => {
    setSavedAddresses(savedAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
    showToast("Default address updated!", "success")
  }

  const stats = [
    { icon: ShoppingBag, label: "Total Orders", value: orders.length.toString() },
    { icon: Star, label: "Reward Points", value: user.rewardPoints.toLocaleString() },
    { icon: Heart, label: "Wishlist Items", value: wishlist.length.toString() },
    { icon: Award, label: "Member Tier", value: user.memberTier },
  ]

  return (
    <PageLayout activeItem="Profile">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your account information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                      {user.memberTier} Member
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Member since {user.dateJoined}
                    </span>
                  </div>
                </div>
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1" onClick={handleSave}>
                    <Check className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.name} 
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                  />
                ) : (
                  <p className="font-medium text-foreground">{user.name}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                {isEditing ? (
                  <Input 
                    type="email"
                    value={editedProfile.email} 
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                  />
                ) : (
                  <p className="font-medium text-foreground">{user.email}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>
                {isEditing ? (
                  <Input 
                    value={editedProfile.phone} 
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                  />
                ) : (
                  <p className="font-medium text-foreground">{user.phone}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </label>
                <p className="font-medium text-foreground">{user.dateJoined}</p>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Saved Addresses</h3>
              <Button variant="outline" size="sm">Add New Address</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((address) => (
                <div 
                  key={address.id}
                  className={`p-4 rounded-lg border ${address.isDefault ? "border-primary bg-primary/5" : "border-border bg-card"}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      address.type === "Home" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}>
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-foreground">{address.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {address.address}<br />
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="ghost" size="sm">Edit</Button>
                    {!address.isDefault && (
                      <Button variant="ghost" size="sm" onClick={() => setDefaultAddress(address.id)}>
                        Set Default
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Account Stats</h3>
            <div className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="font-bold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: "Order History", href: "/orders" },
                { label: "Wishlist", href: "/wishlist" },
                { label: "Payment Methods", href: "/payments" },
                { label: "Account Settings", href: "/settings" },
              ].map((link) => (
                <Link 
                  key={link.label}
                  href={link.href}
                  className="block p-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Account Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => showToast("Data export started...", "info")}>
                Download My Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => { logout(); router.push("/") }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
