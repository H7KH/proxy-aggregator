import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { config } from './config';
import { extractProxiesFromText } from './utils/cleaner';

async function scrape(): Promise<void> {
	console.log(`Fetching public channel preview: ${config.targetChannel}`);

	const { data } = await axios.get<string>(config.targetChannel, {
		timeout: 30_000,
		headers: {
			'User-Agent': 'Mozilla/5.0 (compatible; ProxyAggregator/1.0; +https://github.com)',
			Accept: 'text/html,application/xhtml+xml',
		},
	});

	const $ = cheerio.load(data);
	const chunks: string[] = [];

	$('.tgme_widget_message_text').each((_, element) => {
		chunks.push($(element).text());
		$(element)
			.find('a[href]')
			.each((__, anchor) => {
				const href = $(anchor).attr('href');
				if (href) {
					chunks.push(href);
				}
			});
	});

	$('a[href*="t.me/proxy"], a[href*="tg://proxy"]').each((_, element) => {
		const href = $(element).attr('href');
		if (href) {
			chunks.push(href);
		}
	});

	const uniqueProxies = [...new Set(chunks.flatMap(extractProxiesFromText))];

	if (uniqueProxies.length === 0) {
		console.warn('No MTProto proxies found. Leaving existing data unchanged.');
		return;
	}

	const dir = path.dirname(config.outputFilePath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	fs.writeFileSync(config.outputFilePath, `${JSON.stringify(uniqueProxies, null, 2)}\n`);
	console.log(`Saved ${uniqueProxies.length} unique proxies to ${config.outputFilePath}`);
}

scrape().catch(error => {
	console.error('Fatal error during scraping:', error);
	process.exit(1);
});
