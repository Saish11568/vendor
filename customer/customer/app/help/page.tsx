"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  ArrowRight,
  Package,
  CreditCard,
  RotateCcw,
  Shield,
  Truck,
  Star,
  Send
} from "lucide-react"

const faqCategories = [
  {
    name: "Orders & Shipping",
    icon: Truck,
    faqs: [
      { q: "How do I track my order?", a: "Go to My Orders or the Track Order page. Enter your order ID and you'll see real-time tracking information including current location and estimated delivery date." },
      { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Overnight shipping arrives by the next business day." },
      { q: "Can I change my shipping address after placing an order?", a: "You can modify your shipping address within 2 hours of placing an order. Go to My Orders, select the order, and click 'Edit Address'." },
      { q: "Do you offer free shipping?", a: "Yes! All orders above $100 qualify for free standard shipping. You can also use the FREESHIP coupon code for free shipping on any order." },
    ]
  },
  {
    name: "Returns & Refunds",
    icon: RotateCcw,
    faqs: [
      { q: "What is your return policy?", a: "We offer a 30-day return policy on most items. Products must be in original packaging and unused condition. Some categories like electronics have specific return windows." },
      { q: "How do I initiate a return?", a: "Go to My Orders, select the order, and click 'Return Item'. Follow the steps to print your return label and schedule a pickup." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 5-7 business days after we receive your returned item. The amount will be credited to your original payment method." },
    ]
  },
  {
    name: "Payment & Security",
    icon: CreditCard,
    faqs: [
      { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, UPI, Net Banking, and NexaShop Wallet. EMI options are also available on select products." },
      { q: "Is my payment information secure?", a: "Absolutely. We use industry-standard SSL encryption and never store your full card details. All transactions are PCI-DSS compliant." },
      { q: "How do I apply a coupon code?", a: "During checkout or in your cart, you'll find a 'Coupon Code' field. Enter your code and click 'Apply'. Valid coupons include SAVE20, SAVE10, FREESHIP, FIRST50, and TECH10." },
    ]
  },
  {
    name: "Account & Rewards",
    icon: Star,
    faqs: [
      { q: "How do I earn reward points?", a: "You earn 1 point for every $10 spent. Additional points can be earned through product reviews (50 pts), referrals (250 pts), and daily check-ins (5 pts)." },
      { q: "What are the membership tiers?", a: "We have four tiers: Bronze (0-999 pts), Silver (1000-4999 pts), Gold (5000-9999 pts), and Platinum (10000+ pts). Each tier unlocks exclusive benefits." },
      { q: "How do I change my password?", a: "Go to Settings > Security, enter your current password and your new password, then click 'Update Password'." },
    ]
  },
]

export default function HelpPage() {
  const { showToast } = useStore()
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(0)
  const [contactMessage, setContactMessage] = useState("")
  const [contactEmail, setContactEmail] = useState("")

  const toggleFAQ = (key: string) => {
    setOpenFAQ(openFAQ === key ? null : key)
  }

  const filteredFAQs = searchQuery.trim()
    ? faqCategories.flatMap((cat) =>
        cat.faqs
          .filter(faq =>
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(faq => ({ ...faq, category: cat.name }))
      )
    : []

  const handleSubmitTicket = () => {
    if (!contactEmail.trim() || !contactMessage.trim()) {
      showToast("Please fill in all fields", "error")
      return
    }
    setContactEmail("")
    setContactMessage("")
    showToast("Support ticket submitted! We'll get back to you within 24 hours.", "success")
  }

  return (
    <PageLayout activeItem="Help Center">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <HelpCircle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Help Center</h1>
          <p className="text-sm text-muted-foreground">Find answers or get in touch with us</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 lg:p-8 mb-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-4">How can we help you?</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl bg-white border-0 text-foreground text-base"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="mb-8">
          <h3 className="font-semibold text-foreground mb-4">
            Search Results ({filteredFAQs.length} found)
          </h3>
          {filteredFAQs.length > 0 ? (
            <div className="space-y-3">
              {filteredFAQs.map((faq, i) => (
                <div key={i} className="bg-card rounded-xl border border-border">
                  <button
                    className="w-full flex items-center justify-between p-4 text-left"
                    onClick={() => toggleFAQ(`search-${i}`)}
                  >
                    <div>
                      <span className="text-xs text-primary font-medium">{faq.category}</span>
                      <p className="font-medium text-foreground">{faq.q}</p>
                    </div>
                    {openFAQ === `search-${i}` ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </button>
                  {openFAQ === `search-${i}` && (
                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-card rounded-xl border border-border">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No results found. Try a different search or contact support.</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Categories */}
        <div className="lg:col-span-2">
          {/* Category Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {faqCategories.map((cat, i) => (
              <Button
                key={cat.name}
                variant={activeCategory === i ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0 gap-1"
                onClick={() => setActiveCategory(i)}
              >
                <cat.icon className="h-4 w-4" />
                {cat.name}
              </Button>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-3">
            {faqCategories[activeCategory].faqs.map((faq, i) => {
              const key = `${activeCategory}-${i}`
              return (
                <div key={key} className="bg-card rounded-xl border border-border overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    onClick={() => toggleFAQ(key)}
                  >
                    <p className="font-medium text-foreground pr-4">{faq.q}</p>
                    {openFAQ === key ? <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                  </button>
                  {openFAQ === key && (
                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3 mx-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact & Quick Links */}
        <div className="space-y-6">
          {/* Contact Support */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Contact Support</h3>
            <div className="space-y-3 mb-6">
              <button 
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                onClick={() => showToast("Live chat opening... (coming soon)", "info")}
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Live Chat</p>
                  <p className="text-xs text-green-600">Online 24/7</p>
                </div>
              </button>
              <button 
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                onClick={() => showToast("Call center: +1 (800) 555-NEXA", "info")}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Phone Support</p>
                  <p className="text-xs text-muted-foreground">Mon-Sat, 9AM-9PM EST</p>
                </div>
              </button>
            </div>

            {/* Submit Ticket */}
            <h4 className="font-medium text-foreground mb-3">Submit a Ticket</h4>
            <div className="space-y-3">
              <Input 
                placeholder="Your email" 
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <textarea
                placeholder="Describe your issue..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button className="w-full gap-2" onClick={handleSubmitTicket}>
                <Send className="h-4 w-4" />
                Submit Ticket
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: "Track My Order", href: "/track-order" },
                { label: "My Orders", href: "/orders" },
                { label: "Return an Item", href: "/orders" },
                { label: "Payment Issues", href: "/payments" },
                { label: "Account Settings", href: "/settings" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between p-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
