// Copyright 2022 Max Sprauer

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";

if (process.argv.length < 3) exit(1);
process.chdir(__dirname);
var lines = fs.readFileSync(process.argv[2], "utf8").trim().split("\n");

const clone = (items) =>
  items.map((item) => (Array.isArray(item) ? clone(item) : item));

// I have no shame.
const stacksOrig = [
  undefined,
  ["M", "S", "J", "L", "V", "F", "N", "R"].reverse(),
  ["H", "W", "J", "F", "Z", "D", "N", "P"].reverse(),
  ["G", "D", "C", "R", "W"].reverse(),
  ["S", "B", "N"].reverse(),
  ["N", "F", "B", "C", "P", "W", "Z", "M"].reverse(),
  ["W", "M", "R", "P"].reverse(),
  ["W", "S", "L", "G", "N", "T", "R"].reverse(),
  ["V", "B", "N", "F", "H", "T", "Q"].reverse(),
  ["F", "N", "Z", "H", "M", "L"].reverse(),
];

let stacks = clone(stacksOrig);

lines.forEach((line) => {
  // move 1 from 1 to 6
  const [, count, from, to] = line.match(/move (\d+) from (\d+) to (\d+)/);

  for (let ii = 0; ii < +count; ii++) {
    let container = stacks[+from].pop();
    stacks[+to].push(container);
  }
});

const answer = stacks.map((stack) => stack?.pop());
console.log(chalk.yellowBright("Part One:"), answer.slice(1, 10).join(""));

/*
 * Part Two
 */
stacks = clone(stacksOrig);

lines.forEach((line) => {
  // move 1 from 1 to 6
  const [, count, from, to] = line.match(/move (\d+) from (\d+) to (\d+)/);

  let container = [];

  for (let ii = 0; ii < +count; ii++) {
    container.push(stacks[+from].pop());
  }

  for (let ii = 0; ii < +count; ii++) {
    stacks[+to].push(container.pop());
  }
});

const answer2 = stacks.map((stack) => stack?.pop());
console.log(chalk.blueBright("Part Two:"), answer2.slice(1, 10).join(""));
