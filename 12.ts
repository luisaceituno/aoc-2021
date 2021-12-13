import { readAllLines } from './line-reader.ts'

const lines = (await readAllLines("12.input"));
const pairs = lines.map(l => l.split("-"))
const tunnels: Record<string, string[]> = {};
pairs.forEach(p => {
  (tunnels[p[0]] || (tunnels[p[0]] = [])).push(p[1]);
  (tunnels[p[1]] || (tunnels[p[1]] = [])).push(p[0]);
})

let paths = 0;
visit("start", []);

function visit(cave: string, past: string[]) {
  if (past.includes(cave) && new Set(past).size < past.length) {
    return;
  }
  if (cave.toLowerCase() === cave) {
    past.push(cave);
  }
  if (cave === "end") {
    paths++;
    return;
  }
  for (const tunnel of tunnels[cave]) {
    tunnel === "start" || visit(tunnel, [...past]);
  }
}

console.log(paths)
