"use client"

import { createContext, useContext } from "react"

// ============ TYPES ============

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  badge?: string
  vendor: string
  category?: string
  description?: string
  inStock?: boolean
  stock?: number
  images?: string[]
  specs?: Record<string, string>
  variants?: { label: string; options: string[] }[]
}

export interface CartItem {
  product: Product
  quantity: number
  selectedVariants?: Record<string, string>
}

export interface WishlistItem extends Product {
  addedOn: string
}

export interface Address {
  id: number
  type: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  isDefault: boolean
}

export interface Order {
  id: string
  date: string
  status: string
  statusColor: string
  total: number
  items: {
    name: string
    price: number
    quantity: number
    image: string
  }[]
  address?: Address
  paymentMethod?: string
}

export interface User {
  name: string
  email: string
  phone: string
  dateJoined: string
  avatar: string | null
  memberTier: string
  rewardPoints: number
  isLoggedIn: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "order" | "promo" | "system"
}

export const allProducts: Product[] = [
  {
    id: 1,
    name: "Apple MacBook Pro 14\" M3 Pro Chip",
    price: 1799.99,
    originalPrice: 1999.99,
    rating: 4.8,
    reviews: 2453,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    badge: "Best Seller",
    vendor: "Apple Store",
    category: "Laptops",
    inStock: true,
    stock: 45,
    description: "The Apple MacBook Pro 14\" with M3 Pro chip delivers exceptional performance for professionals. With up to 18 hours of battery life, a stunning Liquid Retina XDR display, and advanced connectivity options, it's the ultimate pro notebook.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop",
    ],
    specs: { "Processor": "Apple M3 Pro", "RAM": "18GB Unified", "Storage": "512GB SSD", "Display": "14.2\" Liquid Retina XDR", "Battery": "Up to 18 hours" },
    variants: [
      { label: "Storage", options: ["512GB", "1TB", "2TB"] },
      { label: "Color", options: ["Space Black", "Silver"] }
    ]
  },
  {
    id: 2,
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 298.00,
    originalPrice: 399.99,
    rating: 4.9,
    reviews: 8921,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    badge: "Top Rated",
    vendor: "Sony Official",
    category: "Audio",
    inStock: true,
    stock: 120,
    description: "Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. Up to 30-hour battery life with quick charging.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop",
    ],
    specs: { "Driver": "30mm", "Noise Cancellation": "Industry Leading", "Battery": "30 hours", "Weight": "250g", "Connectivity": "Bluetooth 5.2" },
    variants: [
      { label: "Color", options: ["Black", "Silver", "Midnight Blue"] }
    ]
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra 256GB",
    price: 1199.99,
    rating: 4.7,
    reviews: 3241,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    vendor: "Samsung Store",
    category: "Electronics",
    inStock: true,
    stock: 78,
    description: "The Samsung Galaxy S24 Ultra features a titanium frame, embedded S Pen, and Galaxy AI. With a 200MP camera and Snapdragon 8 Gen 3 processor, it's the most powerful Galaxy ever.",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop",
    ],
    specs: { "Processor": "Snapdragon 8 Gen 3", "RAM": "12GB", "Storage": "256GB", "Display": "6.8\" Dynamic AMOLED 2X", "Camera": "200MP Main" },
    variants: [
      { label: "Storage", options: ["256GB", "512GB", "1TB"] },
      { label: "Color", options: ["Titanium Black", "Titanium Gray", "Titanium Violet"] }
    ]
  },
  {
    id: 4,
    name: "Apple Watch Series 9 GPS 45mm",
    price: 429.00,
    originalPrice: 499.00,
    rating: 4.6,
    reviews: 1892,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
    vendor: "Apple Store",
    category: "Watches",
    inStock: true,
    stock: 60,
    description: "Apple Watch Series 9 with the powerful S9 SiP chip, a magical new way to interact with your watch, and more health and safety features than ever.",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop",
    ],
    specs: { "Chip": "S9 SiP", "Display": "Always-On Retina", "Water Resistance": "50m", "Battery": "18 hours", "Sensors": "Blood Oxygen, ECG, Temperature" },
    variants: [
      { label: "Size", options: ["41mm", "45mm"] },
      { label: "Color", options: ["Midnight", "Starlight", "Silver", "Product RED"] }
    ]
  },
  {
    id: 5,
    name: "Canon EOS R6 Mark II Camera Body",
    price: 2499.00,
    rating: 4.9,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    badge: "Pro Choice",
    vendor: "Canon Direct",
    category: "Cameras",
    inStock: true,
    stock: 25,
    description: "The Canon EOS R6 Mark II features a 24.2 Megapixel Full-frame CMOS sensor, DIGIC X image processor, and up to 40 fps continuous shooting for stunning photos and 4K 60p video.",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop",
    ],
    specs: { "Sensor": "24.2MP Full-frame CMOS", "Video": "4K 60p", "ISO": "100-102400", "AF Points": "1053", "Continuous Shooting": "Up to 40fps" },
  },
  {
    id: 6,
    name: "Nike Air Max 90 Premium Sneakers",
    price: 149.99,
    originalPrice: 189.99,
    rating: 4.5,
    reviews: 4521,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    vendor: "Nike Store",
    category: "Fashion",
    inStock: true,
    stock: 200,
    description: "Nothing as iconic satisfies like the original. The Air Max 90 stays true to its OG running roots with the iconic Waffle outsole, stitched overlays and classic TPU details.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
    ],
    specs: { "Material": "Leather/Synthetic", "Sole": "Rubber", "Closure": "Lace-up", "Style": "Air Max 90", "Technology": "Air Max cushioning" },
    variants: [
      { label: "Size", options: ["7", "8", "9", "10", "11", "12"] },
      { label: "Color", options: ["White/Red", "Black/White", "Triple White"] }
    ]
  },
  {
    id: 7,
    name: "iPad Pro 12.9\" M2 WiFi 256GB",
    price: 1099.00,
    originalPrice: 1199.00,
    rating: 4.8,
    reviews: 2109,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    vendor: "Apple Store",
    category: "Electronics",
    inStock: true,
    stock: 55,
    description: "iPad Pro. With an astonishing M2 chip, a next-level Liquid Retina XDR display, superfast connectivity, and compatibility with Apple Pencil hover.",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop",
    ],
    specs: { "Chip": "Apple M2", "Display": "12.9\" Liquid Retina XDR", "Storage": "256GB", "Camera": "12MP Wide + 10MP Ultra Wide", "Connectivity": "WiFi 6E" },
    variants: [
      { label: "Storage", options: ["128GB", "256GB", "512GB", "1TB"] },
      { label: "Color", options: ["Space Gray", "Silver"] }
    ]
  },
  {
    id: 8,
    name: "Dyson V15 Detect Absolute Vacuum",
    price: 699.99,
    rating: 4.7,
    reviews: 1567,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
    badge: "Trending",
    vendor: "Dyson Official",
    category: "Home & Living",
    inStock: true,
    stock: 35,
    description: "Dyson's most powerful, intelligent cordless vacuum. Reveals invisible dust with a precisely-angled laser. Automatically adapts suction power based on dust levels.",
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&h=800&fit=crop",
    ],
    specs: { "Motor": "Dyson Hyperdymium", "Runtime": "Up to 60 min", "Bin Volume": "0.76L", "Laser": "Green laser dust detect", "Filtration": "Whole-machine HEPA" },
  },
  {
    id: 9,
    name: "Bose QuietComfort Ultra Earbuds",
    price: 299.00,
    originalPrice: 349.00,
    rating: 4.7,
    reviews: 3456,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
    badge: "New",
    vendor: "Bose Store",
    category: "Audio",
    inStock: true,
    stock: 85,
    description: "Bose QuietComfort Ultra Earbuds deliver the best noise cancellation from Bose ever with Immersive Audio for a truly spatial experience.",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop",
    ],
    specs: { "ANC": "World-class", "Battery": "6 hours (24 with case)", "Connectivity": "Bluetooth 5.3", "IP Rating": "IPX4", "Audio": "Immersive Audio" },
    variants: [
      { label: "Color", options: ["Black", "White Smoke", "Moonstone Blue"] }
    ]
  },
  {
    id: 10,
    name: "LG OLED C3 65\" 4K Smart TV",
    price: 1499.99,
    originalPrice: 1799.99,
    rating: 4.8,
    reviews: 2876,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    badge: "Best Value",
    vendor: "LG Electronics",
    category: "Electronics",
    inStock: true,
    stock: 20,
    description: "LG OLED evo C3 65-inch 4K Smart TV with self-lit pixels, a9 Gen6 AI Processor 4K, Dolby Vision & Atmos, and webOS 23.",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop",
    ],
    specs: { "Display": "65\" OLED evo", "Resolution": "4K (3840x2160)", "Processor": "a9 Gen6 AI", "HDR": "Dolby Vision, HDR10", "Smart TV": "webOS 23" },
    variants: [
      { label: "Size", options: ["55\"", "65\"", "77\"", "83\""] }
    ]
  },
  {
    id: 11,
    name: "Adidas Ultraboost Light Running Shoes",
    price: 179.99,
    originalPrice: 199.99,
    rating: 4.6,
    reviews: 5432,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
    vendor: "Adidas Store",
    category: "Sports",
    inStock: true,
    stock: 150,
    description: "Experience the lightest Ultraboost ever. With Light BOOST midsole and Continental™ Rubber outsole for exceptional grip in any weather.",
    images: [
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=800&fit=crop",
    ],
    specs: { "Material": "Primeknit", "Sole": "Continental™ Rubber", "Midsole": "Light BOOST", "Weight": "280g", "Drop": "10mm" },
    variants: [
      { label: "Size", options: ["7", "8", "9", "10", "11", "12"] },
      { label: "Color", options: ["Core Black", "Cloud White", "Solar Red"] }
    ]
  },
  {
    id: 12,
    name: "PlayStation 5 Console Digital Edition",
    price: 449.99,
    rating: 4.9,
    reviews: 12453,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
    badge: "Hot",
    vendor: "Sony Official",
    category: "Electronics",
    inStock: true,
    stock: 15,
    description: "Experience lightning-fast loading, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio. PS5 Digital Edition has no disc drive.",
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop",
    ],
    specs: { "CPU": "AMD Zen 2, 8 cores", "GPU": "10.28 TFLOPS RDNA 2", "RAM": "16GB GDDR6", "SSD": "825GB NVMe", "Resolution": "Up to 4K 120fps" },
  },
  {
    id: 13,
    name: "Dell XPS 15 9530 Laptop",
    price: 1899.00,
    originalPrice: 2199.00,
    rating: 4.7,
    reviews: 1245,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop",
    vendor: "Dell Store",
    category: "Laptops",
    inStock: true,
    stock: 30,
    description: "The Dell XPS 15 is the ultimate laptop for creators. With a stunning 3.5K OLED touch display, powerful 13th Gen Intel Core processors, and NVIDIA GeForce RTX graphics.",
    specs: { "Processor": "Intel Core i7-13700H", "RAM": "32GB DDR5", "Storage": "1TB SSD", "Display": "15.6\" OLED Touch", "GPU": "RTX 4050" },
    variants: [{ label: "RAM", options: ["16GB", "32GB", "64GB"] }]
  },
  {
    id: 14,
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    price: 1549.00,
    rating: 4.8,
    reviews: 876,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
    vendor: "Lenovo Direct",
    category: "Laptops",
    inStock: true,
    stock: 50,
    description: "The legendary ThinkPad X1 Carbon. Ultralight, ultrapowerful, and built for professionals who need the best-in-class keyboard and durability.",
    specs: { "Processor": "Intel Core i7-1355U", "RAM": "16GB LPDDR5", "Storage": "512GB SSD", "Weight": "1.12kg", "Display": "14\" WUXGA" }
  },
  {
    id: 15,
    name: "HP Spectre x360 2-in-1 Laptop",
    price: 1399.99,
    originalPrice: 1599.99,
    rating: 4.6,
    reviews: 1102,
    image: "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?w=400&h=400&fit=crop",
    badge: "Versatile",
    vendor: "HP Store",
    category: "Laptops",
    inStock: true,
    stock: 40,
    description: "The HP Spectre x360 is a premium convertible laptop with a breathtaking design and the performance to handle any task.",
    specs: { "Processor": "Intel Core i7", "RAM": "16GB", "Storage": "1TB SSD", "Display": "13.5\" 3K2K OLED", "Design": "2-in-1 Convertible" }
  },
  {
    id: 16,
    name: "ASUS ROG Zephyrus G14 Gaming",
    price: 1599.00,
    rating: 4.9,
    reviews: 2341,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
    badge: "Gamer's Choice",
    vendor: "ASUS ROG",
    category: "Laptops",
    inStock: true,
    stock: 20,
    description: "The world's most powerful 14-inch gaming laptop. Featuring AMD Ryzen 9 and NVIDIA RTX graphics in a sleek, portable chassis.",
    specs: { "Processor": "AMD Ryzen 9", "GPU": "RTX 4060", "RAM": "16GB DDR5", "Display": "14\" 165Hz QHD+", "Weight": "1.65kg" }
  },
  {
    id: 17,
    name: "Google Pixel 8 Pro 128GB",
    price: 999.00,
    rating: 4.7,
    reviews: 1543,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&h=400&fit=crop",
    vendor: "Google Store",
    category: "Electronics",
    inStock: true,
    stock: 100,
    description: "The all-pro phone engineered by Google. It's sleek, sophisticated, and has the most powerful Pixel camera yet.",
    specs: { "Processor": "Google Tensor G3", "RAM": "12GB", "Display": "6.7\" LTPO OLED", "Camera": "50MP Triple", "OS": "Android 14" },
    variants: [{ label: "Color", options: ["Bay", "Porcelain", "Obsidian"] }]
  },
  {
    id: 18,
    name: "Nintendo Switch OLED Edition",
    price: 349.99,
    rating: 4.9,
    reviews: 25431,
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
    badge: "Family Fun",
    vendor: "Nintendo",
    category: "Electronics",
    inStock: true,
    stock: 150,
    description: "Features a vibrant 7-inch OLED screen, a wide adjustable stand, a dock with a wired LAN port, 64 GB of internal storage, and enhanced audio.",
    specs: { "Screen": "7\" OLED", "Storage": "64GB", "Mode": "Handheld, TV, Tabletop", "Battery": "Up to 9 hours" }
  },
  {
    id: 19,
    name: "Kindle Paperwhite (16 GB)",
    price: 149.99,
    rating: 4.8,
    reviews: 45621,
    image: "https://images.unsplash.com/photo-1592492159418-39f319320569?w=400&h=400&fit=crop",
    vendor: "Amazon Store",
    category: "Electronics",
    inStock: true,
    stock: 300,
    description: "Now with a 6.8\" display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.",
    specs: { "Display": "6.8\" Paperwhite", "Storage": "16GB", "Battery": "Up to 10 weeks", "Waterproof": "IPX8", "Light": "Adjustable Warm" }
  },
  {
    id: 20,
    name: "GoPro HERO12 Black",
    price: 399.00,
    rating: 4.7,
    reviews: 876,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop",
    vendor: "GoPro Official",
    category: "Cameras",
    inStock: true,
    stock: 65,
    description: "HERO12 Black takes GoPro's best-in-class image quality to the next level with new HDR 5.3K and 4K video, improved HyperSmooth 6.0 video stabilization.",
    specs: { "Video": "5.3K60", "Photo": "27MP", "Stabilization": "HyperSmooth 6.0", "Waterproof": "33ft", "HDR": "Yes" }
  },
  {
    id: 21,
    name: "Sony Alpha a7 IV Mirrorless",
    price: 2499.00,
    rating: 4.9,
    reviews: 1245,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    badge: "Pro Choice",
    vendor: "Sony Official",
    category: "Cameras",
    inStock: true,
    stock: 22,
    description: "The true hybrid. With a 33MP Exmor R sensor, fast BIONZ XR processing, and advanced AF performance, it's perfect for both stills and video.",
    specs: { "Sensor": "33MP Full-frame", "Video": "4K 60p", "ISO": "50-204800", "AF": "Real-time Tracking", "EVF": "3.68M-dot" }
  },
  {
    id: 22,
    name: "Fujifilm X-T5 Mirrorless",
    price: 1699.00,
    rating: 4.8,
    reviews: 654,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    vendor: "Fujifilm Store",
    category: "Cameras",
    inStock: true,
    stock: 18,
    description: "Photography first. A high-resolution, 40.2MP X-Trans 5 HR sensor in a compact, lightweight body that maximizes portability and image quality.",
    specs: { "Sensor": "40.2MP APS-C", "Video": "6.2K 30p", "IBIS": "7.0 stops", "Display": "Three-way tilt", "Weight": "557g" }
  },
  {
    id: 23,
    name: "Nikon Z6 II Mirrorless",
    price: 1999.00,
    rating: 4.7,
    reviews: 982,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    vendor: "Nikon Store",
    category: "Cameras",
    inStock: true,
    stock: 15,
    description: "Versatility meets performance. Dual EXPEED 6 processors, dual card slots, and impressive low-light performance make this a powerhouse for any creator.",
    specs: { "Sensor": "24.5MP Full-frame", "Processors": "Dual EXPEED 6", "FPS": "14 fps", "Video": "4K 60p", "Slots": "Dual (CFexpress/SD)" }
  },
  {
    id: 24,
    name: "Apple AirPods Pro (2nd Gen)",
    price: 249.00,
    rating: 4.9,
    reviews: 15642,
    image: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=400&h=400&fit=crop",
    badge: "Top Seller",
    vendor: "Apple Store",
    category: "Audio",
    inStock: true,
    stock: 200,
    description: "Rebuilt from the sound up. AirPods Pro feature up to 2x more Active Noise Cancellation, plus Adaptive Transparency, and Personalized Spatial Audio.",
    specs: { "Chip": "H2", "ANC": "2x Powerful", "Battery": "6 hours", "Case": "MagSafe (USB-C)", "Waterproof": "IP54" }
  },
  {
    id: 25,
    name: "JBL Flip 6 Waterproof Speaker",
    price: 129.95,
    rating: 4.8,
    reviews: 8976,
    image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=400&h=400&fit=crop",
    vendor: "JBL Official",
    category: "Audio",
    inStock: true,
    stock: 120,
    description: "Loud, powerful sound. The JBL Flip 6 delivers powerful JBL Original Pro Sound with exceptional clarity thanks to its 2-way speaker system.",
    specs: { "Waterproof": "IP67", "Battery": "12 hours", "Connectivity": "Bluetooth 5.1", "Power": "20W RMS", "Weight": "0.55kg" }
  },
  {
    id: 26,
    name: "Sonos Era 100 Smart Speaker",
    price: 249.00,
    rating: 4.7,
    reviews: 1243,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop",
    vendor: "Sonos Store",
    category: "Audio",
    inStock: true,
    stock: 45,
    description: "A logic-defying acoustic breakthrough. Era 100 delivers room-filling stereo sound and deep bass that your music deserves.",
    specs: { "Connectivity": "WiFi, Bluetooth", "Control": "Voice, Touch, App", "Tuning": "Trueplay", "Tweeters": "Dual angled", "Woofer": "25% larger" }
  },
  {
    id: 27,
    name: "Levi's 501 Original Fit Jeans",
    price: 79.50,
    rating: 4.6,
    reviews: 18942,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    vendor: "Levi's Store",
    category: "Fashion",
    inStock: true,
    stock: 500,
    description: "The original blue jean since 1873. The 501® Original is a cultural icon, worn by generations and defining style for decades.",
    variants: [{ label: "Waist", options: ["30", "32", "34", "36"] }, { label: "Length", options: ["30", "32", "34"] }]
  },
  {
    id: 28,
    name: "Ray-Ban Classic Wayfarer",
    price: 163.00,
    rating: 4.8,
    reviews: 5621,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    badge: "Iconic",
    vendor: "Ray-Ban Official",
    category: "Fashion",
    inStock: true,
    stock: 150,
    description: "Ray-Ban Original Wayfarer Classics are the most recognizable style in the history of sunglasses. Since 1952, it has been a style staple.",
    variants: [{ label: "Frame", options: ["Black", "Tortoise"] }]
  },
  {
    id: 29,
    name: "The North Face Nuptse Jacket",
    price: 329.00,
    rating: 4.9,
    reviews: 3241,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    vendor: "TNF Store",
    category: "Fashion",
    inStock: true,
    stock: 80,
    description: "Built for mountain-to-city life, the Retro Nuptse Jacket has a boxy silhouette, original shiny ripstop fabric, and iconic oversize baffles.",
    variants: [{ label: "Size", options: ["S", "M", "L", "XL"] }]
  },
  {
    id: 30,
    name: "Nespresso Vertuo Next Coffee",
    price: 179.00,
    rating: 4.5,
    reviews: 8921,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
    vendor: "Nespresso Store",
    category: "Home & Living",
    inStock: true,
    stock: 120,
    description: "Vertuo Next takes the full range of Nespresso coffee styles even further. Choose your favorite among five different coffee sizes.",
    specs: { "Coffee Sizes": "5 sizes", "Heat-up": "30 seconds", "Auto-off": "2 mins", "Water Tank": "1.1L" }
  },
  {
    id: 31,
    name: "Philips Hue Starter Kit",
    price: 199.99,
    rating: 4.7,
    reviews: 4532,
    image: "https://images.unsplash.com/photo-1550985543-56565ed12cbf?w=400&h=400&fit=crop",
    vendor: "Philips Lighting",
    category: "Home & Living",
    inStock: true,
    stock: 60,
    description: "Get started with smart lighting with this starter kit, which includes three smart color bulbs and a Hue Bridge.",
    specs: { "Bulbs": "3 LED Bulbs", "Colors": "16 million", "Control": "Voice, App", "Bridge": "Included" }
  },
  {
    id: 32,
    name: "iRobot Roomba j7+ Robot",
    price: 799.00,
    rating: 4.8,
    reviews: 2134,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
    vendor: "iRobot Official",
    category: "Home & Living",
    inStock: true,
    stock: 25,
    description: "The Roomba j7+ robot vacuum identifies and avoids obstacles like pet waste and charging cords to get the whole job done.",
    specs: { "Emptying": "Automatic", "Obstacle": "PrecisionVision", "Suction": "10x Power-Lifting", "Smart": "Imprint Mapping" }
  },
  {
    id: 33,
    name: "Samsung Galaxy Watch 6 44mm",
    price: 329.99,
    rating: 4.6,
    reviews: 1543,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    vendor: "Samsung Store",
    category: "Watches",
    inStock: true,
    stock: 90,
    description: "A larger screen, thinner bezel, and more personalized health features. Track your sleep, heart health, and fitness with ease.",
    specs: { "Display": "1.5\" Super AMOLED", "Battery": "Up to 40 hours", "Sensors": "BioActive, ECG", "Waterproof": "5ATM + IP68" }
  },
  {
    id: 34,
    name: "Garmin Fenix 7X Sapphire Solar",
    price: 899.99,
    rating: 4.9,
    reviews: 876,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    badge: "Ultimate",
    vendor: "Garmin Store",
    category: "Watches",
    inStock: true,
    stock: 15,
    description: "The ultimate outdoor smartwatch. Featuring a large 1.4\" solar charged display and built-in LED flashlight.",
    specs: { "Battery": "Up to 37 days", "GPS": "Multi-band", "Maps": "TopoActive preloaded", "Lens": "Power Sapphire" }
  },
  {
    id: 35,
    name: "Casio G-Shock GA2100",
    price: 99.00,
    rating: 4.8,
    reviews: 12456,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    vendor: "Casio Official",
    category: "Watches",
    inStock: true,
    stock: 200,
    description: "The 'CasiOak'. Slim, shock-resistant, and tough. A modern classic with a carbon core guard structure.",
    specs: { "Shock Resist": "Yes", "Waterproof": "200m", "Case": "Carbon Core Guard", "Battery": "3 years" }
  },
  {
    id: 36,
    name: "Fitbit Charge 6 Fitness Tracker",
    price: 159.95,
    rating: 4.5,
    reviews: 2102,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
    vendor: "Fitbit Store",
    category: "Watches",
    inStock: true,
    stock: 130,
    description: "Give your fitness a boost with Charge 6, the only tracker with Google built-in. Stay motivated with heart rate on gym equipment.",
    specs: { "Battery": "7 days", "GPS": "Built-in", "Heart Rate": "All-day", "Sensors": "EDA, ECG, SpO2" }
  },
  {
    id: 37,
    name: "Garmin Venu 3 Smartwatch",
    price: 449.99,
    rating: 4.7,
    reviews: 543,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    vendor: "Garmin Store",
    category: "Watches",
    inStock: true,
    stock: 40,
    description: "Know the real you. Specifically designed with advanced health and fitness features and the ability to make calls and send texts.",
    specs: { "Display": "AMOLED", "Battery": "14 days", "Mic/Speaker": "Yes", "Health": "Sleep Coach, Nap Detect" }
  },
  {
    id: 38,
    name: "Wilson Evolution Basketball",
    price: 79.95,
    rating: 4.9,
    reviews: 15432,
    image: "https://images.unsplash.com/photo-1519861531473-920036214751?w=400&h=400&fit=crop",
    badge: "#1 Indoor Ball",
    vendor: "Wilson Store",
    category: "Sports",
    inStock: true,
    stock: 100,
    description: "The #1 indoor game basketball in America. The Evolution's signature feel and durability are what makes it the preferred choice.",
    specs: { "Material": "Microfiber Composite", "Usage": "Indoor", "Channels": "Pebbled", "Feel": "Soft touch" }
  },
  {
    id: 39,
    name: "Theragun Relief Massager",
    price: 149.00,
    rating: 4.6,
    reviews: 876,
    image: "https://images.unsplash.com/photo-1544117518-30dd05999bbd?w=400&h=400&fit=crop",
    vendor: "Therabody",
    category: "Sports",
    inStock: true,
    stock: 55,
    description: "Easy-to-use percussion therapy to relieve daily aches, pains, and tension. Scientific massage therapy made simple.",
    specs: { "Amplitude": "10mm", "Speeds": "3 settings", "Attachments": "3 included", "Battery": "120 mins" }
  },
  {
    id: 40,
    name: "Yoga Mat Pro Premium 6mm",
    price: 120.00,
    rating: 4.8,
    reviews: 3214,
    image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=400&fit=crop",
    vendor: "ZenSport",
    category: "Sports",
    inStock: true,
    stock: 200,
    description: "A professional-grade yoga mat with ultimate grip and cushioning. Sustainable, non-toxic, and built to last a lifetime.",
    specs: { "Thickness": "6mm", "Material": "Natural Rubber", "Grip": "Ultra-stick", "Eco": "Biodegradable" }
  },
  {
    id: 41,
    name: "Bowflex SelectTech 552",
    price: 429.00,
    rating: 4.7,
    reviews: 8965,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop",
    vendor: "Bowflex Store",
    category: "Sports",
    inStock: true,
    stock: 30,
    description: "With just the turn of a dial, you can automatically change your resistance from 5 lbs. all the way up to 52.5 lbs.",
    specs: { "Weight Range": "5 to 52.5 lbs", "Increments": "15 settings", "Space": "Replaces 30 dumbbells" }
  },
  {
    id: 42,
    name: "Nikon Z9 Professional Mirrorless",
    price: 5499.00,
    rating: 5.0,
    reviews: 342,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    badge: "Flagship",
    vendor: "Nikon Store",
    category: "Cameras",
    inStock: true,
    stock: 10,
    description: "The world's most powerful autofocus. 8K video. High-speed stills. The Z9 is the ultimate tool for professional photographers and videographers.",
    specs: { "Sensor": "45.7MP Stacked", "Video": "8K 60p", "AF": "405-point 3D Tracking", "FPS": "20 fps RAW", "Shutter": "Electronic only" }
  },
  {
    id: 43,
    name: "Panasonic LUMIX GH6",
    price: 1699.00,
    rating: 4.7,
    reviews: 531,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    vendor: "Panasonic Store",
    category: "Cameras",
    inStock: true,
    stock: 12,
    description: "The creative workhorse. Featuring a 25.2MP sensor, unlimited 4K 60p recording, and advanced stabilization for filmmakers.",
    specs: { "Sensor": "25.2MP Micro 4/3", "Video": "5.7K 60p", "IBIS": "7.5 stops", "Cooling": "Active fan", "Dynamic Range": "13+ stops" }
  },
  {
    id: 44,
    name: "Patagonia Torrentshell 3L Jacket",
    price: 179.00,
    rating: 4.8,
    reviews: 2134,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    vendor: "Patagonia Store",
    category: "Fashion",
    inStock: true,
    stock: 45,
    description: "Simple and unpretentious, our trusted Torrentshell 3L Jacket uses 3-layer H2No® Performance Standard technology for exceptional waterproof/breathable performance.",
    variants: [{ label: "Size", options: ["S", "M", "L", "XL"] }, { label: "Color", options: ["Black", "Navy", "Green"] }]
  },
  {
    id: 45,
    name: "KitchenAid Artisan Stand Mixer",
    price: 449.99,
    rating: 4.9,
    reviews: 15432,
    image: "https://images.unsplash.com/photo-1594385208934-2c56d195bc5f?w=400&h=400&fit=crop",
    badge: "Kitchen Icon",
    vendor: "KitchenAid Store",
    category: "Home & Living",
    inStock: true,
    stock: 25,
    description: "Make your favorite cakes and multiple batches of cookie dough with the 5-quart stainless steel mixing bowl with comfortable handle.",
    specs: { "Capacity": "5 Quart", "Speeds": "10 settings", "Power": "325 Watts", "Includes": "Flat Beater, Dough Hook, Wire Whip" }
  },
  {
    id: 46,
    name: "Hydro Flask 32 oz Wide Mouth",
    price: 44.95,
    rating: 4.9,
    reviews: 45321,
    image: "https://images.unsplash.com/photo-1602143393494-721d0026210b?w=400&h=400&fit=crop",
    vendor: "Hydro Flask Store",
    category: "Sports",
    inStock: true,
    stock: 300,
    description: "Our 32 oz Wide Mouth bottle is the perfect size for all-day hydration. Tempshield™ double-wall vacuum insulation keeps your drinks cold for up to 24 hours.",
    variants: [{ label: "Color", options: ["Pacific", "Lava", "Olive", "Stone"] }]
  }
]

