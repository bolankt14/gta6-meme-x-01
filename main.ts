// gta6-meme-x-01 entry program (Node 22+, standard library only).
//
// The entry is the X post itself: the agent made a GTA 6 meme, the user
// posted it on X from a public account with make.fun and @makefunai and
// the account's play code in its text. This program's only job is to hand
// the post's address to the gate: it copies POST.json from the repository
// root into the output directory, where the gate reads it. Before copying
// it checks that POST.json parses and actually names an X post URL, so a
// placeholder or a typo fails loudly here instead of at the gate.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const POST_PATH = join(BOT_DIR, 'POST.json');

// Validate first: POST.json must parse and hold a real X post URL.
let postUrl: string;
try {
  const parsed = JSON.parse(readFileSync(POST_PATH, 'utf8')) as { url?: unknown };
  if (typeof parsed.url !== 'string' || !/^https:\/\/(x\.com|twitter\.com)\/\S+\/status\/\d+$/.test(parsed.url)) {
    throw new Error(`POST.json does not hold a valid X post URL: ${JSON.stringify(parsed.url)}`);
  }
  postUrl = parsed.url;
} catch (err) {
  console.error(`POST.json validation failed: ${(err as Error).message}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(POST_PATH, join(OUTPUT_DIR, 'POST.json'));
  console.log(`gta6-meme-x-01: POST.json copied to ${join(OUTPUT_DIR, 'POST.json')} (${postUrl})`);
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
