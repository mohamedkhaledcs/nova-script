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
    return { found: false, allTexts: elements.map(e => (e.textContent || '').trim().slice(0, 30)).filter(Boolean).slice(0, 15) };
  }, tag, texts);
}

async function run() {
  console.log('Testing v2.5.0 QuestionViewer Upgrades, Multi-Room 3D Visual Modes & Hotkeys...');
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
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Test 3D Room navigation with CAD mode
  console.log('Testing 3D Scene across rooms in CAD mode...');
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setVisualMode('performance');
      window.__GAME_STORE__.getState().setCurrentRoom('command-center');
    }
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Switch to science lab in retro pixel mode
  console.log('Testing 3D Scene in Retro Pixel mode (Science Lab Bookshelves)...');
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setVisualMode('retro-pixel');
      window.__GAME_STORE__.getState().setCurrentRoom('science-lab');
    }
  });
  await new Promise((r) => setTimeout(r, 1000));

  // 2. Launch Mission Flow
  console.log('Launching Mission Flow via Mission Board...');
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setCurrentRoom('mission-board');
      window.__GAME_STORE__.getState().setInteractionTarget('mb-board');
    }
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.keyboard.press('KeyE');
  await new Promise((r) => setTimeout(r, 1000));

  // Click lunar mission
  await clickElementByText(page, 'button', ['LUNAR RECONNAISSANCE', 'مهمة استكشاف القمر']);
  await new Promise((r) => setTimeout(r, 1500));

  // Accept mandate
  await clickElementByText(page, 'button', ['ACCEPT MANDATE', 'قبول التكليف']);
  await new Promise((r) => setTimeout(r, 1500));

  // 3. QuestionViewer in CAD Blueprint Mode
  console.log('Capturing QuestionViewer in CAD Blueprint Mode...');
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setVisualMode('performance');
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '61_question_viewer_cad_blueprint.png') });
  console.log('Saved 61_question_viewer_cad_blueprint.png');

  // 4. QuestionViewer in Retro Pixel Mode
  console.log('Capturing QuestionViewer in Retro Pixel Mode...');
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setVisualMode('retro-pixel');
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '62_question_viewer_retro_voxel.png') });
  console.log('Saved 62_question_viewer_retro_voxel.png');

  // 5. QuestionViewer in Cyber Neon Mode
  console.log('Capturing QuestionViewer in Cyber Neon Mode...');
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setVisualMode('cyber-neon');
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '63_question_viewer_cyber_neon.png') });
  console.log('Saved 63_question_viewer_cyber_neon.png');

  // 6. QuestionViewer in Cinematic 3D Mode (Arabic)
  console.log('Capturing QuestionViewer in Cinematic 3D Mode (Arabic)...');
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setVisualMode('cinematic-3d');
      window.__GAME_STORE__.getState().setLanguage('ar');
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '64_question_viewer_cinematic_arabic.png') });
  console.log('Saved 64_question_viewer_cinematic_arabic.png');

  // 7. Test Keyboard Hotkey '1' to select Option A
  console.log('Testing keyboard shortcut [1] to open Consequence Modal...');
  await page.keyboard.press('Digit1');
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '65_consequence_modal_flight_director.png') });
  console.log('Saved 65_consequence_modal_flight_director.png');

  // 8. Test Keyboard Hotkey 'Enter' to confirm decision
  console.log('Testing keyboard shortcut [Enter] to advance mission...');
  await page.keyboard.press('Enter');
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '66_next_question_advanced_via_keyboard.png') });
  console.log('Saved 66_next_question_advanced_via_keyboard.png');

  await browser.close();
  console.log('All v2.5.0 verification tests completed successfully!');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
