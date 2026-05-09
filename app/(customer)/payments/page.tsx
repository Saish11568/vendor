"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { 
  CreditCard, 
  Plus, 
  Trash2,
  Shield,
  CheckCircle2,
  Building,
  Wallet,
  Clock,
  Download,
  ChevronRight
} from "lucide-react"

const initialCards = [
  { id: 1, type: "visa", last4: "4242", expiry: "12/27", name: "John Doe", isDefault: true },
  { id: 2, type: "mastercard", last4: "8888", expiry: "08/26", name: "John Doe", isDefault: false },
]

const transactions = [
  { id: "TXN-9847", description: "Apple MacBook Pro 14\"", amount: 1799.99, date: "May 5, 2026", status: "completed", method: "Visa •••• 4242" },
  { id: "TXN-9832", description: "Sony WH-1000XM5 Headphones", amount: 298.00, date: "May 3, 2026", status: "completed", method: "Visa •••• 4242" },
  { id: "TXN-9819", description: "Samsung Galaxy S24 Ultra", amount: 1199.99, date: "Apr 28, 2026", status: "completed", method: "Mastercard •••• 8888" },
  { id: "TXN-9801", description: "Order Refund - Nike Sneakers", amount: -149.99, date: "Apr 25, 2026", status: "refunded", method: "Visa •••• 4242" },
  { id: "TXN-9788", description: "Apple AirPods Pro", amount: 249.00, date: "Apr 20, 2026", status: "completed", method: "Visa •••• 4242" },
]

export default function PaymentsPage() {
  const { showToast } = useStore()
  const [cards, setCards] = useState(initialCards)
  const [showAddCard, setShowAddCard] = useState(false)
  const [newCard, setNewCard] = useState({ number: "", expiry: "", cvv: "", name: "" })

  const setDefaultCard = (id: number) => {
    setCards(cards.map(card => ({ ...card, isDefault: card.id === id })))
    showToast("Default payment method updated!", "success")
  }

  const removeCard = (id: number) => {
    setCards(cards.filter(card => card.id !== id))
    showToast("Card removed successfully", "info")
  }

  const saveCard = () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvv || !newCard.name) {
      showToast("Please fill all card details", "error")
      return
    }
    const last4 = newCard.number.replace(/\s/g, "").slice(-4)
    setCards([...cards, {
      id: Date.now(),
      type: newCard.number.startsWith("4") ? "visa" : "mastercard",
      last4,
      expiry: newCard.expiry,
      name: newCard.name,
      isDefault: cards.length === 0
    }])
    setNewCard({ number: "", expiry: "", cvv: "", name: "" })
    setShowAddCard(false)
    showToast("Card added successfully!", "success")
  }

  const handleExport = () => {
    const csvContent = [
      "Transaction ID,Description,Amount,Date,Status,Method",
      ...transactions.map(t => `${,${,${?${,${,${,${`)
    ].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "nexashop_transactions.csv"; a.click()
    URL.revokeObjectURL(url)
    showToast("Transactions exported!", "success")
  }

  return (
    <PageLayout activeItem="Payments">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Methods</h1>
          <p className="text-sm text-muted-foreground">Manage your payment options and view transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Saved Cards</h3>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowAddCard(!showAddCard)}>
                <Plus className="h-4 w-4" />
                Add New
              </Button>
            </div>

            {showAddCard && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                <h4 className="font-medium text-foreground mb-4">Add New Card</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Card Number</label>
                    <Input placeholder="1234 5678 9012 3456" className="mt-1" value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Expiry Date</label>
                      <Input placeholder="MM/YY" className="mt-1" value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">CVV</label>
                      <Input placeholder="123" className="mt-1" type="password" value={newCard.cvv} onChange={e => setNewCard({...newCard, cvv: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Name on Card</label>
                    <Input placeholder="John Doe" className="mt-1" value={newCard.name} onChange={e => setNewCard({...newCard, name: e.target.value})} />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={saveCard}>Save Card</Button>
                    <Button variant="outline" onClick={() => setShowAddCard(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {cards.map((card) => (
                <div key={card.id} className={`p-4 rounded-lg border ${`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-8 rounded flex items-center justify-center ${`}>
                        <span className="text-white text-xs font-bold uppercase">{card.type}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          •••• •••• •••• {card.last4}
                          {card.isDefault && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">Default</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">Expires {card.expiry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!card.isDefault && (
                        <Button variant="ghost" size="sm" onClick={() => setDefaultCard(card.id)}>Set Default</Button>
                      )}
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {cards.length === 0 && (
                <p className="text-center py-6 text-muted-foreground">No saved cards. Add a card to get started.</p>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Transaction History</h3>
              <Button variant="ghost" size="sm" className="gap-1" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
            <div className="space-y-3">
              {transactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${`}>
                      {txn.amount < 0 ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <CreditCard className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{txn.description}</p>
                      <p className="text-xs text-muted-foreground">{txn.date} • {txn.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${`}>
                      {txn.amount < 0 ? "+" : "-"}${
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" onClick={() => showToast("Full transaction history coming soon!", "info")}>View All Transactions</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-medium text-white/80">NexaShop Wallet</span>
            </div>
            <p className="text-3xl font-bold mb-1">?124.50</p>
            <p className="text-sm text-white/70 mb-4">Available Balance</p>
            <Button variant="secondary" className="w-full bg-white/20 text-white hover:bg-white/30 border-0" onClick={() => showToast("Add money feature coming soon!", "info")}>
              Add Money
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Other Payment Options</h3>
            <div className="space-y-3">
              {[
                { icon: Building, label: "Net Banking", desc: "Pay directly from bank" },
                { icon: Wallet, label: "UPI/PayPal", desc: "Quick payments" },
                { icon: Clock, label: "EMI Options", desc: "No cost EMI available" },
              ].map((option) => (
                <button 
                  key={option.label}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  onClick={() => showToast(`${ setup coming soon!`, "info")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <option.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground text-sm">Secure Payments</p>
                <p className="text-xs text-muted-foreground mt-1">All transactions are encrypted and secured with industry-standard SSL protection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
