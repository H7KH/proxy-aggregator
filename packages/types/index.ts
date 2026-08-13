export interface ScraperConfig {
	targetChannel: string;
	outputFilePath: string;
}

export interface ParsedProxy {
	server: string;
	port: string;
	secret: string;
	fullLink: string;
}

export function parseProxyLink(fullLink: string): ParsedProxy | null {
	try {
		const normalized = fullLink.replace(/^tg:\/\/proxy/i, 'https://t.me/proxy');
		const url = new URL(normalized);
		const server = url.searchParams.get('server');
		const port = url.searchParams.get('port');
		const secret = url.searchParams.get('secret');

		if (!server || !port || !secret) {
			return null;
		}

		return {
			server,
			port,
			secret,
			fullLink: `tg://proxy?server=${server}&port=${port}&secret=${secret}`,
		};
	} catch {
		return null;
	}
}
