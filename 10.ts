import { readAllLines } from "./line-reader.ts"

const lines = await readAllLines("10.input");

const pairs = new Map<string, string>([
  ["[", "]"],
  ["(", ")"],
  ["{", "}"],
  ["<", ">"]
])

const illegalScores = new Map<string, number>([
  [")", 3],
  ["]", 57],
  ["}", 1197],
  [">", 25137]
])

const missingScores = new Map<string, number>([
  [")", 1],
  ["]", 2],
  ["}", 3],
  [">", 4]
])

const illegals = [];
const fixScores = [];
for (const line of lines) {
  let corrupt = false;
  const stack = [];
  for (const char of [...line]) {
    if (pairs.has(char)) {
      stack.push(char);
    } else if (pairs.get(stack.pop() ?? "") !== char) {
      illegals.push(char);
      corrupt = true;
      break;
    }
  }
  if (!corrupt) {
    let fixScore = 0;
    while (stack.length > 0) {
      const open = stack.pop() ?? "";
      const missing = pairs.get(open) ?? "";
      const score = missingScores.get(missing) ?? 0;
      fixScore = fixScore * 5 + score;
    }
    fixScores.push(fixScore);
  }
}

console.log(illegals.map(c => illegalScores.get(c) ?? 0).reduce((a, b) => a + b))
console.log(fixScores.sort((a, b) => a - b)[(fixScores.length - 1) / 2])
