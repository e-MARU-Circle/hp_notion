import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPageById, getPublishedPages, getPageBlocks } from '@/lib/notion';
import { PersonJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { extractMemberName, tagColorMap, isRichTextProperty } from '@/lib/types';
import type { BlockType, MultiSelectTag, PageProperties } from '@/lib/types';

interface Props {
  params: Promise<{ memberId: string }>;
}

// On-demand ISR (webhook) + 1時間フォールバック
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const pages = await getPublishedPages();
    return pages
      .filter((p) => {
        const ct = p.properties.コンテンツタイプ?.select?.name || '';
        return /member/i.test(ct) || ct.includes('メンバー');
      })
      .map((page) => ({ memberId: page.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { memberId } = await params;
  try {
    const page = await getPageById(memberId);
    const name = extractMemberName(page.properties);
    return {
      title: `${name} | ABOJC メンバー`,
      description: `${name} — ABOJCメンバープロフィール`,
      alternates: {
        canonical: `/members/${memberId}`,
      },
      openGraph: {
        title: `${name} | ABOJC メンバー`,
        description: `${name} — ABOJCメンバープロフィール`,
        type: 'profile',
        siteName: 'ABOJC',
      },
    };
  } catch {
    return { title: 'ABOJC メンバー' };
  }
}

// プロフィール項目を安全に取得
function getProfileField(props: PageProperties, key: string): string | null {
  const rec = props as unknown as Record<string, unknown>;
  const v = rec[key];
  if (isRichTextProperty(v)) return v.rich_text[0]?.plain_text ?? null;
  return null;
}

// ブロック本文から「HP: URL」のリンクを抽出
function extractHpUrl(blocks: BlockType[]): string | null {
  for (const block of blocks) {
    if (block.type !== 'paragraph') continue;
    const para = block.paragraph as { rich_text?: { plain_text?: string; href?: string | null }[] } | undefined;
    if (!para?.rich_text) continue;
    const fullText = para.rich_text.map((r) => r.plain_text || '').join('');
    if (!/^HP\s*[:：]/i.test(fullText)) continue;
    // リンク付きのrich_textからhrefを取得
    for (const rt of para.rich_text) {
      if (rt.href) return rt.href;
    }
    // hrefがない場合、テキストからURLを抽出
    const urlMatch = fullText.match(/https?:\/\/[^\s]+/);
    if (urlMatch) return urlMatch[0];
  }
  return null;
}

export default async function MemberPage({ params }: Props) {
  const { memberId } = await params;

  let page;
  try {
    page = await getPageById(memberId);
  } catch {
    notFound();
  }

  const name = extractMemberName(page.properties);
  const tags = page.properties.担当者?.multi_select || [];
  const file0 = page.properties.顔写真?.files?.[0];
  const imageUrl = file0?.external?.url ?? file0?.file?.url ?? null;

  // ページ本文からHP URLを抽出
  let hpUrl: string | null = null;
  try {
    const blocks = await getPageBlocks(memberId);
    hpUrl = extractHpUrl(blocks);
  } catch {
    // ブロック取得失敗時はHP非表示
  }

  // プロフィール情報（優先度4で拡張予定）
  const profileFields = [
    { label: '資格・認定医', value: getProfileField(page.properties, '資格') },
    { label: '所属学会', value: getProfileField(page.properties, '所属学会') },
    { label: '専門領域', value: getProfileField(page.properties, '専門領域') },
    { label: '所属医院・役職', value: getProfileField(page.properties, '所属医院') },
    { label: '臨床経験', value: getProfileField(page.properties, '臨床経験') },
  ].filter((f) => f.value !== null);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PersonJsonLd
        name={name}
        url={`https://abojc.com/members/${memberId}`}
        jobTitle={getProfileField(page.properties, '役職') || undefined}
        affiliation={getProfileField(page.properties, '所属医院') || undefined}
        imageUrl={imageUrl || undefined}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'ホーム', url: 'https://abojc.com' },
          { name: 'メンバー', url: 'https://abojc.com/#members' },
          { name, url: `https://abojc.com/members/${memberId}` },
        ]}
      />
      {/* パンくずリスト */}
      <nav aria-label="パンくずリスト" className="mb-8 text-sm text-stone-500">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-stone-800 transition-colors">ホーム</Link></li>
          <li>/</li>
          <li><Link href="/#members" className="hover:text-stone-800 transition-colors">メンバー</Link></li>
          <li>/</li>
          <li className="text-stone-800">{name}</li>
        </ol>
      </nav>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        {/* プロフィール写真 */}
        <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={name}
              fill
              unoptimized
              className="object-cover"
            />
          )}
        </div>

        {/* 基本情報 */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-3">{name}</h1>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4 justify-center sm:justify-start">
              {tags.map((tag: MultiSelectTag) => (
                <span key={tag.id} className={`text-sm px-2 py-0.5 rounded-full ${tagColorMap[tag.color] || tagColorMap.default}`}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* HP リンク */}
          {hpUrl && (
            <a
              href={hpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-base text-blue-600 hover:text-blue-800 transition-colors mb-4 px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {hpUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </a>
          )}

          {/* プロフィール詳細（Notion DBにプロパティが追加されたら表示） */}
          {profileFields.length > 0 && (
            <dl className="mt-6 space-y-3 text-left">
              {profileFields.map((field) => (
                <div key={field.label}>
                  <dt className="text-sm font-bold text-stone-500">{field.label}</dt>
                  <dd className="text-stone-800">{field.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* 戻るリンク */}
      <div className="mt-12 pt-6 border-t border-stone-200">
        <Link href="/#members" className="text-stone-600 hover:text-stone-900 transition-colors text-sm">
          ← メンバー一覧に戻る
        </Link>
      </div>
    </div>
  );
}
