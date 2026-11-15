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
  console.log('Testing Radar Hide/Show and Bilingual Keys...');
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

  // 1. Check radar is visible initially
  await page.screenshot({ path: path.join(outDir, '53_radar_open_initially.png') });
  console.log('Saved 53_radar_open_initially.png');

  // 2. Click the hide button on radar header
  const clickedHide = await page.evaluate(() => {
    const btn = document.querySelector('button[title*="Hide Radar"], button[title*="إخفاء الرادار"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Hide button on radar:', clickedHide);
  await new Promise((r) => setTimeout(r, 600));

  // 3. Screenshot collapsed pill bottom-right
  await page.screenshot({ path: path.join(outDir, '54_radar_minimized_pill.png') });
  console.log('Saved 54_radar_minimized_pill.png');

  // 4. Click the collapsed pill to restore radar
  const clickedRestore = await page.evaluate(() => {
    const btn = document.querySelector('button[title*="Restore Station Radar"], button[title*="استعادة وعرض الرادار"], button[title*="Open Radar"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Restore pill button:', clickedRestore);
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, '55_radar_restored.png') });
  console.log('Saved 55_radar_restored.png');

  // 5. Test pressing physical 'KeyM'
  await page.keyboard.press('KeyM');
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, '56_radar_hidden_via_m_key.png') });
  console.log('Saved 56_radar_hidden_via_m_key.png');

  // 6. Test pressing Arabic key 'ة' (physical M on Arabic layout) to restore
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ة', code: 'KeyM', bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, '57_radar_restored_via_arabic_key.png') });
  console.log('Saved 57_radar_restored_via_arabic_key.png');

  // 7. Test switching language to Arabic and checking radar in Arabic
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setLanguage('ar');
    }
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, '58_radar_arabic_view.png') });
  console.log('Saved 58_radar_arabic_view.png');

  await browser.close();
  console.log('Radar and Bilingual Key testing completed successfully!');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
