"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  Upload,
  Sparkles,
  X,
} from "lucide-react"
import { Header } from "../header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusConfig = {
  active: { label: "Active", bg: "bg-success/10", text: "text-success" },
  low_stock: { label: "Low Stock", bg: "bg-warning/10", text: "text-warning" },
  out_of_stock: { label: "Out of Stock", bg: "bg-destructive/10", text: "text-destructive" },
}

export function ProductsModule() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [previewProduct, setPreviewProduct] = useState<any>(null)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  })

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          setProducts([])
        }
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    setProducts(products.filter(p => p.id !== id))
  }

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock) return
    
    if (editingId) {
      const res = await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price as string),
          stock: parseInt(formData.stock as string),
        }),
        headers: { "Content-Type": "application/json" }
      })
      const updatedProduct = await res.json()
      setProducts(products.map(p => p.id === editingId ? updatedProduct : p))
    } else {
      const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price as string),
          stock: parseInt(formData.stock as string),
          sku: `NEW-${Math.floor(Math.random() * 1000)}`,
          status: parseInt(formData.stock as string) > 0 ? "active" : "out_of_stock",
          image: formData.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
        }),
        headers: { "Content-Type": "application/json" }
      })
      const newProduct = await res.json()
      setProducts([...products, newProduct])
    }
    
    setShowAddModal(false)
    setEditingId(null)
    setFormData({ name: "", price: "", stock: "", category: "", image: "" })
  }

  const openEditModal = (product: any) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category || "",
      image: product.image || ""
    })
    setEditingId(product.id)
    setShowAddModal(true)
  }

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const uploadedProducts = JSON.parse(event.target?.result as string)
        if (Array.isArray(uploadedProducts)) {
          const newProducts = []
          for (const p of uploadedProducts) {
              const res = await fetch("/api/products", {
                method: "POST",
                body: JSON.stringify({ ...p, status: p.stock > 0 ? "active" : "out_of_stock" }),
                headers: { "Content-Type": "application/json" }
              })
              newProducts.push(await res.json())
          }
          setProducts([...products, ...newProducts])
        }
      } catch(e) {
        alert("Please upload a valid JSON array of products.")
      }
    }
    reader.readAsText(file)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLElement>) => {
    let file: File | null = null;
    if ("dataTransfer" in e) {
      e.preventDefault();
      file = e.dataTransfer.files[0];
    } else if ("target" in e && e.target.files) {
      file = e.target.files[0];
    }
    
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterCategory === "all" || (product.category || "").toLowerCase() === filterCategory.toLowerCase()
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <Header title="Product Management" subtitle="Manage your product catalog and inventory" />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: products.length.toString(), icon: Package, color: "text-primary" },
          { label: "Active", value: products.filter(p => p.status === "active").length.toString(), icon: Package, color: "text-success" },
          { label: "Low Stock", value: products.filter(p => p.status === "low_stock").length.toString(), icon: AlertTriangle, color: "text-warning" },
          { label: "Out of Stock", value: products.filter(p => p.status === "out_of_stock").length.toString(), icon: AlertTriangle, color: "text-destructive" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pro-card rounded-xl p-4 flex items-center gap-3"
          >
            <div className={cn("p-2 rounded-lg bg-secondary/50", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pro-card rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <Button variant="outline" className="gap-2 rounded-xl" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
              <Filter className="w-4 h-4" />
              {filterCategory === "all" ? "Filter" : filterCategory}
            </Button>
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg z-10 py-1 overflow-hidden">
                {["all", "electronics", "wearables", "accessories"].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => { setFilterCategory(cat); setShowFilterDropdown(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-secondary/50 capitalize"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <label className="cursor-pointer">
            <Button variant="outline" className="gap-2 rounded-xl pointer-events-none">
              <Upload className="w-4 h-4" />
              Bulk Upload
            </Button>
            <input type="file" accept=".json" className="hidden" onChange={handleBulkUpload} />
          </label>
          
          <Button className="gap-2 rounded-xl" onClick={() => { setEditingId(null); setFormData({ name: "", price: "", stock: "", category: "", image: "" }); setShowAddModal(true); }}>
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="pro-card rounded-xl p-4 cursor-pointer transition-all"
          >
            <div className="flex items-start gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover"
                crossOrigin="anonymous"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-foreground truncate">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-md",
                      statusConfig[product.status as keyof typeof statusConfig].bg,
                      statusConfig[product.status as keyof typeof statusConfig].text
                    )}
                  >
                    {statusConfig[product.status as keyof typeof statusConfig].label}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-lg font-bold text-foreground">₹{(Number(product.price) || 0).toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Stock</p>
                <p
                  className={cn(
                    "text-lg font-bold",
                    product.stock === 0
                      ? "text-destructive"
                      : product.stock <= 10
                        ? "text-warning"
                        : "text-foreground"
                  )}
                >
                  {product.stock}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPreviewProduct(product)} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => openEditModal(product)} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="pro-card rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">{editingId ? "Edit Product" : "Add New Product"}</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Product Name</label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    Description
                    <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                      <Sparkles className="w-3 h-3" />
                      AI Generate
                    </button>
                  </label>
                  <textarea
                    placeholder="Enter product description"
                    rows={3}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Price</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Stock Quantity</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                    <option value="">Select category</option>
                    <option value="electronics">Electronics</option>
                    <option value="wearables">Wearables</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Product Images</label>
                  <label 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={handleImageUpload}
                    className="mt-1.5 border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden"
                  >
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Drag and drop or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} className="flex-1 rounded-xl">
                  {editingId ? "Save Changes" : "Add Product"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="pro-card rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
            >
              <button
                onClick={() => setPreviewProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <img src={previewProduct.image} crossOrigin="anonymous" className="w-full h-64 object-cover rounded-xl mb-6" alt={previewProduct.name} />
              <h2 className="text-2xl font-bold text-foreground mb-2">{previewProduct.name}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span>SKU: {previewProduct.sku}</span>
                <span className="capitalize">Category: {previewProduct.category || "Uncategorized"}</span>
                <span>Stock: {previewProduct.stock}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-foreground">₹{previewProduct.price.toFixed(2)}</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  statusConfig[previewProduct.status as keyof typeof statusConfig]?.bg,
                  statusConfig[previewProduct.status as keyof typeof statusConfig]?.text
                )}>
                  {statusConfig[previewProduct.status as keyof typeof statusConfig]?.label}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
