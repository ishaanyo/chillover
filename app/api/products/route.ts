import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct, generateSlug } from '@/lib/products';
import { Product } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const products = getProducts();
  const filtered = category && category !== 'all'
    ? products.filter(p => p.category === category || p.category === 'unisex')
    : products;
  return NextResponse.json({ products: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, price, originalPrice, description, shortDesc, images, variants, features, fabric, fit, badge, isNew, isFeatured, isBestseller, tags } = body;

    if (!name || !category || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product: Product = {
      id: Date.now().toString(),
      name, category, price: Number(price), originalPrice: Number(originalPrice || price),
      description: description || '', shortDesc: shortDesc || '',
      slug: generateSlug(name),
      images: images || [],
      variants: variants || [],
      features: features || [],
      fabric: fabric || '100% Combed Cotton, 240 GSM',
      fit: fit || 'Oversized',
      badge: badge || undefined,
      isNew: Boolean(isNew), isFeatured: Boolean(isFeatured), isBestseller: Boolean(isBestseller),
      tags: tags || [],
      createdAt: new Date().toISOString(),
    };

    const created = createProduct(product);
    return NextResponse.json({ product: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
