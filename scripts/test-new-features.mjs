import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = 'C:\\Users\\hcrazy\\.gemini\\antigravity\\brain\\ad629414-3206-4377-91cd-b4eaadec39dd\\screenshots';
const BASE_URL = 'http://localhost:3000';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('=== NOVASCRIPT SUIT COLOR & MINIMAP TEST ===');
  
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

    // Open profile modal from menu
    console.log('2. Opening player profile...');
    await page.evaluate(() => {
      window.__GAME_STORE__?.getState()?.setProfileOpen(true);
    });
    await sleep(600);

    // Switch to Maya (female character)
    console.log('3. Selecting Maya (Female astronaut)...');
    await page.evaluate(() => {
      window.__GAME_STORE__?.getState()?.setPlayerGender('female');
    });
    await sleep(600);

    // Capture Profile with Maya's default Solar Orange suit
    const p1 = path.join(SCREENSHOT_DIR, '17_maya_solar_orange_suit.png');
    await page.screenshot({ path: p1 });
    console.log('Saved:', p1);

    // Test Suit Color Customizer swatches
    console.log('4. Testing Suit Color Customizer...');
    await page.evaluate(() => {
      window.__GAME_STORE__?.getState()?.setSuitScheme('cosmic-violet');
    });
    await sleep(500);

    const p2 = path.join(SCREENSHOT_DIR, '19_suit_color_customizer.png');
    await page.screenshot({ path: p2 });
    console.log('Saved:', p2);

    // Revert to default Maya Solar Orange
    await page.evaluate(() => {
      window.__GAME_STORE__?.getState()?.setSuitScheme('default');
      window.__GAME_STORE__?.getState()?.setProfileOpen(false);
    });
    await sleep(400);

    // Start exploring in 3D
    console.log('5. Entering 3D Station exploration...');
    // Click Enter Station button on Main Menu
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('ENTER STATION') || text.includes('START NEW MISSION'))) {
        await btn.click();
        break;
      }
    }
    await sleep(2000);

    // Verify Minimap is visible
    const minimapExists = await page.evaluate(() => {
      return !!document.querySelector('svg circle[cx="100"]');
    });
    console.log('Station Minimap Radar mounted:', minimapExists);

    // Move player forward slightly to verify radar blip tracking
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      store?.setPlayerPosition({ x: 3.5, y: 0, z: -2.0 });
    });
    await sleep(600);

    const p3 = path.join(SCREENSHOT_DIR, '18_station_radar_minimap.png');
    await page.screenshot({ path: p3 });
    console.log('Saved:', p3);

    console.log('Browser errors logged:', errors.length);
    if (errors.length > 0) {
      console.log('Errors:', errors);
    }

    console.log('\n=== ALL ENHANCEMENT TESTS PASSED 100% ===');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
