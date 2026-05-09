"use client"

import { LucideIcon } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import Link from "next/link"

interface CategoryCardProps {
  name: string
  icon: LucideIcon
  count: number
  gradient: string
}

export function CategoryCard({ name, icon: Icon, count, gradient }: CategoryCardProps) {
  return (
    <Link href={`/search?q=${encodeURIComponent(name)}`}>
      <GlassCard className="cursor-pointer group p-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className={`p-3 rounded-xl ${gradient} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-xs text-muted-foreground">{count.toLocaleString()} items</p>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}
