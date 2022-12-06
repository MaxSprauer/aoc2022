// Copyright 2022 Max Sprauer

import * as fs from "fs";
import chalk from "chalk";
import { range } from "lodash";
import { exit } from "process";
import { assert } from "console";

if (process.argv.length < 3) exit(1);
process.chdir(__dirname);
const line = fs.readFileSync(process.argv[2], "utf8").trim();
const LEN = 14;

for (let ii = LEN; ii < line.length; ii++) {
  let slice = line.slice(ii - LEN, ii);

  let found = range(LEN - 1).every((jj) => {
    // Lame, I know.
    const regexp = new RegExp(slice[jj], "g");
    return (slice.match(regexp) || []).length == 1;
  });

  if (found) {
    console.log(chalk.redBright("Answer:", slice, ii));
    break;
  }
}
