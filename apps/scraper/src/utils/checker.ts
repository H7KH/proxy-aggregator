import net from 'node:net';
import { parseProxyLink, type ProxyItem } from '@proxyaggregator/types';

const TIMEOUT_MS = 3000;
const DEFAULT_CONCURRENCY = 20;

function unreachable(link: string): ProxyItem {
	return { link, ping: -1, isAlive: false };
}

/**
 * TCP connect probe against the proxy host/port.
 * Measures handshake time in ms; does not speak the MTProto protocol.
 */
export function checkProxyHealth(link: string): Promise<ProxyItem> {
	return new Promise(resolve => {
		const parsed = parseProxyLink(link);
		const port = parsed ? Number.parseInt(parsed.port, 10) : Number.NaN;

		if (!parsed || !Number.isInteger(port) || port < 1 || port > 65535) {
			resolve(unreachable(link));
			return;
		}

		let settled = false;
		const startedAt = Date.now();
		const socket = net.connect({ host: parsed.server, port });

		const finish = (item: ProxyItem) => {
			if (settled) {
				return;
			}
			settled = true;
			socket.removeAllListeners();
			socket.destroy();
			resolve(item);
		};

		socket.setTimeout(TIMEOUT_MS);
		socket.once('connect', () => {
			finish({ link, ping: Date.now() - startedAt, isAlive: true });
		});
		socket.once('timeout', () => finish(unreachable(link)));
		socket.once('error', () => finish(unreachable(link)));
	});
}

export async function checkProxiesHealth(
	links: string[],
	concurrency = DEFAULT_CONCURRENCY,
): Promise<ProxyItem[]> {
	const results: ProxyItem[] = new Array(links.length);
	let cursor = 0;

	async function worker(): Promise<void> {
		while (cursor < links.length) {
			const index = cursor;
			cursor += 1;
			const link = links[index];
			if (link === undefined) {
				continue;
			}
			results[index] = await checkProxyHealth(link);
		}
	}

	const poolSize = Math.max(1, Math.min(concurrency, links.length));
	await Promise.all(Array.from({ length: poolSize }, () => worker()));

	return results.filter((item): item is ProxyItem => item !== undefined);
}

export function sortByHealth(proxies: ProxyItem[]): ProxyItem[] {
	return [...proxies].sort((a, b) => {
		if (a.isAlive !== b.isAlive) {
			return a.isAlive ? -1 : 1;
		}
		if (a.isAlive && b.isAlive) {
			return a.ping - b.ping;
		}
		return 0;
	});
}
