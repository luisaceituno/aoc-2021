import { readAllLines } from "./line-reader.ts"

const lines = await readAllLines("23.input");
const cols = [...lines[1]]
  .map((c, i) => c + (lines[2][i] ?? "") + (lines[3][i] ?? "") + (lines[4][i] ?? "") + (lines[5][i] ?? ""))
  .map(col => col.trim().replaceAll("#", ""))
  .filter(col => col.length > 0);

const costs: Record<string, number> = { "A": 1, "B": 10, "C": 100, "D": 1000 }
const targets: Record<string, number> = { "A": 2, "B": 4, "C": 6, "D": 8 }

let min = Number.MAX_VALUE;
const seen: Map<string, number> = new Map();
const q: [string[], number][] = [[cols, 0]]
while (q.length) round(...(q.pop() || [[], 0]));
console.log(min);

function round(state: string[], score: number) {
  if (score >= min) return;
  const stateStr = state.join("");
  if ((seen.get(stateStr) ?? (score + 1)) <= score) return;
  if (state[2] === ".AAAA" && state[4] === ".BBBB" && state[6] === ".CCCC" && state[8] === ".DDDD") {
    min = score;
    return;
  }
  seen.set(stateStr, score);
  for (const [candidate, source] of getCandidates(state)) {
    for (let target = source - 1; target >= 0; target--) {
      if (state[target].length === 1 && state[target] !== ".") break;
      if (isTarget(candidate, state, source, target)) {
        const [next, cost] = move(state, source, target);
        q.push([next, score + cost]);
      }
    }
    for (let target = source + 1; target < cols.length; target++) {
      if (state[target].length === 1 && state[target] !== ".") break;
      if (isTarget(candidate, state, source, target)) {
        const [next, cost] = move(state, source, target);
        round(next, score + cost);
        q.push([next, score + cost]);
      }
    }
  }
  return min;
}

function getCandidates(state: string[]): [string, number][] {
  const sort = ["D", "C", "B", "A"];
  const result: [string, number][] = [];
  for (let i = 0; i < state.length; i++) {
    const c = getCandidate(state, i);
    if (c) result.push([c, i]);
  }
  result.sort((r1, r2) => sort.indexOf(r1[0]) - sort.indexOf(r2[0]));
  return result;
}

function getCandidate(state: string[], i: number): string | undefined {
  const col = state[i];
  if (col.length === 1 && !isOnly(col, state[targets[col]])) return
  const candidates = col.replaceAll(".", "");
  const candidate = candidates[0];
  const other = candidates[1] ?? candidate;
  if (candidate && (targets[candidate] !== i || targets[other] !== i)) {
    return candidate;
  }
}

function isTarget(candidate: string, state: string[], s: number, t: number) {
  if (![2, 4, 6, 8].includes(s)) {
    return t === targets[candidate] && isOnly(candidate, state[t]);
  } else {
    return state[t] === ".";
  }
}

function isOnly(candidate: string, col: string): boolean {
  return (col ?? "").replaceAll(".", "").replaceAll(candidate, "").length === 0;
}

function move(state: string[], s: number, t: number): [string[], number] {
  const result = [...state];
  const candidate = getCandidate(state, s) ?? "";
  const cost = costs[candidate];
  let total = 0;
  let poss = -1;
  let post = -1;
  for (const c of result[s]) {
    poss++;
    if (c === ".") total += cost;
    else break;
  }
  for (const c of result[t]) {
    if (c === ".") {
      post++;
      total += cost;
    }
    else break;
  }
  total += cost * (Math.abs(t - s) - 1);
  const news = [...result[s]];
  news.splice(poss, 1, ".");
  const newt = [...result[t]];
  newt.splice(post, 1, candidate)
  result[s] = news.join("");
  result[t] = newt.join("");
  return [result, total];
}
