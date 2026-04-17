// Core screenshot capture logic using Puppeteer
const puppeteer = require('puppeteer-core');

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium';

let browserInstance = null;

// Array of random user agents
const generateRandomUA = () => {
	const userAgents = [
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
		'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
	];
	// Get a random index based on the length of the user agents array 
	const randomUAIndex = Math.floor(Math.random() * userAgents.length);
	// Return a random user agent using the index above
	return userAgents[randomUAIndex];
}

async function getBrowser() {
	// Reuse the browser instance across requests for performance
	if (browserInstance && browserInstance.isConnected()) {
		return browserInstance;
	}

	browserInstance = await puppeteer.launch({
		executablePath: CHROMIUM_PATH,
		// headless: 'new',
		headless: 'shell',
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--disable-gpu',
			'--hide-scrollbars'
		]
	});

	return browserInstance;
}

async function captureScreenshot({ url, width, height, fullPage, format, quality, delay }) {
	const browser = await getBrowser();
	const page = await browser.newPage();

	// Custom user agent from generateRandomUA() function
	const customUA = generateRandomUA();

	// Set custom user agent
	await page.setUserAgent(customUA);

	try {
		// Set viewport dimensions to control the screenshot size
		await page.setViewport({ width, height, deviceScaleFactor: 2 });

		await page.goto(url, {
			waitUntil: 'networkidle2',
			timeout: 30000
		});

		// Optional delay for animations or lazy-loaded content to finish
		if (delay > 0) {
			await new Promise(r => setTimeout(r, delay));
		}

		// Capture the screenshot with the requested settings
		const screenshotOptions = {
			type: format === 'jpg' ? 'jpeg' : 'png',
			fullPage: fullPage,
		};

		if (format === 'jpg') {
			screenshotOptions.quality = quality;
		}

		console.log(`Capturing screenshot of ${url} with options:`, screenshotOptions);

		return await page.screenshot(screenshotOptions);
	} finally {
		await page.close();
	}
}

module.exports = { captureScreenshot };
