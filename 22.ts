import { readAllLines } from "./line-reader.ts"

interface Op { target: 1 | 0; x1: number; x2: number; y1: number; y2: number; z1: number; z2: number; }
type Cube = [number, number, number, number, number, number];

const lines = await readAllLines("22.input");
const ops = lines.map(l => {
  const prange = (s: string) => s.slice(2).split("..").map(n => parseInt(n));
  const [op, coords] = l.split(" ");
  const [xs, ys, zs] = coords.trim().split(",")
  const [x1, x2] = prange(xs);
  const [y1, y2] = prange(ys);
  const [z1, z2] = prange(zs);
  return <Op>{ target: op === "on" ? 1 : 0, x1, x2, y1, y2, z1, z2 };
})

let lit: Cube[] = [];
for (const op of ops) {
  const sections: Cube[] = [];
  const cube: Cube = [op.x1, op.x2 + 1, op.y1, op.y2 + 1, op.z1, op.z2 + 1];
  for (const lcube of lit) {
    sections.push(...exclude(lcube, cube));
  }
  lit = sections;
  if (op.target) lit.push(cube);
}
let smallSum = 0;
let sum = 0;
for (const c of lit) {
  smallSum += Math.max(Math.min(c[1], 50) - Math.max(c[0], -50), 0)
    * Math.max(Math.min(c[3], 50) - Math.max(c[2], -50), 0)
    * Math.max(Math.min(c[5], 50) - Math.max(c[4], -50), 0);
  sum += Math.abs(c[1] - c[0]) * Math.abs(c[3] - c[2]) * Math.abs(c[5] - c[4]);
}
console.log("Small one:", smallSum);
console.log("Real one:", sum);

// Returns a composition of cubes that represent c1 - c2
function exclude(c1: Cube, c2: Cube): Cube[] {
  const clean: Cube[] = [];
  let dirty: Cube[] = [];
  let temp: Cube[] = [c1];
  for (const [s, e] of [[0, 1], [2, 3], [4, 5]]) {
    for (const c of temp) {
      const [safe, unsafe] = cut(c, c2, s, e);
      clean.push(...safe);
      dirty.push(...unsafe);
    }
    temp = dirty;
    dirty = [];
  }
  return clean;
}

function cut(c1: Cube, c2: Cube, s: number, e: number): [Cube[], Cube[]] {
  const clean = [];
  const dirty = [];
  if (c1[s] > c2[e] || c1[e] < c2[s]) return [[c1], []]
  else {
    const unsafe: Cube = [...c1];
    unsafe[s] = Math.max(c1[s], c2[s]);
    unsafe[e] = Math.min(c1[e], c2[e]);
    dirty.push(unsafe);
    if (c1[s] < c2[s]) {
      const safe: Cube = [...c1];
      safe[e] = c2[s];
      clean.push(safe)
    }
    if (c1[e] > c2[e]) {
      const safe: Cube = [...c1];
      safe[s] = c2[e];
      clean.push(safe);
    }
  }
  return [clean, dirty];
}
