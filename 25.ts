import { readAllLines } from "./line-reader.ts"

let cmap = (await readAllLines("25.input")).map(l => l.split(""))
let moved = false
let steps = 0;
do {
  const [map1, moved1] = move(">", cmap);
  const [map2, moved2] = move("v", map1);
  cmap = map2;
  moved = moved1 || moved2;
  steps++;
} while (moved);
console.log(steps);

function move(type: ">" | "v", map: string[][]): [string[][], boolean] {
  const [ylen, xlen] = [map.length, map[0].length];
  const result = new Array<string[]>(ylen).fill([])
    .map(() => new Array(xlen).fill("."));
  let moved = false;
  for (let y = 0; y < ylen; y++) {
    for (let x = 0; x < xlen; x++) {
      if (map[y][x] !== type) {
        if (map[y][x] !== ".") result[y][x] = map[y][x];
        continue;
      }
      const tarx = type === ">" ? (x + 1) % xlen : x;
      const tary = type === "v" ? (y + 1) % ylen : y;
      if (map[tary][tarx] === ".") {
        result[tary][tarx] = type;
        moved = true;
      }
      else result[y][x] = type;
    }
  }
  return [result, moved];
}
