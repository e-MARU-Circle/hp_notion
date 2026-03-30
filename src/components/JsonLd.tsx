// 構造化データ（JSON-LD）コンポーネント

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization スキーマ（トップページ用）
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ABOJC',
    alternateName: 'American Board of Orthodontics Journal Club',
    description:
      'ABOJCは、American Board of Orthodonticsが指定する文献を探求するジャーナルクラブです。科学的根拠に基づいた確かな知見を専門家や一般の方々へ発信します。',
    url: 'https://abojc.vercel.app',
    logo: 'https://abojc.vercel.app/favicon.ico',
    sameAs: [],
    foundingDate: '2025',
    knowsAbout: [
      '矯正歯科',
      'Orthodontics',
      'American Board of Orthodontics',
      'エビデンスベースド歯科医学',
    ],
  };
  return <JsonLd data={data} />;
}

// ScholarlyArticle スキーマ（論文個別ページ用）
export function ScholarlyArticleJsonLd({
  title,
  jpTitle,
  authors,
  keywords,
  dateModified,
  url,
}: {
  title: string;
  jpTitle: string;
  authors: string[];
  keywords: string[];
  dateModified: string;
  url: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: jpTitle || title,
    alternativeHeadline: title,
    author: authors.map((name) => ({
      '@type': 'Person',
      name,
    })),
    keywords: keywords.join(', '),
    dateModified,
    publisher: {
      '@type': 'Organization',
      name: 'ABOJC',
      url: 'https://abojc.vercel.app',
    },
    url,
    inLanguage: 'ja',
    isAccessibleForFree: true,
  };
  return <JsonLd data={data} />;
}

// Person スキーマ（メンバー個別ページ用）
export function PersonJsonLd({
  name,
  url,
  jobTitle,
  affiliation,
}: {
  name: string;
  url: string;
  jobTitle?: string;
  affiliation?: string;
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    memberOf: {
      '@type': 'Organization',
      name: 'ABOJC',
      url: 'https://abojc.vercel.app',
    },
  };
  if (jobTitle) data.jobTitle = jobTitle;
  if (affiliation) {
    data.affiliation = {
      '@type': 'Organization',
      name: affiliation,
    };
  }
  return <JsonLd data={data} />;
}
