import { NextResponse } from 'next/server';
import { getPublishedPages } from '@/lib/notion';

/**
 * GET /api/get-pages
 * Notionデータベースから記事一覧を取得する
 */
export async function GET() {
  try {
    const pages = await getPublishedPages();
    return NextResponse.json(pages);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: '記事一覧の取得に失敗しました。' },
      { status: 500 }
    );
  }
}
