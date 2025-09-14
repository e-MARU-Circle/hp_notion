import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { pageId: string } }
) {
  const pageId = context.params.pageId;
  const apiKey = process.env.NOTION_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Notion APIキーが設定されていません。' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
        },
        // ISR (Incremental Static Regeneration) の設定
        next: { revalidate: 60 }, // 60秒ごとにキャッシュを再検証
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
    return NextResponse.json(data.results);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'サーバー内部でエラーが発生しました。' },
      { status: 500 }
    );
  }
}
