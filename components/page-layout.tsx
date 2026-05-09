"use client"

import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { GlobalToast } from "@/components/global-toast"

interface PageLayoutProps {
  children: React.ReactNode
  activeItem?: string
}

export function PageLayout({ children, activeItem = "Home" }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex relative">
        <Sidebar activeItem={activeItem} />
        <main className="flex-1 p-4 lg:p-6 space-y-6 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
      <GlobalToast />
    </div>
  )
}
