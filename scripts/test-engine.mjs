import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../public/data/ques-en.json');
const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const questions = new Map(rawData.questions.map((q) => [q.id, q]));
const endings = new Map(rawData.endings.map((e) => [e.id, e]));

console.log('=== NOVASCRIPT AUTOMATED ENGINE & GRAPH TEST ===');
console.log(`Loaded dataset: "${rawData.game_title}" (v${rawData.version})`);
console.log(`Total Questions: ${questions.size} | Total Endings: ${endings.size}`);

// Simple AST formula calculator to test
function calculateEndingScore(formula, resources) {
  const tokens = formula.match(/[a-z_]+|\d+(?:\.\d+)?|[\+\*]/g);
  if (!tokens) return 0;
  const resolved = tokens.map((t) => (t in resources ? resources[t] : !isNaN(parseFloat(t)) ? parseFloat(t) : t));
  const addTerms = [];
  let product = 1;
  let expectingOperand = true;

  for (const token of resolved) {
    if (typeof token === 'number') {
      if (expectingOperand) {
        product *= token;
        expectingOperand = false;
      }
    } else if (token === '*') {
      expectingOperand = true;
    } else if (token === '+') {
      addTerms.push(product);
      product = 1;
      expectingOperand = true;
    }
  }
  addTerms.push(product);
  const sum = addTerms.reduce((a, b) => a + b, 0);
  return Math.round(sum * 10) / 10;
}

function clamp(v, bounds) {
  return Math.max(bounds.min, Math.min(bounds.max, v));
}

// Trace all paths from start_question_id
const allPaths = [];
const visitedQuestions = new Set();
const visitedEndings = new Set();

function traverse(currentQId, pathSoFar) {
  visitedQuestions.add(currentQId);
  const q = questions.get(currentQId);
  if (!q) throw new Error(`Question ${currentQId} not found`);

  for (const answer of q.answers) {
    const nextStep = {
      questionId: q.id,
      stage: q.stage,
      answerId: answer.id,
      answerText: answer.text,
      effects: answer.effects,
      nextQId: answer.next_question_id,
      endingId: answer.ending_id,
    };
    const newPath = [...pathSoFar, nextStep];

    if (answer.ending_id) {
      visitedEndings.add(answer.ending_id);
      allPaths.push(newPath);
    } else if (answer.next_question_id) {
      traverse(answer.next_question_id, newPath);
    } else {
      throw new Error(`Answer ${answer.id} in ${q.id} has no target`);
    }
  }
}

traverse(rawData.start_question_id, []);

console.log(`\n[+] Distinct Traversed Paths: ${allPaths.length}`);
console.log(`[+] Reachable Questions: ${visitedQuestions.size} / ${questions.size}`);
console.log(`[+] Reachable Endings: ${visitedEndings.size} / ${endings.size}`);

if (allPaths.length !== 33) {
  console.error(`[-] FAILURE: Expected 33 paths, found ${allPaths.length}`);
  process.exit(1);
}
if (visitedQuestions.size !== 31) {
  console.error(`[-] FAILURE: Expected 31 questions, found ${visitedQuestions.size}`);
  process.exit(1);
}
if (visitedEndings.size !== 8) {
  console.error(`[-] FAILURE: Expected 8 endings, found ${visitedEndings.size}`);
  process.exit(1);
}

// Simulate full mission execution across all 33 paths
let passedSimulations = 0;
const endingScores = new Map();

for (let i = 0; i < allPaths.length; i++) {
  const p = allPaths[i];
  let res = { ...rawData.initial_resources };

  for (const step of p) {
    for (const [k, v] of Object.entries(step.effects)) {
      if (k in res) {
        res[k] = clamp(res[k] + v, rawData.resource_bounds);
      }
    }
  }

  const lastStep = p[p.length - 1];
  const ending = endings.get(lastStep.endingId);
  if (!ending) throw new Error(`Ending ${lastStep.endingId} not found`);

  const score = calculateEndingScore(ending.final_score_formula, res);
  if (isNaN(score) || score <= 0) {
    throw new Error(`Invalid score computed for path ${i + 1}: ${score}`);
  }

  if (!endingScores.has(ending.id)) endingScores.set(ending.id, []);
  endingScores.get(ending.id).push(score);
  passedSimulations++;
}

console.log(`[+] Successfully simulated ${passedSimulations} / ${allPaths.length} complete playthroughs.`);

console.log('\n--- Ending Scores Summary ---');
for (const [eid, scores] of endingScores.entries()) {
  const ending = endings.get(eid);
  const min = Math.min(...scores).toFixed(1);
  const max = Math.max(...scores).toFixed(1);
  const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  console.log(`Ending ${eid} (${ending.status.padEnd(20)}): min=${min}, max=${max}, avg=${avg} (runs=${scores.length})`);
}

console.log('\n[PASS] ALL 33 PLAYABLE PATHS, 31 QUESTIONS, AND 8 ENDINGS FULLY VERIFIED!\n');
