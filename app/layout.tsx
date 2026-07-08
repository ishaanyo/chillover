import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cartContext';
import { WishlistProvider } from '@/lib/wishlistContext';
import { ToastProvider } from '@/components/ui/Toast';
import AuthProvider from '@/components/providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import CartDrawer from '@/components/layout/CartDrawer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/ui/FloatingButtons';

export const metadata: Metadata = {
  title: { default: 'ChillOver — Premium Oversized T-Shirts', template: '%s | ChillOver' },
  description: 'Premium oversized printed t-shirts for men & women. Bold graphics, 240 GSM cotton, street-ready fits. Free shipping above ₹999.',
  keywords: ['oversized t-shirts india', 'mens oversized tee', 'womens oversized tee', 'printed tshirts', 'streetwear india', 'chillover'],
  openGraph: {
    type: 'website',
    siteName: 'ChillOver',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: '#0a0a0a', color: '#f5f2ed', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <AnnouncementBar />
                <Navbar />
                <main style={{ flex: 1 }}>{children}</main>
                <Footer />
                <CartDrawer />
                <FloatingButtons />
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
