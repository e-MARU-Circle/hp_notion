import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ABOJC — 矯正歯科の科学的知見と解釈を発信するグループ',
    short_name: 'ABOJC',
    description: 'American Board of Orthodonticsが指定する文献を探求するジャーナルクラブ',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafaf9',
    theme_color: '#1c1917',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
