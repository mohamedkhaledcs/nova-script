import type { Resources } from '@/types/game';

/**
 * Pure, deterministic scoring evaluator for NovaScript mission endings.
 * Evaluates formula strings using an allowlisted arithmetic tokenizer without eval() or Function().
 */
export function calculateEndingScore(formula: string, resources: Resources): number {
  if (!formula || typeof formula !== 'string') {
    return 0;
  }

  // Tokenize the formula: identifiers, floating point numbers, and operators '+' / '*'
  // Example: "scientific_value * 1.5 + communication + power + budget"
  const tokens = formula.match(/[a-z_]+|\d+(?:\.\d+)?|[\+\*]/g);
  if (!tokens || tokens.length === 0) {
    return 0;
  }

  // First pass: replace variable names with their actual resource values
  const resolvedTokens: (number | string)[] = tokens.map((token) => {
    if (token in resources) {
      return resources[token as keyof Resources];
    }
    const num = parseFloat(token);
    if (!isNaN(num)) {
      return num;
    }
    return token;
  });

  // Second pass: handle multiplication (higher precedence than addition)
  const addTerms: number[] = [];
  let currentProduct = 1;
  let expectingOperand = true;

  for (let i = 0; i < resolvedTokens.length; i++) {
    const token = resolvedTokens[i];

    if (typeof token === 'number') {
      if (expectingOperand) {
        currentProduct *= token;
        expectingOperand = false;
      }
    } else if (token === '*') {
      expectingOperand = true;
    } else if (token === '+') {
      addTerms.push(currentProduct);
      currentProduct = 1;
      expectingOperand = true;
    }
  }

  // Push the final product term
  addTerms.push(currentProduct);

  // Third pass: sum all additive terms
  const totalScore = addTerms.reduce((sum, term) => sum + term, 0);

  // Return rounded to 1 decimal place
  return Math.round(totalScore * 10) / 10;
}
