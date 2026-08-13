const PROXY_PATTERN =
	/(?:https:\/\/t\.me\/proxy\?|tg:\/\/proxy\?)server=([^&]+)&port=(\d+)&secret=([a-fA-F0-9]+)/gi;

/**
 * Extracts MTProto proxy links from message text and anchor hrefs,
 * then standardizes them to the `tg://proxy?...` scheme.
 */
export function extractProxiesFromContent(rawText: string, hrefs: string[]): string[] {
	const decodedText = rawText.replace(/&amp;/gi, '&');
	const decodedHrefs = hrefs.map(href => href.replace(/&amp;/gi, '&'));

	// Collapse whitespace so proxy URLs broken across line wraps still match.
	const cleanedText = decodedText.replace(/\s+/g, '');
	const combinedContent = `${cleanedText}\n${decodedHrefs.join('\n')}`;

	const proxies: string[] = [];

	for (const match of combinedContent.matchAll(PROXY_PATTERN)) {
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
