import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_URL, DESCRIPTION } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'AQELVYN',
    description: DESCRIPTION,
    id: SITE_URL,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#041414',
    theme_color: '#062a2a',
    orientation: 'any',
    categories: ['developer tools', 'productivity', 'artificial intelligence'],
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/logo-main.png', sizes: '256x256', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
