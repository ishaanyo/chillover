import NewsletterForm from '@/components/home/NewsletterForm';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/product/ProductCard';
import HeroTicker from '@/components/home/HeroTicker';
import HeroTShirtSlider from '@/components/home/HeroTShirtSlider';

// 1. Added 'async' here
export default async function HomePage() {
  // 2. Added 'await' here
  const products = await getProducts();
  
  const featured = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  
  return (
    <div>
      {/* HERO */}
      <HeroTShirtSlider />

      <HeroTicker />

      {/* CATEGORIES */}
      <section style={{ background:'#1a1a1a',padding:'5rem 2.5rem' }}>
        <div style={{ maxWidth:'1200px',margin:'0 auto' }}>
          <p style={{ fontFamily:'var(--font-mono)',fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'#ff3c1e',marginBottom:'0.5rem' }}>Shop By Category</p>
          <h2 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,5vw,4rem)',letterSpacing:'0.03em',textTransform:'uppercase',marginBottom:'2rem' }}>Find Your Fit</h2>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem' }}>
            {[{label:'Men',sub:'Oversized boxy cuts · S to 3XL',href:'/men',color:'#4af',bg:'linear-gradient(135deg,#0a0a14,#0d1520)',emoji:'👕'},{label:'Women',sub:'Drop-shoulder fits · XS to 2XL',href:'/women',color:'#f8a',bg:'linear-gradient(135deg,#14080a,#1a0d10)',emoji:'🌸'}].map(cat=>(
              <Link key={cat.label} href={cat.href} style={{ textDecoration:'none',position:'relative',overflow:'hidden',minHeight:'340px',display:'flex',alignItems:'flex-end',border:'1px solid rgba(245,242,237,0.07)',background:cat.bg }}>
                <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10rem',opacity:0.07 }}>{cat.emoji}</div>
                <div style={{ position:'relative',zIndex:1,padding:'2rem',background:'linear-gradient(to top,rgba(10,10,10,0.92) 0%,transparent 100%)',width:'100%' }}>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:'0.6rem',letterSpacing:'0.18em',textTransform:'uppercase',color:cat.color,border:`1px solid ${cat.color}`,padding:'0.2rem 0.6rem',display:'inline-block',marginBottom:'0.5rem' }}>New Drop</span>
                  <div style={{ fontFamily:'var(--font-display)',fontSize:'4rem',letterSpacing:'0.05em',textTransform:'uppercase',lineHeight:1,color:'#f5f2ed' }}>{cat.label}</div>
                  <div style={{ fontSize:'0.82rem',color:'#888',marginTop:'0.3rem',fontWeight:300 }}>{cat.sub}</div>
                  <div style={{ marginTop:'0.8rem',fontFamily:'var(--font-mono)',fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'#ff3c1e' }}>Shop {cat.label} →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ background:'#0a0a0a',padding:'5rem 2.5rem' }}>
        <div style={{ maxWidth:'1200px',margin:'0 auto' }}>
          <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem',marginBottom:'2.5rem' }}>
            <div>
              <p style={{ fontFamily:'var(--font-mono)',fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'#ff3c1e',marginBottom:'0.3rem' }}>Handpicked</p>
              <h2 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,5vw,4rem)',letterSpacing:'0.03em',textTransform:'uppercase',lineHeight:1 }}>Featured Picks</h2>
            </div>
            <Link href="/shop/all" style={{ fontFamily:'var(--font-mono)',fontSize:'0.65rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'#ff3c1e',textDecoration:'none' }}>View All →</Link>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.5rem' }}>
            {featured.map(p=><ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section style={{ background:'#1a1a1a',padding:'5rem 2.5rem' }}>
        <div style={{ maxWidth:'1200px',margin:'0 auto' }}>
          <p style={{ fontFamily:'var(--font-mono)',fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'#ff3c1e',marginBottom:'0.5rem' }}>Why ChillOver</p>
          <h2 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,5vw,4rem)',letterSpacing:'0.03em',textTransform:'uppercase',marginBottom:'2.5rem' }}>Built Different</h2>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'1.5rem' }}>
            {[['🧵','01','240 GSM Cotton','Premium combed cotton heavy enough to hold shape, soft enough to sleep in.'],['📐','02','True Oversized','Dropped shoulders, boxy silhouette — engineered for that effortlessly cool look.'],['🎨','03','Bold Graphics','Screenprinted and DTG designs that don\'t crack or fade. Washes after washes.'],['🚀','04','Fast Delivery','Ships from Jaipur within 24 hours. Express delivery available.']].map(([icon,num,title,text])=>(
              <div key={num} style={{ padding:'2rem',border:'1px solid rgba(245,242,237,0.07)',position:'relative',overflow:'hidden' }}>
                <span style={{ fontSize:'2rem',display:'block',marginBottom:'1rem' }}>{icon}</span>
                <div style={{ fontFamily:'var(--font-display)',fontSize:'1.4rem',letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:'0.5rem' }}>{title}</div>
                <p style={{ fontSize:'0.82rem',color:'#888',lineHeight:1.7,fontWeight:300 }}>{text}</p>
                <div style={{ position:'absolute',top:'1rem',right:'1.2rem',fontFamily:'var(--font-display)',fontSize:'4rem',color:'rgba(245,242,237,0.03)' }}>{num}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section style={{ background:'#0a0a0a',padding:'5rem 2.5rem' }}>
        <div style={{ maxWidth:'1200px',margin:'0 auto' }}>
          <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem',marginBottom:'2.5rem' }}>
            <div>
              <p style={{ fontFamily:'var(--font-mono)',fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'#ff3c1e',marginBottom:'0.3rem' }}>Just Dropped</p>
              <h2 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,5vw,4rem)',letterSpacing:'0.03em',textTransform:'uppercase',lineHeight:1 }}>New Arrivals</h2>
            </div>
            <Link href="/shop/all" style={{ fontFamily:'var(--font-mono)',fontSize:'0.65rem',letterSpacing:'0.12em',textTransform:'uppercase',color:'#ff3c1e',textDecoration:'none' }}>View All →</Link>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.5rem' }}>
            {newArrivals.map(p=><ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section id="about" style={{ background:'#1a1a1a',display:'grid',gridTemplateColumns:'1fr 1fr' }}>
        <div style={{ padding:'6rem 3.5rem',display:'flex',flexDirection:'column',justifyContent:'center' }}>
          <p style={{ fontFamily:'var(--font-mono)',fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'#ff3c1e',marginBottom:'0.5rem' }}>Our Story</p>
          <h2 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,5vw,4rem)',letterSpacing:'0.03em',textTransform:'uppercase',lineHeight:1,marginBottom:'1.5rem' }}>Born to Chill</h2>
          <p style={{ fontSize:'0.95rem',color:'#888',lineHeight:1.8,fontWeight:300,marginBottom:'1.2rem' }}>ChillOver started in a Jaipur garage with one idea — why can&apos;t every t-shirt feel like your favourite old one? We obsessed over GSM counts, shoulder drops, and ink pigments so you don&apos;t have to.</p>
          <p style={{ fontSize:'0.95rem',color:'#888',lineHeight:1.8,fontWeight:300,marginBottom:'2rem' }}>We&apos;re not fast fashion. Every drop is small, intentional, and built to outlast trends.</p>
          <Link href="/shop/all" style={{ display:'inline-block',background:'transparent',color:'#f5f2ed',fontFamily:'var(--font-mono)',fontSize:'0.72rem',letterSpacing:'0.12em',textTransform:'uppercase',padding:'0.9rem 2rem',border:'1px solid rgba(245,242,237,0.25)',textDecoration:'none',alignSelf:'flex-start' }}>Shop the Drop</Link>
        </div>
        <div style={{ background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',minHeight:'440px',position:'relative',overflow:'hidden' }}>
          <div style={{ fontFamily:'var(--font-display)',fontSize:'clamp(5rem,12vw,11rem)',lineHeight:0.85,color:'rgba(245,242,237,0.03)',textAlign:'center',position:'absolute',textTransform:'uppercase' }}>CHILL<br/>OVER</div>
          <div style={{ width:'240px',height:'240px',border:'2px solid rgba(255,60,30,0.2)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:1 }}>
            <div style={{ width:'160px',height:'160px',background:'rgba(255,60,30,0.07)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:'1rem',letterSpacing:'0.1em',textTransform:'uppercase',textAlign:'center',lineHeight:1.5,color:'#f5f2ed' }}>EST.<br/>2024<br/>JAIPUR</div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ background:'#0a0a0a',padding:'5rem 2.5rem' }}>
        <div style={{ maxWidth:'1200px',margin:'0 auto' }}>
          <p style={{ fontFamily:'var(--font-mono)',fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'#ff3c1e',marginBottom:'0.5rem' }}>Customer Love</p>
          <h2 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,5vw,4rem)',letterSpacing:'0.03em',textTransform:'uppercase',marginBottom:'2.5rem' }}>Real Chillers</h2>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'1.5rem' }}>
            {[{name:'Arjun Mehta',city:'Delhi',stars:5,text:'Literally the best oversized tee I\'ve bought. Print is crisp, fit is insane — wore it day 1 and got five compliments.'},{name:'Sneha Rathore',city:'Jaipur',stars:5,text:'I\'ve tried Bewakoof, Bear House — ChillOver fabric hits different. 240 GSM is no joke, it drapes perfectly.'},{name:'Rohan Verma',city:'Mumbai',stars:4,text:'Ordered 3 pieces. My friend got obsessed and placed her own order. Packaging is super premium too.'}].map(r=>(
              <div key={r.name} style={{ border:'1px solid rgba(245,242,237,0.07)',padding:'1.5rem' }}>
                <div style={{ color:'#ff3c1e',letterSpacing:'0.1em',fontSize:'0.9rem',marginBottom:'1rem' }}>{'★'.repeat(r.stars)}{'☆'.repeat(5-r.stars)}</div>
                <p style={{ fontSize:'0.88rem',color:'#e8e2d9',lineHeight:1.7,fontWeight:300,fontStyle:'italic',marginBottom:'1.2rem' }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ display:'flex',alignItems:'center',gap:'0.8rem' }}>
                  <div style={{ width:'36px',height:'36px',borderRadius:'50%',background:'#222',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:'1rem',color:'#ff3c1e' }}>{r.name[0]}</div>
                  <div>
                    <div style={{ fontWeight:500,fontSize:'0.85rem' }}>{r.name}</div>
                    <div style={{ fontFamily:'var(--font-mono)',fontSize:'0.6rem',letterSpacing:'0.08em',color:'#888' }}>{r.city} · Verified</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ background:'#ff3c1e',padding:'5rem 2.5rem',textAlign:'center' }}>
        <p style={{ fontFamily:'var(--font-mono)',fontSize:'0.65rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.6)',marginBottom:'0.5rem' }}>Stay in the Loop</p>
        <h2 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(2.5rem,5vw,4rem)',letterSpacing:'0.03em',textTransform:'uppercase',color:'#fff',marginBottom:'1rem' }}>New Drops First.</h2>
        <NewsletterForm />
      </section>
    </div>
  );
}