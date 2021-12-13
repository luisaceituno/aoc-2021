import { readAllLines } from "./line-reader.ts"

const nums = (await readAllLines("11.input")).map(l => [...l].map(n => parseInt(n)))
const width = nums.length;
const height = nums[0].length;
let flashes = 0;
let allFlashed = false;
let step = 0;
while (++step <= 100 || !allFlashed) {
  const last = flashes;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      increase(x, y);
    }
  }
  if (step === 100) {
    console.log("Total flashes at step 100:", flashes);
  }
  if (flashes - last === width * height) {
    allFlashed = true;
    console.log("All flashed at step:", step);
  }
}

function increase(x: number, y: number) {
  if (nums[x][y] === -step) return;
  nums[x][y] = Math.max(nums[x][y] + 1, 1);
  if (nums[x][y] <= 9) return;
  nums[x][y] = -step;
  flashes++;
  for (let nextx = Math.max(0, x - 1); nextx < Math.min(width, x + 2); nextx++) {
    for (let nexty = Math.max(0, y - 1); nexty < Math.min(height, y + 2); nexty++) {
      increase(nextx, nexty)
    }
  }
}

