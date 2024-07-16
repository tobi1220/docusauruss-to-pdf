#!/usr/bin/env node

import { makeProgram } from './command.js';

const program = makeProgram();

try {
  program.parse(process.argv);
} catch (err) {
  if (err instanceof Error) {
    if (program.opts().debug) {
      console.log(`${err.stack}`);
    }
  } else {
    throw err;
  }
  // Recommended practice for node is set exitcode not force exit
  process.exitCode = 1;
}
