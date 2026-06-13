# ChillOver — Next.js E-Commerce

Premium oversized t-shirt store built with **Next.js 16 App Router**, TypeScript, and Razorpay.

## Quick Start
```bash
npm install
npm run dev
```
- Store: http://localhost:3000
- Admin: http://localhost:3000/admin

## Razorpay Setup
Replace `rzp_test_XXXXXXXXXXXX` in:
- `components/layout/CartDrawer.tsx`
- `app/cart/page.tsx`

## Routes
| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/shop/men` | Men's category listing |
| `/shop/women` | Women's category listing |
| `/shop/all` | All products |
| `/shop/[category]/[slug]` | Product detail + vertical slider |
| `/cart` | Full cart page |
| `/admin` | Dashboard |
| `/admin/products` | Product table |
| `/admin/products/new` | Add product |
| `/admin/products/[id]` | Edit product |

## Production Notes
- Replace in-memory store (`lib/products.ts`) with Prisma/MongoDB/Supabase
- Replace local image upload with Cloudinary/S3
- Add `.env.local` for secrets

Made in Jaipur 🌶
