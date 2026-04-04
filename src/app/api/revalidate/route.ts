import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/revalidate
 *
 * Notion webhook からの呼び出しでオンデマンド ISR を実行する。
 * リクエストヘッダー `x-revalidate-secret` でシークレットを検証。
 *
 * Body（任意）:
 *   { "paths": ["/papers/xxx", "/members/yyy"] }
 *   paths 省略時はサイト全体を再検証する。
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'REVALIDATE_SECRET が設定されていません' },
      { status: 500 },
    );
  }

  const provided = request.headers.get('x-revalidate-secret');
  if (provided !== secret) {
    return NextResponse.json({ error: '認証エラー' }, { status: 401 });
  }

  try {
    const body: { paths?: string[] } = await request.json().catch(() => ({}));
    const paths = body.paths;

    if (Array.isArray(paths) && paths.length > 0) {
      for (const p of paths) {
        revalidatePath(p);
      }
    } else {
      // サイト全体を再検証
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({ revalidated: true, paths: paths ?? ['all'] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
