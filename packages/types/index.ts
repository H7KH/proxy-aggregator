export interface ScraperConfig {
	targetChannels: string[];
	outputFilePath: string;
}

export interface ParsedProxy {
	server: string;
	port: string;
	secret: string;
	fullLink: string;
}

export interface ProxyItem {
	link: string;
	ping: number; // Ping in ms, or -1 if unreachable
	isAlive: boolean;
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
