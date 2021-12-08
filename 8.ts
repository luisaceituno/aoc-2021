import { readAllLines } from "./line-reader.ts";

function exclude(a: string[], b: string[]): string[] {
  return a.filter(c => !b.includes(c));
}

function union(a: string[], b: string[]): string[] {
  return [...new Set(a.concat(b))];
}

function equal(a: string[], b: string[]): boolean {
  return a.length === b.length && union(a, b).length === a.length;
}

function index(a: string[], b: string[][]): number {
  return b.findIndex(n => equal(a, n));
}

const lines = await readAllLines("8.input");
let sum = 0;
for (const line of lines) {
  const [inputstr, outputstr] = line.split("|").map(x => x.trim());
  const inputs = inputstr.trim().split(" ").map(i => [...i]);
  const outputs = outputstr.trim().split(" ").map(i => [...i]);

  const nums = Array<string[]>(10);
  nums[1] = inputs.find(o => o.length === 2) ?? [];
  nums[7] = inputs.find(o => o.length === 3) ?? [];
  nums[4] = inputs.find(o => o.length === 4) ?? [];
  nums[8] = inputs.find(o => o.length === 7) ?? [];
  nums[6] = inputs.find(o => o.length === 6 && exclude(o, nums[1]).length === 5) ?? [];
  nums[2] = inputs.find(o => o.length === 5 && exclude(o, nums[4]).length === 3) ?? [];
  nums[9] = inputs.find(o => o.length === 6 && exclude(o, nums[4]).length === 2) ?? [];
  nums[0] = inputs.find(o => o.length === 6 && !equal(o, nums[6]) && !equal(o, nums[9])) ?? [];
  nums[3] = inputs.find(o => o.length === 5 && union(o, nums[1]).length === 5) ?? [];
  nums[5] = inputs.find(o => o.length === 5 && !equal(o, nums[2]) && !equal(o, nums[3])) ?? [];

  sum += parseInt(outputs.map(o => "" + index(o, nums)).join(""));
}
console.log(sum)
