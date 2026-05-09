"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { useStore, allProducts } from "@/lib/store"
import Link from "next/link"
import { 
  Star, 
  Gift, 
  Trophy,
  Zap,
  ArrowRight,
  Clock,
  ShoppingBag,
  TrendingUp,
  CheckCircle2
} from "lucide-react"

const rewards = [
  { id: 1, name: "$10 Off Your Next Order", points: 500, category: "Discount", validUntil: "Jun 30, 2026", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop" },
  { id: 2, name: "Free Shipping (3 Orders)", points: 300, category: "Shipping", validUntil: "Jul 15, 2026", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop" },
  { id: 3, name: "20% Off Electronics", points: 800, category: "Discount", validUntil: "Jun 15, 2026", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop" },
  { id: 4, name: "Exclusive Early Access", points: 1000, category: "Premium", validUntil: "Aug 01, 2026", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop" },
  { id: 5, name: "$25 Gift Card", points: 1200, category: "Gift Card", validUntil: "Dec 31, 2026", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop" },
  { id: 6, name: "Free Premium Membership (1 Month)", points: 2000, category: "Premium", validUntil: "Sep 30, 2026", image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=200&fit=crop" },
]

const pointsHistory = [
  { action: "Purchase: MacBook Pro", points: 180, date: "May 5, 2026", type: "earned" },
  { action: "Redeemed: $10 Off Coupon", points: -500, date: "May 3, 2026", type: "spent" },
  { action: "Purchase: Sony Headphones", points: 30, date: "Apr 28, 2026", type: "earned" },
  { action: "Referral Bonus", points: 250, date: "Apr 20, 2026", type: "earned" },
  { action: "Purchase: iPhone Case", points: 10, date: "Apr 15, 2026", type: "earned" },
]

const tiers = [
  { name: "Bronze", minPoints: 0, maxPoints: 999, color: "bg-amber-700" },
  { name: "Silver", minPoints: 1000, maxPoints: 4999, color: "bg-gray-400" },
  { name: "Gold", minPoints: 5000, maxPoints: 9999, color: "bg-yellow-500" },
  { name: "Platinum", minPoints: 10000, maxPoints: Infinity, color: "bg-gradient-to-r from-purple-500 to-blue-500" },
]

export default function RewardsPage() {
  const { user, showToast, updateProfile } = useStore()
  const [redeemedIds, setRedeemedIds] = useState<number[]>([])

  const currentPoints = user.rewardPoints
  const currentTier = tiers.find(t => currentPoints >= t.minPoints && currentPoints <= t.maxPoints) || tiers[0]
  const nextTier = tiers[tiers.indexOf(currentTier) + 1]
  const progressToNext = nextTier 
    ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 
    : 100

  const handleRedeem = (reward: typeof rewards[0]) => {
    if (currentPoints < reward.points) {
      showToast("Not enough points to redeem this reward", "error")
      return
    }
    updateProfile({ rewardPoints: currentPoints - reward.points })
    setRedeemedIds([...redeemedIds, reward.id])
    showToast(`🎉 "${reward.name}" redeemed successfully!`, "success")
  }

  const handleDailyCheckin = () => {
    updateProfile({ rewardPoints: currentPoints + 5 })
    showToast("+5 points earned for daily check-in!", "success")
  }

  return (
    <PageLayout activeItem="Rewards">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-yellow-500/10">
          <Star className="h-6 w-6 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rewards Program</h1>
          <p className="text-sm text-muted-foreground">Earn points with every purchase</p>
        </div>
      </div>

      {/* Points Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm">Available Points</p>
              <p className="text-4xl font-bold">{currentPoints.toLocaleString()}</p>
            </div>
            <div className={`px-3 py-1 rounded-full ${currentTier.color} text-white text-sm font-medium flex items-center gap-1`}>
              <Trophy className="h-4 w-4" />
              {currentTier.name} Member
            </div>
          </div>
          
          {nextTier && (
            <div>
              <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                <span>Progress to {nextTier.name}</span>
                <span>{(nextTier.minPoints - currentPoints).toLocaleString()} pts to go</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Points Earned (This Month)</span>
              </div>
              <span className="font-bold text-green-600">+210</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Gift className="h-4 w-4" />
                <span className="text-sm">Rewards Redeemed</span>
              </div>
              <span className="font-bold text-foreground">{5 + redeemedIds.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-sm">Total Purchases</span>
              </div>
              <span className="font-bold text-foreground">23</span>
            </div>
          </div>
        </div>
      </div>

      {/* How to Earn */}
      <div className="bg-card rounded-xl border border-border p-6 mb-8">
        <h3 className="font-semibold text-foreground mb-4">How to Earn Points</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: ShoppingBag, title: "Shop", desc: "1 point per $10 spent", points: "1pt/$10", action: null },
            { icon: Star, title: "Review Products", desc: "50 points per review", points: "+50pts", action: null },
            { icon: Gift, title: "Refer Friends", desc: "250 points per referral", points: "+250pts", action: null },
            { icon: TrendingUp, title: "Daily Check-in", desc: "5 points daily", points: "+5pts", action: handleDailyCheckin },
          ].map((item) => (
            <button
              key={item.title}
              className="p-4 rounded-lg bg-muted/50 border border-border text-left hover:border-primary/50 transition-colors"
              onClick={item.action || undefined}
            >
              <item.icon className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-medium text-foreground">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              <p className="text-sm font-bold text-primary mt-2">{item.points}</p>
              {item.action && <p className="text-xs text-primary mt-1 font-medium">Click to claim!</p>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Rewards */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Available Rewards</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewards.map((reward) => {
              const canRedeem = currentPoints >= reward.points
              const isRedeemed = redeemedIds.includes(reward.id)
              return (
                <div key={reward.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="h-32 bg-muted relative">
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-80"
                      style={{ backgroundImage: `url(${reward.image})` }}
                    />
                    <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full bg-white/90 text-foreground">
                      {reward.category}
                    </span>
                    {isRedeemed && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <div className="bg-white rounded-full p-2"><CheckCircle2 className="h-8 w-8 text-green-500" /></div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-foreground mb-1">{reward.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <Clock className="h-3 w-3" />
                      Valid until {reward.validUntil}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-foreground">{reward.points.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">pts</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={!canRedeem || isRedeemed}
                        onClick={() => handleRedeem(reward)}
                      >
                        {isRedeemed ? "Redeemed ✓" : canRedeem ? "Redeem" : "Need More"}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Points History */}
        <div className="bg-card rounded-xl border border-border p-6 h-fit">
          <h3 className="font-semibold text-foreground mb-4">Points History</h3>
          <div className="space-y-4">
            {pointsHistory.map((entry, index) => (
              <div key={index} className="flex items-start justify-between pb-4 border-b border-border last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{entry.action}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
                <span className={`font-bold ${entry.type === "earned" ? "text-green-600" : "text-red-500"}`}>
                  {entry.type === "earned" ? "+" : ""}{entry.points}
                </span>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4" onClick={() => showToast("Full history coming soon!", "info")}>View Full History</Button>
        </div>
      </div>
    </PageLayout>
  )
}
