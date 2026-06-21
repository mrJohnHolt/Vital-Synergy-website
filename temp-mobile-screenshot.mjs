import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dir = join(__dirname, 'temporary screenshots');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || 'mobile';
const delayMs = Number(process.argv[4] || 0);
const filepath = join(dir, `mobile-${label}.png`);

const chromePaths = [
  'C:/Users/John/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
  'C:/Users/John/.cache/puppeteer/chrome/win64-148.0.7778.167/chrome-win64/chrome.exe',
];
const executablePath = chromePaths.find(p => existsSync(p));
if (!executablePath) throw new Error('Chrome not found in puppeteer cache');

const browser = await puppeteer.launch({ executablePath, headless: true, protocolTimeout: 60000 });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

const testiSection = await page.$('.testi-bg.sec-testi');
if (testiSection) await testiSection.scrollIntoView();
if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));

if (testiSection) {
  await testiSection.screenshot({ path: filepath });
} else {
  await page.screenshot({ path: filepath });
}
await browser.close();
console.log(`Saved: ${filepath}`);
