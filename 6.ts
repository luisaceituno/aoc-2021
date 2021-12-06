import { readAllLines } from "./line-reader.ts";

const lines = await readAllLines("6.input");
const nums = lines[0].split(",").map(i => parseInt(i));
let amounts = Object.fromEntries(Array(9).fill(0).map((v, i) => [i, v]));
for (const num of nums) {
  amounts[num]++;
}

for (let i = 0; i < 256; i++) {
  const next: typeof amounts = {};
  for (let j = 0; j < 8; j++) {
    next[j] = amounts[j + 1];
  }
  next[6] += amounts[0];
  next[8] = amounts[0];
  amounts = next;
}

console.log(Object.values(amounts).reduce((a, b) => a + b));
