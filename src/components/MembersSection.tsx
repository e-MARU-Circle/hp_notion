'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image'; // Imageをインポート

// 型定義
interface MultiSelectTag {
  id: string;
  name: string;
  color: string;
}

interface PageProperties {
  顔写真?: { files: { file: { url: string } }[] };
  タイトル?: { title: { plain_text: string }[] };
  担当者?: { multi_select: MultiSelectTag[] };
}

interface Page {
  id: string;
  properties: PageProperties;
}

interface MembersSectionProps {
  pages: Page[];
}

const tagColorMap: { [key: string]: string } = {
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

const MembersSection = ({ pages }: MembersSectionProps) => {
  const getPageTitle = (props: any): string | null => {
    if (!props || typeof props !== 'object') return null;
    const candidateKeys = ['名前', 'Name', 'タイトル', '氏名', 'メンバー名'];
    for (const key of candidateKeys) {
      const v = props[key as keyof typeof props] as any;
      if (v && Array.isArray(v.title) && v.title[0]?.plain_text) {
        return v.title[0].plain_text as string;
      }
    }
    for (const v of Object.values(props)) {
      if (v && typeof v === 'object' && 'title' in v && Array.isArray((v as any).title) && (v as any).title[0]?.plain_text) {
        return (v as any).title[0].plain_text as string;
      }
    }
    return null;
  };
  // 親コンテナ用のアニメーション定義
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const satisfies Variants;

  // 各カード用のアニメーション定義 (ドロップイン)
  const cardVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
      },
    },
  } as const satisfies Variants;

  return (
    <section className="py-16 border-t border-stone-200" id="members">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">Group Members</h2>
        <p className="text-stone-600 mt-2">抄読会を支えてくれる大切なメンバーです。</p>
      </div>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" // スクロールして表示領域に入ったらアニメーション開始
        viewport={{ once: true, amount: 0.2 }} // アニメーションは1回だけ、20%見えたら開始
      >
        {pages.map((page) => {
          const imageUrl =
            // Notion file can be external or file
            (page.properties.顔写真?.files?.[0] as any)?.external?.url ||
            (page.properties.顔写真?.files?.[0] as any)?.file?.url ||
            null;
          const name = getPageTitle(page.properties as any) || '名前なし';
          const tags = page.properties.担当者?.multi_select || [];

          return (
            <motion.div key={page.id} className="space-y-2" variants={cardVariants}>
              <div className="aspect-square rounded-full bg-gray-200 overflow-hidden relative">
                {imageUrl && <Image src={imageUrl} alt={name} fill className="object-cover" />}
              </div>
              <p className="font-bold text-sm">{name}</p>
              <div className="flex flex-wrap justify-center gap-1 pt-1">
                {tags.map((tag: MultiSelectTag) => {
                  const colorClass = tagColorMap[tag.color] || tagColorMap.default;
                  return (
                    <span key={tag.id} className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
                      {tag.name}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default MembersSection;
