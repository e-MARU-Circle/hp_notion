import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPageById, getPageBlocks, getPublishedPages } from '@/lib/notion';
import { NotionContent } from '@/components/NotionBlock';
import { ScholarlyArticleJsonLd } from '@/components/JsonLd';
import { extractTitle, extractJpTitle, tagColorMap } from '@/lib/types';
import type { MultiSelectTag } from '@/lib/types';

interface Props {
  params: Promise<{ pageId: string }>;
}

// On-demand ISR (webhook) + 1時間フォールバック
export const revalidate = 3600;

// ビルド時に静的生成するパスを定義
export async function generateStaticParams() {
  try {
    const pages = await getPublishedPages();
    return pages
      .filter((p) => {
        const ct = p.properties.コンテンツタイプ?.select?.name || '';
        return !/member/i.test(ct) && !ct.includes('メンバー');
      })
      .map((page) => ({ pageId: page.id }));
  } catch {
    return [];
  }
}

// 動的メタデータ生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageId } = await params;
  try {
    const page = await getPageById(pageId);
    const title = extractTitle(page.properties) || 'ABOJC 論文紹介';
    const jpTitle = extractJpTitle(page.properties);
    const keywords = page.properties.キーワード?.multi_select?.map((t) => t.name) || [];
    const description = jpTitle
      ? `${jpTitle} — ABOJCによる論文レビュー`
      : `${title} — ABOJCによる論文レビュー`;

    return {
      title: `${jpTitle || title} | ABOJC`,
      description,
      keywords: keywords.join(', '),
      openGraph: {
        title: `${jpTitle || title} | ABOJC`,
        description,
        type: 'article',
        siteName: 'ABOJC',
      },
      twitter: {
        card: 'summary',
        title: `${jpTitle || title} | ABOJC`,
        description,
      },
    };
  } catch {
    return { title: 'ABOJC 論文紹介' };
  }
}

export default async function PaperPage({ params }: Props) {
  const { pageId } = await params;

  let page;
  let blocks;
  try {
    [page, blocks] = await Promise.all([
      getPageById(pageId),
      getPageBlocks(pageId),
    ]);
  } catch {
    notFound();
  }

  const originalTitle = extractTitle(page.properties);
  const japaneseTitle = extractJpTitle(page.properties) || 'タイトルなし';
  const keywords = page.properties.キーワード?.multi_select || [];
  const authors = page.properties.担当者?.multi_select || [];
  const lastEdited = new Date(page.last_edited_time).toLocaleDateString('ja-JP');

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ScholarlyArticleJsonLd
        title={originalTitle}
        jpTitle={japaneseTitle}
        authors={authors.map((a) => a.name)}
        keywords={keywords.map((k) => k.name)}
        dateModified={page.last_edited_time}
        url={`https://abojc.vercel.app/papers/${pageId}`}
      />
      {/* パンくずリスト */}
      <nav aria-label="パンくずリスト" className="mb-8 text-sm text-stone-500">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-stone-800 transition-colors">ホーム</Link></li>
          <li>/</li>
          <li><Link href="/#papers" className="hover:text-stone-800 transition-colors">論文紹介</Link></li>
          <li>/</li>
          <li className="text-stone-800 truncate max-w-[200px]">{japaneseTitle}</li>
        </ol>
      </nav>

      {/* ヘッダー */}
      <header className="mb-8">
        <h1 className="text-xl font-semibold text-stone-500 mb-2">{originalTitle}</h1>
        <h2 className="text-3xl font-bold mb-4">{japaneseTitle}</h2>

        <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-stone-200 pb-4">
          {keywords.length > 0 && (
            <div>
              <p className="text-sm font-bold mb-1 text-stone-500">キーワード:</p>
              <div className="flex flex-wrap gap-1">
                {keywords.map((tag: MultiSelectTag) => (
                  <span key={tag.id} className={`text-sm px-2 py-0.5 rounded-full ${tagColorMap[tag.color] || tagColorMap.default}`}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {authors.length > 0 && (
            <div>
              <p className="text-sm font-bold mb-1 text-stone-500">担当者:</p>
              <div className="flex flex-wrap gap-1">
                {authors.map((tag: MultiSelectTag) => (
                  <span key={tag.id} className={`text-sm px-2 py-0.5 rounded-full ${tagColorMap[tag.color] || tagColorMap.default}`}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="text-sm font-bold mb-1 text-stone-500">最終更新:</p>
            <p className="text-sm text-stone-600">{lastEdited}</p>
          </div>
        </div>
      </header>

      {/* 本文 */}
      <NotionContent blocks={blocks} />

      {/* 戻るリンク */}
      <div className="mt-12 pt-6 border-t border-stone-200">
        <Link href="/#papers" className="text-stone-600 hover:text-stone-900 transition-colors text-sm">
          ← 論文一覧に戻る
        </Link>
      </div>
    </article>
  );
}
