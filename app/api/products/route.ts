import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductsByCategory, createProduct, generateSlug } from '@/lib/products';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  
  // 1. Added await and used our DB category filter
  let products;
  if (category && category !== 'all') {
    products = await getProductsByCategory(category);
  } else {
    products = await getProducts();
  }
  
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, price, originalPrice, description, shortDesc, images, variants, features, fabric, fit, badge, isNew, isFeatured, isBestseller, tags } = body;

    if (!name || !category || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. We removed the manual ID generation! Prisma handles it now.
    const productData = {
      name, 
      category, 
      price: Number(price), 
      originalPrice: Number(originalPrice || price),
      description: description || '', 
      shortDesc: shortDesc || '',
      slug: generateSlug(name),
      images: images || [],
      variants: variants || [],
      features: features || [],
      fabric: fabric || '100% Combed Cotton, 240 GSM',
      fit: fit || 'Oversized',
      badge: badge || undefined,
      isNew: Boolean(isNew), 
      isFeatured: Boolean(isFeatured), 
      isBestseller: Boolean(isBestseller),
      tags: tags || [],
    };

    // 3. Added 'await' to safely save to Neon
    const created = await createProduct(productData);
    
    // 4. THE CACHE BUSTER: Tells Next.js to immediately refresh the store pages!
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ product: created }, { status: 201 });
  } catch (e) {
    console.error("API Create Product Error:", e);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}