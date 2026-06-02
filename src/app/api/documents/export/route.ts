import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    const format = searchParams.get('format') || 'docx';

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), 'uploads', fileName);

    try {
      const fileBuffer = await readFile(filePath);
      const contentTypes: Record<string, string> = {
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        pdf: 'application/pdf',
        html: 'text/html',
      };

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentTypes[format] || contentTypes.docx,
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export file' },
      { status: 500 }
    );
  }
}
