import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = 'C:\\Users\\hcrazy\\.gemini\\antigravity\\brain\\ad629414-3206-4377-91cd-b4eaadec39dd\\screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Robust helper to click element containing text
async function clickElementByText(page, tag, texts) {
  return await page.evaluate((tag, targetTexts) => {
    const elements = Array.from(document.querySelectorAll(tag));
    for (const el of elements) {
      const text = el.textContent || '';
      for (const t of targetTexts) {
        if (text.includes(t)) {
          el.click();
          return true;
        }
      }
    }
    return false;
  }, tag, texts);
}

// Robust helper to click by selector or fallback to text
async function clickSelector(page, selector) {
  const el = await page.$(selector);
  if (el) {
    await el.click();
    return true;
  }
  return false;
}

async function run() {
  console.log('Launching browser via Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Main Menu English
  await page.screenshot({ path: path.join(outDir, '38_main_menu_english.png') });
  console.log('Saved 38_main_menu_english.png');

  // Toggle Language to Arabic on Main Menu
  const toggledLang = await page.evaluate(() => {
    const btn = document.querySelector('button[title*="Toggle English / Arabic"], button[title*="تبديل اللغة"], button[aria-label*="Toggle English"]');
    if (btn) {
      btn.click();
      return true;
    }
    // Fallback: use window.__GAME_STORE__
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setLanguage('ar');
      return true;
    }
    return false;
  });
  console.log('Toggled language to Arabic:', toggledLang);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '39_main_menu_arabic.png') });
  console.log('Saved 39_main_menu_arabic.png');

  // Open About Modal in Arabic
  const openedAbout = await clickElementByText(page, 'button', ['عن اللعبة', 'ABOUT']);
  console.log('Opened About Modal:', openedAbout);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '40_about_modal_arabic.png') });
  console.log('Saved 40_about_modal_arabic.png');

  // Close About Modal
  await clickElementByText(page, 'button', ['إغلاق', 'CLOSE']);
  await new Promise((r) => setTimeout(r, 500));

  // Click Enter Station to enter 3D Space Station
  const enteredStation = await clickElementByText(page, 'button', ['دخول المحطة الفضائية', 'ENTER STATION']);
  console.log('Entered Station clicked:', enteredStation);
  await new Promise((r) => setTimeout(r, 2500));

  // 2. Exploration in Arabic with Mode Switcher & Minecraft Beacon
  await page.screenshot({ path: path.join(outDir, '41_exploration_arabic_hud_beacon.png') });
  console.log('Saved 41_exploration_arabic_hud_beacon.png');

  // Cycle Visual Mode to Voxel 3D (Minecraft) using quick pill
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setVisualMode('retro-pixel');
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '42_hud_mode_voxel_beacon.png') });
  console.log('Saved 42_hud_mode_voxel_beacon.png');

  // Switch to Cyber Neon
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setVisualMode('cyber-neon');
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '43_hud_mode_cyber_neon.png') });
  console.log('Saved 43_hud_mode_cyber_neon.png');

  // Switch to CAD Blueprint
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setVisualMode('cad-blueprint');
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '44_hud_mode_cad_blueprint.png') });
  console.log('Saved 44_hud_mode_cad_blueprint.png');

  // Switch back to 3D Cinematic
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setVisualMode('cinematic-3d');
    }
  });
  await new Promise((r) => setTimeout(r, 800));

  // Open Space Handbook Encyclopedia in Arabic via Store
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().toggleCodex();
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '45_space_handbook_arabic_destinations.png') });
  console.log('Saved 45_space_handbook_arabic_destinations.png');

  // Click Subsystems tab in Handbook
  await clickElementByText(page, 'button', ['أنظمة المركبة', 'SPACECRAFT SYSTEMS']);
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '46_space_handbook_arabic_subsystems.png') });
  console.log('Saved 46_space_handbook_arabic_subsystems.png');

  // Close Space Handbook
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().toggleCodex();
    }
  });
  await new Promise((r) => setTimeout(r, 800));

  // Open Minimap and screenshot
  await page.screenshot({ path: path.join(outDir, '47_station_minimap_arabic.png') });
  console.log('Saved 47_station_minimap_arabic.png');

  // Navigate directly to Mission Board Room and open Mission Selector
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setCurrentRoom('mission-board');
      window.__GAME_STORE__.getState().setInteractionTarget('mb-board');
    }
    window.dispatchEvent(new CustomEvent('novascript:interact'));
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '48_mission_selector_modal_arabic.png') });
  console.log('Saved 48_mission_selector_modal_arabic.png');

  // Select Lunar Reconnaissance Mission (Moon / A001)
  const clickedMoon = await clickElementByText(page, 'button', ['مهمة استكشاف القمر', 'LUNAR RECONNAISSANCE']);
  console.log('Selected Lunar Reconnaissance Mission:', clickedMoon);
  await new Promise((r) => setTimeout(r, 1500));

  // 3. Mission Briefing Screen in Arabic
  await page.screenshot({ path: path.join(outDir, '49_mission_control_briefing_arabic.png') });
  console.log('Saved 49_mission_control_briefing_arabic.png');

  // Accept mandate and proceed to Question Operations
  const acceptedMandate = await clickElementByText(page, 'button', ['قبول التكليف وبدء العمليات', 'ACCEPT MANDATE']);
  console.log('Accepted mandate:', acceptedMandate);
  await new Promise((r) => setTimeout(r, 1500));

  // 4. Mission Question Operations in Arabic
  await page.screenshot({ path: path.join(outDir, '50_question_viewer_arabic.png') });
  console.log('Saved 50_question_viewer_arabic.png');

  // Select Choice Option A
  const selectedOption = await clickElementByText(page, 'button', ['الخيار (أ)', 'OPTION A', 'اختيار المسار أ']);
  console.log('Selected Option A:', selectedOption);
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '51_decision_consequence_modal_arabic.png') });
  console.log('Saved 51_decision_consequence_modal_arabic.png');

  // Confirm Decision and Commit
  const confirmedDecision = await clickElementByText(page, 'button', ['تأكيد القرار ومتابعة الرحلة', 'COMMIT DECISION']);
  console.log('Confirmed Decision:', confirmedDecision);
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '52_next_question_arabic.png') });
  console.log('Saved 52_next_question_arabic.png');

  await browser.close();
  console.log('=== All 15 verification screenshots captured successfully! ===');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
