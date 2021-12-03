import { LineReader } from "./read-lines.js";

function task1(lines) {
  const counts = new Array(lines[0].length).fill(0);
  for (const line of lines) {
    [...line].forEach((bit, i) => {
      if (bit === '1') {
        counts[i]++
      }
    });
  }

  const gamma = counts.map(c => (c > lines.length / 2) ? '1' : '0').join("");
  const eps = [...gamma].map(bit => bit === '0' ? '1' : '0').join("");

  console.log('Task 1:', parseInt(gamma, 2) * parseInt(eps, 2));
}

function task2(lines) {
  console.log('Task 2:', parseInt(oxygen(lines), 2) * parseInt(co2(lines), 2));
}

function oxygen(lines) {
  let cur = lines;
  for (let i = 0; i < lines[0].length; i++) {
    cur = split(cur, i).sort((a, b) => b.length - a.length)[0];
    if (cur.length === 1) {
      break
    }
  }
  return cur;
}

function co2(lines) {
  let cur = lines;
  for (let i = 0; i < lines[0].length; i++) {
    cur = split(cur, i).sort((a, b) => b.length - a.length)[1];
    if (cur.length === 1) {
      break
    }
  }
  return cur;
}

function split(lines, compareAt) {
  const ones = [];
  const zeros = [];
  for (const line of lines) {
    if (line[compareAt] === '1') {
      ones.push(line);
    } else {
      zeros.push(line);
    }
  }
  return [ones, zeros];
}

const lines = (await LineReader.readAll());
task1(lines);
task2(lines);
