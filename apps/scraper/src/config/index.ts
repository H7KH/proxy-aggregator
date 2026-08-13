import path from 'node:path';
import type { ScraperConfig } from '@proxyaggregator/types';

function toChannelWebView(url: string): string {
	const match = url.match(/^https?:\/\/t\.me\/(?!s\/)([^/?#]+)/i);
	if (match?.[1]) {
		return `https://t.me/s/${match[1]}`;
	}
	return url;
}

export const config: ScraperConfig = {
	targetChannel: toChannelWebView(process.env.TARGET_CHANNEL || 'https://t.me/s/data_proxy'),
	outputFilePath: process.env.OUTPUT_PATH || path.join(process.cwd(), 'data', 'proxies.json'),
};
