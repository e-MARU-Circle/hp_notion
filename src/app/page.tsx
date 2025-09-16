'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; // Imageをインポート
import HeroSection from "@/components/HeroSection";
import MembersSection from "@/components/MembersSection";

// 型定義
interface MultiSelectTag {
  id: string;
  name: string;
  color: string;
}

interface PageProperties {
  タイトル?: { title: { plain_text: string }[] };
  日本語タイトル?: { rich_text: { plain_text: string }[] };
  キーワード?: { multi_select: MultiSelectTag[] };
  担当者?: { multi_select: MultiSelectTag[] };
  コンテンツタイプ?: { select: { name: string } };
}

interface Page {
  id: string;
  last_edited_time: string;
  properties: PageProperties;
}

interface RichTextType {
  annotations: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    code: boolean;
  };
  plain_text: string;
  href: string | null;
}

// Blockの型。より具体的に定義
interface BlockType {
  id: string;
  type: string;
  heading_1?: { rich_text: RichTextType[] };
  heading_2?: { rich_text: RichTextType[] };
  heading_3?: { rich_text: RichTextType[] };
  paragraph?: { rich_text: RichTextType[] };
  bulleted_list_item?: { rich_text: RichTextType[] };
  image?: {
    type: 'external' | 'file';
    file: { url: string };
    external: { url: string };
    caption: { plain_text: string }[];
  };
  divider?: Record<string, never>;
}


// Notionブロックをレンダリングするコンポーネント
const Block = ({ block }: { block: BlockType }) => {
  const { type } = block;
  const value = block[type as Exclude<keyof BlockType, 'id' | 'type'>];

  // rich_textを持つブロックタイプかチェックする型ガード
  const hasRichText = (
    v: BlockType[Exclude<keyof BlockType, 'id' | 'type'>]
  ): v is { rich_text: RichTextType[] } => {
    if (v && typeof v === 'object' && 'rich_text' in v) {
      return Array.isArray((v as { rich_text?: unknown }).rich_text);
    }
    return false;
  };

  // リッチテキスト（太字やリンクなど）を処理する関数
  const renderRichText = (richText: RichTextType[]) => {
    return richText.map((text, index) => {
      const { annotations, plain_text, href } = text;
      let element: React.ReactNode = plain_text;

      if (annotations.bold) element = <strong key={index}>{element}</strong>;
      if (annotations.italic) element = <em key={index}>{element}</em>;
      if (annotations.underline) element = <u key={index}>{element}</u>;
      if (annotations.code) element = <code key={index} className="bg-gray-200 px-1 rounded-sm">{element}</code>;
      if (href) element = <a href={href} key={index} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{element}</a>;

      return element;
    });
  };

  if (!value) {
    return <p className="text-xs text-gray-400">Unsupported block: {type}</p>;
  }

  if (hasRichText(value)) {
    switch (type) {
      case 'heading_1':
        return <h1 className="text-3xl font-bold my-4">{renderRichText(value.rich_text)}</h1>;
      case 'heading_2':
        return <h2 className="text-2xl font-bold my-3">{renderRichText(value.rich_text)}</h2>;
      case 'heading_3':
        return <h3 className="text-xl font-bold my-2">{renderRichText(value.rich_text)}</h3>;
      case 'paragraph':
        return <p className="my-2 leading-relaxed">{renderRichText(value.rich_text)}</p>;
      case 'bulleted_list_item':
        return <li className="ml-6 list-disc">{renderRichText(value.rich_text)}</li>;
    }
  }

  switch (type) {
    case 'image':
      if (value && typeof value === 'object' && 'type' in value) {
        const src = value.type === 'external' ? value.external.url : value.file.url;
        const caption = value.caption.length > 0 ? value.caption[0].plain_text : '';
        return (
          <figure className="my-4">
            <div className="relative w-full h-auto aspect-video">
              <Image src={src} alt={caption || 'content image'} fill className="object-contain rounded-md" />
            </div>
            {caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{caption}</figcaption>}
          </figure>
        );
      }
      break;
    case 'divider':
      return <hr className="my-6" />;
    default:
      return <p className="text-xs text-gray-400">Unsupported block: {type}</p>;
  }
  return null;
};

