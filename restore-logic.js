const fs = require('fs');

const replaces = [
  {
    file: 'd:/jcer/app/(customer)/page.tsx',
    find: 'const { user, addToCart, addToWishlist, isInWishlist } = useStore()',
    replace: 'const { user, addToCart, addToWishlist, isInWishlist, getAllProducts } = useStore()\n  const allProducts = getAllProducts()'
  },
  {
    file: 'd:/jcer/app/(customer)/page.tsx',
    find: 'import { useStore, allProducts } from "@/lib/store"',
    replace: 'import { useStore } from "@/lib/store"'
  },
  {
    file: 'd:/jcer/app/(customer)/search/page.tsx',
    find: 'const { addToCart, showToast } = useStore()',
    replace: 'const { addToCart, showToast, getAllProducts } = useStore()\n  const allProducts = getAllProducts()'
  },
  {
    file: 'd:/jcer/app/(customer)/search/page.tsx',
    find: 'import { useStore, allProducts } from "@/lib/store"',
    replace: 'import { useStore } from "@/lib/store"'
  },
  {
    file: 'd:/jcer/app/(customer)/deals/page.tsx',
    find: 'const { addToCart } = useStore()',
    replace: 'const { addToCart, getAllProducts } = useStore()\n  const allProducts = getAllProducts()'
  },
  {
    file: 'd:/jcer/app/(customer)/deals/page.tsx',
    find: 'import { useStore, allProducts } from "@/lib/store"',
    replace: 'import { useStore } from "@/lib/store"'
  },
  {
    file: 'd:/jcer/app/(customer)/orders/page.tsx',
    find: 'const { orders, addToCart, showToast } = useStore()\n  const [activeFilter, setActiveFilter] = useState("All Orders")',
    replace: 'const { orders, addToCart, showToast, getAllProducts } = useStore()\n  const [activeFilter, setActiveFilter] = useState("All Orders")\n  const allProducts = getAllProducts()'
  },
  {
    file: 'd:/jcer/app/(customer)/orders/page.tsx',
    find: 'import { useStore, allProducts } from "@/lib/store"',
    replace: 'import { useStore } from "@/lib/store"'
  },
  {
    file: 'd:/jcer/app/(customer)/rewards/page.tsx',
    find: 'import { useStore, allProducts } from "@/lib/store"',
    replace: 'import { useStore } from "@/lib/store"'
  },
  {
    file: 'd:/jcer/app/(customer)/product/[id]/page.tsx',
    find: 'const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore()',
    replace: 'const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, getAllProducts } = useStore()\n  const allProducts = getAllProducts()'
  },
  {
    file: 'd:/jcer/app/(customer)/product/[id]/page.tsx',
    find: 'import { useStore, allProducts } from "@/lib/store"',
    replace: 'import { useStore } from "@/lib/store"'
  }
];

for (const rep of replaces) {
  if (fs.existsSync(rep.file)) {
    let content = fs.readFileSync(rep.file, 'utf8');
    content = content.replace(rep.find, rep.replace);
    fs.writeFileSync(rep.file, content);
  }
}
console.log('Restored dynamic product logic');
