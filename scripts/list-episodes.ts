#!/usr/bin/env npx tsx
/**
 * List discovered episode products (episodes/ preferred over legacy videos/).
 */
import { discoverEpisodes } from '../src/engine/discoverEpisodes';

const episodes = discoverEpisodes(process.cwd());
if (episodes.length === 0) {
  console.log('No episodes found.');
  process.exit(1);
}

console.log(`Found ${episodes.length} episode(s):\n`);
for (const ep of episodes) {
  console.log(`  ${ep.slug.padEnd(32)} [${ep.root}]  ${ep.contentPath}`);
}
