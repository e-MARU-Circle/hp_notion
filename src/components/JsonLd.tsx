// 構造化データ（JSON-LD）コンポーネント

const SITE_URL = 'https://abojc.vercel.app';

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
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    image: `${SITE_URL}/og-image.png`,
    foundingDate: '2025',
    knowsAbout: [
      '矯正歯科',
      'Orthodontics',
      'American Board of Orthodontics',
      'エビデンスベースド歯科医学',
      '歯科矯正',
      '矯正歯科学',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Japan',
    },
    inLanguage: 'ja',
  };
  return <JsonLd data={data} />;
}

// WebSite スキーマ（サイト全体の検索エンジン向け情報）
export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ABOJC',
    alternateName: 'American Board of Orthodontics Journal Club',
    url: SITE_URL,
    inLanguage: 'ja',
    publisher: {
      '@type': 'Organization',
      name: 'ABOJC',
      url: SITE_URL,
    },
  };
  return <JsonLd data={data} />;
}

// BreadcrumbList スキーマ
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
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
    description: `${jpTitle || title} — ABOJCによる論文レビュー`,
    author: authors.map((name) => ({
      '@type': 'Person',
      name,
    })),
    keywords: keywords.join(', '),
    dateModified,
    datePublished: dateModified,
    publisher: {
      '@type': 'Organization',
      name: 'ABOJC',
      url: SITE_URL,
      logo: `${SITE_URL}/og-image.png`,
    },
    url,
    inLanguage: 'ja',
    isAccessibleForFree: true,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
  return <JsonLd data={data} />;
}

// Person スキーマ（メンバー個別ページ用）
export function PersonJsonLd({
  name,
  url,
  jobTitle,
  affiliation,
  imageUrl,
}: {
  name: string;
  url: string;
  jobTitle?: string;
  affiliation?: string;
  imageUrl?: string;
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    memberOf: {
      '@type': 'Organization',
      name: 'ABOJC',
      url: SITE_URL,
    },
  };
  if (jobTitle) data.jobTitle = jobTitle;
  if (affiliation) {
    data.affiliation = {
      '@type': 'Organization',
      name: affiliation,
    };
  }
  if (imageUrl) data.image = imageUrl;
  return <JsonLd data={data} />;
}
