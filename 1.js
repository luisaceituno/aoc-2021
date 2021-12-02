import { LineReader } from "./read-lines.js";

const lines = (await LineReader.readAll()).map(l => parseInt(l));

let count = 0;

for (let i = 3; i < lines.length; i++) {
  if (lines[i] > lines[i - 3]) {
    count++;
  }
}

console.log(count);
