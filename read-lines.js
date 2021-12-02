import { stdin, stdout } from 'process';
import { createInterface } from 'readline';

export class LineReader {

  static readAll() {
    return new Promise((resolve) => {
      const input = [];
      const reader = createInterface(stdin, stdout)
      reader.on("line", l => input.push(l));
      reader.on("close", () => resolve(input));
      console.log("Enter input; Ctrl+C to end");
    });
  }
}
