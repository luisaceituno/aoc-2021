import { readAllLines } from "./line-reader.ts";

const heights = (await readAllLines("9.input")).map(l => l.split("").map(h => parseInt(h)))
task1(heights);
task2(heights);

function task1(heights: number[][]) {
  const mins: number[] = [];
  for (let y = 0; y < heights.length; y++) {
    for (let x = 0; x < heights[y].length; x++) {
      const up = (heights[y - 1]?.[x] ?? 10) > heights[y][x];
      const down = (heights[y + 1]?.[x] ?? 10) > heights[y][x];
      const left = (heights[y][x - 1] ?? 10) > heights[y][x];
      const right = (heights[y][x + 1] ?? 10) > heights[y][x];
      if (up && down && left && right) {
        mins.push(heights[y][x])
      }
    }
  }
  console.log(mins.map(x => x + 1).reduce((a, b) => a + b))
}

function task2(heights: number[][]) {
  const basins: number[][] = Array(heights.length).fill([]);
  basins.forEach((_, i) => basins[i] = Array(heights[i].length).fill(0));
  const sizes = new Map<number, number>();
  for (let y = 0; y < heights.length; y++) {
    for (let x = 0; x < heights[y].length; x++) {
      const idx = sizes.size + 1;
      const size = expand(heights, basins, y, x, idx);
      if (size > 0) sizes.set(idx, size);
    }
  }
  console.log([...sizes.values()].sort((a, b) => a - b).slice(-3).reduce((a, b) => a * b));
}

function expand(heights: number[][], basins: number[][], y: number, x: number, i: number): number {
  if ((basins[y]?.[x] ?? 1) > 0 || (heights[y]?.[x] ?? 9) === 9) return 0;
  basins[y][x] = i;
  return 1
    + expand(heights, basins, y - 1, x, i)
    + expand(heights, basins, y + 1, x, i)
    + expand(heights, basins, y, x - 1, i)
    + expand(heights, basins, y, x + 1, i);
}
