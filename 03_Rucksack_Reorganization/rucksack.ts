// Copyright 2022 Max Sprauer

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";

process.chdir(__dirname);
var lines = fs.readFileSync("input.txt", "utf8").trim().split("\n");

const findMatch = (sack1, sack2) => {
  for (let indexs1 = 0; indexs1 < sack1.length; indexs1++) {
    for (let indexs2 = 0; indexs2 < sack2.length; indexs2++) {
      if (sack1[indexs1] === sack2[indexs2]) {
        return sack1[indexs1];
      }
    }
  }

  assert(false);
};

const priority = (char: string) => {
  let base, offset;

  if (char.toLowerCase() === char) {
    base = "a";
    offset = 1;
  } else {
    base = "A";
    offset = 27;
  }

  return char.charCodeAt(0) - base.charCodeAt(0) + offset;
};

let priorities = lines.reduce((prev, line) => {
  const sack1 = line.substring(0, line.length / 2);
  const sack2 = line.substring(line.length / 2);
  const match = findMatch(sack1, sack2);
  return prev + priority(match);
}, 0);

console.log(chalk.magenta("Part One:"), priorities);

/*
 * Part Two
 */

const groups = [];
lines.forEach((value, index) => {
  let n = Math.floor(index / 3);
  if (groups[n] === undefined) {
    groups[n] = [];
  }

  groups[n][index % 3] = value;
});

const findMatches = (sack1, sack2) => {
  let matches = "";
  for (let indexs1 = 0; indexs1 < sack1.length; indexs1++) {
    for (let indexs2 = 0; indexs2 < sack2.length; indexs2++) {
      if (sack1[indexs1] === sack2[indexs2]) {
        if (matches.indexOf(sack1[indexs1]) === -1) {
          matches += sack1[indexs1];
        }
      }
    }
  }

  return matches;
};

const badges = groups.reduce((prev, group) => {
  const matches01 = findMatches(group[0], group[1]);
  const matches3 = findMatches(matches01, group[2]);
  assert(matches3.length === 1);
  return prev + priority(matches3);
}, 0);

console.log(chalk.magenta("Part Two:"), badges);
