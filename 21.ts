import { readAllLines } from "./line-reader.ts"

const lines = (await readAllLines("21.input"));
const pos1 = parseInt(lines[0].split(": ")[1]) - 1;
const pos2 = parseInt(lines[1].split(": ")[1]) - 1;
const bsize = 10;

task1();
task2();

function task1() {
  class DetDice {
    last = -1;
    size = 100;
    rolls = 0;
    roll(): number {
      this.rolls++;
      this.last = (this.last + 1) % this.size;
      return this.last + 1;
    }
  }

  class Player {
    score = 0;
    constructor(public pos: number) { }
    move(amt: number) {
      this.pos = (this.pos + amt) % bsize;
      this.score += this.pos + 1;
    }
  }
  const players = [
    new Player(pos1),
    new Player(pos2)
  ]
  const dice = new DetDice();
  let lose: Player;
  for (let turn = 0; ; turn = (turn + 1) % 2) {
    const p = players[turn];
    const roll = dice.roll() + dice.roll() + dice.roll();
    p.move(roll);
    if (p.score >= 1000) {
      lose = players[(turn + 1) % 2];
      break;
    }
  }
  console.log("Task 1:", lose.score * dice.rolls);
}

function task2() {
  interface State {
    p: [{
      score: number;
      pos: number;
    }, {
      score: number;
      pos: number;
    }]
    mult: number;
    turn: number;
  }

  const multipliers = new Map<number, number>();
  const stack: State[] = [{ p: [{ pos: pos1, score: 0 }, { pos: pos2, score: 0 }], turn: 0, mult: 1 }];
  const wins: [number, number] = [0, 0];

  function turn(last: State, move: number, mult: number) {
    const n: State = { p: [{ ...last.p[0] }, { ...last.p[1] }], turn: (last.turn + 1) % 2, mult: last.mult * mult };
    const p = n.p[last.turn];
    p.pos = (p.pos + move) % bsize;
    p.score = p.score + p.pos + 1;
    if (p.score >= 21) wins[last.turn] += n.mult;
    else stack.push(n);
  }

  for (const d1 of [1, 2, 3]) for (const d2 of [1, 2, 3]) for (const d3 of [1, 2, 3]) {
    const last = multipliers.get(d1 + d2 + d3) ?? 0;
    multipliers.set(d1 + d2 + d3, last + 1);
  }
  while (stack.length > 0) {
    const cur = stack.pop();
    if (!cur) continue;
    for (const [roll, mult] of multipliers.entries()) {
      turn(cur, roll, mult);
    }
  }
  console.log("Most wins", Math.max(...wins));
}
