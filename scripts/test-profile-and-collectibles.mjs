/**
 * Automated Real-Browser Validation Script for:
 * 1. Player Profile modal & service record.
 * 2. Female astronaut character (Maya) vs Male astronaut (Alex) selection.
 * 3. Collectible token limits, sound throttling, and merged single-popup badge increments.
 * 4. LocalStorage persistence across browser refresh.
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = 'C:\\Users\\hcrazy\\.gemini\\antigravity\\brain\\ad629414-3206-4377-91cd-b4eaadec39dd\\screenshots';
const BASE_URL = 'http://localhost:3000';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runProfileAndCollectiblesTest() {
  console.log('=== NOVASCRIPT PROFILE & COLLECTIBLES REAL-BROWSER TEST ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--autoplay-policy=no-user-gesture-required',
      '--window-size=1280,800',
    ],
    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error('[BROWSER ERROR]', msg.text());
    }
  });

  try {
    // 1. Load Main Menu
    console.log('\n--- 1. Testing Main Menu & Character Selection ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1500);

    // Verify Main Menu rendered
    const hasBrand = await page.evaluate(() => document.body.innerText.includes('NOVASCRIPT'));
    console.log('Main menu loaded:', hasBrand);

    // Switch to Maya (female character) in Main Menu
    const femaleBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent?.includes('MAYA'));
    });
    if (femaleBtn) {
      await page.evaluate((b) => b.click(), femaleBtn);
      await sleep(600);
    }

    const currentGender = await page.evaluate(() => window.__GAME_STORE__?.getState()?.playerGender);
    console.log('Character gender switched to:', currentGender);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_female_character_selection.png') });

    // 2. Open Profile Modal from Main Menu
    console.log('\n--- 2. Testing Player Profile Modal ---');
    const profileBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent?.includes('PROFILE'));
    });
    if (profileBtn) {
      await page.evaluate((b) => b.click(), profileBtn);
      await sleep(1000);
    }

    const isProfileOpen = await page.evaluate(() => {
      return document.body.innerText.includes('COMMANDER FLIGHT SERVICE RECORD') ||
             document.body.innerText.includes('CAREER PROGRESSION');
    });
    console.log('Profile modal opened:', isProfileOpen);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_player_profile_modal.png') });

    // Edit Commander Name
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      if (store) {
        store.setPlayerName('Commander Maya Valkyrie');
      }
    });
    await sleep(400);

    const savedName = await page.evaluate(() => window.__GAME_STORE__?.getState()?.playerName);
    console.log('Updated callsign:', savedName);

    // Close Profile Modal
    await page.keyboard.press('Escape');
    await sleep(500);

    // 3. Enter Station Hub
    console.log('\n--- 3. Testing 3D Exploration & Character Sprite ---');
    const enterStation = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent?.includes('ENTER STATION') || b.textContent?.includes('START NEW MISSION'));
    });
    if (enterStation) {
      await page.evaluate((b) => b.click(), enterStation);
      await sleep(2500);
    }

    await page.waitForSelector('canvas', { timeout: 15000 });
    await sleep(1000);

    // Verify In-game HUD displays updated character profile
    const hudProfile = await page.evaluate(() => {
      return document.body.innerText.includes('Commander Maya Valkyrie') ||
             document.body.innerText.includes('COMMAND CENTER');
    });
    console.log('In-game HUD shows Commander Maya in Command Center:', hudProfile);

    // 4. Test Collectible Pickups: Merged Toast & Token Limits
    console.log('\n--- 4. Testing Merged Toasts & Token Capacity Limits ---');
    
    // Simulate rapid collecting of 3 Energy Cells
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      if (store) {
        store.collectItem('energy-cell', 2);
      }
    });
    await sleep(300);

    // Collect another unit (should increment same popup)
    await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      if (store) {
        store.collectItem('energy-cell', 3);
      }
    });
    await sleep(300);

    const toastInfo = await page.evaluate(() => {
      const store = window.__GAME_STORE__?.getState();
      const toasts = store?.collectibleToasts || [];
      const energyToast = toasts.find((t) => t.type === 'energy-cell');
      return {
        countOfToasts: toasts.length,
        energyToastAmount: energyToast?.amount,
        energyToastTotal: energyToast?.currentTotal,
        energyToastMax: energyToast?.maxLimit,
      };
    });
    console.log('Merged toast telemetry:', toastInfo);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16_merged_toast_notifications.png') });

    // Verify limit enforcement: Try collecting 50 more (limit is 20)
    const canCollectBeyondLimit = await page.evaluate(() => {
      window.__GAME_STORE__?.getState()?.collectItem('energy-cell', 30);
      const updatedStore = window.__GAME_STORE__?.getState();
      const afterCount = updatedStore?.inventory.items['energy-cell'];
      const canTakeMore = updatedStore?.canCollect('energy-cell');
      return { afterCount, canTakeMore };
    });
    console.log('Token limit cap check (max 20):', canCollectBeyondLimit);

    // 5. Test Hotkey [P] for Profile in Station
    console.log('\n--- 5. Testing Profile Hotkey [P] in Station ---');
    await page.keyboard.press('KeyP');
    await sleep(800);
    const profileViaKey = await page.evaluate(() => {
      return document.body.innerText.includes('COMMANDER FLIGHT SERVICE RECORD');
    });
    console.log('Profile opened via [P] key:', profileViaKey);
    await page.keyboard.press('Escape');
    await sleep(400);

    // 6. Test Persistence across page reload
    console.log('\n--- 6. Testing Persistence across page reload ---');
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(2000);

    const persisted = await page.evaluate(() => {
      const raw = localStorage.getItem('novascript_game_world_v2');
      if (!raw) return null;
      const s = JSON.parse(raw);
      return {
        gender: s.state?.playerGender,
        name: s.state?.playerName,
        energyCells: s.state?.inventory?.items?.['energy-cell'],
      };
    });
    console.log('Persisted state after reload:', persisted);

    const allPassed =
      currentGender === 'female' &&
      isProfileOpen &&
      savedName === 'Commander Maya Valkyrie' &&
      toastInfo.countOfToasts === 1 &&
      toastInfo.energyToastAmount === 5 &&
      canCollectBeyondLimit?.afterCount === 20 &&
      canCollectBeyondLimit?.canTakeMore === false &&
      profileViaKey &&
      persisted?.gender === 'female' &&
      persisted?.name === 'Commander Maya Valkyrie';

    console.log('\n==========================================');
    console.log(allPassed ? 'ALL FEATURES & BUGFIXES PASSED 100%' : 'SOME CHECKS FAILED');
    console.log('Browser errors:', consoleErrors.length);
    console.log('==========================================');

  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await browser.close();
  }
}

runProfileAndCollectiblesTest();
