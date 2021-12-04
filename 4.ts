import { readAllLines } from "./line-reader.ts";

class Board {
  rows: [string, boolean][][] = [];

  static fromLine(line: string, separator: string): Board {
    const board = new Board();
    board.rows = line.split(separator)
      .map(line => line.split(/\s+/).map(num => [num, false]));
    return board;
  }

  markDrawed(draw: string) {
    for (const row of this.rows) {
      for (const entry of row) {
        if (entry[0] === draw) {
          entry[1] = true;
        }
      }
    }
  }

  hasWon(): boolean {
    for (const row of this.rows) {
      if (row.every(entry => entry[1])) {
        return true;
      }
    }
    return this.rows.map(r => parseInt(r.map(entry => entry[1] ? '1' : '0').join(""), 2)).reduce((n1, n2) => n1 & n2) > 0
  }

  sumUnmarked(): number {
    return this.rows.map(
      row => row
        .map(entry => !entry[1] ? parseInt(entry[0]) : 0)
        .reduce((a, b) => a + b)
    ).reduce((a, b) => a + b);
  }
}

async function readInput(): Promise<[string[], Board[]]> {
  const lines = await readAllLines("./4.input");
  const draws = lines[0].split(",");
  const boards = parseBoards(lines.slice(2));
  return [draws, boards];
}

function parseBoards(lines: string[]): Board[] {
  return lines.join("#").split("##").map(l => Board.fromLine(l, "#"));
}

function task1(draws: string[], boards: Board[]) {
  for (const draw of draws) {
    for (const board of boards) {
      board.markDrawed(draw);
      if (board.hasWon()) {
        console.log("Task 1:", parseInt(draw) * board.sumUnmarked());
        return;
      }
    }
  }
}

function task2(draws: string[], boards: Board[]) {
  const won: Board[] = [];
  for (const draw of draws) {
    for (const board of boards) {
      board.markDrawed(draw);
      if (board.hasWon() && !won.includes(board)) {
        won.push(board)
        if (won.length === boards.length) {
          console.log("Task 2:", parseInt(draw) * board.sumUnmarked());
          return;
        }
      }
    }
  }
}

const [draws, boards] = await readInput();
task1(draws, boards);
task2(draws, boards);