// ============ INITIAL STATE ============

export const defaultUser: User = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  dateJoined: "March 2024",
  avatar: null,
  memberTier: "Gold",
  rewardPoints: 2450,
  isLoggedIn: false,
}

export const defaultNotifications: Notification[] = [
  { id: "1", title: "Order Shipped", message: "Your MacBook Pro order has been shipped!", time: "2 hours ago", read: false, type: "order" },
  { id: "2", title: "Flash Sale", message: "Up to 70% off on electronics - ends tonight!", time: "5 hours ago", read: false, type: "promo" },
  { id: "3", title: "Price Drop Alert", message: "Sony WH-1000XM5 price dropped to $298", time: "1 day ago", read: true, type: "promo" },
]

// ============ STORE CONTEXT ============

export interface StoreState {
  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number, variants?: Record<string, string>) => void
  removeFromCart: (productId: number) => void
  updateCartQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number

  // Wishlist
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean

  // Auth
  user: User
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, password: string) => boolean
  logout: () => void
  updateProfile: (updates: Partial<User>) => void

  // Notifications
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  unreadCount: number

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: Product[]

  // Orders
  orders: Order[]
  addOrder: (order: Order) => void

  // Toast
  toasts: ToastMessage[]
  showToast: (message: string, type?: "success" | "error" | "info") => void

  // Mobile
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export interface ToastMessage {
  id: string
  message: string
  type: "success" | "error" | "info"
}

export const StoreContext = createContext<StoreState | null>(null)

export function useStore(): StoreState {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
