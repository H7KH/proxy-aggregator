import { parseProxyLink, type ProxyItem } from '@proxyaggregator/types';

type ProxyCardProps = {
	proxy: ProxyItem;
	index: number;
};

function pingBadgeClass(proxy: ProxyItem): string {
	if (!proxy.isAlive) {
		return 'border-red-400/30 bg-red-500/10 text-red-300';
	}
	if (proxy.ping < 200) {
		return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300';
	}
	return 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300';
}

function pingBadgeLabel(proxy: ProxyItem): string {
	if (!proxy.isAlive) {
		return 'آفلاین';
	}
	return `${proxy.ping.toLocaleString('fa-IR')}ms`;
}

function toTelegramHttpLink(link: string, parsed: ReturnType<typeof parseProxyLink>): string {
	if (parsed) {
		const params = new URLSearchParams({
			server: parsed.server,
			port: parsed.port,
			secret: parsed.secret,
		});
		return `https://t.me/proxy?${params.toString()}`;
	}

	return link.replace(/^tg:\/\/proxy/i, 'https://t.me/proxy');
}

export function ProxyCard({ proxy, index }: ProxyCardProps) {
	const parsed = parseProxyLink(proxy.link);
	const server = parsed?.server ?? proxy.link;
	const port = parsed?.port ?? '—';
	const session = String(index + 1).padStart(3, '0');
	const connectHref = toTelegramHttpLink(proxy.link, parsed);

	return (
		<article
			className='animate-rise group flex h-full flex-col justify-between rounded-lg border border-term-line bg-term-bg/70 p-4 transition duration-300 ease-out hover:-translate-y-1 hover:border-term-phosphor/45 hover:shadow-glow sm:p-5'
			style={{ animationDelay: `${Math.min(index, 14) * 45}ms` }}
		>
			<div>
				<div className='mb-3 flex items-center justify-between gap-2'>
					<p className='font-mono text-[10px] tracking-widest text-term-mute sm:text-[11px]'>session_{session}</p>
					<span className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${pingBadgeClass(proxy)}`}>
						{pingBadgeLabel(proxy)}
					</span>
				</div>
				<h3 className='break-all text-[13px] leading-6 text-term-phosphor sm:text-sm'>
					<span className='text-term-mute'>host</span> <span className='ltr-iso'>{server}</span>
				</h3>
				<p className='mt-1 text-[13px] text-term-dim sm:text-sm'>
					<span className='text-term-mute'>port</span> <span className='ltr-iso text-term-amber'>{port}</span>
				</p>
				<p className='mt-2 break-all text-[11px] leading-5 text-term-mute'>
					<span className='ltr-iso'>{proxy.link}</span>
				</p>
			</div>

			<div className='mt-5'>
				<a href={connectHref} className='term-btn'>
					باز کردن در تلگرام
				</a>
			</div>
		</article>
	);
}
