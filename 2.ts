import { readAllLines } from "./line-reader.ts";

const lines = await readAllLines("2.input");
const commands: [string, number][] = lines.map(l => l.split(" ")).map(([dir, units]) => ([dir, parseInt(units)]));

let depth = 0;
let hor = 0;
let aim = 0;

for (const [dir, units] of commands) {
  if (dir === "forward") {
    hor += units;
    depth += aim * units;
  }
  if (dir === "up") {
    aim -= units;
  }
  if (dir === "down") {
    aim += units;
  }
}

console.log(hor * depth)
