import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = 'C:\\Users\\hcrazy\\.gemini\\antigravity\\brain\\ad629414-3206-4377-91cd-b4eaadec39dd\\screenshots';
const BASE_URL = 'http://localhost:3000';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('=== NOVASCRIPT COMPREHENSIVE VERIFICATION SUITE ===');

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

    // Test 1: Arabic Full Exploration HUD in 3D Station
    console.log('3. Capturing Arabic Exploration HUD & Minimap...');
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      store?.setLanguage('ar');
      store?.setCurrentRoom('hallway');
      store?.setPlayerPosition({ x: 0, y: 0, z: 0 });
    });
    await sleep(1500);

    const p1 = path.join(SCREENSHOT_DIR, '28_arabic_full_exploration_hud.png');
    await page.screenshot({ path: p1 });
    console.log('Saved:', p1);

    // Test 2: Cyberpunk Neon Visual Mode
    console.log('4. Capturing Cyberpunk Neon Mode...');
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      store?.setLanguage('en');
      store?.setVisualMode('cyber-neon');
    });
    await sleep(1500);

    const p2 = path.join(SCREENSHOT_DIR, '29_visual_mode_cyber_neon.png');
    await page.screenshot({ path: p2 });
    console.log('Saved:', p2);

    // Test 3: 16-Bit Retro Pixel Mode
    console.log('5. Capturing 16-Bit Retro Pixel Mode in 3D...');
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      store?.setVisualMode('retro-pixel');
    });
    await sleep(1500);

    const p3 = path.join(SCREENSHOT_DIR, '30_visual_mode_retro_pixel_in_game.png');
    await page.screenshot({ path: p3 });
    console.log('Saved:', p3);

    // Reset visual mode to cinematic-3d
    await page.evaluate(() => {
      window.__GAME_STORE__?.getState()?.setVisualMode('cinematic-3d');
    });
    await sleep(600);

    // Test 4: Clean Mission Selector with SVG Celestial Spheres
    console.log('6. Opening Mission Selector at Mission Board...');
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      if (store) {
        store.setPhase('exploring');
        store.setActiveMiniGame(null);
        store.setCurrentRoom('mission-board');
        store.setPlayerPosition({ x: 0, y: 0, z: 2 });
      }
    });
    await sleep(800);
    await page.keyboard.press('KeyE');
    await sleep(1500);

    const p4 = path.join(SCREENSHOT_DIR, '31_clean_mission_selector_svg_planets.png');
    await page.screenshot({ path: p4 });
    console.log('Saved:', p4);

    // Close Mission Selector
    await page.keyboard.press('Escape');
    await sleep(500);

    // Test 5: Localized Workbench & Crafting in Arabic
    console.log('7. Opening Crafting Workbench in Arabic...');
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      if (store) {
        store.setLanguage('ar');
        store.setPhase('exploring');
        store.setActiveMiniGame(null);
        store.setCurrentRoom('hangar');
        store.setPlayerPosition({ x: -6, y: 0, z: -7 });
      }
    });
    await sleep(800);
    await page.keyboard.press('KeyE');
    await sleep(1200);

    const p5 = path.join(SCREENSHOT_DIR, '32_localized_workbench_and_inventory.png');
    await page.screenshot({ path: p5 });
    console.log('Saved:', p5);

    // Close Crafting
    await page.keyboard.press('Escape');
    await sleep(500);
    await page.evaluate(() => {
      window.__GAME_STORE__?.getState()?.setLanguage('en');
    });

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
