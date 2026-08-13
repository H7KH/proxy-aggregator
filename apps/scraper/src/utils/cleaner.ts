export function extractProxiesFromContent(rawText: string, hrefs: string[]): string[] {
	const decodedText = rawText.replace(/&amp;/gi, '&');
	const decodedHrefs = hrefs.map(href => href.replace(/&amp;/gi, '&'));

	const textMatches = decodedText.match(/(?:https:\/\/t\.me\/proxy\?|tg:\/\/proxy\?)[^\s<>"']+/gi) ?? [];
	const candidates = [...textMatches, ...decodedHrefs];

	const proxies: string[] = [];

	for (const candidate of candidates) {
		const standardized = standardizeProxyLink(candidate);
		if (standardized) {
			proxies.push(standardized);
		}
	}

	return [...new Set(proxies)];
}

function standardizeProxyLink(rawLink: string): string | null {
	try {
		const parseable = rawLink.trim().replace(/^tg:\/\/proxy/i, 'https://t.me/proxy');
		const urlObj = new URL(parseable);

		if (!/^(?:t\.me)$/i.test(urlObj.hostname) || urlObj.pathname !== '/proxy') {
			return null;
		}

		const server = urlObj.searchParams.get('server')?.trim() ?? '';
		const port = urlObj.searchParams.get('port')?.trim() ?? '';
		let secret = urlObj.searchParams.get('secret')?.trim() ?? '';

		// Fallback when another URL was glued onto the secret (e.g. "...hexhttps://t.me/...").
		secret = secret.replace(/https?:\/\/.*/i, '');

		if (!server || !port || !secret) {
			return null;
		}

		if (!/^\d+$/.test(port)) {
			return null;
		}

		return `tg://proxy?server=${server}&port=${port}&secret=${secret}`;
	} catch {
		return null;
	}
}
