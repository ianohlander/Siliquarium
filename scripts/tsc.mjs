#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';

// Locate global typescript library or fallback
const tscPath = 'C:\\Users\\ianoh\\AppData\\Roaming\\nvm\\v18.12.1\\node_modules\\typescript\\lib\\tsc.js';

const result = spawnSync(process.execPath, [tscPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: false
});

process.exit(result.status ?? 0);
