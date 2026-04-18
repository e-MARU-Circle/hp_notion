import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-black tracking-tighter mb-4">404</h1>
      <p className="text-xl text-stone-600 mb-8">
        お探しのページは見つかりませんでした。
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-stone-900 text-white rounded-sm hover:bg-stone-700 transition-colors"
        >
          ホームに戻る
        </Link>
        <Link
          href="/#papers"
          className="px-6 py-3 border border-stone-300 rounded-sm hover:bg-stone-50 transition-colors"
        >
          論文一覧を見る
        </Link>
      </div>
    </div>
  );
}
