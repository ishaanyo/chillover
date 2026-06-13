import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploaded: { id: string; url: string; alt: string; order: number }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const allowed = ['jpg', 'jpeg', 'png', 'webp'];
      
      if (!allowed.includes(ext)) continue;

      // This is the magic line. Instead of saving to the local public folder,
      // it streams the file directly to your Vercel Blob cloud storage.
      const blob = await put(`products/${Date.now()}-${file.name}`, file, {
        access: 'public',
      });

      uploaded.push({
        id: `img-${Date.now()}-${i}`,
        url: blob.url, // Returns the permanent cloud URL
        alt: file.name.replace(/\.[^/.]+$/, ''),
        order: i,
      });
    }

    // Your frontend stays exactly the same, it still receives this expected format!
    return NextResponse.json({ images: uploaded });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}