import { parseProxyLink } from '@proxyaggregator/types';
import { ProxyCard } from './ProxyCard';

type ProxyListProps = {
	links: string[];
};

export function ProxyList({ links }: ProxyListProps) {
	const proxies = links.map(parseProxyLink).filter(proxy => proxy !== null);

	if (proxies.length === 0) {
		return (
			<p className='rounded-xl border border-dashed border-white/15 bg-ink-900/60 px-4 py-10 text-center text-ink-400'>
				No proxies are published yet. Run the scraper or wait for the next hourly GitHub Action.
			</p>
		);
	}

	return (
		<ul className='grid gap-4 sm:grid-cols-2'>
			{proxies.map(proxy => (
				<li key={proxy.fullLink}>
					<ProxyCard proxy={proxy} />
				</li>
			))}
		</ul>
	);
}
