import { readAllLines } from './line-reader.ts'

const lines = (await readAllLines("14.input"));
const rules = lines.slice(2);
const reps = Object.fromEntries(rules.map(r => r.split(" -> ")));

const pairs: Record<string, number> = {};
const counts: Record<string, number> = {};
[...lines[0]].forEach((c, i, a) => {
  counts[c] = (counts[c] ?? 0) + 1;
  if (i === 0) return;
  const pair = a[i - 1] + c;
  pairs[pair] = (pairs[pair] ?? 0) + 1;
});
let step = 0;
while (step++ < 40) {
  Object.entries(pairs).forEach(([pair, amt]) => {
    const insert = reps[pair];
    if (insert) {
      const p1 = pair[0] + insert;
      const p2 = insert + pair[1];
      pairs[pair] -= amt;
      pairs[p1] = (pairs[p1] ?? 0) + amt;
      pairs[p2] = (pairs[p2] ?? 0) + amt;
      counts[insert] = (counts[insert] ?? 0) + amt;
    }
  })
}

console.log(Math.max(...Object.values(counts)) - Math.min(...Object.values(counts)));
