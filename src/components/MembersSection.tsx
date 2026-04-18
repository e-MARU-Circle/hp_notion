'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { MultiSelectTag, NotionFileRef, TitleProperty, Page } from '@/lib/types';
import { tagColorMap, isTitleProperty } from '@/lib/types';

interface MembersSectionProps {
  pages: Page[];
}

const MembersSection = ({ pages }: MembersSectionProps) => {
  const getPageTitle = (props: Record<string, unknown>): string | null => {
    if (!props || typeof props !== 'object') return null;
    const candidateKeys = ['名前', 'Name', 'タイトル', '氏名', 'メンバー名'];
    for (const key of candidateKeys) {
      const v = props[key];
      if (isTitleProperty(v)) {
        return v.title[0]?.plain_text ?? null;
      }
    }
    for (const v of Object.values(props)) {
      if (isTitleProperty(v)) {
        return (v as TitleProperty).title[0]?.plain_text ?? null;
      }
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const satisfies Variants;

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
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {pages.map((page) => {
          const file0: NotionFileRef | undefined = page.properties.顔写真?.files?.[0];
          const imageUrl = file0?.external?.url ?? file0?.file?.url ?? null;
          const name = getPageTitle(page.properties as unknown as Record<string, unknown>) || '名前なし';
          const tags = page.properties.担当者?.multi_select || [];

          return (
            <motion.div key={page.id} className="space-y-2" variants={cardVariants}>
              <Link href={`/members/${page.id}`} className="block group">
                <div className="aspect-square rounded-full bg-gray-200 overflow-hidden relative group-hover:ring-2 group-hover:ring-stone-400 transition-all">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="font-bold text-sm mt-2 group-hover:text-stone-600 transition-colors">{name}</p>
              </Link>
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
