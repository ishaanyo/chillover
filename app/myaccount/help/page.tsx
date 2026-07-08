import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Help & Support | ChillOver' };

const FAQS = [
  { q: 'How do I check the status of my order?', a: 'Go to My Orders in your account dashboard. Each order shows its current status — Confirmed, Shipped, or Delivered — along with a live tracker.' },
  { q: 'What is your return policy?', a: 'We offer 7-day easy returns from the date of delivery, as long as the item is unused and has its original tags.' },
  { q: 'How long does delivery take?', a: 'Orders are shipped within 24 hours from our Jaipur warehouse. Delivery usually takes 3–7 business days depending on your location.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI, all major credit/debit cards, net banking, and EMI options via Razorpay.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled before they are shipped. Contact us via email or WhatsApp with your order number and we\u2019ll take care of it right away.' },
];

export default function HelpSupportPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.3rem' }}>
        Help &amp; Support
      </h1>
      <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '2rem' }}>We&apos;re here to help. Reach out anytime.</p>

      {/* Contact options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <a href="mailto:support@chillover.in" style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.6rem' }}>📧</span>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Email Us</p>
            <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>support@chillover.in</p>
          </div>
        </a>
        <a href="https://wa.me/918058560817" target="_blank" rel="noopener noreferrer" style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.6rem' }}>💬</span>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>WhatsApp Us</p>
            <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>We&apos;re here 24/7</p>
          </div>
        </a>
        <a href="tel:+918058560817" style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.6rem' }}>📞</span>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Call Us</p>
            <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>+91 80585 60817</p>
          </div>
        </a>
      </div>

      {/* FAQs */}
      <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)' }}>
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(245,242,237,0.07)' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Frequently Asked Questions</h2>
        </div>
        {FAQS.map((faq, i) => (
          <details key={i} style={{ padding: '1.1rem 1.5rem', borderBottom: i < FAQS.length - 1 ? '1px solid rgba(245,242,237,0.05)' : 'none' }}>
            <summary style={{ fontSize: '0.88rem', cursor: 'pointer', color: '#f5f2ed', listStyle: 'none' }}>{faq.q}</summary>
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.7rem', lineHeight: 1.6 }}>{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
