import { readAllLines } from "./line-reader.ts";

const line = (await readAllLines("17.input"))[0];
const [[xs, xe], [ys, ye]] = line.split(": ")[1].split(", ").map(c => c.split("=")[1].split("..").map(n => parseInt(n)));

const maxvy = ys < 0 ? -ys - 1 : ye;
console.log("Max height y:", (maxvy + 1) * maxvy / 2);

const minvy = ys < 0 ? ys : Math.ceil(Math.sqrt(ys));
let count = 0;
for (let vy = minvy; vy <= maxvy; vy++) {
  let y = 0;
  const timesy = [];
  for (let i = 0; ; i++) {
    y += vy - i;
    if (y < ys && (vy - i) <= 0) break;
    if (y >= ys && y <= ye) timesy.push(i);
  }
  for (let vx = 0; vx <= xe; vx++) {
    for (const timey of timesy) {
      const timex = Math.min(vx, timey);
      const x = (timex + 1) * (vx + vx - timex) / 2;
      if (x >= xs && x <= xe) {
        count++;
        break;
      }
    }
  }
}
console.log("Possibilities:", count)
