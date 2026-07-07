import { NextResponse } from 'next/server';
import { getSubcategories, createSubcategory } from '@/lib/subcategories';
import { generateSlug } from '@/lib/products';

// GET /api/subcategories               -> all subcategories
// GET /api/subcategories?category=men  -> subcategories for a main category
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const all = await getSubcategories();
    const result = category
      ? all.filter(s => s.mainCategory.toLowerCase() === category.toLowerCase())
      : all;

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch subcategories.' }, { status: 500 });
  }
}

// POST /api/subcategories  -> create a new subcategory
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name ?? '').trim();
    const mainCategory = (body.mainCategory ?? '').trim().toLowerCase();

    if (!name || !mainCategory) {
      return NextResponse.json({ error: 'Name and main category are required.' }, { status: 400 });
    }
    if (!['men', 'women'].includes(mainCategory)) {
      return NextResponse.json({ error: 'Main category must be "men" or "women".' }, { status: 400 });
    }

    const slug = (body.slug?.trim() || generateSlug(name));

    const subcategory = await createSubcategory({ name, slug, mainCategory });
    return NextResponse.json(subcategory, { status: 201 });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A subcategory with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create subcategory.' }, { status: 500 });
  }
}
