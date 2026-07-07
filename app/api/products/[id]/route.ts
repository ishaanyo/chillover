import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct, generateSlug } from '@/lib/products';
import { revalidatePath } from 'next/cache';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();

    // Normalize subcategoryId: allow explicit null/empty string to clear it
    if ('subcategoryId' in body) {
      body.subcategoryId = body.subcategoryId || null;
    }
    // Normalize slug if provided
    if (body.slug && body.slug.trim()) {
      body.slug = generateSlug(body.slug);
    } else {
      delete body.slug; // don't overwrite existing slug with empty value
    }

    const updated = await updateProduct(id, body);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    revalidatePath('/', 'layout');

    return NextResponse.json({ product: updated });
  } catch (e: any) {
    console.error("API Update Product Error:", e);
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const deleted = await deleteProduct(id);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
