import { fetchWithRetry } from './fetchWithRetry';
import type { Page, BlockType } from './types';

const NOTION_VERSION = '2022-06-28';

function getCredentials() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const apiKey = process.env.NOTION_API_KEY;
  if (!databaseId || !apiKey) {
    throw new Error('NotionのAPIキーまたはデータベースIDが設定されていません。');
  }
  return { databaseId, apiKey };
}

function notionHeaders(apiKey: string) {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
}

/**
 * Notionデータベースから公開済みの記事一覧を取得する
 */
export async function getPublishedPages(): Promise<Page[]> {
  const { databaseId, apiKey } = getCredentials();

  const response = await fetchWithRetry(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: notionHeaders(apiKey),
    body: JSON.stringify({
      filter: {
        property: '公開状態',
        status: {
          equals: '公開済み',
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Notion APIエラー:', error);
    throw new Error(`Notion APIからのデータ取得に失敗しました: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results as Page[];
}

/**
 * Notion ページを単一取得（メタデータ）
 */
export async function getPageById(pageId: string): Promise<Page> {
  const { apiKey } = getCredentials();

  const response = await fetchWithRetry(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'GET',
    headers: notionHeaders(apiKey),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Notion APIエラー (page):', error);
    throw new Error(`ページ取得に失敗: ${response.statusText}`);
  }

  return (await response.json()) as Page;
}

/**
 * Notion ページのブロック（本文）を全件取得
 */
export async function getPageBlocks(pageId: string): Promise<BlockType[]> {
  const { apiKey } = getCredentials();
  const accumulated: BlockType[] = [];
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
      throw new Error(`ブロック取得に失敗: ${response.statusText}`);
    }

    const data = await response.json();
    accumulated.push(...(Array.isArray(data.results) ? data.results : []));
    cursor = data.has_more ? data.next_cursor ?? undefined : undefined;
    firstRequest = false;
  } while (cursor);

  return accumulated;
}

/**
 * 公開済みページの全IDを取得（sitemap用）
 */
export async function getAllPublishedPageIds(): Promise<{ id: string; contentType: string; lastEdited: string }[]> {
  const pages = await getPublishedPages();
  return pages.map((page) => ({
    id: page.id,
    contentType: page.properties.コンテンツタイプ?.select?.name || 'その他',
    lastEdited: page.last_edited_time,
  }));
}
