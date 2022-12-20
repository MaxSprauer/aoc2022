// Copyright 2022 Max Sprauer

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";
var sleep = require("sleep");

process.chdir(__dirname);
const groups = fs
  .readFileSync(process.argv[2] ?? "input.txt", "utf8")
  .trim()
  .split("\n\n");

// Returns true, false, or undefined (keep going)
function lessThan(
  left: number | [number | [number]],
  right: number | [number | [number]]
): boolean {
  if (Number.isInteger(left) && Number.isInteger(right)) {
    // Both values are integers
    if (left < right) {
      return true;
    } else if (left > right) {
      return false;
    } else {
      return undefined;
    }
  } else if (Array.isArray(left) && Array.isArray(right)) {
    // Both values are lists
    while (left.length) {
      // console.log("left", left);
      const leftS = left.shift();
      // console.log(" -> leftS ", leftS);
      const rightS = right.shift();

      // If the right list runs out of items first, the inputs are not in the right order.
      if (rightS === undefined) return false;

      let def;
      if ((def = lessThan(leftS, rightS)) !== undefined) {
        return def;
      }
    }

    // If the left list runs out of items first, the inputs are in the right order.
    if (right.length) return true;

    // Otherwise equal length and equal numbers, continue.
    return undefined;
  } else if (Number.isInteger(left) || Number.isInteger(right)) {
    // One value is an integer and one is a list.  Turn integer into list of one.
    let def;
    if (Number.isInteger(left)) {
      if (
        (def = lessThan([left as number], right as [number | [number]])) !==
        undefined
      ) {
        return def;
      }
    } else if (Number.isInteger(right)) {
      if (
        (def = lessThan(left as [number | [number]], [right as number])) !==
        undefined
      ) {
        return def;
      }
    }
  } else {
    assert(false, left, right);
  }
}

const count = groups.reduce((prev, group, index) => {
  const lines = group.split("\n");
  const pair1 = JSON.parse(lines[0]);
  const pair2 = JSON.parse(lines[1]);

  if (lessThan(pair1, pair2)) {
    console.log(chalk.redBright("Right Order"), pair1, pair2);
    return prev + index + 1;
  } else {
    console.log(chalk.blueBright("Not Right Order"), pair1, pair2);
    return prev;
  }
}, 0);

console.log(chalk.greenBright("Part One:"), count);

/*
 * Part Two
 */

const lines = groups.flatMap((group) => group.split("\n"));
lines.unshift("[[6]]");
lines.unshift("[[2]]");
lines.sort((a, b) => {
  switch (lessThan(JSON.parse(a), JSON.parse(b))) {
    case undefined:
      return 0;
    case true:
      return -1;
    case false:
      return 1;
  }
});

const ind1 = lines.findIndex((val) => val === "[[6]]");
const ind2 = lines.findIndex((val) => val === "[[2]]");
console.log(lines);
console.log(chalk.greenBright("Part Two:"), (ind1 + 1) * (ind2 + 1));
