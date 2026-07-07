import { NextResponse } from 'next/server';
import { updateSubcategory, deleteSubcategory } from '@/lib/subcategories';

// PUT /api/subcategories/:id -> update name / slug / mainCategory
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const data: any = {};
    if (body.name !== undefined) data.name = body.name.trim();
    if (body.slug !== undefined) data.slug = body.slug.trim();
    if (body.mainCategory !== undefined) data.mainCategory = body.mainCategory.trim().toLowerCase();

    const subcategory = await updateSubcategory(id, data);
    return NextResponse.json(subcategory);
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A subcategory with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update subcategory.' }, { status: 500 });
  }
}

// DELETE /api/subcategories/:id
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await deleteSubcategory(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete subcategory.' }, { status: 500 });
  }
}
