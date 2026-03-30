import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '参加基準',
  description: 'ABOJCの参加基準について。メンバーの選定基準と入会プロセスをご説明します。',
  alternates: {
    canonical: '/about/criteria',
  },
};

export default function CriteriaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* パンくずリスト */}
      <nav aria-label="パンくずリスト" className="mb-8 text-sm text-stone-500">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-stone-800 transition-colors">ホーム</Link></li>
          <li>/</li>
          <li className="text-stone-800">参加基準</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight mb-8">参加基準</h1>

      <div className="space-y-8 text-stone-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">メンバーの資格要件</h2>
          <p>
            ABOJCのメンバーには、矯正歯科分野における高い専門性と、エビデンスに基づいた臨床実践への強い意欲が求められます。
            具体的には以下の要件を満たすことが望まれます。
          </p>
          <ul className="mt-4 space-y-2 ml-6 list-disc">
            <li>歯科医師免許を有すること</li>
            <li>矯正歯科の臨床経験を有すること</li>
            <li>科学的文献を批判的に読み解く能力と意欲を持つこと</li>
            <li>定期的な抄読会への参加が可能であること</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">選定プロセス</h2>
          <p>
            新規メンバーの参加は、既存メンバーからの推薦に基づいて運営委員会が審議し、決定します。
            現在、一般からの募集は行っておりません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-900 mb-3">活動への参加</h2>
          <p>
            メンバーには、担当文献の抄読・発表、および他のメンバーの発表に対する建設的なディスカッションへの参加が期待されます。
            発表内容はウェブサイトを通じて一般に公開されます。
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
