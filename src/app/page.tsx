import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import MembersSection from '@/components/MembersSection';
import { FAQJsonLd } from '@/components/JsonLd';
import type { Page, MultiSelectTag } from '@/lib/types';
import { tagColorMap, extractTitle, extractJpTitle } from '@/lib/types';
import { getPublishedPages } from '@/lib/notion';

const FAQ_DATA = [
  {
    question: 'ABOJCとは何ですか？',
    answer: 'ABOJCは「American Board of Orthodontics Journal Club」の略称で、アメリカ矯正歯科認定医機構（ABO）が指定する文献を専門家が集い探求するジャーナルクラブです。科学的根拠に基づいた確かな知見を、専門家や一般の方々へ日本語で発信しています。',
  },
  {
    question: 'American Board of Orthodontics（ABO）とは何ですか？',
    answer: 'American Board of Orthodontics（ABO）は、アメリカの矯正歯科における最高峰の認定機構です。矯正歯科医の専門的能力を審査・認定し、矯正歯科学の水準を世界的に牽引しています。ABOが指定する文献リストは、矯正歯科の専門医認定試験の基盤となっています。',
  },
  {
    question: 'ジャーナルクラブ（抄読会）とは何ですか？',
    answer: 'ジャーナルクラブ（抄読会）は、医療や学術の専門家が定期的に集まり、最新の学術論文を批判的に読み解き、議論する場です。ABOJCでは月に2回程度開催し、矯正歯科に関する重要な文献を日本語で解説・発信しています。',
  },
  {
    question: 'ABOJCの論文レビューは誰が書いていますか？',
    answer: 'ABOJCの論文レビューは、日本各地で活躍する矯正歯科専門医が担当しています。各メンバーは矯正歯科の臨床経験を持つ歯科医師であり、専門的な視点から文献を批判的に評価し、日本語で解説しています。',
  },
  {
    question: 'エビデンスベースド歯科医学（EBD）とは何ですか？',
    answer: 'エビデンスベースド歯科医学（Evidence-Based Dentistry, EBD）は、最良の科学的根拠（エビデンス）に基づいて歯科治療の意思決定を行うアプローチです。ABOJCは、ABO指定文献の批判的吟味を通じて、日本の矯正歯科におけるEBDの普及に貢献しています。',
  },
] as const;

// On-demand ISR (webhook) + 1時間フォールバック
export const revalidate = 3600;

export default async function Home() {
  let groupedPages: Record<string, Page[]> = {};

  try {
    const pages = await getPublishedPages();
    groupedPages = pages.reduce((acc: Record<string, Page[]>, page: Page) => {
      const contentType = page.properties.コンテンツタイプ?.select?.name || 'その他';
      if (!acc[contentType]) acc[contentType] = [];
      acc[contentType].push(page);
      return acc;
    }, {});
  } catch (error) {
    console.error('Failed to fetch pages:', error);
  }

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
          const isMembers = /member/i.test(contentType) || contentType.includes('メンバー');
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
                    const originalTitle = extractTitle(page.properties);
                    const japaneseTitle = extractJpTitle(page.properties) || 'タイトルなし';
                    const keywords = page.properties.キーワード?.multi_select || [];
                    const authors = page.properties.担当者?.multi_select || [];
                    const lastEdited = new Date(page.last_edited_time).toLocaleDateString('ja-JP');

                    return (
                      <Link
                        key={page.id}
                        href={`/papers/${page.id}`}
                        className="border border-stone-200 rounded-sm overflow-hidden group hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
                      >
                        <div className="aspect-video bg-gray-200 flex items-center justify-center p-4 overflow-hidden">
                          <h4 className="font-semibold text-center text-gray-600 break-words line-clamp-3">
                            {originalTitle}
                          </h4>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="font-bold mb-2 flex-grow break-words line-clamp-2">{japaneseTitle}</h3>
                          <div className="mt-auto space-y-2">
                            <div>
                              <p className="text-xs font-bold mb-1 text-stone-500">キーワード:</p>
                              <div className="w-full max-w-full flex flex-wrap gap-1">
                                {keywords.map((tag: MultiSelectTag) => (
                                  <span
                                    key={tag.id}
                                    className={`text-xs px-1.5 py-0.5 rounded-full break-words ${tagColorMap[tag.color] || tagColorMap.default}`}
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-bold mb-1 text-stone-500">担当者:</p>
                              <div className="w-full max-w-full flex flex-wrap gap-1">
                                {authors.map((tag: MultiSelectTag) => (
                                  <span
                                    key={tag.id}
                                    className={`text-xs px-1.5 py-0.5 rounded-full break-words ${tagColorMap[tag.color] || tagColorMap.default}`}
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-stone-400">更新: {lastEdited}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          }
        })}

        <section className="py-16 border-t border-stone-200" id="faq">
          <FAQJsonLd faqs={[...FAQ_DATA]} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
              <p className="text-stone-600 mt-2">よくある質問</p>
            </div>
            <div className="md:col-span-2">
              <dl className="space-y-6">
                {FAQ_DATA.map((faq) => (
                  <div key={faq.question}>
                    <dt className="text-lg font-bold mb-2">{faq.question}</dt>
                    <dd className="text-stone-600 leading-relaxed">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

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
    </>
  );
}
