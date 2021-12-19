import { readAllLines } from "./line-reader.ts"

class Scanner {
  probes: Probe[] = [];
  coords: [number, number, number] = [0, 0, 0];
  constructor(
    public num: number
  ) { }

  adjust([ix, iy, iz, adx, ady, adz, invx, invy, invz]: number[]) {
    this.coords = [this.coords[ix], this.coords[iy], this.coords[iz]];
    this.coords[0] += adx;
    this.coords[1] += ady;
    this.coords[2] += adz;
    this.probes.forEach(p => p.adjust([ix, iy, iz, adx, ady, adz, invx, invy, invz]));
  }

  getDistance(s: Scanner): number {
    const dx = Math.abs(this.coords[0] - s.coords[0])
    const dy = Math.abs(this.coords[1] - s.coords[1])
    const dz = Math.abs(this.coords[2] - s.coords[2])
    return dx + dy + dz;
  }
}

class Probe {
  distances: number[] = [];
  constructor(
    public coords: [number, number, number],
  ) { }

  addDistances(probes: Probe[]) {
    for (const probe of probes) {
      const [dx, dy, dz] = this.getDistances(probe);
      const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
      if (d > 0) this.distances.push(parseFloat(d.toFixed(7)));
    }
    this.distances.sort((a, b) => a - b).splice(2);
  }

  getSignature(): string {
    return this.distances.join("")
  }

  matches(probe: Probe): boolean {
    return this.distances.every((d, i) => d == probe.distances[i]);
  }

  getDistances(probe: Probe): [number, number, number] {
    const dx = Math.abs(this.coords[0] - probe.coords[0]);
    const dy = Math.abs(this.coords[1] - probe.coords[1]);
    const dz = Math.abs(this.coords[2] - probe.coords[2]);
    return [dx, dy, dz];
  }

  adjust([ix, iy, iz, adx, ady, adz, invx, invy, invz]: number[]) {
    this.coords = [this.coords[ix], this.coords[iy], this.coords[iz]];
    this.coords[0] = invx * this.coords[0] + adx;
    this.coords[1] = invy * this.coords[1] + ady;
    this.coords[2] = invz * this.coords[2] + adz;
  }
}

class Area {
  map: Map<number, Map<number, Map<number, "s" | "p">>> = new Map();
  add(type: "p" | "s", x: number, y: number, z: number) {
    const my = this.map.get(x) ?? new Map();
    const mz = my.get(y) ?? new Map();
    mz.set(z, type);
    my.set(y, mz);
    this.map.set(x, my);
  }
}

const lines = (await readAllLines("19.input")).filter(l => l.length > 0)
const scanners: Scanner[] = [];
for (const line of lines) {
  if (line[1] === "-") scanners.push(new Scanner(parseInt(line.split(" ")[2])))
  else scanners.at(-1)?.probes.push(new Probe(<[number, number, number]>line.split(",").map(n => parseInt(n))))
}

for (const s of scanners) {
  for (const p of s.probes) {
    p.addDistances(s.probes);
  }
}

const area = new Area();
const adjusted = scanners.slice(0, 1);
const remaining = scanners.slice(1);
area.add("s", ...adjusted[0].coords);
adjusted[0].probes.forEach(p => area.add("p", ...p.coords));
while (remaining.length > 0) {
  for (const s of [...adjusted]) {
    for (const r of [...remaining]) {
      const matches: [Probe, Probe][] = [];
      for (const ps of s.probes) {
        for (const pr of r.probes) {
          if (ps.matches(pr)) matches.push([ps, pr]);
        }
      }
      if (matches.length >= 2) {
        r.adjust(calculateAdjustment(matches));
        area.add("s", ...r.coords)
        r.probes.forEach(p => area.add("p", ...p.coords));
        adjusted.push(r);
        remaining.splice(remaining.indexOf(r), 1);
      }
    }
  }
}

let count = 0;
for (const xs of area.map.values()) {
  for (const ys of xs.values()) {
    for (const e of ys.values()) {
      if (e === "p") count++;
    }
  }
}
console.log("Probes count:", count);

let max = 0;
for (const s1 of adjusted) {
  for (const s2 of adjusted) {
    const d = s1.getDistance(s2);
    max = Math.max(max, d);
  }
}
console.log("Max distance:", max);

function calculateAdjustment(matches: [Probe, Probe][]): number[] {
  let d1: [number, number, number] = [0, 0, 0];
  let d2: [number, number, number] = [0, 0, 0];
  let i = 0;
  let j = 0;
  for (i = 0; i < matches.length && new Set(d1).size !== 3; i++) {
    for (j = i + 1; j < matches.length && new Set(d1).size !== 3; j++) {
      d1 = matches[i][0].getDistances(matches[j][0]);
      d2 = matches[i][1].getDistances(matches[j][1]);
    }
  }
  const ix = d2.indexOf(d1[0]);
  const iy = d2.indexOf(d1[1]);
  const iz = d2.indexOf(d1[2]);
  const p1 = matches[i - 1];
  const p2 = matches[j - 1];
  const invx = (p1[0].coords[0] - p2[0].coords[0]) === (p1[1].coords[ix] - p2[1].coords[ix]) ? 1 : -1;
  const invy = (p1[0].coords[1] - p2[0].coords[1]) === (p1[1].coords[iy] - p2[1].coords[iy]) ? 1 : -1;
  const invz = (p1[0].coords[2] - p2[0].coords[2]) === (p1[1].coords[iz] - p2[1].coords[iz]) ? 1 : -1;
  const adx = p1[0].coords[0] - invx * p1[1].coords[ix];
  const ady = p1[0].coords[1] - invy * p1[1].coords[iy];
  const adz = p1[0].coords[2] - invz * p1[1].coords[iz];
  return [ix, iy, iz, adx, ady, adz, invx, invy, invz];
}
