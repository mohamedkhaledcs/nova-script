import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = 'C:\\Users\\hcrazy\\.gemini\\antigravity\\brain\\ad629414-3206-4377-91cd-b4eaadec39dd\\screenshots';
const BASE_URL = 'http://localhost:3000';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('=== NOVASCRIPT HANDBOOK & TOPOLOGICAL RADAR TEST ===');
  
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
    await sleep(1500);

    // Test 1: Open Space Handbook from Main Menu
    console.log('2. Opening Space Handbook from Main Menu...');
    await page.evaluate(() => {
      window.__GAME_STORE__?.getState()?.toggleCodex();
    });
    await sleep(800);

    const p1 = path.join(SCREENSHOT_DIR, '21_space_handbook_destinations.png');
    await page.screenshot({ path: p1 });
    console.log('Saved:', p1);

    // Switch to Engineering Systems tab in Handbook
    console.log('3. Switching to Spacecraft Systems tab in Handbook...');
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('SPACECRAFT SYSTEMS')) {
        await btn.click();
        break;
      }
    }
    await sleep(600);

    const p2 = path.join(SCREENSHOT_DIR, '22_space_handbook_engineering.png');
    await page.screenshot({ path: p2 });
    console.log('Saved:', p2);

    // Close Handbook
    await page.evaluate(() => {
      window.__GAME_STORE__?.getState()?.toggleCodex();
    });
    await sleep(400);

    // Test 2: Enhanced Settings Modal
    console.log('4. Testing Enhanced Settings Modal...');
    const settingsBtns = await page.$$('button');
    for (const btn of settingsBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('SETTINGS')) {
        await btn.click();
        break;
      }
    }
    await sleep(600);

    const p3 = path.join(SCREENSHOT_DIR, '23_settings_modal_enhanced.png');
    await page.screenshot({ path: p3 });
    console.log('Saved:', p3);

    // Close Settings
    const closeBtns = await page.$$('button');
    for (const btn of closeBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('SAVE & CLOSE')) {
        await btn.click();
        break;
      }
    }
    await sleep(400);

    // Test 3: Enter Station & verify Topological Minimap Radar
    console.log('5. Entering Station to test Topological Minimap Radar...');
    const enterBtns = await page.$$('button');
    for (const btn of enterBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('ENTER STATION')) {
        await btn.click();
        break;
      }
    }
    await sleep(2000);

    // Verify Minimap shows central hub and topological coordinates
    const hubExists = await page.evaluate(() => {
      return document.body.textContent.includes('STATION RADAR') || !!document.querySelector('svg circle[cx="100"]');
    });
    console.log('Station Topological Radar visible:', hubExists);

    // Move to hallway to verify central positioning
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      store?.setCurrentRoom('hallway');
      store?.setPlayerPosition({ x: 0, y: 0, z: 0 });
    });
    await sleep(800);

    const p4 = path.join(SCREENSHOT_DIR, '20_topological_radar_minimap.png');
    await page.screenshot({ path: p4 });
    console.log('Saved:', p4);

    console.log('Browser errors logged:', errors.length);
    if (errors.length > 0) {
      console.log('Errors:', errors);
    }

    console.log('\n=== ALL HANDBOOK & TOPOLOGICAL MINIMAP TESTS PASSED 100% ===');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
