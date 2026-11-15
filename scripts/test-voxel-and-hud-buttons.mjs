import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = 'C:\\Users\\hcrazy\\.gemini\\antigravity\\brain\\ad629414-3206-4377-91cd-b4eaadec39dd\\screenshots';
const BASE_URL = 'http://localhost:3000';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('=== NOVASCRIPT MINECRAFT VOXEL & HUD VERIFICATION ===');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon') && !text.includes('AudioContext')) {
          errors.push(text);
        }
      }
    });

    console.log('1. Loading main page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await sleep(2000);

    // Enter station first
    console.log('2. Entering Station...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const enterBtn = btns.find(b => b.textContent.includes('ENTER STATION') || b.textContent.includes('دخول'));
      if (enterBtn) enterBtn.click();
    });
    await sleep(2500);

    // Test 1: Minecraft 3D Voxel Mode in Central Corridor
    console.log('3. Capturing 3D Minecraft Voxel Space Station...');
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      if (store) {
        store.setVisualMode('retro-pixel');
        store.setCurrentRoom('hallway');
        store.setPlayerPosition({ x: 0, y: 0, z: 0 });
      }
    });
    await sleep(1500);

    const p1 = path.join(SCREENSHOT_DIR, '33_minecraft_voxel_mode_3d.png');
    await page.screenshot({ path: p1 });
    console.log('Saved:', p1);

    // Test 2: Minecraft Voxel Hangar with Voxel Crafting Table & Chest
    console.log('4. Capturing Voxel Hangar (Crafting Table & Chest)...');
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      if (store) {
        store.setCurrentRoom('hangar');
        store.setPlayerPosition({ x: -4, y: 0, z: -5 });
      }
    });
    await sleep(1500);

    const p2 = path.join(SCREENSHOT_DIR, '37_voxel_hangar_crafting_table.png');
    await page.screenshot({ path: p2 });
    console.log('Saved:', p2);

    // Test 3: Cyberpunk Neon Mode
    console.log('5. Capturing Enhanced Cyberpunk Neon Mode...');
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      if (store) {
        store.setVisualMode('cyber-neon');
        store.setCurrentRoom('command-center');
        store.setPlayerPosition({ x: 0, y: 0, z: 0 });
      }
    });
    await sleep(1500);

    const p3 = path.join(SCREENSHOT_DIR, '34_cyber_neon_mode_enhanced.png');
    await page.screenshot({ path: p3 });
    console.log('Saved:', p3);

    // Test 4: Redesigned Tactical Command Dock in Arabic
    console.log('6. Capturing Redesigned Command Dock & Top Bar in Arabic...');
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      if (store) {
        store.setVisualMode('cinematic-3d');
        store.setLanguage('ar');
        store.setCurrentRoom('hallway');
        store.setPlayerPosition({ x: 0, y: 0, z: 0 });
      }
    });
    await sleep(1500);

    const p4 = path.join(SCREENSHOT_DIR, '35_interactive_tactical_dock_arabic.png');
    await page.screenshot({ path: p4 });
    console.log('Saved:', p4);

    // Test 5: Redesigned Command Dock in English
    console.log('7. Capturing Redesigned Command Dock in English...');
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      if (store) {
        store.setLanguage('en');
      }
    });
    await sleep(1200);

    const p5 = path.join(SCREENSHOT_DIR, '36_interactive_tactical_dock_english.png');
    await page.screenshot({ path: p5 });
    console.log('Saved:', p5);

    console.log('Browser errors logged:', errors.length);
    if (errors.length > 0) {
      console.log('Errors:', errors);
    }

    console.log('\n=== ALL CAPTURES SUCCEEDED! ===');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
