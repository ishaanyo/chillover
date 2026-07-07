import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductsByCategory, createProduct, generateSlug } from '@/lib/products';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

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
    const { name, slug, category, subcategoryId, price, originalPrice, description, shortDesc, images, variants, features, fabric, fit, badge, isNew, isFeatured, isBestseller, tags } = body;

    if (!name || !category || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const productData = {
      name,
      category,
      subcategoryId: subcategoryId || null,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      description: description || '',
      shortDesc: shortDesc || '',
      slug: (slug && slug.trim()) ? generateSlug(slug) : generateSlug(name),
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

    const created = await createProduct(productData);

    revalidatePath('/', 'layout');

    return NextResponse.json({ product: created }, { status: 201 });
  } catch (e: any) {
    console.error("API Create Product Error:", e);
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