export default function Home() {
  const [groupedPages, setGroupedPages] = useState<Record<string, Page[]>>({});
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<BlockType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch('/api/get-pages');
        if (!res.ok) throw new Error('Failed to fetch pages');
        const pages = (await res.json()) as Page[];
        const grouped = pages.reduce((acc: Record<string, Page[]>, page: Page) => {
          const contentType = page.properties.コンテンツタイプ?.select?.name || "その他";
          if (!acc[contentType]) acc[contentType] = [];
          acc[contentType].push(page);
          return acc;
        }, {});
        setGroupedPages(grouped);
      } catch (error) {
        console.error("Failed to fetch pages:", error);
      }
    };
    fetchPages();
  }, []);

  // ポップアップ表示時に本文データを取得
  useEffect(() => {
    if (selectedPage) {
      const fetchBlocks = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/get-page-content/${selectedPage.id}`);
          if (!res.ok) throw new Error('Failed to fetch');
          const data = await res.json();
          setBlocks(data);
        } catch (error) {
          console.error("Failed to fetch page content:", error);
          setBlocks([]); // エラー時はコンテンツをクリア
        }
        setIsLoading(false);
      };
      fetchBlocks();
    } else {
      setBlocks([]); // ポップアップを閉じたら内容をクリア
    }
  }, [selectedPage]);

  const tagColorMap: { [key: string]: string } = {
    default: "bg-gray-100 text-gray-800",
    gray: "bg-gray-100 text-gray-800",
    brown: "bg-yellow-100 text-yellow-800",
    orange: "bg-orange-100 text-orange-800",
    yellow: "bg-yellow-100 text-yellow-800",
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
    pink: "bg-pink-100 text-pink-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <>
      <HeroSection />

      <section className="text-center py-16 px-4">
        <h2 className="text-4xl font-black tracking-tighter mb-4">
          Advancing Orthodontic Knowledge<br />in Japan.
        </h2>
        <p className="text-lg text-stone-600 max-w-3xl mx-auto">
          ABOJCは、世界的に権威のあるアメリカ矯正歯科認定医機構（American
          Board of Orthodontics）が指定する文献を、専門家たちが集い探求するジャーナルクラブです。
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-16 border-t border-stone-200" id="about">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold tracking-tight">About Us</h2>
            </div>
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-2">Our Philosophy</h3>
                <p className="text-stone-600 leading-relaxed">
                  私たちの第一の使命は、厳選された文献の抄読を通じて、メンバー一人ひとりが常に最新かつ質の高い知識を習得し、自己研鑽に励むことです。さらに、その過程で得られた科学的根拠（エビデンス）に基づいた確かな知見を、矯正歯科医や歯科医師といった専門家はもちろんのこと、治療を検討されている一般の方々へも分かりやすく発信することを目指します。情報が氾濫し、真実を見極めることが困難な現代において、私たちは信頼性の高い情報を誠実に提供することで、日本の皆様が正しい矯正歯科知識に触れる機会を創出し、歯科医療の発展に貢献します。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">The Founding Story</h3>
                <p className="text-stone-600 leading-relaxed">
                  私たちの物語は、このグループの前身となる活動から始まります。2021年、多くのメンバーと共に2年以上の歳月をかけ、膨大な文献リストの翻訳と発表を成し遂げました。時を経て2025年。当時の運営メンバーの一人、中嶋 亮（銀座矯正歯科 院長）が、2025年版の文献リストに取り組むために再びチームを招集しました。しかし、今回の新たな活動は、最初のプロジェクトの頃からのある抜本的な変化の認識に基づいています。それは、AIをはじめとする技術環境の進歩が、翻訳にかかる時間とコストを大幅に削減したことです。今や、価値は単なる翻訳そのものではなく、文献の批判的な「解釈」にこそある時代となりました。この新たな現実を踏まえ、私たちは新しいメンバーとともに、活動内容と分析を一般に公開するという、これまでとは異なるスタンスで臨みます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {Object.entries(groupedPages).map(([contentType, pages]) => {
          const isMembers = /member/i.test(contentType) || contentType.includes("メンバー");
          if (isMembers) {
            const sortedMembers = [...pages].sort((a, b) =>
              new Date(b.last_edited_time).getTime() - new Date(a.last_edited_time).getTime()
            );
            return <MembersSection key={contentType} pages={sortedMembers} />;
          } else {
            return (
              <section key={contentType} className="py-16 border-t border-stone-200" id="papers">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold tracking-tight">{contentType}</h2>
                  <p className="text-stone-600 mt-2">月に2回程度、抄読会開催後に更新していきます。</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pages.map((page) => {
                    const originalTitle = page.properties.タイトル?.title[0]?.plain_text || "";
                    const japaneseTitle = page.properties.日本語タイトル?.rich_text[0]?.plain_text || "タイトルなし";
                    const keywords = page.properties.キーワード?.multi_select || [];
                    const authors = page.properties.担当者?.multi_select || [];

                    return (
                      <motion.div
                        key={page.id}
                        className="border border-stone-200 rounded-sm overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                        onClick={() => setSelectedPage(page)}
                        whileHover={{ y: -5 }}
                      >
                        <div className="aspect-video bg-gray-200 flex items-center justify-center p-4">
                          <h4 className="font-semibold text-center text-gray-600">{originalTitle}</h4>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="font-bold mb-2 flex-grow">{japaneseTitle}</h3>
                          <div className="mt-auto space-y-2">
                            <div>
                              <p className="text-xs font-bold mb-1 text-stone-500">キーワード:</p>
                              <div className="flex flex-wrap gap-1">
                                {keywords.map((tag: MultiSelectTag) => <span key={tag.id} className={`text-xs px-1.5 py-0.5 rounded-full ${tagColorMap[tag.color]}`}>{tag.name}</span>)}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold mb-1 text-stone-500">担当者:</p>
                              <div className="flex flex-wrap gap-1">
                                {authors.map((tag: MultiSelectTag) => <span key={tag.id} className={`text-xs px-1.5 py-0.5 rounded-full ${tagColorMap[tag.color]}`}>{tag.name}</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          }
        })}

        <section className="py-16 border-t border-stone-200" id="contact">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Contact Us</h2>
            <p className="text-stone-600 mt-4 leading-relaxed">
              現在メンバーに関する募集は行なっておりません。また、個別の症例相談は受け付けておりませんのでご了承ください。記事の内容に関するお問い合わせは
              <a 
                href="https://amethyst-practice-817.notion.site/26d11c7792a88073b96df8ac1aa62b9b?pvs=105"
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline"
              >
                こちら
              </a>
              まで。
            </p>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedPage && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPage(null)}
          >
            <motion.div
              className="bg-white p-8 rounded-lg max-w-3xl w-full h-[90vh] overflow-y-auto relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // 背景クリックで閉じないように
            >
              <button
                onClick={() => setSelectedPage(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              {(() => {
                if (!selectedPage) return null;
                const originalTitle = selectedPage.properties.タイトル?.title[0]?.plain_text || "";
                const japaneseTitle = selectedPage.properties.日本語タイトル?.rich_text[0]?.plain_text || "タイトルなし";
                const keywords = selectedPage.properties.キーワード?.multi_select || [];
                const authors = selectedPage.properties.担当者?.multi_select || [];

                return (
                  <>
                    <h3 className="text-xl font-semibold text-stone-500 mb-1">{originalTitle}</h3>
                    <h2 className="text-3xl font-bold mb-4">{japaneseTitle}</h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 border-b border-stone-200 pb-4">
                      <div>
                        <p className="text-sm font-bold mb-1 text-stone-500">キーワード:</p>
                        <div className="flex flex-wrap gap-1">
                          {keywords.map((tag: MultiSelectTag) => <span key={tag.id} className={`text-sm px-2 py-0.5 rounded-full ${tagColorMap[tag.color]}`}>{tag.name}</span>)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold mb-1 text-stone-500">担当者:</p>
                        <div className="flex flex-wrap gap-1">
                          {authors.map((tag: MultiSelectTag) => <span key={tag.id} className={`text-sm px-2 py-0.5 rounded-full ${tagColorMap[tag.color]}`}>{tag.name}</span>)}
                        </div>
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="flex justify-center items-center h-48">
                        <p>Loading...</p>
                      </div>
                    ) : (
                      <div className="prose max-w-none">{blocks.map((block) => <Block key={block.id} block={block} />)}</div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
