import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = 'C:\\Users\\hcrazy\\.gemini\\antigravity\\brain\\ad629414-3206-4377-91cd-b4eaadec39dd\\screenshots';

async function clickElementByText(page, tag, texts) {
  return await page.evaluate((tag, targetTexts) => {
    const elements = Array.from(document.querySelectorAll(tag));
    for (const el of elements) {
      const text = (el.textContent || '').trim();
      for (const t of targetTexts) {
        if (text.includes(t)) {
          el.click();
          return { found: true, text: text.slice(0, 50) };
        }
      }
    }
    return { found: false };
  }, tag, texts);
}

async function run() {
  console.log('Testing CAD Blueprint vs Cinematic 3D Visual Modes...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  // Enter Station
  await clickElementByText(page, 'button', ['ENTER STATION', 'دخول المحطة']);
  await new Promise((r) => setTimeout(r, 2500));

  // 1. Screenshot Mode 1: Cinematic 3D
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setVisualMode('cinematic-3d');
    }
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '59_cinematic_mode_comparison.png') });
  console.log('Saved 59_cinematic_mode_comparison.png');

  // 2. Screenshot Mode 4: CAD Blueprint Enhanced
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setVisualMode('performance');
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '60_cad_blueprint_mode_enhanced.png') });
  console.log('Saved 60_cad_blueprint_mode_enhanced.png');

  await browser.close();
  console.log('Comparison screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
