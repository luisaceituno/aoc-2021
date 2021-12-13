import { readAllLines } from './line-reader.ts'

const lines = (await readAllLines("13.input"));
const coords = lines.slice(0, lines.indexOf("")).map(l => l.split(",").map(n => parseInt(n)));
const instructions: [string, number][] = lines.slice(lines.indexOf("") + 1).map(i => i.split(" ")[2]).map(l => l.split("=")).map(l => [l[0], parseInt(l[1])])

const paper: boolean[][] = [];
for (const [x, y] of coords) {
  (paper[y] || (paper[y] = []))[x] = true;
}

for (const [dir, pos] of instructions) {
  for (let y = 0; y < paper.length; y++) {
    paper[y] = paper[y] || [];
    for (let x = 0; x < paper[y].length; x++) {
      if (!paper[y][x]) continue;
      if (dir === "x" && x > pos) {
        paper[y][x - 2 * Math.abs(x - pos)] = true;
      }
      if (dir === "y" && y > pos) {
        paper[y - 2 * Math.abs(y - pos)][x] = true;
      }
    }
  }
  if (dir === "y") {
    paper.splice(pos);
  } else {
    paper.forEach(l => l.splice(pos));
  }
}

console.log("Visible:", paper.map(l => l.reduce((a, b) => a + (b ? 1 : 0), 0)).reduce((a, b) => a + b));

for (let x = 0; x < paper.length; x++) {
  let l = "";
  for (let y = 0; y < paper[x].length; y++) {
    l += paper[x][y] ? "##" : "  ";
  }
  console.log(l);
}
