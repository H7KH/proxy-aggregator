import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { config } from './config';
import { checkProxiesHealth, sortByHealth } from './utils/checker';
import { extractProxiesFromContent } from './utils/cleaner';

const REQUEST_HEADERS = {
	'User-Agent': 'Mozilla/5.0 (compatible; ProxyAggregator/1.0; +https://github.com)',
	Accept: 'text/html,application/xhtml+xml',
};

async function scrapeChannel(channelUrl: string): Promise<string[]> {
	console.log(`Fetching public channel preview: ${channelUrl}`);

	const { data } = await axios.get<string>(channelUrl, {
		timeout: 30_000,
		headers: REQUEST_HEADERS,
	});

	const $ = cheerio.load(data);
	let allText = '';
	const allHrefs: string[] = [];

	$('.tgme_widget_message_text').each((_, element) => {
		allText += $(element).text() + '\n';

		$(element)
			.find('a')
			.each((__, anchor) => {
				const href = $(anchor).attr('href');
				if (href) {
					allHrefs.push(href);
				}
			});
	});

	return extractProxiesFromContent(allText, allHrefs);
}

async function scrape(): Promise<void> {
	const collected: string[] = [];

	for (const channel of config.targetChannels) {
		try {
			const proxies = await scrapeChannel(channel);
			console.log(`Found ${proxies.length} proxies in ${channel}`);
			collected.push(...proxies);
		} catch (error) {
			console.error(`Failed to scrape ${channel}. Continuing with remaining channels.`, error);
		}
	}

	const uniqueLinks = [...new Set(collected)];

	if (uniqueLinks.length === 0) {
		console.warn('No MTProto proxies found. Exiting...');
		process.exit(0);
	}

	console.log(`Running TCP health checks on ${uniqueLinks.length} unique proxies...`);
	const checked = await checkProxiesHealth(uniqueLinks);
	const ranked = sortByHealth(checked);
	const aliveCount = ranked.filter(item => item.isAlive).length;
	console.log(`Health check complete: ${aliveCount} alive, ${ranked.length - aliveCount} unreachable`);

	const dir = path.dirname(config.outputFilePath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	fs.writeFileSync(config.outputFilePath, `${JSON.stringify(ranked, null, 2)}\n`);
	console.log(`Saved ${ranked.length} proxies to ${config.outputFilePath}`);
}

scrape().catch(error => {
	console.error('Fatal error during scraping:', error);
	process.exit(1);
});
