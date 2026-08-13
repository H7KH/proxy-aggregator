import type { ScraperConfig } from '@proxyaggregator/types';
import path from 'node:path';

const DEFAULT_CHANNELS = ['https://t.me/s/data_proxy', 'https://t.me/iMTProto'];

function toChannelWebView(url: string): string {
	const match = url.match(/^https?:\/\/t\.me\/(?!s\/)([^/?#]+)/i);
	if (match?.[1]) {
		return `https://t.me/s/${match[1]}`;
	}
	return url;
}

function resolveChannels(): string[] {
	const fromList = process.env.TARGET_CHANNELS;
	const fromSingle = process.env.TARGET_CHANNEL;

	const raw = fromList
		? fromList
				.split(',')
				.map(channel => channel.trim())
				.filter(Boolean)
		: fromSingle
			? [fromSingle]
			: DEFAULT_CHANNELS;

	return [...new Set(raw.map(toChannelWebView))];
}

export const config: ScraperConfig = {
	targetChannels: resolveChannels(),
	outputFilePath: process.env.OUTPUT_PATH || path.join(process.cwd(), 'data', 'proxies.json'),
};
