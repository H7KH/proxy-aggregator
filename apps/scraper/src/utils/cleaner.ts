const PROXY_PATTERN =
	/(?:https:\/\/t\.me\/proxy|tg:\/\/proxy)\?server=([^&]+)&(?:amp;)?port=(\d+)&(?:amp;)?secret=([a-zA-Z0-9]+?)(?=https:\/\/|tg:\/\/|&|$)/gi;

export function extractProxiesFromText(rawText: string): string[] {
	const cleanedText = rawText.replace(/\s+/g, '').replace(/&amp;/gi, '&');
	const proxies: string[] = [];

	for (const match of cleanedText.matchAll(PROXY_PATTERN)) {
		const server = decodeURIComponent(match[1] ?? '');
		const port = match[2] ?? '';
		const secret = decodeURIComponent(match[3] ?? '');

		if (!server || !port || !secret) {
			continue;
		}

		proxies.push(`tg://proxy?server=${server}&port=${port}&secret=${secret}`);
	}

	return [...new Set(proxies)];
}
