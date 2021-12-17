import { readAllLines } from './line-reader.ts'

type Package = {
  ver: number;
  type: number;
  val?: number;
  children?: Package[];
}

function parse(bits: string[]): Package {
  const p: Package = {
    ver: parseInt(bits.splice(0, 3).join(""), 2),
    type: parseInt(bits.splice(0, 3).join(""), 2)
  }
  if (p.type === 4) {
    p.val = parseLit(bits);
  } else {
    p.children = parseOp(bits);
  }
  return p;
}

function parseLit(bits: string[]): number {
  let done = false;
  let num = "";
  while (!done) {
    done = bits.shift() === "0"
    num += bits.splice(0, 4).join("");
  }
  return parseInt(num, 2);
}

function parseOp(bits: string[]): Package[] {
  const data: Package[] = [];
  if (bits.shift() === "0") {
    const length = parseInt(bits.splice(0, 15).join(""), 2);
    const target = bits.length - length;
    while (bits.length > target) {
      data.push(parse(bits));
    }
  } else {
    let length = parseInt(bits.splice(0, 11).join(""), 2)
    while (length--) {
      data.push(parse(bits));
    }
  }
  return data;
}

function sumVers(e: Package): number {
  return e.ver + (e.children ?? []).map(c => sumVers(c)).reduce((a, b) => a + b, 0);
}

function calc(e: Package): number {
  const children = (e.children ?? []).map(c => calc(c));
  switch (e.type) {
    case 0: return children.reduce((a, b) => a + b);
    case 1: return children.reduce((a, b) => a * b);
    case 2: return Math.min(...children);
    case 3: return Math.max(...children);
    case 4: return e.val || 0;
    case 5: return children[0] > children[1] ? 1 : 0;
    case 6: return children[0] < children[1] ? 1 : 0;
    case 7: return children[0] === children[1] ? 1 : 0;
  }
  return NaN;
}

const line = (await readAllLines("16.input"))[0];
const bits = [...line].flatMap(c => [...parseInt(c, 16).toString(2).padStart(4, "0")]);
const p = parse(bits);
console.log("Sum vers:", sumVers(p));
console.log("Result:", calc(p));
