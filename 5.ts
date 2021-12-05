import { readAllLines } from "./line-reader.ts";

type Move = { from: [number, number], to: [number, number] };

class Diagram {
  points: number[][] = [];

  move(m: Move) {
    // console.log(`moving (${m.from[0]}, ${m.from[1]})=>(${m.to[0]},${m.to[1]})`)
    this.toSteps(m).forEach(([x, y]) => {
      // console.log("Step", [x, y])
      this.mark([x, y])
    });
    // this.draw();
  }

  toSteps({ from: [fx, fy], to: [tx, ty] }: Move): [number, number][] {
    const rangex = this.range(fx, tx);
    const rangey = this.range(fy, ty);
    if (rangex.length === 1) {
      return rangey.map(y => [rangex[0], y]);
    } else if (rangey.length === 1) {
      return rangex.map(x => [x, rangey[0]]);
    } else if (rangex.length === rangey.length) {
      return rangex.map((x, i) => [x, rangey[i]]);
    }
    throw Error("Something's fishy");
  }

  range(from: number, to: number): number[] {
    const range = [from];
    let cur = from;
    while (cur !== to) {
      cur += cur > to ? -1 : 1;
      range.push(cur)
    }
    return range;
  }

  mark([x, y]: [number, number]) {
    this.points[x] = this.points[x] ?? [];
    this.points[x][y] = (this.points[x][y] ?? 0) + 1;
  }

  countIntersections(): number {
    return this.points.map(r => r.filter(v => v > 1).length).reduce((a, b) => a + b)
  }

  draw() {
    for (let i = 0; i < this.points.length; i++) {
      let line = "";
      for (let j = 0; j < (this.points[i] ?? []).length; j++) {
        line = line + (this.points[i][j] ?? '.');
      }
      console.log(line)
    }
  }
}

const lines = await readAllLines("5.input");
const moves = parseMoves(lines);
task1(moves);

function parseMoves(lines: string[]): Move[] {
  return lines.map(line => {
    const [f, t] = line.split("->").map(s => s.trim());
    const [fromx, fromy] = f.split(",").map(n => parseInt(n));
    const [tox, toy] = t.split(",").map(n => parseInt(n));
    return ({ from: [fromx, fromy], to: [tox, toy] });
  })
}

function task1(moves: Move[]) {
  const d = new Diagram();
  for (const move of moves) {
    d.move(move);
    // prompt('Continue?');
  }
  console.log("Task 1:", d.countIntersections())
}
