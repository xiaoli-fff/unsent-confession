// Unsent: The Micro-Confession Sprint — a To: line plus the unsent line.
//
// Both parts are fixed strings written at authoring time. The program only
// joins them, checks the result against the gates, and writes it out.
// Deterministic: no network, no clock, no randomness, no file reads.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Gate: whole file 1..260 characters; judge brief: message line at most 200.
const TOTAL_LIMIT = 260;
const MESSAGE_LIMIT = 200;

const ADDRESSEE = "my old piano teacher";
const UNSENT_LINE =
  "I still practice the piece you said I'd never finish, and every time I nail the hard part I wish you were in the room to hear it.";

function buildEntry(): string {
  return `To: ${ADDRESSEE}\n${UNSENT_LINE}`;
}

function fail(reason: string): never {
  throw new Error(`invalid confession: ${reason}`);
}

function checkConfession(entry: string): void {
  const total = [...entry].length;
  if (total < 1) fail("entry is empty");
  if (total > TOTAL_LIMIT) {
    fail(`entry is ${total} characters, over the ${TOTAL_LIMIT} limit`);
  }
  const parts = entry.split("\n");
  if (parts.length !== 2) {
    fail(`entry must have exactly two lines, found ${parts.length}`);
  }
  const [toLine, message] = parts;
  if (!toLine.startsWith("To: ") || toLine.trim() === "To:") {
    fail("first line must name an addressee after 'To: '");
  }
  if ([...message].length > MESSAGE_LIMIT) {
    fail(`message line is ${[...message].length} characters, over ${MESSAGE_LIMIT}`);
  }
  if (message.trim() === "") fail("message line is blank");
  for (const line of parts) {
    if (line !== line.trim()) {
      fail("a line has leading or trailing whitespace");
    }
    if (line.includes("\t")) {
      fail("a line contains a tab character");
    }
  }
  if (entry.endsWith("\n")) {
    fail("entry must not end with a newline");
  }
}

const entry = buildEntry();
checkConfession(entry);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), entry, "utf8");
console.log(
  `wrote ${[...entry].length}-character confession to ${join(outDir, "entry.txt")}`,
);
