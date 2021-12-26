export async function readAllLines(filename: string) {
  return (await Deno.readTextFile(filename)).trim().split("\n").map(l => l.trimEnd());
}
