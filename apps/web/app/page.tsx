import fs from 'node:fs/promises';
import path from 'node:path';
import { ProxyList } from '../components/ProxyList';

export const revalidate = 3600;

async function getProxyLinks(): Promise<string[]> {
	const remoteUrl = process.env.PROXIES_JSON_URL;

	if (remoteUrl) {
		const response = await fetch(remoteUrl, { next: { revalidate: 3600 } });
		if (!response.ok) {
			throw new Error(`Failed to fetch proxies (${response.status})`);
		}
		return response.json() as Promise<string[]>;
	}

	const localPath = path.join(process.cwd(), '..', 'scraper', 'data', 'proxies.json');

	try {
		const raw = await fs.readFile(localPath, 'utf8');
		return JSON.parse(raw) as string[];
	} catch {
		return [];
	}
}

export default async function HomePage() {
	const proxies = await getProxyLinks();
	const updatedAt = new Date().toISOString();

	return (
		<div className='mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10 sm:px-6 lg:px-8'>
			<header className='border-b border-white/10 pb-10'>
				<p className='text-xs font-medium uppercase tracking-[0.22em] text-signal-light'>MTProto directory</p>
				<h1 className='mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl'>
					Free Telegram MTProto proxies, refreshed every hour
				</h1>
				<p className='mt-4 max-w-2xl text-base leading-7 text-ink-400'>
					ProxyAggregator collects public MTProto links from Telegram channel web previews, standardizes them to{' '}
					<code className='font-mono text-ink-100'>tg://proxy</code> URLs, and publishes a crawlable directory so you can
					connect in one tap.
				</p>
				<dl className='mt-8 flex flex-wrap gap-6 text-sm text-ink-400'>
					<div>
						<dt className='uppercase tracking-wide text-xs'>Active links</dt>
						<dd className='mt-1 font-mono text-lg text-white'>{proxies.length}</dd>
					</div>
					<div>
						<dt className='uppercase tracking-wide text-xs'>Update cadence</dt>
						<dd className='mt-1 font-mono text-lg text-white'>Hourly</dd>
					</div>
				</dl>
			</header>

			<main className='flex-1 py-10'>
				<section aria-labelledby='proxy-list-heading'>
					<div className='mb-6 flex items-end justify-between gap-4'>
						<h2 id='proxy-list-heading' className='text-xl font-semibold text-white'>
							Available proxies
						</h2>
						<p className='text-xs text-ink-400'>
							Last rendered <time dateTime={updatedAt}>{updatedAt}</time>
						</p>
					</div>
					<ProxyList links={proxies} />
				</section>
			</main>

			<footer className='border-t border-white/10 pt-6 text-sm text-ink-400'>
				<p>
					Public MTProto links only. Proxies are collected from public Telegram channel web views and may go offline
					without notice.
				</p>
			</footer>
		</div>
	);
}
