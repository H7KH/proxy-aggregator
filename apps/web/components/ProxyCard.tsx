'use client';

import { parseProxyLink, type ProxyItem } from '@proxyaggregator/types';
import { useRef, useState } from 'react';

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

function copyWithFallback(text: string): boolean {
	const textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.setAttribute('readonly', '');
	textarea.style.position = 'fixed';
	textarea.style.top = '0';
	textarea.style.left = '0';
	textarea.style.opacity = '0';
	document.body.appendChild(textarea);
	textarea.focus();
	textarea.select();
	textarea.setSelectionRange(0, text.length);

	try {
		return document.execCommand('copy');
	} catch {
		return false;
	} finally {
		document.body.removeChild(textarea);
	}
}

export function ProxyCard({ proxy, index }: ProxyCardProps) {
	const [copied, setCopied] = useState(false);
	const [copyPulse, setCopyPulse] = useState(0);
	const resetTimer = useRef<number | null>(null);
	const parsed = parseProxyLink(proxy.link);
	const server = parsed?.server ?? proxy.link;
	const port = parsed?.port ?? '—';
	const session = String(index + 1).padStart(3, '0');
	const cleanedLink = proxy.link.replace(/&amp;/g, '&').trim();

	function showCopiedFeedback() {
		if (resetTimer.current !== null) {
			window.clearTimeout(resetTimer.current);
		}
		setCopied(true);
		setCopyPulse(tick => tick + 1);
		resetTimer.current = window.setTimeout(() => {
			setCopied(false);
			resetTimer.current = null;
		}, 2000);
	}

	async function handleCopy() {
		// Show feedback immediately so mobile taps feel responsive even if clipboard is slow.
		showCopiedFeedback();

		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(cleanedLink);
				return;
			}
		} catch {
			// Fall through to legacy copy for older / restricted mobile browsers.
		}

		copyWithFallback(cleanedLink);
	}

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
					<span className='ltr-iso'>{cleanedLink}</span>
				</p>
			</div>

			<div className='mt-5 flex items-center gap-2'>
				<a href={cleanedLink} target='_self' className='term-btn min-w-0 flex-1'>
					اتصال
				</a>
				<button
					type='button'
					onClick={() => void handleCopy()}
					className={`inline-flex min-h-11 min-w-[4.5rem] shrink-0 touch-manipulation items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-term-amber/70 active:scale-95 sm:px-4 ${
						copied
							? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300'
							: 'border-term-line bg-term-bg/80 text-term-dim active:border-term-phosphor/40 active:bg-term-phosphor/10 active:text-term-phosphor hover:border-term-phosphor/40 hover:text-term-phosphor'
					}`}
					aria-label={copied ? 'کپی شد' : 'کپی لینک پروکسی'}
				>
					<span key={copyPulse} className='inline-block animate-copiedPop'>
						{copied ? 'کپی شد!' : 'کپی'}
					</span>
				</button>
			</div>
		</article>
	);
}
