// ============================================================
// 共通型定義
// ============================================================

// --- Notion プロパティ系 ---
export interface MultiSelectTag {
  id: string;
  name: string;
  color: string;
}

export interface NotionFileRef {
  external?: { url: string };
  file?: { url: string };
}

export interface TitleProperty {
  title: { plain_text: string }[];
}

export interface RichTextProperty {
  rich_text: { plain_text: string }[];
}

// --- ページ系 ---
export interface PageProperties {
  タイトル?: TitleProperty;
  日本語タイトル?: RichTextProperty;
  キーワード?: { multi_select: MultiSelectTag[] };
  担当者?: { multi_select: MultiSelectTag[] };
  コンテンツタイプ?: { select: { name: string } };
  顔写真?: { files: NotionFileRef[] };
  // メンバープロフィール強化用（優先度4）
  資格?: RichTextProperty;
  所属学会?: RichTextProperty;
  専門領域?: RichTextProperty;
  所属医院?: RichTextProperty;
  役職?: RichTextProperty;
  臨床経験?: RichTextProperty;
}

export interface Page {
  id: string;
  last_edited_time: string;
  properties: PageProperties;
}

// --- Notion Block 系 ---
export interface RichTextType {
  annotations: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    code: boolean;
  };
  plain_text: string;
  href: string | null;
}

export interface BlockType {
  id: string;
  type: string;
  heading_1?: { rich_text: RichTextType[] };
  heading_2?: { rich_text: RichTextType[] };
  heading_3?: { rich_text: RichTextType[] };
  paragraph?: { rich_text: RichTextType[] };
  bulleted_list_item?: { rich_text: RichTextType[] };
  numbered_list_item?: { rich_text: RichTextType[] };
  callout?: {
    rich_text: RichTextType[];
    icon: {
      type: 'emoji' | 'external';
      emoji?: string;
      external?: { url: string };
    };
    color: string;
  };
  image?: {
    type: 'external' | 'file';
    file: { url: string };
    external: { url: string };
    caption: { plain_text: string }[];
  };
  divider?: Record<string, never>;
  list_item_group?: {
    type: 'bulleted_list_item' | 'numbered_list_item';
    items: BlockType[];
  };
}

// --- ヘルパー ---
export const tagColorMap: Record<string, string> = {
  default: 'bg-gray-100 text-gray-800',
  gray: 'bg-gray-100 text-gray-800',
  brown: 'bg-yellow-100 text-yellow-800',
  orange: 'bg-orange-100 text-orange-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  pink: 'bg-pink-100 text-pink-800',
  red: 'bg-red-100 text-red-800',
};

// タイトル抽出ヘルパー
export const isTitleProperty = (v: unknown): v is TitleProperty =>
  !!v && typeof v === 'object' && Array.isArray((v as TitleProperty).title) &&
  typeof (v as TitleProperty).title[0]?.plain_text === 'string';

export const isRichTextProperty = (v: unknown): v is RichTextProperty =>
  !!v && typeof v === 'object' && Array.isArray((v as RichTextProperty).rich_text) &&
  typeof (v as RichTextProperty).rich_text[0]?.plain_text === 'string';

export function extractTitle(props: PageProperties): string {
  const rec = props as unknown as Record<string, unknown>;
  const knownKeys = ['タイトル', 'Title', '原著タイトル', '英語タイトル'] as const;
  for (const k of knownKeys) {
    const v = rec[k];
    if (isTitleProperty(v)) return v.title[0]?.plain_text ?? '';
  }
  for (const v of Object.values(rec)) {
    if (isTitleProperty(v)) return v.title[0]?.plain_text ?? '';
  }
  return '';
}

export function extractJpTitle(props: PageProperties): string | null {
  const rec = props as unknown as Record<string, unknown>;
  const candidates = ['日本語タイトル', 'Japanese Title', '和訳タイトル', '和題'] as const;
  for (const k of candidates) {
    const v = rec[k];
    if (isRichTextProperty(v)) return v.rich_text[0]?.plain_text ?? null;
  }
  return null;
}

export function extractMemberName(props: PageProperties): string {
  const rec = props as unknown as Record<string, unknown>;
  const candidateKeys = ['名前', 'Name', 'タイトル', '氏名', 'メンバー名'];
  for (const key of candidateKeys) {
    const v = rec[key];
    if (isTitleProperty(v)) return v.title[0]?.plain_text ?? '名前なし';
  }
  for (const v of Object.values(rec)) {
    if (isTitleProperty(v)) return (v as TitleProperty).title[0]?.plain_text ?? '名前なし';
  }
  return '名前なし';
}
