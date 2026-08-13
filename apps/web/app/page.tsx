import type { ProxyItem } from '@proxyaggregator/types';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ProxyList } from '../components/ProxyList';
import { TerminalWindow } from '../components/TerminalWindow';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site';

export const revalidate = 3600;

function normalizeProxies(data: unknown): ProxyItem[] {
	if (!Array.isArray(data)) {
		return [];
	}

	return data.flatMap(item => {
		if (typeof item === 'string') {
			return [{ link: item, ping: -1, isAlive: false }];
		}
		if (
			item &&
			typeof item === 'object' &&
			'link' in item &&
			typeof item.link === 'string' &&
			'ping' in item &&
			typeof item.ping === 'number' &&
			'isAlive' in item &&
			typeof item.isAlive === 'boolean'
		) {
			return [item as ProxyItem];
		}
		return [];
	});
}

async function getProxies(): Promise<ProxyItem[]> {
	const remoteUrl = process.env.PROXIES_JSON_URL;

	if (remoteUrl) {
		const response = await fetch(remoteUrl, { next: { revalidate: 3600 } });
		if (!response.ok) {
			throw new Error(`Failed to fetch proxies (${response.status})`);
		}
		return normalizeProxies(await response.json());
	}

	const localPath = path.join(process.cwd(), '..', 'scraper', 'data', 'proxies.json');

	try {
		const raw = await fs.readFile(localPath, 'utf8');
		return normalizeProxies(JSON.parse(raw));
	} catch {
		return [];
	}
}

export default async function HomePage() {
	const proxies = await getProxies();
	const aliveCount = proxies.filter(item => item.isAlive).length;

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: `${SITE_NAME} — پروکسی‌های رایگان MTProto تلگرام`,
		description: SITE_DESCRIPTION,
		url: SITE_URL,
		inLanguage: 'fa-IR',
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: proxies.length,
			itemListElement: proxies.slice(0, 50).map((item, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				url: SITE_URL,
				name: item.link,
			})),
		},
	};

	return (
		<TerminalWindow>
			<script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className='flex min-h-[calc(100dvh-4.5rem)] flex-col px-3 py-5 sm:px-6 sm:py-7 md:px-8 md:py-8'>
				<header className='animate-rise border-b border-term-line/80 pb-6 sm:pb-8'>
					<h1 className='mt-3 max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-term-phosphor sm:text-4xl md:text-5xl'>
						پروکسی‌های رایگان تلگرام
					</h1>
					<dl className='mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-8'></dl>
				</header>

				<main className='flex-1 py-6 sm:py-8'>
					<section aria-labelledby='proxy-list-heading'>
						<div className='mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between'>
							<h2 id='proxy-list-heading' className='text-lg font-semibold text-term-phosphor sm:text-xl'>
								پروکسی‌های موجود
							</h2>
							<p className='text-xs text-term-mute'>
								{aliveCount.toLocaleString('fa-IR')} فعال از {proxies.length.toLocaleString('fa-IR')}{' '}
								لینک
							</p>
						</div>
						<ProxyList initialProxies={proxies} />
					</section>
				</main>
			</div>
		</TerminalWindow>
	);
}
