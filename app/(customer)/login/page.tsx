"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { GlobalToast } from "@/components/global-toast"
import Link from "next/link"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShoppingBag,
  ChevronLeft,
} from "lucide-react"

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login, signup } = useStore()

  const redirect = searchParams.get("redirect") || "/"
  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login"

  const [tab, setTab] = useState<"login" | "signup">(initialTab)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Login form
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup form
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirm, setSignupConfirm] = useState("")

  const validateLogin = () => {
    const e: Record<string, string> = {}
    if (!loginEmail.trim()) e.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+?/.test(loginEmail)) e.email = "Enter a valid email"
    if (!loginPassword.trim()) e.password = "Password is required"
    else if (loginPassword.length < 6) e.password = "Password must be at least 6 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateSignup = () => {
    const e: Record<string, string> = {}
    if (!signupName.trim()) e.name = "Name is required"
    if (!signupEmail.trim()) e.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+?/.test(signupEmail)) e.email = "Enter a valid email"
    if (!signupPassword.trim()) e.password = "Password is required"
    else if (signupPassword.length < 6) e.password = "Password must be at least 6 characters"
    if (signupPassword !== signupConfirm) e.confirm = "Passwords don't match"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateLogin()) return
    setLoading(true)
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800))
    login(loginEmail, loginPassword)
    setLoading(false)
    router.push(redirect)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateSignup()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    signup(signupName, signupEmail, signupPassword)
    setLoading(false)
    router.push(redirect)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative p-12 text-white overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-900/90 backdrop-blur-[2px]" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-12 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white font-bold text-2xl backdrop-blur-md border border-white/30 group-hover:bg-white/30 transition-all shadow-xl">
              N
            </div>
            <span className="text-3xl font-extrabold tracking-tight">NexaShop</span>
          </Link>
          <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-md">
            {tab === "login" ? "Welcome Back to Premium Shopping" : "Join the NexaShop Experience"}
          </h1>
          <p className="text-xl text-white/90 max-w-md font-medium leading-relaxed drop-shadow">
            {tab === "login"
              ? "Sign in to access your orders, wishlist, and exclusive deals crafted just for you."
              : "Create your account and start exploring thousands of premium products from trusted global vendors."}
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-5 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <ShoppingBag className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">10,000+ Premium Products</p>
              <p className="text-sm text-white/80">Sourced from 500+ trusted global vendors</p>
            </div>
          </div>
          <div className="flex items-center gap-5 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">Bank-Grade Security</p>
              <p className="text-sm text-white/80">256-bit SSL encrypted transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back to Shop
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              N
            </div>
            <span className="text-xl font-bold text-foreground">NexaShop</span>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-1 p-1 rounded-xl bg-muted mb-8">
            <button
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ?{
                tab === "login" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => { setTab("login"); setErrors({}) }}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ?{
                tab === "signup" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => { setTab("signup"); setErrors({}) }}
            >
              Create Account
            </button>
          </div>

          {/* Login Form */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <button type="button" className="text-primary hover:text-primary/80 font-medium">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full h-12 gap-2 text-base font-semibold" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>Sign In <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Demo: Use any email & password (6+ chars)
              </p>
            </form>
          )}

          {/* Signup Form */}
          {tab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
              </div>

              <Button type="submit" className="w-full h-12 gap-2 text-base font-semibold" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <>Create Account <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
      <GlobalToast />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><span className="h-8 w-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
