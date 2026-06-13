import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const uploaded: { id: string; url: string; alt: string; order: number }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const allowed = ['jpg', 'jpeg', 'png', 'webp'];
      if (!allowed.includes(ext)) continue;

      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const bytes = await file.arrayBuffer();
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

      uploaded.push({
        id: `img-${Date.now()}-${i}`,
        url: `/uploads/${filename}`,
        alt: file.name.replace(/\.[^/.]+$/, ''),
        order: i,
      });
    }

    return NextResponse.json({ images: uploaded });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
