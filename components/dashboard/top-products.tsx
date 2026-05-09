"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

import { useState, useEffect } from "react"

export function TopProducts({ onTabChange }: { onTabChange?: (tab: string) => void }) {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/products").then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        setProducts(data.slice(0, 4))
      } else {
        setProducts([])
      }
    })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="pro-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Top Products</h3>
          <p className="text-sm text-muted-foreground mt-1">Best selling items this month</p>
        </div>
        <button
          onClick={() => onTabChange?.("products")}
          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden">
              {product.image?.startsWith("http") ? <img src={product.image} className="w-full h-full object-cover" crossOrigin="anonymous" /> : "📦"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{product.stock || 10} in stock</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">₹{((product.price || 10) * (product.stock || 10)).toFixed(2)} value</p>
              <div className="flex items-center gap-1 justify-end mt-0.5">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-xs text-success">{product.growth || "+10%"}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
