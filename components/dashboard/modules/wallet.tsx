"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Building,
  Plus,
  X,
} from "lucide-react"
import { Header } from "../header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const transactions = [
  {
    id: 1,
    type: "credit",
    description: "Order #ORD-2024-001 Payment",
    amount: 457.0,
    date: "Jan 15, 2024",
    time: "2:30 PM",
    status: "completed",
  },
  {
    id: 2,
    type: "debit",
    description: "Withdrawal to Bank Account",
    amount: 2500.0,
    date: "Jan 14, 2024",
    time: "10:15 AM",
    status: "completed",
  },
  {
    id: 3,
    type: "credit",
    description: "Order #ORD-2024-002 Payment",
    amount: 459.0,
    date: "Jan 14, 2024",
    time: "9:45 AM",
    status: "completed",
  },
  {
    id: 4,
    type: "debit",
    description: "Platform Commission",
    amount: 125.5,
    date: "Jan 13, 2024",
    time: "11:00 PM",
    status: "completed",
  },
  {
    id: 5,
    type: "credit",
    description: "Order #ORD-2024-003 Payment",
    amount: 198.0,
    date: "Jan 13, 2024",
    time: "4:20 PM",
    status: "completed",
  },
  {
    id: 6,
    type: "debit",
    description: "Withdrawal Request",
    amount: 1500.0,
    date: "Jan 12, 2024",
    time: "3:00 PM",
    status: "pending",
  },
]

const withdrawalMethods = [
  {
    id: 1,
    type: "bank",
    name: "Chase Bank",
    details: "**** **** **** 4532",
    icon: Building,
  },
  {
    id: 2,
    type: "card",
    name: "Visa Debit Card",
    details: "**** **** **** 8976",
    icon: CreditCard,
  },
]

const statusConfig = {
  completed: { label: "Completed", icon: CheckCircle, bg: "bg-success/10", text: "text-success" },
  pending: { label: "Pending", icon: Clock, bg: "bg-warning/10", text: "text-warning" },
  failed: { label: "Failed", icon: XCircle, bg: "bg-destructive/10", text: "text-destructive" },
}

export function WalletModule() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null)

  const walletBalance = 12458.5
  const pendingAmount = 1500.0
  const availableBalance = walletBalance - pendingAmount

  return (
    <div className="space-y-6">
      <Header title="Wallet & Payments" subtitle="Manage your earnings and withdrawals" />

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pro-card rounded-xl p-6 md:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-3xl font-bold text-foreground">${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            <Button className="gap-2 rounded-xl" onClick={() => setShowWithdrawModal(true)}>
              <ArrowUpRight className="w-4 h-4" />
              Withdraw
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-success/10">
              <p className="text-xs text-muted-foreground">Available for Withdrawal</p>
              <p className="text-xl font-bold text-success mt-1">
                ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-warning/10">
              <p className="text-xs text-muted-foreground">Pending Withdrawal</p>
              <p className="text-xl font-bold text-warning mt-1">
                ${pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pro-card rounded-xl p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">This Month</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <ArrowDownLeft className="w-4 h-4 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">Earnings</span>
              </div>
              <span className="font-semibold text-success">+₹8,456.00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <ArrowUpRight className="w-4 h-4 text-destructive" />
                </div>
                <span className="text-sm text-muted-foreground">Withdrawals</span>
              </div>
              <span className="font-semibold text-destructive">-₹4,000.00</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Net Earnings</span>
              <span className="font-bold text-foreground">+₹4,456.00</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pro-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Payment Methods</h3>
          <Button variant="outline" size="sm" className="gap-2 rounded-lg">
            <Plus className="w-4 h-4" />
            Add New
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {withdrawalMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border"
            >
              <div className="p-3 rounded-xl bg-secondary/50">
                <method.icon className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{method.name}</p>
                <p className="text-sm text-muted-foreground">{method.details}</p>
              </div>
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                Edit
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pro-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Transaction History</h3>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {transactions.map((transaction, index) => {
            const StatusIcon = statusConfig[transaction.status as keyof typeof statusConfig].icon
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-2.5 rounded-xl",
                      transaction.type === "credit" ? "bg-success/10" : "bg-destructive/10"
                    )}
                  >
                    {transaction.type === "credit" ? (
                      <ArrowDownLeft
                        className={cn("w-5 h-5", transaction.type === "credit" ? "text-success" : "text-destructive")}
                      />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.date} at {transaction.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "font-semibold",
                      transaction.type === "credit" ? "text-success" : "text-destructive"
                    )}
                  >
                    {transaction.type === "credit" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                      statusConfig[transaction.status as keyof typeof statusConfig].bg,
                      statusConfig[transaction.status as keyof typeof statusConfig].text
                    )}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig[transaction.status as keyof typeof statusConfig].label}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowWithdrawModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="pro-card rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Withdraw Funds</h2>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-primary/10 mb-6">
                <p className="text-xs text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-primary">
                  ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Amount</label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Withdraw To</label>
                  <div className="space-y-2">
                    {withdrawalMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl border transition-all",
                          selectedMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border bg-secondary/30 hover:bg-secondary/50"
                        )}
                      >
                        <div className="p-2 rounded-lg bg-secondary/50">
                          <method.icon className="w-5 h-5 text-foreground" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-foreground">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.details}</p>
                        </div>
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            selectedMethod === method.id ? "border-primary" : "border-muted-foreground"
                          )}
                        >
                          {selectedMethod === method.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowWithdrawModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 rounded-xl">Request Withdrawal</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
