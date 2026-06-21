import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dir = join(__dirname, 'temporary screenshots');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const existing = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.png')) : [];
const n = existing.length + 1;
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const filepath = join(dir, filename);

const chromePaths = [
  'C:/Users/John/.cache/puppeteer/chrome/win64-149.0.7827.22/chrome-win64/chrome.exe',
  'C:/Users/John/.cache/puppeteer/chrome/win64-148.0.7778.167/chrome-win64/chrome.exe',
];
const executablePath = chromePaths.find(p => existsSync(p));
if (!executablePath) throw new Error('Chrome not found in puppeteer cache');

const browser = await puppeteer.launch({ executablePath, headless: true, protocolTimeout: 60000 });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

// trigger any loading="lazy" images by scrolling through the full page in real steps (yielding so the
// browser's lazy-load observer actually fires), then give it a fixed window to finish fetching
await page.evaluate(async () => {
  const step = window.innerHeight;
  const height = document.body.scrollHeight;
  for (let y = 0; y < height; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
});
await new Promise(r => setTimeout(r, 1500));

await page.screenshot({ path: filepath, fullPage: true });
await browser.close();
console.log(`Saved: ${filepath}`);
