import { readAllLines } from "./line-reader.ts";

const lines = (await readAllLines("1.input")).map(l => parseInt(l));

let count = 0;

for (let i = 3; i < lines.length; i++) {
  if (lines[i] > lines[i - 3]) {
    count++;
  }
}

console.log(count);
