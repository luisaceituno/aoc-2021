import { readAllLines } from "./line-reader.ts";

const numbers = (await readAllLines("7.input"))[0].split(",").map(n => parseInt(n));
numbers.sort((a, b) => a - b);
const min = numbers[0];
const max = numbers[numbers.length - 1];

const dists: number[] = [];
for (let i = min; i <= max; i++) {
  dists[i] = 0;
  for (const num of numbers) {
    const dist = Math.abs(i - num);
    const fuel = dist * (dist + 1) / 2;
    dists[i] += fuel;
  }
}
console.log(Math.min(...dists));
