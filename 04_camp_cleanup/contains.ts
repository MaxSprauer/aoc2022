// Copyright 2022 Max Sprauer

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";

if (process.argv.length < 3) exit(1);
process.chdir(__dirname);
var lines = fs.readFileSync(process.argv[2], "utf8").trim().split("\n");

class Range {
  start: number;
  end: number;

  constructor(s: number, e: number) {
    this.start = s;
    this.end = e;
  }

  contains(r2: Range): boolean {
    return this.start <= r2.start && this.end >= r2.end;
  }

  overlaps(r2: Range): boolean {
    return (
      // Start of our range is in r2's range
      (this.start >= r2.start && this.start <= r2.end) ||
      // End of our range is in r2's range
      (this.end >= r2.start && this.end <= r2.end) ||
      this.contains(r2)
    );
  }
}

const contains = lines.reduce((prev, line) => {
  const m = line.match(/(\d+)-(\d+),(\d+)-(\d+)/);
  const r1 = new Range(+m[1], +m[2]); // Convert strings to ints
  const r2 = new Range(+m[3], +m[4]);

  return r1.contains(r2) || r2.contains(r1) ? prev + 1 : prev;
}, 0);

console.log(chalk.magentaBright("Part One:"), contains);

/*
 * Part Two
 */
const overlaps = lines.reduce((prev, line) => {
  const m = line.match(/(\d+)-(\d+),(\d+)-(\d+)/);
  const r1 = new Range(+m[1], +m[2]); // Convert strings to ints
  const r2 = new Range(+m[3], +m[4]);

  return r1.overlaps(r2) ? prev + 1 : prev;
}, 0);

console.log(chalk.magentaBright("Part Two:"), overlaps);
