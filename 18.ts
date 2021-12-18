import { readAllLines } from "./line-reader.ts";

type Pair = [number | Pair, number | Pair];
const lines = (await readAllLines("18.input"));

sumAll(lines);
maxSum(lines);

function sumAll(lines: string[]) {
  let result = lines[0];
  for (const line of lines.slice(1)) {
    result = add(result, line);
  }
  console.log("Total:", magnitude(JSON.parse(result)));
}

function maxSum(lines: string[]) {
  let max = 0;
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (j === i) continue;
      const r = magnitude(JSON.parse(add(lines[i], lines[j])));
      max = Math.max(max, r);
    }
  }
  console.log("Max:", max);
}

function add(r1: string, r2: string): string {
  let result = `[${r1},${r2}]`;
  let reduced = false;
  while (!reduced) {
    reduced = true;
    let depth = 0;
    for (let i = 0; i < result.length && reduced; i++) {
      if (result[i] === "[") depth++;
      if (result[i] === "]") depth--;
      if (depth === 5) {
        result = explode(i, result);
        reduced = false;
      }
    }
    for (let i = 0; i < result.length && reduced; i++) {
      [result, reduced] = split(i, result);
    }
  }
  return result;
}

function explode(i: number, target: string): string {
  const end = i + target.substr(i).indexOf("]");
  const [left, right] = JSON.parse(target.slice(i, end + 1));
  target = target.substring(0, i) + "0" + target.substring(end + 1);
  for (let j = i + 1; j < target.length; j++) {
    if (target[j].match(/\d/)) {
      const prev = target.substr(j).split(/\D/, 2)[0];
      const r = parseInt(prev) + right;
      target = target.substring(0, j) + r + target.substring(j + prev.length);
      break;
    }
  }
  for (let j = i - 1; j >= 0; j--) {
    if (target[j].match(/\d/)) {
      while (target[j - 1].match(/\d/)) j--;
      const prev = target.substr(j).split(/\D/, 2)[0];
      const r = parseInt(prev) + left;
      target = target.substring(0, j) + r + target.substring(j + prev.length);
      break;
    }
  }
  return target;
}

function split(i: number, target: string): [string, boolean] {
  if (target[i].match(/\d/)) {
    const valS = target.substr(i).split(/\D/, 2)[0];
    const val = parseInt(valS);
    if (val > 9) {
      const repl = `[${Math.floor(val / 2)},${Math.ceil(val / 2)}]`;
      target = target.substring(0, i) + repl + target.substring(i + valS.length);
      return [target, false];
    }
  }
  return [target, true];
}

function magnitude(p: number | Pair): number {
  if (typeof p === "number") return p;
  return 3 * magnitude(p[0]) + 2 * magnitude(p[1]);
}
