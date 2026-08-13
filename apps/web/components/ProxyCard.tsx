import type { ParsedProxy } from '@proxyaggregator/types';

type ProxyCardProps = {
	proxy: ParsedProxy;
};

export function ProxyCard({ proxy }: ProxyCardProps) {
	const httpFallback = `https://t.me/proxy?server=${encodeURIComponent(proxy.server)}&port=${proxy.port}&secret=${encodeURIComponent(proxy.secret)}`;
	const shortSecret = proxy.secret.length > 18 ? `${proxy.secret.slice(0, 18)}…` : proxy.secret;

	return (
		<article className='flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-ink-900 p-5'>
			<div>
				<h3 className='font-mono text-base text-white'>
					{proxy.server}
					<span className='text-ink-400'>:{proxy.port}</span>
				</h3>
				<p className='mt-2 break-all font-mono text-xs leading-5 text-ink-400'>secret {shortSecret}</p>
			</div>
			<a
				href={proxy.fullLink}
				className='mt-6 inline-flex items-center justify-center rounded-full bg-signal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-signal-light'
			>
				Connect in Telegram
			</a>
			<a
				href={httpFallback}
				className='mt-2 text-center text-xs text-ink-400 underline-offset-4 hover:text-ink-100 hover:underline'
			>
				Open t.me fallback
			</a>
		</article>
	);
}
