import { readAllLines } from "./line-reader.ts"

const lines = (await readAllLines("20.input"))
const enh = lines[0];

let grid = lines.slice(2).map(l => [...l]);
let fallback = ".";
function get(y: number, x: number): 1 | 0 {
  return (grid?.[y]?.[x] ?? fallback) === "#" ? 1 : 0;
}

let iterations = 50;
while (iterations--) {
  const next: string[][] = Array(grid.length + 2).fill([]).map(() => Array(grid[0].length + 2))
  for (let y = -1; y < grid.length + 1; y++) {
    for (let x = -1; x < grid[0].length + 1; x++) {
      const bin = "" + get(y - 1, x - 1) + get(y - 1, x) + get(y - 1, x + 1) + get(y, x - 1) + get(y, x) + get(y, x + 1) + get(y + 1, x - 1) + get(y + 1, x) + get(y + 1, x + 1);
      const idx = parseInt(bin, 2);
      next[y + 1][x + 1] = enh[idx];
    }
  }
  grid = next;
  fallback = fallback === "#" ? enh[511] : enh[0];
}

const count = grid.map(r => r.map<number>(c => c === "#" ? 1 : 0).reduce((a, b) => a + b)).reduce((a, b) => a + b)
console.log("Count:", count);
