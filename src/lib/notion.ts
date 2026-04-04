import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type { Page, BlockType } from './types';

// ── Notion クライアント（リトライ・レート制限は SDK が処理） ──

function getClient(): Client {
  const auth = process.env.NOTION_API_KEY;
  if (!auth) {
    throw new Error('NotionのAPIキーが設定されていません。');
  }
  return new Client({ auth });
}

function getDatabaseId(): string {
  const id = process.env.NOTION_DATABASE_ID;
  if (!id) {
    throw new Error('NotionのデータベースIDが設定されていません。');
  }
  return id;
}

// ── ヘルパー: SDK レスポンス → 既存 Page 型 ──

function toPage(raw: PageObjectResponse): Page {
  return {
    id: raw.id,
    last_edited_time: raw.last_edited_time,
    properties: raw.properties as unknown as Page['properties'],
  };
}

// ── データソースID取得（DB retrieve → data_sources[0].id） ──

let cachedDataSourceId: string | undefined;

async function getDataSourceId(): Promise<string> {
  if (cachedDataSourceId) return cachedDataSourceId;

  const notion = getClient();
  const db = await notion.databases.retrieve({ database_id: getDatabaseId() });

  if (!('data_sources' in db) || db.data_sources.length === 0) {
    throw new Error('データベースからデータソースIDを取得できません。');
  }

  cachedDataSourceId = db.data_sources[0].id;
  return cachedDataSourceId;
}

// ── 公開済みページ一覧（ページネーション対応） ──

export async function getPublishedPages(): Promise<Page[]> {
  const notion = getClient();
  const dataSourceId = await getDataSourceId();

  const pages: Page[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: '公開状態',
        status: { equals: '公開済み' },
      },
      start_cursor: cursor,
    });

    for (const result of response.results) {
      if ('properties' in result) {
        pages.push(toPage(result as PageObjectResponse));
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages;
}

// ── 単一ページ取得 ──

export async function getPageById(pageId: string): Promise<Page> {
  const notion = getClient();
  const raw = await notion.pages.retrieve({ page_id: pageId });

  if (!('properties' in raw)) {
    throw new Error(`ページ ${pageId} の取得結果が不正です`);
  }

  return toPage(raw as PageObjectResponse);
}

// ── ブロック全件取得（ページネーション対応） ──

export async function getPageBlocks(pageId: string): Promise<BlockType[]> {
  const notion = getClient();
  const blocks: BlockType[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });

    for (const block of response.results) {
      if ('type' in block) {
        blocks.push(block as unknown as BlockType);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

// ── sitemap 用 ──

export async function getAllPublishedPageIds(): Promise<
  { id: string; contentType: string; lastEdited: string }[]
> {
  const pages = await getPublishedPages();
  return pages.map((page) => ({
    id: page.id,
    contentType: page.properties.コンテンツタイプ?.select?.name || 'その他',
    lastEdited: page.last_edited_time,
  }));
}
