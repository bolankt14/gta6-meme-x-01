// Entry program for gta6-meme-x-01.
// The meme itself lives on X. This program only hands its address to the
// grader. It reads POST.json, checks the address really points at one
// public X post, then copies that file into the output folder.
// Run it locally like this:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const postPattern = /^https:\/\/(x\.com|twitter\.com)\/\S+\/status\/\d+$/;

function readPostUrl(botDir: string): string {
  const postPath = join(botDir, 'POST.json');
  const parsed = JSON.parse(readFileSync(postPath, 'utf8')) as { url?: unknown };
  if (typeof parsed.url !== 'string' || parsed.url.length === 0) {
    throw new Error('POST.json has no url field, or the url is empty');
  }
  if (!postPattern.test(parsed.url)) {
    throw new Error(
      `POST.json url is not a valid X post url, expected https://x.com/<user>/status/<digits>: ${parsed.url}`,
    );
  }
  return parsed.url;
}

function main(): void {
  const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const postUrl = readPostUrl(botDir);
  mkdirSync(outputDir, { recursive: true });
  const target = join(outputDir, 'POST.json');
  copyFileSync(join(botDir, 'POST.json'), target);
  console.log(`gta6-meme-x-01: POST.json copied to ${target} (${postUrl})`);
}

try {
  main();
} catch (err) {
  console.error(`gta6-meme-x-01 failed: ${(err as Error).message}`);
  process.exit(1);
}
