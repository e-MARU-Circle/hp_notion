import { NextRequest, NextResponse } from 'next/server';
import { fetchWithRetry } from '@/lib/fetchWithRetry';

const NOTION_VERSION = '2022-06-28';

async function fetchPageBlocks(pageId: string, apiKey: string) {
  const accumulated: unknown[] = [];
  let cursor: string | undefined;
  let firstRequest = true;

  do {
    const search = cursor ? `?start_cursor=${cursor}` : '';
    const response = await fetchWithRetry(
      `https://api.notion.com/v1/blocks/${pageId}/children${search}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Notion-Version': NOTION_VERSION,
        },
        next: firstRequest ? { revalidate: 60 } : undefined,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Notion API エラー (blocks):', error);
      return NextResponse.json(
        { error: 'ページコンテンツの取得に失敗しました。' },
        { status: response.status }
      );
    }

    const data = await response.json();
    accumulated.push(...(Array.isArray(data.results) ? data.results : []));
    cursor = data.has_more ? data.next_cursor ?? undefined : undefined;
    firstRequest = false;
  } while (cursor);

  return NextResponse.json(accumulated);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await context.params;
  const apiKey = process.env.NOTION_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Notion APIキーが設定されていません。' },
      { status: 500 }
    );
  }

  try {
    return await fetchPageBlocks(pageId, apiKey);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'サーバー内部でエラーが発生しました。' },
      { status: 500 }
    );
  }
}
