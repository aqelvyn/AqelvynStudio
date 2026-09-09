import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import './globals.css';
import {
  SITE_NAME, SITE_URL, TAGLINE, DESCRIPTION, KEYWORDS,
  websiteJsonLd, organizationJsonLd, softwareAppJsonLd, faqJsonLd,
} from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — AI Prompts, Web3 App Builder & Prompt Library`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'technology',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — AI Prompts, Web3 App Builder & Prompt Library`,
    description: DESCRIPTION,
    locale: 'en_US',
    images: [{ url: '/og-banner.png', width: 1200, height: 630, alt: `${SITE_NAME} — ${TAGLINE}` }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aqelvyn',
    creator: '@aqelvyn',
    title: `${SITE_NAME} — AI Prompts, Web3 App Builder & Prompt Library`,
    description: DESCRIPTION,
    images: ['/og-banner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#062a2a',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = [websiteJsonLd(), organizationJsonLd(), softwareAppJsonLd(), faqJsonLd()];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {jsonLd.map((obj, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
          />
        ))}
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
