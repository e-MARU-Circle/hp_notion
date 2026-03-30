import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '編集・監修ポリシー',
  description: 'ABOJCの編集・監修ポリシーについて。コンテンツの品質管理と情報の正確性を担保するための方針をご説明します。',
  alternates: {
    canonical: '/about/policy',
  },
};

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* パンくずリスト */}
      <nav aria-label="パンくずリスト" className="mb-8 text-sm text-stone-500">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-stone-800 transition-colors">ホーム</Link></li>
          <li>/</li>
          <li className="text-stone-800">編集・監修ポリシー</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight mb-8">編集・監修ポリシー</h1>

      <div className="space-y-8 text-stone-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">情報の出典と正確性</h2>
          <p>
            ABOJCが公開するすべてのコンテンツは、American Board of Orthodontics（ABO）が指定する
            公式文献リストに基づいています。各論文の抄読・解釈は、矯正歯科の専門家であるメンバーが
            責任を持って行い、原著の内容を正確に反映するよう努めています。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">レビュープロセス</h2>
          <p>
            すべての公開コンテンツは以下のプロセスを経て公開されます。
          </p>
          <ol className="mt-4 space-y-2 ml-6 list-decimal">
            <li>担当メンバーによる原著論文の精読と抄録作成</li>
            <li>抄読会での発表とメンバー間のディスカッション</li>
            <li>フィードバックを反映した内容の修正・加筆</li>
            <li>運営メンバーによる最終確認と公開承認</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">利益相反</h2>
          <p>
            ABOJCのメンバーは、公開するコンテンツに関して特定の製品、サービス、または企業との
            利益相反がないことを確認しています。コンテンツは純粋に科学的・教育的目的で作成されています。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">免責事項</h2>
          <p>
            本サイトに掲載される情報は、一般的な教育・情報提供を目的としたものであり、
            個別の診断・治療に関する医学的アドバイスを構成するものではありません。
            具体的な治療に関しては、担当の歯科医師にご相談ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">更新・修正ポリシー</h2>
          <p>
            公開後に誤りが発見された場合、速やかに修正を行います。
            重要な修正が行われた場合は、更新日時を記載し、変更内容を明示します。
            コンテンツに関するご指摘・ご質問は、お問い合わせフォームよりご連絡ください。
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-stone-200">
        <Link href="/" className="text-stone-600 hover:text-stone-900 transition-colors text-sm">
          ← ホームに戻る
        </Link>
      </div>
    </div>
  );
}
