import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site';
import './globals.css';

const vazir = Vazirmatn({
	subsets: ['arabic', 'latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-vazir',
	display: 'swap',
});

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: `${SITE_NAME} — پروکسی‌های رایگان MTProto تلگرام`,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	keywords: ['پروکسی تلگرام', 'MTProto', 'پروکسی رایگان', 'tg://proxy', 'پروکسی‌اگریگیتور'],
	authors: [{ name: SITE_NAME }],
	alternates: {
		canonical: '/',
	},
	openGraph: {
		type: 'website',
		url: SITE_URL,
		siteName: SITE_NAME,
		title: `${SITE_NAME} — پروکسی‌های رایگان MTProto تلگرام`,
		description: SITE_DESCRIPTION,
		locale: 'fa_IR',
	},
	twitter: {
		card: 'summary_large_image',
		title: `${SITE_NAME} — پروکسی‌های رایگان MTProto تلگرام`,
		description: SITE_DESCRIPTION,
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='fa' dir='rtl' className={vazir.variable}>
			<body className='min-h-dvh font-sans'>{children}</body>
		</html>
	);
}
