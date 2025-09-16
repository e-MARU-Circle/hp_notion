import { fetchWithRetry } from './fetchWithRetry';

/**
 * Notionデータベースから公開済みの記事一覧を取得する (fetchWithRetry使用)
 */
export const getPublishedPages = async () => {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const apiKey = process.env.NOTION_API_KEY;

  if (!databaseId || !apiKey) {
    throw new Error('NotionのAPIキーまたはデータベースIDが設定されていません。');
  }

  const response = await fetchWithRetry(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28', // Notion APIのバージョン
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // 本番環境ではフィルターを有効にする
      filter: {
        property: '公開状態',
        status: {
          equals: '公開済み',
        },
      },
      // sorts: [
      //   {
      //     property: 'Date',
      //     direction: 'descending',
      //   },
      // ],
    }),
    // Next.jsのキャッシュ機能を無効化して常に最新のデータを取得する
    // cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Notion APIエラー:', error);
    throw new Error(`Notion APIからのデータ取得に失敗しました: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};