import { Product } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Noise Cancelled',
    slug: 'noise-cancelled',
    category: 'men',
    price: 799,
    originalPrice: 1199,
    description: 'Block out the world in this ultra-soft drop-shoulder tee. Features a bold graphic front print with distressed typography that speaks to those who prefer silence. The 240 GSM combed cotton ensures this tee stays with you season after season without losing shape or color.',
    shortDesc: 'Drop-shoulder boxy tee with distressed typography graphic.',
    images: [
      { id: '1a', url: '/images/placeholder-1.svg', alt: 'Noise Cancelled Front', order: 0 },
      { id: '1b', url: '/images/placeholder-2.svg', alt: 'Noise Cancelled Back', order: 1 },
      { id: '1c', url: '/images/placeholder-3.svg', alt: 'Noise Cancelled Detail', order: 2 },
      { id: '1d', url: '/images/placeholder-4.svg', alt: 'Noise Cancelled Fit', order: 3 },
    ],
    variants: [
      { size: 'S', stock: 12 }, { size: 'M', stock: 8 }, { size: 'L', stock: 15 },
      { size: 'XL', stock: 5 }, { size: 'XXL', stock: 3 },
    ],
    features: ['240 GSM Cotton', 'Screenprint', 'Drop Shoulder', 'Pre-shrunk', 'Ribbed Collar'],
    fabric: '100% Combed Cotton, 240 GSM',
    fit: 'Oversized / Boxy',
    badge: 'Bestseller',
    isNew: false, isFeatured: true, isBestseller: true,
    tags: ['graphic', 'oversized', 'street'],
    createdAt: '2024-12-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Chill Mode: ON',
    slug: 'chill-mode-on',
    category: 'men',
    price: 849,
    originalPrice: 1299,
    description: 'Embrace maximum comfort with this boxy cold-toned graphic tee. Perfect for days when you\'d rather do absolutely nothing. The oversized silhouette pairs with anything — joggers, wide-leg denims, or shorts. A true statement piece from ChillOver\'s signature drop.',
    shortDesc: 'Cold-toned boxy graphic tee for ultimate comfort.',
    images: [
      { id: '2a', url: '/images/placeholder-2.svg', alt: 'Chill Mode Front', order: 0 },
      { id: '2b', url: '/images/placeholder-3.svg', alt: 'Chill Mode Back', order: 1 },
      { id: '2c', url: '/images/placeholder-4.svg', alt: 'Chill Mode Detail', order: 2 },
    ],
    variants: [
      { size: 'S', stock: 10 }, { size: 'M', stock: 14 }, { size: 'L', stock: 9 },
      { size: 'XL', stock: 6 }, { size: 'XXL', stock: 2 },
    ],
    features: ['240 GSM Cotton', 'DTG Print', 'Boxy Fit', 'Ribbed Collar', 'Side Seams'],
    fabric: '100% Combed Cotton, 240 GSM',
    fit: 'Boxy Oversized',
    badge: 'New In',
    isNew: true, isFeatured: true, isBestseller: false,
    tags: ['graphic', 'oversized', 'boxy'],
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Do Not Disturb',
    slug: 'do-not-disturb',
    category: 'women',
    price: 799,
    originalPrice: 1099,
    description: 'A dreamy midnight-vibes tee with a soft touch finish. The drop shoulder cut is made to be worn off-shoulder or with a belt for a more fitted look. This tee is as versatile as it is cool — from coffee runs to late-night outings.',
    shortDesc: 'Midnight vibes drop-shoulder tee with soft touch finish.',
    images: [
      { id: '3a', url: '/images/placeholder-3.svg', alt: 'DND Front', order: 0 },
      { id: '3b', url: '/images/placeholder-1.svg', alt: 'DND Back', order: 1 },
      { id: '3c', url: '/images/placeholder-2.svg', alt: 'DND Detail', order: 2 },
      { id: '3d', url: '/images/placeholder-4.svg', alt: 'DND Styled', order: 3 },
    ],
    variants: [
      { size: 'XS', stock: 7 }, { size: 'S', stock: 11 }, { size: 'M', stock: 13 },
      { size: 'L', stock: 8 }, { size: 'XL', stock: 4 },
    ],
    features: ['240 GSM Cotton', 'Glow Print', 'Drop Shoulder', 'Hand-finished', 'Soft Wash'],
    fabric: '100% Combed Cotton, 240 GSM',
    fit: 'Drop Shoulder Oversized',
    badge: 'Hot',
    isNew: false, isFeatured: true, isBestseller: true,
    tags: ['graphic', 'oversized', 'women', 'night'],
    createdAt: '2024-11-20T00:00:00Z',
  },
  {
    id: '4',
    name: 'Sun Chaser',
    slug: 'sun-chaser',
    category: 'women',
    price: 899,
    originalPrice: 1299,
    description: 'Golden hour energy, all day long. Warm-toned sunset graphic on a cream base — your next Instagram fit. The relaxed cut with side slits makes it perfect for tucking in or wearing free. This one is made for the golden-hour chaser in you.',
    shortDesc: 'Warm sunset graphic on cream base with side slits.',
    images: [
      { id: '4a', url: '/images/placeholder-4.svg', alt: 'Sun Chaser Front', order: 0 },
      { id: '4b', url: '/images/placeholder-2.svg', alt: 'Sun Chaser Back', order: 1 },
      { id: '4c', url: '/images/placeholder-1.svg', alt: 'Sun Chaser Detail', order: 2 },
    ],
    variants: [
      { size: 'XS', stock: 5 }, { size: 'S', stock: 9 }, { size: 'M', stock: 12 },
      { size: 'L', stock: 7 },
    ],
    features: ['240 GSM Cotton', 'Pigment Dye', 'Relaxed Fit', 'Side Slits', 'Raw Hem'],
    fabric: '100% Combed Cotton, 240 GSM',
    fit: 'Relaxed Oversized',
    badge: 'New In',
    isNew: true, isFeatured: false, isBestseller: false,
    tags: ['graphic', 'oversized', 'women', 'summer'],
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Blank Canvas',
    slug: 'blank-canvas',
    category: 'men',
    price: 699,
    originalPrice: 999,
    description: 'Sometimes less is more. This minimal-print tee is for people who let their confidence do the talking. A subtle embroidered ChillOver logo on the chest is the only statement needed. Enzyme-washed for an ultra-soft, worn-in feel from day one.',
    shortDesc: 'Minimal embroidered logo tee, enzyme-washed for softness.',
    images: [
      { id: '5a', url: '/images/placeholder-1.svg', alt: 'Blank Canvas Front', order: 0 },
      { id: '5b', url: '/images/placeholder-3.svg', alt: 'Blank Canvas Back', order: 1 },
    ],
    variants: [
      { size: 'S', stock: 20 }, { size: 'M', stock: 18 }, { size: 'L', stock: 16 },
      { size: 'XL', stock: 12 }, { size: 'XXL', stock: 8 },
    ],
    features: ['240 GSM Cotton', 'Embroidered Logo', 'Enzyme Washed', 'Oversized', 'Double Stitched'],
    fabric: '100% Combed Cotton, 240 GSM',
    fit: 'Classic Oversized',
    badge: undefined,
    isNew: false, isFeatured: false, isBestseller: false,
    tags: ['minimal', 'oversized', 'essentials'],
    createdAt: '2024-10-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Chaos Theory',
    slug: 'chaos-theory',
    category: 'men',
    price: 949,
    originalPrice: 1399,
    description: 'Only 50 pieces made. Bold all-over graphic inspired by glitch art and chaos mathematics. The print covers the entire tee — front, back, and sleeves. Once it\'s gone, it\'s gone. This is not a restock item. Wear it knowing you have something truly one-of-a-kind.',
    shortDesc: 'Limited all-over glitch art print. Only 50 pieces ever.',
    images: [
      { id: '6a', url: '/images/placeholder-2.svg', alt: 'Chaos Theory Front', order: 0 },
      { id: '6b', url: '/images/placeholder-4.svg', alt: 'Chaos Theory Back', order: 1 },
      { id: '6c', url: '/images/placeholder-1.svg', alt: 'Chaos Theory Detail', order: 2 },
    ],
    variants: [
      { size: 'M', stock: 2 }, { size: 'L', stock: 1 }, { size: 'XL', stock: 3 },
    ],
    features: ['240 GSM Cotton', 'All-Over Print', 'Limited Edition', 'Heavyweight', 'Numbered'],
    fabric: '100% Combed Cotton, 240 GSM',
    fit: 'Ultra Boxy Oversized',
    badge: 'Limited',
    isNew: true, isFeatured: true, isBestseller: false,
    tags: ['limited', 'graphic', 'oversized', 'art'],
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: '7',
    name: 'Soft Hours',
    slug: 'soft-hours',
    category: 'women',
    price: 849,
    originalPrice: 1199,
    description: 'Feminine meets streetwear. Floral-inspired graphic on a washed black base. Pairs perfectly with wide-leg pants or oversized denim shorts. The soft wash treatment gives this tee a vintage feel while keeping the print crisp and vibrant.',
    shortDesc: 'Floral graphic on washed black. Feminine meets street.',
    images: [
      { id: '7a', url: '/images/placeholder-3.svg', alt: 'Soft Hours Front', order: 0 },
      { id: '7b', url: '/images/placeholder-1.svg', alt: 'Soft Hours Back', order: 1 },
      { id: '7c', url: '/images/placeholder-2.svg', alt: 'Soft Hours Detail', order: 2 },
      { id: '7d', url: '/images/placeholder-4.svg', alt: 'Soft Hours Styled', order: 3 },
    ],
    variants: [
      { size: 'XS', stock: 6 }, { size: 'S', stock: 14 }, { size: 'M', stock: 10 },
      { size: 'L', stock: 8 }, { size: 'XL', stock: 3 },
    ],
    features: ['240 GSM Cotton', 'Floral DTG', 'Washed Finish', 'Dropped Hem', 'Soft Touch'],
    fabric: '100% Combed Cotton, 240 GSM',
    fit: 'Relaxed Drop Shoulder',
    badge: 'Bestseller',
    isNew: false, isFeatured: true, isBestseller: true,
    tags: ['floral', 'oversized', 'women', 'soft'],
    createdAt: '2024-11-01T00:00:00Z',
  },
  {
    id: '8',
    name: 'Night Owl',
    slug: 'night-owl',
    category: 'unisex',
    price: 999,
    originalPrice: 1499,
    description: 'For those who come alive after midnight. Unisex fit that works for all genders. Our heaviest tee yet at 240 GSM. The glow-in-the-dark ink makes this one special — wear it into the night and watch it come alive. This tee is a conversation starter wherever you go.',
    shortDesc: 'Glow-in-dark unisex tee. Our heaviest and boldest drop.',
    images: [
      { id: '8a', url: '/images/placeholder-4.svg', alt: 'Night Owl Front', order: 0 },
      { id: '8b', url: '/images/placeholder-2.svg', alt: 'Night Owl Back', order: 1 },
      { id: '8c', url: '/images/placeholder-3.svg', alt: 'Night Owl Glow', order: 2 },
    ],
    variants: [
      { size: 'S', stock: 8 }, { size: 'M', stock: 12 }, { size: 'L', stock: 10 },
      { size: 'XL', stock: 6 }, { size: 'XXL', stock: 4 },
    ],
    features: ['240 GSM Cotton', 'Glow-in-Dark Print', 'Unisex Fit', 'Ultra Boxy', 'Pre-washed'],
    fabric: '100% Combed Cotton, 240 GSM',
    fit: 'Unisex Ultra Boxy',
    badge: 'New In',
    isNew: true, isFeatured: true, isBestseller: false,
    tags: ['glow', 'unisex', 'oversized', 'night'],
    createdAt: '2025-02-15T00:00:00Z',
  },
];

// Server-side in-memory store (resets on server restart; replace with DB in production)
let productStore: Product[] = [...INITIAL_PRODUCTS];

export function getProducts(): Product[] {
  return productStore;
}

export function getProductBySlug(slug: string): Product | undefined {
  return productStore.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return productStore.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return productStore;
  return productStore.filter(p => p.category === category || p.category === 'unisex');
}

export function createProduct(product: Product): Product {
  productStore.push(product);
  return product;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const idx = productStore.findIndex(p => p.id === id);
  if (idx === -1) return null;
  productStore[idx] = { ...productStore[idx], ...updates };
  return productStore[idx];
}

export function deleteProduct(id: string): boolean {
  const prev = productStore.length;
  productStore = productStore.filter(p => p.id !== id);
  return productStore.length < prev;
}

export function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
