import type { Metadata } from 'next';
import { IBM_Plex_Mono, Source_Sans_3 } from 'next/font/google';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site';
import './globals.css';

const sans = Source_Sans_3({
	subsets: ['latin'],
	variable: '--font-sans',
	display: 'swap',
});

const mono = IBM_Plex_Mono({
	subsets: ['latin'],
	weight: ['400', '500'],
	variable: '--font-mono',
	display: 'swap',
});

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: `${SITE_NAME} — Free MTProto Proxies for Telegram`,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	keywords: ['MTProto', 'Telegram proxy', 'free proxies', 'tg://proxy', 'ProxyAggregator'],
	authors: [{ name: SITE_NAME }],
	alternates: {
		canonical: '/',
	},
	openGraph: {
		type: 'website',
		url: SITE_URL,
		siteName: SITE_NAME,
		title: `${SITE_NAME} — Free MTProto Proxies for Telegram`,
		description: SITE_DESCRIPTION,
		locale: 'en_US',
	},
	twitter: {
		card: 'summary_large_image',
		title: `${SITE_NAME} — Free MTProto Proxies for Telegram`,
		description: SITE_DESCRIPTION,
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en' className={`${sans.variable} ${mono.variable}`}>
			<body className='min-h-screen font-sans'>{children}</body>
		</html>
	);
}
