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
  console.log('Testing mission flow...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  // Set Arabic
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setLanguage('ar');
    }
  });
  await new Promise((r) => setTimeout(r, 500));

  // Enter Station
  await clickElementByText(page, 'button', ['دخول المحطة الفضائية', 'ENTER STATION']);
  await new Promise((r) => setTimeout(r, 2000));

  // Go to mission board room and set target
  await page.evaluate(() => {
    if (window.__GAME_STORE__) {
      window.__GAME_STORE__.getState().setCurrentRoom('mission-board');
      window.__GAME_STORE__.getState().setInteractionTarget('mb-board');
    }
  });

  // Wait for React to re-render InteractionHandler with interactionTarget
  await new Promise((r) => setTimeout(r, 600));

  // Now press KeyE or trigger custom event
  await page.keyboard.press('KeyE');
  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(outDir, '48_mission_selector_modal_arabic.png') });
  console.log('Saved 48_mission_selector_modal_arabic.png');

  // Check what buttons exist on screen now
  const moonClick = await clickElementByText(page, 'button', ['مهمة استكشاف القمر', 'LUNAR RECONNAISSANCE']);
  console.log('Moon button click result:', moonClick);
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(outDir, '49_mission_control_briefing_arabic.png') });
  console.log('Saved 49_mission_control_briefing_arabic.png');

  // Accept mandate
  const acceptClick = await clickElementByText(page, 'button', ['قبول التكليف', 'ACCEPT MANDATE']);
  console.log('Accept mandate click result:', acceptClick);
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(outDir, '50_question_viewer_arabic.png') });
  console.log('Saved 50_question_viewer_arabic.png');

  // Select Choice Option A
  const optionAClick = await clickElementByText(page, 'button', ['الخيار (أ)', 'OPTION A', 'اختيار المسار أ']);
  console.log('Option A click result:', optionAClick);
  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(outDir, '51_decision_consequence_modal_arabic.png') });
  console.log('Saved 51_decision_consequence_modal_arabic.png');

  // Commit decision
  const commitClick = await clickElementByText(page, 'button', ['تأكيد القرار ومتابعة الرحلة', 'COMMIT DECISION']);
  console.log('Commit click result:', commitClick);
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(outDir, '52_next_question_arabic.png') });
  console.log('Saved 52_next_question_arabic.png');

  await browser.close();
}

run().catch(console.error);
