import { readAllLines } from './line-reader.ts'

const lines = await readAllLines("15.input")
const cave = lines.map(l => [...l].map(n => parseInt(n)));

const height = cave.length;
const width = cave[0].length;
const max = Number.POSITIVE_INFINITY;
const multiplier = 5;

const risks = Array(multiplier * height).fill([]).map(() => Array(multiplier * width).fill(max));
risks[0][0] = 0;
let optimized = false;
do {
  optimized = false;
  for (let y = 0; y < multiplier * height; y++) {
    for (let x = 0; x < multiplier * width; x++) {
      const up = risks[y - 1]?.[x] ?? max;
      const left = risks[y][x - 1] ?? max;
      const down = risks[y + 1]?.[x] ?? max;
      const right = risks[y][x + 1] ?? max;

      const cavey = y % height;
      const cavex = x % width;
      const bonus = Math.floor(y / height) + Math.floor(x / width);
      let added = cave[cavey][cavex] + bonus;
      if (added > 9) added -= 9;
      const risk = Math.min(up, left, down, right) + added;

      if (risk < risks[y][x]) {
        risks[y][x] = risk;
        optimized = true;
      }
    }
  }
} while (optimized);
console.log(risks[(multiplier * height) - 1][(multiplier * width) - 1]);
