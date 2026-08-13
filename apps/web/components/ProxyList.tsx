'use client';

import { parseProxyLink, type ProxyItem } from '@proxyaggregator/types';
import { useMemo, useState } from 'react';
import { ProxyCard } from './ProxyCard';

const PAGE_SIZE = 20;

type FilterMode = 'all' | 'alive' | 'offline';

type ProxyListProps = {
	initialProxies: ProxyItem[];
};

const FILTERS: { id: FilterMode; label: string }[] = [
	{ id: 'all', label: 'همه' },
	{ id: 'alive', label: 'فقط فعال' },
	{ id: 'offline', label: 'فقط آفلاین' },
];

export function ProxyList({ initialProxies }: ProxyListProps) {
	const [query, setQuery] = useState('');
	const [filter, setFilter] = useState<FilterMode>('all');
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

	const activeCount = initialProxies.filter(item => item.isAlive).length;
	const offlineCount = initialProxies.length - activeCount;

	const filtered = useMemo(() => {
		const needle = query.trim().toLowerCase();

		return initialProxies.filter(item => {
			if (filter === 'alive' && !item.isAlive) {
				return false;
			}
			if (filter === 'offline' && item.isAlive) {
				return false;
			}
			if (!needle) {
				return true;
			}

			const parsed = parseProxyLink(item.link);
			const haystack = `${parsed?.server ?? ''} ${parsed?.port ?? ''} ${item.link}`.toLowerCase();
			return haystack.includes(needle);
		});
	}, [filter, initialProxies, query]);

	const visible = filtered.slice(0, visibleCount);
	const hasMore = visibleCount < filtered.length;

	function resetPaging() {
		setVisibleCount(PAGE_SIZE);
	}

	if (initialProxies.length === 0) {
		return (
			<p className='rounded-lg border border-dashed border-term-line px-4 py-10 text-center text-sm leading-7 text-term-dim'>
				هنوز پروکسی‌ای در فهرست نیست. اسکریپر را اجرا کنید یا تا اجرای ساعتی بعدی صبر کنید.
			</p>
		);
	}

	return (
		<div className='space-y-5'>
			<dl className='grid grid-cols-3 gap-2 text-center sm:gap-3'>
				<div className='rounded-md border border-term-line/80 bg-term-bg/60 px-2 py-3'>
					<dt className='text-[11px] text-term-mute'>کل</dt>
					<dd className='mt-1 text-base text-term-phosphor sm:text-lg'>
						{initialProxies.length.toLocaleString('fa-IR')}
					</dd>
				</div>
				<div className='rounded-md border border-emerald-400/20 bg-emerald-500/5 px-2 py-3'>
					<dt className='text-[11px] text-emerald-300/80'>فعال</dt>
					<dd className='mt-1 text-base text-emerald-300 sm:text-lg'>
						{activeCount.toLocaleString('fa-IR')}
					</dd>
				</div>
				<div className='rounded-md border border-red-400/20 bg-red-500/5 px-2 py-3'>
					<dt className='text-[11px] text-red-300/80'>آفلاین</dt>
					<dd className='mt-1 text-base text-red-300 sm:text-lg'>{offlineCount.toLocaleString('fa-IR')}</dd>
				</div>
			</dl>

			<div role='tablist' aria-label='فیلتر وضعیت پروکسی' className='flex flex-wrap gap-2'>
				{FILTERS.map(item => {
					const selected = filter === item.id;
					return (
						<button
							key={item.id}
							type='button'
							role='tab'
							aria-selected={selected}
							className={`rounded-md border px-3 py-2 text-xs transition sm:text-sm ${
								selected
									? 'border-term-phosphor/60 bg-term-phosphor/15 text-term-phosphor shadow-glow'
									: 'border-term-line bg-term-bg/60 text-term-dim hover:border-term-phosphor/30 hover:text-term-phosphor'
							}`}
							onClick={() => {
								setFilter(item.id);
								resetPaging();
							}}
						>
							{item.label}
						</button>
					);
				})}
			</div>

			<label className='block'>
				<span className='sr-only'>Search for proxy</span>
				<div className='flex items-center gap-2 rounded-md border border-term-line bg-term-bg/80 px-3 py-2.5 focus-within:border-term-phosphor/50'>
					<span className='shrink-0 text-xs text-term-amber'>جستجو</span>
					<input
						type='search'
						value={query}
						onChange={event => {
							setQuery(event.target.value);
							resetPaging();
						}}
						placeholder='سرور یا پورت…'
						className='min-w-0 flex-1 bg-transparent text-sm text-term-phosphor outline-none placeholder:text-term-mute'
					/>
				</div>
			</label>

			{filtered.length === 0 ? (
				<p className='rounded-lg border border-dashed border-term-line px-4 py-8 text-center text-sm text-term-dim'>
					چیزی با این جستجو پیدا نشد.
				</p>
			) : (
				<>
					<ul className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3'>
						{visible.map((proxy, index) => (
							<li key={proxy.link}>
								<ProxyCard proxy={proxy} index={index} />
							</li>
						))}
					</ul>
					{hasMore ? (
						<div className='flex justify-center pt-2'>
							<button
								type='button'
								className='term-btn max-w-xs'
								onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
							>
								بارگذاری بیشتر
							</button>
						</div>
					) : null}
				</>
			)}
		</div>
	);
}
