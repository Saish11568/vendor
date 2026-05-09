"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { OverviewModule } from "@/components/dashboard/modules/overview"
import { ProductsModule } from "@/components/dashboard/modules/products"
import { OrdersModule } from "@/components/dashboard/modules/orders"
import { AnalyticsModule } from "@/components/dashboard/modules/analytics"
import { CustomersModule } from "@/components/dashboard/modules/customers"
import { MarketingModule } from "@/components/dashboard/modules/marketing"
import { WalletModule } from "@/components/dashboard/modules/wallet"
import { SettingsModule } from "@/components/dashboard/modules/settings"

const modules: Record<string, React.ComponentType<any>> = {
  overview: OverviewModule,
  products: ProductsModule,
  orders: OrdersModule,
  analytics: AnalyticsModule,
  customers: CustomersModule,
  marketing: MarketingModule,
  wallet: WalletModule,
  settings: SettingsModule,
}

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const ActiveModule = modules[activeTab] || OverviewModule

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/10 rounded-full blur-3xl" />
      </div>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="pl-20 lg:pl-72 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveModule onTabChange={setActiveTab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
